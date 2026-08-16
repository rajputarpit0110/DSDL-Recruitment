const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Allows frontend asset loading during development
}));

// CORS Configuration — production allows only FRONTEND_URL; dev adds localhost helpers
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permit requests with no Origin header (mobile apps, Render health checks, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Handle OPTIONS preflight BEFORE all routes (same corsOptions — no mismatch)
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Body & Cookie Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'DSDL Recruitment API is operational.' });
});

// API Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again later.'
  });
});

module.exports = app;
