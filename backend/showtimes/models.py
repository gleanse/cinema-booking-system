from django.db import models
from movies.models import Movie
from django.core.exceptions import ValidationError
import math


class Cinema(models.Model):
    name = models.CharField(max_length=100, unique=True)
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
    seats_per_row = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.cinema.name} - {self.name}"
    
    def clean(self):
        if self.seats_per_row <= 0:
            raise ValidationError({"seats_per_row": "Seats per row must be greater than 0."})

        if self.seats_per_row > self.capacity:
            raise ValidationError({
                "seats_per_row": "Seats per row cannot exceed total capacity."
            })
        
        if self.pk:
            try:
                old = ScreeningRoom.objects.get(pk=self.pk)
                if (old.capacity != self.capacity or old.seats_per_row != self.seats_per_row):
                    if self.showtimes.exists():
                        # check if any showtime has booked seats
                        for showtime in self.showtimes.all():
                            has_booked_seats = any(
                                not seat_info.get("available", True) 
                                for seat_info in showtime.seats_data.values()
                            )
                            if has_booked_seats:
                                raise ValidationError(
                                    f"Cannot change room layout - showtime '{showtime}' has booked seats. "
                                    "Wait for all shows to complete or remove showtimes with bookings."
                                )
            except ScreeningRoom.DoesNotExist:
                pass
        
    def save(self, *args, **kwargs):
        regenerate_seat_maps = False
    
        if self.pk:
            try:
                old = ScreeningRoom.objects.get(pk=self.pk)
                if (old.capacity != self.capacity or old.seats_per_row != self.seats_per_row):
                    regenerate_seat_maps = True
            except ScreeningRoom.DoesNotExist:
                pass
        
        super().save(*args, **kwargs)
        
        # regenerate seat maps for all showtimes after saving
        if regenerate_seat_maps:
            for showtime in self.showtimes.all():
                showtime.seats_data = showtime.generate_seat_map()
                showtime.save()


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
    seats_data = models.JSONField(default=dict) # cinema room seats layout and code location, and availability status
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
    
    # generating seat maps based on capacity and seats per row for the grid
    def generate_seat_map(self):
        if not self.room:
            return {}
        
        total_seats = self.room.capacity
        seats_per_row = self.room.seats_per_row
        rows =  math.ceil(total_seats / seats_per_row)

        seat_map = {}
        seat_count = 0
        for row in range(rows):
            row_letter = chr(65 + row) # for letter codes row A, B, C ...

            for seat_number in range(1, seats_per_row + 1):
                seat_count += 1

                if seat_count > total_seats:
                    break

                seat_code = f"{row_letter}{seat_number}" # final seats codes A1, A2, A3 ...
                seat_map[seat_code] = {"available": True}
                
            if seat_count >= total_seats:
                break

        return seat_map
    

    def save(self, *args, **kwargs):
        if (not self.seats_data or len(self.seats_data) == 0) and self.room:
            self.seats_data = self.generate_seat_map()
        super().save(*args, **kwargs)
        
