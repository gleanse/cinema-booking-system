from pathlib import Path
from decouple import config, Csv
import cloudinary
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

# TODO[security]: enable production security flags
# see SECURITY_NOTES.md for details


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    'cloudinary_storage',
    'cloudinary',
    'movies',
    'users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# cache for throttling
upstash_redis_url = config('UPSTASH_REDIS_URL', default=None)

if upstash_redis_url:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': upstash_redis_url,
            'OPTIONS': {
                'CONNECTION_POOL_KWARGS': {
                    'ssl_cert_reqs': None,
                    'ssl_check_hostname': False,
                },
            }
        }
    }
else:
    # local development testing caching
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
    }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'public': '20/minute',    # 20 requests per minute for public users (per IP)
        'admin': '500/hour',     # 500 requests per hour per authenticated admin user (per user ID)
        'login': '5/minute',    # 5 times login attempts only per minute (per IP)
    }
}


if config('SQLITE_USE', default=False, cast=bool):
    # PORTABILITY (portable, SQLite works anywhere)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'cinema_booking_db.sqlite3',
        }
    }
elif config('DATABASE_URL', default=None):
    # CLOUD PRODUCTION HOSTED (supabase deployed postgreSQL database)
    DATABASES = {
        'default': dj_database_url.config(
            default=config('DATABASE_URL'),
            conn_max_age=120
        )
    }
else:
    # LOCAL DEVELOPMENT (local server postgreSQL database)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST'),
            'PORT': config('DB_PORT', cast=int),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# MEDIA STORAGE:
# true or false value that can configure on env.
USE_CLOUDINARY = config('USE_CLOUDINARY', cast=bool)

# production ready
if USE_CLOUDINARY:
    # for deployment ready storage for poster image
    # latest django storage configuration needs to be in this python dictionary with two keys for default and static files old defaultstorage was depecrated
    STORAGES = {
        'default': {
            'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }

    # cloudinary configuration for api calls
    cloudinary.config(
        cloud_name=config('CLOUDINARY_CLOUD_NAME'),
        api_key=config('CLOUDINARY_API_KEY'),
        api_secret=config('CLOUDINARY_API_SECRET'),
        secure=True
        )
    
    # cloudinary storage settings mainly for storage
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
        'API_KEY': config('CLOUDINARY_API_KEY'),
        'API_SECRET': config('CLOUDINARY_API_SECRET'),
        'SECURE': True,
        }
else:
    # for local development testing use local storage
    MEDIA_URL = config('MEDIA_URL', default='/media/')
    MEDIA_ROOT = BASE_DIR / config('MEDIA_ROOT', default='media')