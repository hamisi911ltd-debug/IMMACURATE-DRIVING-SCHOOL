// Error Handler Middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  // Otherwise render error page
  res.status(status).render('error', {
    title: `${status} - Error`,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = {
  errorHandler
};
