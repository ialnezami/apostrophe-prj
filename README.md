# Apostrophe Backend Project

Backend server built with Express.js for user management system.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/apostrophe_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Default Admin User (created automatically on first run)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123
ADMIN_NAME=Admin User
```

### Default Admin User

A default admin user is automatically created when the server starts for the first time (if it doesn't already exist). Default credentials:

- **Email:** `admin@example.com` (or set `ADMIN_EMAIL` in `.env`)
- **Password:** `Admin123` (or set `ADMIN_PASSWORD` in `.env`)
- **Name:** `Admin User` (or set `ADMIN_NAME` in `.env`)

**⚠️ Important:** Change the default admin password in production!



### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` and connect to MongoDB automatically.

## API Documentation

### Swagger UI

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

Swagger UI provides:
- Complete API endpoint documentation
- Interactive testing interface
- Request/response examples
- Authentication support (JWT Bearer token)
- Schema definitions

### Using Swagger UI

1. Start the server: `npm start`
2. Open your browser and navigate to `http://localhost:3000/api-docs`
3. Click on any endpoint to expand it
4. Click "Try it out" to test the endpoint
5. Fill in the required parameters/body
6. Click "Execute" to send the request
7. View the response below

### Authentication in Swagger

For protected endpoints:
1. First, use the `/api/users/login` endpoint to get a JWT token
2. Click the "Authorize" button at the top of the Swagger UI
3. Enter your token in the format: `Bearer <your-token>`
4. Click "Authorize" and then "Close"
5. Now you can test protected endpoints

## API Endpoints

All endpoints are documented in Swagger UI. Here's a quick overview:

- **POST /api/users/signup** - Register a new user
- **POST /api/users/login** - Login and get JWT token
- **GET /api/users/list** - Get all users (Admin only)
- **PUT /api/users/:id** - Update user profile
- **DELETE /api/users/:id** - Delete user (Admin only)
- **PATCH /api/users/:id/role** - Change user role (Admin only)


