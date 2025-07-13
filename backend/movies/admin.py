from django.contrib import admin
from .models import Genre, Movie

admin.site.register(Movie)
admin.site.register(Genre)
