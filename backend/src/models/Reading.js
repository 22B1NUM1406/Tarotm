// src/models/Reading.js
const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  
  selectedTopic: {
    type: String,
    required: true
  },
  
  selectedCards: [{
    type: Number,
    required: true
  }],
  
  birthDate: {
    type: Date
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  
  result: {
    type: mongoose.Schema.Types.Mixed
  },
  
  metadata: {
    userAgent: String,
    ipAddress: String
  }
  
}, {
  timestamps: true
});

// Indexes
readingSchema.index({ userId: 1, createdAt: -1 });
readingSchema.index({ paymentId: 1 });

// Static method - Get user reading history
readingSchema.statics.getUserReadings = async function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('paymentId', 'plan amount');
};

// Static method - Count user readings
readingSchema.statics.countUserReadings = async function(userId) {
  return this.countDocuments({ userId });
};

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;