import React from 'react';
import { ChevronRight } from '../icons';
import { NEWS_AND_BLOGS } from '../data/newsBlogs';

const NewsBlogsSection = ({ activeTab = 'all', setActiveTab = null, onArticleClick = null }) => {
  const filteredItems = NEWS_AND_BLOGS.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'news') return item.type === 'news';
    if (activeTab === 'blogs') return item.type === 'blog';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {setActiveTab && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-purple-900/40 backdrop-blur-sm rounded-xl p-1">
            {['all', 'news', 'blogs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-300 hover:text-purple-100'
                }`}
              >
                {tab === 'all' && 'Бүгд'}
                {tab === 'news' && 'Мэдээ'}
                {tab === 'blogs' && 'Блогууд'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-purple-900/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400 hover:-translate-y-1 transition-all group cursor-pointer"
            onClick={() => onArticleClick && onArticleClick(item)}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.type === 'news' 
                    ? 'bg-blue-500/90 text-white' 
                    : 'bg-pink-500/90 text-white'
                }`}>
                  {item.type === 'news' ? 'Мэдээ' : 'Блог'}
                </span>
                <span className="text-purple-400 text-xs">{item.date}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">
                {item.title}
              </h3>
              
              <p className="text-purple-300 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-purple-400">{item.readTime} уншихад</span>
                  <span className="text-purple-400">•</span>
                  <span className="text-purple-400">{item.views} үзсэн</span>
                </div>
                <div className="flex items-center text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors">
                  Дэлгэрэнгүй
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsBlogsSection;