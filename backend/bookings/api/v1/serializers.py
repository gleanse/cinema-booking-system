from rest_framework import serializers
from bookings.models import Booking

class BookingSerializer(serializers.ModelSerializer):
    showtime_details = serializers.SerializerMethodField()
    qr_code_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'booking_reference',
            'showtime',
            'showtime_details',
            'customer_name',
            'customer_email',
            'customer_phone',
            'customer_comments',
            'seats',
            'total_amount',
            'number_of_tickets',
            'payment_status',
            'payment_reference',
            'payment_gateway',
            'payment_method',
            'payment_date',
            'created_at',
            'expires_at',
            'qr_code_url',
        ]
        read_only_fields = [
            'booking_reference',
            'total_amount',
            'payment_status',
            'payment_reference',
            'payment_gateway',
            'payment_method',
            'payment_date',
            'created_at',
            'expires_at',
            'qr_code_url',
        ]
    
    def get_showtime_details(self, obj):
        from showtimes.api.v1.serializers import ShowtimeDetailSerializer
        return ShowtimeDetailSerializer(obj.showtime).data
    
    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None
    
    def validate_seats(self, value):
        if not value or not isinstance(value, list):
            raise serializers.ValidationError("Seats must be a list of seat codes.")
        
        if len(value) == 0:
            raise serializers.ValidationError("At least one seat must be selected.")
        
        return value
    
    def validate(self, data):
        showtime = data.get('showtime')
        seats = data.get('seats', [])
        
        if showtime and seats:
            # check if seats are available
            available_seats = [
                seat_code for seat_code, seat_info in showtime.seats_data.items()
                if seat_info.get('available', True)
            ]
            
            unavailable_seats = [seat for seat in seats if seat not in available_seats]
            
            if unavailable_seats:
                raise serializers.ValidationError({
                    'seats': f"Seats {unavailable_seats} are not available."
                })
        
        return data