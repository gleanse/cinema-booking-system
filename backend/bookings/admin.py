from django.contrib import admin
from bookings.models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_reference',
        'customer_name',
        'customer_email',
        'showtime',
        'payment_status',
        'total_amount',
        'created_at',
    ]
    list_filter = ['payment_status', 'created_at', 'showtime__movie']
    search_fields = ['booking_reference', 'customer_name', 'customer_email']
    readonly_fields = ['booking_reference', 'created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'showtime',
            'showtime__movie',
            'showtime__room',
            'showtime__room__cinema'
        )