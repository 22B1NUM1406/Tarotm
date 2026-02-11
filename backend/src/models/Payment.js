// src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID шаардлагатай'],
    index: true
  },
  
  invoiceId: {
    type: String,
    required: [true, 'Invoice ID шаардлагатай'],
    unique: true,
    index: true
  },
  
  qpayInvoiceId: {
    type: String,
    index: true
  },
  
  plan: {
    type: String,
    required: [true, 'Plan сонгох шаардлагатай'],
    enum: ['single_reading', 'daily_unlimited', 'weekly_unlimited', 'monthly_unlimited']
  },
  
  amount: {
    type: Number,
    required: [true, 'Төлбөрийн дүн шаардлагатай'],
    min: [0, 'Төлбөрийн дүн 0-ээс их байх ёстой']
  },
  
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'expired', 'refunded'],
    default: 'pending',
    index: true
  },
  
  paymentDate: {
    type: Date
  },
  
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  
  qrCode: {
    type: String
  },
  
  qrImage: {
    type: String
  },
  
  urls: [{
    name: String,
    description: String,
    logo: String,
    link: String
  }],
  
  metadata: {
    userEmail: String,
    userName: String,
    userAgent: String,
    ipAddress: String,
    referer: String
  },
  
  webhookReceived: {
    type: Boolean,
    default: false
  },
  
  webhookData: {
    type: mongoose.Schema.Types.Mixed
  }
  
}, {
  timestamps: true
});

// Indexes for performance
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ expiresAt: 1 });

// TTL index - автоматаар устгах expired payments (30 хоногийн дараа)
paymentSchema.index({ expiresAt: 1 }, { 
  expireAfterSeconds: 30 * 24 * 60 * 60 
});

// Virtual for checking if payment is active
paymentSchema.virtual('isActive').get(function() {
  return this.status === 'paid' && this.expiresAt > new Date();
});

// Instance method - Check if payment is expired
paymentSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

// Static method - Find active payment for user
paymentSchema.statics.findActivePayment = async function(userId) {
  return this.findOne({
    userId,
    status: 'paid',
    expiresAt: { $gt: new Date() }
  }).sort({ expiresAt: -1 });
};

// Static method - Get user payment history
paymentSchema.statics.getUserHistory = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-qrImage -webhookData');
};

// Pre-save hook - Calculate expiresAt based on plan
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    const now = new Date();
    
    switch(this.plan) {
      case 'single_reading':
        this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'daily_unlimited':
        this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'weekly_unlimited':
        this.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      case 'monthly_unlimited':
        this.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      default:
        this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
  next();
});

// Post-save hook - Log payment creation
paymentSchema.post('save', function(doc) {
  console.log(`💳 Payment created: ${doc.invoiceId} - ${doc.plan} - ${doc.amount}₮`);
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;