from rest_framework import serializers
from showtimes.models import Showtime, ScreeningRoom, Cinema
from movies.models import Movie
from movies.api.v1.serializers import GenreSerializer
from django.core.exceptions import ValidationError


class ScreeningRoomSerializer(serializers.ModelSerializer):
    cinema_name = serializers.CharField(source="cinema.name", read_only=True)

    class Meta:
        model = ScreeningRoom
        fields = [
            "id", 
            "name", 
            "capacity", 
            "seats_per_row",
            "cinema",
            "cinema_name",
        ]
    
    def validate(self, data):
        seats_per_row = data.get("seats_per_row", getattr(self.instance, "seats_per_row", None))
        capacity = data.get("capacity", getattr(self.instance, "capacity", None))

        if seats_per_row is None or capacity is None:
            return data

        if seats_per_row <= 0:
            raise serializers.ValidationError({"seats_per_row": "Seats per row must be greater than 0."})
        if seats_per_row > capacity:
            raise serializers.ValidationError({"seats_per_row": "Seats per row cannot exceed capacity."})

        return data

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_id = serializers.IntegerField(source='movie.id', read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=ScreeningRoom.objects.all(),
        source="room",
        write_only=True
    )
    is_full = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie",
            "movie_id",
            "movie_title",
            "show_date",
            "show_time",
            "room",
            "room_id",
            "seats_data",
            "is_full",
            "ticket_price",
            "is_active",
        ]
    
    def get_is_full(self, obj):
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())

    def validate(self, data):
        # get the movie duration and calculate end time
        movie = data.get('movie') or getattr(self.instance, 'movie', None)
        room = data.get('room') or getattr(self.instance, 'room', None)
        show_date = data.get('show_date') or getattr(self.instance, 'show_date', None)
        show_time = data.get('show_time') or getattr(self.instance, 'show_time', None)
        
        if not all([movie, room, show_date, show_time]):
            return data

        # calculate showtime end (start time + duration + 30min grace)
        from datetime import timedelta
        import datetime
        
        show_datetime = datetime.datetime.combine(show_date, show_time)
        end_datetime = show_datetime + timedelta(minutes=movie.duration + 30)
        
        # check for ANY showtimes in the same room on the same date
        # regardless of movie if same room, same date, check time conflicts
        existing_showtimes = Showtime.objects.filter(
            room=room,
            show_date=show_date,
            is_active=True
        ).exclude(id=getattr(self.instance, 'id', None))

        for existing_showtime in existing_showtimes:
            existing_start = datetime.datetime.combine(
                existing_showtime.show_date, 
                existing_showtime.show_time
            )
            existing_end = existing_start + timedelta(
                minutes=existing_showtime.movie.duration + 30
            )
            
            # check if time ranges overlap
            if (show_datetime < existing_end) and (end_datetime > existing_start):
                # format times beautifully (12-hour format with am/pm)
                existing_start_formatted = existing_start.strftime('%I:%M %p').lstrip('0')
                existing_end_formatted = existing_end.strftime('%I:%M %p').lstrip('0')
                
                # calculate total runtime in hours and minutes for friendly display
                total_minutes = movie.duration + 30
                hours = total_minutes // 60
                minutes = total_minutes % 60
                
                if hours > 0 and minutes > 0:
                    gap_display = f"{hours} hour{'s' if hours > 1 else ''} and {minutes} minutes"
                elif hours > 0:
                    gap_display = f"{hours} hour{'s' if hours > 1 else ''}"
                else:
                    gap_display = f"{minutes} minutes"
                
                raise serializers.ValidationError({
                    "show_time": f"This time conflicts with '{existing_showtime.movie.title}' "
                            f"({existing_start_formatted} - {existing_end_formatted}). "
                            f"Please allow at least {gap_display} between showtimes in the same room."
                })
        
        return data

class MovieBasicSerializer(serializers.ModelSerializer):
    genre_detail = GenreSerializer(source='genre', read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "genre",
            "genre_detail",
            "age_rating",
            "duration",
            "poster",
            "release_date",
        ]

class ShowtimeListSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    movie_id = serializers.IntegerField(source='movie.id', read_only=True)
    movie = MovieBasicSerializer(read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    is_full = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_id",
            "movie_title",
            "movie",
            "show_date",
            "show_time",
            "room",
            "is_full",
            "ticket_price",
            "is_active",
        ]
    
    def get_is_full(self, obj):
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())


class ShowtimeDetailSerializer(serializers.ModelSerializer):
    movie = MovieBasicSerializer(read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    is_full = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie",
            "show_date",
            "show_time",
            "ticket_price",
            "is_active",
            "created_at",
            "updated_at",
            "room",
            "seats_data",
            "is_full",
            "available_seats",
        ]
    
    def get_is_full(self, obj):
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())
    
    def get_available_seats(self, obj):
        if not obj.seats_data:
            return 0
        return sum(1 for seat_info in obj.seats_data.values() if seat_info.get("available", True))

class CinemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cinema
        fields = [
            "id",
            "name",
            "location",
        ]
    
    def validate_name(self, value):
        value = value.strip()

        if self.instance is None:
            if Cinema.objects.filter(name__iexact=value).exists():
                raise serializers.ValidationError("A cinema with this name already exists.")

        else:
            if Cinema.objects.filter(name__iexact=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A cinema with this name already exists.")
        return value

class CinemaDetailSerializer(serializers.ModelSerializer):
    screening_rooms = ScreeningRoomSerializer(many=True, read_only=True, source="rooms")

    class Meta:
        model = Cinema
        fields = [
            "id",
            "name",
            "location",
            "screening_rooms",
        ]