from django.urls import path
from .views import (
    BookingCreateView,
    BookingDetailView,
    PaymentConfirmationView,
    DownloadTicketView,
    CreateXenditInvoiceView,
    xendit_webhook,
)

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<uuid:booking_reference>/', BookingDetailView.as_view(), name='booking-detail'),
    path('payments/confirm/', PaymentConfirmationView.as_view(), name='payment-confirm'),
    path('bookings/<uuid:booking_reference>/download-ticket/', DownloadTicketView.as_view(), name='download-ticket'),
    path('xendit/create-invoice/', CreateXenditInvoiceView.as_view(), name='xendit-create-invoice'),
    path('webhooks/xendit/', xendit_webhook, name='xendit-webhook'),
]