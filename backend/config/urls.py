from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from decouple import config

urlpatterns = [
    path('admin/', admin.site.urls),
    # API version 1.0.0
    # MOVIES app
    path('api/v1/', include('movies.api.v1.urls')),
    # USERS app
    path('api/v1/', include('users.api.v1.urls')),
    # SHOWTIMES app
    path('api/v1/', include('showtimes.api.v1.urls')),
    # BOOKINGS app
    path('api/v1/', include('bookings.api.v1.urls')),
]


# set the DEBUG to True if the testing will be in local development 
# DEBUG False if its deploy in production server, configure DEBUG in env. file
if settings.DEBUG and not settings.USE_CLOUDINARY:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)