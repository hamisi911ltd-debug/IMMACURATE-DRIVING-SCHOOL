export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // Default error
  let status = err.status || 500
  let message = err.message || 'Internal server error'
  let errors = err.errors || null

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400
    message = 'Validation failed'
    errors = err.errors
  }

  // Database errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    status = 409
    message = 'Database constraint violation'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    status = 401
    message = 'Token expired'
  }

  // Send error response
  res.status(status).json({
    success: false,
    error: message,
    errors: errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
