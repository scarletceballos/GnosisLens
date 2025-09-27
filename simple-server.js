// Simple HTTP server without dependencies for testing
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Set content type
  res.setHeader('Content-Type', 'text/html');
  
  // Simple routing
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Price Analysis - Authentication System</title>
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
          </style>
      </head>
      <body>
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
                          
                          <div class="alert alert-info mt-4">
                              <h5><i class="fas fa-info-circle me-2"></i>Setup Instructions</h5>
                              <p class="mb-0">To run the full authentication system, you need to install the dependencies first:</p>
                              <ol class="text-start mt-2">
                                  <li>Make sure Node.js and npm are properly installed</li>
                                  <li>Run: <code>npm install</code></li>
                                  <li>Start MongoDB (local or Atlas)</li>
                                  <li>Run: <code>node server.js</code></li>
                              </ol>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `);
  } else if (pathname === '/register') {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Register - Price Analysis</title>
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
          </style>
      </head>
      <body>
          <div class="container mt-5">
              <div class="row justify-content-center">
                  <div class="col-md-6">
                      <div class="auth-container p-5">
                          <div class="text-center mb-4">
                              <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                              <h2 class="fw-bold">Create Account</h2>
                              <p class="text-muted">Join our price analysis platform</p>
                          </div>
                          
                          <div class="alert alert-warning">
                              <i class="fas fa-exclamation-triangle me-2"></i>
                              <strong>Note:</strong> This is a demo page. To enable full functionality, install the dependencies and run the Express server.
                          </div>
                          
                          <form>
                              <div class="row">
                                  <div class="col-md-6 mb-3">
                                      <label for="firstName" class="form-label">
                                          <i class="fas fa-user me-1"></i>First Name
                                      </label>
                                      <input type="text" class="form-control" id="firstName" name="firstName" required>
                                  </div>
                                  <div class="col-md-6 mb-3">
                                      <label for="lastName" class="form-label">
                                          <i class="fas fa-user me-1"></i>Last Name
                                      </label>
                                      <input type="text" class="form-control" id="lastName" name="lastName" required>
                                  </div>
                              </div>
                              
                              <div class="mb-3">
                                  <label for="username" class="form-label">
                                      <i class="fas fa-at me-1"></i>Username
                                  </label>
                                  <input type="text" class="form-control" id="username" name="username" required>
                              </div>
                              
                              <div class="mb-3">
                                  <label for="email" class="form-label">
                                      <i class="fas fa-envelope me-1"></i>Email Address
                                  </label>
                                  <input type="email" class="form-control" id="email" name="email" required>
                              </div>
                              
                              <div class="mb-3">
                                  <label for="location" class="form-label">
                                      <i class="fas fa-map-marker-alt me-1"></i>Location
                                  </label>
                                  <input type="text" class="form-control" id="location" name="location" placeholder="City, Country" required>
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
          </div>
      </body>
      </html>
    `);
  } else if (pathname === '/login') {
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login - Price Analysis</title>
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
          </style>
      </head>
      <body>
          <div class="container mt-5">
              <div class="row justify-content-center">
                  <div class="col-md-5">
                      <div class="auth-container p-5">
                          <div class="text-center mb-4">
                              <i class="fas fa-sign-in-alt fa-3x text-success mb-3"></i>
                              <h2 class="fw-bold">Welcome Back</h2>
                              <p class="text-muted">Sign in to your account</p>
                          </div>
                          
                          <div class="alert alert-warning">
                              <i class="fas fa-exclamation-triangle me-2"></i>
                              <strong>Note:</strong> This is a demo page. To enable full functionality, install the dependencies and run the Express server.
                          </div>
                          
                          <form>
                              <div class="mb-3">
                                  <label for="username" class="form-label">
                                      <i class="fas fa-user me-1"></i>Username or Email
                                  </label>
                                  <input type="text" class="form-control" id="username" name="username" placeholder="Enter your username or email" required>
                              </div>
                              
                              <div class="mb-4">
                                  <label for="password" class="form-label">
                                      <i class="fas fa-lock me-1"></i>Password
                                  </label>
                                  <input type="password" class="form-control" id="password" name="password" placeholder="Enter your password" required>
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
          </div>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all interfaces
server.listen(PORT, HOST, () => {
  console.log(`Simple server running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://128.235.85.2:${PORT}`);
  console.log('This is a demo version. To run the full authentication system:');
  console.log('1. Fix npm install issue');
  console.log('2. Run: npm install');
  console.log('3. Start MongoDB');
  console.log('4. Run: node server.js');
});
