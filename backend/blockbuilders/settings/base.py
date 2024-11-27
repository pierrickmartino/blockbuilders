"""
Django settings for blockbuilders project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from datetime import timedelta
import os
from pathlib import Path
from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")
POLYGONSCAN_API_KEY = config("POLYGONSCAN_API_KEY")
POLYGONSCAN_SECRET_KEY = config("POLYGONSCAN_SECRET_KEY")
ARBISCAN_API_KEY = config("ARBISCAN_API_KEY")
OPTIMISM_API_KEY = config("OPTIMISM_API_KEY")
BSCSCAN_API_KEY = config("BSCSCAN_API_KEY")
CCOMPARE_API_KEY = config("CCOMPARE_API_KEY")


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=False, cast=bool)

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS").split(",")

INTERNAL_IPS = [
    "127.0.0.1",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost",
    "http://localhost:3030",
    "http://127.0.0.1",
    "http://127.0.0.1:3030",
    "http://0.0.0.0",
    "http://app.blockbuilders.tech",
]

CSRF_TRUSTED_ORIGINS = ["http://localhost/", "http://0.0.0.0/", "http://127.0.0.1/", "http://app.blockbuilders.tech/"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "debug_toolbar",
    "blockbuilders",
    "app",
    "celery",
    "django_prometheus",
    "rest_framework",
    # "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    # "rest_framework_api_key",
    "django_filters",
    "channels",
    "corsheaders",
    "djoser",
]

MIDDLEWARE = [
    # 'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

MIDDLEWARE = (
    ["django_prometheus.middleware.PrometheusBeforeMiddleware"]
    + MIDDLEWARE
    + ["django_prometheus.middleware.PrometheusAfterMiddleware"]
)

ROOT_URLCONF = "blockbuilders.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "blockbuilders.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USERNAME"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOSTNAME"),
        "PORT": config("DB_PORT", cast=int),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

# MEDIA_URL = "media/"
# MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")

STATIC_URL = "static/"
# STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "app/static"),
# ]

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Celery
CELERY_BROKER_URL = config("CELERY_BROKER_URL")
CELERY_RESULT_BACKEND = config("REDIS_BACKEND")

# Login & Logout URLs
LOGIN_URL = "/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/login/"

# Logging
# https://docs.djangoproject.com/en/4.2/topics/logging/
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "general.log",
            "level": "INFO",
        },
    },
    "loggers": {
        "blockbuilders": {
            "handlers": ["file"],
            "level": "INFO",
        },
    },
    "formatters": {
        "verbose": {
            "format": "{name} {levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{asctime} - {levelname} - {message}",
            "style": "{",
        },
    },
}

FIXTURE_DIRS = "fixtures/"

REST_FRAMEWORK = {
    # "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework.authentication.TokenAuthentication",),
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "app.pagination.CustomStandardPagination",
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "PAGE_SIZE": 10,
}

SIMPLE_JWT = {
  'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
  'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
  'ROTATE_REFRESH_TOKENS': True,
  'BLACKLIST_AFTER_ROTATION': True,
  'ALGORITHM': 'HS256',
  'SIGNING_KEY': SECRET_KEY,
  'AUTH_HEADER_TYPES': ('Bearer',),
}

AUTH_USER_MODEL = 'app.User'

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DJOSER = {
    "PASSWORD_RESET_CONFIRM_URL": "auth/password/reset-password-confirmation/?uid={uid}&token={token}",
    "ACTIVATION_URL": "#/activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": False,
    "SERIALIZERS": {},
    "LOGIN_FIELD": "email",
}

SITE_NAME = "Blockbuilders"
DOMAIN = 'localhost:3030'