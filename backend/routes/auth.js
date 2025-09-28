import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword, location } = req.body;
  
  // Validation
  const errors = [];
  
  if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !location) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  
  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }
  
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters long' });
  }
  
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      location
    });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      errors.push({ msg: 'User already exists with this email or username' });
      return res.render('register', {
        errors,
        firstName,
        lastName,
        username,
        email,
        location
      });
    }
    
    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      location
    });
    
    await user.save();
    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    errors.push({ msg: 'Registration failed. Please try again.' });
    res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      location
    });
  }
});

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/');
  });
});

export default router;
