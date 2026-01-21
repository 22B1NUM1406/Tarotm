import React from 'react';
import NewsBlogsSection from '../components/NewsBlogsSection';
import { NewspaperIcon } from 'lucide-react';

const News = ({ onArticleClick }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold flex items-center text-center mb-12 text-purple-300">
        <NewspaperIcon className='mr-2 size-10'/> Мэдээ
      </h1>
      <NewsBlogsSection activeTab="news" onArticleClick={onArticleClick} />
    </div>
  );
};

export default News;