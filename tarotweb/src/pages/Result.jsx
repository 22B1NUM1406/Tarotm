import React from 'react';
import { RotateCcw, Copy, ExternalLink } from '../icons';

const Result = ({ selectedCards, selectedTopic, tarotCards, resetReading, professionalReadingLink, showMessage }) => {
  const handleCopy = () => {
    const text = selectedCards.map((id, i) => {
      const card = tarotCards.find(c => c.id === id);
      const pos  = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'][i];
      const meaning = [card.positionMeanings.past, card.positionMeanings.present, card.positionMeanings.future][i];
      return `${pos}: ${card.mongolian}\n${meaning}`;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    showMessage('success', '✅ Үр дүн хуулагдлаа!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">✨ Таны Таротын үр дүн ✨</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {selectedCards.map((cardId, index) => {
          const card = tarotCards.find(c => c.id === cardId);
          const positions = ['🌅 Өнгөрсөн', '⏰ Одоо', '🌟 Ирээдүй'];
          const meaning = [card.positionMeanings.past, card.positionMeanings.present, card.positionMeanings.future][index];
          const posDesc = [
            'Өнгөрсөн үеийн туршлага, сургамж',
            'Одоогийн нөхцөл байдал, анхаарах асуудал',
            'Ирээдүйн боломж, үр дүн',
          ][index];

          return (
            <div key={cardId}
              className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="text-center mb-6">
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full font-semibold">
                  {positions[index]}
                </span>
              </div>
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{card.symbol}</div>
                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.mongolian}
                </h3>
                <p className="text-purple-300 leading-relaxed mb-4">{meaning}</p>
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <p className="text-sm text-purple-400 font-medium mb-1">Хөзрийн утга:</p>
                  <p className="text-purple-300 text-sm italic">{card.meaning || 'Шинэ эхлэл, боломж, итгэл хүлээлт'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-500/30">
                <p className="text-sm text-purple-400 text-center italic">{posDesc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Нарийвчилсан тайлбар */}
      <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-purple-300">🔮 Нарийвчилсан тайлбар</h3>
        <div className="space-y-4">

          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">💭 Ерөнхий дүгнэлт</h4>
            <p className="text-purple-300 leading-relaxed">
              {(() => {
                const [p, n, f] = selectedCards.map(id => tarotCards.find(c => c.id === id));
                return <>Таны сонгосон <strong>{p.mongolian}</strong>, <strong>{n.mongolian}</strong>, <strong>{f.mongolian}</strong> хөзрүүд таны амьдралын гурван үе шатыг харуулж байна. Өнгөрсөн туршлага нь одоогийн байдалд нөлөөлж, одоогийн үйлдэл нь ирээдүйн боломжийг тодорхойлно.</>;
              })()}
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">🎯 Зөвлөмж</h4>
            <ul className="space-y-2 text-purple-300">
              {[
                'Өнгөрсөн үеэсээ сургамж авч, одоо мөчид анхаарлаа төвлөрүүлээрэй',
                'Одоогийн нөхцөл байдлаа үндэслэн ирээдүйн төлөвлөгөөгөө боловсруулаарай',
                'Дотоод мэдрэмжээ сонсож, өөрийнхөө шийдвэрт итгэлтэй байгаарай',
                'Таротын зөвлөгөө нь санал — эцсийн шийдвэрийг та өөрөө гаргана',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-2 text-purple-200">⏰ Цагийн хуваарь</h4>
            <p className="text-purple-300">
              Энэхүү уншлага таны <strong>{selectedTopic?.name || 'сонгосон сэдэв'}</strong>-тэй холбоотой ойрын 1–3 сарын хугацааг хамарна.
            </p>
          </div>
        </div>
      </div>

      {/* Мэргэжлийн уншлага */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full mb-4">
          <span className="text-yellow-300">💫</span>
          <span className="text-yellow-300 text-sm font-medium">Санал</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white">Мэргэжлийн таротын уншлага авах</h3>
        <p className="text-purple-300 mb-6 max-w-2xl mx-auto">
          Онлайн уншлага нь ерөнхий удирдамж юм. Хувийн тохиолдолд зориулсан нарийвчилсан уншлага авахыг хүсвэл манай мэргэжлийн тарот уншигчтай холбогдоорой.
        </p>
        <a href={professionalReadingLink} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all">
          Мэргэжлийн уншлага авах <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Товчнууд */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={resetReading}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" /> Шинэ уншлага хийх
        </button>
        <button onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold text-lg hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all">
          <Copy className="w-5 h-5" /> Үр дүн хуулах
        </button>
      </div>
    </div>
  );
};

export default Result;