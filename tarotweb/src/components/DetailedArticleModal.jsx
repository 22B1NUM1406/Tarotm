import React, { useEffect } from 'react';
import { User, Facebook, Twitter, Mail } from '../icons';

const DetailedArticleModal = ({ article, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-3xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-purple-900/80 rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors z-10"
        >
          <span className="text-2xl">×</span>
        </button>

        <div className="p-8 border-b border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              article.type === 'news' 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-pink-500/90 text-white'
            }`}>
              {article.type === 'news' ? 'МЭДЭЭ' : 'БЛОГ'}
            </span>
            <span className="text-purple-400 text-sm">{article.date}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-purple-300 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️ {article.readTime} уншихад</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👁️ {article.views} үзсэн</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.fullContent }}
          />
          
          <div className="mt-12 pt-8 border-t border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 text-purple-300">Хуваалцах:</h3>
            <div className="flex gap-3">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('📋 Холбоос хуулагдлаа!');
                }}
                className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-xl">📋</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedArticleModal;