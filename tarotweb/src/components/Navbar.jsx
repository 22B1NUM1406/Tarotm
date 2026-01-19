import React from 'react';
import { Moon, LogOut } from '../icons';

const Navbar = ({ user, currentPage, navigateTo, handleLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-purple-950/95 backdrop-blur-md border-b border-purple-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 text-purple-300 cursor-pointer" onClick={() => navigateTo('home')}>
            <Moon className="w-6 h-6" />
            <span className="text-xl font-serif font-semibold">Таротын Мэргэ</span>
          </div>
          
          <div className="flex items-center gap-6">
            {['home', 'blogs', 'news', 'about'].map((page) => (
              <button
                key={page}
                onClick={() => navigateTo(page)}
                className={`text-purple-300 hover:text-purple-100 transition ${
                  currentPage === page ? 'text-purple-100 font-medium' : ''
                }`}
              >
                {page === 'home' && 'Нүүр'}
                {page === 'blogs' && 'Блог'}
                {page === 'news' && 'Мэдээ'}
                {page === 'about' && 'Тухай'}
              </button>
            ))}
            
            {user && (
              <div className="flex items-center gap-3 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/40">
                <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full border-2 border-purple-500" />
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;