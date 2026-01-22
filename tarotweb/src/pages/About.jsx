import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, ExternalLink } from '../icons';

const About = ({ professionalReadingLink, navigateTo }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
          Бидний тухай
        </h1>
        <p className="text-xl text-purple-300">
          Таротын Мэргэ - Онлайн таротын уншлагын платформ
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">🎯 Бидний зорилго</h2>
          <p className="text-purple-200 leading-relaxed">
            Бид хүмүүст өөрсдийн амьдралын замыг ойлгоход туслах, 
            шинэ боломжуудыг нээж, дотоод дуу хоолойгоо сонсоход 
            туслах зорилготой. Тарот бол зөвхөн ирээдүйг таах төдийгүй, 
            өөрийгөө илүү сайн ойлгох хэрэгсэл юм.
          </p>
        </div>

        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">👥 Манай баг</h2>
          <p className="text-purple-200 leading-relaxed">
            Манай баг нь таротын мэргэжлийн сургалттай, туршлагатай 
            уншигчид, хөгжүүлэгчид, сэтгэл зүйчдээс бүрддэг. 
            Бид таны аюулгүй байдал, нууцлалыг тэргүүн зэрэгт тавьж ажилладаг.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-purple-300">
            <Phone className='mr-2' />Бидэнтэй холбогдох 
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <a
              href={professionalReadingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-center gap-3 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Facebook</h3>
                <p className="text-blue-300 text-sm">Мэргэжлийн уншлага</p>
              </div>
            </a>
            
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-2xl p-6 flex items-center justify-center gap-3 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Instagram</h3>
                <p className="text-pink-300 text-sm">Өдөр тутмын удирдамж</p>
              </div>
            </a>
          </div>
          
          <div className="space-y-4 text-purple-200">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>info@tarot-mongolia.mn</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-purple-400" />
              <span>+976 96113399</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>Улаанбаатар хот, Монгол улс</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;