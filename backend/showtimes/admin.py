from django.contrib import admin
from showtimes.models import Showtime, Cinema, ScreeningRoom

admin.site.register(Showtime)
admin.site.register(Cinema)
admin.site.register(ScreeningRoom)
