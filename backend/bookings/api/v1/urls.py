from django.urls import path
from .views import (
    BookingCreateView,
    BookingDetailView,
    DownloadTicketView,
    BookingOverviewView,
    BookingSummaryView,
)

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<uuid:booking_reference>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<uuid:booking_reference>/download-ticket/', DownloadTicketView.as_view(), name='download-ticket'),
    path('bookings/overview/', BookingOverviewView.as_view(), name='booking-overview'),
    path('bookings/summary/', BookingSummaryView.as_view(), name='booking-summary'),
]