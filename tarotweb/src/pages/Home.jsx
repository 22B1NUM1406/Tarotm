import React, { useState, useRef, useEffect } from 'react';
import { Star, NewspaperIcon } from '../icons';
import NewsBlogsSection from '../components/NewsBlogsSection';

const VideoCard = ({ videoSrc = './videos/0.mp4', width = 200, height = 300 }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    videoRef.current.loop = true;
    setTimeout(() => {
      videoRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(() => { if (videoRef.current) videoRef.current.controls = true; });
    }, 100);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else           { videoRef.current.play();  setIsPlaying(true);  }
  };

  return (
    <div className="relative cursor-pointer" style={{ width, height, perspective: '1000px' }} onClick={togglePlay}>
      <div className="relative w-full h-full transition-all duration-1000 hover:scale-105"
        style={{ transformStyle: 'preserve-3d', animation: 'rotateCard 3s ease-in-out infinite' }}>
        <div className="absolute w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-purple-500/50">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline loop muted preload="auto">
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-black/60 rounded-full p-4">
              <span className="text-white text-2xl">{isPlaying ? '⏸' : '▶'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = ({
  user, email, setEmail, password, setPassword,
  handleLogin, handleRegister, navigateTo,
  error, success, authLoading,
  activeTab, setActiveTab, onArticleClick,
  hasPaid,
}) => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-12">
          <VideoCard videoSrc="./videos/0.mp4" width={200} height={300} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
          Таротын Мэргэ Авах
        </h1>
        <p className="text-xl text-purple-300">
          Таны ирээдүйг нээж, удирдамж өгөх мэргэжлийн Tarot уншлага
        </p>
      </div>

      <style jsx>{`
        @keyframes rotateCard {
          0%,100% { transform: rotateY(0deg) rotateX(0deg); }
          25%      { transform: rotateY(5deg) rotateX(2deg); }
          75%      { transform: rotateY(-5deg) rotateX(-2deg); }
        }
      `}</style>

      {!user ? (
        /* ── Нэвтрэх форм ── */
        <div className="max-w-md mx-auto bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <h3 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-purple-400" />
            Нэвтрэх / Бүртгүүлэх
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm animate-shake">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">{success}</div>
          )}

          <input type="email" placeholder="И-мэйл хаяг" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 mb-4 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition" />

          <input type="password" placeholder="Нууц үг (багадаа 6 тэмдэгт)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 mb-6 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition" />

          <div className="flex gap-3 mb-6">
            <button onClick={handleLogin} disabled={authLoading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {authLoading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
            </button>
            <button onClick={handleRegister} disabled={authLoading}
              className="flex-1 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50">
              Бүртгүүлэх
            </button>
          </div>
          <div className="text-center text-sm text-purple-300 space-y-1">
            <p>💫 Хялбараар нэвтрэх, бүртгүүлэх боломжтой</p>
            <p>🔐 Таны мэдээлэл найдвартай хадгалагдана</p>
          </div>
        </div>
      ) : (
        /* ── Нэвтэрсэн хэрэглэгч ── */
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 text-center">
            <h3 className="text-2xl font-semibold mb-2 text-purple-300">
              🎉 Тавтай морил, {user.name}!
            </h3>

            {/* Төлбөрийн статус */}
            {hasPaid ? (
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm font-medium">Төлбөр идэвхтэй</span>
              </div>
            ) : (
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                <span className="text-yellow-300 text-sm">💳 Хөзөр сонгохын тулд 5,000₮ төлнө</span>
              </div>
            )}

            <button
              onClick={() => navigateTo('birthdate')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
            >
              🔮 Уншлага эхлүүлэх
            </button>

            {!hasPaid && (
              <button
                onClick={() => navigateTo('payment')}
                className="mt-3 w-full py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition text-sm"
              >
                💳 Шууд төлбөр төлөх
              </button>
            )}
          </div>

          {/* Үнийн мэдээлэл */}
          {!hasPaid && (
            <div className="bg-purple-900/20 backdrop-blur-lg rounded-2xl p-5 border border-purple-500/20">
              <h4 className="text-purple-200 font-semibold mb-3 text-sm text-center">
                🎴 Үйлчилгээний нөхцөл
              </h4>
              <div className="flex items-center justify-between py-2 border-b border-purple-500/20">
                <span className="text-purple-300 text-sm">Таротын уншлага</span>
                <span className="text-white font-bold">5,000₮</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-purple-300 text-sm">Агуулга</span>
                <span className="text-purple-200 text-sm">3 хөзөр · тайлбар</span>
              </div>
              <p className="text-purple-400 text-xs mt-3 text-center">
                QPay-ээр хялбархан төлнө
              </p>
            </div>
          )}
        </div>
      )}

      {/* Мэдээ, блогууд */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
        <h2 className="text-3xl font-serif font-bold mb-6 text-purple-300 flex items-center justify-center gap-3">
          <NewspaperIcon className="size-10" />
          Сүүлийн үеийн мэдээ, блогууд
        </h2>
        <NewsBlogsSection activeTab={activeTab} setActiveTab={setActiveTab} onArticleClick={onArticleClick} />
      </div>
    </>
  );
};

export default Home;