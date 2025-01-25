# dockerfile backend

# Use Python 3.10 or higher
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Expose the port Flask will run on
EXPOSE 5000

# run this add sample data script
# CMD ["sh", "-c", "python add_sample_data.py && python app.py"]

# Run the Flask application
CMD ["python", "app.py"]
