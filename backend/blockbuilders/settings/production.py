from .base import *

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "'smtp.gmail.com'"
EMAIL_PORT = 587
EMAIL_HOST_USER = config("EMAIL_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_PASSWORD")
EMAIL_USE_TLS = True

# Redis Cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": config("REDIS_BACKEND"),
    },
}

# Media and Static files
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "../", "mediafiles")
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "../", "staticfiles")


CSRF_TRUSTED_ORIGINS = [
    'https://app.blockbuilders.tech',
    'http://app.blockbuilders.tech',
]

CSRF_COOKIE_SECURE = True  # Ensure this matches your use of HTTPS