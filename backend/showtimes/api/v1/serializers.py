from rest_framework import serializers
from showtimes.models import Showtime
from movies.models import Movie
from movies.api.v1.serializers import GenreSerializer

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    
    class Meta:
        model = Showtime
        fields = [
            'id', 'movie', 'movie_title', 'show_date', 'show_time', 
            'theater_name', 'available_seats', 'ticket_price', 'is_active'
        ]

class ShowtimeListSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)
    
    class Meta:
        model = Showtime
        fields = ['id', 'movie_title', 'show_date', 'show_time', 'theater_name', 'ticket_price']

class MovieBasicSerializer(serializers.ModelSerializer):
    genre_detail = GenreSerializer(source='genre', read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'genre', 'genre_detail',
            'age_rating', 'poster', 'release_date'
        ]

class ShowtimeDetailSerializer(serializers.ModelSerializer):
    movie = MovieBasicSerializer(read_only=True)
    
    class Meta:
        model = Showtime
        fields = '__all__'