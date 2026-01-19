import React from 'react';

const Birthdate = ({ 
  birthDate, 
  setBirthDate, 
  gender, 
  setGender, 
  handleBirthDateSubmit 
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold mb-4 text-purple-300">
          Төрсөн мэдээлэл оруулна уу
        </h2>
        <p className="text-purple-400">
          Таны төрсөн өдөр, хүйс таны хувь заяаг тодорхойлоход тусална
        </p>
      </div>

      <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
        <div className="mb-6">
          <label className="block text-purple-300 mb-2 text-sm font-medium">
            Төрсөн өдөр
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-6 py-4 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition"
          />
        </div>

        <div className="mb-8">
          <label className="block text-purple-300 mb-3 text-sm font-medium">
            Хүйс
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: 'Эрэгтэй', emoji: '👨' },
              { value: 'female', label: 'Эмэгтэй', emoji: '👩' },
              { value: 'other', label: 'Бусад', emoji: '🧑' },
              { value: 'prefer_not_to_say', label: 'Хэлэхгүй', emoji: '🤐' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                  gender === option.value
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-purple-950/60 border-purple-500/50 text-purple-300 hover:border-purple-400'
                }`}
              >
                <span className="text-2xl mb-2">{option.emoji}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleBirthDateSubmit}
          disabled={!birthDate || !gender}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            birthDate && gender
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5'
              : 'bg-purple-800/50 text-purple-400 cursor-not-allowed'
          }`}
        >
          Үргэлжлүүлэх →
        </button>
      </div>
    </div>
  );
};

export default Birthdate;