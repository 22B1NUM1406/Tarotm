
import React, { useState, useEffect } from 'react';
import { Moon, Star, Heart, Briefcase, DollarSign, Activity, Sparkles, ArrowLeft, LogOut, RotateCcw, Check, Home, Book, FileText, User, ExternalLink, ChevronRight, Loader2 } from 'lucide-react';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

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

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
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

// Дэлгэрэнгүй мэдээ, блогууд - ШИНЭЧЛЭГДСЭН
const NEWS_AND_BLOGS = [
  {
    id: 1,
    type: 'news',
    title: 'Таротын хөзрийн түүх',
    description: 'Таротын хөзөр нь 15-р зуунаас хойш хөгжиж ирсэн нууц шинжлэх ухаан юм.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Таротын хөзрийн гарал үүсэл</h2>
      <p class="mb-4">Таротын хөзөр нь 15-р зууны Европт гарч ирсэн бөгөөд анх картын тоглоом болгон ашиглагдаж байв. Гэхдээ 18-р зуунаас эхлэн ирээдүй урьдчилан харах, мэргэ унших зорилгоор өргөн хэрэглэгдэж эхэлсэн.</p>
      
      <h3 class="text-xl font-bold mb-3">Гол бүрэлдэхүүн хэсгүүд:</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Их Аркан</strong> (22 хөзөр) - Амьдралын том төлөвлөгөө, сүнслэг хөгжил</li>
        <li><strong>Бага Аркан</strong> (56 хөзөр) - Өдөр тутмын асуудал, практик туршлага</li>
        <li><strong>4 Ширхэг</strong> (Хүрз, Цайр, Алд, Хөшөө) - Өөр өөр амьдралын салбарууд</li>
      </ul>
      
      <p class="mb-4">Орчин үеийн тарот нь сэтгэл зүй, өөрийгөө хөгжүүлэх, интуицийг хөгжүүлэх арга хэрэгсэл болон хувирч байна.</p>
      
      <div class="bg-purple-900/30 p-4 rounded-lg my-4">
        <p class="italic">"Тарот бол толь мэт - энэ нь таны дотоод ертөнцийг тусгадаг, таны сэтгэл хөдлөл, хүсэл эрмэлзэл, боломжуудыг харуулдаг."</p>
      </div>
      
      <h3 class="text-xl font-bold mb-3">Таротын мэргэн ухаан:</h3>
      <p>Тарот нь зөвхөн ирээдүйг урьдчилан харах төдийгүй:</p>
      <ol class="list-decimal pl-5 space-y-2 mt-2">
        <li>Өөрийгөө илүү сайн ойлгох</li>
        <li>Шийдвэр гаргахад тусалдаг</li>
        <li>Дотоод мэргэн ухааныг сэрээх</li>
        <li>Амьдралын төлөвлөгөөг тодруулах</li>
      </ol>
    `,
    date: '2024-03-15',
    readTime: '5 мин',
    author: 'Б. Эрдэнэ',
    views: 1250
  },
  {
    id: 2,
    type: 'blog',
    title: 'Өдөр тутмын таротын дасгал',
    description: 'Өдөр бүр таротын хөзрөөр дасгал хийх нь интуициа хөгжүүлдэг.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Өдөр тутмын Таротын дасгалууд</h2>
      <p class="mb-4">Өдөр бүр таротын хөзрөөр дасгал хийх нь таны интуицийг хөгжүүлж, өдрийг эхлүүлэх сайхан арга юм.</p>
      
      <h3 class="text-xl font-bold mb-3">1. Өдрийн Хөзөр:</h3>
      <p class="mb-3">Өглөө босоод нэг хөзөр татаад:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Өнөөдөр надад ямар энерги дэлгэрэх вэ?</li>
        <li>Өнөөдөр би ямар сануулга авах вэ?</li>
        <li>Өнөөдрийн төвөгтэй асуудалд хэрхэн хандах вэ?</li>
      </ul>
      
      <h3 class="text-xl font-bold mb-3">2. Гурван хөзрийн дасгал:</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold mb-2">🌅 Өглөө (8:00-12:00)</h4>
          <p>Өглөөний цагийн энерги</p>
        </div>
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold mb-2">☀️ Өдөр (12:00-18:00)</h4>
          <p>Үйл ажиллагааны энерги</p>
        </div>
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold mb-2">🌙 Орой (18:00-22:00)</h4>
          <p>Амралтын цагийн энерги</p>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-3">3. Хөзөртэй танилцах:</h3>
      <p class="mb-4">Өдөр бүр шинэ хөзөртэй танилцаж, түүний:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Дүрслэл, өнгө, бэлгэдлийг судлах</li>
        <li>Монгол нэр, утгыг цээжлэх</li>
        <li>Өөрийн амьдралд хэрхэн хамаарахыг бодох</li>
      </ul>
      
      <div class="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6 rounded-lg my-6">
        <h4 class="text-lg font-bold mb-2">💫 Өдрийн аффирмаци:</h4>
        <p class="italic">"Би өнөөдөр илүү ухаантай, илүү мэдрэмтгий байна. Миний интуици намайг зөв замаар хөтөлнө."</p>
      </div>
      
      <h3 class="text-xl font-bold mb-3">4. Таротын тэмдэглэл хөтөлөх:</h3>
      <p>Өдөр бүр татаж авсан хөзрөө тэмдэглэлдээ бичиж, тухайн өдөр юу болсон, ямар мэдрэмж төрснийг тэмдэглэ. Энэ нь таны интуицийн хөгжилд маш их тусална.</p>
    `,
    date: '2024-03-14',
    readTime: '7 мин',
    author: 'Ц. Гэрэл',
    views: 890
  },
  {
    id: 3,
    type: 'news',
    title: 'Шинэ таротын хөзрийн цуврал',
    description: '2024 онд гаргах шинэ таротын хөзрийн цувралын тухай мэдээлэл.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">2024 оны шинэ Таротын цувралууд</h2>
      <p class="mb-4">2024 он нь таротын хөгжлийн хувьд маш их шинэчлэлтэй жил байна. Дэлхийн өнцөг булан бүрээс гаралтай 5 шинэ таротын цуврал та бүхэнд хүргэгдэж байна.</p>
      
      <h3 class="text-xl font-bold mb-3">1. Монгол Тарот</h3>
      <div class="flex items-start gap-4 mb-4">
        <div class="w-32 h-48 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-lg flex items-center justify-center">
          <span class="text-4xl">🏔️</span>
        </div>
        <div>
          <p><strong>Зохиогч:</strong> Монголын уран зураачдын бүлэг</p>
          <p><strong>Онцлог:</strong> Монголын соёл, урлаг, нүүдэлчдийн амьдрал, тэнгэрийн бэлгэдэл</p>
          <p><strong>Гаргах хугацаа:</strong> 2024 оны 6 сар</p>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-3">2. Цэнхэр Далайн Тарот</h3>
      <div class="flex items-start gap-4 mb-4">
        <div class="w-32 h-48 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-lg flex items-center justify-center">
          <span class="text-4xl">🌊</span>
        </div>
        <div>
          <p><strong>Зохиогч:</strong> Далайн экологичид</p>
          <p><strong>Онцлог:</strong> Далайн амьдрал, долгион, далайн гүнээс сэдэвлэсэн</p>
          <p><strong>Гаргах хугацаа:</strong> 2024 оны 8 сар</p>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-3">3. Дижитал Эпохийн Тарот</h3>
      <div class="flex items-start gap-4 mb-6">
        <div class="w-32 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <span class="text-4xl">💻</span>
        </div>
        <div>
          <p><strong>Зохиогч:</strong> Дижитал уран бүтээлчид</p>
          <p><strong>Онцлог:</strong> AI, VR технологи, дижитал ертөнцийн бэлгэдэл</p>
          <p><strong>Гаргах хугацаа:</strong> 2024 оны 10 сар</p>
        </div>
      </div>
      
      <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-6">
        <p class="font-bold">❗ Анхааруулга:</p>
        <p>Шинэ цувралуудыг албан ёсны дистрибьютерээс л худалдан авна уу. Худалдаалагдаж буй хөзрүүд нь өндөр чанартай, зөв бэлгэдэлтэй байх ёстой.</p>
      </div>
      
      <h3 class="text-xl font-bold mb-3">Хяналтын шалгуурууд:</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>Өндөр нарийвчлалтай хэвлэл</li>
        <li>Мэргэжлийн таротын зөвлөлийн баталгаа</li>
        <li>Экологийн ээлтэй материал</li>
        <li>Бүрэн тайлбар, гарын авлагатай</li>
      </ul>
    `,
    date: '2024-03-13',
    readTime: '4 мин',
    author: 'Ш. Болд',
    views: 2100
  },
  {
    id: 4,
    type: 'blog',
    title: 'Тарот ба сэтгэл зүй',
    description: 'Таротын хөзөр хэрхэн сэтгэл зүйн эмчилгээнд хэрэглэгддэг тухай.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Тарот ба Сэтгэл Зүйн Холбоо</h2>
      <p class="mb-4">Сүүлийн жилүүдэд тарот нь зөвхөн ирээдүй урьдчилан харах хэрэгсэл биш, харин сэтгэл зүйн эмчилгээнд ашиглагдах хүчирхэг хэрэгсэл болж байна.</p>
      
      <h3 class="text-xl font-bold mb-3">Тарот сэтгэл зүй дахь хэрэглээ:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">🎭 Төсөөлөл, Проекци</h4>
          <p>Хэрэглэгч хөзөр дээр өөрийн дотоод сэтгэл хөдлөл, санааг тусгаж хардаг</p>
        </div>
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">💬 Ярианы Тулгуур</h4>
          <p>Хөзрүүд ярилцлагыг эхлүүлэх, хэцүү сэдвүүдийг нээхэд тусалдаг</p>
        </div>
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">🔄 Өөрчлөлтийг Ойлгох</h4>
          <p>Амьдралын шилжилтийн үеийг ойлгоход тусалдаг</p>
        </div>
        <div class="bg-purple-900/40 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">🌈 Дотоод Нөөцийг Нээх</h4>
          <p>Хүний дотоод хүч чадлыг танин мэдэхэд туслах</p>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-3">Карл Юнгийн Холбоо:</h3>
      <p class="mb-4">Алдарт сэтгэл зүйч Карл Юнг таротыг "архетип"-ын илэрхийлэл гэж үздэг байв. Түүний онолын дагуу:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Таротын хөзрүүд нь хүний "хамтарсан ухамсар"-ын илэрхийлэл</li>
        <li>Хүн бүрт байдаг нийтлэг бэлгэдлүүд, төсөөллүүд</li>
        <li>Хөзрүүд нь бидний дотоод тэмцэл, хөгжлийг харуулдаг</li>
      </ul>
      
      <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg my-6">
        <h4 class="text-lg font-bold mb-2">🧠 Сэтгэл Зүйчдийн Зөвлөмж:</h4>
        <p class="italic">"Тарот нь толь шиг - энэ нь таныг өөртөө харж, өөрсдийн сэтгэл хөдлөл, санааг илүү сайн ойлгоход тусалдаг. Энэ нь ирээдүйг таах биш, харин өөрийгөө илүү сайн ойлгох хэрэгсэл юм."</p>
        <p class="text-right mt-2">- Др. С. Баярмаа, сэтгэл зүйч</p>
      </div>
      
      <h3 class="text-xl font-bold mb-3">Практик Дасгалууд:</h3>
      <p><strong>1. Өөрийгөө ойлгох:</strong> Гурван хөзөр татаад:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Би хэн бэ? (Тэнэг, Илбэчин, Хатан хаан гэх мэт)</li>
        <li>Миний хүч чадал юу вэ?</li>
        <li>Миний хөгжих ёстой тал юу вэ?</li>
      </ul>
      
      <p><strong>2. Сэтгэл хөдлөлийн боловсрол:</strong> Өдөр бүр нэг хөзрөөр өөрийн сэтгэл хөдлөлөө илэрхийл.</p>
      
      <p class="mt-6"><strong>Анхаар:</strong> Тарот нь сэтгэл зүйн эмчилгээний орлуулагч биш юм. Хэрэв та сэтгэл зүйн ноцтой асуудалтай бол мэргэжлийн тусламж хүснэ.</p>
    `,
    date: '2024-03-12',
    readTime: '10 мин',
    author: 'Д. Энхжин',
    views: 1560
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

// Detailed News/Blog Modal Component - ШИНЭ
const DetailedArticleModal = ({ article, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-3xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-purple-900/80 rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors z-10"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* Article Header */}
        <div className="p-8 border-b border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              article.type === 'news' 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-pink-500/90 text-white'
            }`}>
              {article.type === 'news' ? 'МЭДЭЭ' : 'БЛОГ'}
            </span>
            <span className="text-purple-400 text-sm">{article.date}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-purple-300 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️ {article.readTime} уншихад</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👁️ {article.views} үзсэн</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.fullContent }}
          />
          
          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 text-purple-300">Хуваалцах:</h3>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/sharer/sharer.php?u=https://tarot-mongolia.mn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-xl">📘</span>
              </a>
              <a 
                href="https://twitter.com/intent/tweet?text=Таротын сонирхолтой нийтлэл"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-xl">🐦</span>
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('📋 Холбоос хуулагдлаа!');
                }}
                className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-xl">📋</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// News & Blogs Component - ШИНЭЧЛЭГДСЭН
const NewsBlogsSection = ({ activeTab = 'all', setActiveTab = null, onArticleClick = null }) => {
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
            className="bg-purple-900/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400 hover:-translate-y-1 transition-all group cursor-pointer"
            onClick={() => onArticleClick && onArticleClick(item)}
          >
            <div className="p-5">
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
              
              <p className="text-purple-300 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-purple-400">{item.readTime} уншихад</span>
                  <span className="text-purple-400">•</span>
                  <span className="text-purple-400">{item.views} үзсэн</span>
                </div>
                <div className="flex items-center text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors">
                  Дэлгэрэнгүй
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
const [authLoading, setAuthLoading] = useState(false); // Firebase loading state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [gender, setGender] = useState('');
  const [pageHistory, setPageHistory] = useState(['home']);
  const [selectedArticle, setSelectedArticle] = useState(null); // ШИНЭ: Сонгогдсон нийтлэл
  const [showFullResult, setShowFullResult] = useState(false); // ШИНЭ: Үр дүнгийн дэлгэрэнгүй

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

  const handleLogin = async () => {
     if (!email || !password) {
       showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
       return;
     }
 
     setAuthLoading(true);
     
     try {
       await signInWithEmailAndPassword(auth, email, password);
       showMessage('success', '✅ Амжилттай нэвтэрлээ!');
       setTimeout(() => navigateTo('birthdate'), 1000);
     } catch (error) {
       let errorMessage = '❌ Нэвтрэх үед алдаа гарлаа';
       
       if (error.code === 'auth/user-not-found') {
         errorMessage = '⚠️ И-мэйл бүртгэгдээгүй байна';
       } else if (error.code === 'auth/wrong-password') {
         errorMessage = '⚠️ Нууц үг буруу байна';
       } else if (error.code === 'auth/invalid-email') {
         errorMessage = '⚠️ И-мэйл хаяг буруу байна';
       } else if (error.code === 'auth/too-many-requests') {
         errorMessage = '⚠️ Хэт олон оролдлого хийсэн. Түр хүлээнэ үү';
       }
       
       showMessage('error', errorMessage);
     } finally {
       setAuthLoading(false);
     }
   };

    // Firebase Register
   const handleRegister = async () => {
      if (!email || !password) {
        showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
        return;
      }
  
      if (password.length < 6) {
        showMessage('error', '⚠️ Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
        return;
      }
  
      setAuthLoading(true);
  
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        showMessage('success', '🎉 Амжилттай бүртгүүллээ!');
        setTimeout(() => navigateTo('birthdate'), 1000);
      } catch (error) {
        let errorMessage = '❌ Бүртгэх үед алдаа гарлаа';
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = '⚠️ Энэ и-мэйл аль хэдийн бүртгэгдсэн байна';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = '⚠️ И-мэйл хаяг буруу байна';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = '⚠️ Нууц үг хэт сул байна';
        }
        
        showMessage('error', errorMessage);
      } finally {
        setAuthLoading(false);
      }
    };
  
  
  const handleLogout = async () => {
      if (window.confirm('🚪 Та системээс гарахдаа итгэлтэй байна уу?')) {
        try {
          await signOut(auth);
          setEmail('');
          setPassword('');
          setPageHistory(['home']);
          setCurrentPage('home');
          showMessage('success', '✅ Амжилттай гарлаа');
        } catch (error) {
          showMessage('error', '❌ Гарах үед алдаа гарлаа');
        }
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

  // ШИНЭ: Нийтлэл дэлгэрэнгүйг нээх
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  // ШИНЭ: Дэлгэрэнгүй мэргэний холбоос
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
              <NewsBlogsSection activeTab={activeTab} setActiveTab={setActiveTab} onArticleClick={handleArticleClick} />
            </div>
          </>
        )}

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

        {/* Result Page - ШИНЭЧЛЭГДСЭН */}
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

            {/* Detailed Interpretation - ШИНЭЧЛЭГДСЭН */}
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

            {/* Professional Reading Section - ШИНЭ */}
            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full mb-4">
                  <span className="text-yellow-300">💫</span>
                  <span className="text-yellow-300 text-sm font-medium">Шинэ санал</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Мэргэжлийн таротын уншлага авах
                </h3>
                <p className="text-purple-300 mb-6 max-w-2xl mx-auto">
                  Энэхүү онлайн уншлага нь ерөнхий удирдамж юм. Таны хувийн тохиолдолд зориулсан нарийвчилсан, гүнзгий уншлага авахыг хүсвэл манай мэргэжлийн тарот уншигчтой холбогдоорой.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>✅</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Хувийн уншлага</h4>
                      <p className="text-purple-300 text-sm">Таны асуултанд тусгайлан хариулах, нарийн дэлгэрэнгүй тайлбар</p>
                    </div>
                  </div>
                  
                
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>✅</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Бүрэн тайлбар</h4>
                      <p className="text-purple-300 text-sm">Бүх хөзрийн холбоо, нарийн утгыг тайлбарлах</p>
                    </div>
                  </div>
                </div>

                <a
                  href={PROFESSIONAL_READING_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
                >
                  <span>Мэргэжлийн уншлага авах</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                
                <p className="text-purple-400 text-sm mt-4">
                  * Дээрх товч дарснаар та манай Facebook хуудас руу чиглүүлэгдэнэ
                </p>
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
                  <a 
                    href="https://www.facebook.com/sharer/sharer.php?u=https://tarot-mongolia.mn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-xl">📘</span>
                  </a>
                  <a 
                    href="https://twitter.com/intent/tweet?text=Таротын сонирхолтой уншлага авлаа"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-xl">🐦</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('Би Таротын мэргэ авлаа - та ч бас үнэ төлбөргүй авч үзээрэй!');
                      showMessage('success', '📋 Холбоос хуулагдлаа!');
                    }}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-xl">📋</span>
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
            <NewsBlogsSection activeTab="blogs" onArticleClick={handleArticleClick} />
          </div>
        )}

        {/* News Page */}
        {currentPage === 'news' && (
          <div className="max-w-6xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-serif font-bold text-center mb-12 text-purple-300">
              📰 Мэдээ
            </h1>
            <NewsBlogsSection activeTab="news" onArticleClick={handleArticleClick} />
          </div>
        )}

        {/* About Page - ШИНЭЧЛЭГДСЭН */}
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

              {/* Contact Section - ШИНЭ */}
              <div className="bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
                <h2 className="text-2xl font-semibold mb-6 text-purple-300">📞 Бидэнтэй холбогдох</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <a
                    href="https://www.facebook.com/TarotMongoliaProfessional"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-center gap-3 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📘</span>
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
                      <span className="text-2xl">📷</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Instagram</h3>
                      <p className="text-pink-300 text-sm">Өдөр тутмын удирдамж</p>
                    </div>
                  </a>
                </div>
                
                <div className="space-y-4 text-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400">📧</span>
                    <span>info@tarot-mongolia.mn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400">📱</span>
                    <span>+976 9999-9999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400">📍</span>
                    <span>Улаанбаатар хот, Монгол улс</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - ШИНЭЧЛЭГДСЭН */}
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
                  <span>📘</span>
                  <a href="https://www.facebook.com/TarotMongoliaProfessional" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                    Facebook
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📷</span>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                    Instagram
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span>info@tarot-mongolia.mn</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <span>+976 9999-9999</span>
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

      {/* Article Detail Modal */}
      {selectedArticle && (
        <DetailedArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
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
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TarotApp;