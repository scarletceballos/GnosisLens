# Price Analysis Authentication System

A complete authentication system built with Node.js, Express, Passport.js, and MongoDB for the Price Analysis project.

## Features

- **User Registration**: First name, last name, username, email, location, and password
- **User Login**: Username/email and password authentication
- **Session Management**: Secure session handling with Passport.js
- **Password Security**: Bcrypt password hashing
- **Modern UI**: Beautiful, responsive design with Bootstrap 5
- **Flash Messages**: User feedback for success/error messages
- **Protected Routes**: Dashboard access requires authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Network Configuration

The application is configured to listen on all network interfaces (0.0.0.0) by default, making it accessible via:
- **Local access**: `http://localhost:3000`
- **Network access**: `http://128.235.85.2:3000`

To change the IP address or port, update the `config.env` file:
```bash
# Server configuration
PORT=3000
HOST=0.0.0.0  # Listen on all interfaces
# HOST=128.235.85.2  # Listen on specific IP
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` and update the values:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/price-analysis
   
   # Session Secret (change this to a secure random string)
   SESSION_SECRET=your-super-secret-session-key-here
   
   # Server
   PORT=3000
   ```

4. **Start MongoDB:**
   - If using local MongoDB, make sure MongoDB is running
   - If using MongoDB Atlas, update the MONGODB_URI in config.env

5. **Run the application:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

6. **Access the application:**
   - Local access: `http://localhost:3000`
   - Network access: `http://128.235.85.2:3000`
   - The server listens on all interfaces (0.0.0.0) by default

## Usage

### Registration
1. Navigate to `/register`
2. Fill in all required fields:
   - First Name
   - Last Name
   - Username (must be unique)
   - Email (must be unique)
   - Location
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create Account"

### Login
1. Navigate to `/login`
2. Enter your username/email and password
3. Click "Sign In"

### Dashboard
- After successful login, you'll be redirected to `/dashboard`
- The dashboard shows your profile information and account details
- Use the logout button to sign out

## Project Structure

```
├── config/
│   └── passport.js          # Passport.js configuration
├── models/
│   └── User.js             # User model with Mongoose
├── routes/
│   └── auth.js             # Authentication routes
├── views/
│   ├── layout.ejs          # Main layout template
│   ├── index.ejs           # Home page
│   ├── register.ejs        # Registration page
│   ├── login.ejs          # Login page
│   └── dashboard.ejs       # User dashboard
├── config.env              # Environment variables
├── package.json            # Dependencies and scripts
├── server.js               # Main application file
└── README.md               # This file
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- CSRF protection through sessions
- Secure session configuration

## Customization

### Adding New Fields
To add new fields to the user registration:

1. Update the User model in `models/User.js`
2. Add the field to the registration form in `views/register.ejs`
3. Update the registration route in `routes/auth.js`

### Styling
The application uses Bootstrap 5 with custom CSS. You can modify the styles in the `<style>` section of `views/layout.ejs`.

### Database
The application uses MongoDB with Mongoose. The User model includes:
- firstName, lastName, username, email, password, location
- Automatic password hashing
- Email and username uniqueness validation

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in config.env

2. **Session Issues:**
   - Make sure SESSION_SECRET is set in config.env
   - Clear browser cookies if experiencing login issues

3. **Port Already in Use:**
   - Change the PORT in config.env
   - Or kill the process using the port

## License

MIT License - feel free to use this project for your own applications.
