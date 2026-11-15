// Shared layout + components for the static site generator.
import path from 'node:path';

export const BASE = 'https://zhao73.github.io/tsumiage-support/';
export const APP_ID = '6821537539';
// Optional App Store campaign provider token (App Store Connect → App Analytics → Campaigns).
// When set, every App Store link gets ?pt=<token>&ct=web-<page> so web downloads show up in App Analytics.
export const APP_PT = '';
export const EMAIL = 'qwe911291860@gmail.com';
export const YEAR = 2026;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const abs = (p) => BASE + p;

export function appUrl(campaign) {
  const u = `https://apps.apple.com/app/id${APP_ID}`;
  return APP_PT ? `${u}?pt=${APP_PT}&ct=${encodeURIComponent('web-' + campaign)}&mt=8` : u;
}

/** Relative link from one site path ('' | 'dir/' | 'dir/file.html') to another. */
export function rel(from, to) {
  const hashAt = to.indexOf('#');
  const hash = hashAt >= 0 ? to.slice(hashAt) : '';
  const target = hashAt >= 0 ? to.slice(0, hashAt) : to;
  const fromDir = from === '' || from.endsWith('/') ? from : from.slice(0, from.lastIndexOf('/') + 1);
  if (hash && target === from) return hash;
  let r = path.posix.relative('/' + fromDir, '/' + target);
  if (target === '' || target.endsWith('/')) r = r ? r + '/' : './';
  if (!r) r = './';
  return r + hash;
}

/** Width of a title counted in full-width characters (ASCII and half-width count as 0.5). */
export function fwLength(s) {
  let n = 0;
  for (const ch of s) n += /[\u0000-\u00ff\uff61-\uff9f]/.test(ch) ? 0.5 : 1;
  return n;
}

const ICON = {
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/></svg>',
};
export { ICON };

const LANG_LABEL = { ja: '日本語', en: 'English', ko: '한국어' };
const LANG_HOME = { ja: '', en: 'en/', ko: 'ko/' };
export const langHome = (lang) => LANG_HOME[lang];

export const UI = {
  ja: {
    skip: '本文へ移動', nav: [['#challenges', '貯金チャレンジ'], ['#faq', 'よくある質問'], ['support.html', 'サポート']],
    get: 'App Store で入手', getShort: 'App Store', langLabel: '言語',
    footChallenges: '貯金チャレンジ', footApp: 'ツミアゲ', footLang: 'Language',
    support: 'サポート・お問い合わせ', privacy: 'プライバシーポリシー', terms: '利用規約', appStore: 'App Store で見る',
    tagline: '貯金チャレンジと目標貯金を、ひとマスずつ記録する iPhone アプリ。',
    home: 'ツミアゲ',
  },
  en: {
    skip: 'Skip to content', nav: [['#challenges', 'Challenges'], ['#faq', 'FAQ'], ['support.html', 'Support']],
    get: 'Get it on the App Store', getShort: 'App Store', langLabel: 'Language',
    footChallenges: 'Savings challenges', footApp: 'Tsumiage', footLang: 'Language',
    support: 'Support & contact', privacy: 'Privacy Policy', terms: 'Terms of Use', appStore: 'View on the App Store',
    tagline: 'An iPhone app for savings challenges and goals, one square at a time.',
    home: 'Tsumiage',
  },
  ko: {
    skip: '본문으로 이동', nav: [['#challenges', '저축 챌린지'], ['#faq', '자주 묻는 질문'], ['support.html', '지원']],
    get: 'App Store에서 받기', getShort: 'App Store', langLabel: '언어',
    footChallenges: '저축 챌린지', footApp: 'Tsumiage', footLang: 'Language',
    support: '지원·문의', privacy: '개인정보 처리방침', terms: '이용약관', appStore: 'App Store에서 보기',
    tagline: '저축 챌린지와 목표 저축을 한 칸씩 기록하는 iPhone 앱.',
    home: 'Tsumiage',
  },
};

const FONT_CSS = {
  ja: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap',
  en: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
  ko: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap',
};
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

function header(page, alternates) {
  const ui = UI[page.lang];
  const home = langHome(page.lang);
  const navLinks = ui.nav.map(([href, label]) => {
    const target = href.startsWith('#') ? home + href : home + href;
    const current = !href.startsWith('#') && page.path === home + href ? ' aria-current="page"' : '';
    return `<a href="${rel(page.path, target)}"${current}>${label}</a>`;
  }).join('');
  const langs = ['ja', 'en', 'ko'].map((l) => {
    const to = alternates?.[l] ?? langHome(l);
    const cur = l === page.lang ? ' aria-current="true"' : '';
    return `<li><a href="${rel(page.path, to)}" lang="${l}" hreflang="${l}"${cur}>${LANG_LABEL[l]}</a></li>`;
  }).join('');
  return `<header class="site-header">
<div class="wrap header-row">
<a class="brand" href="${rel(page.path, home)}"><img src="${rel(page.path, 'assets/icon-68.png')}" width="34" height="34" alt="">${ui.home}</a>
<nav class="nav" aria-label="${page.lang === 'ja' ? 'サイト内' : page.lang === 'ko' ? '사이트' : 'Site'}">${navLinks}</nav>
<details class="lang"><summary aria-label="${ui.langLabel}: ${LANG_LABEL[page.lang]}">${ICON.globe}<span>${LANG_LABEL[page.lang]}</span></summary><ul>${langs}</ul></details>
<a class="btn btn-primary btn-small header-cta" href="${esc(appUrl('header'))}">${ui.getShort}</a>
</div>
</header>`;
}

function footer(page, challengeLinks) {
  const ui = UI[page.lang];
  const home = langHome(page.lang);
  const ch = challengeLinks.map(([p, label]) => `<li><a href="${rel(page.path, p)}">${label}</a></li>`).join('');
  const langs = ['ja', 'en', 'ko'].map((l) => `<li><a href="${rel(page.path, langHome(l))}" lang="${l}" hreflang="${l}">${LANG_LABEL[l]}</a></li>`).join('');
  return `<footer class="site-footer">
<div class="wrap">
<div class="foot-grid">
<div class="foot-brand"><a class="brand" href="${rel(page.path, home)}"><img src="${rel(page.path, 'assets/icon-68.png')}" width="34" height="34" alt="" loading="lazy">${ui.home}</a><p>${ui.tagline}</p></div>
<div><h2>${ui.footChallenges}</h2><ul>${ch}</ul></div>
<div><h2>${ui.footApp}</h2><ul>
<li><a href="${esc(appUrl('footer'))}">${ui.appStore}</a></li>
<li><a href="${rel(page.path, home + 'support.html')}">${ui.support}</a></li>
<li><a href="${rel(page.path, home + 'privacy.html')}">${ui.privacy}</a></li>
<li><a href="${rel(page.path, home + 'terms.html')}">${ui.terms}</a></li>
</ul></div>
<div><h2>${ui.footLang}</h2><ul>${langs}</ul></div>
</div>
<p class="copy">© ${YEAR} Jiapeng Zhao</p>
</div>
</footer>`;
}

/** Full HTML document for one page. */
export function layout(page, ctx) {
  const alternates = ctx.alternates(page);
  const canonical = abs(page.path);
  const og = abs(page.og);
  const hreflang = alternates
    ? ['ja', 'en', 'ko'].filter((l) => alternates[l] !== undefined).map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(alternates[l])}">`).join('\n') +
      `\n<link rel="alternate" hreflang="x-default" href="${abs(alternates.en ?? alternates.ja)}">`
    : '';
  const ogLocale = { ja: 'ja_JP', en: 'en_US', ko: 'ko_KR' }[page.lang];
  const fonts = page.lang === 'ko'
    ? `<link rel="stylesheet" href="${PRETENDARD}" crossorigin>\n<link rel="stylesheet" href="${FONT_CSS.ko}">`
    : `<link rel="stylesheet" href="${FONT_CSS[page.lang]}">`;
  const ld = page.jsonld?.length
    ? `<script type="application/ld+json">${JSON.stringify(page.jsonld.length === 1 ? { '@context': 'https://schema.org', ...page.jsonld[0] } : { '@context': 'https://schema.org', '@graph': page.jsonld }).replace(/</g, '\\u003c')}</script>`
    : '';
  return `<!doctype html>
<html lang="${page.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
${hreflang}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#F4F6F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0C100E" media="(prefers-color-scheme: dark)">
<meta name="apple-itunes-app" content="app-id=${APP_ID}">
<meta property="og:type" content="${page.type === 'landing' ? 'website' : 'article'}">
<meta property="og:site_name" content="${page.lang === 'ja' ? 'ツミアゲ' : 'Tsumiage'}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.ogAlt || page.title)}">
<meta property="og:locale" content="${ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="${rel(page.path, 'assets/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="icon" href="${rel(page.path, 'assets/icon-192.png')}" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${rel(page.path, 'assets/apple-touch-icon.png')}">
<link rel="sitemap" type="application/xml" href="${rel(page.path, 'sitemap.xml')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<link rel="stylesheet" href="${rel(page.path, 'assets/site.css')}?v=${ctx.version}">
<script>document.documentElement.classList.add('js')</script>
<script src="${rel(page.path, 'assets/site.js')}?v=${ctx.version}" defer></script>
${ld}
</head>
<body>
<a class="skip" href="#main">${UI[page.lang].skip}</a>
${header(page, alternates)}
<main id="main">
${page.main}
</main>
${footer(page, ctx.challengeLinks(page.lang))}
</body>
</html>
`;
}

/* ---------- components ---------- */

export function faq(items, { id = 'faq', heading, intro = '', band = false } = {}) {
  return `<section class="section${band ? ' band' : ''}" id="${id}" aria-labelledby="${id}-h">
<div class="narrow">
<div class="section-head reveal"><h2 id="${id}-h">${heading}</h2>${intro ? `<p>${intro}</p>` : ''}</div>
<div class="faq">
${items.map(([q, a]) => `<details><summary>${q}</summary><div class="answer"><p>${a}</p></div></details>`).join('\n')}
</div>
</div>
</section>`;
}

export function faqLd(items, url) {
  const strip = (s) => s.replace(/<[^>]+>/g, '');
  return {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  };
}

export function breadcrumbLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })),
  };
}

export function crumbs(page, items) {
  const li = items.map(([name, p], i) => i === items.length - 1
    ? `<li aria-current="page">${name}</li>`
    : `<li><a href="${rel(page.path, p)}">${name}</a></li>`).join('');
  return `<nav class="crumbs wrap" aria-label="${page.lang === 'ja' ? 'パンくずリスト' : page.lang === 'ko' ? '현재 위치' : 'Breadcrumb'}"><ol>${li}</ol></nav>`;
}

/** Decorative motif for a challenge card. kind: 'grid' | 'coins' | 'caps' */
export function motif({ kind = 'grid', cols, rows, on = () => false }) {
  const W = 320, H = 64;
  if (kind === 'caps') {
    const widths = [64, 92, 48, 120, 72, 56, 100, 80, 44, 110];
    let x = 0, y = 0, out = '', i = 0;
    for (const w of widths.concat(widths)) {
      if (x + w > W) { x = 0; y += 22; }
      if (y > H - 18) break;
      const cls = i % 3 !== 1 ? 'sq on' : 'sq';
      out += `<rect class="${cls}" style="--i:${i}" x="${x}" y="${y}" width="${w}" height="18" rx="9"/>`;
      x += w + 6; i++;
    }
    return `<svg class="motif" viewBox="0 0 ${W} ${y + 18}" preserveAspectRatio="xMinYMax meet" aria-hidden="true">${out}</svg>`;
  }
  const gap = kind === 'coins' ? 3 : 2.5;
  const size = Math.min((W - gap * (cols - 1)) / cols, (H - gap * (rows - 1)) / rows);
  let out = '';
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = +(c * (size + gap)).toFixed(2), y = +(r * (size + gap)).toFixed(2), s = +size.toFixed(2);
      const isOn = on(i, r, c);
      if (kind === 'coins') out += `<circle class="coin${isOn ? ' on' : ''}" style="--i:${i}" cx="${(x + s / 2).toFixed(2)}" cy="${(y + s / 2).toFixed(2)}" r="${(s / 2).toFixed(2)}"/>`;
      else out += `<rect class="sq${isOn ? ' on' : ''}" style="--i:${i}" x="${x}" y="${y}" width="${s}" height="${s}" rx="${Math.max(1.5, s * 0.22).toFixed(1)}"/>`;
      i++;
    }
  }
  // Trim the viewBox to the drawn rows so every motif sits on the same baseline just above the card title.
  const usedH = +(rows * size + (rows - 1) * gap).toFixed(2);
  return `<svg class="motif" viewBox="0 0 ${W} ${usedH}" preserveAspectRatio="xMinYMax meet" aria-hidden="true">${out}</svg>`;
}

/** Deterministic pseudo-random for motifs, so every build is identical. */
export function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/**
 * Interactive sheet. cfg: { id, n, step, coin, label: 'amount'|'index', cols, colsM, dense, coins, prefix, suffix,
 *   heading, intro, countFmt, resetLabel, resetConfirm, note, units: [[value,label]], unitLabel }
 */
export function tracker(cfg) {
  const buttons = [];
  for (let k = 1; k <= cfg.n; k++) {
    const shown = cfg.label === 'amount' ? (k * cfg.step).toLocaleString('en-US') : String(k);
    const aria = cfg.aria(k);
    buttons.push(`<button type="button" data-n="${k}"${cfg.label === 'amount' ? ' data-label="amount"' : ''} aria-pressed="false" aria-label="${esc(aria)}">${shown}</button>`);
  }
  const units = cfg.units
    ? `<fieldset class="seg" style="border:0;margin:0"><legend class="visually-hidden">${cfg.unitLabel}</legend>${cfg.units.map(([v, l]) => `<label><input type="radio" name="unit-${cfg.id}" value="${v}"${v === cfg.step ? ' checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>`
    : '';
  const total = cfg.coin ? cfg.coin * cfg.n : (cfg.n * (cfg.n + 1) / 2) * cfg.step;
  return `<div class="tracker reveal" data-tracker="${cfg.id}" data-step="${cfg.step}"${cfg.coin ? ` data-coin="${cfg.coin}"` : ''} data-prefix="${esc(cfg.prefix || '')}" data-suffix="${esc(cfg.suffix || '')}" data-count-fmt="${esc(cfg.countFmt)}" data-reset-confirm="${esc(cfg.resetConfirm)}">
<div class="tracker-top">
<p class="tracker-sum" aria-live="polite" style="margin:0"><b data-sum>${esc((cfg.prefix || '') + '0' + (cfg.suffix || ''))}</b><span data-count>${esc(cfg.countFmt.replace('{done}', 0).replace('{all}', cfg.n).replace('{total}', (cfg.prefix || '') + total.toLocaleString('en-US') + (cfg.suffix || '')))}</span></p>
${units}
</div>
<div class="tracker-bar" aria-hidden="true"><i></i></div>
<div class="sq-grid${cfg.dense ? ' dense' : ''}${cfg.coins ? ' coins' : ''}" style="--cols:${cfg.cols};--cols-m:${cfg.colsM}" role="group" aria-label="${esc(cfg.groupLabel)}">
${buttons.join('')}
</div>
<div class="tracker-foot"><span>${cfg.note}</span><button type="button" class="linkish" data-reset>${cfg.resetLabel}</button></div>
</div>`;
}

export function numTable({ caption, head, rows, numericFrom = 1 }) {
  return `<div class="table-scroll reveal"><table>
<caption>${caption}</caption>
<thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>${rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : i < numericFrom ? `<td class="text">${c}</td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;
}

export function printable(page, { pdfs, heading, text, preview, previewAlt }) {
  const btns = pdfs.map(([file, label], i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}" href="${rel(page.path, 'pdf/' + file)}" download>${ICON.download}${label}</a>`).join('');
  return `<section class="section-tight" id="pdf" aria-labelledby="pdf-h">
<div class="wrap">
<div class="printable reveal">
<img class="paper" src="${rel(page.path, 'pdf/' + preview)}" width="440" height="622" loading="lazy" decoding="async" alt="${esc(previewAlt)}">
<div><h2 id="pdf-h">${heading}</h2><p>${text}</p><div class="actions">${btns}</div></div>
</div>
</div>
</section>`;
}

export function appCta(page, { heading, text, campaign }) {
  return `<section class="section-tight" aria-labelledby="app-h">
<div class="wrap">
<div class="app-cta reveal">
<img src="${rel(page.path, 'assets/icon-192.png')}" width="76" height="76" alt="" loading="lazy">
<div><h2 id="app-h">${heading}</h2><p>${text}</p></div>
<a class="btn btn-primary" href="${esc(appUrl(campaign))}">${UI[page.lang].get}</a>
</div>
</div>
</section>`;
}

export function siblings(page, list, heading) {
  return `<section class="section-tight" aria-labelledby="sib-h">
<div class="wrap">
<h2 id="sib-h" style="font-size:clamp(21px,2.4vw,28px);margin-bottom:18px">${heading}</h2>
<ul class="siblings">${list.filter(([p]) => p !== page.path).map(([p, label, total]) => `<li><a href="${rel(page.path, p)}"><span>${label}</span><span class="num">${total}</span></a></li>`).join('')}</ul>
</div>
</section>`;
}

/** Hero figure: ring + three capsules (the app icon's shapes), total counts up. */
export function heroFigure({ prefix, total, caption }) {
  const C = 2 * Math.PI * 150;
  const burst = [
    [-150, -120, 'g'], [150, -110, 'gold'], [-170, 30, 'gold'], [175, 40, 'g'], [-110, 150, 'g'], [120, 150, 'gold'], [0, -185, 'g'], [-40, 175, 'gold'],
  ].map(([dx, dy, c], i) => i % 2
    ? `<rect x="194" y="194" width="22" height="10" rx="5" fill="${c === 'gold' ? '#F2C14E' : '#2DC88E'}" style="--dx:${dx}px;--dy:${dy}px"/>`
    : `<circle cx="200" cy="200" r="6" fill="${c === 'gold' ? '#F2C14E' : '#69E090'}" style="--dx:${dx}px;--dy:${dy}px"/>`).join('');
  return `<div class="stack-figure" role="img" aria-label="${esc(caption + ' ' + prefix + total.toLocaleString('en-US'))}">
<svg viewBox="0 0 400 400" aria-hidden="true">
<defs><linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#69E090"/><stop offset=".55" stop-color="#2DC88E"/><stop offset="1" stop-color="#11B6A5"/></linearGradient></defs>
<g class="ring-group">
<circle class="ring-track" cx="200" cy="200" r="150" fill="none" stroke-width="40"/>
<circle class="ring-fill" cx="200" cy="200" r="150" fill="none" stroke="url(#heroGrad)" stroke-width="40" stroke-linecap="round" pathLength="100" transform="rotate(-90 200 200)"/>
</g>
<g class="burst">${burst}</g>
<rect class="cap cap-1" x="128" y="226" width="144" height="38" rx="19" fill="url(#heroGrad)"/>
<rect class="cap cap-2" x="148" y="181" width="104" height="38" rx="19" fill="url(#heroGrad)"/>
<rect class="cap cap-3" x="166" y="136" width="68" height="38" rx="19" fill="url(#heroGrad)"/>
</svg>
<figcaption class="stack-caption"><span class="num" data-count-to="${total}" data-prefix="${esc(prefix)}">${prefix}${total.toLocaleString('en-US')}</span><small>${caption}</small></figcaption>
</div>`;
}
