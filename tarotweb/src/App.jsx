
import React, { useState, useEffect } from 'react';
import { Moon, Star, Heart, Briefcase, DollarSign, Activity,MapPin , Twitter, Sparkles,Phone, ArrowLeft, LogOut, RotateCcw, Check, Home, Book, FileText, User, ExternalLink, Facebook, Instagram, Mail, ChevronRight, Loader2 } from 'lucide-react';

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
  {
    id: 0,
    name: 'The Fool',
    mongolian: 'Тэнэг',
    symbol: '🌟',
    color: 'from-yellow-400 to-yellow-600',
    positionMeanings: {
      past: 'Өнгөрсөнд та шинэ эхлэл, боломжуудыг эрэлхийлж, туршлага хуримтлуулсан.',
      present: 'Одоо таны дотоод мэдрэмж нээлттэй, шинэ алхам хийхэд бэлэн байна.',
      future: 'Ирээдүйд шинэ боломжууд нээгдэж, эрсдэлд орохдоо өөртөө итгэлтэй байх хэрэгтэй.'
    }
  },
  {
    id: 1,
    name: 'The Magician',
    mongolian: 'Илбэчин',
    symbol: '🎩',
    color: 'from-purple-600 to-indigo-800',
    positionMeanings: {
      past: 'Өнгөрсөнд та чадвар, ур чадвараа ашиглан зорилгодоо хүрсэн.',
      present: 'Одоо таны бүтээлч энерги идэвхтэй, боломжуудыг ашиглахад бэлэн байна.',
      future: 'Ирээдүйд таны чадварууд амжилтанд хүрэх түлхүүр болох бөгөөд шинэ санааг хэрэгжүүлнэ.'
    }
  },
  {
    id: 2,
    name: 'The High Priestess',
    mongolian: 'Тэргүүн Санваартан',
    symbol: '🌙',
    color: 'from-blue-800 to-indigo-900',
    positionMeanings: {
      past: 'Өнгөрсөнд та дотоод мэдлэгээ хөгжүүлж, өөрийгөө ойлгосон.',
      present: 'Одоо таны дотоод мэдрэмж хүчтэй, нууц мэдээллийг ойлгоход туслана.',
      future: 'Ирээдүйд дотоод мэдрэмжээ дагаж, зөв сонголт хийх боломж гарна.'
    }
  },
  {
    id: 3,
    name: 'The Empress',
    mongolian: 'Хатан хаан',
    symbol: '👑',
    color: 'from-green-500 to-green-700',
    positionMeanings: {
      past: 'Өнгөрсөнд та бүтээлч байдал, халамж, харилцаанд анхаарал тавьсан.',
      present: 'Одоо таны бүтээлч энерги, амьдралд элбэг дэлбэг байдлыг бий болгож байна.',
      future: 'Ирээдүйд шинэ бүтээлч санаа, амжилт, элбэг дэлбэг боломжууд нээгдэнэ.'
    }
  },
  {
    id: 4,
    name: 'The Emperor',
    mongolian: 'Эзэн хаан',
    symbol: '⚡',
    color: 'from-red-700 to-red-900',
    positionMeanings: {
      past: 'Өнгөрсөнд та дэг журам, бүтэц зохион байгуулалттай байсан.',
      present: 'Одоо таны шийдвэрлэх чадвар, хяналт идэвхтэй ажиллаж байна.',
      future: 'Ирээдүйд зорилгодоо хүрэхийн тулд тогтвортой байдал, удирдах чадвараа ашиглах хэрэгтэй.'
    }
  },
  {
    id: 5,
    name: 'The Hierophant',
    mongolian: 'Лам',
    symbol: '📿',
    color: 'from-purple-700 to-purple-900',
    positionMeanings: {
      past: 'Өнгөрсөнд та уламжлал, сургамжийг дагаж, туршлага хуримтлуулсан.',
      present: 'Одоо итгэл үнэмшил, зарчим танд чиглэлийг өгч байна.',
      future: 'Ирээдүйд зөв шийдвэр гаргахын тулд үнэт зүйлсээ дагах хэрэгтэй.'
    }
  },
  {
    id: 6,
    name: 'The Lovers',
    mongolian: 'Дурлагчид',
    symbol: '💞',
    color: 'from-pink-500 to-rose-600',
    positionMeanings: {
      past: 'Өнгөрсөнд хайр, харилцааны шийдвэрүүдийг гаргасан.',
      present: 'Одоо харилцаа, сонголтод анхаарал шаардлагатай.',
      future: 'Ирээдүйд чухал шийдвэр гарч магадгүй, харилцаа болон үнэт зүйлсийг эргэн хар.'
    }
  },
  {
    id: 7,
    name: 'The Chariot',
    mongolian: 'Тэрэг',
    symbol: '🏇',
    color: 'from-blue-600 to-blue-800',
    positionMeanings: {
      past: 'Өнгөрсөнд зорилгодоо хүрэхийн тулд хүч чармайлт гаргасан.',
      present: 'Одоо зорилго руу тэмүүлэх хүч, хяналт идэвхтэй байна.',
      future: 'Ирээдүйд зоригтой алхамууд амжилтыг тодорхойлно.'
    }
  },
  {
    id: 8,
    name: 'Strength',
    mongolian: 'Хүч',
    symbol: '🦁',
    color: 'from-orange-500 to-orange-700',
    positionMeanings: {
      past: 'Өнгөрсөнд тэвчээр, хүч чадлаар сорилтуудыг давсан.',
      present: 'Одоо дотоод хүч, тэвчээр голлон ажиллаж байна.',
      future: 'Ирээдүйд сорилттой тулгарах үед дотоод хүчээ ашиглан амжилтанд хүрнэ.'
    }
  },
  {
    id: 9,
    name: 'The Hermit',
    mongolian: 'Даяанч',
    symbol: '🕯️',
    color: 'from-gray-600 to-gray-800',
    positionMeanings: {
      past: 'Өнгөрсөнд та дотоод ухамсар, гүн бодолд анхаарсан.',
      present: 'Одоо дотоод чимээг сонсож, зөв шийдвэр гаргах боломжтой.',
      future: 'Ирээдүйд дотоод мэдлэгээ дагаж, зөв замаар алхах боломж гарна.'
    }
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    mongolian: 'Хувь заяаны хүрд',
    symbol: '☸️',
    color: 'from-yellow-600 to-amber-700',
    positionMeanings: {
      past: 'Өнгөрсөнд хувь заяаны мөчлөгт таарсан туршлагуудыг хуримтлуулсан.',
      present: 'Одоо хувь заяаны боломжууд нээлттэй байна.',
      future: 'Ирээдүйд тохиолдох боломжууд таны сонголтоос хамаарна.'
    }
  },
  {
    id: 11,
    name: 'Justice',
    mongolian: 'Шударга ёс',
    symbol: '⚖️',
    color: 'from-green-700 to-green-900',
    positionMeanings: {
      past: 'Өнгөрсөнд та шударга байдал, үнэн, хариуцлагыг эрхэмлэж байсан.',
      present: 'Одоо шийдвэр гаргахдаа шударга байдал чухал байна.',
      future: 'Ирээдүйд зөв шийдвэр гаргах нь үр дүнг тодорхойлно.'
    }
  },
  {
    id: 12,
    name: 'The Hanged Man',
    mongolian: 'Дүүжлэгдсэн хүн',
    symbol: '🔄',
    color: 'from-blue-500 to-blue-700',
    positionMeanings: {
      past: 'Өнгөрсөнд та асуудлыг өөр өнцгөөс харах шаардлагатай болсон.',
      present: 'Одоо дотоод тэвчээр, тэсвэр тэвчээ шаардсан нөхцөл байна.',
      future: 'Ирээдүйд шинэ ойлголт, гэгээрэлд хүрэх боломж гарна.'
    }
  },
  {
    id: 13,
    name: 'Death',
    mongolian: 'Үхэл',
    symbol: '💀',
    color: 'from-gray-800 to-black',
    positionMeanings: {
      past: 'Өнгөрсөнд төгсгөл, өөрчлөлт гарсан.',
      present: 'Одоо шинэчлэл, өөрчлөлт эхэлж байна.',
      future: 'Ирээдүйд шинэ эхлэл, шинэ боломжууд үүснэ.'
    }
  },
  {
    id: 14,
    name: 'Temperance',
    mongolian: 'Даруу байдал',
    symbol: '🌈',
    color: 'from-sky-400 to-sky-600',
    positionMeanings: {
      past: 'Өнгөрсөнд тэнцвэр, эв найрамдлыг эрхэмлэж байсан.',
      present: 'Одоо дотоод болон гадаад энергийн тэнцвэр чухал байна.',
      future: 'Ирээдүйд тэнцвэртэй, зохистой алхам амжилтанд хүргэнэ.'
    }
  },
  {
    id: 15,
    name: 'The Devil',
    mongolian: 'Чөтгөр',
    symbol: '😈',
    color: 'from-red-800 to-red-950',
    positionMeanings: {
      past: 'Өнгөрсөнд хязгаарлалт, муу зуршлуудад өртсөн.',
      present: 'Одоо та эрх чөлөө, хяналтыг эргэн харах хэрэгтэй.',
      future: 'Ирээдүйд сөрөг зуршлуудыг даван туулж боломжуудыг ашиглана.'
    }
  },
  {
    id: 16,
    name: 'The Tower',
    mongolian: 'Цамхаг',
    symbol: '⚡',
    color: 'from-red-600 to-red-800',
    positionMeanings: {
      past: 'Өнгөрсөнд гэнэтийн өөрчлөлт, уналт тохиолдсон.',
      present: 'Одоо шинэ нөхцөлд дасан зохицох шаардлагатай байна.',
      future: 'Ирээдүйд эрс өөрчлөлт шинэ боломжуудыг авчирна.'
    }
  },
  {
    id: 17,
    name: 'The Star',
    mongolian: 'Од',
    symbol: '⭐',
    color: 'from-cyan-400 to-cyan-600',
    positionMeanings: {
      past: 'Өнгөрсөнд итгэл найдвар, сэргэлттэй байсан.',
      present: 'Одоо сэтгэл санаа болон зорилгын энерги хүчтэй байна.',
      future: 'Ирээдүйд итгэл найдвар, шинэ боломж, урам зориг гарч ирнэ.'
    }
  },
  {
    id: 18,
    name: 'The Moon',
    mongolian: 'Сар',
    symbol: '🌙',
    color: 'from-indigo-700 to-indigo-900',
    positionMeanings: {
      past: 'Өнгөрсөнд төөрөл, айдас, тодорхой бус нөхцөл байдал гарсан.',
      present: 'Одоо дотоод санаа, мэдрэмжээ сонсох цаг иржээ.',
      future: 'Ирээдүйд анхааралгүй сонголт төөрөлдөх эрсдэлтэй.'
    }
  },
  {
    id: 19,
    name: 'The Sun',
    mongolian: 'Нар',
    symbol: '☀️',
    color: 'from-yellow-400 to-orange-500',
    positionMeanings: {
      past: 'Өнгөрсөнд амжилт, баяр баясгалан мэдэрсэн.',
      present: 'Одоо эрч хүч, идэвхтэй байдал давамгайлж байна.',
      future: 'Ирээдүйд амжилт, баяр баясгалан, шинэ боломж гарч ирнэ.'
    }
  },
  {
    id: 20,
    name: 'Judgement',
    mongolian: 'Шүүлт',
    symbol: '📯',
    color: 'from-purple-500 to-purple-700',
    positionMeanings: {
      past: 'Өнгөрсөнд үнэлгээ, өөрийн үйлдлийг дүгнэх үе ирсэн.',
      present: 'Одоо өөрчлөлт, дахин төрөлт, шийдвэр гаргах цаг.',
      future: 'Ирээдүйд өмнөх туршлагаас суралцаж, шинэ эхлэл хийх боломж.'
    }
  },
  {
    id: 21,
    name: 'The World',
    mongolian: 'Дэлхий',
    symbol: '🌍',
    color: 'from-green-600 to-green-800',
    positionMeanings: {
      past: 'Өнгөрсөнд амжилт, дүгнэлт, туршлага хуримтлуулсан.',
      present: 'Одоо бүтэн байдал, амжилт, бүтээлч байдал давамгайлж байна.',
      future: 'Ирээдүйд зорилгодоо хүрч, шинэ боломж, дуусгавар байдлыг мэдрэх болно.'
    }
  }
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
    title: 'Таротын хөзрийн үүсэл ба хөгжил',
    description: 'Таротын хөзөр нь олон зууны турш хүний ухамсар, амьдралын замналыг тайлбарлахад хэрэглэгдэж ирсэн бэлгэдлийн тогтолцоо юм.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Таротын хөзрийн гарал үүсэл</h2>
      <p class="mb-4">
        Таротын хөзөр нь XV зууны үед Европын орнуудад анх үүссэн бөгөөд эхэндээ зугаа цэнгэлийн зориулалттай картын тоглоом хэлбэрээр ашиглагдаж байжээ.
        Харин цаг хугацаа өнгөрөхийн хэрээр хүмүүс хөзөр бүрийн дүрслэл, бэлгэдэлд утга учир өгч,
        хүний амьдрал, дотоод ертөнцийг танин мэдэх хэрэгсэл болгон ашиглах болсон байна.
      </p>

      <h3 class="text-xl font-bold mb-3">Таротын бүтэц</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Их Аркан</strong> (22 хөзөр) – Хүний амьдралын томоохон үе шат, хувь заяаны эргэлтүүдийг илэрхийлнэ</li>
        <li><strong>Бага Аркан</strong> (56 хөзөр) – Өдөр тутмын амьдрал, харилцаа, бодит нөхцөл байдлыг харуулна</li>
        <li><strong>Дөрвөн масть</strong> (Саваа, Аяга, Илд, Зоос) – Хөдөлмөр, сэтгэл хөдлөл, оюун санаа, эд материалын ертөнцийг төлөөлнө</li>
      </ul>

      <p class="mb-4">
        Орчин үед тарот нь зөвхөн ирээдүйг таах зорилготой бус,
        харин өөрийгөө танин мэдэх, бодлоо цэгцлэх,
        амьдралынхаа нөхцөл байдлыг эргэцүүлэх хэрэгсэл болон хэрэглэгдэж байна.
      </p>

      <div class="bg-purple-900/30 p-4 rounded-lg my-4">
        <p class="italic">
          “Тарот бол хүний дотоод ертөнцийг тусгах толь юм.
          Энэ нь асуултад хариу өгөхөөс илүүтэйгээр,
          бодож тунгаах замыг нээж өгдөг.”
        </p>
      </div>
    `,
    date: '2024-03-15',
    readTime: '5 мин',
    author: 'Б. Эрдэнэ',
    views: 1250
  },

  {
    id: 2,
    type: 'blog',
    title: 'Өдөр тутам тарот ашиглах энгийн аргууд',
    description: 'Өдөр бүр таротын хөзөртэй ажиллах нь өөрийгөө ойлгож, өдрийг ухамсартай өнгөрүүлэхэд тусалдаг.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Өдөр тутмын таротын дадал</h2>
      <p class="mb-4">
        Таротын хөзрийг өдөр тутмын амьдралдаа ашиглах нь
        хүний бодол санааг цэгцэлж,
        тухайн өдрийн нөхцөл байдлыг илүү тайван, ухаалгаар хүлээн авахад дэмжлэг болдог.
      </p>

      <h3 class="text-xl font-bold mb-3">1. Өдрийн хөзөр татах</h3>
      <p class="mb-3">Өглөө сэрээд нэг хөзөр татаад дараах асуултуудыг өөрөөсөө асууна:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Өнөөдөр юунд анхаарах хэрэгтэй вэ?</li>
        <li>Ямар үйлдлээс болгоомжлох ёстой вэ?</li>
        <li>Өдрийг илүү зөв өнгөрүүлэхэд юу туслах вэ?</li>
      </ul>

      <h3 class="text-xl font-bold mb-3">2. Гурван хөзрийн эргэцүүлэл</h3>
      <p class="mb-4">
        Гурван хөзөр татан,
        өглөө, өдөр, оройн цагийн байдалд хэрхэн нөлөөлөхийг тунгаан бодно.
      </p>

      <h3 class="text-xl font-bold mb-3">3. Хөзөр судлах дадал</h3>
      <p class="mb-4">
        Өдөр бүр нэг хөзрийг сонгон,
        түүний дүрслэл, өнгө, илэрхийлж буй санааг анхааралтай ажиглаж,
        өөрийн амьдралтай хэрхэн холбогдож байгааг бодож үзээрэй.
      </p>

      <div class="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6 rounded-lg my-6">
        <p class="italic">
          “Би өнөөдөр өөрийн бодол, үйлдэлдээ анхааралтай байна.
          Надад ирж буй дохиог ухаалгаар хүлээн авна.”
        </p>
      </div>
    `,
    date: '2024-03-14',
    readTime: '7 мин',
    author: 'Ц. Гэрэл',
    views: 890
  },

  {
    id: 3,
    type: 'news',
    title: '2024 оны шинэ таротын хөзрийн цувралууд',
    description: '2024 онд танилцуулагдаж буй шинэ таротын хөзрийн цувралуудын талаарх мэдээлэл.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Шинэ таротын хөзрийн цувралууд</h2>
      <p class="mb-4">
        2024 он таротын ертөнцөд шинэ өнгө төрх, шинэ санааг авчирч байна.
        Дэлхийн өөр өөр орны уран бүтээлчид өөрсдийн соёл, үзэл санааг тусгасан
        таротын шинэ цувралуудыг танилцуулж эхэллээ.
      </p>

      <h3 class="text-xl font-bold mb-3">Монгол тарот</h3>
      <p class="mb-4">
        Монголын уламжлалт соёл, байгаль, нүүдэлчдийн амьдралын хэв маягийг тусгасан
        энэхүү цуврал нь монгол хэрэглэгчдэд онцгой ойр мэдрэмж төрүүлэхээр бүтээгдсэн.
      </p>

      <h3 class="text-xl font-bold mb-3">Орчин үеийн тарот</h3>
      <p class="mb-4">
        Орчин цагийн амьдрал, хотжилт, техник технологийн нөлөөг
        бэлгэдлийн хэлээр илэрхийлсэн цувралууд мөн худалдаанд гарч байна.
      </p>

      <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-6">
        <p>
          Шинэ таротын хөзөр худалдан авахдаа эх сурвалж, тайлбар,
          бэлгэдлийн зөв хэрэглээг сайтар нягтлахыг зөвлөж байна.
        </p>
      </div>
    `,
    date: '2024-03-13',
    readTime: '4 мин',
    author: 'Ш. Болд',
    views: 2100
  },

  {
    id: 4,
    type: 'blog',
    title: 'Тарот ба сэтгэл зүйн эргэцүүлэл',
    description: 'Таротын хөзөр хүний сэтгэл зүйг ойлгоход хэрхэн тусалдаг тухай.',
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Тарот ба сэтгэл зүй</h2>
      <p class="mb-4">
        Сүүлийн жилүүдэд таротыг сэтгэл зүйн эргэцүүлэл,
        өөрийгөө ойлгох хэрэгсэл болгон ашиглах нь нэмэгдэж байна.
      </p>

      <h3 class="text-xl font-bold mb-3">Сэтгэл зүйн хэрэглээ</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Дотоод сэтгэл хөдлөлийг илэрхийлэх</li>
        <li>Хүнд сэдвийг тайван ярилцахад дэмжлэг үзүүлэх</li>
        <li>Амьдралын өөрчлөлтийг ухаалгаар хүлээн авах</li>
        <li>Өөрийн давуу болон сул талыг таних</li>
      </ul>

      <p class="mb-4">
        Таротын хөзөр нь асуултад шууд хариу өгөхөөс илүүтэйгээр
        хүнийг бодож тунгаахад хүргэдэг онцлогтой.
      </p>

      <div class="bg-purple-900/30 p-4 rounded-lg my-4">
        <p class="italic">
          “Тарот нь эмчилгээ биш.
          Харин хүнийг өөрийгөө ойлгоход хөтлөх туслах хэрэгсэл юм.”
        </p>
      </div>

      <p class="mt-6">
        <strong>Анхааруулга:</strong>
        Тарот нь мэргэжлийн сэтгэл зүйн эмчилгээний оронд хэрэглэгдэх ёсгүй.
        Хэрэв ноцтой асуудал тулгарвал мэргэжлийн хүнээс зөвлөгөө авах нь зүйтэй.
      </p>
    `,
    date: '2024-03-12',
    readTime: '10 мин',
    author: 'Д. Энхжин',
    views: 1560
  },
  {
  id: 5,
  type: 'blog',
  title: 'Тарот хөзөр сонгохдоо юуг анхаарах вэ',
  description: 'Анх удаа таротын хөзөр авах гэж буй хүмүүст зориулсан зөвлөмж.',
  fullContent: `
    <h2 class="text-2xl font-bold mb-4">Тарот хөзөр сонгох зөвлөмж</h2>
    <p class="mb-4">
      Таротын хөзөр сонгох нь энгийн худалдан авалт биш юм.
      Учир нь хөзөр бүр өөрийн гэсэн дүрслэл, бэлгэдэл, мэдрэмжийг агуулж байдаг.
    </p>

    <h3 class="text-xl font-bold mb-3">Анхаарах зүйлс</h3>
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li>Зургийн хэв маяг танд ойлгомжтой, ойр санагдах</li>
      <li>Бэлгэдэл нь хэт төвөгтэй биш байх</li>
      <li>Гарын авлага, тайлбартай байх</li>
      <li>Чанартай хэвлэл, бат бөх материалтай байх</li>
    </ul>

    <p class="mb-4">
      Хамгийн чухал нь тухайн хөзөр танд тайван, итгэл төрүүлж байвал
      тэр нь таны хувьд зөв сонголт юм.
    </p>
  `,
  date: '2024-03-11',
  readTime: '4 мин',
  author: 'Б. Саруул',
  views: 760
},
{
  id: 6,
  type: 'blog',
  title: 'Гурван хөзрийн мэргэний утга',
  description: 'Гурван хөзрөөр амьдралын нөхцөл байдлыг хэрхэн ойлгох тухай.',
  fullContent: `
    <h2 class="text-2xl font-bold mb-4">Гурван хөзрийн мэргэ</h2>
    <p class="mb-4">
      Гурван хөзрийн арга нь таротын хамгийн энгийн бөгөөд түгээмэл хэрэглэгддэг хэлбэр юм.
      Энэ арга нь аливаа асуудлыг ойлгоход хангалттай мэдээлэл өгдөг.
    </p>

    <h3 class="text-xl font-bold mb-3">Хөзрүүдийн утга</h3>
    <ul class="list-disc pl-5 mb-4 space-y-2">
      <li>Нэгдүгээр хөзөр – Өнгөрсөн нөхцөл байдал</li>
      <li>Хоёрдугаар хөзөр – Одоогийн байдал</li>
      <li>Гуравдугаар хөзөр – Ирээдүйн чиг хандлага</li>
    </ul>

    <p class="mb-4">
      Энэ аргыг ашиглахдаа хөзрийг шууд дүгнэхээс илүүтэйгээр
      тэдгээрийн хоорондын холбоог анзаарах нь чухал.
    </p>
  `,
  date: '2024-03-10',
  readTime: '5 мин',
  author: 'Ц. Гэрэл',
  views: 980
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
                <span className="text-xl"><Facebook /></span>
              </a>
              <a 
                href="https://twitter.com/intent/tweet?text=Таротын сонирхолтой нийтлэл"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-xl"><Twitter size={24} /></span>
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

              {/* Back - ШИНЭЧЛЭГДСЭН: positionMeanings харуулах */}
              <div className={`absolute inset-0 backface-hidden bg-gradient-to-br ${card.color} rounded-xl border-2 border-purple-300 flex flex-col items-center justify-center p-4 rotate-y-180 overflow-y-auto`}>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                <div className="text-4xl mb-2">{card.symbol}</div>
                <div className="text-sm font-semibold text-center mb-1">{card.mongolian}</div>
                <div className="text-xs text-center opacity-90 px-2">
                  {/* Хэрэв карт сонгогдсон бол байрлалын тайлбарыг харуулах */}
                  {isSelected && selectedCards.indexOf(card.id) !== -1 && (
                    <div className="mt-2 pt-2 border-t border-white/30">
                      <div className="text-xs font-medium mb-1">
                        {['Өнгөрсөн', 'Одоо', 'Ирээдүй'][selectedCards.indexOf(card.id)]} :
                      </div>
                      <div className="text-xs opacity-80">
                        {selectedCards.indexOf(card.id) === 0 && card.positionMeanings.past}
                        {selectedCards.indexOf(card.id) === 1 && card.positionMeanings.present}
                        {selectedCards.indexOf(card.id) === 2 && card.positionMeanings.future}
                      </div>
                    </div>
                  )}
                </div>
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
        const positionTitles = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'];
        
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
              <p className="text-purple-300 leading-relaxed mb-4">
                {index === 0 && card.positionMeanings.past}
                {index === 1 && card.positionMeanings.present}
                {index === 2 && card.positionMeanings.future}
              </p>
              
              <div className="mt-4 pt-4 border-t border-purple-500/30">
                <p className="text-sm text-purple-400 font-medium mb-2">
                  Хөзрийн утга:
                </p>
                <p className="text-purple-300 text-sm italic">
                  {card.meaning || "Шинэ эхлэл, боломж, итгэл хүлээлт"}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-purple-500/30">
              <p className="text-sm text-purple-400 text-center italic">
                {index === 0 && "Өнгөрсөн үеийн туршлага, сургамж, өмнөх шийдвэрүүд"}
                {index === 1 && "Одоогийн нөхцөл байдал, дотоод мэдрэмж, анхаарах асуудал"}
                {index === 2 && "Ирээдүйн боломж, үр дүн, анхаарах зүйлс"}
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
        {/* Ерөнхий дүгнэлт */}
        <div className="bg-purple-950/50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-3 text-purple-200">
            💭 Ерөнхий дүгнэлт
          </h4>
          <p className="text-purple-300 leading-relaxed">
            {selectedCards.length === 3 && (() => {
              const pastCard = TAROT_CARDS.find(c => c.id === selectedCards[0]);
              const presentCard = TAROT_CARDS.find(c => c.id === selectedCards[1]);
              const futureCard = TAROT_CARDS.find(c => c.id === selectedCards[2]);
              
              return (
                <>
                  Таны сонгосон <strong>{pastCard.mongolian}</strong>, <strong>{presentCard.mongolian}</strong>, 
                  <strong>{futureCard.mongolian}</strong> хөзрүүд таны амьдралын гурван үе шатыг харуулж байна. 
                  <strong>Өнгөрсөн</strong> нь таны туулсан туршлага, сургамж, өмнөх үйл явдал, 
                  гаргасан сонголтуудыг харуулдаг. <strong>Одоо</strong> нь таны одоогийн нөхцөл байдал, 
                  дотоод мэдрэмж, анхаарах асуудлуудыг илэрхийлнэ. Харин <strong>Ирээдүй</strong> нь таны 
                  одоогийн үйлдэл, шийдвэрээс хамааран үүсэх боломжууд, ирэх сорилт, үр дүнг харуулдаг.
                </>
              );
            })()}
          </p>
        </div>

        {/* Хөзрийн бүрэн тайлбар */}
        <div className="bg-purple-950/50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-3 text-purple-200">
            🔮 Хөзрийн нарийвчилсан тайлбар
          </h4>
          <div className="space-y-4">
            {selectedCards.map((cardId, index) => {
              const card = TAROT_CARDS.find(c => c.id === cardId);
              const positionNames = ['Өнгөрсөн', 'Одоо', 'Ирээдүй'];
              
              return (
                <div key={cardId} className="bg-purple-900/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{card.symbol}</span>
                    <div>
                      <h5 className="font-semibold text-white">{card.mongolian}</h5>
                      <p className="text-purple-400 text-sm">{positionNames[index]}</p>
                    </div>
                  </div>
                  <p className="text-purple-300 text-sm">
                    {index === 0 && card.positionMeanings.past}
                    {index === 1 && card.positionMeanings.present}
                    {index === 2 && card.positionMeanings.future}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Зөвлөмж */}
        <div className="bg-purple-950/50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-3 text-purple-200">
            🎯 Зөвлөмж
          </h4>
          <ul className="space-y-2 text-purple-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Өнгөрсөн үеэсээ сургамж авч, одоо мөчид анхаарлаа төвлөрүүлээрэй</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Одоогийн нөхцөл байдлыг үндэслэн ирээдүйн төлөвлөгөөгөө боловсруулаарай</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Дотоод мэдрэмжээ сонсож, өөрийнхөө шийдвэрт итгэлтэй байгаарай</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Таротын зөвлөгөө нь зөвхөн санал; эцсийн шийдвэрийг та өөрөө гаргана</span>
            </li>
          </ul>
        </div>

        {/* Цагийн хуваарь */}
        <div className="bg-purple-950/50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold mb-3 text-purple-200">
            ⏰ Цагийн хуваарь
          </h4>
          <p className="text-purple-300 leading-relaxed">
            Энэхүү уншлага таны {selectedTopic?.name || 'сонгосон сэдэв'}-тэй холбоотой ойрын 1-3 сарын хугацааг хамарч байна. 
            Энэ хугацаанд та өөрчлөлт, хөгжил дэвшлийг мэдэрч, шинэ боломжуудыг олж мэдэх магадлалтай.
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
          Энэхүү онлайн уншлага нь ерөнхий удирдамж юм. Таны хувийн тохиолдолд зориулсан нарийвчилсан, гүнзгий уншлага авахыг хүсвэл манай мэргэжлийн тарот уншигчтай холбогдоорой.
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
            const meaning = i === 0 ? card.positionMeanings.past : 
                          i === 1 ? card.positionMeanings.present : 
                          card.positionMeanings.future;
            return `${pos} байрлал: ${card.mongolian}\n${meaning}`;
          }).join('\n\n');
          
          navigator.clipboard.writeText(result);
          showMessage('success', '✅ Үр дүн хуулагдлаа!');
        }}
        className="px-8 py-4 bg-purple-500/20 border-2 border-purple-500 rounded-xl font-semibold text-lg hover:bg-purple-500/30 hover:-translate-y-0.5 transition-all"
      >
        📋 Үр дүн хуулах
      </button>
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
                <h2 className="text-2xl font-semibold mb-6 flex items-center text-purple-300"><Phone className='mr-2' ></Phone>Бидэнтэй холбогдох </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <a
                    href="https://www.facebook.com/TarotMongoliaProfessional"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-center gap-3 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl"><Facebook /></span>
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
                      <span className="text-2xl"><Instagram/></span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Instagram</h3>
                      <p className="text-pink-300 text-sm">Өдөр тутмын удирдамж</p>
                    </div>
                  </a>
                </div>
                
                <div className="space-y-4 text-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400"><Mail size={15}/></span>
                    <span>info@tarot-mongolia.mn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400"><Phone size={15}/></span>
                    <span>+976 9999-9999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400"><MapPin size={15} /></span>
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
                  <span><Facebook size='25'/></span>
                  <a href="https://www.facebook.com/TarotMongoliaProfessional" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                    Facebook
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span><Instagram size='22'/></span>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition">
                    Instagram
                  </a>
                </li> 
                <li className="flex items-center gap-2">
                  <span><Mail size='22'/></span>
                  <span>info@tarot-mongolia.mn</span>
                </li>
                <li className="flex items-center gap-2">     
                  <span><Phone size='22'/></span> 
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