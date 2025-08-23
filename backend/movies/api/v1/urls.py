from django.urls import path
from .views import (
    MovieListView, 
    MovieDetailView,
    GenreListView, 
    GenreDetailView,
    GenreMoviesView,
    )

urlpatterns = [
    path('movies/',MovieListView.as_view(), name='movie-list'), # GET list of movies - query_params: /?fields="full" for detailed movie list, anything else defaults to summary movie list (including /?fields="summary")
    path('movies/<int:pk>/',MovieDetailView.as_view(), name='movie-detail'), # GET single movie by ID - query_params: /?fields="full" for detailed view, anything else for summary view (/?fields="summary")
    path('genres/',GenreListView.as_view(), name='genre-list'),  # GET list of genres - query_params: /?include_count="true" for  genre list with counts of related movies tied to it, anything else (/?include_count="false")defaults to  genre list without movie related counts
    path('genres/<int:pk>/',GenreDetailView.as_view(), name='genre-detail'), # GET single genre by ID - query_params: /?include_count="true" for  genre detailed view with counts of related movies tied to it, anything else (/?include_count="false")defaults to  genre detailed view without movie related counts
    path('genres/<int:pk>/movies/',GenreMoviesView.as_view(), name='genre-movie'),
]