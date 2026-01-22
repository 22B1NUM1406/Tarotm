import React from 'react';
import { Moon, Facebook, Instagram, Mail, Phone, MapPin, ExternalLink } from '../icons';

const Footer = ({ navigateTo }) => {
  const PROFESSIONAL_READING_LINK = "https://www.facebook.com/TarotMongoliaProfessional";

  return (
    <footer className="relative z-10 mt-20 border-t border-purple-500/30 bg-purple-950/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-purple-300 mb-4">
              <Moon className="w-6 h-6" />
              <span className="text-xl font-serif font-semibold">Таротын Мэргэ</span>
            </div>
            <p className="text-purple-400 text-sm leading-relaxed">
              Таны ирээдүйг нээж, удирдамж өгөх мэргэжлийн Tarot уншлага. 
              Бид таны амьдралын чухал шийдвэрүүдэд туслахад бэлэн байна.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Холбоосууд</h3>
            <ul className="space-y-2 text-purple-400 text-sm">
              <li><button onClick={() => navigateTo('home')} className="hover:text-purple-200 transition">Нүүр</button></li>
              <li><button onClick={() => navigateTo('about')} className="hover:text-purple-200 transition">Тухай</button></li>
              <li><button onClick={() => navigateTo('blogs')} className="hover:text-purple-200 transition">Блогууд</button></li>
              <li><button onClick={() => navigateTo('news')} className="hover:text-purple-200 transition">Мэдээ</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Бүртгүүлэх</h3>
            <ul className="space-y-2 text-purple-400 text-sm">
              <li><button onClick={() => navigateTo('home')} className="hover:text-purple-200 transition">Ерөнхий уншлага</button></li>
              <li><button onClick={() => navigateTo('topics')} className="hover:text-purple-200 transition">Сэдэвт уншлага</button></li>
              <li><button onClick={() => window.open(PROFESSIONAL_READING_LINK, '_blank')} className="hover:text-purple-200 transition">Мэргэжлийн уншлага</button></li>
              <li><button onClick={() => navigateTo('blogs')} className="hover:text-purple-200 transition">Мэдлэгийн сан</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Бидэнтэй холбогдох</h3>
            <ul className="space-y-2 text-purple-400 text-sm">
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                <a href="https://www.facebook.com/TarotMongoliaProfessional" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                  Instagram
                </a>
              </li> 
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@tarot-mongolia.mn</span>
              </li>
              <li className="flex items-center gap-2">     
                <Phone className="w-4 h-4" /> 
                <span>+976 96113399</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/30 mt-8 pt-8 text-center text-purple-400 text-sm">
          <p>© 2026 Таротын Мэргэ. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="mt-2">
            Энэхүү таротын уншлага нь зөвхөн зөвлөмж болгох зорилготой бөгөөд 
            эмнэлгийн, хууль зүйн эсвэл санхүүгийн мэргэжлийн зөвлөгөө биш юм.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;