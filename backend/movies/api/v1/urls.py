from django.urls import path
from .views import MovieListView, GenreListView, MovieDetailView

urlpatterns = [
    path('movies/',MovieListView.as_view(), name='movie-list'),
    path('movies/<int:pk>/',MovieDetailView.as_view(), name='movie-detail'),
    path('genres/',GenreListView.as_view(), name='genre-list'),
]