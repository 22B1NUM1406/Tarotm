const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const authMiddleware = require('../middleware/auth');

// Admin emails - зөвхөн эдгээр хаягууд админ эрхтэй
const ADMIN_EMAILS = [
  'admin@suntarot.mn',
  'manal0511@gmail.com',
  // Нэмэх админ и-мэйл энд нэмнэ
];

// Admin шалгах middleware
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
  }
  
  if (!ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ success: false, message: 'Админ эрх шаардлагатай' });
  }
  
  next();
};

// ── PUBLIC ROUTES ──

// Бүх нийтлэл авах (published only)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // ?type=news or ?type=blog
    const filter = { published: true };
    if (type) filter.type = type;

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')
      .limit(50);

    res.json({ success: true, articles });
  } catch (error) {
    console.error('Articles fetch error:', error);
    res.status(500).json({ success: false, message: 'Нийтлэл татахад алдаа гарлаа' });
  }
});

// Нэг нийтлэл авах
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || !article.published) {
      return res.status(404).json({ success: false, message: 'Нийтлэл олдсонгүй' });
    }
    res.json({ success: true, article });
  } catch (error) {
    console.error('Article fetch error:', error);
    res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
  }
});

// ── ADMIN ROUTES ──

// Бүх нийтлэл авах (including unpublished) - ADMIN ONLY
router.get('/admin/all', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ success: true, articles });
  } catch (error) {
    console.error('Admin articles fetch error:', error);
    res.status(500).json({ success: false, message: 'Алдаа гарлаа' });
  }
});

// Шинэ нийтлэл үүсгэх - ADMIN ONLY
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, type, imageUrl } = req.body;

    if (!title || !excerpt || !content || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Гарчиг, товч тайлбар, агуулга, төрөл заавал оруулна уу' 
      });
    }

    const article = new Article({
      title,
      excerpt,
      content,
      type,
      imageUrl,
      authorId: req.user.uid,
      author: req.user.email,
    });

    await article.save();
    res.status(201).json({ success: true, article });
  } catch (error) {
    console.error('Article create error:', error);
    res.status(500).json({ success: false, message: 'Нийтлэл үүсгэхэд алдаа гарлаа' });
  }
});

// Нийтлэл засах - ADMIN ONLY
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, type, imageUrl, published } = req.body;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Нийтлэл олдсонгүй' });
    }

    if (title) article.title = title;
    if (excerpt) article.excerpt = excerpt;
    if (content) article.content = content;
    if (type) article.type = type;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
    if (published !== undefined) article.published = published;

    await article.save();
    res.json({ success: true, article });
  } catch (error) {
    console.error('Article update error:', error);
    res.status(500).json({ success: false, message: 'Нийтлэл засахад алдаа гарлаа' });
  }
});

// Нийтлэл устгах - ADMIN ONLY
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Нийтлэл олдсонгүй' });
    }
    res.json({ success: true, message: 'Нийтлэл устгагдлаа' });
  } catch (error) {
    console.error('Article delete error:', error);
    res.status(500).json({ success: false, message: 'Нийтлэл устгахад алдаа гарлаа' });
  }
});

module.exports = router;