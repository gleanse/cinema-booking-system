from django.db import models
from movies.models import Movie

class Showtime(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='showtimes'
    )
    show_date = models.DateField()
    show_time = models.TimeField()
    theater_name = models.CharField(max_length=100, default="Main Theater")
    available_seats = models.PositiveIntegerField(default=100)
    ticket_price = models.DecimalField(max_digits=8, decimal_places=2, default=150.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['show_date', 'show_time']
        unique_together = ['movie', 'show_date', 'show_time', 'theater_name']
        indexes = [
            models.Index(fields=['show_date', 'show_time']),
            models.Index(fields=['movie', 'show_date']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.movie.title} - {self.show_date} {self.show_time}"