import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import mongoose from 'mongoose';
import { goddesses, analyzeWithGoddess } from './lib/goddess_chatbot.js';
import { 
  saveUserPurchase, 
  getUserPurchaseHistory, 
  getUserAnalytics,
  updateMarketPrice,
  getMarketPrices,
  getPriceStatistics,
  getGlobalScamStatistics,
  connectToDatabase
} from './lib/database.js';

// Import authentication components
import passportConfig from './config/passport.js';
import User from './models/User.js';

// Connect to MongoDB using Mongoose (for User model)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Keep trying to send operations for 15 seconds
  connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  maxPoolSize: 1, // Maintain 1 socket connection
  retryWrites: false, // Disable retry writes
  retryReads: false, // Disable retry reads
}).then(() => {
  console.log('✅ Mongoose connected to MongoDB');
}).catch((error) => {
  console.error('❌ Mongoose connection error:', error);
});

// Environment validation
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is required!');
  console.error('   Get your API key from: https://aistudio.google.com/app/apikey');
  console.error('   Then set it in your .env file or environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize MongoDB connection
connectToDatabase().catch(console.error);

// Middleware - Configure CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Next.js dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
passportConfig(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Serve static files (HTML pages)
app.use(express.static('./'));

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    status: 'error',
    message: 'Authentication required. Please login first.'
  });
}

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ========== AUTHENTICATION ROUTES ==========

// Register route
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, password, confirmPassword } = req.body;
    
    // Validation
    const errors = [];
    
    if (!username || !password || !confirmPassword) {
      errors.push({ msg: 'Please fill in all fields' });
    }
    
    if (password !== confirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters long' });
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors.map(e => e.msg).join(', ')
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists'
      });
    }
    
    // Create new user with default values
    const user = new User({
      firstName: username, // Use username as firstName
      lastName: 'User',    // Default last name
      username,
      email: `${username}@example.com`, // Generate a default email
      password,
      location: 'Unknown'  // Default location
    });
    
    await user.save();
    console.log('User saved successfully:', user._id);
    
    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please log in.',
      userId: user._id
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      errorMessage = `Validation error: ${validationErrors.join(', ')}`;
    } else if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      errorMessage = `This ${field} is already registered. Please use a different ${field}.`;
    } else if (error.message.includes('MongoDB')) {
      errorMessage = 'Database connection error. Please try again later.';
    }
    
    console.error('Detailed registration error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    
    res.status(500).json({
      status: 'error',
      message: errorMessage
    });
  }
});

// Login route
app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide both username/email and password'
    });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Server error. Please try again later.'
      });
    }
    
    if (!user) {
      // Check if it's a database connection issue
      if (info && info.message === 'Invalid username or password') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email/username or password. Please check your credentials.'
        });
      }
      
      // Default authentication failure
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email/username or password. Please check your credentials.'
      });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to create login session. Please try again.'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    });
  })(req, res, next);
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Logout failed'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'You have been logged out'
    });
  });
});

// Get current user
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      status: 'success',
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Not authenticated'
    });
  }
});

// Database health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    if (db) {
      // Test database connection
      await db.admin().ping();
      res.status(200).json({
        status: 'success',
        message: 'Database connection healthy',
        database: 'Connected'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        database: 'Disconnected'
      });
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database health check failed',
      error: error.message
    });
  }
});

// ========== MAIN SCAM DETECTION ENDPOINT ==========

app.post('/api/scam-check', ensureAuthenticated, async (req, res) => {
  try {
    const { text, country, currency } = req.body;
    
    if (!text) {
      return res.status(400).json({
        status: "error",
        message: "Please provide text describing your purchase"
      });
    }
    
    // Get user context from authenticated user
    const userName = req.user.firstName;
    const location = { city: country || 'unknown', country: country || 'unknown' };
    
    // Use unified Gemini goddess system
    const analysis = await analyzeWithGoddess(text, location, userName, currency);
    
    // Save to MongoDB - User Purchase History & Market Price Database
    try {
      const userId = req.user._id.toString();
      
      // Save user purchase history
      await saveUserPurchase({
        userId,
        itemName: analysis.itemName,
        pricePaid: analysis.pricePaid,
        currency: analysis.currency,
        country: country || 'unknown',
        city: country || 'unknown',
        scamScore: analysis.scamScore,
        goddess: analysis.selectedGoddess,
        fairPriceMin: analysis.fairPriceMin,
        fairPriceMax: analysis.fairPriceMax,
        markupPercentage: analysis.markupPercentage,
        currencyConversion: analysis.currencyConversion,
        location: req.body.location || null
      });
      
      // Update market price database
      await updateMarketPrice({
        country: country || 'unknown',
        itemName: analysis.itemName,
        currency: analysis.currency,
        pricePaid: analysis.pricePaid,
        fairPriceMin: analysis.fairPriceMin,
        fairPriceMax: analysis.fairPriceMax,
        scamScore: analysis.scamScore,
        userId
      });
      
      console.log('📊 Saved to MongoDB:', analysis.itemName, 'in', country);
    } catch (dbError) {
      console.error('⚠️ Database save failed:', dbError.message);
      // Continue with response even if DB fails
    }
    
    res.status(200).json({
      status: "success",
      data: {
        itemName: analysis.itemName,
        pricePaid: analysis.pricePaid,
        currency: analysis.currency,
        scamScore: analysis.scamScore,
        scamLevel: analysis.scamScore >= 80 ? "HIGH" : analysis.scamScore >= 50 ? "MEDIUM" : "LOW",
        goddess: analysis.selectedGoddess,
        goddessResponse: analysis.response,
        advice: analysis.advice,
        currencyConversion: analysis.currencyConversion || null
      }
    });
    
  } catch (error) {
    console.error('Scam check error:', error);
    res.status(500).json({
      status: "error",
      message: "Gemini API error: " + error.message
    });
  }
});

// ========== MONGODB ANALYTICS API ENDPOINTS ==========

// Get user purchase history (authenticated users only)
app.get('/api/user/history', ensureAuthenticated, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id.toString();
    
    const purchases = await getUserPurchaseHistory(userId, limit);
    
    res.status(200).json({
      status: "success",
      data: {
        userId,
        purchases,
        count: purchases.length
      }
    });
  } catch (error) {
    console.error('User history error:', error);
    res.status(500).json({
      status: "error",
      message: "Database error: " + error.message
    });
  }
});

// Get user analytics (authenticated users only)
app.get('/api/user/analytics', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    
    const analytics = await getUserAnalytics(userId);
    
    if (!analytics) {
      return res.status(404).json({
        status: "error",
        message: "No purchase history found for user"
      });
    }
    
    // Calculate additional insights
    const insights = {
      scamRiskLevel: analytics.averageScamScore >= 70 ? 'HIGH' : 
                    analytics.averageScamScore >= 50 ? 'MEDIUM' : 'LOW',
      moneySaved: analytics.totalFairDeals * 5, // Estimated $5 saved per fair deal
      mostScammedCountry: analytics.countries[0], // Simplified
      favoriteGoddess: analytics.goddesses[0], // Simplified
      scamPercentage: Math.round((analytics.totalScammed / analytics.totalPurchases) * 100),
      fairDealPercentage: Math.round((analytics.totalFairDeals / analytics.totalPurchases) * 100)
    };
    
    res.status(200).json({
      status: "success",
      data: {
        ...analytics,
        insights
      }
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      status: "error",
      message: "Database error: " + error.message
    });
  }
});

// Get market prices for a country
app.get('/api/market-prices/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { item } = req.query;
    
    const prices = await getMarketPrices(country, item);
    
    res.status(200).json({
      status: "success",
      data: {
        country,
        prices,
        count: prices.length
      }
    });
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({
      status: "error",
      message: "Database error: " + error.message
    });
  }
});

// Get price statistics for specific item and country
app.get('/api/price-stats/:country/:item', async (req, res) => {
  try {
    const { country, item } = req.params;
    
    const stats = await getPriceStatistics(country, item);
    
    if (!stats) {
      return res.status(404).json({
        status: "error",
        message: "No price data found for this item in this country"
      });
    }
    
    res.status(200).json({
      status: "success",
      data: {
        country,
        item,
        ...stats
      }
    });
  } catch (error) {
    console.error('Price stats error:', error);
    res.status(500).json({
      status: "error",
      message: "Database error: " + error.message
    });
  }
});

// Get global scam statistics
app.get('/api/global-stats', async (req, res) => {
  try {
    const stats = await getGlobalScamStatistics();
    
    res.status(200).json({
      status: "success",
      data: stats || {
        totalPurchases: 0,
        averageScamScore: 0,
        countries: [],
        message: "No data available yet"
      }
    });
  } catch (error) {
    console.error('Global stats error:', error);
    res.status(500).json({
      status: "error",
      message: "Database error: " + error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GnosisLens Server with Authentication running on port ${PORT}`);
  console.log(`🏠 Welcome Page: http://localhost:${PORT}/index.html`);
  console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
  console.log(`👤 Register: http://localhost:${PORT}/register.html`);
  console.log(`🔮 Chatbot (Protected): http://localhost:${PORT}/simple_detector.html`);
  console.log(`📊 Analytics (Protected): http://localhost:${PORT}/user_analytics.html`);
  console.log(`🔗 API endpoints:`);
  console.log(`   - Scam Check: http://localhost:${PORT}/api/scam-check`);
  console.log(`   - User Analytics: http://localhost:${PORT}/api/user/analytics`);
  console.log(`   - User History: http://localhost:${PORT}/api/user/history`);
  console.log(`🌍 Market prices: http://localhost:${PORT}/api/market-prices/:country`);
  console.log(`📈 Global stats: http://localhost:${PORT}/api/global-stats`);
  console.log(`✅ GnosisLens with Personalized User Analytics ready!`);
});
