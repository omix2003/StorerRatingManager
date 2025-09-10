# Store Rating Manager

A full-stack web application that allows users to submit ratings for stores with role-based access control.

## Tech Stack

- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **Frontend**: React.js with Vite
- **Authentication**: JWT tokens
- **ORM**: Sequelize

## Features

### User Roles
- **System Administrator**: Full access to manage users, stores, and view analytics
- **Normal User**: Can rate stores and manage their own profile
- **Store Owner**: Can view ratings for their store and manage their profile

### Key Functionalities
- User registration and authentication
- Store management
- Rating system (1-5 stars)
- Role-based access control
- Search and filtering
- Dashboard analytics

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-manager
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_manager
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create store (admin only)
- `GET /api/stores/:id` - Get store by ID
- `PUT /api/stores/:id` - Update store

### Ratings
- `GET /api/ratings` - Get ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Migrations
```bash
cd backend
npm run migrate
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.


