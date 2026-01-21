// Өрнийн зурхайн 12 орд
export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Хонь', dates: '3/21 - 4/19', element: 'Гал', icon: '♈' },
  { id: 'taurus', name: 'Үхэр', dates: '4/20 - 5/20', element: 'Дэлхий', icon: '♉' },
  { id: 'gemini', name: 'Ихэр', dates: '5/21 - 6/20', element: 'Агаар', icon: '♊' },
  { id: 'cancer', name: 'Мэлхий', dates: '6/21 - 7/22', element: 'Ус', icon: '♋' },
  { id: 'leo', name: 'Арслан', dates: '7/23 - 8/22', element: 'Гал', icon: '♌' },
  { id: 'virgo', name: 'Охин', dates: '8/23 - 9/22', element: 'Дэлхий', icon: '♍' },
  { id: 'libra', name: 'Жинлүүр', dates: '9/23 - 10/22', element: 'Агаар', icon: '♎' },
  { id: 'scorpio', name: 'Хилэнц', dates: '10/23 - 11/21', element: 'Ус', icon: '♏' },
  { id: 'sagittarius', name: 'Нум', dates: '11/22 - 12/21', element: 'От', icon: '♐' },
  { id: 'capricorn', name: 'Матар', dates: '12/22 - 1/19', element: 'Дэлхий', icon: '♑' },
  { id: 'aquarius', name: 'Хумх', dates: '1/20 - 2/18', element: 'Агаар', icon: '♒' },
  { id: 'pisces', name: 'Загас', dates: '2/19 - 3/20', element: 'Ус', icon: '♓' }
];

// Өдөр бүр өөрчлөгдөх зурхайн текстүүд
const DAILY_TEXTS = {
  love: [
    "Өнөөдөр таны харилцаанд шинэ боломж гарч ирнэ.",
    "Хайрттайгаа ярилцахдаа илүү нээлттэй байгаарай.",
    "Ганцаараа байх цаг гаргаж, өөрийн сэтгэл хөдлөлийг ойлгоорой.",
    "Харилцаанд шинэ санаа, арга барил хэрэгтэй.",
    "Өөртөө итгэлтэй байж, харилцаагаа хөгжүүлээрэй."
  ],
  career: [
    "Ажил дээрээ шинэ төсөл эхлүүлэх цаг боллоо.",
    "Хамтран ажиллах нь илүү үр дүнтэй байх болно.",
    "Өөрийн чадвараа харуулах боломж ирнэ.",
    "Ажлын яриа хэлэлцүүлэгт идэвхтэй оролцоорой.",
    "Урт хугацааны зорилгоо тодорхойлно уу."
  ],
  health: [
    "Бие махбодоо сонсож, амралт авах цаг гаргаарай.",
    "Шинэ дасгал хөдөлгөөн эхлүүлэхэд тохиромжтой.",
    "Сэрүүн усаар биеэ хангаж, эрүүл хооллоорой.",
    "Сэтгэл санааны эрч хүчийг сэргээхэд анхаарлаа хандуулаарай.",
    "Агаарт гарч, байгалийн амралт авахад тохиромжтой өдөр."
  ],
  finance: [
    "Хөрөнгө оруулалтын шинэ боломж гарч ирнэ.",
    "Хэмнэлт хийх, төлөвлөгөө гаргахад тохиромжтой.",
    "Шинэ орлого олох боломж бий.",
    "Мөнгөний асуудлаар болгоомжтой шийдвэр гаргаарай.",
    "Урт хугацааны хөрөнгө оруулалтын төлөвлөгөө гаргаарай."
  ]
};

const WEEKLY_TEXTS = {
  love: [
    "Энэ долоо хоногт харилцаа тань гүнзгийрэх боломжтой.",
    "Шинэ хайрын таарлын магадлал өндөр.",
    "Хуучин асуудлуудыг шийдвэрлэхэд тохиромжтой 7 хоног.",
    "Харилцаандаа шинэчлэл хийхэд бэлэн байгаарай.",
    "Өөр хоорондоо ойлголцох, хүндэтгэх нь чухал."
  ],
  career: [
    "Ажлын амжилт оруулах гайхалтай долоо хоног.",
    "Шинэ ур чадвар эзэмшихэд тохиромжтой.",
    "Хамтын ажиллагаа чухал ач холбогдолтой болно.",
    "Карьераа дээшлүүлэх боломж гарч ирнэ.",
    "Ажлын хэв маягаа өөрчлөхөд тохиромжтой."
  ],
  health: [
    "Эрүүл мэндийн хувьд эерэг өөрчлөлтүүд харагдана.",
    "Шинэ эрүүл амьдралын хэв маяг эхлүүлэхэд тохиромжтой.",
    "Сэтгэл санааны тэнцвэрийг хадгалахад анхаарлаа хандуулаарай.",
    "Дасгал хөдөлгөөний тогтвортой дадал хэрэгтэй.",
    "Бие махбодын дохиог сонсох нь чухал."
  ]
};

const MONTHLY_TEXTS = {
  overview: [
    "Энэ сар танд өөрчлөлт, шинэчлэл авчирна.",
    "Хувь заяаны шинэ эргэлт эхэлнэ.",
    "Урт хугацааны зорилгодоо ойртох болно.",
    "Өөртөө итгэх, өөрийн сонголтыг хийхэд тохиромжтой сар.",
    "Сэтгэл хөдлөл, оюун ухааны тэнцвэрийг олох болно."
  ],
  challenges: [
    "Анхаарлаа төвлөрүүлж, тэвчээртэй байх хэрэгтэй.",
    "Шинэ нөхцөл байдалд дасан зохицох шаардлагатай.",
    "Өмнөх туршлагаасаа суралцаж, ухамсартай шийдвэр гарга.",
    "Бусдын саналыг сонсох нь чухал.",
    "Өөрчлөлтийг эерэгээр хүлээн авах нь зүйтэй."
  ]
};

const YEARLY_TEXTS = {
  overview: [
    "Энэ жил таны амьдралд томоохон өөрчлөлтүүд гарна.",
    "Урт хугацааны зорилгодоо хүрэхэд чухал жил болно.",
    "Шинэ боломжууд, сорилтууд хоёулаа хүлээж байна.",
    "Өөрийгөө хөгжүүлэх, шинэ ур чадвар эзэмшихэд тохиромжтой.",
    "Амьдралынхаа чиглэлийг тодорхойлох жил болно."
  ],
  focus: [
    "Карьер, боловсролын чиглэлээр анхаарлаа төвлөрүүл.",
    "Харилцаа, гэр бүлийн асуудлуудад цаг зарцуул.",
    "Эд материалын баталгаат байдалдаа анхаар.",
    "Сэтгэл ханамж, дотоод тайван байдлаа эрхэмлэ.",
    "Шинэ туршлага, аялал жуулчлалаар өөрийгөө баяжуул."
  ]
};

// Өдөр, долоо хоног, сар, жилийн seed үүсгэх
const getSeed = (zodiacId, period, date = new Date()) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const week = Math.floor(day / 7) + 1;
  
  const zodiacIndex = ZODIAC_SIGNS.findIndex(z => z.id === zodiacId);
  
  switch(period) {
    case 'daily':
      return `${year}${month}${day}${zodiacIndex}`;
    case 'weekly':
      return `${year}${month}${week}${zodiacIndex}`;
    case 'monthly':
      return `${year}${month}${zodiacIndex}`;
    case 'yearly':
      return `${year}${zodiacIndex}`;
    default:
      return `${year}${month}${day}${zodiacIndex}`;
  }
};

const getTextFromSeed = (seed, texts) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % texts.length;
  return texts[index];
};

// Өдөр бүр өөрчлөгдөх зурхай үүсгэх
export const generateHoroscope = (zodiacId, period = 'daily', date = new Date()) => {
  const seed = getSeed(zodiacId, period, date);
  const zodiac = ZODIAC_SIGNS.find(z => z.id === zodiacId);
  
  switch(period) {
    case 'daily':
      return {
        zodiac: zodiac.name,
        period: 'Өдөр',
        date: date.toLocaleDateString('mn-MN'),
        predictions: {
          love: getTextFromSeed(seed + 'love', DAILY_TEXTS.love),
          career: getTextFromSeed(seed + 'career', DAILY_TEXTS.career),
          health: getTextFromSeed(seed + 'health', DAILY_TEXTS.health),
          finance: getTextFromSeed(seed + 'finance', DAILY_TEXTS.finance),
          luckyNumber: Math.abs(parseInt(seed) % 100) + 1,
          luckyColor: ['Улаан', 'Ногоон', 'Цэнхэр', 'Шар', 'Цагаан', 'Хар'][Math.abs(parseInt(seed) % 6)]
        }
      };
      
    case 'weekly':
      return {
        zodiac: zodiac.name,
        period: 'Долоо хоног',
        date: `${date.getFullYear()} оны ${date.getMonth() + 1} сарын ${Math.floor(date.getDate() / 7) + 1}-р долоо хоног`,
        predictions: {
          love: getTextFromSeed(seed + 'love', WEEKLY_TEXTS.love),
          career: getTextFromSeed(seed + 'career', WEEKLY_TEXTS.career),
          health: getTextFromSeed(seed + 'health', WEEKLY_TEXTS.health),
          advice: "Энэ долоо хоногт төвлөрөл, тэвчээр чухал байх болно.",
          focus: ['Харилцаа', 'Ажил','Эрүүл мэнд', 'Санхүү'][Math.abs(parseInt(seed) % 4)]
        }
      };
      
    case 'monthly':
      const monthName = date.toLocaleDateString('mn-MN', { month: 'long' });
      return {
        zodiac: zodiac.name,
        period: 'Сар',
        date: `${date.getFullYear()} оны ${monthName}`,
        predictions: {
          overview: getTextFromSeed(seed + 'overview', MONTHLY_TEXTS.overview),
          challenges: getTextFromSeed(seed + 'challenges', MONTHLY_TEXTS.challenges),
          advice: "Энэ сард өөрчлөлтийг эерэгээр хүлээн авч, шинэ боломжуудыг ашиглаарай.",
          bestDays: [Math.abs(parseInt(seed) % 28) + 1, Math.abs(parseInt(seed + '2') % 28) + 1]
        }
      };
      
    case 'yearly':
      return {
        zodiac: zodiac.name,
        period: 'Жил',
        date: `${date.getFullYear()} он`,
        predictions: {
          overview: getTextFromSeed(seed + 'overview', YEARLY_TEXTS.overview),
          focus: getTextFromSeed(seed + 'focus', YEARLY_TEXTS.focus),
          advice: "Энэ жил урт хугацааны зорилгоо тодорхойлж, тогтвортой алхам хийх нь чухал.",
          luckyMonths: ['1 сар', '5 сар', '9 сар', '12 сар'].slice(0, Math.abs(parseInt(seed) % 3) + 1)
        }
      };
      
    default:
      return generateHoroscope(zodiacId, 'daily', date);
  }
};

export const getZodiacFromDate = (birthDate) => {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};