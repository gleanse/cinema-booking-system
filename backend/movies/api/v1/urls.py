from django.urls import path
from .views import (
    MovieListView, 
    MovieDetailView,
    MovieSearchView,
    GenreListView, 
    GenreDetailView,
    GenreMoviesView,
    )

urlpatterns = [
    # MOVIES endpoints
    # explanation: see docs/API.md -> MOVIE class views > LIST movies view endpoints
    path('movies/',MovieListView.as_view(), name='movie-list'),
    # explanation: see docs/API.md -> MOVIE class views > DETAIL movie view endpoints
    path('movies/<int:pk>/',MovieDetailView.as_view(), name='movie-detail'),
    # explanation: see docs/API.md -> MOVIE class views > SEARCH movies view endpoint
    path('movies/search/', MovieSearchView.as_view(), name='movie-search'),

    # GENRES endpoints
    # explanation: see docs/API.md -> GENRE class views > LIST genres view endpoints
    path('genres/',GenreListView.as_view(), name='genre-list'),
    # explanation: see docs/API.md -> GENRE class views > DETAIL genre view endpoints
    path('genres/<int:pk>/',GenreDetailView.as_view(), name='genre-detail'),
    # explanation: see docs/API.md -> GENRE class views > GENRE movies view endpoints
    path('genres/<int:pk>/movies/',GenreMoviesView.as_view(), name='genre-movie'),
]