// src/services/qpayService.js
const axios = require('axios');

const QPAY_CONFIG = {
  apiUrl: 'https://merchant.qpay.mn/v2',
  username: process.env.QPAY_USERNAME,
  password: process.env.QPAY_PASSWORD,
  invoiceCode: process.env.QPAY_INVOICE_CODE || 'TAROT_INVOICE'
};

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get QPay Access Token
 */
async function getAccessToken() {
  try {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
      return cachedToken;
    }

    const authString = Buffer.from(
      `${QPAY_CONFIG.username}:${QPAY_CONFIG.password}`
    ).toString('base64');

    const response = await axios.post(
      `${QPAY_CONFIG.apiUrl}/auth/token`,
      {},
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.access_token) {
      cachedToken = response.data.access_token;
      // Token expires in 1 hour, refresh 5 minutes before
      tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
      
      console.log('✅ QPay token авлаа');
      return cachedToken;
    }

    throw new Error('QPay token авч чадсангүй');
  } catch (error) {
    console.error('❌ QPay token алдаа:', error.response?.data || error.message);
    throw new Error('QPay authentication failed');
  }
}

/**
 * Create QPay Invoice
 */
async function createInvoice(invoiceData) {
  try {
    const token = await getAccessToken();
    
    const payload = {
      invoice_code: QPAY_CONFIG.invoiceCode,
      sender_invoice_no: invoiceData.invoiceId,
      invoice_receiver_code: 'terminal',
      invoice_description: invoiceData.description || 'Таротын уншлага',
      amount: invoiceData.amount,
      callback_url: `${process.env.BACKEND_URL}/api/payment/webhook`
    };

    console.log('📤 QPay invoice үүсгэж байна:', payload.sender_invoice_no);

    const response = await axios.post(
      `${QPAY_CONFIG.apiUrl}/invoice`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data) {
      console.log('✅ QPay invoice үүссэн:', response.data.invoice_id);
      
      return {
        success: true,
        invoiceId: response.data.invoice_id,
        qpayInvoiceId: response.data.invoice_id,
        qrText: response.data.qr_text,
        qrImage: response.data.qr_image,
        urls: response.data.urls || []
      };
    }

    throw new Error('Invalid QPay response');
  } catch (error) {
    console.error('❌ QPay invoice алдаа:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Invoice үүсгэхэд алдаа гарлаа');
  }
}

/**
 * Check QPay Payment Status
 */
async function checkPaymentStatus(qpayInvoiceId) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${QPAY_CONFIG.apiUrl}/payment/check`,
      {
        object_type: 'INVOICE',
        object_id: qpayInvoiceId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.rows && response.data.rows.length > 0) {
      const payment = response.data.rows[0];
      
      return {
        success: true,
        paid: payment.payment_status === 'PAID',
        status: payment.payment_status,
        paymentDate: payment.payment_date,
        paidAmount: payment.paid_amount,
        data: payment
      };
    }

    return {
      success: true,
      paid: false,
      status: 'PENDING'
    };
  } catch (error) {
    console.error('❌ QPay status шалгах алдаа:', error.response?.data || error.message);
    throw new Error('Төлбөрийн статус шалгахад алдаа гарлаа');
  }
}

/**
 * Cancel QPay Invoice
 */
async function cancelInvoice(qpayInvoiceId) {
  try {
    const token = await getAccessToken();

    const response = await axios.delete(
      `${QPAY_CONFIG.apiUrl}/invoice/${qpayInvoiceId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      message: 'Invoice цуцлагдсан'
    };
  } catch (error) {
    console.error('❌ QPay invoice цуцлах алдаа:', error.response?.data || error.message);
    throw new Error('Invoice цуцлахад алдаа гарлаа');
  }
}

/**
 * Verify Webhook Signature
 */
function verifyWebhookSignature(payload, signature) {
  const crypto = require('crypto');
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.QPAY_WEBHOOK_SECRET || 'default_secret')
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}

module.exports = {
  createInvoice,
  checkPaymentStatus,
  cancelInvoice,
  verifyWebhookSignature
};