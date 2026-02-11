// utils/qpayService.js — Vite + QPay (5,000₮ нэг үнэтэй)

const API_URL = import.meta.env.VITE_API_URL;  // tarotweb/.env → VITE_API_URL=http://localhost:5000
const PAYMENT_AMOUNT = 5000;

// ── Firebase token авах ──
async function getToken() {
  try {
    const { auth } = await import('../data/firebaseConfig');
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  } catch {
    return null;
  }
}

// ── Invoice үүсгэх ──
export async function createQPayInvoice(userId) {
  if (API_URL) {
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
      console.error('Backend invoice error:', err.message);
      return { success: false, error: err.message };
    }
  }
  // Backend байхгүй үед localStorage fallback
  return _localCreateInvoice(userId);
}

// ── Төлбөрийн статус шалгах ──
export async function checkPaymentStatus(invoiceId) {
  if (API_URL) {
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
  return _localCheckStatus(invoiceId);
}

// ── Идэвхтэй төлбөр байгаа эсэх ──
export async function checkActivePayment(userId) {
  if (!userId) return false;
  if (API_URL) {
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
  return _localCheckActive(userId);
}

export { PAYMENT_AMOUNT };

// ══════════════════════════════════════════
// FALLBACK — localStorage (backend байхгүй)
// ══════════════════════════════════════════
function _localCreateInvoice(userId) {
  const invoiceId = `LOCAL_${Date.now()}_${(userId || 'anon').slice(0, 6)}`;
  localStorage.setItem(
    `inv_${invoiceId}`,
    JSON.stringify({ userId, status: 'pending', amount: PAYMENT_AMOUNT, createdAt: Date.now() })
  );
  return {
    success: true,
    invoiceId,
    qpayInvoiceId: invoiceId,
    qrText: invoiceId,
    qrImage: null,
    urls: [],
    amount: PAYMENT_AMOUNT,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    isLocalFallback: true,
  };
}

function _localCheckStatus(invoiceId) {
  try {
    const raw = localStorage.getItem(`inv_${invoiceId}`);
    if (!raw) return { success: false, paid: false };
    return { success: true, paid: JSON.parse(raw).status === 'paid' };
  } catch {
    return { success: false, paid: false };
  }
}

function _localCheckActive(userId) {
  try {
    const raw = localStorage.getItem(`qpay_${userId}`);
    if (!raw) return false;
    const d = JSON.parse(raw);
    return d.paid && d.expiresAt > Date.now();
  } catch {
    return false;
  }
}

// ── DEV TEST: Браузер console-аас дуудаж болно ──
// window.__testPay = (userId) => { localStorage.setItem(`qpay_${userId}`, JSON.stringify({ paid: true, expiresAt: Date.now() + 86400000 })); location.reload(); }