const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['news', 'blog'],
    required: true,
  },
  author: {
    type: String,
    default: 'Admin',
  },
  authorId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  published: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

articleSchema.index({ type: 1, createdAt: -1 });
articleSchema.index({ published: 1 });

module.exports = mongoose.model('Article', articleSchema);