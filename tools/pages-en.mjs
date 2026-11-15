// English pages.
import { esc, appUrl, ICON, faq, faqLd, abs, motif, seeded, heroFigure, EMAIL, crumbs, breadcrumbLd } from './lib.mjs';
import { challengePage } from './challenge.mjs';
import { cumulative, cumulativeReverse } from './math.mjs';
import { shotsSection } from './pages-ja.mjs';

const fmt = (n) => n.toLocaleString('en-US');
const usd = (n) => '$' + fmt(n);

export const SIBLINGS_EN = [
  ['en/52-week-money-challenge/', '52-week money challenge', '$1,378'],
  ['en/100-envelope-challenge/', '100 envelope challenge', '$5,050'],
];

const COMMON = {
  lang: 'en',
  crumbHome: 'Tsumiage',
  factsHeading: 'Key facts',
  pdfButton: 'Download the chart (PDF)',
  appButton: 'Track it in the app',
  faqHeading: 'Questions',
  siblingsHeading: 'Other savings challenges',
  siblings: SIBLINGS_EN,
};

const trackerCommon = {
  prefix: '$',
  countFmt: '{done} of {all} squares ({total} in total)',
  resetLabel: 'Clear all ticks',
  resetConfirm: 'Clear every tick on this chart?',
  note: 'Tap a square to tick it. Ticks are saved in this browser only.',
};

function page52() {
  const weeks = [1, 4, 13, 26, 39, 52];
  return challengePage({
    ...COMMON,
    group: 'c52', campaign: 'en-52week',
    path: 'en/52-week-money-challenge/',
    title: '52-Week Money Challenge Printable Chart (Free PDF) | Tsumiage',
    ogTitle: '52-Week Money Challenge: printable chart',
    description: 'The 52-week money challenge: save $1 in week 1 and add $1 every week. Week 52 is $52 and the total is $1,378. How it works, the maths, four ways to play and a free printable A4 chart (PDF).',
    og: 'assets/og/en-52-week.png', ogAlt: '52-week money challenge chart. $1,378 in a year',
    h1: '52-week money challenge: how it works, plus a printable chart',
    lead: 'Save a little more each week for a year. Tick a square every time you save and you can see how far you have left at a glance.',
    total: '$1,378', totalLabel: 'saved in 52 weeks at $1 steps',
    crumbName: '52-week money challenge',
    facts: [
      'The 52-week money challenge: save <strong>$1</strong> in week 1, $2 in week 2, and keep adding <strong>$1 a week</strong>.',
      'Week 52 is <strong>$52</strong>. The total after 52 weeks is <strong>$1,378</strong>.',
      'The maths: $1 × (1 + 2 + … + 52) = $1 × 1,378 = <strong>$1,378</strong>.',
      'Scale it up: $5 steps give <strong>$6,890</strong>, $10 steps give <strong>$13,780</strong>.',
      'Reverse order or any order you like: the total is still $1,378.',
    ],
    howHeading: 'How the 52-week challenge works',
    how: [
      ['Get a chart.', 'Use 52 squares from $1 to $52 — print the PDF below or pick the 52-week challenge in the app.'],
      ['Pick one square each week.', 'Put that amount in a jar or a savings account.'],
      ['Tick the square.', 'Each tick adds to your running total.'],
      ['Finish all 52.', 'At $1 steps you have $1,378.'],
    ],
    formula: 'Total = $1 × (1 + 2 + … + 52) = $1 × 52 × 53 ÷ 2 = $1,378',
    sheetHeading: '52-week chart you can tick',
    sheetIntro: 'Each square is one week. Choose the step size; the total updates as you tap.',
    tracker: {
      ...trackerCommon, id: 'en-52week', n: 52, step: 1, label: 'amount', cols: 13, colsM: 7,
      units: [[1, '$1'], [5, '$5'], [10, '$10']], unitLabel: 'Step size',
      groupLabel: '52 weekly squares', aria: (k) => `Week ${k}`,
    },
    mathHeading: 'How much will you save? Quick table',
    mathIntro: 'In order, the start is easy and the weeks get bigger toward the end. In reverse, it is the other way round.',
    table: {
      caption: 'At $1 steps',
      head: ['After', 'In order: that week', 'In order: total', 'Reverse: that week', 'Reverse: total'],
      rows: weeks.map((w) => [`week ${w}`, usd(w), usd(cumulative(w, 1)), usd(53 - w), usd(cumulativeReverse(w, 52, 1))]),
    },
    mathNote: 'Same chart, bigger steps: multiply the $1 totals by your step. $5 → $6,890. $10 → $13,780.',
    variationsHeading: 'Four ways to play',
    variationsIntro: 'Fill all 52 squares and the total is the same whichever way you go.',
    variations: [
      ['In order', '$1, $2, $3… Easy to start; December brings the biggest weeks, right when spending peaks. Plan for it.'],
      ['Reverse', 'Start at $52 and go down. You do the hard part while motivation is high, and the holidays get easier.'],
      ['Any order', 'Pick the square that fits this week: a big one after payday, a small one in a tight week.'],
      ['Random', 'Let chance pick one of the remaining squares. The app can pick a random open square for you.'],
    ],
    tipsHeading: 'Tips to finish',
    tips: [
      'Pick a start date: January 1, a birthday or a payday. Whatever week you start is week 1.',
      'In order, the halfway point (week 26) is only $351 — about 25% of the total. Knowing the back half is heavier helps you plan.',
      'Save on the same day every week. With a bank account, move the money on payday.',
      'Missed a week? Pick a small square or do two next week. Not stopping is what matters.',
      'Keep the chart where you see it. In the app, a Home Screen widget shows your progress.',
    ],
    pdf: {
      pdfs: [['52-week-money-challenge.pdf', 'Download the $ chart (PDF)'], ['52-week-money-challenge-blank.pdf', 'Blank version (no currency)']],
      heading: 'Printable 52-week chart (A4)',
      text: 'One A4 page: 52 squares from $1 to $52 with a start date and total. The blank version has week numbers only, so you can use any currency or step. Free to download.',
      preview: '52-week-money-challenge.png', previewAlt: 'Page 1 of the 52-week money challenge PDF',
    },
    app: { heading: 'Fill the squares on your iPhone', text: 'Tsumiage tracks the 52-week challenge on the same squares. Log a week with one tap from a Home Screen or Lock Screen widget. No ads.' },
    faq: [
      ['How much does the 52-week money challenge save?', '$1,378 at $1 steps. At $5 steps it is $6,890 and at $10 steps $13,780.'],
      ['Can I start in the middle of the year?', 'Yes. The week you start is week 1. After 52 weeks the total is the same.'],
      ['What if I miss a week?', 'Pick a smaller square or save two squares next week. Order does not matter, so the total stays the same.'],
      ['Is there a version without dollars?', 'Yes. The blank PDF has week numbers 1–52 only. Multiply each number by your own step in any currency.'],
    ],
    howTo: { name: 'How to do the 52-week money challenge', totalTime: 'P52W', supply: ['52-week challenge chart (A4)', 'A jar or a savings account'], tool: 'Tsumiage (iPhone app) or a pen' },
  });
}

function page100() {
  const marks = [10, 25, 50, 75, 100];
  return challengePage({
    ...COMMON,
    group: 'c100', campaign: 'en-100envelope',
    path: 'en/100-envelope-challenge/',
    title: '100 Envelope Challenge Printable Chart (Free PDF) | Tsumiage',
    ogTitle: '100 Envelope Challenge: printable chart',
    description: 'The 100 envelope challenge: number envelopes 1 to 100 and put $n in envelope n. The total is $5,050 — 100 days at one a day. How it works, the maths and a free printable A4 chart (PDF).',
    og: 'assets/og/en-100-envelope.png', ogAlt: '100 envelope challenge chart. $5,050 in total',
    h1: '100 envelope challenge: how it works, plus a printable chart',
    lead: 'Number 100 envelopes, draw one, and put in the amount on it. No envelopes? Tick the chart instead — it works the same.',
    total: '$5,050', totalLabel: 'when all 100 envelopes are filled at $1 per number',
    crumbName: '100 envelope challenge',
    facts: [
      'The 100 envelope challenge: number envelopes <strong>1 to 100</strong> and put <strong>$n</strong> in envelope n.',
      'All 100 envelopes add up to <strong>$5,050</strong> (1 + 2 + … + 100).',
      'One envelope a day takes <strong>100 days</strong>; two a week takes <strong>50 weeks</strong>.',
      'The biggest envelope is $100; the average is $50.50.',
      'Scale it: $0.50 per number gives <strong>$2,525</strong>; $2 per number gives <strong>$10,100</strong>.',
    ],
    howHeading: 'How the 100 envelope challenge works',
    how: [
      ['Number 100 envelopes, or use the chart.', 'You do not need real envelopes — ticking the chart below works the same.'],
      ['Draw one.', 'Shuffle and draw like a lottery (the original way), or pick one you can afford.'],
      ['Put in the number in dollars.', 'Envelope 37 gets $37. Tick it on the chart.'],
      ['Fill all 100.', 'You have $5,050.'],
    ],
    formula: 'Total = $1 × (1 + 2 + … + 100) = $1 × 100 × 101 ÷ 2 = $5,050',
    sheetHeading: '100 envelope chart you can tick',
    sheetIntro: 'Each square is one envelope; the number is the amount. The total updates as you tap.',
    tracker: {
      ...trackerCommon, id: 'en-100envelope', n: 100, step: 1, label: 'index', cols: 20, colsM: 10,
      countFmt: '{done} of {all} envelopes ({total} in total)',
      groupLabel: '100 envelopes', aria: (k) => `Envelope ${k}, $${k}`,
    },
    mathHeading: 'How much will you save? Quick table',
    mathIntro: 'Running totals when you go in order. If you draw at random, the running total changes every time.',
    table: {
      caption: 'At $1 per number',
      head: ['After envelope', 'That envelope', 'Total', 'At one a day'],
      rows: marks.map((m) => [`${m}`, usd(m), usd(cumulative(m, 1)), `day ${m}`]),
    },
    mathNote: 'Want it smaller or bigger? Multiply by your unit: $0.50 → $2,525, $2 → $10,100.',
    variationsHeading: 'Four ways to play',
    variations: [
      ['In order', 'Envelope 1, 2, 3… The last ten envelopes ($91–$100) are the heaviest.'],
      ['Reverse', 'Start with $100 envelopes, for example in a bonus month.'],
      ['Any order', 'Pick the envelope that fits your budget today.'],
      ['Random draw', 'Shuffle and draw — the original way. The app can also pick a random open square.'],
    ],
    tipsHeading: 'Tips to finish',
    tips: [
      'One a day means up to $100 in a single day. Two a week (50 weeks) is a gentler pace.',
      'Keeping cash at home? Move it to a bank account before it grows large.',
      'Too big? Use $0.50 per number for a $2,525 version.',
    ],
    pdf: {
      pdfs: [['100-envelope-challenge.pdf', 'Download the $ chart (PDF)'], ['100-envelope-challenge-blank.pdf', 'Blank version (no currency)']],
      heading: 'Printable 100 envelope chart (A4)',
      text: 'One A4 page of 100 envelope-shaped squares numbered 1–100, with a start date and total. The blank version leaves out the currency. Free to download.',
      preview: '100-envelope-challenge.png', previewAlt: 'Page 1 of the 100 envelope challenge PDF',
    },
    app: { heading: 'Fill the envelopes on your iPhone', text: 'Tsumiage tracks the 100 envelope challenge on the same 100 squares. Log one with a tap from a widget or Control Center. No ads.' },
    faq: [
      ['How much is the 100 envelope challenge?', '$5,050 when envelope n holds $n. At $0.50 per number it is $2,525.'],
      ['How long does it take?', '100 days at one envelope a day, or 50 weeks at two a week. Any pace works.'],
      ['Do I need 100 real envelopes?', 'No. Tick the chart instead — the total is the same.'],
      ['Is there a version for other currencies?', 'Yes. The blank PDF has numbers 1–100 only, so you can pick your own unit.'],
    ],
    howTo: { name: 'How to do the 100 envelope challenge', totalTime: 'P100D', supply: ['100 envelope challenge chart (A4) or 100 envelopes', 'A jar or a savings account'], tool: 'Tsumiage (iPhone app) or a pen' },
  });
}

function landing(ctx) {
  const path = 'en/';
  const r2 = seeded(11);
  const cards = [
    ['52-week-money-challenge/', '52-week money challenge', '$1,378', '1 year', 'Start at $1 and add $1 a week. Week 52 is $52.', motif({ cols: 26, rows: 2, on: (i) => i < 21 })],
    ['100-envelope-challenge/', '100 envelope challenge', '$5,050', '100 days', 'Envelope n holds $n. Draw one a day.', motif({ cols: 25, rows: 4, on: () => r2() < 0.35 })],
  ];
  const faqItems = [
    ['Can I use it without buying Pro?', 'Yes. Without Pro you get 3 active goals, every savings challenge, widgets and backup. Tsumiage Pro is a one-time purchase that adds unlimited goals and more. There is no subscription. The price depends on your country and is shown in the App Store.'],
    ['Are there ads?', 'No. Never while you log, never when you open the app.'],
    ['Which iPhones does it run on?', 'iPhones with iOS 26 or later.'],
    ['Where is my data stored?', 'On your iPhone and, if you turn on backup, in your own iCloud Drive. Nothing is sent to the developer. No account needed.'],
    ['Can I move to a new iPhone?', 'Yes. Tsumiage backs up to your iCloud Drive every day, so you can restore after switching phones or reinstalling. CSV import is supported too.'],
    ['What about money I take out, or a wrong entry?', 'Log money you spend as a withdrawal. Entries can be edited or deleted later, and undone right after logging.'],
    ['Can I track things other than money?', 'Yes: distance, books, study time, counts or a unit of your own. Time can be measured with a timer and logged directly.'],
    ['What does Tsumiage Pro add?', 'Unlimited goals, recurring deposit reminders, every chart and widget style, detailed analysis, Face ID lock and CSV export. Family Sharing is supported.'],
  ];
  const shots = ctx.shots('en');
  const main = `<section class="hero">
<div class="wrap hero-grid">
<div>
<p class="store-name"><img src="../assets/icon-68.png" width="28" height="28" alt="">Tsumiage for iPhone</p>
<h1>Save it up, one square at a time.</h1>
<p class="lead">Tsumiage is an iPhone app for savings challenges — the 52-week challenge, the 100 envelope challenge, the 365-day challenge and more — and for your own savings goals. Set a number, then stack up what you save with one tap.</p>
<div class="actions">
<a class="btn btn-primary" href="${esc(appUrl('en-hero'))}">${ICON.store}Get it on the App Store</a>
<a class="btn btn-secondary" href="#challenges">See the printable charts</a>
</div>
<ul class="trust">
<li><b>No ads</b><span>Logging never shows you an ad.</span></li>
<li><b>One-time Pro</b><span>Buy once, keep it. No subscription.</span></li>
<li><b>No sign-up</b><span>No account, no email address.</span></li>
</ul>
</div>
${heroFigure({ prefix: '$', total: 1378, caption: 'the 52-week challenge at $1 a week' })}
</div>
</section>

<section class="section band" id="how" aria-labelledby="how-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="how-h">Three steps</h2></div>
<ol class="steps">
<li class="reveal"><h3>Type a name, get a goal</h3><p>Write something like <span class="example">Hawaii trip $2,000 by December</span> and the type, target and deadline fill in, with how much to save per day.</p></li>
<li class="reveal"><h3>Log with one tap</h3><p>From Home Screen and Lock Screen widgets, Control Center, Shortcuts or Siri — without opening the app.</p></li>
<li class="reveal"><h3>Watch it stack up</h3><p>Charts show your progress, medals and badges mark your streaks. Money you spend is logged as a withdrawal.</p></li>
</ol>
</div>
</section>
${shots ? shotsSection(shots, 'App screens', path) : ''}
<section class="section" id="challenges" aria-labelledby="ch-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="ch-h">Savings challenges with printable charts</h2><p>How each challenge works, the maths, and a free A4 chart to print. In the app you tick the same squares.</p></div>
<div class="challenge-grid">
${cards.map(([p, name, total, small, text, svg]) => `<a class="ch-card reveal" href="${p}">${svg}<h3>${name}</h3><p class="total">${total}<small>${small}</small></p><p>${text}</p><span class="go">How it works</span></a>`).join('\n')}
<div class="ch-card reveal" style="box-shadow:none;background:transparent;padding-inline:4px"><h3>Also in the app</h3><p>The 365-day challenge, the 100-day challenge, a 200-coin challenge and no-spend savings with one-tap buttons such as “Skipped coffee $5”.</p></div>
</div>
</div>
</section>

<section class="section band" id="features" aria-labelledby="feat-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="feat-h">Made to keep you going</h2><p>Logging should take a second, and your records should never disappear.</p></div>
<div class="features">
<div class="feature reveal"><h3>Log without opening the app</h3><p>Save, then tap once. Where you can log:</p><ul class="places"><li>Home Screen widget</li><li>Lock Screen widget</li><li>Control Center</li><li>Shortcuts and Siri</li></ul></div>
<div class="feature reveal"><h3>One-tap buttons</h3><p>Make buttons like “Skipped coffee $5” and log no-spend savings with a single tap — from the widget too.</p></div>
<div class="feature reveal"><h3>More than money</h3><p>Track distance, books, study time, counts or your own unit. Time it with the timer, shown as a Live Activity while it runs.</p></div>
<div class="feature reveal"><h3>Only the reminders you want</h3><p>Daily reminder, payday, weekly review and deadline pace. Each one is off until you turn it on.</p></div>
<div class="feature reveal"><h3>Edit, undo, withdraw</h3><p>Fix or delete entries later, undo right after logging, and record money you take out.</p></div>
<div class="feature reveal"><h3>Your data stays yours</h3><p>Stored on your iPhone and backed up daily to your own iCloud Drive. Restore after a new phone or a reinstall. CSV import supported.</p></div>
</div>
</div>
</section>

<section class="section" id="pro" aria-labelledby="pro-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="pro-h">Tsumiage Pro is a one-time purchase</h2><p>No subscription. It works on every iPhone with your Apple Account and for Family Sharing members.</p></div>
<div class="plan">
<div class="reveal"><h3>Without Pro</h3><ul><li>3 active goals</li><li>Every savings challenge</li><li>Widgets and one-tap logging</li><li>iCloud Drive backup and restore</li><li>Withdrawals, edits, reminders, badges</li></ul></div>
<div class="pro reveal"><h3>Pro adds</h3><ul><li>Unlimited goals</li><li>Recurring deposit reminders</li><li>Every chart and widget style</li><li>Detailed analysis</li><li>Face ID lock</li><li>CSV export</li></ul><p class="note">The price depends on your country and is shown in the App Store.</p></div>
</div>
</div>
</section>

${faq(faqItems, { heading: 'Questions', band: true, intro: `More how-to answers are on the <a href="support.html">support page</a>.` })}

<section class="section-tight" id="contact" aria-labelledby="contact-h">
<div class="wrap">
<div class="contact reveal">
<div><h2 id="contact-h">Contact</h2><p>For bugs or requests, please email us. Including your iPhone model and iOS version helps a lot.<br><a class="mail" href="mailto:${EMAIL}?subject=Tsumiage">${EMAIL}</a></p></div>
<a class="btn btn-secondary" href="support.html">Open the support page</a>
</div>
</div>
</section>`;
  return {
    lang: 'en', path, group: 'home', type: 'landing',
    title: 'Tsumiage: 52-Week & 100 Envelope Savings Challenge App',
    ogTitle: 'Tsumiage — savings challenges for iPhone',
    description: 'An iPhone app for savings challenges and goals: 52-week, 100 envelope, 365-day and more. Fill squares with one tap from widgets. No ads, one-time Pro, no sign-up. Free printable charts included.',
    og: 'assets/og/en.png', ogAlt: 'Tsumiage: save it up, one square at a time',
    main,
    jsonld: ctx.landingLd({
      lang: 'en', path, name: 'Tsumiage', alt: ['ツミアゲ', 'ツミアゲ貯金'], currency: 'USD',
      description: 'An iPhone app for savings challenges (52-week, 100 envelope, 365-day, 100-day, 200-coin, no-spend savings) and savings goals. No ads, no account, no data collection. Core features work without purchase; the optional one-time in-app purchase Tsumiage Pro adds unlimited goals and more (no subscription).',
      features: ['52-week, 100 envelope, 365-day, 100-day and coin challenges', 'Set goals from a name with target, deadline and daily pace', 'One-tap logging from Home Screen and Lock Screen widgets, Control Center, Shortcuts and Siri', 'Charts, medals and badges, withdrawals, edit and undo', 'Timer logging for study and exercise with a Live Activity', 'Daily automatic backup to your iCloud Drive, restore, CSV import'],
      faqItems,
    }),
  };
}

function support() {
  const path = 'en/support.html';
  const items = [
    ['How do I add a widget?', 'Touch and hold an empty spot on your Home Screen → “Edit” → “Add Widget” → “Tsumiage”. The medium size has buttons that log with one tap. To choose the goal and chart, touch and hold the widget → “Edit Widget”. You can also add Tsumiage to the Lock Screen and Control Center.'],
    ['I logged the wrong number', 'Right after logging, tap “Undo” at the top. Later, open the goal’s entry list and swipe left on an entry to edit or delete it.'],
    ['How do I log money I spent?', 'In the log sheet, switch from saving to spending and enter the amount. It is saved as a withdrawal and subtracted from the total.'],
    ['How many goals can I have?', 'Without Pro you can have 3 active goals at a time. Tsumiage Pro (one-time purchase) makes it unlimited.'],
    ['I bought Pro but it isn’t active', 'Open Settings → “Restore purchase”. Other iPhones with the same Apple Account get Pro at no extra cost. Family Sharing is supported.'],
    ['Which currency and distance unit does the app use?', 'They follow your iPhone’s region: dollars, won, euros or yen, and miles or kilometers.'],
    ['Can I move my data to a new iPhone?', 'With backup on, Tsumiage saves a copy to your own iCloud Drive every day. Install the app on the new iPhone with the same Apple Account and restore from the backup. You can also import a CSV file.'],
    ['What happens if I delete the app?', 'Goals and entries on the iPhone are deleted. If you have an iCloud Drive backup, you can restore it after reinstalling. Without a backup they can’t be recovered.'],
  ];
  const page = { lang: 'en', path, group: 'support', type: 'doc', title: 'Support & Contact | Tsumiage', description: 'How to use Tsumiage, FAQ and contact: widgets, editing entries, moving to a new iPhone with iCloud Drive backup, restoring Pro.', og: 'assets/og/en.png', ogAlt: 'Tsumiage support' };
  page.main = `${crumbs(page, [['Tsumiage', 'en/'], ['Support', path]])}
<div class="narrow doc">
<div class="page-head"><h1>Support</h1><p class="lead">How to use Tsumiage, and how to reach us.</p></div>
<section aria-labelledby="c-h"><h2 id="c-h">Contact</h2><p>For bugs or requests, please email us. Including your iPhone model and iOS version helps a lot.</p><p><a class="mail" href="mailto:${EMAIL}?subject=Tsumiage">${EMAIL}</a></p></section>
<section aria-labelledby="f-h"><h2 id="f-h">FAQ</h2>
${items.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('\n')}
</section>
<section aria-labelledby="l-h"><h2 id="l-h">Related</h2><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Use</a></li><li><a href="./#challenges">Savings challenge charts</a></li></ul></section>
</div>`;
  page.jsonld = [faqLd(items, abs(path)), breadcrumbLd([['Tsumiage', 'en/'], ['Support', path]])];
  return page;
}

function privacy() {
  const path = 'en/privacy.html';
  const page = { lang: 'en', path, group: 'privacy', type: 'doc', title: 'Privacy Policy | Tsumiage', description: 'Tsumiage does not collect any of your information. Entries stay on your iPhone and, if you turn on backup, in your own iCloud Drive.', og: 'assets/og/en.png', ogAlt: 'Tsumiage privacy policy' };
  page.main = `${crumbs(page, [['Tsumiage', 'en/'], ['Privacy Policy', path]])}
<div class="narrow doc">
<div class="page-head"><h1>Privacy Policy</h1><p class="lead">Tsumiage does not collect any of your information.<br>Last updated: November 14, 2026</p></div>
<section><h2>What is stored</h2><ul>
<li>Your goals, entries (numbers, notes and dates) and display settings are stored on your iPhone. Home Screen and Lock Screen widgets read the same data on the same iPhone.</li>
<li>If you turn on backup, a copy is saved to your own iCloud Drive, in the iCloud of your Apple Account. The developer cannot see it.</li>
<li>There is no developer server and no account.</li>
<li>Deleting the app deletes the data on your iPhone. An iCloud Drive backup stays until you delete it.</li>
</ul></section>
<section><h2>Features we use</h2><ul>
<li><b>Notifications</b>: only when you turn on a reminder. Reminders are scheduled on your iPhone and nothing is sent out.</li>
<li><b>Face ID / Touch ID</b>: only when you turn on the app lock. iOS checks it's you, and the app never receives face or fingerprint data.</li>
<li><b>iCloud Drive</b>: only when you turn on backup, to save a copy of your entries to your iCloud Drive and read it back when you restore.</li>
<li><b>CSV export and import</b>: only when you choose to, your entries are saved to a file and handed to the share sheet, or read from a file you pick.</li>
<li><b>Purchases</b>: Tsumiage Pro is processed by Apple. The developer never receives your payment details.</li>
</ul></section>
<section><h2>What we don't collect</h2><p>No ads, tracking, analytics or crash-reporting tools. The app never sends information to the developer. It only uses the internet for App Store purchases and, when backup is on, iCloud Drive (an Apple service).</p></section>
<section><h2>Contact</h2><p>Questions about this policy: <a href="mailto:${EMAIL}">${EMAIL}</a>. Any changes will be posted on this page.</p></section>
</div>`;
  page.jsonld = [breadcrumbLd([['Tsumiage', 'en/'], ['Privacy Policy', path]])];
  return page;
}

function terms() {
  const path = 'en/terms.html';
  const page = { lang: 'en', path, group: 'terms', type: 'doc', title: 'Terms of Use | Tsumiage', description: 'Terms of use for Tsumiage: Tsumiage Pro (one-time purchase) and your data.', og: 'assets/og/en.png', ogAlt: 'Tsumiage terms of use' };
  page.main = `${crumbs(page, [['Tsumiage', 'en/'], ['Terms of Use', path]])}
<div class="narrow doc">
<div class="page-head"><h1>Terms of Use</h1><p class="lead">Last updated: November 14, 2026</p></div>
<section><h2>Basics</h2><p>Your use of Tsumiage is governed by Apple's <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Licensed Application End User License Agreement</a>. This page explains a few points specific to the app.</p></section>
<section><h2>Tsumiage Pro</h2><ul>
<li>Tsumiage Pro is a one-time purchase. There are no recurring charges.</li>
<li>It removes the goal limit and unlocks recurring deposit reminders, every chart and widget style, detailed analysis, Face ID lock and CSV export.</li>
<li>It works on devices with the same Apple Account and for Family Sharing members. Use “Restore purchase” to turn it on again.</li>
<li>Refunds follow Apple's rules and can be requested at <a href="https://reportaproblem.apple.com/">reportaproblem.apple.com</a>.</li>
</ul></section>
<section><h2>Your data</h2><p>Entries are stored on your iPhone and, if you turn on backup, in your iCloud Drive. The developer is not responsible for data lost through device failure, loss or deleting the app. Keep important entries safe with the iCloud Drive backup or CSV export.</p></section>
<section><h2>Contact</h2><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></section>
</div>`;
  page.jsonld = [breadcrumbLd([['Tsumiage', 'en/'], ['Terms of Use', path]])];
  return page;
}

export function pagesEn(ctx) {
  return [landing(ctx), page52(), page100(), support(), privacy(), terms()];
}
