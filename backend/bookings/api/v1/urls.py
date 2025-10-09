from django.urls import path
from .views import (
    BookingCreateView,
    BookingDetailView,
    DownloadTicketView,
)

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<uuid:booking_reference>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<uuid:booking_reference>/download-ticket/', DownloadTicketView.as_view(), name='download-ticket'),
]