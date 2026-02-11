// src/services/qpayService.js — QPay API v2 (Postman collection-д тулгуурласан)

const axios = require('axios');

const QPAY_BASE_URL = 'https://merchant.qpay.mn/v2';

// Token cache
let tokenCache = {
  access_token: null,
  refresh_token: null,
  expires_at: null,
};

// ─────────────────────────────────────────
//  1. Token авах / refresh хийх
// ─────────────────────────────────────────
async function getAccessToken() {
  const now = Date.now();

  // Cache хүчинтэй байвал буцаана
  if (tokenCache.access_token && tokenCache.expires_at > now + 60000) {
    return tokenCache.access_token;
  }

  // Refresh token байвал refresh хийнэ
  if (tokenCache.refresh_token && tokenCache.expires_at > now) {
    try {
      const res = await axios.post(
        `${QPAY_BASE_URL}/auth/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${tokenCache.refresh_token}` },
        }
      );
      tokenCache = {
        access_token:  res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_at:    now + 55 * 60 * 1000, // 55 минут
      };
      console.log('🔄 QPay token refresh хийлээ');
      return tokenCache.access_token;
    } catch {
      // Refresh алдаатай бол шинэ token авна
    }
  }

  // Шинэ token авах — Basic Auth (username:password)
  const res = await axios.post(
    `${QPAY_BASE_URL}/auth/token`,
    {},
    {
      auth: {
        username: process.env.QPAY_USERNAME,
        password: process.env.QPAY_PASSWORD,
      },
    }
  );

  tokenCache = {
    access_token:  res.data.access_token,
    refresh_token: res.data.refresh_token,
    expires_at:    now + 55 * 60 * 1000,
  };

  console.log('✅ QPay token авлаа');
  return tokenCache.access_token;
}

// ─────────────────────────────────────────
//  2. Invoice үүсгэх
// ─────────────────────────────────────────
async function createInvoice({ invoiceNo, amount, description, callbackUrl }) {
  const token = await getAccessToken();

  const body = {
    invoice_code:          process.env.QPAY_INVOICE_CODE,  // QPay-с авсан invoice code
    sender_invoice_no:     invoiceNo,                       // Манай unique ID
    invoice_receiver_code: 'terminal',
    invoice_description:   description || 'Таротын уншлага',
    amount:                amount,
    callback_url:          callbackUrl,
  };

  const res = await axios.post(`${QPAY_BASE_URL}/invoice`, body, {
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    invoice_id:  res.data.invoice_id,
    qr_text:     res.data.qr_text,
    qr_image:    res.data.qr_image,    // base64 PNG
    urls:        res.data.urls || [],  // Банкны апп линкүүд
  };
}

// ─────────────────────────────────────────
//  3. Төлбөр шалгах
// ─────────────────────────────────────────
async function checkPayment(invoiceId) {
  const token = await getAccessToken();

  const body = {
    object_type: 'INVOICE',
    object_id:   invoiceId,
    offset: {
      page_number: 1,
      page_limit:  100,
    },
  };

  const res = await axios.post(`${QPAY_BASE_URL}/payment/check`, body, {
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // count > 0 бол төлбөр хийгдсэн
  const paid = res.data.count > 0;
  return {
    paid,
    count:    res.data.count,
    payments: res.data.rows || [],
  };
}

// ─────────────────────────────────────────
//  4. Invoice цуцлах
// ─────────────────────────────────────────
async function cancelInvoice(invoiceId) {
  const token = await getAccessToken();

  await axios.delete(`${QPAY_BASE_URL}/invoice/${invoiceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { cancelled: true };
}

// ─────────────────────────────────────────
//  5. Нэг төлбөрийн дэлгэрэнгүй
// ─────────────────────────────────────────
async function getPayment(paymentId) {
  const token = await getAccessToken();

  const res = await axios.get(`${QPAY_BASE_URL}/payment/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

module.exports = {
  getAccessToken,
  createInvoice,
  checkPayment,
  cancelInvoice,
  getPayment,
};