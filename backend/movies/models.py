from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=70, unique=True)
    description = models.TextField(max_length=1500)

    def __str__(self):
        return self.name


class Movie(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(max_length=2000)
    genre = models.ForeignKey(
        Genre,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='movies',
    )

    class RatingChoices(models.TextChoices):
        G = "G", "General Audience"
        PG = "PG", "Parental Guidance"
        R13 = "R13", "Restricted 13"
        R18 = "R18", "Restricted 18"

    age_rating = models.CharField(max_length=4, choices=RatingChoices.choices, default=RatingChoices.PG)
    poster = models.ImageField(upload_to='movie_posters/',  height_field='poster_height', width_field='poster_width', blank=True, null=True)
    poster_height =  models.PositiveIntegerField(editable=False, null=True, blank=True)
    poster_width =  models.PositiveIntegerField(editable=False, null=True, blank=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    release_date = models.DateField() # for preperation when to show this movies as available
    language = models.CharField(max_length=50, default="English")
    trailer_url = models.URLField(blank=True,null=True)
    is_active = models.BooleanField(default=True) # this is incase instead of deleting the movie just make it inactive so it will be hided in movies list as old and inactive cant choose anymore 
    # for AUDIT LOGS
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.genre} rated {self.age_rating}"
    
    class Meta:
        ordering = ['-release_date', 'title']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['release_date']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_active', 'release_date']),
        ]
    

# NOTE: maybe add director or cast field in movie maybe in next version but for now ill minimize it temporary
# and also im planning to make the foreignkey of genre field of my models movies from foreign key to manytomany field but maybe its better to move it on v2 of the api
# just incase i forgot the workarounds for versioning api that involves of modification of the models just declared a copy of same fields and ignore the fields based on version on each serializers of version api like theres own copy field version each api version