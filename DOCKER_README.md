# Kanban Board - Docker Setup

This document provides instructions for running the Kanban Board application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Database Console**: http://localhost:8080/h2-console

### 3. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Individual Service Commands

### Backend Only

```bash
# Build backend image
docker build -t kanban-backend ./backend/Board

# Run backend container
docker run -p 8080:8080 kanban-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -t kanban-frontend ./frontend/kanban-board-client-app

# Run frontend container
docker run -p 80:80 kanban-frontend
```

## Development Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh
```

### Rebuild Specific Service

```bash
# Rebuild backend only
docker-compose build backend

# Rebuild frontend only
docker-compose build frontend
```

## Environment Variables

### Backend Environment Variables

- `SPRING_PROFILES_ACTIVE`: Spring profile (default: docker)
- `SPRING_DATASOURCE_URL`: Database URL (default: jdbc:h2:mem:testdb)
- `SPRING_H2_CONSOLE_ENABLED`: Enable H2 console (default: true)

### Frontend Environment Variables

- `NODE_ENV`: Node environment (default: production)

## Health Checks

Both services include health checks:

- **Backend**: Checks `/actuator/health` endpoint
- **Frontend**: Checks nginx on port 80

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   lsof -i :80
   
   # Stop conflicting services
   sudo kill -9 <PID>
   ```

2. **Build Failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs <service-name>
   
   # Check container status
   docker-compose ps
   ```

### Database Access

The H2 database console is available at http://localhost:8080/h2-console with:
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: `password`

## Production Considerations

For production deployment:

1. **Use External Database**: Replace H2 with PostgreSQL or MySQL
2. **Add SSL/TLS**: Configure HTTPS for frontend
3. **Environment Variables**: Use `.env` files for configuration
4. **Logging**: Configure proper logging and monitoring
5. **Security**: Review and harden security configurations

## File Structure

```
kanban-board/
├── docker-compose.yml          # Main orchestration file
├── backend/Board/
│   ├── Dockerfile             # Backend container definition
│   └── .dockerignore          # Backend build exclusions
└── frontend/kanban-board-client-app/
    ├── Dockerfile             # Frontend container definition
    ├── nginx.conf             # Nginx configuration
    └── .dockerignore          # Frontend build exclusions
``` 