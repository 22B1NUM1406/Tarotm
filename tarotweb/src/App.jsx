import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Copy } from './icons/index';

// Firebase
import { auth } from './data/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Өгөгдөл
import { TAROT_CARDS } from './data/tarotCards';
import { TOPICS } from './data/topics';
import { NEWS_AND_BLOGS } from './data/newsBlogs';

// Компонентууд
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DetailedArticleModal from './components/DetailedArticleModal';

// Хуудаснууд - Хуучин
import Home from './pages/Home';
import Birthdate from './pages/Birthdate';
import Topics from './pages/Topics';
import Cards from './pages/Cards';
import Result from './pages/Result';
import Blogs from './pages/Blogs';
import News from './pages/News';
import About from './pages/About';

// Хуудаснууд - Шинэ
import Information from './pages/Information';
import Horoscope from './pages/Horoscope';
import Meditation from './pages/Meditation';

// Auth утилит
import { handleLogin, handleRegister, handleLogout } from './utils/authUtils';

const TarotApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [gender, setGender] = useState('');
  const [pageHistory, setPageHistory] = useState(['home']);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showFullResult, setShowFullResult] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.email?.split('@')[0] || 'U')}&background=8b5cf6&color=fff&size=128`
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const thirtyYearsAgo = new Date();
    thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
    setBirthDate(thirtyYearsAgo.toISOString().split('T')[0]);

    return () => unsubscribe();
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

  const handleBirthDateSubmit = () => {
    if (!birthDate) {
      showMessage('error', '⚠️ Төрсөн өдрөө оруулна уу');
      return;
    }
    
    if (!gender) {
      showMessage('error', '⚠️ Хүйсээ сонгоно уу');
      return;
    }
    
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

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const PROFESSIONAL_READING_LINK = "https://www.facebook.com/TarotMongoliaProfessional";

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

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return (
          <Home 
            user={user}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={() => handleLogin(email, password, setAuthLoading, showMessage, navigateTo)}
            handleRegister={() => handleRegister(email, password, setAuthLoading, showMessage, navigateTo)}
            navigateTo={navigateTo}
            error={error}
            success={success}
            authLoading={authLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onArticleClick={handleArticleClick}
          />
        );
      case 'birthdate':
        return (
          <Birthdate 
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            gender={gender}
            setGender={setGender}
            handleBirthDateSubmit={handleBirthDateSubmit}
          />
        );
      case 'topics':
        return (
          <Topics 
            topics={TOPICS}
            handleTopicSelect={handleTopicSelect}
          />
        );
      case 'cards':
        return (
          <Cards 
            shuffledCards={shuffledCards}
            selectedCards={selectedCards}
            handleCardSelect={handleCardSelect}
            setSelectedCards={setSelectedCards}
            setShuffledCards={setShuffledCards}
            tarotCards={TAROT_CARDS}
          />
        );
      case 'result':
        return (
          <Result 
            selectedCards={selectedCards}
            selectedTopic={selectedTopic}
            tarotCards={TAROT_CARDS}
            resetReading={resetReading}
            professionalReadingLink={PROFESSIONAL_READING_LINK}
            showMessage={showMessage}
          />
        );
      case 'information':
        return <Information />;
      case 'meditation':
        return <Meditation />;
      case 'horoscope':
        return <Horoscope />;
      case 'blogs':
        return (
          <Blogs 
            onArticleClick={handleArticleClick}
          />
        );
      case 'news':
        return (
          <News 
            onArticleClick={handleArticleClick}
          />
        );
      case 'about':
        return (
          <About 
            professionalReadingLink={PROFESSIONAL_READING_LINK}
            navigateTo={navigateTo}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
      <Starfield />
      
      <Navbar 
        user={user}
        currentPage={currentPage}
        navigateTo={navigateTo}
        handleLogout={() => handleLogout(showMessage, setUser, setEmail, setPassword, setPageHistory, setCurrentPage)}
      />
      
      <div className="pt-16 relative z-10">
        {renderPage()}
      </div>

      <Footer 
        navigateTo={navigateTo}
        currentPage={currentPage}
      />
      
      {pageHistory.length > 1 && currentPage !== 'home' && (
        <button
          onClick={goBack}
          className="fixed bottom-8 left-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all z-40"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

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

      {selectedArticle && (
        <DetailedArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      <style jsx>{`
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