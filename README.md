# Apostrophe - User Management System

A full-stack user management system built with Express.js, MongoDB, and a modern Tailwind CSS frontend. Features include authentication, role-based access control, and a beautiful user interface.

## 🚀 Features

- **User Authentication** - Signup and login with JWT tokens
- **Role Management** - Admin and User roles with different permissions
- **User Management** - Create, read, update, and delete users
- **Modern UI** - Beautiful Tailwind CSS interface with responsive design
- **API Documentation** - Swagger UI for interactive API testing
- **Postman Collection** - Ready-to-use Postman collection for API testing
- **Data Validation** - Advanced validation using express-validator
- **MongoDB Integration** - Persistent data storage with Mongoose

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apostrophe-prj
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
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

## 🏃 Running the Application

1. Make sure MongoDB is running on your system

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

The application will automatically:
- Connect to MongoDB
- Create a default admin user (if it doesn't exist)
- Serve the web interface

## 👤 Default Admin User

A default admin user is automatically created when the server starts for the first time (if it doesn't already exist).

**Default Credentials:**
- **Email:** `admin@example.com`
- **Password:** `Admin123`
- **Role:** Admin

**⚠️ Important:** Change the default admin password in production by updating `ADMIN_PASSWORD` in your `.env` file!

## 🎨 Web Interface

The application includes a modern, responsive web interface built with Tailwind CSS.

### Features:
- **Login/Signup Pages** - Beautiful authentication forms
- **User Dashboard** - View and manage all users
- **User Management** - Edit user details, change roles, delete users
- **Role-Based UI** - Different views for Admin and regular Users
- **Real-time Updates** - Instant feedback with toast notifications
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Access:
Simply open `http://localhost:3000` in your browser after starting the server.

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

**Features:**
- Complete API endpoint documentation
- Interactive testing interface
- Request/response examples
- Authentication support (JWT Bearer token)
- Schema definitions

**How to use:**
1. Navigate to `http://localhost:3000/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out" to test the endpoint
4. Fill in the required parameters/body
5. Click "Execute" to send the request
6. View the response below

**Authentication in Swagger:**
1. Use the `/api/users/login` endpoint to get a JWT token
2. Click the "Authorize" button at the top
3. Enter your token: `Bearer <your-token>`
4. Click "Authorize" and then "Close"
5. Now you can test protected endpoints

## 🔌 API Endpoints

All endpoints are documented in Swagger UI. Quick overview:

### Authentication
- **POST /api/users/signup** - Register a new user
- **POST /api/users/login** - Login and get JWT token

### User Management
- **GET /api/users/list** - Get all users (Admin only)
- **PUT /api/users/:id** - Update user profile
- **DELETE /api/users/:id** - Delete user (Admin only)
- **PATCH /api/users/:id/role** - Change user role (Admin only)

## 📮 Postman Collection

A complete Postman collection is available in the `postman/` folder for easy API testing.

### Import Instructions:

1. **Import Collection:**
   - Open Postman
   - Click **Import**
   - Select `postman/Apostrophe_API.postman_collection.json`

2. **Import Environment:**
   - Click **Import** again
   - Select `postman/Apostrophe_API.postman_environment.json`
   - Select the environment from the dropdown (top right)

3. **Start Testing:**
   - The base URL is pre-configured: `http://localhost:3000`
   - Run the **Login** request first to get your token
   - Token is automatically saved for protected endpoints

### Collection Features:
- ✅ Automatic token management
- ✅ Pre-configured request examples
- ✅ Environment variables
- ✅ All endpoints organized by category

## 🔐 Role-Based Access Control

### User Role (Default)
- Can update their own profile
- Cannot view all users
- Cannot change roles
- Cannot delete users

### Admin Role
- Can view all users
- Can update any user's profile
- Can change user roles
- Can delete users
- Full system access

## 🗄️ Database

The application uses MongoDB with Mongoose ODM.

**Database:** `apostrophe_db` (configurable via `MONGODB_URI`)

**Collections:**
- `users` - User accounts with authentication and role information

## 🛡️ Security Features

- JWT token-based authentication
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Email format validation
- Role-based authorization
- Secure password handling
- Input validation and sanitization

## 📁 Project Structure

```
apostrophe-prj/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── seed.js          # Default admin user creation
│   └── swagger.js       # Swagger configuration
├── constants/
│   └── httpStatus.js    # HTTP status codes
├── middleware/
│   ├── auth.js          # Authentication & authorization
│   └── validation.js    # Validation error handler
├── models/
│   └── User.js          # User model (Mongoose schema)
├── public/
│   ├── index.html       # Frontend interface
│   ├── app.js           # Frontend JavaScript
│   └── styles.css       # Additional styles
├── routes/
│   └── userRoutes.js    # User API routes
├── utils/
│   └── jwt.js           # JWT token utilities
├── validators/
│   └── userValidators.js # Input validation rules
├── postman/             # Postman collection files
├── .env.example         # Environment variables template
├── server.js            # Express server
└── package.json         # Dependencies
```

## 🧪 Testing

### Web Interface
- Open `http://localhost:3000` in your browser
- Login with admin credentials
- Test all features through the UI

### Swagger UI
- Open `http://localhost:3000/api-docs`
- Test endpoints interactively

### Postman
- Import the collection from `postman/` folder
- Use pre-configured requests

## 🚨 Error Handling

The API returns consistent error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/apostrophe_db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiration time | `24h` |
| `ADMIN_EMAIL` | Default admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Default admin password | `Admin123` |
| `ADMIN_NAME` | Default admin name | `Admin User` |

## 🎯 Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Frontend:** HTML, JavaScript, Tailwind CSS
- **Environment:** dotenv

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Express.js and Tailwind CSS**
