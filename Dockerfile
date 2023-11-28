# pull official base image
FROM python:3.11.6

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt .
RUN apt-get update -y && \
    apt-get install -y netcat-traditional && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN chmod +x /code/entrypoint.sh

# Copy the application code
COPY . .

ENTRYPOINT ["/code/entrypoint.sh"]

# Expose the port the app will run on
EXPOSE 8000