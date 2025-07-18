from django.urls import path
from .views import MovieList, GenreList

urlpatterns = [
    path('movies/',MovieList.as_view(), name='movie-list'),
    path('genres/',GenreList.as_view(), name='genre-list'),
]