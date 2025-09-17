import uuid
from django.db import models
from django.core.validators import EmailValidator
from showtimes.models import Showtime
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from xhtml2pdf import pisa
from django.utils import timezone
import os

class Booking(models.Model):
    # Payment status choices
    PAYMENT_STATUS_PENDING = 'pending'
    PAYMENT_STATUS_PAID = 'paid'
    PAYMENT_STATUS_FAILED = 'failed'
    PAYMENT_STATUS_CANCELLED = 'cancelled'
    PAYMENT_STATUS_REFUNDED = 'refunded'
    
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'Pending'),
        (PAYMENT_STATUS_PAID, 'Paid'),
        (PAYMENT_STATUS_FAILED, 'Failed'),
        (PAYMENT_STATUS_CANCELLED, 'Cancelled'),
        (PAYMENT_STATUS_REFUNDED, 'Refunded'),
    ]

    # Booking information
    booking_reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='bookings')
    
    # Customer information
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField(validators=[EmailValidator()])
    customer_phone = models.CharField(max_length=20, blank=True, null=True)
    customer_comments = models.TextField(blank=True, null=True)
    
    # Booking details
    seats = models.JSONField()  # List of seat codes: ["A1", "A2", "B5"]
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_tickets = models.PositiveIntegerField()
    
    # Payment information
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default=PAYMENT_STATUS_PENDING
    )
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    payment_gateway = models.CharField(max_length=50, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()  # Booking expiration time
    
    # QR Code for ticket validation
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    # PAYMENT GATEWAY
    xendit_invoice_id = models.CharField(max_length=100, blank=True, null=True)
    payment_expiry = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.booking_reference} - {self.customer_name}"
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Set expiration to 15 minutes from creation for pending payments
            self.expires_at = timezone.now() + timezone.timedelta(minutes=15)
        
        # Generate QR code when booking is created
        if not self.pk and not self.qr_code:
            super().save(*args, **kwargs)  # Save first to get ID
            self.generate_qr_code()
            kwargs['force_insert'] = False
        
        super().save(*args, **kwargs)
    
    def generate_qr_code(self):
        """Generate QR code with booking information"""
        qr_data = f"""
        Booking Reference: {self.booking_reference}
        Customer: {self.customer_name}
        Movie: {self.showtime.movie.title}
        Showtime: {self.showtime.show_date} {self.showtime.show_time}
        Cinema: {self.showtime.room.cinema.name}
        Room: {self.showtime.room.name}
        Seats: {', '.join(self.seats)}
        """
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code to image field
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        file_name = f'qr_{self.booking_reference}.png'
        
        self.qr_code.save(
            file_name,
            ContentFile(buffer.getvalue()),
            save=False
        )
    
    def generate_pdf_ticket(self):
        """Generate PDF ticket for download using xhtml2pdf"""
        context = {
            'booking': self,
            'showtime': self.showtime,
            'movie': self.showtime.movie,
            'cinema': self.showtime.room.cinema,
            'room': self.showtime.room,
        }
        
        html_string = render_to_string('bookings/ticket_pdf.html', context)
        
        # Generate PDF using xhtml2pdf
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html_string.encode("UTF-8")), result)
        
        if not pdf.err:
            return result.getvalue()
        return None
    
    def send_confirmation_email(self):
        """Send booking confirmation email with PDF ticket"""
        subject = f'Booking Confirmation - {self.booking_reference}'
        
        context = {
            'booking': self,
            'showtime': self.showtime,
            'movie': self.showtime.movie,
            'cinema': self.showtime.room.cinema,
        }
        
        html_message = render_to_string('bookings/email_confirmation.html', context)
        
        # Generate PDF ticket
        pdf_ticket = self.generate_pdf_ticket()
        
        if not pdf_ticket:
            print("Failed to generate PDF ticket")
            return False
        
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.customer_email],
        )
        email.content_subtype = 'html'
        
        # Attach PDF ticket
        email.attach(
            f'ticket_{self.booking_reference}.pdf',
            pdf_ticket,
            'application/pdf'
        )
        
        try:
            email.send()
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def mark_as_paid(self, payment_reference, gateway):
        """Mark booking as paid and send confirmation"""
        self.payment_status = self.PAYMENT_STATUS_PAID
        self.payment_reference = payment_reference
        self.payment_gateway = gateway
        self.payment_date = timezone.now()
        self.save()
        
        # Send confirmation email
        self.send_confirmation_email()
        
        # Update seat availability
        self.update_seat_availability()
    
    def update_seat_availability(self):
        """Update seat availability in showtime"""
        if self.payment_status == self.PAYMENT_STATUS_PAID:
            showtime = self.showtime
            seats_data = showtime.seats_data.copy()
            
            for seat in self.seats:
                if seat in seats_data:
                    seats_data[seat]['available'] = False
            
            showtime.seats_data = seats_data
            showtime.save()
    
    def cancel_booking(self):
        """Cancel booking and free up seats"""
        if self.payment_status == self.PAYMENT_STATUS_PAID:
            # Free up seats
            showtime = self.showtime
            seats_data = showtime.seats_data.copy()
            
            for seat in self.seats:
                if seat in seats_data:
                    seats_data[seat]['available'] = True
            
            showtime.seats_data = seats_data
            showtime.save()
        
        self.payment_status = self.PAYMENT_STATUS_CANCELLED
        self.save()
    
    def is_expired(self):
        """Check if booking has expired"""
        return timezone.now() > self.expires_at and self.payment_status == self.PAYMENT_STATUS_PENDING
    
    @property
    def formatted_total_amount(self):
        return f"₱{self.total_amount:,.2f}"
    
    @property
    def formatted_showtime(self):
        return f"{self.showtime.show_date} {self.showtime.show_time}"