# Running Todo Redux Application on Ubuntu with Docker

This guide will help you set up and run the Todo Redux application using Docker on Ubuntu.

## Prerequisites

1. Install Docker on Ubuntu:
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Verify Docker installation
docker --version
```

Note: After adding your user to the docker group, you'll need to log out and log back in for the changes to take effect.

## Building and Running the Application

1. First, create a directory where you want to store the application:
```bash
mkdir ~/todo-app
cd ~/todo-app
```

2. Clone the repository:
```bash
# Using HTTPS
git clone https://github.com/yourusername/Todo-Redux-main.git
# OR using SSH
git clone git@github.com:yourusername/Todo-Redux-main.git

# Enter the project directory
cd Todo-Redux-main
```

Note: Replace `yourusername` with the actual GitHub username or use the complete repository URL provided to you.

3. Build the Docker image:
```bash
docker build -t todo-redux-app .
```

4. Run the container with automatic restart:
```bash
# Run container with automatic restart policy
docker run -d \
  --restart always \
  -p 3000:80 \
  --name todo-redux-container \
  todo-redux-app
```

The `--restart always` flag ensures that:
- Container automatically restarts if it crashes
- Container automatically restarts if it's stopped (unless explicitly stopped by `docker stop`)
- Container automatically starts when Docker daemon starts (system boot)

Available restart policies:
- `no`: Never automatically restart (default)
- `always`: Always restart regardless of the exit status
- `unless-stopped`: Always restart unless the container was manually stopped
- `on-failure[:max-retries]`: Restart only on failure

The application will be available at: `http://localhost:3000`

## Docker Commands Reference

### Container Management
```bash
# Stop the container
docker stop todo-redux-container

# Start the container
docker start todo-redux-container

# Restart the container
docker restart todo-redux-container

# Remove the container
docker rm -f todo-redux-container

# View container logs
docker logs todo-redux-container

# View container logs in real-time
docker logs -f todo-redux-container
```

### Image Management
```bash
# List all images
docker images

# Remove the image
docker rmi todo-redux-app

# Remove all unused images
docker image prune -a
```

### System Information
```bash
# Check Docker system information
docker info

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container resource usage
docker stats todo-redux-container
```

## Troubleshooting

1. If the port 3000 is already in use:
```bash
# Use a different port (e.g., 3001)
docker run -d -p 3001:80 --name todo-redux-container todo-redux-app
```

2. If you can't access the application:
```bash
# Check if the container is running
docker ps

# Check container logs for errors
docker logs todo-redux-container

# Check if the port is correctly mapped
sudo netstat -tulpn | grep 3000
```

3. If you get permission errors:
```bash
# Make sure you're in the docker group
groups

# If not in docker group, run:
sudo usermod -aG docker $USER
# Then log out and log back in
```

## Cleaning Up

To completely remove the application and its resources:

```bash
# Stop and remove the container
docker rm -f todo-redux-container

# Remove the image
docker rmi todo-redux-app

# Remove unused resources (optional)
docker system prune
```

## Environment Variables (Optional)

If you need to configure environment variables:

```bash
docker run -d \
  -p 3000:80 \
  -e REACT_APP_API_URL=http://api.example.com \
  --name todo-redux-container \
  todo-redux-app
```

## Production Considerations

1. Use a reverse proxy (like Nginx) for SSL termination
2. Set up proper monitoring and logging
3. Restart policies for high availability:
```bash
# For production, 'unless-stopped' is recommended
docker run -d \
  --restart unless-stopped \
  -p 3000:80 \
  --name todo-redux-container \
  todo-redux-app

# For development, 'always' policy works well
docker run -d \
  --restart always \
  -p 3000:80 \
  --name todo-redux-container \
  todo-redux-app
```

## Security Best Practices

1. Keep Docker and base images updated
2. Run regular security scans:
```bash
# Install trivy scanner
sudo apt install trivy

# Scan the image
trivy image todo-redux-app
```

3. Use non-root user in container (already configured in our Dockerfile)
4. Implement resource limits:
```bash
docker run -d \
  --memory="512m" \
  --cpus="0.5" \
  -p 3000:80 \
  --name todo-redux-container \
  todo-redux-app
```

For any issues or questions, please open an issue in the repository.

## Using Docker Compose

### Prerequisites
1. Install Docker Compose:
```bash
# Install Docker Compose
sudo apt update
sudo apt install -y docker-compose-plugin

# Verify installation
docker compose version
```

### Running with Docker Compose

1. Start the application:
```bash
# Start in detached mode
docker compose up -d

# View logs
docker compose logs -f
```

2. Stop the application:
```bash
# Stop containers
docker compose down

# Stop containers and remove volumes
docker compose down -v

# Stop containers and remove images
docker compose down --rmi all
```

3. Other useful commands:
```bash
# Rebuild the image
docker compose build

# Restart services
docker compose restart

# View service status
docker compose ps

# View resource usage
docker compose top
```

4. Scaling (if needed):
```bash
# Scale to multiple instances (if configured for scaling)
docker compose up -d --scale todo-app=3
```

The Docker Compose configuration includes:
- Automatic container restart
- Resource limits (CPU and memory)
- Health checks
- Log rotation
- Production environment settings

To modify environment variables, create a `.env` file:
```bash
# .env
NODE_ENV=production
REACT_APP_API_URL=http://api.example.com
``` 