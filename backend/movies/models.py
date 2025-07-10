from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=70, unique=True)
    description = models.TextField(max_length=1500)

    def __str__(self):
        return self.name



class Movie(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=2000)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True)

    class RatingChoices(models.TextChoices):
        G = "G", "General Audience"
        PG = "PG", "Parental Guidance"
        R13 = "R13", "Restricted 13"
        R18 = "R18", "Restricted 18"

    age_rating = models.CharField(max_length=4, choices=RatingChoices.choices, default=RatingChoices.PG)


# NOTE: WIP unfinished modeling still planning and designing database schema, also ill put meta class and __str__ method 