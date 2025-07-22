# pull official base image
FROM python:3.11.6-slim-bullseye

ENV PIP_DEFAULT_TIMEOUT=100 \
    # Allow statements and log messages to immediately appear
    PYTHONUNBUFFERED=1 \
    # disable a pip version check to reduce run-time & log-spam
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    # cache is useless in docker image, so disable to reduce image size
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install dependencies
COPY requirements.txt /app

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y netcat-traditional && \
    pip install --upgrade pip && \
    # Install dependencies
    pip install -r requirements.txt && \
    # Clean up
    apt-get autoremove -y && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*
    
COPY . /app

# Ajoute ici tes requirements si besoin
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4001"]