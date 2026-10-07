// generate-infographic.js - اختبار التوليد المباشر بواسطة Koha / MARC Schema
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { generateInfographicHTML } = require('./lib/template-engine');

// بيانات الكتاب بالصيغة الموحدة (Koha MARC JSON)
const bookData = {
    biblio_id: "001",
    isbn: "978-977-227-123-4",
    title: "قواعد البيانات وأنظمة استرجاع المعلومات",
    subtitle: "تصميم ذكي للبيانات .. بحث أسرع .. معرفة أدق",
    author: "د. محمد فتحي عبد الهادي",
    edition: "الطبعة الثانية",
    publisher: "دار غريب",
    pubPlace: "القاهرة",
    pubYear: "2024",
    pages: "318 صفحة",
    series: "سلسلة تقنية المعلومات والمكتبات الرقمية",
    language: "ara",
    dewey: "025.04",
    callNumber: "025.04 ABD",
    subject1: "تقنية المعلومات",
    subject2: "استرجاع المعلومات",
    subject3: "قواعد البيانات العلاقية",
    category: "تقنية",
    itemType: "book",
    copyCount: "3",
    shelfLocation: "SEC2-S04",
    location: "مكتبة الدور الثاني - الرف 4",
    status: "0",
    description: "مرجع شامل يربط بين النظرية والتطبيق في بناء قواعد البيانات وأنظمة الاسترجاع الرقمية.",
    notes: "يتضمن ملحقاً حول لغة SQL والبحث الدلالي في المكتبات الرقمية.",
    url: "https://koha.library.edu/bib/001",
    moodTags: ["تعلم", "بحث", "معرفة", "تنظيم"],
    coverImage: "",
    quote: "المعلومات لا تفيد ما لم تُنظّم، والتنظيم لا يكتمل إلا بنظام يتيح الوصول إليها بسهولة ودقة.",
    color_palette: {
        primary: "#0D3B66",
        secondary: "#167D7F",
        accent: "#29B6F6",
        bg: "#EAF2F5"
    }
};

(async () => {
    try {
        console.log('⚡ جاري توليد صفحة HTML...');
        const html = generateInfographicHTML(bookData);

        console.log('🚀 تشغيل متصفح Puppeteer...');
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: 2 });
        await page.setContent(html, { waitUntil: 'networkidle0' });

        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 500));

        const outputPath = path.join(__dirname, 'infographic_result.png');
        await page.screenshot({ path: outputPath, fullPage: true });

        console.log(`✅ تم إنشاء الإنفوجرافيك الموحد بنجاح! المسار: ${outputPath}`);
        await browser.close();
    } catch (err) {
        console.error('❌ خطأ أثناء التوليد:', err);
    }
})();