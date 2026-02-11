// utils/qpayService.js

// ⚠️ Hardcode хийсэн — environment variable ажиллахгүй байвал энийг ашиглана
const API_URL = import.meta.env.VITE_API_URL || 'https://tarotm-production.up.railway.app';
const PAYMENT_AMOUNT = 5000;

async function getToken() {
  try {
    const { auth } = await import('../data/firebaseConfig');
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  } catch {
    return null;
  }
}

export async function createQPayInvoice(userId) {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ plan: 'single_reading' }),
    });
    const data = await res.json();
    if (data.success) return { success: true, ...data.payment };
    throw new Error(data.message);
  } catch (err) {
    console.error('createQPayInvoice error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function checkPaymentStatus(invoiceId) {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/payment/check/${invoiceId}`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    const data = await res.json();
    return { success: true, paid: data.paid, expiresAt: data.expiresAt };
  } catch {
    return { success: false, paid: false };
  }
}

export async function checkActivePayment(userId) {
  if (!userId) return false;
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/payment/user`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    const data = await res.json();
    return data.success && data.hasActivePayment;
  } catch {
    return false;
  }
}

export { PAYMENT_AMOUNT };