 import React, { useState, useEffect } from 'react';
import { Moon, Star, Heart, Briefcase, DollarSign, Activity, Sparkles, ArrowLeft, LogOut, RotateCcw, Check, Home, Book, FileText, User } from 'lucide-react';
// Firebase Configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDW-dNxxhMIBphKPX2xIKE0qsO1puyxwN0",
  authDomain: "tarot-mongolia.firebaseapp.com",
  projectId: "tarot-mongolia",
  storageBucket: "tarot-mongolia.firebasestorage.app",
  messagingSenderId: "84218992471",
  appId: "1:84218992471:web:c5e3464fa8262d39a4d012",
  measurementId: "G-FVX95LELB3"
};

// Tarot Cards Data
const TAROT_CARDS = [
  { id: 0, name: 'The Fool', mongolian: 'Тэнэг', meaning: 'Шинэ эхлэл, боломж, итгэл хүлээлт', symbol: '🌟', color: 'from-yellow-400 to-yellow-600' },
  { id: 1, name: 'The Magician', mongolian: 'Илбэчин', meaning: 'Манифестаци, хүч чадал, бүтээлч байдал', symbol: '🎩', color: 'from-purple-600 to-indigo-800' },
  { id: 2, name: 'The High Priestess', mongolian: 'Тэргүүн Санваартан', meaning: 'Мэргэн ухаан, нууц, интуици', symbol: '🌙', color: 'from-blue-800 to-indigo-900' },
  { id: 3, name: 'The Empress', mongolian: 'Хатан хаан', meaning: 'Эх байдал, бүтээлч байдал, элбэг дэлбэг', symbol: '👑', color: 'from-green-500 to-green-700' },
  { id: 4, name: 'The Emperor', mongolian: 'Эзэн хаан', meaning: 'Эрх мэдэл, бүтэц, хяналт', symbol: '⚡', color: 'from-red-700 to-red-900' },
  { id: 5, name: 'The Hierophant', mongolian: 'Лам', meaning: 'Уламжлал, сургамж, итгэл үнэмшил', symbol: '📿', color: 'from-purple-700 to-purple-900' },
  { id: 6, name: 'The Lovers', mongolian: 'Дурлагчид', meaning: 'Хайр, эв найрамдал, сонголт', symbol: '💞', color: 'from-pink-500 to-rose-600' },
  { id: 7, name: 'The Chariot', mongolian: 'Тэрэг', meaning: 'Ялалт, зорилго, хяналт', symbol: '🏇', color: 'from-blue-600 to-blue-800' },
  { id: 8, name: 'Strength', mongolian: 'Хүч', meaning: 'Зоригт байдал, тэвчээр, хүч чадал', symbol: '🦁', color: 'from-orange-500 to-orange-700' },
  { id: 9, name: 'The Hermit', mongolian: 'Даяанч', meaning: 'Гүн бодол, хайлт, дотоод мэргэн ухаан', symbol: '🕯️', color: 'from-gray-600 to-gray-800' },
  { id: 10, name: 'Wheel of Fortune', mongolian: 'Хувь заяаны хүрд', meaning: 'Өөрчлөлт, мөчлөг, хувь заяа', symbol: '☸️', color: 'from-yellow-600 to-amber-700' },
  { id: 11, name: 'Justice', mongolian: 'Шударга ёс', meaning: 'Шударга байдал, үнэн, хариуцлага', symbol: '⚖️', color: 'from-green-700 to-green-900' },
  { id: 12, name: 'The Hanged Man', mongolian: 'Дүүжлэгдсэн хүн', meaning: 'Өөр өнцгөөс харах, тэвчээр, гэгээрэл', symbol: '🔄', color: 'from-blue-500 to-blue-700' },
  { id: 13, name: 'Death', mongolian: 'Үхэл', meaning: 'Төгсгөл, шинэчлэл, өөрчлөлт', symbol: '💀', color: 'from-gray-800 to-black' },
  { id: 14, name: 'Temperance', mongolian: 'Даруу байдал', meaning: 'Тэнцвэр, даруу байдал, эв найрамдал', symbol: '🌈', color: 'from-sky-400 to-sky-600' },
  { id: 15, name: 'The Devil', mongolian: 'Чөтгөр', meaning: 'Хүлээлт, хязгаарлалт, соргог', symbol: '😈', color: 'from-red-800 to-red-950' },
  { id: 16, name: 'The Tower', mongolian: 'Цамхаг', meaning: 'Гэнэтийн өөрчлөлт, устгал, үнэн', symbol: '⚡', color: 'from-red-600 to-red-800' },
  { id: 17, name: 'The Star', mongolian: 'Од', meaning: 'Итгэл найдвар, урам зориг, сэргээлт', symbol: '⭐', color: 'from-cyan-400 to-cyan-600' },
  { id: 18, name: 'The Moon', mongolian: 'Сар', meaning: 'Төөрөгдөл, айдас, зүүд', symbol: '🌙', color: 'from-indigo-700 to-indigo-900' },
  { id: 19, name: 'The Sun', mongolian: 'Нар', meaning: 'Амжилт, баяр баясгалан, идэвх', symbol: '☀️', color: 'from-yellow-400 to-orange-500' },
  { id: 20, name: 'Judgement', mongolian: 'Шүүлт', meaning: 'Үнэлгээ, дахин төрөлт, дуудлага', symbol: '📯', color: 'from-purple-500 to-purple-700' },
  { id: 21, name: 'The World', mongolian: 'Дэлхий', meaning: 'Дуусгал, бүрэн байдал, амжилт', symbol: '🌍', color: 'from-green-600 to-green-800' }
];

const TOPICS = [
  { id: 'love', name: 'Хайр, Харилцаа', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { id: 'career', name: 'Карьер, Ажил', icon: Briefcase, color: 'from-blue-500 to-blue-700' },
  { id: 'finance', name: 'Санхүү, Хөрөнгө', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
  { id: 'health', name: 'Эрүүл мэнд', icon: Activity, color: 'from-red-500 to-red-600' },
  { id: 'spiritual', name: 'Сүнслэг хөгжил', icon: Sparkles, color: 'from-purple-500 to-purple-700' },
  { id: 'general', name: 'Ерөнхий мэргэ', icon: Star, color: 'from-yellow-500 to-amber-600' }
];

// Tarot Cards Data-ны дараа энэ мэдээллийг нэмнэ
const NEWS_AND_BLOGS = [
  {
    id: 1,
    type: 'news',
    title: 'Таротын хөзрийн түүх',
    description: 'Таротын хөзөр нь 15-р зуунаас хойш хөгжиж ирсэн нууц шинжлэх ухаан юм.',
    date: '2024-03-15',
    readTime: '5 мин'
  },
  {
    id: 2,
    type: 'blog',
    title: 'Өдөр тутмын таротын дасгал',
    description: 'Өдөр бүр таротын хөзрөөр дасгал хийх нь интуициа хөгжүүлдэг.',
    date: '2024-03-14',
    readTime: '7 мин'
  },
  {
    id: 3,
    type: 'news',
    title: 'Шинэ таротын хөзрийн цуврал',
    description: '2024 онд гаргах шинэ таротын хөзрийн цувралын тухай мэдээлэл.',
    date: '2024-03-13',
    readTime: '4 мин'
  },
  {
    id: 4,
    type: 'blog',
    title: 'Тарот ба сэтгэл зүй',
    description: 'Таротын хөзөр хэрхэн сэтгэл зүйн эмчилгээнд хэрэглэгддэг тухай.',
    date: '2024-03-12',
    readTime: '10 мин'
  }
];

// Starfield Component
const Starfield = () => {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: 0.3 + Math.random() * 0.7
          }}
        />
      ))}
    </div>
  );
};

// Main App Component
const TarotApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [gender, setGender] = useState(''); // ШИНЭ: хүйс
  const [pageHistory, setPageHistory] = useState(['home']);

  useEffect(() => {
    const savedUser = localStorage.getItem('tarotUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tarotUser');
      }
    }

    const thirtyYearsAgo = new Date();
    thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
    setBirthDate(thirtyYearsAgo.toISOString().split('T')[0]);
  }, []);

  const showMessage = (type, message) => {
    if (type === 'error') {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  const navigateTo = (page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      setPageHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
      return;
    }

    setLoading(true);
    
    // Simulate Firebase login
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0],
        email: email,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=8b5cf6&color=fff&size=128`
      };
      
      localStorage.setItem('tarotUser', JSON.stringify(userData));
      setUser(userData);
      showMessage('success', '✅ Амжилттай нэвтэрлээ!');
      setLoading(false);
      
      setTimeout(() => navigateTo('birthdate'), 1000);
    }, 1000);
  };

  const handleRegister = async () => {
    if (!email || !password) {
      showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
      return;
    }

    if (password.length < 6) {
      showMessage('error', '⚠️ Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const userData = {
        name: email.split('@')[0],
        email: email,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=8b5cf6&color=fff&size=128`
      };
      
      localStorage.setItem('tarotUser', JSON.stringify(userData));
      setUser(userData);
      showMessage('success', '🎉 Амжилттай бүртгүүллээ!');
      setLoading(false);
      
      setTimeout(() => navigateTo('birthdate'), 1000);
    }, 1000);
  };

  const handleLogout = () => {
    if (window.confirm('🚪 Та системээс гарахдаа итгэлтэй байна уу?')) {
      localStorage.removeItem('tarotUser');
      setUser(null);
      setEmail('');
      setPassword('');
      setPageHistory(['home']);
      setCurrentPage('home');
      showMessage('success', '✅ Амжилттай гарлаа');
    }
  };

  const handleBirthDateSubmit = () => {
  if (!birthDate) {
    showMessage('error', '⚠️ Төрсөн өдрөө оруулна уу');
    return;
  }
  
  if (!gender) {
    showMessage('error', '⚠️ Хүйсээ сонгоно уу');
    return;
  }
  
  // Хэрэглэгчийн мэдээллийг шинэчлэх
  const updatedUser = {
    ...user,
    birthDate: birthDate,
    gender: gender
  };
  
  localStorage.setItem('tarotUser', JSON.stringify(updatedUser));
  setUser(updatedUser);
  
  navigateTo('topics');
};

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setSelectedCards([]);
      setLoading(false);
      navigateTo('cards');
    }, 1000);
  };

  const handleCardSelect = (cardId) => {
    if (selectedCards.length < 3 && !selectedCards.includes(cardId)) {
      const newSelected = [...selectedCards, cardId];
      setSelectedCards(newSelected);
      
      if (newSelected.length === 3) {
        setTimeout(() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigateTo('result');
          }, 1000);
        }, 1000);
      }
    }
  };

  const resetReading = () => {
    if (window.confirm('🔄 Та шинэ уншлага эхлүүлэх үү?')) {
      setSelectedCards([]);
      setSelectedTopic(null);
      navigateTo('topics');
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-xl animate-pulse">Таротын Ертөнц Нээгдэж байна...</p>
        </div>
      </div>
    );
  }

  // News & Blogs Component
const NewsBlogsSection = ({ activeTab = 'all', setActiveTab = null }) => {
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
            className="bg-purple-900/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400 hover:-translate-y-1 transition-all group p-5"
          >
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
            
            <p className="text-purple-300 text-sm mb-4">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-400 text-xs">{item.readTime} уншихад</span>
              <button className="text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors">
                Дэлгэрэнгүй →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
      <Starfield />
      
      {/* Navbar */}
<nav className="fixed top-0 left-0 right-0 bg-purple-950/95 backdrop-blur-md border-b border-purple-500/30 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center gap-2 text-purple-300 cursor-pointer" onClick={() => navigateTo('home')}>
        <Moon className="w-6 h-6" />
        <span className="text-xl font-serif font-semibold">Таротын Мэргэ</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigateTo('home')}
          className={`text-purple-300 hover:text-purple-100 transition ${currentPage === 'home' ? 'text-purple-100 font-medium' : ''}`}
        >
          Нүүр
        </button>
        <button
          onClick={() => navigateTo('blogs')}
          className={`text-purple-300 hover:text-purple-100 transition ${currentPage === 'blogs' ? 'text-purple-100 font-medium' : ''}`}
        >
          Блог
        </button>
        <button
          onClick={() => navigateTo('news')}
          className={`text-purple-300 hover:text-purple-100 transition ${currentPage === 'news' ? 'text-purple-100 font-medium' : ''}`}
        >
          Мэдээ
        </button>
        <button
          onClick={() => navigateTo('about')}
          className={`text-purple-300 hover:text-purple-100 transition ${currentPage === 'about' ? 'text-purple-100 font-medium' : ''}`}
        >
          Тухай
        </button>
        
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

     

      {/* Back Button */}
      {pageHistory.length > 1 && currentPage !== 'home' && (
        <button
          onClick={goBack}
          className="fixed bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all z-40"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Content */}
      <div className="pt-16 relative z-10">
       {/* Home Page */}
{/* Home Page */}
{currentPage === 'home' && (
  <>
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
          Таротын Мэргэ Авах
        </h1>
        <p className="text-xl text-purple-300">
          Таны ирээдүйг нээж, удирдамж өгөх мэргэжлийн Tarot уншлага
        </p>
      </div>

      {!user ? (
        <div className="max-w-md mx-auto bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <h3 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-purple-400" />
            Нэвтрэх / Бүртгүүлэх
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          <input
            type="email"
            placeholder="И-мэйл хаяг"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 mb-4 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition"
          />

          <input
            type="password"
            placeholder="Нууц үг (багадаа 6 тэмдэгт)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 mb-6 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition"
          />

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleLogin}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
            >
              Нэвтрэх
            </button>
            <button
              onClick={handleRegister}
              className="flex-1 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all"
            >
              Бүртгүүлэх
            </button>
          </div>

          <div className="text-center text-sm text-purple-300 space-y-1">
            <p>💫 Хялбараар нэвтрэх, бүртгүүлэх боломжтой</p>
            <p>🔐 Таны мэдээлэл найдвартай хадгалагдана</p>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-semibold text-center mb-6 text-purple-300">
            🎉 Та амжилттай нэвтэрсэн байна!
          </h3>
          <div className="text-center mb-6">
            <button
              onClick={() => navigateTo('topics')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
            >
              Уншлага эхлүүлэх
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Нүүр хуудасны мэдээ, блог хэсэг */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-serif font-bold mb-6 text-purple-300 text-center">
        📰 Сүүлийн үеийн мэдээ, блогууд
      </h2>
      <NewsBlogsSection activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  </>
)}

        {/* Birthdate Page */}
        {/* Birthdate Page */}
{currentPage === 'birthdate' && (
  <div className="max-w-2xl mx-auto px-4 py-20">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-serif font-bold mb-4 text-purple-300">
        Төрсөн мэдээлэл оруулна уу
      </h2>
      <p className="text-purple-400">
        Таны төрсөн өдөр, хүйс таны хувь заяаг тодорхойлоход тусална
      </p>
    </div>

    <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
      <div className="mb-6">
        <label className="block text-purple-300 mb-2 text-sm font-medium">
          Төрсөн өдөр
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-6 py-4 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition"
        />
      </div>

      <div className="mb-8">
        <label className="block text-purple-300 mb-3 text-sm font-medium">
          Хүйс
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'male', label: 'Эрэгтэй', emoji: '👨' },
            { value: 'female', label: 'Эмэгтэй', emoji: '👩' },
            { value: 'other', label: 'Бусад', emoji: '🧑' },
            { value: 'prefer_not_to_say', label: 'Хэлэхгүй', emoji: '🤐' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                gender === option.value
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-purple-950/60 border-purple-500/50 text-purple-300 hover:border-purple-400'
              }`}
            >
              <span className="text-2xl mb-2">{option.emoji}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleBirthDateSubmit}
        disabled={!birthDate || !gender}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          birthDate && gender
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5'
            : 'bg-purple-800/50 text-purple-400 cursor-not-allowed'
        }`}
      >
        Үргэлжлүүлэх →
      </button>
    </div>
  </div>
)}

        {/* Topics Page */}
        {currentPage === 'topics' && (
          <div className="max-w-6xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
              Сэдэв сонгоно уу
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOPICS.map((topic) => {
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
        )}

        {/* Cards Selection Page */}
        {currentPage === 'cards' && (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-serif font-bold mb-4 text-purple-300">
                3 хөзөр сонгоно уу
              </h2>
              <div className="inline-block px-6 py-3 bg-purple-600/30 rounded-full border border-purple-500/50">
                <span className="text-xl font-semibold">
                  Сонгосон: {selectedCards.length}/3
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {shuffledCards.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                const isFlipped = isSelected;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card.id)}
                    className={`aspect-[2/3] cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                      isFlipped ? 'scale-105' : ''
                    }`}
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-900 to-indigo-950 rounded-xl border-2 border-purple-500 flex flex-col items-center justify-center p-4">
                        <div className="text-4xl mb-2">{card.symbol}</div>
                        <div className="text-xs text-purple-300 font-serif">Tarot</div>
                      </div>

                      {/* Back */}
                      <div className={`absolute inset-0 backface-hidden bg-gradient-to-br ${card.color} rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center p-4 rotate-y-180`}>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <div className="text-4xl mb-2">{card.symbol}</div>
                        <div className="text-sm font-semibold text-center mb-1">{card.mongolian}</div>
                        <div className="text-xs text-center opacity-90">{card.meaning}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setSelectedCards([]);
                  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
                  setShuffledCards(shuffled);
                }}
                className="px-8 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Дахин эхлүүлэх
              </button>
            </div>
          </div>
        )}

        {/* Result Page */}
        {currentPage === 'result' && (
          <div className="max-w-6xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
              ✨ Таны Таротын үр дүн ✨
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {selectedCards.map((cardId, index) => {
                const card = TAROT_CARDS.find(c => c.id === cardId);
                const positions = ['🌅 Өнгөрсөн', '⏰ Одоо', '🌟 Ирээдүй'];
                
                return (
                  <div
                    key={cardId}
                    className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="text-center mb-6">
                      <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full font-semibold">
                        {positions[index]}
                      </span>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-7xl mb-4">{card.symbol}</div>
                      <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                        {card.mongolian}
                      </h3>
                      <p className="text-purple-300 leading-relaxed">
                        {card.meaning}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-purple-500/30">
                      <p className="text-sm text-purple-400 text-center italic">
                        {index === 0 && "Таны өнгөрсөн туршлага, хийсэн сонголтууд"}
                        {index === 1 && "Таны одоогийн байдал, тулгарч буй асуудал"}
                        {index === 2 && "Таны ирээдүйд болох зүйл, боломжууд"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Interpretation */}
            <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center text-purple-300">
                🔮 Нарийвчилсан тайлбар
              </h3>
              
              <div className="space-y-6">
                <div className="bg-purple-950/50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-3 text-purple-200">
                    💭 Ерөнхий дүгнэлт
                  </h4>
                  <p className="text-purple-300 leading-relaxed">
                    Таны сонгосон хөзрүүд таны амьдралын гурван үе шатыг харуулж байна. 
                    Өнгөрсөн таны туршлага болон сургамжийг, одоо таны одоогийн байдал болон 
                    шийдвэр гаргах шаардлагатай асуудлуудыг, харин ирээдүй таны хийх сонголтоос 
                    хамаарах боломжуудыг илтгэж байна.
                  </p>
                </div>

                <div className="bg-purple-950/50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-3 text-purple-200">
                    🎯 Зөвлөмж
                  </h4>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Өнгөрсөн таны туршлагаас суралцаж, одоо мөчид анхаарлаа төвлөрүүлээрэй</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Одоогийн байдалд тулгуурлан ирээдүйн төлөвлөгөөгөө боловсруулаарай</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Таны интуицид итгэж, дотоод дуу хоолойгоо сонсоорой</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Таротын удирдамж нь зөвхөн санал болгоо - эцсийн шийдвэр танд байна</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-950/50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold mb-3 text-purple-200">
                    ⏰ Цагийн хуваарь
                  </h4>
                  <p className="text-purple-300 leading-relaxed">
                    Энэхүү уншлага таны {selectedTopic?.name || 'сонгосон сэдэв'}-тэй холбоотой 
                    ойрын 1-3 сарын хугацааг хамарч байна. Та энэ хугацаанд ихээхэн өөрчлөлт, 
                    хөгжил дэвшлийг мэдэрч магадгүй юм.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetReading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Шинэ уншлага хийх
              </button>
              
              <button
                onClick={() => {
                  const result = selectedCards.map((id, i) => {
                    const card = TAROT_CARDS.find(c => c.id === id);
                    const pos = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'][i];
                    return `${pos}: ${card.mongolian} - ${card.meaning}`;
                  }).join('\n');
                  
                  navigator.clipboard.writeText(result);
                  showMessage('success', '✅ Үр дүн хуулагдлаа!');
                }}
                className="px-8 py-4 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold text-lg hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all"
              >
                📋 Үр дүн хуулах
              </button>
            </div>

            {/* Share Section */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-purple-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                <p className="text-purple-300 mb-4">
                  💜 Таалагдсан уу? Найз нөхөдтэйгээ хуваалцаарай!
                </p>
                <div className="flex gap-3 justify-center">
                  <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-xl">📘</span>
                  </button>
                  <button className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-xl">🐦</span>
                  </button>
                  <button className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-xl">📷</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Blogs Page */}
{currentPage === 'blogs' && (
  <div className="max-w-6xl mx-auto px-4 py-20">
    <h1 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
      📝 Блогууд
    </h1>
    <NewsBlogsSection activeTab="blogs" />
  </div>
)}

{/* News Page */}
{currentPage === 'news' && (
  <div className="max-w-6xl mx-auto px-4 py-20">
    <h1 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
      📰 Мэдээ
    </h1>
    <NewsBlogsSection activeTab="news" />
  </div>
)}

{/* About Page */}
{currentPage === 'about' && (
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
    </div>
  </div>
)}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-purple-500/30 bg-purple-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Бидэнтэй холбогдох</h3>
              <ul className="space-y-2 text-purple-400 text-sm">
                <li>📧 info@tarot-mongolia.mn</li>
                <li>📱 +976 9999-9999</li>
                <li>📍 Улаанбаатар хот, Монгол улс</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-colors">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-colors">
                  📷
                </a>
                <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-colors">
                  🐦
                </a>
              </div>
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

      {/* Success/Error Toast */}
      {(success || error) && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-xl shadow-2xl ${
            error 
              ? 'bg-red-500/90 border border-red-400' 
              : 'bg-green-500/90 border border-green-400'
          } backdrop-blur-md`}>
            <p className="text-white font-medium">{error || success}</p>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TarotApp;