// Authentication Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { dbGet } = require('../config/database');
const { isGuest } = require('../middleware/auth');

// Login page
router.get('/login', isGuest, (req, res) => {
  res.render('login', {
    title: 'Login',
    error: null
  });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('login', {
        title: 'Login',
        error: 'Please provide email and password'
      });
    }
    
    // Find user
    const user = await dbGet(
      'SELECT * FROM system_users WHERE email = ? AND status = "active"',
      [email]
    );
    
    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }
    
    // Create session
    req.session.user = {
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role
    };
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login',
      error: 'An error occurred. Please try again.'
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
