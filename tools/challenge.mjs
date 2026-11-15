// Composer for one challenge page (same structure in every language).
import { rel, esc, appUrl, ICON, crumbs, tracker, numTable, printable, appCta, faq, siblings, faqLd, breadcrumbLd, abs, langHome, UI } from './lib.mjs';

/**
 * c = {
 *  lang, path, title, description, og, ogAlt, h1, lead, total: '¥137,800', totalLabel,
 *  factsHeading, facts: [html], howHeading, how: [[name, text]], formula,
 *  sheetHeading, sheetIntro, tracker: {...}, mathHeading, mathIntro, table: {...}, mathNote,
 *  variationsHeading, variations: [[h, p]], tipsHeading, tips: [html],
 *  pdf: { pdfs: [[file,label]], heading, text, preview, previewAlt },
 *  app: { heading, text }, faqHeading, faq: [[q,a]], siblingsHeading, siblings: [[path,label,total]],
 *  howTo: { name, totalTime, supply: [names] }, crumbHome, crumbName, pdfButton, appButton, campaign
 * }
 */
export function challengePage(c) {
  const page = { lang: c.lang, path: c.path, title: c.title, description: c.description, og: c.og, ogAlt: c.ogAlt, ogTitle: c.ogTitle, type: 'challenge', group: c.group };
  const home = langHome(c.lang);
  const crumbItems = [[c.crumbHome, home], [c.crumbName, c.path]];
  const firstPdf = c.pdf.pdfs[0][0];
  page.main = `${crumbs(page, crumbItems)}
<div class="wrap page-head">
<div class="head-grid">
<div>
<h1>${c.h1}</h1>
<p class="lead">${c.lead}</p>
<p class="big-total"><span class="num">${c.total}</span><span>${c.totalLabel}</span></p>
<div class="actions">
<a class="btn btn-primary" href="${rel(c.path, 'pdf/' + firstPdf)}" download>${ICON.download}${c.pdfButton}</a>
<a class="btn btn-secondary" href="${esc(appUrl(c.campaign))}">${ICON.store}${c.appButton}</a>
</div>
</div>
<aside class="facts" aria-labelledby="facts-h">
<h2 id="facts-h">${c.factsHeading}</h2>
<ul>${c.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
</aside>
</div>
</div>

<section class="section-tight" id="how" aria-labelledby="how-h">
<div class="narrow prose reveal">
<h2 id="how-h">${c.howHeading}</h2>
<ol>${c.how.map(([n, t]) => `<li><b>${n}</b> ${t}</li>`).join('')}</ol>
${c.formula ? `<p class="formula" role="note">${c.formula}</p>` : ''}
</div>
</section>

${c.tracker ? `<section class="section-tight" id="sheet" aria-labelledby="sheet-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="sheet-h">${c.sheetHeading}</h2><p>${c.sheetIntro}</p></div>
${tracker(c.tracker)}
</div>
</section>` : ''}

<section class="section-tight" id="math" aria-labelledby="math-h">
<div class="narrow prose">
<h2 id="math-h" class="reveal">${c.mathHeading}</h2>
${c.mathIntro ? `<p>${c.mathIntro}</p>` : ''}
${numTable(c.table)}
${c.mathNote ? `<p class="note">${c.mathNote}</p>` : ''}
</div>
</section>

<section class="section-tight" id="variations" aria-labelledby="var-h">
<div class="wrap">
<div class="section-head reveal"><h2 id="var-h">${c.variationsHeading}</h2>${c.variationsIntro ? `<p>${c.variationsIntro}</p>` : ''}</div>
<div class="cards-2">${c.variations.map(([h, p]) => `<div class="card reveal"><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
</div>
</section>

<section class="section-tight" id="tips" aria-labelledby="tips-h">
<div class="narrow prose reveal">
<h2 id="tips-h">${c.tipsHeading}</h2>
<ul>${c.tips.map((t) => `<li>${t}</li>`).join('')}</ul>
</div>
</section>

${printable(page, c.pdf)}
${appCta(page, { ...c.app, campaign: c.campaign })}
${faq(c.faq, { heading: c.faqHeading })}
${siblings(page, c.siblings, c.siblingsHeading)}`;

  page.facts = c.facts; page.pdfList = c.pdf.pdfs; page.faq = c.faq; page.h1 = c.h1; page.total = c.total; page.totalLabel = c.totalLabel;
  const url = abs(c.path);
  page.jsonld = [
    {
      '@type': 'HowTo',
      '@id': url + '#howto',
      name: c.howTo.name,
      description: c.description,
      inLanguage: c.lang,
      image: abs(c.og),
      ...(c.howTo.totalTime ? { totalTime: c.howTo.totalTime } : {}),
      supply: c.howTo.supply.map((name) => ({ '@type': 'HowToSupply', name })),
      tool: [{ '@type': 'HowToTool', name: c.howTo.tool }],
      step: c.how.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n.replace(/<[^>]+>/g, ''), text: t.replace(/<[^>]+>/g, ''), url: url + '#how' })),
    },
    faqLd(c.faq, url),
    breadcrumbLd(crumbItems),
  ];
  return page;
}
