import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tarotm-production.up.railway.app';

const NewsBlogsSection = ({ activeTab, setActiveTab, onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // activeTab: 'all', 'news', 'blogs'
  const currentType = activeTab === 'all' ? null : activeTab === 'news' ? 'news' : 'blog';

  useEffect(() => {
    fetchArticles();
  }, [currentType]);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const url = currentType 
        ? `${API_URL}/api/articles?type=${currentType}`
        : `${API_URL}/api/articles`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        setError('Мэдээ татахад алдаа гарлаа');
      }
    } catch (err) {
      console.error('Fetch articles error:', err);
      setError('Серверт холбогдох үед алдаа гарлаа');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-purple-300">Мэдээ уншиж байна...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-purple-900/20 rounded-2xl border border-purple-500/20">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchArticles}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-purple-900/20 rounded-2xl border border-purple-500/20">
        <p className="text-purple-400">
          Одоогоор {currentType === 'news' ? 'мэдээ' : currentType === 'blog' ? 'блог' : 'нийтлэл'} байхгүй байна
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs - зөвхөн setActiveTab байвал харуулах */}
      {setActiveTab && (
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            🌟 Бүгд
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'news'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            📰 Мэдээ
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'blogs'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            ✍️ Блог
          </button>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article._id}
            onClick={() => onArticleClick?.(article)}
            className="bg-purple-900/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition cursor-pointer group"
          >
            {article.imageUrl && (
              <div className="aspect-video bg-purple-800/40 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-3 py-1 bg-purple-600/40 rounded-full text-purple-200">
                  {article.type === 'news' ? '📰 Мэдээ' : '✍️ Блог'}
                </span>
                <span className="text-xs text-purple-400">
                  {new Date(article.createdAt).toLocaleDateString('mn-MN')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition line-clamp-2">
                {article.title}
              </h3>
              <p className="text-purple-300 text-sm line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-purple-400">
                <span>👤 {article.author}</span>
                <button className="text-purple-400 hover:text-purple-300 transition">
                  Дэлгэрэнгүй →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsBlogsSection;