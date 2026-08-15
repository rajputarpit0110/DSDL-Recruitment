const rateLimit = require('express-rate-limit');

// Public registration rate limit: 20 registrations per 15 minutes per IP
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many registration requests from this IP. Please wait a few minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Admin login rate limit: 20 login attempts per 15 minutes per IP in dev
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many failed login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { registrationLimiter, adminLoginLimiter };
