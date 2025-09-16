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
        # Returns True if all seats are booked
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())

class ShowtimeListSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    is_full = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_title",
            "show_date",
            "show_time",
            "room",
            "is_full",
            "ticket_price",
        ]
    
    def get_is_full(self, obj):
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())

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
            "poster",
            "release_date",
        ]


class ShowtimeDetailSerializer(serializers.ModelSerializer):
    movie = MovieBasicSerializer(read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    is_full = serializers.SerializerMethodField()

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
        ]
    
    def get_is_full(self, obj):
        if not obj.seats_data:
            return False
        return all(not seat_info.get("available", True) for seat_info in obj.seats_data.values())

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