// ============================================
// IMMACURATE DRIVING SCHOOL MANAGEMENT SYSTEM
// Node.js Backend Server
// ============================================

import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

// Import routes
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import studentsRoutes from './routes/students.js'
import coursesRoutes from './routes/courses.js'
import lessonsRoutes from './routes/lessons.js'
import paymentsRoutes from './routes/payments.js'
import messagesRoutes from './routes/messages.js'
import reportsRoutes from './routes/reports.js'
import instructorsRoutes from './routes/instructors.js'
import vehiclesRoutes from './routes/vehicles.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Compression
app.use(compression())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Body parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  name: process.env.SESSION_NAME || 'dsms_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000
  }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
})

app.use('/api/', limiter)

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/instructors', instructorsRoutes)
app.use('/api/vehicles', vehiclesRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Immacurate DSMS API Server',
    version: process.env.APP_VERSION || '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  })
})

// Error handler
app.use(errorHandler)

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, HOST, () => {
  console.log('='.repeat(60))
  console.log(`🚗 ${process.env.APP_NAME || 'Immacurate DSMS API Server'}`)
  console.log('='.repeat(60))
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Server running at: http://${HOST}:${PORT}`)
  console.log(`Health check: http://${HOST}:${PORT}/health`)
  console.log('='.repeat(60))
  console.log('Press Ctrl+C to stop the server')
  console.log('='.repeat(60))
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app
