from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from decouple import config

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('movies.urls'))
]


# set the DEBUG to True if the testing will be in local development 
# DEBUG False if its deploy in production server, configure DEBUG in env. file
if settings.DEBUG and not config('USE_CLOUDINARY'):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)