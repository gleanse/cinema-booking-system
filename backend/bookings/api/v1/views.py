from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from bookings.models import Booking
from bookings.api.v1.serializers import BookingSerializer, PaymentSerializer
from showtimes.models import Showtime
from config.permissions import AllowAny
from config.throttles import PublicEndpointThrottle
from django.http import HttpResponse
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO

# XENDIT
from bookings.xendit_service import create_invoice
from bookings.xendit_utils import verify_xendit_signature  # ADD THIS IMPORT
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import xendit

class BookingCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle]
    
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        
        if serializer.is_valid():
            # CALCULATE TOTAL AMOUNT
            showtime = serializer.validated_data['showtime']
            seats = serializer.validated_data['seats']
            total_amount = showtime.ticket_price * len(seats)
            
            # create booking
            booking = Booking(
                **serializer.validated_data,
                total_amount=total_amount,
                number_of_tickets=len(seats)
            )
            booking.save()
            
            response_serializer = BookingSerializer(booking)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingDetailView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle]
    
    def get(self, request, booking_reference):
        try:
            booking = Booking.objects.get(booking_reference=booking_reference)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND
            )

class PaymentConfirmationView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle]
    
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                booking = Booking.objects.get(
                    booking_reference=serializer.validated_data['booking_reference']
                )
                
                # mark as paid
                booking.mark_as_paid(
                    payment_reference=serializer.validated_data['payment_reference'],
                    gateway=serializer.validated_data['payment_gateway']
                )
                
                response_serializer = BookingSerializer(booking)
                return Response(response_serializer.data)
                
            except Booking.DoesNotExist:
                return Response(
                    {"error": "Booking not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DownloadTicketView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle]
    
    def get(self, request, booking_reference):
        try:
            booking = Booking.objects.get(booking_reference=booking_reference)
            
            if booking.payment_status != Booking.PAYMENT_STATUS_PAID:
                return Response(
                    {"error": "Ticket not available for unpaid bookings."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # generate pdf using xhtml2pdf
            context = {
                'booking': booking,
                'showtime': booking.showtime,
                'movie': booking.showtime.movie,
                'cinema': booking.showtime.room.cinema,
                'room': booking.showtime.room,
            }
            
            html_string = render_to_string('bookings/ticket_pdf.html', context)
            
            result = BytesIO()
            pdf = pisa.pisaDocument(BytesIO(html_string.encode("UTF-8")), result)
            
            if not pdf.err:
                response = HttpResponse(result.getvalue(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="ticket_{booking_reference}.pdf"'
                return response
            else:
                return Response(
                    {"error": "Failed to generate PDF ticket."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND
            )


# NOTE: IGNORE thsi for now
class CreateXenditInvoiceView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            booking_reference = request.data.get('booking_reference')
            booking = Booking.objects.get(booking_reference=booking_reference)
            invoice = create_invoice(booking)
            booking.xendit_invoice_id = invoice.id
            booking.save()
            
            return Response({
                'invoice_url': invoice.invoice_url,
                'expiry_date': invoice.expiry_date
            })
            
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )


@csrf_exempt
def xendit_webhook(request):
    if request.method == 'POST':
        try:
            webhook_data = json.loads(request.body)
            xendit_signature = request.headers.get('x-callback-token')
            if not verify_xendit_signature(xendit_signature, request.body):
                return JsonResponse({'status': 'invalid signature'}, status=400)
            external_id = webhook_data['external_id']
            booking_reference = external_id.replace('booking_', '')
            try:
                booking = Booking.objects.get(booking_reference=booking_reference)
            except Booking.DoesNotExist:
                return JsonResponse({'status': 'booking not found'}, status=404)
            if webhook_data['status'] == 'PAID':
                booking.payment_status = Booking.PAYMENT_STATUS_PAID
                booking.payment_reference = webhook_data['id']
                booking.payment_gateway = 'xendit'
                booking.payment_date = timezone.now()
                booking.save()
                booking.send_confirmation_email()
                booking.update_seat_availability()
                
            elif webhook_data['status'] == 'EXPIRED':
                booking.payment_status = Booking.PAYMENT_STATUS_FAILED
                booking.save()
                
            return JsonResponse({'status': 'success'})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)