// src/middleware/auth.js
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

  // Option 1: serviceAccountKey.json (RECOMMENDED)
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('✅ Firebase Admin SDK (serviceAccountKey.json)');

  // Option 2: Environment variables
  } else {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const privateKey = rawKey
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');

    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.error('❌ Firebase credentials дутуу байна!');
      console.error('');
      console.error('👉 Хялбар шийдэл:');
      console.error('  1. Firebase Console → Project Settings → Service Accounts');
      console.error('  2. "Generate new private key" дарж JSON татах');
      console.error('  3. backend/ дотор "serviceAccountKey.json" нэрээр хадгалах');
      process.exit(1);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('✅ Firebase Admin SDK (env variable)');
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
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
      return res.status(401).json({ success: false, message: 'Token дууссан. Дахин нэвтэрнэ үү.' });
    }
    return res.status(401).json({ success: false, message: 'Баталгаажуулалт амжилтгүй' });
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