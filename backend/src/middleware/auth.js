// src/middleware/auth.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

if (!admin.apps.length) {
  const keyPath = path.join(__dirname, '../../serviceAccountKey.json');

  if (!fs.existsSync(keyPath)) {
    console.error('');
    console.error('❌ serviceAccountKey.json файл олдсонгүй!');
    console.error('');
    console.error('📋 Дараах алхмыг дагана уу:');
    console.error('  1. https://console.firebase.google.com/ руу орох');
    console.error('  2. Таны Project сонгох');
    console.error('  3. Project Settings (⚙️) → Service accounts tab');
    console.error('  4. "Generate new private key" товч дарах');
    console.error('  5. Татагдсан JSON файлыг:');
    console.error('     backend/serviceAccountKey.json гэж хадгалах');
    console.error('');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin SDK амжилттай эхэллээ');
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Нэвтрэх шаардлагатай',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token дууссан. Дахин нэвтэрнэ үү.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Баталгаажуулалт амжилтгүй',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        emailVerified: decodedToken.email_verified,
      };
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;