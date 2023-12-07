# Use the official Python image as a base image
FROM python:3.8-slim

# Set the working directory to /app
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Install Tesseract
RUN apt-get update && \ 
    apt-get install -y tesseract-ocr && \
    tesseract --version && \
    echo $PATH

# Expose the port that your Flask app will run on
EXPOSE 5000

# Set the Tesseract environment variable
ENV TESSDATA_PREFIX /usr/local/Cellar/tesseract/5.3.3/share



# Start the Flask app
CMD ["python3", "app.py"]
