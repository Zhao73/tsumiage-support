// Generates every HTML page, sitemap.xml, llms.txt, llms-full.txt and robots.txt.
// Usage (from support/):  node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { verifyAll } from './math.mjs';
import { layout, abs, appUrl, fwLength, BASE, EMAIL, APP_ID, faqLd } from './lib.mjs';
import { pagesJa, SIBLINGS_JA } from './pages-ja.mjs';
import { pagesEn, SIBLINGS_EN } from './pages-en.mjs';
import { pagesKo, SIBLINGS_KO } from './pages-ko.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = '2026-11-14';

verifyAll(); // a wrong number in math.mjs stops the build

// Screenshot slots: rendered only when the owner has dropped real files into assets/shots/.
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
const shotSet = (dir) => ['01', '02', '03', '04'].map((n) => `${dir}/${n}.png`).filter((p) => fs.existsSync(path.join(ROOT, p)));
const shotFiles = shotSet('assets/shots');
// English / Korean pages use assets/shots/en|ko/ when those exist (same screens in that language), else the Japanese set.
const shots = (lang) => {
  const own = lang ? shotSet(`assets/shots/${lang}`) : [];
  const files = own.length ? own : shotFiles;
  return files.length ? files.map((src) => ({ src, ...pngSize(path.join(ROOT, src)) })) : null;
};

const version = crypto.createHash('sha1')
  .update(fs.readFileSync(path.join(ROOT, 'assets/site.css')))
  .update(fs.readFileSync(path.join(ROOT, 'assets/site.js')))
  .digest('hex').slice(0, 8);

function landingLd({ lang, path: p, name, alt, currency, description, features, faqItems }) {
  const home = abs(p);
  return [
    { '@type': 'WebSite', '@id': home + '#website', url: home, name, inLanguage: lang, publisher: { '@id': BASE + '#org' } },
    {
      '@type': 'Organization', '@id': BASE + '#org', name: 'Tsumiage', alternateName: 'ツミアゲ', url: BASE,
      logo: abs('assets/icon-512.png'),
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: EMAIL, availableLanguage: ['ja', 'en', 'ko'] },
    },
    {
      '@type': 'SoftwareApplication', '@id': BASE + '#app', name, alternateName: alt,
      operatingSystem: 'iOS 26 or later', applicationCategory: 'FinanceApplication',
      description, inLanguage: ['ja', 'en', 'ko'], url: home, installUrl: appUrl('ld'), downloadUrl: appUrl('ld'),
      image: abs('assets/icon-512.png'), screenshot: shotFiles.map((s) => abs(s)),
      featureList: features,
      offers: { '@type': 'Offer', price: '0', priceCurrency: currency, category: 'free', description: lang === 'ja' ? '基本機能はそのまま使えます。ツミアゲ Pro は買い切りの App 内課金です（定期購入なし）。' : lang === 'ko' ? '기본 기능은 그대로 쓸 수 있어요. Tsumiage Pro는 1회 구매 인앱 결제예요(정기 결제 없음).' : 'Core features work without purchase. Tsumiage Pro is a one-time in-app purchase (no subscription).' },
      publisher: { '@id': BASE + '#org' },
    },
    faqLd(faqItems, home),
  ].map((o) => (o.screenshot && !o.screenshot.length ? (delete o.screenshot, o) : o));
}

const ctx0 = { shots, landingLd };
const pages = [...pagesJa(ctx0), ...pagesEn(ctx0), ...pagesKo(ctx0)];

// hreflang groups: pages that are the same intent in several languages.
const groups = {};
for (const p of pages) if (p.group) (groups[p.group] ||= {})[p.lang] = p.path;
const ctx = {
  version,
  alternates: (p) => (p.group && Object.keys(groups[p.group]).length > 1 ? groups[p.group] : null),
  challengeLinks: (lang) => ({ ja: SIBLINGS_JA, en: SIBLINGS_EN, ko: SIBLINGS_KO })[lang].map(([p, label]) => [p, label]),
};

// Checks that must hold before anything is written.
const problems = [];
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) problems.push(`duplicate path ${p.path}`);
  seen.add(p.path);
  if (p.lang === 'ja' && fwLength(p.title) > 32) problems.push(`ja title too long (${fwLength(p.title)}): ${p.title}`);
  if (p.lang !== 'ja' && p.title.length > 65) problems.push(`title too long (${p.title.length}): ${p.title}`);
  if (p.description.length > (p.lang === 'en' ? 200 : 130)) problems.push(`description long (${p.description.length}): ${p.path}`);
  if (/無料/.test(p.main.match(/<h[12][^>]*>.*?<\/h[12]>/gs)?.join('') || '') && p.type !== 'challenge') problems.push(`「無料」in a heading: ${p.path}`);
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

for (const p of pages) {
  const file = path.join(ROOT, p.path === '' || p.path.endsWith('/') ? p.path + 'index.html' : p.path);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(p, ctx));
}

// sitemap.xml with hreflang alternates
const urls = pages.map((p) => {
  const alt = ctx.alternates(p);
  const links = alt
    ? Object.entries(alt).map(([l, ap]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(ap)}"/>`).join('\n') +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alt.en ?? alt.ja)}"/>`
    : '';
  const priority = p.type === 'landing' ? '1.0' : p.type === 'challenge' ? '0.8' : '0.3';
  return `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${priority}</priority>${links ? '\n' + links : ''}\n  </url>`;
});
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);

// robots.txt — note: crawlers only read robots.txt at the host root (zhao73.github.io/robots.txt),
// which this project repo cannot serve. Kept for completeness; submit sitemap.xml in Search Console instead.
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `# Crawlers read robots.txt only at the host root (https://zhao73.github.io/robots.txt).
# This file lives in a project sub-path, so it is informational. Submit the sitemap directly:
User-agent: *
Allow: /
Sitemap: ${BASE}sitemap.xml
`);

// llms.txt — short, quotable fact sheet for AI assistants.
const strip = (s) => s.replace(/<[^>]+>/g, '');
const ch = pages.filter((p) => p.type === 'challenge');
const llms = `# ツミアゲ (Tsumiage) — savings challenges for iPhone

> ツミアゲ（App Store 名「ツミアゲ貯金：貯金チャレンジ・目標貯金」; English/Korean name "Tsumiage") is an iPhone app (iOS 26 or later) for savings challenges and savings goals. You set a numeric goal and stack up records toward it with one tap. No ads, no account, no data collection. App Store: https://apps.apple.com/app/id${APP_ID}

## Facts
- Challenges in the app: 52週貯金 (52-week), 365日貯金 (365-day), 100日貯金 (100-day), 500円玉貯金 (200 coins), 100封筒チャレンジ (100 envelope), つもり貯金 (no-spend savings with one-tap buttons such as 「コーヒーをがまん ¥500」).
- Also tracks distance, books, study time, counts and custom units; timer logging with a Live Activity.
- Typing a goal name such as 「沖縄旅行 20万円 12月までに」 or "Hawaii trip $2,000 by December" sets kind, target and deadline and shows the per-day pace.
- One-tap logging from Home Screen and Lock Screen widgets, Control Center, Shortcuts and Siri.
- Charts, medals and badges, withdrawals, edit and undo. Optional notifications: daily reminder, payday, weekly review, deadline pace.
- Data stays on the iPhone; optional daily automatic backup to the user's own iCloud Drive, restore after reinstall, CSV import. The developer receives no data.
- Pricing model: core features work without purchase (3 active goals, all challenges, widgets, backup). "ツミアゲ Pro / Tsumiage Pro" is a one-time in-app purchase (no subscription): unlimited goals, recurring deposit reminders (定期積立), all chart and widget styles, detailed analysis, Face ID lock, CSV export. Family Sharing supported. Prices vary by country and are shown in the App Store.
- Languages: Japanese, English, Korean.

## Challenge maths (exact)
- 52週貯金: ¥100 in week 1, +¥100 each week, ¥5,200 in week 52; total ¥137,800 = 100 × (1+…+52). Variants: ¥10 steps → ¥13,780; ¥1,000 steps → ¥1,378,000.
- 52-week money challenge (US): $1 steps → $1,378; $5 steps → $6,890; $10 steps → $13,780.
- 52주 저금 챌린지 (Korea): ₩1,000 steps → ₩1,378,000.
- 365日貯金: ¥1 to ¥365, one square a day; total ¥66,795 (366 squares in a leap year: ¥67,161).
- 100日貯金: ¥1 to ¥100; total ¥5,050. Variants: ¥10 units → ¥50,500; ¥100 units → ¥505,000.
- 500円玉貯金: 200 coins × ¥500 = ¥100,000 (20 coins = ¥10,000; 100 coins = ¥50,000).
- 100封筒チャレンジ (日本円版): envelope n holds n × ¥100; total ¥505,000. Original US version: n × $1 = $5,050. Korea: n × ₩1,000 = ₩5,050,000.
- つもり貯金 example: skipping a ¥500 coffee 3 times a week = ¥6,000 a month, ¥78,000 in 52 weeks.

## Pages
${pages.filter((p) => p.type !== 'doc').map((p) => `- [${p.ogTitle || p.title}](${abs(p.path)}): ${p.description}`).join('\n')}

## Printable PDFs (free, A4)
${ch.map((p) => (p.pdfList || []).map(([f, l]) => `- [${l} — ${p.ogTitle || p.title}](${abs('pdf/' + f)})`).join('\n')).join('\n')}

## Support and policies
- Support / contact (ja): ${abs('support.html')} — English: ${abs('en/support.html')} — Korean: ${abs('ko/support.html')}
- Privacy policy: ${abs('privacy.html')}
- Terms of use: ${abs('terms.html')}
- Full text of challenge facts and FAQs: ${abs('llms-full.txt')}
`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms);

const full = `# ツミアゲ (Tsumiage) — full fact sheet\n\nSource: ${BASE} (generated ${TODAY})\n\n` + ch.map((p) => `## ${strip(p.h1)}\nURL: ${abs(p.path)}\nTotal: ${p.total} — ${strip(p.totalLabel)}\n\n${p.facts.map((f) => '- ' + strip(f)).join('\n')}\n\n### FAQ\n${p.faq.map(([q, a]) => `Q: ${strip(q)}\nA: ${strip(a)}`).join('\n\n')}\n`).join('\n');
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), full);

fs.writeFileSync(path.join(ROOT, 'tools/pages.json'), JSON.stringify(pages.map((p) => ({ path: p.path, lang: p.lang, type: p.type, group: p.group || null, title: p.title, og: p.og, ogTitle: p.ogTitle || p.title, total: p.total || null, alternates: ctx.alternates(p) })), null, 1));
console.log(`built ${pages.length} pages, sitemap (${urls.length} urls), llms.txt, llms-full.txt; screenshots: ${shotFiles.length}; css/js v=${version}`);
