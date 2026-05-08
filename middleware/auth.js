// Authentication Middleware

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Please login to access this resource'
    });
  }
  
  // Otherwise redirect to login
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'system-admin') {
    return next();
  }
  
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'You do not have permission to access this resource'
    });
  }
  
  res.status(403).render('error', {
    title: '403 - Forbidden',
    message: 'You do not have permission to access this page.',
    error: { status: 403 }
  });
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isGuest
};
