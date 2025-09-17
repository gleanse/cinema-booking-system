from django.core.management.base import BaseCommand
from django.utils import timezone
from bookings.models import Booking

class Command(BaseCommand):
    help = 'Clean up expired pending bookings and free up seats'
    
    def handle(self, *args, **options):
        expired_bookings = Booking.objects.filter(
            payment_status=Booking.PAYMENT_STATUS_PENDING,
            expires_at__lt=timezone.now()
        )
        
        count = expired_bookings.count()
        
        for booking in expired_bookings:
            booking.payment_status = Booking.PAYMENT_STATUS_CANCELLED
            booking.save()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully cleaned up {count} expired bookings')
        )