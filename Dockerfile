# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt requirements.txt

RUN apt-get update && \
    apt-get install -y tesseract-ocr && \
    apt-get install -y libtesseract-dev && \
    rm -rf /app/cache-directory && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . .

# Expose the server port
EXPOSE 5000

# Command to start the server
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
