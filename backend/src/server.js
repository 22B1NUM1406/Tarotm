// src/server.js - Production Backend Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const paymentRoutes = require('./routes/payment');
const readingRoutes = require('./routes/reading');
const authRoutes = require('./routes/auth');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS - Multi-domain support
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://suntarot.mn',
  'https://www.suntarot.mn',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // No origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    // Exact match
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Wildcard: *.suntarot.mn, *.vercel.app
    if (origin.endsWith('.suntarot.mn') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Block others
    console.warn(`❌ CORS blocked: ${origin}`);
    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

console.log('✅ CORS configured for:', allowedOrigins);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Хэт олон хүсэлт илгээсэн байна. Түр хүлээнэ үү.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Төлбөрийн хүсэлт хэт олон байна. 15 минутын дараа дахин оролдоно уу.',
});

// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB холбогдсон');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ MongoDB холбогдох алдаа:', err);
  process.exit(1);
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentLimiter, paymentRoutes);
app.use('/api/reading', authMiddleware, readingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint олдсонгүй'
  });
});

// Error handler
app.use(errorHandler);

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
  console.log('SIGTERM сигнал хүлээн авлаа, server-ийг зогсоож байна...');
  server.close(() => {
    console.log('Server зогссон');
    mongoose.connection.close(false, () => {
      console.log('MongoDB холболт хаагдлаа');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// ==================== START SERVER ====================

const server = app.listen(PORT, () => {
  console.log('🚀 Server эхэллээ');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
});

module.exports = app;