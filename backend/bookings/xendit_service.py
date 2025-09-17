import xendit
from django.conf import settings

# Initialize Xendit
xendit_instance = xendit.Xendit(api_key=settings.XENDIT_SECRET_KEY)

def create_invoice(booking_data):
    """Create Xendit invoice for a booking"""
    try:
        invoice = xendit_instance.Invoice.create({
            'external_id': f'booking_{booking_data.booking_reference}',
            'amount': float(booking_data.total_amount),
            'description': f'Movie tickets for {booking_data.showtime.movie.title}',
            'invoice_duration': 86400,  # 24 hours expiration
            'customer': {
                'given_names': booking_data.customer_name,
                'email': booking_data.customer_email,
                'mobile_number': booking_data.customer_phone or ''
            },
            'success_redirect_url': f'{settings.FRONTEND_URL}/booking-success',
            'failure_redirect_url': f'{settings.FRONTEND_URL}/booking-failed'
        })
        return invoice
    except Exception as e:
        raise Exception(f'Xendit invoice creation failed: {str(e)}')