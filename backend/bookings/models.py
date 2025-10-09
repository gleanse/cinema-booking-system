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

class Booking(models.Model):
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

    PAYMENT_METHOD_CREDIT_CARD = 'credit_card'
    PAYMENT_METHOD_DEBIT_CARD = 'debit_card'
    PAYMENT_METHOD_EWALLET = 'ewallet'
    PAYMENT_METHOD_BANK_TRANSFER = 'bank_transfer'
    
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_METHOD_CREDIT_CARD, 'Credit Card'),
        (PAYMENT_METHOD_DEBIT_CARD, 'Debit Card'),
        (PAYMENT_METHOD_EWALLET, 'E-Wallet'),
        (PAYMENT_METHOD_BANK_TRANSFER, 'Bank Transfer'),
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
        default=PAYMENT_STATUS_PAID
    )
    payment_reference = models.CharField(max_length=100, unique=True, blank=True, null=True)
    payment_gateway = models.CharField(max_length=50, default='mock_payment_gateway')
    payment_method = models.CharField(
        max_length=20, 
        choices=PAYMENT_METHOD_CHOICES, 
        default=PAYMENT_METHOD_CREDIT_CARD
    )
    payment_date = models.DateTimeField(auto_now_add=True)  # auto-set to now
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(blank=True, null=True)  # made optional since payments are instant
    
    # QR Code for ticket validation
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.booking_reference} - {self.customer_name}"
    
    def _generate_payment_reference(self):
        """Generate a unique, stable payment reference for this booking"""
        return f"MOCK_{self.booking_reference.hex[:16].upper()}"
    
    def save(self, *args, **kwargs):
        # generate stable payment reference only once when booking is created
        if not self.pk and not self.payment_reference:
            self.payment_reference = self._generate_payment_reference()
        
        # auto-set payment status to paid for new bookings
        if not self.pk and self.payment_status == self.PAYMENT_STATUS_PENDING:
            self.payment_status = self.PAYMENT_STATUS_PAID
        
        # generate qr code when booking is created
        if not self.pk and not self.qr_code:
            super().save(*args, **kwargs)
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
        Payment Reference: {self.payment_reference}
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
            'payment_reference': self.payment_reference,
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
    
    def process_payment(self, payment_method=None):
        """
        Mock payment processing - automatically successful
        Returns payment response similar to real gateway
        """
        if payment_method:
            self.payment_method = payment_method
        
        # ensure payment reference is set and stable
        if not self.payment_reference:
            self.payment_reference = self._generate_payment_reference()
        
        # auto-mark as paid with stable reference
        self.payment_status = self.PAYMENT_STATUS_PAID
        self.payment_gateway = 'mock_payment_gateway'
        self.save()
        
        # send confirmation email
        self.send_confirmation_email()
        
        # update seat availability
        self.update_seat_availability()
        
        # return mock payment response
        return {
            'success': True,
            'payment_reference': self.payment_reference,  # this will always be the same
            'status': 'PAID',
            'gateway': 'mock_payment_gateway',
            'paid_at': self.payment_date.isoformat() if self.payment_date else timezone.now().isoformat(),
            'message': 'Payment processed successfully',
            'booking_reference': str(self.booking_reference)
        }
    
    def mark_as_paid(self, payment_reference=None, gateway='mock_payment_gateway'):
        """Mark booking as paid and send confirmation"""
        # use existing payment reference or generate stable one
        if payment_reference:
            self.payment_reference = payment_reference
        elif not self.payment_reference:
            self.payment_reference = self._generate_payment_reference()
            
        self.payment_status = self.PAYMENT_STATUS_PAID
        self.payment_gateway = gateway
        self.payment_date = timezone.now()
        self.save()
        
        # Send confirmation email
        self.send_confirmation_email()
        
        # Update seat availability
        self.update_seat_availability()
        
        return True
    
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
        """Check if booking has expired - now less relevant since payments are instant"""
        return False  # payments are instant now, so no expiration for paid bookings
    
    @property
    def formatted_total_amount(self):
        return f"₱{self.total_amount:,.2f}"
    
    @property
    def formatted_showtime(self):
        return f"{self.showtime.show_date} {self.showtime.show_time}"
    
    @property
    def is_paid(self):
        """Check if booking is paid"""
        return self.payment_status == self.PAYMENT_STATUS_PAID
    
    @classmethod
    def create_booking(cls, **kwargs):
        """
        Create a new booking with automatic payment processing
        """
        booking = cls(**kwargs)
        
        # generate stable payment reference before saving
        if not booking.payment_reference:
            booking.payment_reference = booking._generate_payment_reference()
            
        booking.save()
        
        # auto-process payment
        payment_result = booking.process_payment()
        
        return booking, payment_result