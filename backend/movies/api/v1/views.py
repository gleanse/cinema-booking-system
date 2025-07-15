from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from movies.models import Movie, Genre
from .serializers import (
    MovieListSerializer,
    MovieSerializer,
    GenreMovieRelatedSerializer,
    GenreSerializer,
)


class MovieList(APIView):
        def get(self, request):
                movies = Movie.objects.all()
                serializer = MovieSerializer(movies, many=True)
                return Response(serializer.data)
        
        def post(self, request):
                serializer = MovieSerializer(data=request.data)
                if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)