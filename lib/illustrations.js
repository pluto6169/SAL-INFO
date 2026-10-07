// lib/illustrations.js - مكتبة الرسوم التوضيحية SVG المدمجة
// كل رسمة هي SVG inline بأسلوب line-art قابل للتلوين عبر currentColor

const ILLUSTRATIONS = {

  computer: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="18" y="8" width="84" height="56" rx="4"/>
    <line x1="18" y1="52" x2="102" y2="52"/>
    <rect x="48" y="64" width="24" height="6"/>
    <rect x="36" y="70" width="48" height="4" rx="2"/>
    <polyline points="32,42 44,30 56,36 68,22 80,28 92,18" stroke-width="2.5"/>
    <circle cx="92" cy="18" r="3" fill="currentColor"/>
    <rect x="30" y="18" width="8" height="24" rx="1" opacity="0.15" fill="currentColor" stroke="none"/>
    <rect x="40" y="28" width="8" height="14" rx="1" opacity="0.15" fill="currentColor" stroke="none"/>
  </svg>`,

  bookshelf: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="12" y="8" width="96" height="84" rx="3"/>
    <line x1="12" y1="48" x2="108" y2="48"/>
    <rect x="20" y="14" width="11" height="30" rx="1.5" fill="currentColor" opacity="0.2"/>
    <rect x="33" y="18" width="9" height="26" rx="1.5" fill="currentColor" opacity="0.12"/>
    <rect x="44" y="12" width="12" height="32" rx="1.5" fill="currentColor" opacity="0.18"/>
    <rect x="58" y="16" width="10" height="28" rx="1.5" fill="currentColor" opacity="0.25"/>
    <rect x="70" y="20" width="13" height="24" rx="1.5" fill="currentColor" opacity="0.1"/>
    <rect x="85" y="14" width="11" height="30" rx="1.5" fill="currentColor" opacity="0.15"/>
    <rect x="22" y="54" width="10" height="28" rx="1.5" fill="currentColor" opacity="0.18"/>
    <rect x="34" y="58" width="14" height="24" rx="1.5" fill="currentColor" opacity="0.12"/>
    <rect x="50" y="52" width="9" height="30" rx="1.5" fill="currentColor" opacity="0.22"/>
    <rect x="61" y="56" width="12" height="26" rx="1.5" fill="currentColor" opacity="0.14"/>
    <rect x="75" y="54" width="10" height="28" rx="1.5" fill="currentColor" opacity="0.2"/>
    <rect x="87" y="60" width="11" height="22" rx="1.5" fill="currentColor" opacity="0.16"/>
  </svg>`,

  people: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="24" r="10"/>
    <path d="M20,72 Q20,48 40,48 Q60,48 60,72"/>
    <circle cx="80" cy="28" r="8"/>
    <path d="M64,72 Q64,52 80,52 Q96,52 96,72"/>
    <circle cx="60" cy="18" r="6" fill="currentColor" opacity="0.15"/>
    <path d="M48,64 Q48,44 60,44 Q72,44 72,64" opacity="0.3" fill="currentColor" stroke="none"/>
    <line x1="30" y1="80" x2="90" y2="80" stroke-dasharray="3,3" opacity="0.3"/>
  </svg>`,

  filing: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="24" y="10" width="72" height="80" rx="4"/>
    <rect x="32" y="18" width="56" height="18" rx="2"/>
    <rect x="52" y="24" width="16" height="6" rx="1.5" fill="currentColor" opacity="0.3"/>
    <rect x="32" y="42" width="56" height="18" rx="2"/>
    <rect x="52" y="48" width="16" height="6" rx="1.5" fill="currentColor" opacity="0.3"/>
    <rect x="32" y="66" width="56" height="18" rx="2"/>
    <rect x="52" y="72" width="16" height="6" rx="1.5" fill="currentColor" opacity="0.3"/>
  </svg>`,

  research: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="42" r="22"/>
    <line x1="66" y1="58" x2="90" y2="82" stroke-width="3"/>
    <rect x="20" y="12" width="36" height="4" rx="2" fill="currentColor" opacity="0.15"/>
    <rect x="20" y="20" width="28" height="4" rx="2" fill="currentColor" opacity="0.1"/>
    <line x1="38" y1="34" x2="62" y2="34" opacity="0.3"/>
    <line x1="40" y1="42" x2="60" y2="42" opacity="0.3"/>
    <line x1="38" y1="50" x2="62" y2="50" opacity="0.3"/>
  </svg>`,

  globe: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="46" r="30"/>
    <ellipse cx="60" cy="46" rx="12" ry="30"/>
    <line x1="30" y1="46" x2="90" y2="46"/>
    <path d="M34,30 Q60,36 86,30" fill="none"/>
    <path d="M34,62 Q60,56 86,62" fill="none"/>
    <rect x="56" y="76" width="8" height="10"/>
    <rect x="46" y="86" width="28" height="4" rx="2"/>
  </svg>`,

  management: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="40" y="8" width="40" height="24" rx="4" fill="currentColor" opacity="0.1"/>
    <circle cx="60" cy="20" r="6"/>
    <line x1="60" y1="32" x2="60" y2="44"/>
    <line x1="30" y1="44" x2="90" y2="44"/>
    <line x1="30" y1="44" x2="30" y2="56"/>
    <line x1="90" y1="44" x2="90" y2="56"/>
    <rect x="14" y="56" width="32" height="20" rx="4" fill="currentColor" opacity="0.08"/>
    <circle cx="30" cy="66" r="5"/>
    <rect x="74" y="56" width="32" height="20" rx="4" fill="currentColor" opacity="0.08"/>
    <circle cx="90" cy="66" r="5"/>
    <line x1="60" y1="44" x2="60" y2="56"/>
    <rect x="44" y="56" width="32" height="20" rx="4" fill="currentColor" opacity="0.08"/>
    <circle cx="60" cy="66" r="5"/>
  </svg>`,

  education: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="60,10 100,30 60,50 20,30" fill="currentColor" opacity="0.12"/>
    <polygon points="60,10 100,30 60,50 20,30"/>
    <line x1="20" y1="30" x2="20" y2="62"/>
    <path d="M36,42 L36,64 Q60,78 84,64 L84,42"/>
    <circle cx="20" cy="64" r="4" fill="currentColor" opacity="0.3"/>
    <line x1="46" y1="80" x2="74" y2="80" stroke-dasharray="2,3" opacity="0.3"/>
    <rect x="48" y="84" width="24" height="6" rx="2" fill="currentColor" opacity="0.1"/>
  </svg>`,

  medical: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="30" y="14" width="60" height="60" rx="12"/>
    <rect x="50" y="26" width="20" height="36" rx="2" fill="currentColor" opacity="0.15"/>
    <rect x="42" y="34" width="36" height="20" rx="2" fill="currentColor" opacity="0.15"/>
    <line x1="60" y1="28" x2="60" y2="60"/>
    <line x1="44" y1="44" x2="76" y2="44"/>
    <path d="M40,80 Q60,92 80,80" stroke-dasharray="3,3" opacity="0.3"/>
  </svg>`,

  legal: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="60" y1="10" x2="60" y2="70"/>
    <line x1="28" y1="30" x2="92" y2="30"/>
    <path d="M28,30 L20,50 Q28,62 36,50 Z" fill="currentColor" opacity="0.1"/>
    <path d="M92,30 L84,50 Q92,62 100,50 Z" fill="currentColor" opacity="0.1"/>
    <circle cx="60" cy="10" r="5" fill="currentColor" opacity="0.2"/>
    <rect x="42" y="70" width="36" height="6" rx="2"/>
    <rect x="36" y="76" width="48" height="6" rx="2" fill="currentColor" opacity="0.1"/>
  </svg>`,

  art: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="54" cy="50" rx="36" ry="32"/>
    <ellipse cx="42" cy="34" rx="5" ry="6" fill="currentColor" opacity="0.25"/>
    <ellipse cx="34" cy="52" rx="5" ry="6" fill="currentColor" opacity="0.15"/>
    <ellipse cx="44" cy="68" rx="5" ry="6" fill="currentColor" opacity="0.2"/>
    <ellipse cx="66" cy="36" rx="5" ry="6" fill="currentColor" opacity="0.18"/>
    <circle cx="76" cy="50" r="8"/>
    <line x1="86" y1="18" x2="100" y2="8" stroke-width="3"/>
    <line x1="96" y1="12" x2="104" y2="4" stroke-width="4"/>
  </svg>`,

  science: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M46,10 L46,44 L24,78 Q20,86 28,90 L92,90 Q100,86 96,78 L74,44 L74,10"/>
    <line x1="40" y1="10" x2="80" y2="10"/>
    <line x1="46" y1="30" x2="74" y2="30" stroke-dasharray="3,3" opacity="0.3"/>
    <ellipse cx="60" cy="74" rx="22" ry="10" fill="currentColor" opacity="0.1"/>
    <circle cx="52" cy="68" r="3" fill="currentColor" opacity="0.3"/>
    <circle cx="64" cy="72" r="4" fill="currentColor" opacity="0.2"/>
    <circle cx="56" cy="78" r="2.5" fill="currentColor" opacity="0.25"/>
  </svg>`,

  database: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="60" cy="22" rx="34" ry="12"/>
    <path d="M26,22 L26,78" />
    <path d="M94,22 L94,78" />
    <ellipse cx="60" cy="78" rx="34" ry="12"/>
    <path d="M26,40 Q60,56 94,40" opacity="0.4"/>
    <path d="M26,58 Q60,74 94,58" opacity="0.4"/>
    <rect x="48" y="38" width="24" height="8" rx="2" fill="currentColor" opacity="0.1"/>
  </svg>`,

  network: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="50" r="10" fill="currentColor" opacity="0.12"/>
    <circle cx="60" cy="50" r="4"/>
    <circle cx="26" cy="22" r="6"/>
    <circle cx="94" cy="22" r="6"/>
    <circle cx="26" cy="78" r="6"/>
    <circle cx="94" cy="78" r="6"/>
    <line x1="54" y1="42" x2="30" y2="26"/>
    <line x1="66" y1="42" x2="90" y2="26"/>
    <line x1="54" y1="58" x2="30" y2="74"/>
    <line x1="66" y1="58" x2="90" y2="74"/>
  </svg>`,

  history: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="46" r="30"/>
    <polyline points="60,24 60,46 76,54"/>
    <circle cx="60" cy="46" r="3" fill="currentColor"/>
    <path d="M20,46 Q20,80 60,86" stroke-dasharray="4,3" opacity="0.3"/>
    <polyline points="14,38 20,46 28,40" fill="none"/>
  </svg>`,

  default: `<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="24" y="10" width="72" height="52" rx="4"/>
    <line x1="24" y1="26" x2="96" y2="26"/>
    <circle cx="36" cy="18" r="3" fill="currentColor" opacity="0.3"/>
    <circle cx="48" cy="18" r="3" fill="currentColor" opacity="0.2"/>
    <circle cx="60" cy="18" r="3" fill="currentColor" opacity="0.1"/>
    <line x1="34" y1="36" x2="86" y2="36" opacity="0.4"/>
    <line x1="34" y1="44" x2="72" y2="44" opacity="0.3"/>
    <line x1="34" y1="52" x2="78" y2="52" opacity="0.4"/>
    <rect x="38" y="70" width="44" height="20" rx="10" fill="currentColor" opacity="0.1"/>
    <line x1="50" y1="76" x2="70" y2="76" opacity="0.4"/>
    <line x1="54" y1="82" x2="66" y2="82" opacity="0.3"/>
  </svg>`
};

// ========== زخارف الخلفية (Background Decorations) ==========
const DECORATIONS = {

  deskLamp: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.06">
    <path d="M40,90 L40,50"/>
    <path d="M20,50 L40,30 L60,50"/>
    <ellipse cx="40" cy="50" rx="20" ry="6"/>
    <rect x="30" y="88" width="20" height="6" rx="3"/>
    <circle cx="40" cy="38" r="4" fill="currentColor" opacity="0.3"/>
  </svg>`,

  plant: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.06">
    <rect x="26" y="60" width="28" height="32" rx="4"/>
    <path d="M40,60 Q40,40 28,30 Q36,38 40,36 Q44,38 52,30 Q40,40 40,60"/>
    <path d="M34,58 Q26,44 18,40 Q28,46 34,42"/>
    <path d="M46,56 Q54,42 62,38 Q52,44 46,40"/>
    <line x1="40" y1="60" x2="40" y2="36"/>
  </svg>`,

  quill: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.06">
    <path d="M20,90 Q22,70 40,50 Q58,30 70,10"/>
    <path d="M40,50 Q46,46 70,10 Q50,32 44,48 Z" fill="currentColor" opacity="0.1"/>
    <circle cx="18" cy="92" r="3" fill="currentColor" opacity="0.2"/>
    <path d="M22,86 Q14,82 10,90" opacity="0.4"/>
  </svg>`,

  dottedCircles: `<svg viewBox="0 0 100 100" fill="currentColor" opacity="0.04">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-dasharray="3,6" stroke-width="1"/>
    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-dasharray="2,8" stroke-width="1"/>
    <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" stroke-dasharray="1.5,10" stroke-width="1"/>
  </svg>`,

  geometricPattern: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.04">
    <polygon points="60,10 110,40 110,80 60,110 10,80 10,40"/>
    <polygon points="60,25 95,45 95,75 60,95 25,75 25,45"/>
    <polygon points="60,40 80,50 80,70 60,80 40,70 40,50"/>
  </svg>`
};

// ========== محرك ربط المحتوى بالرسوم (Content-to-Visual Mapper) ==========
const KEYWORD_MAP = [
  { keys: ['حاسوب','بيانات','تقنية','رقمي','نظام','برمج','حوسبة','إلكتروني','ذكاء','اصطناعي'], illustration: 'computer' },
  { keys: ['كتب','مكتب','قراءة','مرجع','أكاديم','وثائق','مخطوط','ببليوجراف'], illustration: 'bookshelf' },
  { keys: ['خدمات','مستفيد','عملاء','مجتمع','تواصل','مستخدم','جمهور'], illustration: 'people' },
  { keys: ['فهرس','تنظيم','تصنيف','ترتيب','أرشيف','وصف','ضبط','استناد'], illustration: 'filing' },
  { keys: ['بحث','استرجاع','استعلام','وصول','محرك','فهرسة'], illustration: 'research' },
  { keys: ['دولي','عالمي','جغرافي','سياس','علاقات'], illustration: 'globe' },
  { keys: ['إدارة','قيادة','مؤسس','إستراتيج','تخطيط','موارد'], illustration: 'management' },
  { keys: ['تعليم','تعلم','جامع','طلاب','مدرس','منهج','دراس','تدريب'], illustration: 'education' },
  { keys: ['طب','صح','مستشفى','علاج','مرض','تمريض','صيدل'], illustration: 'medical' },
  { keys: ['قانون','حقوق','تشريع','دستور','محكم','قضا','شريعة'], illustration: 'legal' },
  { keys: ['فن','أدب','ثقاف','شعر','رواي','مسرح','موسيق','رسم'], illustration: 'art' },
  { keys: ['علم','تجرب','مختبر','فيزياء','كيمياء','أحياء','رياضيات'], illustration: 'science' },
  { keys: ['قاعدة بيانات','SQL','جدول','نموذج علاقي','بيانات'], illustration: 'database' },
  { keys: ['شبكة','إنترنت','اتصال','ربط','حوسبة سحاب','ويب'], illustration: 'network' },
  { keys: ['تاريخ','حضار','عصر','قديم','أثر','تراث'], illustration: 'history' },
];

function mapContentToIllustration(sectionTitle, sectionPoints) {
  const text = (sectionTitle + ' ' + (sectionPoints || []).join(' '));
  let bestMatch = 'default';
  let bestScore = 0;

  for (const mapping of KEYWORD_MAP) {
    let score = 0;
    for (const key of mapping.keys) {
      if (text.includes(key)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping.illustration;
    }
  }
  return bestMatch;
}

// ========== محرك الألوان (Color Palette Engine) ==========
const TOPIC_PALETTES = {
  'تقنية': { primary:'#0D3B66', secondary:'#167D7F', accent:'#29B6F6', bg:'#EAF2F5', card:'#FFFFFF', text:'#1a1a2e' },
  'مكتبات': { primary:'#1B3A4B', secondary:'#1F5C5C', accent:'#E8C547', bg:'#F5F0E8', card:'#FFFFFF', text:'#2D2D2D' },
  'أدب': { primary:'#4A1942', secondary:'#7B2D6E', accent:'#CE93D8', bg:'#F8F0F8', card:'#FFFFFF', text:'#2D1B2E' },
  'علوم': { primary:'#1B5E20', secondary:'#2E7D32', accent:'#66BB6A', bg:'#F0F8F0', card:'#FFFFFF', text:'#1B2D1B' },
  'تاريخ': { primary:'#5D4037', secondary:'#795548', accent:'#D7A86E', bg:'#FBF5EE', card:'#FFFFFF', text:'#3E2723' },
  'طب': { primary:'#0D47A1', secondary:'#1565C0', accent:'#4FC3F7', bg:'#EBF5FB', card:'#FFFFFF', text:'#0D2137' },
  'قانون': { primary:'#37474F', secondary:'#546E7A', accent:'#B0BEC5', bg:'#ECEFF1', card:'#FFFFFF', text:'#263238' },
  'إدارة': { primary:'#1A237E', secondary:'#283593', accent:'#7986CB', bg:'#E8EAF6', card:'#FFFFFF', text:'#1A1A3E' },
  'فن': { primary:'#BF360C', secondary:'#E64A19', accent:'#FF8A65', bg:'#FBE9E7', card:'#FFFFFF', text:'#3E1A0E' },
  'تربية': { primary:'#00695C', secondary:'#00897B', accent:'#4DB6AC', bg:'#E0F2F1', card:'#FFFFFF', text:'#1A2D2B' },
  'default': { primary:'#0D3B66', secondary:'#167D7F', accent:'#4CAF50', bg:'#EAF2F5', card:'#FFFFFF', text:'#333333' },
};

function generatePaletteFromHSL(hue) {
  return {
    primary: `hsl(${hue}, 65%, 25%)`,
    secondary: `hsl(${(hue + 30) % 360}, 50%, 35%)`,
    accent: `hsl(${(hue + 60) % 360}, 55%, 55%)`,
    bg: `hsl(${hue}, 30%, 95%)`,
    card: '#FFFFFF',
    text: `hsl(${hue}, 30%, 15%)`
  };
}

function getColorPalette(data) {
  // إذا الألوان محددة في الداتا نستخدمها
  if (data.color_palette && data.color_palette.primary) {
    return {
      primary: data.color_palette.primary,
      secondary: data.color_palette.secondary || data.color_palette.primary,
      accent: data.color_palette.accent || '#4CAF50',
      bg: data.color_palette.bg || '#EAF2F5',
      card: data.color_palette.card || '#FFFFFF',
      text: data.color_palette.text || '#333333'
    };
  }
  // أو نحاول نطابق الموضوع
  const category = (data.category || data.metadata?.category || '').toLowerCase();
  for (const [topic, palette] of Object.entries(TOPIC_PALETTES)) {
    if (category.includes(topic)) return palette;
  }
  return TOPIC_PALETTES.default;
}

module.exports = {
  ILLUSTRATIONS,
  DECORATIONS,
  mapContentToIllustration,
  getColorPalette,
  generatePaletteFromHSL,
  TOPIC_PALETTES
};
