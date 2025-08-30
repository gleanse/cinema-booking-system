from rest_framework import serializers
from movies.models import Genre, Movie

# minimall GENRE fields
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id','name','description']   

# minimal MOVIE fields
class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'genre',
            'age_rating',
            'poster',
        ]


# GENRE with its related movies (minimal movie fields too)
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


# MOVIE including all fields (usually used in details but can be use by list too so basically its the normal full fields)
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

# minimal fields of GENRE including the count of related movies
class GenreMovieCountSerializer(serializers.ModelSerializer):
    movie_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Genre
        fields = [
            'id',
            'name',
            'description',
            'movie_count',
        ]

# NOTE: FOR V2 api 
# TODO: in v2 api try to use manytomanyfield instead of manytoone which is foreignkey because movies could have been so many genre and vice versa but in this version i think its fine for MVP which commonly in cinema where only one genre for movie but its good to use many genre in one movie and so many movies in one genre...................