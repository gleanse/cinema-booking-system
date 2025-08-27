from rest_framework import serializers
from showtimes.models import Showtime
from movies.api.v1.serializers import MovieListSerializer

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

class ShowtimeDetailSerializer(serializers.ModelSerializer):
    movie = MovieListSerializer(read_only=True)
    
    class Meta:
        model = Showtime
        fields = '__all__'