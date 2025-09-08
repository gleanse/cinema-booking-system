from django.db import models
from movies.models import Movie


class Cinema(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class ScreeningRoom(models.Model):
    cinema = models.ForeignKey(
        Cinema,
        on_delete=models.CASCADE,
        related_name="rooms"
    )
    name = models.CharField(max_length=50)
    capacity = models.PositiveIntegerField(default=100)

    def __str__(self):
        return f"{self.cinema.name} - {self.name}"


class Showtime(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="showtimes"
    )
    room = models.ForeignKey(
        ScreeningRoom,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="showtimes",
    )
    show_date = models.DateField()
    show_time = models.TimeField()
    ticket_price = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["show_date", "show_time"]
        unique_together = ["movie", "room", "show_date", "show_time"]

    def __str__(self):
        return f"{self.movie.title} @ {self.room} - {self.show_date} {self.show_time}"
