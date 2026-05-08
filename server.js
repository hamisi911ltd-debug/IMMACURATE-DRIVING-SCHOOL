// ============================================
// IMMACURATE DRIVING SCHOOL MANAGEMENT SYSTEM
// Node.js Backend Server
// ============================================

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');
const lessonsRoutes = require('./routes/lessons');
const paymentsRoutes = require('./routes/payments');
const messagesRoutes = require('./routes/messages');
const reportsRoutes = require('./routes/reports');
const apiRoutes = require('./routes/api');

// Import middleware
const { isAuthenticated } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for now
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  name: process.env.SESSION_NAME || 'dsms_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000 // 24 hours
  }
}));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.appName = process.env.APP_NAME || 'DSMS';
  res.locals.appVersion = process.env.APP_VERSION || '1.0.0';
  next();
});

// ============================================
// ROUTES
// ============================================

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/students', isAuthenticated, studentsRoutes);
app.use('/courses', isAuthenticated, coursesRoutes);
app.use('/lessons', isAuthenticated, lessonsRoutes);
app.use('/payments', isAuthenticated, paymentsRoutes);
app.use('/messages', isAuthenticated, messagesRoutes);
app.use('/reports', isAuthenticated, reportsRoutes);

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 }
  });
});

// Error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🚗 ${process.env.APP_NAME || 'DSMS'}`);
  console.log('='.repeat(50));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running at: http://${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('Press Ctrl+C to stop the server');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
