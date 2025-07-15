from django.urls import path
from .views import MovieList

urlpatterns = [
    path('movies/',MovieList.as_view(), name='movie-list')
]