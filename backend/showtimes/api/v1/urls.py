from django.urls import path
from .views import (
    ShowtimeListView,
    ShowtimeDetailView,
    CinemaListView,
    CinemaDetailView,
    ScreeningRoomListView,
    ScreeningRoomDetailView,
)


urlpatterns = [
    path('showtimes/', ShowtimeListView.as_view(), name='showtime-list'),
    path('showtimes/<int:pk>/', ShowtimeDetailView.as_view(), name='showtime-detail'),
    path('cinemas/', CinemaListView.as_view(), name='cinema-list'),
    path('cinemas/<int:pk>/', CinemaDetailView.as_view(), name='cinema-detail'),
    path('rooms/', ScreeningRoomListView.as_view(), name='screeningroom-list'),
    path('rooms/<int:pk>/', ScreeningRoomDetailView.as_view(), name='screeningroom-detail'),
]