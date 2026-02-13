import React, { useState } from 'react';
import { Moon, LogOut, Menu, X } from '../icons';

const Navbar = ({ user, currentPage, navigateTo, handleLogout, hasPaid }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Нүүр' },
    { id: 'information', label: 'Мэдээлэл' },
    { id: 'meditation', label: 'Бясалгал' },
    { id: 'horoscope', label: 'Зурхай' },
    { id: 'blogs', label: 'Блог' },
    { id: 'news', label: 'Мэдээ' },
    { id: 'about', label: 'Бидний тухай' }
  ];

  const handleNavClick = (id) => {
    navigateTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-purple-950/95 backdrop-blur-md border-b border-purple-500/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 text-purple-300 cursor-pointer hover:text-purple-100 transition" 
            onClick={() => handleNavClick('home')}
          >
            <Moon className="w-6 h-6" />
            <span className="text-lg sm:text-xl font-serif font-semibold">Таротын Мэргэ</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm xl:text-base text-purple-300 hover:text-purple-100 transition ${
                  currentPage === item.id 
                    ? 'text-purple-100 font-medium border-b-2 border-purple-400 pb-1' 
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
                        
            {/* Desktop User Info */}
            {user && (
              <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/40 hover:bg-purple-500/30 transition">
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full border-2 border-purple-500" 
                />
                <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition p-1"
                  title="Гарах"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile: User Avatar + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border-2 border-purple-500" 
                />
                {hasPaid && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Төлбөр идэвхтэй" />
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-purple-300 hover:text-purple-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-purple-950/98 backdrop-blur-lg border-t border-purple-500/30">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                  currentPage === item.id 
                    ? 'bg-purple-600/40 text-white font-medium' 
                    : 'text-purple-300 hover:bg-purple-800/30 hover:text-purple-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile User Section */}
            {user && (
              <div className="pt-3 mt-3 border-t border-purple-500/30">
                <div className="flex items-center justify-between px-4 py-3 bg-purple-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photoURL} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full border-2 border-purple-500" 
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-purple-300">{user.email}</p>
                      {hasPaid && (
                        <p className="text-xs text-green-400 mt-1">✓ Төлбөр идэвхтэй</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="p-2 text-red-400 hover:text-red-300 transition"
                    title="Гарах"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;