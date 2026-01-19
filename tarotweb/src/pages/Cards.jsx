import React from 'react';
import { RotateCcw, Check } from '../icons';

const Cards = ({ 
  shuffledCards, 
  selectedCards, 
  handleCardSelect, 
  setSelectedCards, 
  setShuffledCards, 
  tarotCards 
}) => {
  const resetCards = () => {
    setSelectedCards([]);
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold mb-4 text-purple-300">
          3 хөзөр сонгоно уу
        </h2>
        <div className="inline-block px-6 py-3 bg-purple-600/30 rounded-full border border-purple-500/50">
          <span className="text-xl font-semibold">
            Сонгосон: {selectedCards.length}/3
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {shuffledCards.map((card) => {
          const isSelected = selectedCards.includes(card.id);
          const isFlipped = isSelected;

          return (
            <div
              key={card.id}
              onClick={() => handleCardSelect(card.id)}
              className={`aspect-[2/3] cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                isFlipped ? 'scale-105' : ''
              }`}
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-xl border-2 border-purple-500 flex flex-col items-center justify-center p-4"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-4xl mb-2">{card.symbol}</div>
                  <div className="text-xs text-purple-300 font-serif">Tarot</div>
                </div>

                {/* Back */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center p-4 overflow-y-auto`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-4xl mb-2">{card.symbol}</div>
                  <div className="text-sm font-semibold text-center mb-1">{card.mongolian}</div>
                  <div className="text-xs text-center opacity-90 px-2">
                    {isSelected && selectedCards.indexOf(card.id) !== -1 && (
                      <div className="mt-2 pt-2 border-t border-white/30">
                        <div className="text-xs font-medium mb-1">
                          {['Өнгөрсөн', 'Одоо', 'Ирээдүй'][selectedCards.indexOf(card.id)]} :
                        </div>
                        <div className="text-xs opacity-80">
                          {selectedCards.indexOf(card.id) === 0 && card.positionMeanings.past}
                          {selectedCards.indexOf(card.id) === 1 && card.positionMeanings.present}
                          {selectedCards.indexOf(card.id) === 2 && card.positionMeanings.future}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button 
          onClick={resetCards}
          className="px-8 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Дахин эхлүүлэх
        </button>
      </div>
    </div>
  );
};

export default Cards;