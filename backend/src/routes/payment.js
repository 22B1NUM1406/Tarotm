// src/routes/payment.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const qpayService = require('../services/qpayService');
const authMiddleware = require('../middleware/auth');

// Payment amounts
const PAYMENT_AMOUNTS = {
  single_reading: 5000,
  daily_unlimited: 10000,
  weekly_unlimited: 25000,
  monthly_unlimited: 80000
};

/**
 * POST /api/payment/create
 * Create new payment invoice
 */
router.post('/create',
  authMiddleware,
  [
    body('plan').isIn(['single_reading', 'daily_unlimited', 'weekly_unlimited', 'monthly_unlimited'])
      .withMessage('Буруу төлбөрийн багц'),
  ],
  async (req, res) => {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { plan } = req.body;
      const userId = req.user.uid;
      const amount = PAYMENT_AMOUNTS[plan];

      // Generate unique invoice ID
      const invoiceId = `TAROT_${Date.now()}_${userId.substring(0, 8)}`;

      // Check if user already has active payment
      const activePayment = await Payment.findActivePayment(userId);
      if (activePayment) {
        return res.status(400).json({
          success: false,
          message: 'Таньд идэвхтэй төлбөр байна',
          activePayment: {
            plan: activePayment.plan,
            expiresAt: activePayment.expiresAt
          }
        });
      }

      // Create QPay invoice
      const qpayResult = await qpayService.createInvoice({
        invoiceId,
        amount,
        description: `${plan} - Таротын мэргэ`
      });

      if (!qpayResult.success) {
        throw new Error('QPay invoice үүсгэхэд алдаа гарлаа');
      }

      // Save payment to database
      const payment = new Payment({
        userId,
        invoiceId,
        qpayInvoiceId: qpayResult.qpayInvoiceId,
        plan,
        amount,
        status: 'pending',
        qrCode: qpayResult.qrText,
        qrImage: qpayResult.qrImage,
        urls: qpayResult.urls,
        metadata: {
          userEmail: req.user.email,
          userName: req.user.name,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress
        }
      });

      await payment.save();

      res.json({
        success: true,
        payment: {
          invoiceId: payment.invoiceId,
          qpayInvoiceId: payment.qpayInvoiceId,
          amount: payment.amount,
          plan: payment.plan,
          qrText: payment.qrCode,
          qrImage: payment.qrImage,
          urls: payment.urls,
          expiresAt: payment.expiresAt
        }
      });

    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Төлбөр үүсгэхэд алдаа гарлаа'
      });
    }
  }
);

/**
 * GET /api/payment/check/:invoiceId
 * Check payment status
 */
router.get('/check/:invoiceId', authMiddleware, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.uid;

    // Find payment in database
    const payment = await Payment.findOne({ invoiceId, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Төлбөр олдсонгүй'
      });
    }

    // If already paid, return status
    if (payment.status === 'paid') {
      return res.json({
        success: true,
        paid: true,
        status: 'paid',
        paymentDate: payment.paymentDate,
        expiresAt: payment.expiresAt
      });
    }

    // Check QPay status
    const qpayStatus = await qpayService.checkPaymentStatus(payment.qpayInvoiceId);

    // Update payment if paid
    if (qpayStatus.paid && payment.status !== 'paid') {
      payment.status = 'paid';
      payment.paymentDate = qpayStatus.paymentDate || new Date();
      await payment.save();

      console.log(`✅ Төлбөр баталгаажлаа: ${invoiceId}`);
    }

    res.json({
      success: true,
      paid: qpayStatus.paid,
      status: qpayStatus.status,
      paymentDate: payment.paymentDate,
      expiresAt: payment.expiresAt
    });

  } catch (error) {
    console.error('Payment check error:', error);
    res.status(500).json({
      success: false,
      message: 'Төлбөр шалгахад алдаа гарлаа'
    });
  }
});

/**
 * GET /api/payment/user
 * Get user's active payment
 */
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;

    const activePayment = await Payment.findActivePayment(userId);

    if (!activePayment) {
      return res.json({
        success: true,
        hasActivePayment: false
      });
    }

    res.json({
      success: true,
      hasActivePayment: true,
      payment: {
        plan: activePayment.plan,
        amount: activePayment.amount,
        paymentDate: activePayment.paymentDate,
        expiresAt: activePayment.expiresAt,
        isActive: activePayment.isActive
      }
    });

  } catch (error) {
    console.error('Get user payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Төлбөрийн мэдээлэл авахад алдаа гарлаа'
    });
  }
});

/**
 * GET /api/payment/history
 * Get user's payment history
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const limit = parseInt(req.query.limit) || 10;

    const payments = await Payment.getUserHistory(userId, limit);

    res.json({
      success: true,
      payments: payments.map(p => ({
        invoiceId: p.invoiceId,
        plan: p.plan,
        amount: p.amount,
        status: p.status,
        paymentDate: p.paymentDate,
        expiresAt: p.expiresAt,
        createdAt: p.createdAt
      }))
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Төлбөрийн түүх авахад алдаа гарлаа'
    });
  }
});

/**
 * POST /api/payment/webhook
 * QPay webhook endpoint
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-qpay-signature'];
    const payload = req.body;

    console.log('📥 QPay webhook хүлээн авлаа');

    // Verify signature (if webhook secret is set)
    if (process.env.QPAY_WEBHOOK_SECRET) {
      const isValid = qpayService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // Process payment webhook
    if (payload.payment_status === 'PAID') {
      const payment = await Payment.findOne({ 
        qpayInvoiceId: payload.invoice_id 
      });

      if (payment && payment.status !== 'paid') {
        payment.status = 'paid';
        payment.paymentDate = new Date(payload.payment_date) || new Date();
        payment.webhookReceived = true;
        payment.webhookData = payload;
        await payment.save();

        console.log(`✅ Webhook: Төлбөр баталгаажлаа ${payment.invoiceId}`);
      }
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;