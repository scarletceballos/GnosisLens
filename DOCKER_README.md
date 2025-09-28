# GnosisLens Docker Setup

This guide will help you containerize and run the GnosisLens application using Docker.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (included with Docker Desktop)
- A Gemini API key for AI functionality

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd GnosisLens-fresh
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your-actual-gemini-api-key
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

## Services

### Frontend (Next.js)
- **Port:** 3000
- **Container:** gnosislens-frontend
- **Build:** Multi-stage Docker build for optimized production image

### Backend (Node.js API)
- **Port:** 8000
- **Container:** gnosislens-backend
- **Health Check:** Built-in health monitoring
- **Dependencies:** MongoDB

### MongoDB Database
- **Port:** 27017
- **Container:** gnosislens-mongodb
- **Credentials:** admin/password123
- **Database:** gnosislens
- **Initialization:** Automatic collection and index setup

## Development Commands

### Start services in background:
```bash
docker-compose up -d
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop services:
```bash
docker-compose down
```

### Rebuild specific service:
```bash
docker-compose up --build backend
```

### Access container shell:
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongodb mongosh
```

## Production Deployment

### Environment Variables
Update the following in your production environment:
- `SESSION_SECRET`: Use a strong, random secret
- `GEMINI_API_KEY`: Your actual Gemini API key
- `MONGODB_URI`: Production MongoDB connection string
- `NODE_ENV`: Set to `production`

### Security Considerations
1. Change default MongoDB credentials
2. Use environment-specific secrets
3. Enable MongoDB authentication
4. Use HTTPS in production
5. Set up proper firewall rules

### Scaling
To scale the backend service:
```bash
docker-compose up --scale backend=3
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure ports 3000, 8000, and 27017 are available
   - Modify ports in `docker-compose.yml` if needed

2. **MongoDB connection issues:**
   - Wait for MongoDB to fully initialize (30-60 seconds)
   - Check MongoDB logs: `docker-compose logs mongodb`

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

4. **Environment variables:**
   - Ensure `.env` file exists and contains required variables
   - Check variable names match those in `docker-compose.yml`

### Health Checks
- Backend health endpoint: http://localhost:8000/api/health
- Check container status: `docker-compose ps`

## File Structure
```
GnosisLens-fresh/
├── docker-compose.yml          # Main orchestration file
├── .dockerignore              # Root dockerignore
├── env.example                # Environment template
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── .dockerignore          # Backend dockerignore
│   └── init-mongo.js          # MongoDB initialization
├── frontend/
│   ├── Dockerfile             # Frontend container config
│   └── .dockerignore          # Frontend dockerignore
└── DOCKER_README.md           # This file
```

## Support

For issues related to Docker setup, check:
1. Docker Desktop is running
2. All environment variables are set
3. No port conflicts exist
4. Sufficient disk space and memory available

