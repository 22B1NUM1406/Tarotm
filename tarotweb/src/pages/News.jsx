import React from 'react';
import NewsBlogsSection from '../components/NewsBlogsSection';

const News = ({ onArticleClick }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
        📰 Мэдээ
      </h1>
      <NewsBlogsSection activeTab="news" onArticleClick={onArticleClick} />
    </div>
  );
};

export default News;