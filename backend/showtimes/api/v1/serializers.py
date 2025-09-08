from rest_framework import serializers
from showtimes.models import Showtime, ScreeningRoom, Cinema
from movies.models import Movie
from movies.api.v1.serializers import GenreSerializer


class ScreeningRoomSerializer(serializers.ModelSerializer):
    cinema_name = serializers.CharField(source="cinema.name", read_only=True)

    class Meta:
        model = ScreeningRoom
        fields = [
            "id", 
            "name", 
            "capacity", 
            "cinema",
            "cinema_name",
        ]

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    room = ScreeningRoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=ScreeningRoom.objects.all(),
        source="room",
        write_only=True
    )

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
            "ticket_price",
            "is_active",
        ]

class ShowtimeListSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    room = ScreeningRoomSerializer(read_only=True)

    class Meta:
        model = Showtime
        fields = [
            "id",
            "movie_title",
            "show_date",
            "show_time",
            "room",
            "ticket_price",
        ]

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
        ]

class CinemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cinema
        fields = [
            "id",
            "name",
            "location",
            "created_at",
            "updated_at",
        ]

class CinemaDetailSerializer(serializers.ModelSerializer):
    screening_rooms = ScreeningRoomSerializer(many=True, read_only=True, source="rooms")

    class Meta:
        model = Cinema
        fields = [
            "id",
            "name",
            "location",
            "created_at",
            "updated_at",
            "screening_rooms",
        ]