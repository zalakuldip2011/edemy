const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

// Protect middleware - Check if user is authenticated
const protect = async (req, res, next) => {
  try {
    console.log('🔐 AUTH MIDDLEWARE - Checking authentication...');
    
    // 1) Getting token and check if it's there
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('   Token from Authorization header:', token ? token.substring(0, 20) + '...' : 'EMPTY');
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('   Token from cookie:', token ? token.substring(0, 20) + '...' : 'EMPTY');
    }

    if (!token) {
      console.error('   ❌ No token found in request');
      return res.status(401).json({
        success: false,
        message: 'You are not logged in! Please log in to get access.',
        code: 'NO_TOKEN'
      });
    }

    // 2) Verification token
    console.log('   Verifying token...');
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('   ✅ Token verified. User ID:', decoded.id);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.error('   ❌ User not found in database:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token does no longer exist.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    console.log('   ✅ User found:', currentUser.username, '(', currentUser.email, ')');

    // 4) Check if user is active
    if (!currentUser.isActive) {
      console.error('   ❌ User account is deactivated');
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      console.error('   ❌ Password changed after token issued');
      return res.status(401).json({
        success: false,
        message: 'User recently changed password! Please log in again.',
        code: 'PASSWORD_CHANGED'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    console.log('   ✅ Authentication successful. User role:', currentUser.role);
    next();
  } catch (error) {
    console.error('   ❌ Authentication error:', error.message);
    console.error('   Error name:', error.name);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again!',
        code: 'INVALID_TOKEN'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your token has expired! Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  };
};

// Optional authentication - doesn't throw error if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && currentUser.isActive && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  auth: protect, // Alias for compatibility
  requireRole: restrictTo // Alias for compatibility
};