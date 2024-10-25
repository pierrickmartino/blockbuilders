from .base import *

# Email
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Media and Static files
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "../", "mediafiles")
STATIC_URL = "static/"
# STATIC_ROOT = os.path.join(BASE_DIR, "../", "staticfiles")
STATIC_ROOT = '/code/staticfiles/'

# Allows all origins to access your API (for development only)
CORS_ALLOW_ALL_ORIGINS = True