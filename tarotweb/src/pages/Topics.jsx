import React from 'react';

const Topics = ({ topics, handleTopicSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
        Сэдэв сонгоно уу
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className="group bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 transition-all"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-white">
                {topic.name}
              </h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Topics;