import os

from decouple import config
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", config("DJANGO_SETTINGS_MODULE"))

app = Celery("blockbuilders")

# Configure Celery using settings from Django settings.py.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load tasks from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))