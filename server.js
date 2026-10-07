// server.js - SAL Infographic Generator Server
const express = require('express');
const puppeteer = require('puppeteer');
const JSZip = require('jszip');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateInfographicHTML } = require('./lib/template-engine');
const { TOPIC_PALETTES, generatePaletteFromHSL } = require('./lib/illustrations');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ========== مجلد المخرجات ==========
const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ========== Helper: تحويل صورة الغلاف لـ Base64 ==========
function imageToBase64(buffer, mimetype) {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
}

// ========== Helper: تحويل CSV لـ JSON بمواصفات Koha / MARC ==========
function parseCSVLine(text) {
  const result = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  result.push(cell.trim());
  return result;
}

function csvToBooks(csvText) {
  const cleanText = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const book = {};
    headers.forEach((h, i) => {
      let val = (values[i] || '').trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"').trim();
      }
      book[h] = val;
    });

    if (typeof book.moodTags === 'string' && book.moodTags) {
      book.moodTags = book.moodTags.split(',').map(s => s.trim()).filter(Boolean);
    }
    return book;
  });
}

// ========== API: المعاينة الحية (بدون Puppeteer) ==========
app.post('/api/generate-preview', (req, res) => {
  try {
    const html = generateInfographicHTML(req.body);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== API: توليد إنفوجرافيك فردي (PNG / PDF) ==========
app.post('/api/generate', upload.single('cover'), async (req, res) => {
  let browser;
  try {
    let bookData = req.body;
    if (typeof bookData.data === 'string') {
      bookData = JSON.parse(bookData.data);
    }

    // إذا في غلاف مرفوع نحوله لـ Base64
    if (req.file) {
      bookData.coverImage = imageToBase64(req.file.buffer, req.file.mimetype);
    }

    const html = generateInfographicHTML(bookData);
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const scaleFactor = parseInt(req.query.scale) || 2;
    await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: scaleFactor });
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // انتظر تحميل الخطوط والأيقونات
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 300));

    const format = req.query.format || 'png';
    if (format === 'pdf') {
      const pdfBuffer = await page.pdf({
        width: '800px', printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=infographic.pdf' });
      res.send(pdfBuffer);
    } else {
      const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });
      res.set('Content-Type', 'image/png');
      res.send(imageBuffer);
    }
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

// ========== API: التوليد الجماعي (ZIP) ==========
app.post('/api/bulk-generate', upload.single('file'), async (req, res) => {
  let browser;
  try {
    let books = [];

    // من ملف مرفوع (JSON أو CSV)
    if (req.file) {
      const content = req.file.buffer.toString('utf-8');
      if (req.file.originalname.endsWith('.csv')) {
        books = csvToBooks(content);
      } else {
        const parsed = JSON.parse(content);
        books = Array.isArray(parsed) ? parsed : [parsed];
      }
    }
    else if (req.body.books) {
      books = typeof req.body.books === 'string' ? JSON.parse(req.body.books) : req.body.books;
    } else if (Array.isArray(req.body)) {
      books = req.body;
    }

    if (!books.length) {
      return res.status(400).json({ error: 'لم يتم إرسال أي بيانات كتب' });
    }

    const zip = new JSZip();
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const scaleFactor = parseInt(req.query.scale) || 2;
    await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: scaleFactor });

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const biblioId = book.biblio_id || book.biblionumber || book.biblioId || String(i + 1).padStart(4, '0');
      try {
        const html = generateInfographicHTML(book);
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 200));

        const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });
        zip.file(`BIB-${biblioId}.png`, imageBuffer);

        console.log(`✅ تم توليد: BIB-${biblioId}.png (${i + 1}/${books.length})`);
      } catch (bookErr) {
        console.error(`⚠️ خطأ في توليد الكتاب (${biblioId}):`, bookErr.message);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=sal-infographics-koha.zip'
    });
    res.send(zipBuffer);
  } catch (error) {
    console.error('Bulk generate error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

// ========== API: SSE للتقدم الجماعي ==========
app.post('/api/bulk-generate-stream', upload.single('file'), async (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });

  let browser;
  try {
    let books = [];
    if (req.file) {
      const content = req.file.buffer.toString('utf-8');
      if (req.file.originalname.endsWith('.csv')) books = csvToBooks(content);
      else { const p = JSON.parse(content); books = Array.isArray(p) ? p : [p]; }
    } else if (req.body.books) {
      books = typeof req.body.books === 'string' ? JSON.parse(req.body.books) : req.body.books;
    }

    res.write(`data: ${JSON.stringify({ type: 'start', total: books.length })}\n\n`);

    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: 2 });

    const zip = new JSZip();
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const biblioId = book.biblio_id || book.biblionumber || book.biblioId || String(i + 1).padStart(4, '0');
      try {
        const html = generateInfographicHTML(book);
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 200));

        const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });
        zip.file(`BIB-${biblioId}.png`, imageBuffer);

        res.write(`data: ${JSON.stringify({ type: 'progress', current: i + 1, total: books.length, biblioId })}\n\n`);
      } catch (bookErr) {
        console.error(`⚠️ خطأ في توليد الكتاب (${biblioId}):`, bookErr.message);
        res.write(`data: ${JSON.stringify({ type: 'progress', current: i + 1, total: books.length, biblioId, error: bookErr.message })}\n\n`);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const zipBase64 = zipBuffer.toString('base64');
    res.write(`data: ${JSON.stringify({ type: 'complete', zipBase64 })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  } finally {
    if (browser) await browser.close();
  }
});

// ========== API: رفع غلاف كتاب ==========
app.post('/api/upload-cover', upload.single('cover'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'لا يوجد ملف مرفوع' });
    const base64 = imageToBase64(req.file.buffer, req.file.mimetype);
    res.json({ coverImage: base64 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== API: اقتراح ألوان ==========
app.get('/api/color-palette/:topic', (req, res) => {
  const topic = req.params.topic;
  for (const [key, palette] of Object.entries(TOPIC_PALETTES)) {
    if (topic.includes(key)) return res.json(palette);
  }
  const hue = Math.abs(topic.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
  res.json(generatePaletteFromHSL(hue));
});

// ========== API: لوحات الألوان المتاحة ==========
app.get('/api/palettes', (req, res) => {
  res.json(TOPIC_PALETTES);
});

// ========== API: تحميل نموذج CSV التجريبي بمواصفات Koha / MARC ==========
app.get('/api/sample-csv', (req, res) => {
  const sampleCSV = `biblio_id,isbn,title,subtitle,author,edition,publisher,pubPlace,pubYear,pages,series,language,dewey,callNumber,subject1,subject2,subject3,category,itemType,copyCount,shelfLocation,location,status,description,notes,url,moodTags
001,"978-977-227-123-4","قواعد البيانات وأنظمة استرجاع المعلومات","تصميم ذكي للبيانات .. بحث أسرع .. معرفة أدق","د. محمد فتحي عبد الهادي","الطبعة الثانية","دار غريب","القاهرة","2024","318 صفحة","سلسلة تقنية المعلومات والمكتبات الرقمية","ara","025.04","025.04 ABD","تقنية المعلومات","استرجاع المعلومات","قواعد البيانات العلاقية","تقنية","book","3","SEC2-S04","مكتبة الدور الثاني - الرف 4","0","مرجع شامل يربط بين النظرية والتطبيق في بناء قواعد البيانات وأنظمة الاسترجاع الرقمية.","يتضمن ملحقاً حول لغة SQL والبحث الدلالي في المكتبات الرقمية.","https://koha.library.edu/bib/001","تعلم, بحث, معرفة, تنظيم"
002,"978-977-102-456-8","تاريخ البيمارستانات في الإسلام","مؤسسات الشفاء الرائدة وعلامات الحضارة","أحمد عيسى بك","طبعة محققة","دار المعارف","القاهرة","2020","420 صفحة","سلسلة تاريخ الطب عند العرب","ara","610.9","610.9 ISS","تاريخ الطب","البيمارستانات","الحضارة الإسلامية","تاريخ","book","1","HIS-A12","قسم الكتب التاريخية - الرف 12","2","دراسة وثائقية تاريخية موثقة عن المستشفيات والتعليم الطبي في العصور الإسلامية.","مرجع تاريخي نادر مخصص للاطلاع الداخلي فقط.","https://koha.library.edu/bib/002","تاريخ, حضارة, طب, وثائق"
003,"978-977-145-789-1","عبقرية عمر","دراسة شخصية الفاروق","عباس محمود العقاد","طبعة خاصة","نهضة مصر","القاهرة","2022","210 صفحة","سلسلة العبقريات الإسلامية","ara","922.97","922.97 AQQ","الأدب العربي","تاريخ الخلفاء","السير والراويات","أدب","book","5","LIT-05","قسم الأدب - الرف 5","0","تحليل أدبي وإنساني ونفسي عميق لشخصية الخليفة الفاروق عمر بن الخطاب.","نسخ متوفرة للإعارة المباشرة للجمهور.","https://koha.library.edu/bib/003","أدب, سيرة, قيادة, إلهام"`;

  res.set({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename=sal-koha-marc-sample.csv'
  });
  res.send('\uFEFF' + sampleCSV); // UTF-8 BOM for Excel support
});

// ========== Start ==========
app.listen(PORT, () => {
  console.log(`\n🚀 SAL Infographic Generator v2.0 (Koha / MARC Standardized)`);
  console.log(`   السيرفر جاهز على: http://localhost:${PORT}`);
  console.log(`   الواجهة: http://localhost:${PORT}\n`);
});