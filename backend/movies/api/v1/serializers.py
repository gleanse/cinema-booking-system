from rest_framework import serializers
from movies.models import Genre, Movie

# serializer for movies with minimal details used for listing movies in genre detail
class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'title', 'age_rating']

# serializer that will use the movie list serializer which list the movies related
class GenreMovieRelatedSerializer(serializers.ModelSerializer):
    movies = MovieListSerializer(many=True, read_only=True)

    class Meta:
        model = Genre
        fields = [
            'id',
            'name',
            'description',
            'movies',
            ]

# basic serializer for genre
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id','name','description']   

# basic serializer for genre
class MovieSerializer(serializers.ModelSerializer):
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all())
    genre_detail = GenreSerializer(source='genre', read_only=True)
    age_rating_detail = serializers.CharField(
        source='get_age_rating_display',
        read_only=True,
    )

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'description',
            'genre',
            'genre_detail',
            'age_rating',
            'age_rating_detail',
            'poster',
            'duration',
            'release_date',
            'language',
            'trailer_url',
            'is_active',
            'created_at',
            'updated_at',
            ]
        read_only_fields = ['created_at','updated_at']

# NOTE: FOR V2 api 
# TODO: in v2 api try to use manytomanyfield instead of manytoone which is foreignkey because movies could have been so many genre and vice versa but in this version i think its fine for MVP which commonly in cinema where only one genre for movie but its good to use many genre in one movie and so many movies in one genre...................