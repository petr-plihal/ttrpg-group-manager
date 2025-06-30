# Multi-stage build for smaller production image
FROM python:3.10-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir --user -r /tmp/requirements.txt


# Production stage
FROM python:3.10-slim

# Install only runtime MySQL client library
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Set the working directory
WORKDIR /app

# Set environment variables 
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH=/root/.local/bin:$PATH

# Copy Django project
COPY . /app/

# Expose the Django port
EXPOSE 8000
 
# Run Django's development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]