import React from 'react';
import NewsBlogsSection from '../components/NewsBlogsSection';

const Blogs = ({ onArticleClick }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
        📝 Блогууд
      </h1>
      <NewsBlogsSection activeTab="blogs" onArticleClick={onArticleClick} />
    </div>
  );
};

export default Blogs;