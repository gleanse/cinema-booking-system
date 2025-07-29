from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound  

from movies.models import Movie, Genre
from .serializers import (
    MovieListSerializer,
    MovieSerializer,
    GenreMovieRelatedSerializer,
    GenreSerializer,
)

class GenreListView(APIView):
    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieListView(APIView):
    # show all fields of each movie in list of movies
    def get(self, request):
        movies = Movie.objects.all()
        mode = request.query_params.get("fields")

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


class MovieDetailView(APIView):
    def get_object(self, pk):
        try:
            movie = Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise NotFound(detail="Movie not found")
        return movie
    
    def get(self, request, pk):
        movie = self.get_object(pk)
        mode = request.query_params.get("fields")

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