// Standalone Authentication Server - No npm dependencies required
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Simple in-memory database (replace with MongoDB in production)
const users = [];
const sessions = {};

// Simple password hashing (replace with bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Simple session management
function createSession(userId) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions[sessionId] = { userId, createdAt: Date.now() };
  return sessionId;
}

function getSession(sessionId) {
  return sessions[sessionId];
}

// Simple user registration
function registerUser(userData) {
  const { firstName, lastName, username, email, password, location } = userData;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return { success: false, error: 'User already exists with this email or username' };
  }
  
  // Create new user
  const user = {
    id: users.length + 1,
    firstName,
    lastName,
    username,
    email,
    password: hashPassword(password),
    location,
    createdAt: new Date()
  };
  
  users.push(user);
  return { success: true, user };
}

// Simple user login
function loginUser(username, password) {
  const user = users.find(u => u.username === username || u.email === username);
  if (!user || user.password !== hashPassword(password)) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  return { success: true, user };
}

// HTML Templates
const layout = (title, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Price Analysis</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .auth-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        .form-control {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            transition: all 0.3s ease;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="fas fa-chart-line me-2"></i>Price Analysis
            </a>
        </div>
    </nav>
    <main>
        ${body}
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

const homePage = (user = null) => {
  if (user) {
    return `
      <div class="container mt-5">
          <div class="row justify-content-center">
              <div class="col-md-8">
                  <div class="auth-container p-5 text-center">
                      <h1 class="display-4 mb-4">
                          <i class="fas fa-chart-line text-primary me-3"></i>
                          Welcome to Price Analysis
                      </h1>
                      <div class="alert alert-success">
                          <h4>Welcome back, ${user.firstName}!</h4>
                          <p>You are logged in as <strong>${user.username}</strong></p>
                          <a href="/dashboard" class="btn btn-primary btn-lg">
                              <i class="fas fa-tachometer-alt me-2"></i>Go to Dashboard
                          </a>
                          <a href="/logout" class="btn btn-secondary btn-lg ms-2">
                              <i class="fas fa-sign-out-alt me-2"></i>Logout
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
  }
  
  return `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="auth-container p-5 text-center">
                    <h1 class="display-4 mb-4">
                        <i class="fas fa-chart-line text-primary me-3"></i>
                        Welcome to Price Analysis
                    </h1>
                    <p class="lead mb-4">Track and analyze prices with our powerful platform</p>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                                    <h5 class="card-title">New User?</h5>
                                    <p class="card-text">Create an account to start analyzing prices</p>
                                    <a href="/register" class="btn btn-primary">
                                        <i class="fas fa-user-plus me-2"></i>Register Now
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <i class="fas fa-sign-in-alt fa-3x text-success mb-3"></i>
                                    <h5 class="card-title">Existing User?</h5>
                                    <p class="card-text">Sign in to access your dashboard</p>
                                    <a href="/login" class="btn btn-success">
                                        <i class="fas fa-sign-in-alt me-2"></i>Sign In
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

const registerPage = (errors = [], formData = {}) => `
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="auth-container p-5">
                <div class="text-center mb-4">
                    <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                    <h2 class="fw-bold">Create Account</h2>
                    <p class="text-muted">Join our price analysis platform</p>
                </div>

                ${errors.length > 0 ? `
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            ${errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <form action="/register" method="POST">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName" class="form-label">
                                <i class="fas fa-user me-1"></i>First Name
                            </label>
                            <input type="text" class="form-control" id="firstName" name="firstName" 
                                   value="${formData.firstName || ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="lastName" class="form-label">
                                <i class="fas fa-user me-1"></i>Last Name
                            </label>
                            <input type="text" class="form-control" id="lastName" name="lastName" 
                                   value="${formData.lastName || ''}" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="username" class="form-label">
                            <i class="fas fa-at me-1"></i>Username
                        </label>
                        <input type="text" class="form-control" id="username" name="username" 
                               value="${formData.username || ''}" required>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">
                            <i class="fas fa-envelope me-1"></i>Email Address
                        </label>
                        <input type="email" class="form-control" id="email" name="email" 
                               value="${formData.email || ''}" required>
                    </div>

                    <div class="mb-3">
                        <label for="location" class="form-label">
                            <i class="fas fa-map-marker-alt me-1"></i>Location
                        </label>
                        <input type="text" class="form-control" id="location" name="location" 
                               value="${formData.location || ''}" placeholder="City, Country" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock me-1"></i>Password
                        </label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>

                    <div class="mb-4">
                        <label for="confirmPassword" class="form-label">
                            <i class="fas fa-lock me-1"></i>Confirm Password
                        </label>
                        <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-user-plus me-2"></i>Create Account
                        </button>
                    </div>
                </form>

                <div class="text-center mt-4">
                    <p class="text-muted">
                        Already have an account? 
                        <a href="/login" class="text-decoration-none">
                            <i class="fas fa-sign-in-alt me-1"></i>Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>`;

const loginPage = (error = '') => `
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="auth-container p-5">
                <div class="text-center mb-4">
                    <i class="fas fa-sign-in-alt fa-3x text-success mb-3"></i>
                    <h2 class="fw-bold">Welcome Back</h2>
                    <p class="text-muted">Sign in to your account</p>
                </div>

                ${error ? `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>${error}
                    </div>
                ` : ''}

                <form action="/login" method="POST">
                    <div class="mb-3">
                        <label for="username" class="form-label">
                            <i class="fas fa-user me-1"></i>Username or Email
                        </label>
                        <input type="text" class="form-control" id="username" name="username" 
                               placeholder="Enter your username or email" required>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock me-1"></i>Password
                        </label>
                        <input type="password" class="form-control" id="password" name="password" 
                               placeholder="Enter your password" required>
                    </div>

                    <div class="d-grid mb-3">
                        <button type="submit" class="btn btn-success btn-lg">
                            <i class="fas fa-sign-in-alt me-2"></i>Sign In
                        </button>
                    </div>
                </form>

                <div class="text-center">
                    <p class="text-muted">
                        Don't have an account? 
                        <a href="/register" class="text-decoration-none">
                            <i class="fas fa-user-plus me-1"></i>Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>`;

const dashboardPage = (user) => `
<div class="container mt-5">
    <div class="row">
        <div class="col-12">
            <div class="auth-container p-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 class="display-5 fw-bold">
                            <i class="fas fa-tachometer-alt text-primary me-3"></i>
                            Dashboard
                        </h1>
                        <p class="lead text-muted">Welcome back, ${user.firstName}!</p>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary fs-6">
                            <i class="fas fa-user me-1"></i>${user.username}
                        </span>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-user fa-3x text-primary mb-3"></i>
                                <h5 class="card-title">Profile Information</h5>
                                <p class="card-text">
                                    <strong>Name:</strong> ${user.firstName} ${user.lastName}<br>
                                    <strong>Email:</strong> ${user.email}<br>
                                    <strong>Location:</strong> ${user.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-chart-line fa-3x text-success mb-3"></i>
                                <h5 class="card-title">Price Analysis</h5>
                                <p class="card-text">Start analyzing prices and trends with our powerful tools.</p>
                                <button class="btn btn-success">
                                    <i class="fas fa-plus me-1"></i>New Analysis
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <i class="fas fa-cog fa-3x text-warning mb-3"></i>
                                <h5 class="card-title">Settings</h5>
                                <p class="card-text">Manage your account settings and preferences.</p>
                                <button class="btn btn-warning">
                                    <i class="fas fa-cog me-1"></i>Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0">
                                    <i class="fas fa-info-circle me-2"></i>Account Details
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Member since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Account type:</strong> <span class="badge bg-success">Standard</span></p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Last login:</strong> Just now</p>
                                        <p><strong>Status:</strong> <span class="badge bg-success">Active</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

// Parse form data
function parseFormData(body) {
  const data = {};
  body.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    data[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return data;
}

// Get user from session
function getUserFromSession(req) {
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/sessionId=([^;]+)/);
  if (sessionMatch) {
    const session = getSession(sessionMatch[1]);
    if (session) {
      return users.find(u => u.id === session.userId);
    }
  }
  return null;
}

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Set content type
  res.setHeader('Content-Type', 'text/html');
  
  // Get current user
  const currentUser = getUserFromSession(req);
  
  // Routes
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200);
    res.end(layout('Home', homePage(currentUser)));
    
  } else if (pathname === '/register') {
    if (method === 'GET') {
      res.writeHead(200);
      res.end(layout('Register', registerPage()));
    } else if (method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const formData = parseFormData(body);
        const errors = [];
        
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.username || 
            !formData.email || !formData.password || !formData.confirmPassword || !formData.location) {
          errors.push('Please fill in all fields');
        }
        
        if (formData.password !== formData.confirmPassword) {
          errors.push('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          errors.push('Password must be at least 6 characters long');
        }
        
        if (errors.length > 0) {
          res.writeHead(200);
          res.end(layout('Register', registerPage(errors, formData)));
          return;
        }
        
        // Try to register user
        const result = registerUser(formData);
        if (result.success) {
          res.writeHead(302, { 'Location': '/login' });
          res.end();
        } else {
          errors.push(result.error);
          res.writeHead(200);
          res.end(layout('Register', registerPage(errors, formData)));
        }
      });
    }
    
  } else if (pathname === '/login') {
    if (method === 'GET') {
      res.writeHead(200);
      res.end(layout('Login', loginPage()));
    } else if (method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const formData = parseFormData(body);
        const result = loginUser(formData.username, formData.password);
        
        if (result.success) {
          const sessionId = createSession(result.user.id);
          res.writeHead(302, { 
            'Location': '/dashboard',
            'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400`
          });
          res.end();
        } else {
          res.writeHead(200);
          res.end(layout('Login', loginPage(result.error)));
        }
      });
    }
    
  } else if (pathname === '/dashboard') {
    if (currentUser) {
      res.writeHead(200);
      res.end(layout('Dashboard', dashboardPage(currentUser)));
    } else {
      res.writeHead(302, { 'Location': '/login' });
      res.end();
    }
    
  } else if (pathname === '/logout') {
    res.writeHead(302, { 
      'Location': '/',
      'Set-Cookie': 'sessionId=; HttpOnly; Path=/; Max-Age=0'
    });
    res.end();
    
  } else {
    res.writeHead(404);
    res.end(layout('404', '<div class="container mt-5"><div class="text-center"><h1>404 - Page Not Found</h1></div></div>'));
  }
});

const PORT = 3001;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`🚀 Standalone Authentication Server running!`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://128.235.85.2:${PORT}`);
  console.log(`\n✨ Features:`);
  console.log(`   ✅ User Registration (First Name, Last Name, Username, Email, Location)`);
  console.log(`   ✅ User Login (Username/Email + Password)`);
  console.log(`   ✅ Session Management`);
  console.log(`   ✅ Protected Dashboard`);
  console.log(`   ✅ Beautiful UI with Bootstrap 5`);
  console.log(`\n🎯 No npm dependencies required!`);
});
