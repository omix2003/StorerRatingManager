# Setup Instructions

## Prerequisites

### 1. Install Docker Desktop
- Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Verify installation: `docker --version`

### 2. Database Setup (Choose one option)

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL database
docker compose up -d

# Check if database is running
docker compose ps
```

#### Option B: Local PostgreSQL Installation
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Create database: `store_rating_manager`
4. Update `backend/config.env` with your PostgreSQL credentials

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Testing the Application

### 1. Test Backend
- Backend will run on: http://localhost:5000
- Health check: http://localhost:5000/health
- API endpoints: http://localhost:5000/api/auth

### 2. Test Frontend
- Frontend will run on: http://localhost:5173

## API Testing with Postman/Thunder Client

### Register a new user
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe Administrator",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "address": "123 Main Street, City, State, Country",
  "role": "admin"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `backend/config.env`
- Verify database exists: `store_rating_manager`

### Port Conflicts
- Backend: Change PORT in `backend/config.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Issues
- Update FRONTEND_URL in `backend/config.env`
- Ensure frontend and backend ports match


