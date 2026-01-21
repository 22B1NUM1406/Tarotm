import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Clock, Volume2, VolumeX, SkipBack, SkipForward, Check, Share2, Download } from '../icons/index';
import { MEDITATIONS } from '../data/meditations';

const Meditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [completedMeditations, setCompletedMeditations] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const audioRef = useRef(null);

  // Аудио элемент эвентүүд
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Марк as completed
      if (selectedMeditation && !completedMeditations.includes(selectedMeditation.id)) {
        setCompletedMeditations(prev => [...prev, selectedMeditation.id]);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedMeditation]);

  // Аудио тоглуулах/зогсоох
  const togglePlay = () => {
    if (!selectedMeditation) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Аудио тоглуулахад алдаа:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Бясалгал сонгох
  const handleSelectMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    setIsPlayerVisible(true);
    
    // Аудио src өөрчлөх
    if (audioRef.current) {
      audioRef.current.src = meditation.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
      
      if (!isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(error => {
            console.error('Аудио тоглуулахад алдаа:', error);
          });
          setIsPlaying(true);
        }, 100);
      }
    }
  };

  // Цаг хэсэгчлэх
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Дууны хэмжээ
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Дуугүй болгох
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Урагш/хойш шилжих
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 30;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 30;
    }
  };

  // Цаг хугацааг форматлах
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Хуваалцах
  const handleShare = (meditation) => {
    if (navigator.share) {
      navigator.share({
        title: meditation.title,
        text: meditation.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('📋 Холбоос хуулагдлаа!');
    }
  };

  // Татаж авах
  const handleDownload = (meditation) => {
    const link = document.createElement('a');
    link.href = meditation.audioUrl;
    link.download = `${meditation.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎧 Дуутай бясалгалууд
        </h1>
        <p className="text-xl text-purple-300 max-w-3xl mx-auto">
          Сонсголын бясалгалаар тайван болж, өөрийгөө ойлгоорой
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-r from-purple-600/30 to-purple-800/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm mb-1">Сонссон бясалгал</p>
              <p className="text-3xl font-bold text-white">
                {completedMeditations.length} / {MEDITATIONS.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧘</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/30 to-blue-800/30 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-400 text-sm mb-1">Дууны нийт хугацаа</p>
              <p className="text-3xl font-bold text-white">
                {MEDITATIONS.reduce((acc, med) => {
                  const mins = parseInt(med.duration);
                  return acc + (isNaN(mins) ? 0 : mins);
                }, 0)} мин
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/30 to-rose-800/30 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-400 text-sm mb-1">Онцлох бясалгал</p>
              <p className="text-3xl font-bold text-white">
                {MEDITATIONS.filter(m => m.category === 'анхлан суралцагч').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meditations Grid */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-purple-300">
            <span className="mr-3">🎵</span>
            Бүх бясалгалууд ({MEDITATIONS.length})
          </h2>
          <div className="text-sm text-purple-400">
            Дуу дарж сонсоорой
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDITATIONS.map((meditation) => (
            <div
              key={meditation.id}
              className={`bg-gradient-to-br ${meditation.color} backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all group cursor-pointer`}
              onClick={() => handleSelectMeditation(meditation)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{meditation.icon}</div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white">
                    {meditation.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm">{meditation.duration}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {meditation.title}
                {completedMeditations.includes(meditation.id) && (
                  <Check className="w-5 h-5 text-green-300 inline-block ml-2" />
                )}
              </h3>
              
              <p className="text-white/80 text-sm mb-4">
                {meditation.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="text-white/70 text-xs font-medium">Үе шатууд:</div>
                <div className="space-y-2">
                  {meditation.steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/90 text-sm">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMeditation(meditation);
                  }}
                  className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-5 h-5" />
                  <span>Сонсох</span>
                </button>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(meditation);
                    }}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                    title="Хуваалцах"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(meditation);
                    }}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                    title="Татаж авах"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Player (Fixed at bottom) */}
      {isPlayerVisible && selectedMeditation && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-950/95 to-purple-900/80 backdrop-blur-lg border-t border-purple-500/30 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Current Meditation Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedMeditation.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-2xl">{selectedMeditation.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedMeditation.title}</h3>
                  <p className="text-purple-300 text-sm">{selectedMeditation.duration} • {selectedMeditation.category}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPlayerVisible(false)}
                className="text-purple-300 hover:text-white p-2"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Player Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-purple-400 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={skipBackward}
                    className="p-2 text-purple-300 hover:text-white transition-colors"
                    title="30 секунд хойш"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-2 text-purple-300 hover:text-white transition-colors"
                    title="30 секунд урагш"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-purple-300 hover:text-white transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-purple-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30">
        <h3 className="text-2xl font-serif font-bold mb-6 text-cyan-300">
          💡 Бясалгалын зөвлөмж
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-cyan-900/40 rounded-xl p-6">
            <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Чихэвч ашиглах</h4>
            <p className="text-cyan-200 text-sm">
              Чанартай чихэвч ашигласнаар дууны чанар, төвлөрөл сайжирна.
            </p>
          </div>

          <div className="bg-blue-900/40 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌙</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Тайван орчин</h4>
            <p className="text-blue-200 text-sm">
              Ямар ч саадгүй, тайван орчинд бясалгал хийх нь илүү үр дүнтэй.
            </p>
          </div>

          <div className="bg-purple-900/40 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Тогтмол байдал</h4>
            <p className="text-purple-200 text-sm">
              Өдөр бүр тогтмол цагт бясалгал хийх нь хамгийн үр дүнтэй.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;