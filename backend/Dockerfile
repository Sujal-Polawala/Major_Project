# Use official Node.js image
FROM node:18-slim

# Install Python 3, pip, and Supervisor
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv supervisor && \
    apt-get clean

# Set working directory inside container
WORKDIR /app

# Copy all backend files
COPY . .

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Create Supervisor config
RUN mkdir -p /etc/supervisor/conf.d
RUN echo "[supervisord]\n" \
         "nodaemon=true\n\n" \
         "[program:node]\n" \
         "command=npm run server\n" \
         "directory=/app\n" \
         "autostart=true\n" \
         "autorestart=true\n\n" \
         "[program:python]\n" \
         "command=python3 app.py\n" \
         "directory=/app\n" \
         "autostart=true\n" \
         "autorestart=true\n" \
         > /etc/supervisor/conf.d/supervisord.conf

# Expose backend port
EXPOSE 5000

# Start both Node and Python using Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]