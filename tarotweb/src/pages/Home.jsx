import React, { useState, useRef, useEffect } from 'react';
import { Star, NewspaperIcon } from '../icons';
import NewsBlogsSection from '../components/NewsBlogsSection';

const VideoCard = ({ 
  videoSrc = "./videos/0.mp4", 
  width = 200,
  height = 300
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Бичлэгийг автоматаар эхлүүлэх
  useEffect(() => {
    if (videoRef.current) {
      // Бүх хөтөч дээр ажиллах баталгаатай арга
      const playVideo = async () => {
        try {
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.loop = true;
          
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video autoplay started successfully");
                setIsPlaying(true);
              })
              .catch(error => {
                console.log("Autoplay failed:", error);
                // Хэрэглэгч дарсан үед тоглуулах боломжтой болгох
                videoRef.current.controls = true;
              });
          }
        } catch (error) {
          console.log("Video play error:", error);
        }
      };

      // Бага зэрэг хүлээгээд эхлүүлэх
      setTimeout(() => {
        playVideo();
      }, 100);
    }
  }, []);

  // Видеог тоглуулах/зогсоох функц
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
      className="relative cursor-pointer"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        perspective: '1000px'
      }}
      onClick={togglePlay}
    >
      {/* Хөзрийн эргэлтийн анимаци */}
      <div 
        className="relative w-full h-full transition-all duration-1000 hover:scale-105"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'rotateCard 3s ease-in-out infinite'
        }}
      >
        {/* Видео тал */}
        <div className="absolute w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-purple-500/50">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            loop
            muted
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
            <p>Таны хөтөч видео тоглуулахыг дэмждэггүй.</p>
          </video>
          
          {/* Play/Pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-black/60 rounded-full p-4">
              {isPlaying ? (
                <span className="text-white text-2xl">⏸</span>
              ) : (
                <span className="text-white text-2xl">▶</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Home = ({ 
  user, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  handleLogin, 
  handleRegister, 
  navigateTo, 
  error, 
  success, 
  authLoading,
  activeTab,
  setActiveTab,
  onArticleClick 
}) => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="flex flex-wrap justify-center gap-8 mb-12">
            <VideoCard 
              videoSrc="./videos/0.mp4"
              width={200}
              height={300}
            />
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
            Таротын Мэргэ Авах
          </h1>
          <p className="text-xl text-purple-300">
            Таны ирээдүйг нээж, удирдамж өгөх мэргэжлийн Tarot уншлага
          </p>
        </div>

        {/* CSS стил нэмэх */}
        <style jsx>{`
          @keyframes rotateCard {
            0% {
              transform: rotateY(0deg) rotateX(0deg);
            }
            25% {
              transform: rotateY(5deg) rotateX(2deg);
            }
            50% {
              transform: rotateY(0deg) rotateX(0deg);
            }
            75% {
              transform: rotateY(-5deg) rotateX(-2deg);
            }
            100% {
              transform: rotateY(0deg) rotateX(0deg);
            }
          }
          
          .hover\\:scale-105:hover {
            transform: scale(1.05);
          }
        `}</style>
        

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
                disabled={authLoading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {authLoading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
              </button>
              <button
                onClick={handleRegister}
                disabled={authLoading}
                className="flex-1 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
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
      

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-serif font-bold mb-6 text-purple-300 flex items-center justify-center">
          <NewspaperIcon className='mr-2 size-10' />
          Сүүлийн үеийн мэдээ, блогууд
        </h2>
        <NewsBlogsSection 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onArticleClick={onArticleClick} 
        />
      </div>
    </>
  );
};

export default Home;