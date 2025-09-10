# Store Rating Manager

A full-stack web application that allows users to submit ratings for stores (1-5 stars) with role-based access control for System Administrators, Normal Users, and Store Owners.

## 🚀 Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with JWT-based authentication
- **Role-based Access Control**:
  - **System Administrator**: Full CRUD operations on users and stores
  - **Normal User**: Rate stores, view store listings
  - **Store Owner**: Manage their own stores, view ratings

### 🏪 Store Management

- **Store CRUD Operations** (Admin only)
- **Store Categories** (11 predefined categories)
- **Store Listing** with search and filtering
- **Store Ratings** with 1-5 star system
- **Average Rating Calculation**
- **Rating Statistics**

### 👥 User Management

- **User CRUD Operations** (Admin only)
- **User Dashboard** with statistics
- **Role Management**
- **User Search & Filtering**

### ⭐ Rating System

- **1-5 Star Rating System**
- **Detailed Review Text** (up to 1000 characters)
- **Duplicate Rating Prevention** (one rating per user per store)
- **Rating History**
- **Rating Analytics**

### 🎨 Frontend Features

- **Responsive Design** with Tailwind CSS
- **Real-time Search & Filtering**
- **Sorting Capabilities** (by name, rating, date, etc.)
- **Pagination**
- **Loading States & Error Handling**
- **Form Validation**

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **PostgreSQL** database
- **Sequelize** ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS, Helmet, Morgan** for security and logging

### Frontend

- **React 18** with modern hooks
- **React Router** for client-side routing
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Context API** for state management

### Development Tools

- **Vite** for frontend development
- **Nodemon** for backend development
- **Docker** for database containerization

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (or Docker)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd store-rating-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# From project root
docker compose up -d
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `createdb store_rating_manager`
3. Update `backend/config.env` with your database credentials

### 4. Environment Configuration

Create `backend/config.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_manager
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🔑 Test Credentials

The application comes with pre-configured test accounts for all user roles:

### System Administrator

- **Email**: `admin@storemanager.com`
- **Password**: `AdminPass123!`
- **Access**: Full system access, user management, store management

### Store Owner

- **Email**: `owner@storemanager.com`
- **Password**: `OwnerPass123!`
- **Access**: Manage own stores, view detailed ratings and reviews

### Regular User

- **Email**: `user@storemanager.com`
- **Password**: `UserPass123!`
- **Access**: Rate stores, view store listings, manage profile

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Users (Admin Only)

- `GET /api/users` - Get all users (with search, filter, sort, pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/dashboard/stats` - Get dashboard statistics

### Stores

- `GET /api/stores` - Get all stores (with search, filter, sort, pagination)
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create new store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/:id/ratings` - Get store ratings

### Store Owner Endpoints

- `GET /api/stores/my/stores` - Get store owner's stores
- `GET /api/stores/my/ratings` - Get ratings for store owner's stores
- `GET /api/stores/my/stats` - Get store owner's statistics

### Ratings

- `GET /api/ratings` - Get all ratings (with pagination)
- `GET /api/ratings/:id` - Get rating by ID
- `POST /api/ratings` - Create new rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating
- `GET /api/ratings/my-ratings` - Get current user's ratings

## 🎯 User Roles & Permissions

### System Administrator

- Full access to all features
- Manage users (CRUD operations)
- Manage stores (CRUD operations)
- View all ratings and statistics
- Access admin dashboard

### Normal User

- Register and login
- View store listings
- Rate stores (1-5 stars)
- View their own rating history
- Update profile

### Store Owner

- All normal user permissions
- Manage their own stores
- View detailed ratings for their stores
- See reviewer information (name, email)
- View detailed review text
- Store analytics and statistics

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** using bcryptjs
- **Input Validation** using express-validator
- **CORS Protection**
- **Helmet** for security headers
- **Role-based Authorization** middleware
- **SQL Injection Protection** via Sequelize ORM

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Update database credentials
3. Set secure JWT secret
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API endpoints in production

## 📝 Form Validations

### User Registration

- **Name**: 2-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters, uppercase letter, special character
- **Address**: Maximum 400 characters

### Store Creation

- **Name**: Required, maximum 100 characters
- **Email**: Valid email format
- **Address**: Required, maximum 400 characters
- **Category**: Required, must be one of 11 predefined categories

### Rating

- **Rating**: 1-5 stars (integer)
- **Review Text**: Optional, maximum 1000 characters
- **One rating per user per store**

## 🏷️ Store Categories

The application supports 11 predefined store categories:

1. **Food & Dining** - Restaurants, cafes, food delivery
2. **Electronics** - Tech gadgets, computers, phones
3. **Groceries** - Supermarkets, grocery stores
4. **Clothing & Fashion** - Apparel, shoes, accessories
5. **Health & Wellness** - Pharmacies, medical supplies
6. **Beauty & Personal Care** - Cosmetics, skincare, salons
7. **Sports & Recreation** - Sports equipment, gyms, outdoor gear
8. **Books & Media** - Bookstores, libraries, media
9. **Home & Garden** - Furniture, home improvement, gardening
10. **Automotive** - Car dealerships, auto parts, services
11. **Other** - Miscellaneous or unclassified stores

## 🔧 Development

### Project Structure

```
store-rating-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
└── docker-compose.yml
```

### Adding New Features

1. Create backend API endpoints
2. Add frontend components
3. Update routing
4. Test thoroughly
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Happy Rating! ⭐**
