// Renders icons, OG images (1200×630) and printable A4 PDFs (+ preview PNGs) with Playwright's bundled Chromium.
// Usage (from support/):  node tools/render.mjs [icons|og|pdf ...]   (no argument = everything)
// Needs: `npm install` in tools/, `npx playwright install chromium-headless-shell`, sips (macOS) and pdftoppm (poppler).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { verifyAll, tri } from './math.mjs';
import { BASE } from './lib.mjs';

verifyAll();
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_ICON = path.resolve(ROOT, '../Tsumiage/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon.png');
const only = new Set(process.argv.slice(2));
const want = (k) => only.size === 0 || only.has(k);
const en = (n) => n.toLocaleString('en-US');

const FONTS = {
  ja: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=block">',
  en: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=block">',
  ko: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=block">',
};
const FAMILY = {
  ja: '"Zen Kaku Gothic New", sans-serif',
  en: '"Manrope", sans-serif',
  ko: '"Pretendard", sans-serif',
};

/* ---------------- icons ---------------- */
function icons() {
  const out = path.join(ROOT, 'assets');
  fs.mkdirSync(out, { recursive: true });
  for (const [name, size] of [['favicon-32.png', 32], ['icon-68.png', 68], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    execFileSync('sips', ['-z', String(size), String(size), SRC_ICON, '--out', path.join(out, name)], { stdio: 'ignore' });
  }
  console.log('icons ok');
}

/* ---------------- OG images ---------------- */
const iconData = () => 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'assets/icon-512.png')).toString('base64');

function ogHTML({ lang, headline, sub, number, numberLabel, chips = [], url, size }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">${FONTS[lang]}<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:${FAMILY[lang]};background:#F4F6F3;color:#101412;display:grid;grid-template-columns:minmax(0,1fr) 400px;-webkit-font-smoothing:antialiased}
.l{position:relative;padding:60px 56px 78px 72px;min-width:0;display:flex;flex-direction:column;background-image:linear-gradient(rgb(16 20 18/.05) 1px,transparent 1px),linear-gradient(90deg,rgb(16 20 18/.05) 1px,transparent 1px);background-size:36px 36px}
.brand{display:flex;align-items:center;gap:14px;font-weight:700;font-size:26px;letter-spacing:.04em}
.brand img{width:48px;height:48px;border-radius:12px}
h1{font-size:${size || ((lang === 'en' ? headline.length > 26 : headline.length > 12) ? 54 : 64)}px;line-height:1.2;font-weight:900;margin-top:38px;letter-spacing:${lang === 'en' ? '-.03em' : lang === 'ko' ? '-.02em' : '.01em'};${lang === 'ja' ? 'word-break:auto-phrase;' : 'word-break:keep-all;'}}
.sub{font-size:25px;color:rgb(16 20 18/.66);margin-top:18px;line-height:1.5;font-weight:500}
.num{font-family:Manrope,sans-serif;font-weight:800;font-size:92px;letter-spacing:-.04em;line-height:1;margin-top:auto;background:linear-gradient(135deg,#1FA86B,#0E8F7F);-webkit-background-clip:text;color:transparent;font-variant-numeric:tabular-nums}
.numl{font-size:22px;color:rgb(16 20 18/.66);margin-top:10px;font-weight:500}
.chips{display:flex;gap:12px;margin-top:auto}
.chips span{font-size:24px;font-weight:700;background:#fff;border-radius:14px;padding:10px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 18px rgb(16 20 18/.06)}
.chips span::before{content:"";width:22px;height:10px;border-radius:5px;background:linear-gradient(135deg,#69E090,#2DC88E,#11B6A5)}
.url{position:absolute;left:72px;bottom:26px;font-family:Manrope,sans-serif;font-size:17px;color:rgb(16 20 18/.46);font-weight:600}
.r{position:relative;background:linear-gradient(135deg,#69E090,#2DC88E 55%,#11B6A5);display:grid;place-items:center;overflow:hidden}
.r svg{position:absolute;width:640px;height:640px;right:-150px;bottom:-170px;opacity:.22}
.r img{position:relative;width:260px;height:260px;border-radius:58px;box-shadow:0 30px 60px rgb(0 60 40/.35),0 2px 0 rgb(255 255 255/.4) inset;transform:rotate(-6deg)}
</style></head><body>
<div class="l">
<div class="brand"><img src="${iconData()}" alt="">${lang === 'ja' ? 'ツミアゲ' : 'Tsumiage'}</div>
<h1>${headline}</h1>
${sub ? `<p class="sub">${sub}</p>` : ''}
${number ? `<p class="num">${number}</p><p class="numl">${numberLabel}</p>` : ''}
${chips.length ? `<div class="chips">${chips.map((c) => `<span>${c}</span>`).join('')}</div>` : ''}
<p class="url">${url}</p>
</div>
<div class="r"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="150" fill="none" stroke="#fff" stroke-width="40"/></svg><img src="${iconData()}" alt=""></div>
</body></html>`;
}

const OG = [
  ['ja.png', { lang: 'ja', headline: '貯金を、<br>ひとマスずつ積み上げる。', size: 52, sub: '貯金チャレンジと目標貯金の iPhone アプリ', chips: ['広告なし', '買い切り', '登録なし'], url: 'zhao73.github.io/tsumiage-support' }],
  ['en.png', { lang: 'en', headline: 'Save it up,<br>one square at a time.', sub: 'Savings challenges and goals for iPhone', chips: ['No ads', 'One-time Pro', 'No sign-up'], url: 'zhao73.github.io/tsumiage-support/en' }],
  ['ko.png', { lang: 'ko', headline: '저축을 한 칸씩<br>쌓아 올려요.', sub: '저축 챌린지와 목표 저축 iPhone 앱', chips: ['광고 없음', '1회 구매', '가입 없음'], url: 'zhao73.github.io/tsumiage-support/ko' }],
  ['52shuu.png', { lang: 'ja', headline: '52週貯金のやり方と表', sub: '1週目100円、毎週100円ずつ増やす', number: '137,800円', numberLabel: '1年（52週）の合計（印刷用A4の表つき）', url: 'zhao73.github.io/tsumiage-support/52shuu' }],
  ['365nichi.png', { lang: 'ja', headline: '365日貯金のやり方と表', sub: '1円〜365円のマスを1日1つずつ', number: '66,795円', numberLabel: '365マスの合計（印刷用A4の表つき）', url: 'zhao73.github.io/tsumiage-support/365nichi' }],
  ['100nichi.png', { lang: 'ja', headline: '100日貯金のやり方と表', sub: '1円から100円まで、100日で100マス', number: '5,050円', numberLabel: '1マス1円の合計（印刷用A4の表つき）', url: 'zhao73.github.io/tsumiage-support/100nichi' }],
  ['500en.png', { lang: 'ja', headline: '500円玉貯金はいくら貯まる？', sub: '手元に来た500円玉を使わずに貯める', number: '200枚で10万円', numberLabel: '20枚で1万円（印刷用A4の表つき）', url: 'zhao73.github.io/tsumiage-support/500en' }],
  ['100futo.png', { lang: 'ja', headline: '100封筒チャレンジ（日本円版）', sub: '番号 × 100円を封筒に入れていく', number: '505,000円', numberLabel: '100封筒の合計（印刷用A4の表つき）', url: 'zhao73.github.io/tsumiage-support/100futo' }],
  ['tsumori.png', { lang: 'ja', headline: 'つもり貯金のやり方とリスト例', sub: '買ったつもりで浮いたお金を貯める', number: '年78,000円', numberLabel: '500円のコーヒーを週3回がまんした場合', url: 'zhao73.github.io/tsumiage-support/tsumori' }],
  ['en-52-week.png', { lang: 'en', headline: '52-week money challenge', sub: 'Save $1 more every week', number: '$1,378', numberLabel: 'in 52 weeks, with a free printable A4 chart', url: 'zhao73.github.io/tsumiage-support/en/52-week-money-challenge' }],
  ['en-100-envelope.png', { lang: 'en', headline: '100 envelope challenge', sub: 'Envelope n holds $n', number: '$5,050', numberLabel: 'all 100 envelopes, with a free printable A4 chart', url: 'zhao73.github.io/tsumiage-support/en/100-envelope-challenge' }],
  ['ko-52ju.png', { lang: 'ko', headline: '52주 저금 챌린지 표', sub: '매주 1,000원씩 늘려 모으기', number: '1,378,000원', numberLabel: '1년(52주) 합계 (인쇄용 A4 표 포함)', url: 'zhao73.github.io/tsumiage-support/ko/52ju-jeogeum' }],
  ['ko-100bongtu.png', { lang: 'ko', headline: '100봉투 챌린지 표', sub: '번호 × 1,000원을 봉투에', number: '5,050,000원', numberLabel: '100봉투 합계 (인쇄용 A4 표 포함)', url: 'zhao73.github.io/tsumiage-support/ko/100bongtu' }],
];

/* ---------------- printable sheets ---------------- */
const MARK = '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="25" fill="none" stroke="#DDE5DF" stroke-width="7"/><circle cx="32" cy="32" r="25" fill="none" stroke="#17B07A" stroke-width="7" stroke-linecap="round" stroke-dasharray="118 200" transform="rotate(-90 32 32)"/><rect x="21" y="36" width="22" height="6" rx="3" fill="#17B07A"/><rect x="24" y="28" width="16" height="6" rx="3" fill="#17B07A"/><rect x="27" y="20" width="10" height="6" rx="3" fill="#17B07A"/></svg>';

function sheetHTML(s) {
  const cells = [];
  for (let k = 1; k <= s.cols * s.rows; k++) {
    if (k > s.n) { cells.push('<div class="cell empty"></div>'); if (s.sepEvery && k % s.cols !== 0 && k % s.sepEvery === 0) cells.push('<div class="spacer"></div>'); continue; }
    const { main, sub, corner } = s.label(k);
    const flap = s.kind === 'env' ? '<svg class="flap" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,0 50,40 100,0" fill="none" stroke="#9AA39E" stroke-width=".8" vector-effect="non-scaling-stroke"/></svg>' : '';
    cells.push(`<div class="cell ${s.kind}">${flap}${corner ? `<i>${corner}</i>` : ''}<b>${main}</b>${sub ? `<small>${sub}</small>` : ''}</div>`);
    // A narrow spacer column every `sepEvery` squares makes long rows easy to count.
    if (s.sepEvery && k % s.cols !== 0 && k % s.sepEvery === 0) cells.push('<div class="spacer"></div>');
    if (s.rowEnd && k % s.cols === 0) cells.push(`<div class="rowend">${s.rowEnd(k / s.cols)}</div>`);
  }
  const groups = s.sepEvery ? Array.from({ length: s.cols / s.sepEvery }, () => `repeat(${s.sepEvery}, 1fr)`).join(' 1.2mm ') : `repeat(${s.cols}, 1fr)`;
  const gridCols = s.rowEnd ? `${groups} 21mm` : groups;
  return `<!doctype html><html lang="${s.lang}"><head><meta charset="utf-8">${FONTS[s.lang]}<style>
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0}
html,body{width:210mm;height:297mm}
body{font-family:${FAMILY[s.lang]};color:#141917;padding:13mm 13mm 10mm;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:8mm}
h1{font-size:${s.titleSize || 22}pt;font-weight:900;letter-spacing:${s.lang === 'ja' ? '.02em' : '-.01em'};line-height:1.2}
.rule{font-size:9.5pt;color:#4A524D;margin-top:2.2mm;line-height:1.55;max-width:150mm}
.mark{width:15mm;height:15mm;flex:none}
.fields{display:flex;gap:6mm;margin:5mm 0 4.5mm;align-items:stretch}
.field{flex:1;border:.35mm solid #141917;border-radius:2.5mm;padding:1.6mm 3mm;font-size:8pt;color:#4A524D;min-height:12mm}
.field.total{flex:0 0 auto;min-width:52mm;border-color:#17B07A;background:#F1FAF5}
.field.total b{display:block;font-family:Manrope,${FAMILY[s.lang]};font-size:17pt;color:#0E7F57;font-weight:800;letter-spacing:-.02em;line-height:1.15;margin-top:.6mm;font-variant-numeric:tabular-nums}
.extra{font-size:8.5pt;color:#4A524D;margin:-1.5mm 0 4mm;line-height:1.6}
.extra .opt{display:inline-flex;align-items:center;gap:1.4mm;margin-right:5mm;color:#141917;font-weight:700}
.extra .opt::before{content:"";width:3.4mm;height:3.4mm;border:.3mm solid #141917;border-radius:50%}
.grid{flex:1;display:grid;grid-template-columns:${gridCols};grid-auto-rows:1fr;gap:${s.gap || 1.6}mm;min-height:0}
.cell{position:relative;border:.3mm solid #2A322D;border-radius:${s.radius ?? 1.8}mm;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;font-family:Manrope,${FAMILY[s.lang]};font-variant-numeric:tabular-nums}
.cell b{font-size:${s.mainSize || 11}pt;font-weight:700;letter-spacing:-.02em}
.cell small{font-size:${s.subSize || 6.5}pt;color:#5A635E;margin-top:${s.subGap ?? 1}mm;font-family:${FAMILY[s.lang]};font-weight:500}
.cell i{position:absolute;left:1.3mm;top:1mm;font-style:normal;font-size:${s.cornerSize || 6}pt;color:#7A837E;font-weight:600;font-family:${FAMILY[s.lang]}}
.spacer{}
.cell.empty{border:0}
.cell.coin{border-radius:50%;aspect-ratio:1;height:100%;margin:auto;border-color:#8C7A3A}
.cell.coin b{font-size:${s.mainSize || 7}pt;color:#5A4E22}
.cell.env{border-radius:1mm;padding-top:${s.envPad || 2.6}mm}
.cell.env .flap{position:absolute;left:0;top:0;width:100%;height:${s.flap || 40}%}
.rowend{display:flex;align-items:center;justify-content:flex-end;font-family:Manrope,sans-serif;font-size:7.5pt;font-weight:700;color:#0E7F57;font-variant-numeric:tabular-nums}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:4.5mm;font-size:7.5pt;color:#6A736E;font-family:Manrope,${FAMILY[s.lang]}}
.foot b{color:#141917;font-weight:700}
${s.css || ''}
</style></head><body>
<div class="head"><div><h1>${s.title}</h1><p class="rule">${s.rule}</p></div>${MARK}</div>
<div class="fields">${s.fields.map((f) => `<div class="field">${f}</div>`).join('')}<div class="field total">${s.totalLabel}<b>${s.total}</b></div></div>
${s.extra ? `<div class="extra">${s.extra}</div>` : ''}
${s.body || `<div class="grid">${cells.join('')}</div>`}
<div class="foot"><span><b>ツミアゲ — tsumiage</b></span><span>${BASE}${s.pathOnSite}</span></div>
</body></html>`;
}

const JA_FIELDS = ['はじめた日<br>　　　年　　月　　日', '目標・メモ'];
const EN_FIELDS = ['Start date', 'Goal / note'];
const KO_FIELDS = ['시작일<br>　　년　　월　　일', '목표·메모'];

const SHEETS = [
  ['52shuu-chokin-hyo', {
    lang: 'ja', pathOnSite: '52shuu/', n: 52, cols: 8, rows: 7, kind: 'sq', mainSize: 15, subSize: 7.5,
    title: '52週貯金の表', rule: '1週目に100円、毎週100円ずつ増やして貯めます。順番は自由。貯めたマスに印をつけ、52マス全部埋まれば完了です。',
    fields: JA_FIELDS, totalLabel: '52マスの合計', total: '137,800円',
    label: (k) => ({ corner: `${k}週`, main: en(k * 100), sub: '円' }),
  }],
  ['365nichi-chokin-hyo', {
    lang: 'ja', pathOnSite: '365nichi/', n: 365, cols: 20, rows: 19, sepEvery: 10, kind: 'sq', mainSize: 8.5, gap: 1, radius: 1.2,
    title: '365日貯金の表', rule: 'マスの数字がそのまま金額（円）です。1日1マス、好きな数字を選んで貯め、印をつけます。365マスで完了です。',
    fields: JA_FIELDS, totalLabel: '365マスの合計', total: '66,795円',
    label: (k) => ({ main: String(k) }),
  }],
  ['100nichi-chokin-hyo', {
    lang: 'ja', pathOnSite: '100nichi/', n: 100, cols: 10, rows: 10, kind: 'sq', mainSize: 13,
    title: '100日貯金の表', rule: 'マスの数字 × 1マスの金額を、1日1マス貯めます。順番は自由。100マス全部埋まれば完了です。',
    fields: JA_FIELDS, totalLabel: '100マスの合計（1マス1円）', total: '5,050円',
    extra: '1マスの金額に○：<span class="opt">1円（合計5,050円）</span><span class="opt">10円（合計50,500円）</span><span class="opt">100円（合計505,000円）</span>',
    label: (k) => ({ main: String(k) }),
  }],
  ['500en-chokin-hyo', {
    lang: 'ja', pathOnSite: '500en/', n: 200, cols: 10, rows: 20, kind: 'coin', mainSize: 7, gap: 1.1,
    title: '500円玉貯金の表（200枚）', rule: '500円玉を1枚貯めるごとに、丸を1つ塗ります。行の右はその行までの合計。200枚で10万円です。',
    fields: JA_FIELDS, totalLabel: '200枚の合計', total: '100,000円',
    label: (k) => ({ main: String(k) }),
    rowEnd: (r) => `${en(r * 5000)}円`,
  }],
  ['100futo-challenge-hyo', {
    lang: 'ja', pathOnSite: '100futo/', n: 100, cols: 10, rows: 10, kind: 'env', mainSize: 12.5, subSize: 6.8, gap: 1.8,
    title: '100封筒チャレンジの表（日本円版）', titleSize: 20, rule: '1〜100の封筒から1つ選び、「番号 × 100円」を入れて印をつけます。くじ引きのように選ぶのが元のやり方です。',
    fields: JA_FIELDS, totalLabel: '100封筒の合計', total: '505,000円',
    label: (k) => ({ main: String(k), sub: `${en(k * 100)}円` }),
  }],
  ['tsumori-chokin-list', {
    lang: 'ja', pathOnSite: 'tsumori/',
    title: 'つもり貯金の記録シート', rule: '上にがまんすることと金額を決めておき、がまんできたら下に記録します。週末などに合計を貯金箱や口座へ移しましょう。',
    fields: JA_FIELDS, totalLabel: 'このシートの合計', total: '　　　　　円',
    body: (() => {
      const mine = ['例）カフェのコーヒー', '例）コンビニのおやつ', '', '', '', '', '', ''].map((t, i) => `<tr><td class="w">${t ? `<span class="ex">${t}</span>` : ''}</td><td class="a">${i === 0 ? '<span class="ex">500円</span>' : i === 1 ? '<span class="ex">300円</span>' : '円'}</td></tr>`).join('');
      const log = Array.from({ length: 17 }, () => '<tr><td class="d">／</td><td></td><td class="a">円</td><td class="a">円</td></tr>').join('');
      return `<h2 class="t">わたしのがまんリスト</h2><table class="list"><thead><tr><th>がまんすること</th><th class="a">金額</th></tr></thead><tbody>${mine}</tbody></table>
<h2 class="t">記録</h2><table class="log"><thead><tr><th class="d">日付</th><th>がまんしたこと</th><th class="a">金額</th><th class="a">合計</th></tr></thead><tbody>${log}</tbody></table>`;
    })(),
    css: `.t{font-size:10.5pt;font-weight:700;margin:1mm 0 2mm;color:#0E7F57}
table{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:5mm}
th{font-size:7.5pt;color:#5A635E;font-weight:700;text-align:left;padding:0 2.5mm 1.2mm;border-bottom:.35mm solid #141917}
td{border-bottom:.25mm solid #9AA39E;height:7.4mm;padding:0 2.5mm;vertical-align:bottom}
.list td{height:8.2mm}
.a{text-align:right;width:30mm;color:#7A837E}
.d{width:22mm;text-align:center;color:#9AA39E}
.ex{color:#8A938E}
.log{flex:1}`,
  }],
  ['52-week-money-challenge', {
    lang: 'en', pathOnSite: 'en/52-week-money-challenge/', n: 52, cols: 8, rows: 7, kind: 'sq', mainSize: 16,
    title: '52-week money challenge', rule: 'Save $1 in week 1 and $1 more every week. Any order is fine. Tick each square you save; all 52 squares make $1,378.',
    fields: EN_FIELDS, totalLabel: 'All 52 squares', total: '$1,378',
    label: (k) => ({ corner: `Week ${k}`, main: `$${k}` }),
  }],
  ['52-week-money-challenge-blank', {
    lang: 'en', pathOnSite: 'en/52-week-money-challenge/', n: 52, cols: 8, rows: 7, kind: 'sq', mainSize: 16,
    title: '52-week savings challenge', rule: 'Pick your step (for example 1, 5 or 10 in your currency). Each week, save the square’s number × your step and tick it. Any order is fine.',
    fields: ['Start date', 'My step: ______'], totalLabel: 'All 52 squares', total: '1,378 × step',
    label: (k) => ({ corner: `Week ${k}`, main: String(k), sub: '× step' }),
  }],
  ['100-envelope-challenge', {
    lang: 'en', pathOnSite: 'en/100-envelope-challenge/', n: 100, cols: 10, rows: 10, kind: 'env', mainSize: 13.5, gap: 1.8,
    title: '100 envelope challenge', rule: 'Pick one envelope at a time (shuffle and draw, or choose), put in its number in dollars, and tick it. All 100 make $5,050.',
    fields: EN_FIELDS, totalLabel: 'All 100 envelopes', total: '$5,050',
    label: (k) => ({ main: `$${k}` }),
  }],
  ['100-envelope-challenge-blank', {
    lang: 'en', pathOnSite: 'en/100-envelope-challenge/', n: 100, cols: 10, rows: 10, kind: 'env', mainSize: 13.5, gap: 1.8,
    title: '100 envelope savings challenge', rule: 'Pick your unit (for example 1 or 0.5 in your currency). Put the envelope’s number × your unit in it and tick it. Any order is fine.',
    fields: ['Start date', 'My unit: ______'], totalLabel: 'All 100 envelopes', total: '5,050 × unit',
    label: (k) => ({ main: String(k) }),
  }],
  ['52ju-jeogeum', {
    lang: 'ko', pathOnSite: 'ko/52ju-jeogeum/', n: 52, cols: 8, rows: 7, kind: 'sq', mainSize: 14, subSize: 7.5,
    title: '52주 저금 챌린지 표', rule: '1주 차에 1,000원, 매주 1,000원씩 늘려 모아요. 순서는 자유예요. 모은 칸에 체크하고, 52칸을 다 채우면 끝이에요.',
    fields: KO_FIELDS, totalLabel: '52칸 합계', total: '1,378,000원',
    label: (k) => ({ corner: `${k}주`, main: en(k * 1000), sub: '원' }),
  }],
  ['100bongtu-challenge', {
    lang: 'ko', pathOnSite: 'ko/100bongtu/', n: 100, cols: 10, rows: 10, kind: 'env', mainSize: 12.5, subSize: 6.5, gap: 1.8,
    title: '100봉투 챌린지 표', rule: '1~100번 봉투 중 하나를 골라 "번호 × 1,000원"을 넣고 체크해요. 섞어서 뽑는 게 원래 방식이에요.',
    fields: KO_FIELDS, totalLabel: '100봉투 합계', total: '5,050,000원',
    label: (k) => ({ main: String(k), sub: `${en(k * 1000)}원` }),
  }],
];

// The totals printed on each sheet must match the maths.
const expectTotals = { '52shuu-chokin-hyo': tri(52) * 100, '365nichi-chokin-hyo': tri(365), '100nichi-chokin-hyo': tri(100), '500en-chokin-hyo': 200 * 500, '100futo-challenge-hyo': tri(100) * 100, '52-week-money-challenge': tri(52), '100-envelope-challenge': tri(100), '52ju-jeogeum': tri(52) * 1000, '100bongtu-challenge': tri(100) * 1000 };
for (const [name, s] of SHEETS) {
  if (expectTotals[name] !== undefined) {
    const printed = Number(s.total.replace(/[^0-9]/g, ''));
    if (printed !== expectTotals[name]) throw new Error(`${name}: printed total ${s.total} ≠ ${expectTotals[name]}`);
  }
}

async function main() {
  if (want('icons')) icons();
  if (!want('og') && !want('pdf')) return;
  const browser = await chromium.launch({ headless: true, args: ['--mute-audio'] });
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/159.0 Safari/537.36' });
    if (want('og')) {
      fs.mkdirSync(path.join(ROOT, 'assets/og'), { recursive: true });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1200, height: 630 });
      for (const [file, spec] of OG) {
        await page.setContent(ogHTML(spec), { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(ROOT, 'assets/og', file), type: 'png' });
      }
      await page.close();
      console.log(`og: ${OG.length} images`);
    }
    if (want('pdf')) {
      fs.mkdirSync(path.join(ROOT, 'pdf'), { recursive: true });
      const page = await context.newPage();
      for (const [name, spec] of SHEETS) {
        await page.setContent(sheetHTML(spec), { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const out = path.join(ROOT, 'pdf', name + '.pdf');
        await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
        // Preview for the page (440×622 = 220 css px at 2×). Blank variants share the main preview.
        if (!name.endsWith('-blank')) {
          execFileSync('pdftoppm', ['-png', '-f', '1', '-l', '1', '-scale-to-x', '440', '-scale-to-y', '622', '-singlefile', out, path.join(ROOT, 'pdf', name)]);
        }
      }
      await page.close();
      console.log(`pdf: ${SHEETS.length} sheets`);
    }
    await context.close();
  } finally {
    await browser.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
