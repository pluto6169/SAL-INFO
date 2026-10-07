// lib/template-engine.js - محرك قالب الإنفوجرافيك المطور لمواصفات Koha / MARC21
const { ILLUSTRATIONS, DECORATIONS, mapContentToIllustration, getColorPalette } = require('./illustrations');

function normalizeData(data) {
  const biblio_id = data.biblio_id || data.biblionumber || data.biblioId || data.metadata?.biblioId || '001';
  const isbn = data.isbn || data.metadata?.isbn || '';
  const title = data.title || data.header?.title || 'بدون عنوان';
  const subtitle = data.subtitle || data.header?.subtitle || '';
  const author = data.author || data.metadata?.author || '';
  const edition = data.edition || data.metadata?.edition || '';
  const publisher = data.publisher || data.metadata?.publisher || '';
  const pubPlace = data.pubPlace || data.metadata?.pubPlace || '';
  const pubYear = data.pubYear || data.metadata?.pubYear || data.metadata?.pub_year || '';
  const pages = data.pages || data.metadata?.pages || '';
  const series = data.series || data.metadata?.series || '';
  const language = data.language || data.metadata?.language || 'ara';
  const dewey = data.dewey || data.metadata?.dewey || '';
  const callNumber = data.callNumber || data.call_number || data.metadata?.callNumber || '';
  
  const subject1 = data.subject1 || '';
  const subject2 = data.subject2 || '';
  const subject3 = data.subject3 || '';
  const subjects = [subject1, subject2, subject3].filter(Boolean);

  const category = data.category || data.metadata?.category || 'تقنية';
  const itemType = data.itemType || data.metadata?.itemType || 'book';
  const copyCount = data.copyCount || data.metadata?.copyCount || '1';
  const shelfLocation = data.shelfLocation || data.metadata?.shelfLocation || '';
  const location = data.location || data.metadata?.location || '';
  const status = data.status !== undefined ? String(data.status) : '0';
  const description = data.description || data.header?.hook || '';
  const notes = data.notes || '';
  const url = data.url || '';
  
  let moodTags = [];
  if (Array.isArray(data.moodTags)) {
    moodTags = data.moodTags;
  } else if (typeof data.moodTags === 'string' && data.moodTags.trim()) {
    moodTags = data.moodTags.split(',').map(s => s.trim()).filter(Boolean);
  }

  const coverImage = data.coverImage || data.cover || '';
  const quote = data.quote || 'معرفة أعمق .. بحث أسرع .. تنظيم أدق للمعلومات';

  // إعداد الأقسام الـ 5 المعتمدة على Koha/MARC
  let sections = data.sections || [];
  if (!sections || sections.length === 0) {
    const statusText = status === '0' ? 'متاح للإعارة' : (status === '1' ? 'مُعار حالياً' : 'مرجع (للاطلاع الداخلي)');
    
    sections = [
      {
        title: "الملخص والفكره (520$a)",
        icon: "book-open",
        points: [description || "لا يوجد ملخص ببليوجرافي متاح", notes ? `ملاحظة: ${notes.substring(0, 45)}...` : "مرجع علمي معتمد"]
      },
      {
        title: "الموضوعات والفرس (650$a)",
        icon: "layers",
        points: subjects.length > 0 ? subjects : ["موضوعات عامة", "فهرسة وتصنيف"]
      },
      {
        title: "ملاحظات القيد (500$a)",
        icon: "file-text",
        points: [notes || "ملاحظات عامة مضافة للتسجيلة", series ? `السلسلة: ${series}` : "ضمن مقتنيات المكتبة"]
      },
      {
        title: "موقع الوعاء والحالة (952$c/7)",
        icon: "info",
        points: [`حالة الوعاء: ${statusText}`, `عدد النسخ: ${copyCount} نسخة`, location ? `الموقع: ${location}` : (shelfLocation ? `الرف: ${shelfLocation}` : 'المكتبة الرئيسية')]
      },
      {
        title: "الوصول الرقمي (856$u)",
        icon: "target",
        points: [url ? `رابط إلكتروني: ${url.substring(0, 35)}...` : "وعاء ورقي متاح بالرف", `نوع الوعاء: ${itemType}`]
      }
    ];
  }

  const target_audience = data.target_audience || {
    for_who: [category ? `الباحثون في مجال (${category})` : 'جميع الباحثين والقراء'],
    benefits: subjects.length > 0 ? subjects : ['رفع الكفاءة البحثية', 'تنظيم البيانات والمعرفة']
  };

  const palette = getColorPalette(data);

  return {
    biblio_id, isbn, title, subtitle, author, edition, publisher, pubPlace, pubYear, pages,
    series, language, dewey, callNumber, subject1, subject2, subject3, subjects, category,
    itemType, copyCount, shelfLocation, location, status, description, notes, url, moodTags,
    coverImage, quote, sections, target_audience, palette
  };
}

function build3DBookCover(coverImage, title, author, series, palette) {
  const coverContent = coverImage
    ? `<div class="book-front" style="background-image:url('${coverImage}');background-size:cover;background-position:center;">
         <div class="cover-shine-overlay"></div>
       </div>`
    : `<div class="book-front book-default-cover">
        <div class="cover-shine-overlay"></div>
        <div class="default-cover-inner">
          <div class="default-cover-ornament">❖</div>
          ${series ? `<div class="default-cover-series">${series}</div>` : ''}
          <div class="default-cover-title">${title}</div>
          <div class="default-cover-line"></div>
          <div class="default-cover-author">${author}</div>
        </div>
      </div>`;

  return `
  <div class="book-3d-container">
    <div class="book-3d">
      ${coverContent}
      <div class="book-spine"></div>
      <div class="book-back"></div>
      <div class="book-shadow"></div>
    </div>
  </div>`;
}

function buildSectionsHTML(sections, palette) {
  const sectionColors = [palette.primary, palette.secondary, palette.accent, '#E67E22', '#8E44AD'];
  return sections.map((sec, idx) => {
    const illKey = mapContentToIllustration(sec.title, sec.points);
    const illSvg = ILLUSTRATIONS[illKey] || ILLUSTRATIONS.default;
    const color = sectionColors[idx % sectionColors.length];
    return `
    <div class="card" style="--card-accent:${color}">
      <div class="card-num-wrapper">
        <span class="card-num" style="background:${color}">${idx + 1}</span>
      </div>
      <div class="card-illustration" style="color:${color}">
        ${illSvg}
      </div>
      <h3 class="card-title">${sec.title || ''}</h3>
      <ul class="card-points">
        ${(sec.points || []).map(p => `<li><span class="bullet" style="color:${color}">◆</span>${p}</li>`).join('')}
      </ul>
    </div>`;
  }).join('');
}

function getStatusBadge(status) {
  const st = String(status).trim();
  if (st === '0' || st === 'متاح') {
    return { text: '🟢 متاح للإعارة', bg: '#e8f8f5', color: '#117a65', border: '#a3e4d7' };
  } else if (st === '1' || st === 'مُعار' || st === 'معار') {
    return { text: '🟠 مُعار حالياً', bg: '#fef5e7', color: '#b9770e', border: '#f9e79f' };
  } else if (st === '2' || st === 'مرجع') {
    return { text: '🔵 مرجع (للاطلاع الداخلي)', bg: '#ebf5fb', color: '#1f618d', border: '#aed6f1' };
  }
  return { text: '🟢 متاح', bg: '#e8f8f5', color: '#117a65', border: '#a3e4d7' };
}

function buildMetaStrip(d) {
  const publisherFull = [d.publisher, d.pubPlace ? `(${d.pubPlace})` : ''].filter(Boolean).join(' ');
  const statusBadge = getStatusBadge(d.status);

  const items = [
    { label: 'الرقم التصنيفي (082)', value: d.dewey || 'غير محدد', icon: 'hash' },
    { label: 'رقم الاستدعاء (092)', value: d.callNumber || '—', icon: 'tag' },
    { label: 'الناشر (260/264)', value: publisherFull || '—', icon: 'building-2' },
    { label: 'سنة النشر (260c)', value: d.pubYear || '—', icon: 'calendar' },
    { label: 'المؤلف (100/700)', value: d.author || '—', icon: 'user' },
    { label: 'عدد الصفحات (300a)', value: d.pages || '—', icon: 'file-text' },
    { label: 'الرمز الدولي (020a)', value: d.isbn || '—', icon: 'barcode' },
    { label: 'رمز الرف (952c)', value: d.shelfLocation || d.location || '—', icon: 'map-pin' },
  ];

  return `
  <div class="meta-strip-header">
    <div class="status-pill" style="background:${statusBadge.bg}; color:${statusBadge.color}; border:1px solid ${statusBadge.border}">
      ${statusBadge.text}
    </div>
    <div class="copies-badge">📚 عدد النسخ المتاحة: <strong>${d.copyCount || 1}</strong></div>
    ${d.language ? `<div class="lang-badge">🌐 اللغة: <strong>${d.language.toUpperCase()}</strong></div>` : ''}
    ${d.biblio_id ? `<div class="biblio-badge">🔖 تسجيلة Koha: <strong>#${d.biblio_id}</strong></div>` : ''}
  </div>
  <div class="meta-grid-wrapper">
    ${items.map(item => `
      <div class="meta-box">
        <i data-lucide="${item.icon}"></i>
        <span class="meta-label">${item.label}</span>
        <strong class="meta-value">${item.value}</strong>
      </div>
    `).join('')}
  </div>`;
}

function buildMoodbar(palette, moodTags) {
  const colors = [palette.primary, palette.secondary, palette.accent,
    palette.bg, palette.card || '#FFFFFF', palette.text || '#333'];
  const colorDots = colors.map(c => `<span class="color-dot" style="background:${c}"><small>${c}</small></span>`).join('');

  const defaultTags = ['تعلم', 'بحث', 'معرفة', 'تنظيم', 'تطوير مهني'];
  const tags = moodTags.length > 0 ? moodTags : defaultTags;
  const tagsHTML = tags.map(t => `<span class="mood-tag">${t}</span>`).join('');

  return `
  <div class="moodbar">
    <div class="moodbar-tags">
      <span class="moodbar-label">الكلمات المفتاحية والحالة (Mood Tags)</span>
      ${tagsHTML}
    </div>
    <div class="moodbar-colors">
      <span class="moodbar-label">لوحة الألوان</span>
      ${colorDots}
    </div>
  </div>`;
}

function generateInfographicHTML(rawData) {
  const d = normalizeData(rawData);
  const p = d.palette;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<script src="https://unpkg.com/lucide@latest"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

:root {
  --primary: ${p.primary};
  --secondary: ${p.secondary};
  --accent: ${p.accent};
  --bg: ${p.bg};
  --card: ${p.card || '#fff'};
  --text: ${p.text || '#333'};
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 800px; font-family: 'Cairo', sans-serif; color: var(--text);
  background: var(--bg); position: relative; overflow: hidden;
}

/* ======= BACKGROUND DECORATIONS ======= */
.bg-deco { position: absolute; z-index: 0; pointer-events: none; }
.bg-deco-1 { top: 60px; left: -10px; width: 140px; color: var(--primary); opacity: 0.8; }
.bg-deco-2 { top: 400px; right: -20px; width: 120px; color: var(--secondary); opacity: 0.8; }
.bg-deco-3 { bottom: 200px; left: 10px; width: 100px; color: var(--accent); opacity: 0.8; }
.bg-deco-4 { top: 200px; right: 40px; width: 160px; color: var(--primary); opacity: 0.6; }
.bg-deco-5 { bottom: 80px; right: 20px; width: 130px; color: var(--secondary); opacity: 0.7; }

.content-wrapper { position: relative; z-index: 1; padding: 22px; }

/* ======= HEADER ======= */
.header {
  text-align: center; padding: 24px 20px 20px; margin-bottom: 16px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 16px; position: relative; overflow: hidden; color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.12);
}
.header::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 160px; height: 160px; border-radius: 50%;
  background: rgba(255,255,255,0.08);
}
.header::after {
  content: ''; position: absolute; bottom: -30px; left: -30px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
.edition-badge {
  position: absolute; top: 0; left: 0;
  background: var(--accent); color: white;
  padding: 5px 16px; font-size: 11px; font-weight: 700;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}
.series-tag {
  display: inline-block; background: rgba(255,255,255,0.2);
  padding: 2px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;
  margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.25);
}
.header h1 { font-size: 26px; font-weight: 900; margin-bottom: 4px; text-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.header h2 { font-size: 14.5px; font-weight: 600; opacity: 0.95; margin-bottom: 10px; }
.hook-pill {
  display: inline-block; background: rgba(255,255,255,0.22);
  backdrop-filter: blur(4px); padding: 5px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);
}

/* ======= BOOK + META SECTION ======= */
.book-meta-section {
  display: flex; gap: 16px; margin-bottom: 16px; align-items: stretch;
}

/* 3D Book Cover */
.book-3d-container {
  flex: 0 0 210px; display: flex; align-items: center;
  justify-content: center; perspective: 800px; padding: 14px;
  background: var(--card); border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.04);
}
.book-3d {
  transform-style: preserve-3d; transform: rotateY(-26deg);
  position: relative; width: 145px; height: 210px;
}
.book-front {
  position: absolute; width: 100%; height: 100%;
  border-radius: 0 6px 6px 0; transform: translateZ(14px);
  box-shadow: 3px 3px 14px rgba(0,0,0,0.25);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  overflow: hidden;
}
.cover-shine-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(105deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(0,0,0,0.15) 100%);
  pointer-events: none;
}
.book-default-cover {
  display: flex; align-items: center; justify-content: center;
}
.default-cover-inner {
  text-align: center; color: white; padding: 14px; width: 100%;
}
.default-cover-ornament { font-size: 24px; margin-bottom: 6px; opacity: 0.85; }
.default-cover-series { font-size: 8.5px; opacity: 0.8; margin-bottom: 4px; text-transform: uppercase; }
.default-cover-title { font-size: 12px; font-weight: 800; line-height: 1.35; margin-bottom: 8px; }
.default-cover-line { width: 36px; height: 2px; background: rgba(255,255,255,0.6); margin: 0 auto 8px; }
.default-cover-author { font-size: 9px; font-weight: 600; opacity: 0.9; }

.book-spine {
  position: absolute; width: 28px; height: 100%; left: -14px;
  transform: rotateY(90deg) translateZ(14px);
  background: linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary) 65%, black));
  border-radius: 3px 0 0 3px;
}
.book-back {
  position: absolute; width: 100%; height: 100%;
  transform: translateZ(-14px);
  background: color-mix(in srgb, var(--primary) 80%, black);
  border-radius: 6px 0 0 6px;
}
.book-shadow {
  position: absolute; bottom: -15px; left: 10%; width: 80%; height: 20px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%);
  transform: rotateX(90deg);
}

/* Meta Grid & Header Badges */
.meta-side-container { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.meta-strip-header {
  display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font-size: 10.5px;
}
.status-pill {
  padding: 4px 12px; border-radius: 14px; font-weight: 700; font-size: 10.5px;
}
.copies-badge, .lang-badge, .biblio-badge {
  background: var(--card); padding: 4px 10px; border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05); font-size: 10px; color: #444;
}

.meta-grid-wrapper {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 7px; flex: 1; align-content: center;
}
.meta-box {
  background: var(--card); padding: 8px 6px; border-radius: 10px;
  text-align: center; border-bottom: 3px solid var(--secondary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
.meta-box i { width: 16px; height: 16px; color: var(--secondary); margin-bottom: 2px; }
.meta-label { display: block; font-size: 8.5px; color: #777; margin-bottom: 1px; font-weight: 600; }
.meta-value { display: block; font-size: 10.5px; color: var(--primary); font-weight: 800; line-height: 1.25; }

/* ======= CONTENT CARDS ======= */
.cards-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 10px; margin-bottom: 16px;
}
.card {
  background: var(--card); border-radius: 12px; padding: 10px 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05); position: relative;
  border-top: 3.5px solid var(--card-accent, var(--primary));
}
.card-num-wrapper { text-align: center; margin-bottom: 4px; }
.card-num {
  display: inline-block; width: 22px; height: 22px; border-radius: 50%;
  color: white; font-size: 10.5px; font-weight: 800; line-height: 22px;
  text-align: center;
}
.card-illustration {
  width: 50px; height: 44px; margin: 0 auto 4px; display: flex;
  align-items: center; justify-content: center;
}
.card-illustration svg { width: 100%; height: 100%; }
.card-title {
  text-align: center; font-size: 10.5px; font-weight: 800;
  color: var(--primary); margin-bottom: 6px; min-height: 26px;
  display: flex; align-items: center; justify-content: center;
  line-height: 1.25;
}
.card-points { list-style: none; text-align: right; }
.card-points li {
  font-size: 9px; margin-bottom: 4px; line-height: 1.45;
  display: flex; gap: 4px; align-items: flex-start; word-break: break-word;
}
.bullet { font-size: 5.5px; margin-top: 3px; flex-shrink: 0; }

/* ======= QUOTE ======= */
.quote-section {
  background: var(--card); border-radius: 12px; padding: 14px 22px;
  margin-bottom: 16px; text-align: center; position: relative;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.quote-mark {
  font-size: 44px; line-height: 0; color: var(--accent); opacity: 0.35;
  font-family: Georgia, serif; position: absolute;
}
.quote-mark-open { top: 16px; right: 14px; }
.quote-mark-close { bottom: 6px; left: 14px; }
.quote-text {
  font-size: 13.5px; font-weight: 700; color: var(--primary);
  padding: 0 32px; line-height: 1.7;
}

/* ======= AUDIENCE & DIGITAL RESOURCE ======= */
.audience-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;
}
.audience-box {
  background: var(--card); border-radius: 12px; padding: 12px 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
}
.audience-box h4 {
  font-size: 11.5px; color: var(--primary); font-weight: 800;
  margin-bottom: 6px; display: flex; align-items: center; gap: 5px;
}
.audience-box ul { list-style: none; padding: 0; }
.audience-box li {
  font-size: 10px; color: #444; margin-bottom: 3px;
  padding-right: 12px; position: relative; line-height: 1.5;
}
.audience-box li::before {
  content: '■'; position: absolute; right: 0; color: var(--secondary);
  font-size: 6.5px; top: 3px;
}

/* ======= MOODBAR ======= */
.moodbar {
  background: var(--card); border-radius: 12px; padding: 12px 16px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.04);
  border-top: 3px solid var(--primary);
}
.moodbar-label {
  font-size: 9.5px; font-weight: 800; color: var(--primary);
  margin-left: 8px;
}
.moodbar-tags { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.mood-tag {
  background: var(--bg); color: var(--primary); padding: 3px 9px;
  border-radius: 12px; font-size: 8.5px; font-weight: 700;
  border: 1px solid rgba(0,0,0,0.05);
}
.moodbar-colors { display: flex; align-items: center; gap: 4px; }
.color-dot {
  width: 20px; height: 20px; border-radius: 50%; display: inline-flex;
  align-items: center; justify-content: center;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.color-dot small { display: none; }
</style>
</head>
<body>

<!-- Background Decorations -->
<div class="bg-deco bg-deco-1">${DECORATIONS.plant}</div>
<div class="bg-deco bg-deco-2">${DECORATIONS.deskLamp}</div>
<div class="bg-deco bg-deco-3">${DECORATIONS.quill}</div>
<div class="bg-deco bg-deco-4">${DECORATIONS.dottedCircles}</div>
<div class="bg-deco bg-deco-5">${DECORATIONS.geometricPattern}</div>

<div class="content-wrapper">

  <!-- Header -->
  <div class="header">
    ${d.edition ? `<div class="edition-badge">${d.edition}</div>` : ''}
    ${d.series ? `<div class="series-tag">📚 ${d.series}</div>` : ''}
    <h1>${d.title}</h1>
    ${d.subtitle ? `<h2>${d.subtitle}</h2>` : ''}
    ${d.description ? `<div class="hook-pill">💡 ${d.description.substring(0, 85)}${d.description.length > 85 ? '...' : ''}</div>` : ''}
  </div>

  <!-- Book Cover + Metadata -->
  <div class="book-meta-section">
    ${build3DBookCover(d.coverImage, d.title, d.author, d.series, p)}
    <div class="meta-side-container">
      ${buildMetaStrip(d)}
    </div>
  </div>

  <!-- Content Cards -->
  <div class="cards-grid">
    ${buildSectionsHTML(d.sections, p)}
  </div>

  <!-- Quote -->
  <div class="quote-section">
    <span class="quote-mark quote-mark-open">"</span>
    <p class="quote-text">${d.quote}</p>
    <span class="quote-mark quote-mark-close">"</span>
  </div>

  <!-- Target Audience -->
  <div class="audience-grid">
    <div class="audience-box">
      <h4>🎓 الفئة والجمهور المستهدف (942c):</h4>
      <ul>${(d.target_audience.for_who || []).map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
    <div class="audience-box">
      <h4>🚀 المخرجات والفوائد الببليوجرافية (650a):</h4>
      <ul>${(d.target_audience.benefits || []).map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  </div>

  <!-- Moodbar -->
  ${buildMoodbar(p, d.moodTags)}

</div>

<script>lucide.createIcons();</script>
</body>
</html>`;
}

module.exports = { generateInfographicHTML, normalizeData };
