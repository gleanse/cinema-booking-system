from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, JSONParser
from django.db.models import Count, Prefetch
from django.utils import timezone
from showtimes.models import Showtime  
from utils.base_views import BaseDetailView
from .services import (
    get_movies,
    get_movies_bygenre,
)
from movies.models import Movie, Genre
from .serializers import (
    MovieListSerializer,
    MovieSerializer,
    GenreMovieRelatedSerializer,
    GenreSerializer,
    GenreMovieCountSerializer,
)
from config.permissions import StaffUserOnly, IsSuperUser, AllowAny
from config.throttles import AdminOperationThrottle, PublicEndpointThrottle


# NOTE: No DELETE on list views for now too dangerous
# ill add bulk delete later but maybe not here and it will be secured

# -----------------GENRE VIEWS----------------------------
# LIST view
# explanation: see docs/API.md -> GENRE class views > LIST genres view endpoints
class GenreListView(APIView):
    # API endpoints LIMITATIONS
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    # API endpoints PERMISSIONS
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return[StaffUserOnly()]

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
# explanation: see docs/API.md -> GENRE class views > DETAIL genre view endpoints
class GenreDetailView(BaseDetailView):
    model = Genre
    not_found_message = "Genre not found"

    # API endpoints LIMITATIONS
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    # API endpoints PERMISSIONS
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'DELETE':
            return [IsSuperUser()]
        return[StaffUserOnly()]

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
# explanation: see docs/API.md -> GENRE class views > GENRE movies view endpoints (TODO: NEED AN UPDATE EXPLANATION)
# TODO: this view class need to refactor its working fine for now but it has a weird idk like when the detail is summary the limit seems like not working maybe because it doesnt use the service function
class GenreMoviesView(BaseDetailView):
    model = Genre
    not_found_message = "Genre not found"
    throttle_classes = [PublicEndpointThrottle]
    permission_classes = [AllowAny]
    prefetch_related_fields = ['movies']

    def get(self, request, pk):
        genre = self.get_object(pk)
        limit = int(request.query_params.get('limit', 5))
        include_inactive = request.query_params.get('include_inactive','false').lower()=='true'
        mode = request.query_params.get("detail","summary").lower()
        
        if mode == "full":
            movies = get_movies_bygenre(genre_id=pk, limit=limit, include_inactive=include_inactive)
            serializer = MovieSerializer(movies, many=True, context={'request': request})
            return Response(serializer.data)
        else:
            serializer = GenreMovieRelatedSerializer(genre, context={'request': request})
            return Response(serializer.data)

# -----------------MOVIE VIEWS----------------------------
# LIST view
# explanation: see docs/API.md -> MOVIE > LIST movies view endpoints (TODO: NEED AN UPDATE EXPLANATION)
class MovieListView(APIView):
    parser_classes = [MultiPartParser, JSONParser]

    # API endpoints LIMITATIONS
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    # API endpoints PERMISSIONS
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return[StaffUserOnly()]

    def get(self, request):
        movies = Movie.objects.select_related('genre').prefetch_related(
            Prefetch(
                'showtimes',
                queryset=Showtime.objects.filter(
                    is_active=True,
                    show_date__gte=timezone.now().date()
                ).order_by('show_date', 'show_time')
            )
        ).all()
    
        mode = request.query_params.get("detail","summary").lower()

        if mode == "full":
            serializer = MovieSerializer(movies, many=True, context={'request': request})
        else:
            serializer = MovieListSerializer(movies, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MovieSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DETAIL view
# explanation: see docs/API.md -> MOVIE > DETAIL movie view endpoints (TODO: NEED AN UPDATE EXPLANATION)
class MovieDetailView(BaseDetailView):
    model = Movie
    not_found_message = "Movie not found"
    select_related_fields = ['genre']
    parser_classes = [MultiPartParser, JSONParser]

    # API endpoints LIMITATIONS
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    # API endpoints PERMISSIONS
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'DELETE':
            return [IsSuperUser()]
        return[StaffUserOnly()]

    def get(self, request, pk):
        movie = self.get_object(pk)
        mode = request.query_params.get("detail","summary").lower()

        if mode == "full":
            serializer = MovieSerializer(movie, context={'request': request})
        else:
            serializer = MovieListSerializer(movie, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(movie, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(movie, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        movie = self.get_object(pk)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# SEARCH view
# explanation: see docs/API.md -> MOVIE > SEARCH movies view endpoint (TODO: NEED AN UPDATE EXPLANATION)
class MovieSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('search','')
        
        if query:
            movies = Movie.objects.filter(
                title__icontains=query,
                is_active=True 
            ).select_related('genre').prefetch_related(
                Prefetch(
                    'showtimes',
                    queryset=Showtime.objects.filter(
                        is_active=True,
                        show_date__gte=timezone.now().date()
                    ).order_by('show_date', 'show_time')
                )
            )
        else:
            movies = Movie.objects.filter(is_active=True).select_related('genre').prefetch_related(
                Prefetch(
                    'showtimes',
                    queryset=Showtime.objects.filter(
                        is_active=True,
                        show_date__gte=timezone.now().date()
                    ).order_by('show_date', 'show_time')
                )
            )[:20] 

        serializer = MovieListSerializer(movies, many=True, context={'request': request})
        return Response(serializer.data)