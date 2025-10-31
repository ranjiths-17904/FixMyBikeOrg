// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import routes
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Import notification service
const NotificationService = require('./services/notificationService');

const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://fixmybike.netlify.app',
    'https://www.fixmybike.netlify.app',
    'https://fixmybike-client.onrender.com',
    'https://fixmybike-client.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'Accept', 'Origin']
}));
// Explicitly enable preflight for all routes
app.options('*', cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }
  next();
});

const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/bikeServiceApp';
const JWT_SECRET = process.env.JWT_SECRET || 'fixmybike-super-secret-jwt-key-2024-production-ready';

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint for debugging
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FixMyBike Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      users: '/api/users',
      notifications: '/api/notifications',
      payments: '/api/payments',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// A minimal GET /api/auth/me (uses Authorization header)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toJSON() });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Test endpoint working',
    user: req.user || 'No user authenticated',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for undefined routes - must be last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log(`Request headers:`, req.headers);
  console.log(`Request body:`, req.body);

  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/',
      '/api/auth',
      '/api/bookings',
      '/api/users',
      '/api/notifications',
      '/api/payments',
      '/api/health',
      '/api/test'
    ]
  });
});

// Start server only after MongoDB connection is established
const startServer = async () => {
  try {
    console.log("Starting server initialization...");
    console.log("Node.js version:", process.version);
    console.log("Express version:", require('express/package.json').version);

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");

    // Start the server
    console.log("Starting HTTP server...");
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

      // Set up scheduled notifications after server is running
      setInterval(() => {
        try {
          NotificationService.sendTomorrowReminders();
          NotificationService.sendFourHourReminders();
        } catch (error) {
          console.error('Error in scheduled notifications:', error);
        }
      }, 60 * 60 * 1000); // Run every hour

      // Clean up old notifications daily
      setInterval(() => {
        try {
          NotificationService.cleanupOldNotifications();
        } catch (error) {
          console.error('Error cleaning up notifications:', error);
        }
      }, 24 * 60 * 60 * 1000); // Run daily

      console.log('Scheduled notifications initialized');
    });

    // Add error handling for the server
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });

    console.log("Server initialization completed");

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

startServer();
