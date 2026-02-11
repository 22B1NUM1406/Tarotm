// src/routes/payment.js
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const qpay = require('../services/qpayService');
const Payment = require('../models/Payment');

const BACKEND_URL  = process.env.BACKEND_URL  || 'http://localhost:5000';
const PAYMENT_AMOUNT = 5000;

// ─────────────────────────────────────────
//  POST /api/payment/create
//  Invoice үүсгэх
// ─────────────────────────────────────────
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { uid, email } = req.user;

    // Идэвхтэй төлбөр байгаа эсэх шалгах
    const existing = await Payment.findActivePayment(uid);
    if (existing) {
      return res.json({
        success: true,
        alreadyPaid: true,
        payment: {
          invoiceId:  existing.invoiceId,
          plan:       existing.plan,
          amount:     existing.amount,
          expiresAt:  existing.expiresAt,
          isActive:   true,
        },
      });
    }

    // Unique invoice number
    const invoiceNo = `TAROT_${uid.slice(0, 8)}_${Date.now()}`;

    // QPay invoice үүсгэх
    const qpayResult = await qpay.createInvoice({
      invoiceNo,
      amount:      PAYMENT_AMOUNT,
      description: 'Таротын уншлага - 1 удаа',
      callbackUrl: `${BACKEND_URL}/api/payment/webhook?invoice_no=${invoiceNo}`,
    });

    // Database-д хадгалах
    const payment = new Payment({
      userId:        uid,
      invoiceId:     invoiceNo,
      qpayInvoiceId: qpayResult.invoice_id,
      plan:          'single_reading',
      amount:        PAYMENT_AMOUNT,
      status:        'pending',
      expiresAt:     new Date(Date.now() + 24 * 60 * 60 * 1000),
      qrCode:        qpayResult.qr_text,
      qrImage:       qpayResult.qr_image,
      urls:          qpayResult.urls,
      metadata:      { userEmail: email },
    });

    await payment.save();

    res.json({
      success: true,
      payment: {
        invoiceId:     invoiceNo,
        qpayInvoiceId: qpayResult.invoice_id,
        qrText:        qpayResult.qr_text,
        qrImage:       qpayResult.qr_image,
        urls:          qpayResult.urls,
        amount:        PAYMENT_AMOUNT,
        expiresAt:     payment.expiresAt,
      },
    });

  } catch (err) {
    console.error('Payment create error:', err.message);
    res.status(500).json({ success: false, message: 'Invoice үүсгэхэд алдаа гарлаа: ' + err.message });
  }
});

// ─────────────────────────────────────────
//  GET /api/payment/check/:invoiceId
//  Төлбөрийн статус шалгах
// ─────────────────────────────────────────
router.get('/check/:invoiceId', authMiddleware, async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const payment = await Payment.findOne({ invoiceId, userId: req.user.uid });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Invoice олдсонгүй' });
    }

    // Аль хэдийн төлсөн бол шууд буцаана
    if (payment.status === 'paid') {
      return res.json({
        success:    true,
        paid:       true,
        status:     'paid',
        expiresAt:  payment.expiresAt,
        paymentDate: payment.paymentDate,
      });
    }

    // QPay-аас шалгах
    const result = await qpay.checkPayment(payment.qpayInvoiceId);

    if (result.paid) {
      // Database шинэчлэх
      payment.status      = 'paid';
      payment.paymentDate = new Date();
      await payment.save();

      return res.json({
        success:     true,
        paid:        true,
        status:      'paid',
        expiresAt:   payment.expiresAt,
        paymentDate: payment.paymentDate,
      });
    }

    res.json({ success: true, paid: false, status: payment.status });

  } catch (err) {
    console.error('Payment check error:', err.message);
    res.status(500).json({ success: false, message: 'Төлбөр шалгахад алдаа гарлаа' });
  }
});

// ─────────────────────────────────────────
//  GET /api/payment/user
//  Хэрэглэгчийн идэвхтэй төлбөр
// ─────────────────────────────────────────
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findActivePayment(req.user.uid);

    if (!payment) {
      return res.json({ success: true, hasActivePayment: false });
    }

    res.json({
      success:          true,
      hasActivePayment: true,
      payment: {
        invoiceId:   payment.invoiceId,
        plan:        payment.plan,
        amount:      payment.amount,
        paymentDate: payment.paymentDate,
        expiresAt:   payment.expiresAt,
        isActive:    true,
      },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
  }
});

// ─────────────────────────────────────────
//  POST /api/payment/webhook
//  QPay callback
// ─────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  try {
    const invoiceNo = req.query.invoice_no || req.body.invoice_no;
    if (!invoiceNo) return res.status(400).json({ message: 'invoice_no байхгүй' });

    const payment = await Payment.findOne({ invoiceId: invoiceNo });
    if (!payment) return res.status(404).json({ message: 'Payment олдсонгүй' });

    if (payment.status !== 'paid') {
      // QPay-аас баталгаажуулах
      const result = await qpay.checkPayment(payment.qpayInvoiceId);
      if (result.paid) {
        payment.status          = 'paid';
        payment.paymentDate     = new Date();
        payment.webhookReceived = true;
        payment.webhookData     = req.body;
        await payment.save();
        console.log(`✅ Webhook: ${invoiceNo} төлбөр баталгаажлаа`);
      }
    }

    res.json({ message: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ message: 'Алдаа' });
  }
});

module.exports = router;