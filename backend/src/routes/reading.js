// src/routes/reading.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Reading = require('../models/Reading');
const Payment = require('../models/Payment');

/**
 * POST /api/reading/save
 * Save reading result
 */
router.post('/save',
  [
    body('selectedTopic').notEmpty().withMessage('Сэдэв сонгоно уу'),
    body('selectedCards').isArray({ min: 3, max: 3 }).withMessage('3 хөзөр сонгоно уу'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const userId = req.user.uid;
      const { selectedTopic, selectedCards, birthDate, gender, result } = req.body;

      // Check if user has active payment
      const activePayment = await Payment.findActivePayment(userId);
      if (!activePayment) {
        return res.status(403).json({
          success: false,
          message: 'Идэвхтэй төлбөр байхгүй байна'
        });
      }

      // Check reading limit for single_reading plan
      if (activePayment.plan === 'single_reading') {
        const existingReadings = await Reading.countDocuments({
          userId,
          paymentId: activePayment._id
        });

        if (existingReadings >= 1) {
          return res.status(403).json({
            success: false,
            message: '1 удаагийн багцаар зөвхөн 1 уншлага хийх боломжтой'
          });
        }
      }

      // Create reading
      const reading = new Reading({
        userId,
        paymentId: activePayment._id,
        selectedTopic,
        selectedCards,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        result,
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress
        }
      });

      await reading.save();

      res.json({
        success: true,
        reading: {
          id: reading._id,
          selectedTopic: reading.selectedTopic,
          selectedCards: reading.selectedCards,
          createdAt: reading.createdAt
        }
      });

    } catch (error) {
      console.error('Save reading error:', error);
      res.status(500).json({
        success: false,
        message: 'Уншлага хадгалахад алдаа гарлаа'
      });
    }
  }
);

/**
 * GET /api/reading/history
 * Get user's reading history
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.uid;
    const limit = parseInt(req.query.limit) || 20;

    const readings = await Reading.getUserReadings(userId, limit);

    res.json({
      success: true,
      readings: readings.map(r => ({
        id: r._id,
        selectedTopic: r.selectedTopic,
        selectedCards: r.selectedCards,
        createdAt: r.createdAt,
        payment: r.paymentId ? {
          plan: r.paymentId.plan,
          amount: r.paymentId.amount
        } : null
      }))
    });

  } catch (error) {
    console.error('Reading history error:', error);
    res.status(500).json({
      success: false,
      message: 'Уншлагын түүх авахад алдаа гарлаа'
    });
  }
});

/**
 * GET /api/reading/stats
 * Get user's reading statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.uid;

    const totalReadings = await Reading.countUserReadings(userId);
    const activePayment = await Payment.findActivePayment(userId);

    res.json({
      success: true,
      stats: {
        totalReadings,
        hasActivePayment: !!activePayment,
        activePlan: activePayment?.plan,
        expiresAt: activePayment?.expiresAt
      }
    });

  } catch (error) {
    console.error('Reading stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Статистик авахад алдаа гарлаа'
    });
  }
});

module.exports = router;