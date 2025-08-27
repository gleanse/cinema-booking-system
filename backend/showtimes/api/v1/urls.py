from django.urls import path
from .views import ShowtimeListView, ShowtimeDetailView


urlpatterns = [
    path('showtimes/', ShowtimeListView.as_view(), name='showtime-list'),
    path('showtimes/<int:pk>/', ShowtimeDetailView.as_view(), name='showtime-detail'),
]