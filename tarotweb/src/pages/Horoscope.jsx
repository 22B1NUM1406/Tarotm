import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, Star, TrendingUp, Users, Heart, Briefcase, Activity, DollarSign, ChevronRight, RefreshCw } from '../icons';
import { generateHoroscope, ZODIAC_SIGNS, getZodiacFromDate } from '../utils/horoscopeGenerator';

const Horoscope = () => {
  const [birthDate, setBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Өдөр бүр автоматаар шинэчлэгдэх
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(now);
        if (zodiacSign) {
          updateHoroscope(zodiacSign, selectedPeriod);
        }
      }
    }, 60000); // Минут бүр шалгах

    return () => clearInterval(interval);
  }, [currentDate, zodiacSign, selectedPeriod]);

  useEffect(() => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setBirthDate(dateString);
    calculateZodiac(dateString);
  }, []);

  const calculateZodiac = (date) => {
    const zodiacId = getZodiacFromDate(date);
    setZodiacSign(zodiacId);
    updateHoroscope(zodiacId, selectedPeriod);
  };

  const updateHoroscope = (zodiacId, period) => {
    const data = generateHoroscope(zodiacId, period, currentDate);
    setHoroscopeData(data);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBirthDate(date);
    calculateZodiac(date);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (zodiacSign) {
      updateHoroscope(zodiacSign, period);
    }
  };

  const refreshHoroscope = () => {
    if (zodiacSign) {
      updateHoroscope(zodiacSign, selectedPeriod);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌟 Өдөр бүр шинэчлэгддэг зурхай
        </h1>
        <p className="text-xl text-purple-300 max-w-3xl mx-auto">
          Орд сонгоод, өдөр, долоо хоног, сар, жилийн зурхайгаа үзнэ үү
        </p>
      </div>

      {/* Date and Zodiac Selector */}
      <div className="bg-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-purple-300 mb-2 text-sm font-medium">
              <Calendar className="inline w-4 h-4 mr-2" />
              Төрсөн өдрөөр зурхай тодорхойлох
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={handleDateChange}
              className="w-full px-4 py-3 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white focus:outline-none focus:border-purple-400"
            />
          </div>
          
          <div>
            <label className="block text-purple-300 mb-2 text-sm font-medium">
              <Star className="inline w-4 h-4 mr-2" />
              Орд шууд сонгох
            </label>
            <select
              value={zodiacSign}
              onChange={(e) => {
                setZodiacSign(e.target.value);
                updateHoroscope(e.target.value, selectedPeriod);
              }}
              className="w-full px-4 py-3 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white focus:outline-none focus:border-purple-400"
            >
              <option value="">Орд сонгох</option>
              {ZODIAC_SIGNS.map((sign) => (
                <option key={sign.id} value={sign.id}>
                  {sign.icon} {sign.name} ({sign.dates})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              selectedPeriod === period
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/50'
                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            }`}
          >
            {period === 'daily' && 'Өдөр'}
            {period === 'weekly' && 'Долоо хоног'}
            {period === 'monthly' && 'Сар'}
            {period === 'yearly' && 'Жил'}
            {selectedPeriod === period && <ChevronRight className="w-4 h-4" />}
          </button>
        ))}
        <button
          onClick={refreshHoroscope}
          className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all"
          title="Шинэчлэх"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Zodiac Info */}
      {zodiacSign && (
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {ZODIAC_SIGNS.find(z => z.id === zodiacSign)?.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {ZODIAC_SIGNS.find(z => z.id === zodiacSign)?.name}
                </h3>
                <p className="text-purple-300">
                  {ZODIAC_SIGNS.find(z => z.id === zodiacSign)?.dates} • {ZODIAC_SIGNS.find(z => z.id === zodiacSign)?.element} элемент
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-purple-400 mb-1">Хугацаа</div>
              <div className="text-xl font-semibold text-white">
                {selectedPeriod === 'daily' && 'Өнөөдрийн зурхай'}
                {selectedPeriod === 'weekly' && 'Энэ долоо хоногийн зурхай'}
                {selectedPeriod === 'monthly' && 'Энэ сарын зурхай'}
                {selectedPeriod === 'yearly' && 'Энэ жилийн зурхай'}
              </div>
              <div className="text-sm text-purple-300 mt-1">
                {horoscopeData?.date}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horoscope Prediction */}
      {horoscopeData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Predictions */}
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-serif font-bold mb-6 text-blue-300">
              🔮 Зурхайн удирдамж
            </h3>
            
            {selectedPeriod === 'daily' && (
              <div className="space-y-6">
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <h4 className="text-lg font-semibold text-white">Хайр, харилцаа</h4>
                  </div>
                  <p className="text-blue-200">{horoscopeData.predictions.love}</p>
                </div>
                
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="w-6 h-6 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Карьер, ажил</h4>
                  </div>
                  <p className="text-blue-200">{horoscopeData.predictions.career}</p>
                </div>
                
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-semibold text-white">Эрүүл мэнд</h4>
                  </div>
                  <p className="text-blue-200">{horoscopeData.predictions.health}</p>
                </div>
                
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-white">Санхүү, хөрөнгө</h4>
                  </div>
                  <p className="text-blue-200">{horoscopeData.predictions.finance}</p>
                </div>
              </div>
            )}

            {selectedPeriod === 'weekly' && (
              <div className="space-y-6">
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Энэ долоо хоногт</h4>
                  <p className="text-blue-200 mb-4">{horoscopeData.predictions.overview}</p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-blue-300 mb-1">Хайр, харилцаа:</h5>
                      <p className="text-blue-200">{horoscopeData.predictions.love}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-300 mb-1">Ажил, карьер:</h5>
                      <p className="text-blue-200">{horoscopeData.predictions.career}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-300 mb-1">Эрүүл мэнд:</h5>
                      <p className="text-blue-200">{horoscopeData.predictions.health}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900/30 rounded-xl p-4">
                  <p className="text-blue-300 text-sm">Анхаарах чиглэл: <span className="text-white font-semibold">{horoscopeData.predictions.focus}</span></p>
                </div>
              </div>
            )}

            {selectedPeriod === 'monthly' && (
              <div className="space-y-6">
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Энэ сарын ерөнхий зурхай</h4>
                  <p className="text-blue-200 mb-4">{horoscopeData.predictions.overview}</p>
                  <div className="bg-blue-900/40 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-300 mb-2">Сорилтууд:</h5>
                    <p className="text-blue-200">{horoscopeData.predictions.challenges}</p>
                  </div>
                  <p className="text-blue-300 text-sm">{horoscopeData.predictions.advice}</p>
                </div>
              </div>
            )}

            {selectedPeriod === 'yearly' && (
              <div className="space-y-6">
                <div className="bg-blue-900/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Энэ жилийн зурхай</h4>
                  <p className="text-blue-200 mb-4">{horoscopeData.predictions.overview}</p>
                  <div className="bg-blue-900/40 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-300 mb-2">Анхаарах чиглэл:</h5>
                    <p className="text-blue-200">{horoscopeData.predictions.focus}</p>
                  </div>
                  <p className="text-blue-300 text-sm">{horoscopeData.predictions.advice}</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            {/* Lucky Info */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30">
              <h3 className="text-2xl font-serif font-bold mb-6 text-yellow-300">
                🍀 Аз, заяаны мэдээлэл
              </h3>
              
              {selectedPeriod === 'daily' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-900/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">
                      {horoscopeData.predictions.luckyNumber}
                    </div>
                    <div className="text-sm text-yellow-400">Азтай тоо</div>
                  </div>
                  <div className="bg-yellow-900/30 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-2">
                      {horoscopeData.predictions.luckyColor}
                    </div>
                    <div className="text-sm text-yellow-400">Азтай өнгө</div>
                  </div>
                </div>
              )}

              {selectedPeriod === 'weekly' && (
                <div className="space-y-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">Азтай өдрүүд:</h4>
                    <p className="text-yellow-300">Энэ долоо хоногийн сүүлийн 3 өдөр</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">Анхаарах цаг:</h4>
                    <p className="text-yellow-300">Өглөө 8-10, орой 18-20</p>
                  </div>
                </div>
              )}

              {selectedPeriod === 'monthly' && (
                <div className="space-y-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">Азтай өдрүүд:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {horoscopeData.predictions.bestDays.map((day, idx) => (
                        <span key={idx} className="px-3 py-1 bg-yellow-600/50 rounded-full text-sm text-white">
                          {day} өдөр
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedPeriod === 'yearly' && (
                <div className="space-y-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">Азтай сарууд:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {horoscopeData.predictions.luckyMonths.map((month, idx) => (
                        <span key={idx} className="px-3 py-1 bg-yellow-600/50 rounded-full text-sm text-white">
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-yellow-500/30">
                <p className="text-yellow-300 text-sm italic">
                  Аз, заяа нь таны хүчин чармайлтаас хамаарна. Эдгээр нь зөвхөн удирдамж болгох зорилготой.
                </p>
              </div>
            </div>

            {/* All Zodiac Signs */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                ♈ Бүх 12 ордын зурхай
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => {
                      setZodiacSign(sign.id);
                      updateHoroscope(sign.id, selectedPeriod);
                    }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      zodiacSign === sign.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sign.icon}</div>
                    <div className="text-sm font-medium">{sign.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Horoscope;