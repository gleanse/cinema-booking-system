from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bookings.models import Booking
from bookings.api.v1.serializers import BookingSerializer
from config.permissions import AllowAny
from config.throttles import PublicEndpointThrottle
from django.http import HttpResponse
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO
from django.db.models import Sum, Count
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

class BookingCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicEndpointThrottle]
    
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        
        if serializer.is_valid():
            showtime = serializer.validated_data['showtime']
            seats = serializer.validated_data['seats']
            total_amount = showtime.ticket_price * len(seats)
            payment_method = request.data.get('payment_method', Booking.PAYMENT_METHOD_CREDIT_CARD)
            booking, payment_result = Booking.create_booking(
                **serializer.validated_data,
                total_amount=total_amount,
                payment_method=payment_method
            )
            response_data = BookingSerializer(booking).data
            response_data.update({
                'payment_result': payment_result,
                'message': 'Booking created and payment processed successfully'
            })
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
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
        
class BookingOverviewView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # total metrics
        total_bookings = Booking.objects.count()
        total_revenue = Booking.objects.filter(
            payment_status=Booking.PAYMENT_STATUS_PAID
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # todays metrics
        today = timezone.now().date()
        today_bookings = Booking.objects.filter(created_at__date=today).count()
        today_revenue = Booking.objects.filter(
            created_at__date=today,
            payment_status=Booking.PAYMENT_STATUS_PAID
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # this months trends (daily breakdown)
        monthly_data = Booking.objects.filter(
            created_at__year=timezone.now().year,
            created_at__month=timezone.now().month
        ).values('created_at__date').annotate(
            daily_bookings=Count('id'),
            daily_revenue=Sum('total_amount')
        ).order_by('created_at__date')
        
        return Response({
            'total_bookings': total_bookings,
            'total_revenue': float(total_revenue),
            'today_bookings': today_bookings,
            'today_revenue': float(today_revenue),
            'monthly_trends': list(monthly_data)
        })

class BookingSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # payment status breakdown
        payment_stats = Booking.objects.values('payment_status').annotate(
            count=Count('id'),
            revenue=Sum('total_amount')
        )
        
        # popular movies (through showtime relationship)
        popular_movies = Booking.objects.filter(
            payment_status=Booking.PAYMENT_STATUS_PAID
        ).values(
            'showtime__movie__title'
        ).annotate(
            bookings=Count('id'),
            revenue=Sum('total_amount')
        ).order_by('-bookings')[:5]
        
        return Response({
            'payment_stats': list(payment_stats),
            'popular_movies': list(popular_movies)
        })
