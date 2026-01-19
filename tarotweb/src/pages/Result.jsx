import React from 'react';
import { RotateCcw, Copy, ExternalLink } from '../icons';

const Result = ({ 
  selectedCards, 
  selectedTopic, 
  tarotCards, 
  resetReading, 
  professionalReadingLink, 
  showMessage 
}) => {
  const handleCopyResult = () => {
    const result = selectedCards.map((id, i) => {
      const card = tarotCards.find(c => c.id === id);
      const pos = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'][i];
      const meaning = i === 0 ? card.positionMeanings.past : 
                    i === 1 ? card.positionMeanings.present : 
                    card.positionMeanings.future;
      return `${pos} байрлал: ${card.mongolian}\n${meaning}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(result);
    showMessage('success', '✅ Үр дүн хуулагдлаа!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
        ✨ Таны Таротын үр дүн ✨
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {selectedCards.map((cardId, index) => {
          const card = tarotCards.find(c => c.id === cardId);
          const positions = ['🌅 Өнгөрсөн', '⏰ Одоо', '🌟 Ирээдүй'];
          
          return (
            <div
              key={cardId}
              className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
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
                <p className="text-purple-300 leading-relaxed mb-4">
                  {index === 0 && card.positionMeanings.past}
                  {index === 1 && card.positionMeanings.present}
                  {index === 2 && card.positionMeanings.future}
                </p>
                
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <p className="text-sm text-purple-400 font-medium mb-2">
                    Хөзрийн утга:
                  </p>
                  <p className="text-purple-300 text-sm italic">
                    {card.meaning || "Шинэ эхлэл, боломж, итгэл хүлээлт"}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-purple-500/30">
                <p className="text-sm text-purple-400 text-center italic">
                  {index === 0 && "Өнгөрсөн үеийн туршлага, сургамж, өмнөх шийдвэрүүд"}
                  {index === 1 && "Одоогийн нөхцөл байдал, дотоод мэдрэмж, анхаарах асуудал"}
                  {index === 2 && "Ирээдүйн боломж, үр дүн, анхаарах зүйлс"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Interpretation */}
      <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8">
        <h3 className="text-2xl font-serif font-bold mb-6 text-center text-purple-300">
          🔮 Нарийвчилсан тайлбар
        </h3>
        
        <div className="space-y-6">
          {/* Ерөнхий дүгнэлт */}
          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">
              💭 Ерөнхий дүгнэлт
            </h4>
            <p className="text-purple-300 leading-relaxed">
              {selectedCards.length === 3 && (() => {
                const pastCard = tarotCards.find(c => c.id === selectedCards[0]);
                const presentCard = tarotCards.find(c => c.id === selectedCards[1]);
                const futureCard = tarotCards.find(c => c.id === selectedCards[2]);
                
                return (
                  <>
                    Таны сонгосон <strong>{pastCard.mongolian}</strong>, <strong>{presentCard.mongolian}</strong>, 
                    <strong>{futureCard.mongolian}</strong> хөзрүүд таны амьдралын гурван үе шатыг харуулж байна. 
                    <strong>Өнгөрсөн</strong> нь таны туулсан туршлага, сургамж, өмнөх үйл явдал, 
                    гаргасан сонголтуудыг харуулдаг. <strong>Одоо</strong> нь таны одоогийн нөхцөл байдал, 
                    дотоод мэдрэмж, анхаарах асуудлуудыг илэрхийлнэ. Харин <strong>Ирээдүй</strong> нь таны 
                    одоогийн үйлдэл, шийдвэрээс хамааран үүсэх боломжууд, ирэх сорилт, үр дүнг харуулдаг.
                  </>
                );
              })()}
            </p>
          </div>

          {/* Хөзрийн бүрэн тайлбар */}
          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">
              🔮 Хөзрийн нарийвчилсан тайлбар
            </h4>
            <div className="space-y-4">
              {selectedCards.map((cardId, index) => {
                const card = tarotCards.find(c => c.id === cardId);
                const positionNames = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'];
                
                return (
                  <div key={cardId} className="bg-purple-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{card.symbol}</span>
                      <div>
                        <h5 className="font-semibold text-white">{card.mongolian}</h5>
                        <p className="text-purple-400 text-sm">{positionNames[index]}</p>
                      </div>
                    </div>
                    <p className="text-purple-300 text-sm">
                      {index === 0 && card.positionMeanings.past}
                      {index === 1 && card.positionMeanings.present}
                      {index === 2 && card.positionMeanings.future}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Зөвлөмж */}
          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">
              🎯 Зөвлөмж
            </h4>
            <ul className="space-y-2 text-purple-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Өнгөрсөн үеэсээ сургамж авч, одоо мөчид анхаарлаа төвлөрүүлээрэй</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Одоогийн нөхцөл байдлыг үндэслэн ирээдүйн төлөвлөгөөгөө боловсруулаарай</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Дотоод мэдрэмжээ сонсож, өөрийнхөө шийдвэрт итгэлтэй байгаарай</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Таротын зөвлөгөө нь зөвхөн санал; эцсийн шийдвэрийг та өөрөө гаргана</span>
              </li>
            </ul>
          </div>

          {/* Цагийн хуваарь */}
          <div className="bg-purple-950/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-purple-200">
              ⏰ Цагийн хуваарь
            </h4>
            <p className="text-purple-300 leading-relaxed">
              Энэхүү уншлага таны {selectedTopic?.name || 'сонгосон сэдэв'}-тэй холбоотой ойрын 1-3 сарын хугацааг хамарч байна. 
              Энэ хугацаанд та өөрчлөлт, хөгжил дэвшлийг мэдэрч, шинэ боломжуудыг олж мэдэх магадлалтай.
            </p>
          </div>
        </div>
      </div>

      {/* Professional Reading Section */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full mb-4">
            <span className="text-yellow-300">💫</span>
            <span className="text-yellow-300 text-sm font-medium">Шинэ санал</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">
            Мэргэжлийн таротын уншлага авах
          </h3>
          <p className="text-purple-300 mb-6 max-w-2xl mx-auto">
            Энэхүү онлайн уншлага нь ерөнхий удирдамж юм. Таны хувийн тохиолдолд зориулсан нарийвчилсан, гүнзгий уншлага авахыг хүсвэл манай мэргэжлийн тарот уншигчтай холбогдоорой.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span>✅</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Хувийн уншлага</h4>
                <p className="text-purple-300 text-sm">Таны асуултанд тусгайлан хариулах, нарийн дэлгэрэнгүй тайлбар</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span>✅</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Бүрэн тайлбар</h4>
                <p className="text-purple-300 text-sm">Бүх хөзрийн холбоо, нарийн утгыг тайлбарлах</p>
              </div>
            </div>
          </div>

          <a
            href={professionalReadingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
          >
            <span>Мэргэжлийн уншлага авах</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          
          <p className="text-purple-400 text-sm mt-4">
            * Дээрх товч дарснаар та манай Facebook хуудас руу чиглүүлэгдэнэ
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={resetReading}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Шинэ уншлага хийх
        </button>
        
        <button
          onClick={handleCopyResult}
          className="flex items-center px-8 py-4 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold text-lg hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all"
        >
          <Copy className='mr-1'/> Үр дүн хуулах
        </button>
      </div>
    </div>
  );
};

export default Result;