// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

/**
 * GET /api/auth/verify
 * Verify user token and get user info
 */
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name,
        emailVerified: req.user.emailVerified
      }
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Баталгаажуулалт амжилтгүй'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh user session (if needed)
 */
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Session шинэчлэгдсэн'
    });
  } catch (error) {
    console.error('Auth refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Session шинэчлэхэд алдаа гарлаа'
    });
  }
});

module.exports = router;