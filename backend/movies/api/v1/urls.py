from django.urls import path
from .views import (
    MovieListView, 
    MovieDetailView,
    GenreListView, 
    GenreDetailView,
    GenreMoviesView,
    )

urlpatterns = [
    path('movies/',MovieListView.as_view(), name='movie-list'),
    path('movies/<int:pk>/',MovieDetailView.as_view(), name='movie-detail'),
    path('genres/',GenreListView.as_view(), name='genre-list'),
    path('genres/<int:pk>/',GenreDetailView.as_view(), name='genre-detail'),
    path('genres/<int:pk>/movies/',GenreMoviesView.as_view(), name='genre-movie'),
]