// Serves the site locally, crawls every internal link, checks structure, and takes screenshots.
// Usage (from support/):  node tools/verify.mjs [--shots <dir>]
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_PROD = 'https://zhao73.github.io/tsumiage-support/';
const shotsArg = process.argv.indexOf('--shots');
const SHOTS = shotsArg > 0 ? process.argv[shotsArg + 1] : null;
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/pages.json'), 'utf8'));

const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
const port = await freePort();
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
const ORIGIN = `http://127.0.0.1:${port}/`;
const errors = [];
const fail = (m) => errors.push(m);

try {
  for (let i = 0; i < 50; i++) { try { await fetch(ORIGIN); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }

  /* ---- crawl ---- */
  const seen = new Map();
  const queue = pages.map((p) => p.path);
  const htmlOf = {};
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    const res = await fetch(ORIGIN + p);
    seen.set(p, res.status);
    if (res.status !== 200) { fail(`HTTP ${res.status}: /${p}`); continue; }
    const type = res.headers.get('content-type') || '';
    if (!type.includes('html')) { await res.arrayBuffer(); continue; }
    const html = await res.text();
    htmlOf[p] = html;
    for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      let u = m[1].replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|data:|#)/.test(u)) continue;
      u = u.split('#')[0].split('?')[0];
      const resolved = new URL(u, ORIGIN + p).pathname.slice(1);
      if (!seen.has(resolved)) queue.push(resolved);
    }
  }

  /* ---- per-page checks ---- */
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const SVG_VOID_OK = new Set(['circle', 'rect', 'path', 'stop', 'polyline', 'line', 'ellipse']);
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  let jsonldBlocks = 0;
  for (const pg of pages) {
    const html = htmlOf[pg.path];
    if (!html) { fail(`not crawled: ${pg.path}`); continue; }
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(`${pg.path}: ${h1} <h1>`);
    // tag balance (scripts/styles stripped, self-closing svg shapes allowed)
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
    const stack = [];
    for (const m of body.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g)) {
      const [, close, tagRaw, selfClose] = m; const tag = tagRaw.toLowerCase();
      if (tag === '!doctype' || VOID.has(tag)) continue;
      if (selfClose) { if (!SVG_VOID_OK.has(tag) && !['svg', 'polyline'].includes(tag)) fail(`${pg.path}: self-closing <${tag}/>`); continue; }
      if (!close) stack.push(tag);
      else { const top = stack.pop(); if (top !== tag) { fail(`${pg.path}: </${tag}> closes <${top}>`); break; } }
    }
    if (stack.length) fail(`${pg.path}: unclosed ${stack.join(',')}`);
    // ids unique
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) fail(`${pg.path}: duplicate ids ${[...new Set(dup)].join(',')}`);
    // JSON-LD parses
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { const j = JSON.parse(m[1]); jsonldBlocks++; if (JSON.stringify(j).includes('aggregateRating')) fail(`${pg.path}: aggregateRating present`); } catch (e) { fail(`${pg.path}: JSON-LD parse error ${e.message}`); }
    }
    // canonical + sitemap
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canon !== BASE_PROD + pg.path) fail(`${pg.path}: canonical ${canon}`);
    if (!sitemap.includes(`<loc>${BASE_PROD + pg.path}</loc>`)) fail(`${pg.path}: missing from sitemap`);
    // hreflang reciprocal
    const alts = [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    for (const [lang, href] of alts) {
      if (lang === 'x-default') continue;
      const other = htmlOf[href.replace(BASE_PROD, '')];
      if (!other) { fail(`${pg.path}: hreflang ${lang} → ${href} not a page`); continue; }
      if (!other.includes(`hreflang="${pg.lang}" href="${BASE_PROD + pg.path}"`)) fail(`${pg.path}: hreflang ${lang} not reciprocal`);
    }
    if (!/<meta name="apple-itunes-app" content="app-id=6821537539">/.test(html)) fail(`${pg.path}: no smart banner`);
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!og || !fs.existsSync(path.join(ROOT, og.replace(BASE_PROD, '')))) fail(`${pg.path}: og image missing ${og}`);
    if (new RegExp(Buffer.from('TWlmYW4=', 'base64').toString(), 'i').test(html)) fail(`${pg.path}: private font referenced`); // owner's private typeface must never ship here
  }
  const sitemapCount = (sitemap.match(/<loc>/g) || []).length;
  console.log(`crawled ${seen.size} URLs (${[...seen.values()].filter((s) => s === 200).length} × 200), pages ${pages.length}, sitemap ${sitemapCount}, JSON-LD blocks ${jsonldBlocks}`);
  for (const f of ['sitemap.xml', 'llms.txt', 'llms-full.txt', 'robots.txt', 'icon.png', 'style.css']) {
    const r = await fetch(ORIGIN + f); if (r.status !== 200) fail(`HTTP ${r.status}: /${f}`); await r.arrayBuffer();
  }

  /* ---- browser checks + screenshots ---- */
  const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
  try {
    const iphone = devices['iPhone 15'];
    const targets = SHOTS ? ['', '52shuu/', '365nichi/', '500en/', 'tsumori/', '100futo/', 'support.html', 'privacy.html', 'en/', 'en/100-envelope-challenge/', 'ko/', 'ko/52ju-jeogeum/'] : [];
    const consoleErrors = [];
    for (const scheme of ['light', 'dark']) {
      for (const [label, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ['phone', { ...iphone, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }]]) {
        const ctx = await browser.newContext({ ...opts, colorScheme: scheme, reducedMotion: 'no-preference' });
        for (const p of (SHOTS ? targets : pages.map((x) => x.path))) {
          const page = await ctx.newPage();
          page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${p} [${label}/${scheme}]: ${m.text()}`); });
          page.on('pageerror', (e) => consoleErrors.push(`${p}: ${e.message}`));
          await page.goto(ORIGIN + p, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          if (overflow > 1) fail(`${p} [${label}]: horizontal overflow ${overflow}px`);
          if (SHOTS) {
            // Scroll through like a reader so one-shot reveals have fired, then back to the top.
            // (wheel input: headless Chromium skips IntersectionObserver callbacks for scripted scrollTo loops)
            const H = await page.evaluate(() => document.body.scrollHeight);
            await page.mouse.move(100, 300);
            for (let y = 0; y < H; y += 450) { await page.mouse.wheel(0, 450); await page.waitForTimeout(90); }
            const hidden = await page.evaluate(() => document.querySelectorAll('.reveal:not(.in)').length);
            if (hidden) fail(`${p} [${label}/${scheme}]: ${hidden} section(s) never revealed after scrolling`);
            await page.evaluate(() => scrollTo(0, 0));
            await page.waitForTimeout(p === '' || p === 'en/' || p === 'ko/' ? 3800 : 900);
            const name = `${(p || 'index').replace(/\/$/, '').replace(/[/.]/g, '_') || 'index'}-${label}-${scheme}.png`;
            await page.screenshot({ path: path.join(SHOTS, name), fullPage: true, timeout: 90000 });
          }
          await page.close();
        }
        await ctx.close();
      }
      if (!SHOTS) break; // structure checks need one pass only
    }
    if (consoleErrors.length) fail('console errors:\n  ' + [...new Set(consoleErrors)].join('\n  '));

    // tracker behaviour: tick two squares on 52shuu and check the total
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(ORIGIN + '52shuu/', { waitUntil: 'networkidle' });
    await page.click('[data-tracker="52shuu"] button[data-n="1"]');
    await page.click('[data-tracker="52shuu"] button[data-n="52"]');
    const sum = await page.textContent('[data-tracker="52shuu"] [data-sum]');
    if (sum !== '5,300円') fail(`tracker sum ${sum} ≠ 5,300円`);
    await page.reload({ waitUntil: 'networkidle' });
    const sum2 = await page.textContent('[data-tracker="52shuu"] [data-sum]');
    if (sum2 !== '5,300円') fail(`tracker not restored after reload: ${sum2}`);
    await page.goto(ORIGIN + '100nichi/', { waitUntil: 'networkidle' });
    await page.click('[data-tracker="100nichi"] button[data-n="100"]');
    await page.check('input[name="unit-100nichi"][value="100"]', { force: true });
    const sum3 = await page.textContent('[data-tracker="100nichi"] [data-sum]');
    if (sum3 !== '10,000円') fail(`100nichi unit switch sum ${sum3} ≠ 10,000円`);
    console.log(`tracker: 52shuu ${sum} → after reload ${sum2}; 100nichi ×100 → ${sum3}`);
    await page.close();
    await ctx.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill('SIGTERM');
}

if (errors.length) { console.error(`\n${errors.length} problem(s):\n- ` + errors.join('\n- ')); process.exit(1); }
console.log('verify: all checks passed');
