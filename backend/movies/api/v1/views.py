from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db.models import Count
from utils.base_views import BaseDetailView
from .services import (
    get_movies,
    get_movies_bygenre,
)
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from movies.models import Movie, Genre
from .serializers import (
    MovieListSerializer,
    MovieSerializer,
    GenreMovieRelatedSerializer,
    GenreSerializer,
    GenreMovieCountSerializer,
)

# NOTE: No DELETE on list views for now too dangerous
# ill add bulk delete later but maybe not here and it will be secured

# -----------------GENRE VIEWS----------------------------
# LIST view
class GenreListView(APIView):
    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # counts of movie related to the genre
        include_count = request.query_params.get('include_count', 'false').lower() == 'true'

        if include_count:
            genres = Genre.objects.annotate(movie_count=Count('movies'))
            serializer = GenreMovieCountSerializer(genres, many=True)
        else:
            genres = Genre.objects.all()
            serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# DETAIL view
class GenreDetailView(BaseDetailView):
    model = Genre
    not_found_message = "Genre not found"

    def get(self, request, pk):
        include_count = request.query_params.get('include_count', 'false').lower() == 'true'

        if include_count:
            genre = Genre.objects.annotate(movie_count=Count('movies')).filter(pk=pk).first()
            if not genre:
                raise NotFound(detail="Genre not found")
            serializer = GenreMovieCountSerializer(genre)
        else:
            genre = self.get_object(pk)
            serializer = GenreSerializer(genre)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        genre = self.get_object(pk)
        serializer = GenreSerializer(genre, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        genre = self.get_object(pk)
        serializer = GenreSerializer(genre, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        genre = self.get_object(pk)
        genre.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# CUSTOM view------------------------------------------------------------------------------------------------------
class GenreMoviesView(BaseDetailView):
    """
    API endpoint to retrieve the movies under a specific genre

    this views support optional query parameters:
    - limit (int): number of movies to return (default: 5, max: 50)
    - include_inactive (bool): include inactive movies if 'true'(default: 'false')
    - fields (str): either 'summary' or 'full' this will control the response fields detail level (default: 'summary')

    example:
        GET /api/v1/genres/3/movies?limit=10&include_inactive=true&fields=full
    """

    model = Genre
    not_found_message = "Genre not found"

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="limit",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="Max number of movies to return (default=5, max=50)"
            ),
            OpenApiParameter(
                name="include_inactive",
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description="Include inactive movies (true/false)"
            ),
            OpenApiParameter(
                name="fields",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Return mode: 'summary' or 'full'"
            ),
        ]
    )

    def get(self, request, pk):
        genre = self.get_object(pk)
        limit = int(request.query_params.get('limit', 5))
        include_inactive = request.query_params.get('include_inactive','false').lower()=='true'
        mode = request.query_params.get("fields","summary").lower()

        if mode == "full":
            movies = get_movies_bygenre(genre_id=pk, limit=limit, include_inactive=include_inactive)
            serializer = MovieSerializer(movies, many=True)
            return Response(serializer.data)
        else:
            serializer = GenreMovieRelatedSerializer(genre)
            return Response(serializer.data, status=status.HTTP_200_OK)

# -----------------MOVIE VIEWS----------------------------
# LIST view
class MovieListView(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        mode = request.query_params.get("fields","summary").lower()

        if mode == "full":
            serializer = MovieSerializer(movies, many=True)
        else:
            serializer = MovieListSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DETAIL view
class MovieDetailView(BaseDetailView):
    model = Movie
    not_found_message = "Movie not found"

    def get(self, request, pk):
        movie = self.get_object(pk)
        mode = request.query_params.get("fields","summary").lower()

        if mode == "full":
            serializer = MovieSerializer(movie)
        else:
            serializer = MovieListSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        movie = self.get_object(pk)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)