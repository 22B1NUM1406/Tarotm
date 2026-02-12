import React, { useState, useEffect } from 'react';
import { Check, RefreshCw, AlertCircle, Copy } from '../icons';
import { createQPayInvoice, checkPaymentStatus, PAYMENT_AMOUNT } from '../utils/qpayService';

const Payment = ({ user, onPaymentSuccess, navigateTo }) => {
  const [step, setStep]         = useState('confirm');
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(false);
  const [qrData, setQrData]     = useState(null);
  const [error, setError]       = useState('');
  const [countdown, setCountdown] = useState(0);
  const [autoCheckCount, setAutoCheckCount] = useState(0);
  const [accountCopied, setAccountCopied] = useState(false);

  // Данс мэдээлэл
  const ACCOUNT_INFO = {
    number: '680030003034015815',
    name: 'БАДАМХАНД НАЙДАН',
  };

  useEffect(() => {
    if (step !== 'waiting' || !qrData?.invoiceId) return;
    const interval = setInterval(async () => {
      const res = await checkPaymentStatus(qrData.invoiceId);
      setAutoCheckCount((c) => c + 1);
      if (res.paid) {
        clearInterval(interval);
        setStep('success');
        setTimeout(() => onPaymentSuccess?.(), 1500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [step, qrData]);

  useEffect(() => {
    if (!qrData?.expiresAt) return;
    const interval = setInterval(() => {
      const left = Math.floor((new Date(qrData.expiresAt) - Date.now()) / 1000);
      setCountdown(Math.max(0, left));
    }, 1000);
    return () => clearInterval(interval);
  }, [qrData]);

  const handlePay = async () => {
    setLoading(true);
    setError('');
    const result = await createQPayInvoice(user.uid);
    if (result.success) {
      setQrData(result);
      setStep('waiting');
    } else {
      setError(result.error || 'Төлбөрийн QR үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.');
    }
    setLoading(false);
  };

  const handleManualCheck = async () => {
    setChecking(true);
    setError('');
    const res = await checkPaymentStatus(qrData.invoiceId);
    if (res.paid) {
      setStep('success');
      setTimeout(() => onPaymentSuccess?.(), 1500);
    } else {
      setError('Төлбөр бүртгэгдээгүй байна. Төлсний дараа дахин дарна уу.');
    }
    setChecking(false);
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(ACCOUNT_INFO.number);
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-purple-900/40 backdrop-blur-lg rounded-3xl p-10 border border-purple-500/30">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/40" style={{ animation: 'popIn 0.4s ease-out' }}>
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Амжилттай!</h2>
          <p className="text-purple-300 mb-2">Таны 5,000₮ төлбөр баталгаажлаа.</p>
          <p className="text-purple-400 text-sm">Сэдвийн хуудас руу шилжиж байна...</p>
          <div className="flex gap-2 justify-center mt-6">
            {[0, 150, 300].map((d) => (
              <div key={d} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">

            {/* Данс мэдээлэл - TOP */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl border border-purple-500/30">
              <p className="text-purple-300 text-xs text-center mb-2">Хүлээн авагч данс</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-mono text-lg font-bold text-white tracking-wider">{ACCOUNT_INFO.number}</p>
                  <p className="text-purple-300 text-sm mt-1">{ACCOUNT_INFO.name}</p>
                </div>
                <button
                  onClick={copyAccountNumber}
                  className="p-3 bg-purple-700/40 hover:bg-purple-600/40 rounded-xl transition flex-shrink-0"
                  title="Данс хуулах"
                >
                  {accountCopied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-purple-300" />
                  )}
                </button>
              </div>
              {accountCopied && (
                <p className="text-green-400 text-xs text-center mt-2 animate-pulse">✓ Хуулагдлаа</p>
              )}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">QPay-ээр төлнө үү</h2>
              <p className="text-purple-300 text-sm">QR кодыг банкны апп-аар уншуулна уу</p>
              {countdown > 0 && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-700/40 rounded-full text-purple-300 text-xs">
                  ⏱ {fmtTime(countdown)} хүчинтэй
                </span>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 mb-5 text-center shadow-inner">
              {qrData?.qrImage ? (
                <img
                  src={`data:image/png;base64,${qrData.qrImage}`}
                  alt="QPay QR"
                  className="mx-auto w-52 h-52"
                />
              ) : (
                <div className="w-52 h-52 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex flex-col items-center justify-center">
                  <div className="text-5xl mb-2">📱</div>
                  <p className="text-purple-600 text-xs font-medium">QPay апп нээгдэнэ</p>
                  <p className="text-purple-400 text-xs mt-1">эсвэл линк ашиглана уу</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-900 font-bold text-2xl">5,000₮</p>
                <p className="text-gray-500 text-sm mt-0.5">Таротын уншлага · 1 удаа</p>
              </div>
            </div>

            {qrData?.urls?.length > 0 && (
              <div className="mb-5">
                <p className="text-purple-400 text-xs text-center mb-3">Банкны апп-аар нэвтрэх:</p>
                <div className="grid grid-cols-3 gap-2">
                  {qrData.urls.slice(0, 6).map((url, i) => (
                    <a
                      key={i}
                      href={url.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 p-2 bg-purple-800/40 rounded-xl hover:bg-purple-700/40 transition"
                    >
                      {url.logo && <img src={url.logo} alt={url.name} className="w-8 h-8 rounded-lg" />}
                      <span className="text-xs text-purple-300 text-center leading-tight">{url.name || url.description}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleManualCheck}
                disabled={checking}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Шалгаж байна...' : 'Төлбөр шалгах'}
              </button>
              <button
                onClick={() => { setStep('confirm'); setQrData(null); setError(''); }}
                className="w-full py-2.5 border border-purple-500/40 rounded-xl text-purple-300 hover:bg-purple-800/30 transition text-sm"
              >
                ← Буцах
              </button>
            </div>

            <p className="text-purple-500 text-xs text-center mt-4">
              {autoCheckCount > 0
                ? `${autoCheckCount} удаа автомат шалгасан · 5 секунд тутамд шалгана`
                : 'Төлсний дараа автоматаар шалгагдана (5 сек)'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl overflow-hidden border border-purple-500/30">
          <div className="bg-gradient-to-br from-purple-700/50 to-indigo-800/50 px-8 pt-10 pb-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-5xl">🎴</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Таротын уншлага</h2>
            <p className="text-purple-200 text-sm">Хөзөр сонгохын тулд төлбөр төлнө үү</p>
          </div>

          <div className="px-8 py-6 border-b border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-300">Үйлчилгээ</span>
              <span className="text-white font-semibold">1 удаагийн уншлага</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-300">Агуулга</span>
              <span className="text-white font-semibold">3 хөзөр · тайлбар</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
              <span className="text-purple-200 font-semibold">Нийт дүн</span>
              <span className="text-3xl font-bold text-white">5,000₮</span>
            </div>
          </div>

          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  QR үүсгэж байна...
                </>
              ) : (
                <>
                  <span className="text-xl">📱</span>
                  QPay-ээр төлөх
                </>
              )}
            </button>

            <p className="text-center text-purple-400 text-xs mt-4 flex items-center justify-center gap-1">
              <span>🔒</span> QPay найдвартай төлбөрийн систем
            </p>
          </div>
        </div>

        <div className="mt-4 bg-purple-900/20 rounded-2xl p-5 border border-purple-500/20">
          <h4 className="text-purple-200 font-semibold mb-3 text-sm">📋 Хэрхэн төлөх вэ?</h4>
          <div className="space-y-2">
            {[
              ['1', '"QPay-ээр төлөх" дарна'],
              ['2', 'QR кодыг банкны апп-аар уншуулна'],
              ['3', '5,000₮ төлбөрийг баталгаажуулна'],
              ['4', 'Автоматаар хөзөр сонгох хуудас нээгдэнэ'],
            ].map(([n, t]) => (
              <div key={n} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{n}</span>
                <span className="text-purple-300 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;