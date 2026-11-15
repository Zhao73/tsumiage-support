// ツミアゲ public site — small progressive enhancements. Every page works without this file.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Header gets a hairline once the page scrolls.
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Close the language menu when clicking elsewhere or pressing Escape.
  const lang = document.querySelector('.lang');
  if (lang) {
    document.addEventListener('click', (e) => { if (!lang.contains(e.target)) lang.open = false; });
    lang.addEventListener('keydown', (e) => { if (e.key === 'Escape') { lang.open = false; lang.querySelector('summary').focus(); } });
  }

  // Reveal sections once as they come into view (siblings in a row get a small stagger).
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.07 + 's');
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Hero: count the total up in step with the ring (the final value is already in the HTML).
  const counter = document.querySelector('[data-count-to]');
  if (counter && !reduce.matches) {
    const to = Number(counter.dataset.countTo);
    const fmt = (n) => counter.dataset.prefix + Math.round(n).toLocaleString('en-US');
    const start = performance.now() + 250, dur = 2600;
    // Same shape as the ring keyframes: three steps that land at 1/3, 2/3, 1.
    const shape = (t) => {
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      if (t < .30) return ease(t / .30) / 3;
      if (t < .58) return 1 / 3 + ease((t - .30) / .28) / 3;
      if (t < .88) return 2 / 3 + ease((t - .58) / .30) / 3;
      return 1;
    };
    counter.textContent = fmt(0);
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      counter.textContent = fmt(to * shape(t));
      if (t < 1) requestAnimationFrame(tick);
      else document.querySelector('.stack-figure')?.classList.add('idle');
    };
    requestAnimationFrame(tick);
  }

  // Screenshot slots: a missing file removes its frame; an empty row removes the section.
  document.querySelectorAll('[data-shot]').forEach((img) => {
    const drop = () => {
      const fig = img.closest('figure');
      const section = img.closest('[data-shots]');
      fig?.remove();
      if (section && !section.querySelector('figure')) section.remove();
    };
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener('error', drop, { once: true });
  });

  // Challenge sheet: tick squares, keep them in this browser only.
  document.querySelectorAll('[data-tracker]').forEach((root) => {
    const key = 'tsumiage-sheet:' + root.dataset.tracker;
    const grid = root.querySelector('.sq-grid');
    const buttons = [...grid.querySelectorAll('button')];
    const sumEl = root.querySelector('[data-sum]');
    const countEl = root.querySelector('[data-count]');
    const bar = root.querySelector('.tracker-bar i');
    const prefix = root.dataset.prefix || '';
    const suffix = root.dataset.suffix || '';
    let step = Number(root.dataset.step || 1);
    const coin = Number(root.dataset.coin || 0);
    const valueOf = (b) => (coin ? coin : Number(b.dataset.n) * step);

    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch { saved = []; }
    const set = new Set(saved);
    buttons.forEach((b) => b.setAttribute('aria-pressed', set.has(Number(b.dataset.n)) ? 'true' : 'false'));

    const units = root.querySelectorAll('input[name="unit-' + root.dataset.tracker + '"]');
    try { const s = localStorage.getItem(key + ':step'); if (s && units.length) { step = Number(s); units.forEach((u) => (u.checked = Number(u.value) === step)); } } catch {}

    const render = () => {
      let sum = 0, total = 0, done = 0;
      buttons.forEach((b) => {
        const v = valueOf(b);
        total += v;
        if (b.getAttribute('aria-pressed') === 'true') { sum += v; done++; }
        if (b.dataset.label === 'amount') b.textContent = (v).toLocaleString('en-US');
      });
      sumEl.textContent = prefix + sum.toLocaleString('en-US') + suffix;
      countEl.textContent = root.dataset.countFmt.replace('{done}', done).replace('{all}', buttons.length).replace('{total}', prefix + total.toLocaleString('en-US') + suffix);
      bar.style.setProperty('--p', total ? sum / total : 0);
    };
    const save = () => {
      const on = buttons.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => Number(b.dataset.n));
      try { localStorage.setItem(key, JSON.stringify(on)); } catch {}
    };
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('pop', on);
      render(); save();
    });
    units.forEach((u) => u.addEventListener('change', () => {
      step = Number(u.value);
      try { localStorage.setItem(key + ':step', String(step)); } catch {}
      render();
    }));
    root.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (!confirm(root.dataset.resetConfirm)) return;
      buttons.forEach((b) => { b.setAttribute('aria-pressed', 'false'); b.classList.remove('pop'); });
      render(); save();
    });
    render();
  });
})();
