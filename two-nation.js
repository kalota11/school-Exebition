/* دو قومی نظریہ: چپچپے (gooey) رنگین بلبلے + اسکرول
   1) نارنجی اور سبز بلبلے ایک ہی گیند میں گھلے ہوئے
   2) اسکرول پر گیند کھنچ کر دو حصوں میں ٹوٹ جاتی ہے
   3) سبز بلبلے مل کر ہلال بنتے ہیں، ستارہ گھومتا ہوا آتا ہے، کانفیٹی پھٹتی ہے
   چھونے/ماؤس سے بلبلے دور ہٹتے ہیں */
(function () {
  const scroller = document.getElementById('tnScroll');
  const oldCv = document.getElementById('tnCanvas');
  if (!scroller || !oldCv) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const caps = [...document.querySelectorAll('.tn-cap')];
  const dots = [...document.querySelectorAll('.tn-dots i')];
  const hint = document.querySelector('.tn-hint');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const R = Math.random;

  const svg = mk('svg', { id: 'tnCanvas', 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMid meet' });
  oldCv.replaceWith(svg);
  const defs = mk('defs', {}, svg);
  function goo(id, blur) {                      // چپچپا فلٹر + نیوی کنارہ
    const f = mk('filter', { id, filterUnits: 'userSpaceOnUse', x: -120, y: -120, width: 900, height: 900, 'color-interpolation-filters': 'sRGB' }, defs);
    mk('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: blur, result: 'b' }, f);
    mk('feColorMatrix', { in: 'b', mode: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11', result: 'g' }, f);
    mk('feMorphology', { in: 'g', operator: 'dilate', radius: 3, result: 'd' }, f);
    mk('feFlood', { 'flood-color': '#12213f', result: 'n' }, f);
    mk('feComposite', { in: 'n', in2: 'd', operator: 'in', result: 'o' }, f);
    const m = mk('feMerge', {}, f); mk('feMergeNode', { in: 'o' }, m); mk('feMergeNode', { in: 'g' }, m);
  }
  goo('tnGoo', 7);
  const gA = mk('g', { filter: 'url(#tnGoo)', fill: '#ff7a2f' }, svg);   // نارنجی
  const gB = mk('g', { filter: 'url(#tnGoo)', fill: '#0fae78' }, svg);   // سبز
  const gC = mk('g', {}, svg);                                             // کانفیٹی
  const starPts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 15 : 36; starPts.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); }
  const star = mk('polygon', { points: starPts.join(' '), fill: '#ffc933', stroke: '#12213f', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg);

  const NA = 12, NB = 24, NC = 30;
  const A = [], B = [], C = [];
  let W = 1, H = 1, VW = 640, VH = 400, cx = 320, cy = 200, off = 150, vertical = false;
  let visible = false, prog = 0, shown = 0;
  const ptr = { x: 0, y: 0, on: false };

  function layout() {
    const r = svg.getBoundingClientRect(); W = r.width || 1; H = r.height || 1;
    vertical = H > W * 1.1;
    VW = vertical ? 400 : 640; VH = vertical ? 640 : 400;
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    cx = VW / 2; cy = VH * (vertical ? .47 : .5); off = vertical ? 135 : 150;
    gA.textContent = ''; gB.textContent = ''; gC.textContent = ''; A.length = B.length = C.length = 0;
    const blob = (rad, d) => { const a = R() * 6.283, k = Math.sqrt(R()) * d; return [Math.cos(a) * k, Math.sin(a) * k]; };
    for (let i = 0; i < NA; i++) {
      const m = blob(0, 52), c = blob(0, 40), a = R() * 6.283, d = 380 + R() * 150;
      A.push({ el: mk('circle', {}, gA), m, c, fx: cx + Math.cos(a) * d, fy: cy + Math.sin(a) * d, r: 19 + R() * 13, ph: R() * 6.283, dir: -1 });
    }
    const CR = vertical ? 92 : 96, ccx = cx - 22, ccy = cy;
    for (let i = 0; i < NB; i++) {
      const u = (i + .5) / NB, th = lerp(.7, 5.6, u), m = blob(0, 52), c = blob(0, 40);
      B.push({ el: mk('circle', {}, gB), m, c, fx: ccx + Math.cos(th) * CR, fy: ccy + Math.sin(th) * CR, rf: 5 + 19 * Math.pow(Math.sin(Math.PI * u), .8), r: 19 + R() * 13, ph: R() * 6.283, dir: 1 });
    }
    const cols = ['#ff7a2f', '#0fae78', '#ffc933', '#ff5c8a', '#3d7bff'];
    for (let i = 0; i < NC; i++) C.push({ el: mk('circle', { fill: cols[i % 5], stroke: '#12213f', 'stroke-width': 2 }, gC), a: R() * 6.283, d: 110 + R() * 150, r: 3.5 + R() * 4 });
  }

  function setCaption(p) {
    const k = p < .3 ? 0 : p < .62 ? 1 : 2;
    caps.forEach((c, i) => c.classList.toggle('on', i === k));
    const seg = [[0, .3], [.3, .62], [.62, 1]];
    dots.forEach((d, i) => d.style.setProperty('--f', clamp((p - seg[i][0]) / (seg[i][1] - seg[i][0]))));
    if (hint) hint.style.opacity = p > .04 ? 0 : 1;
  }

  function place(c, t, s1, s2, tt) {
    const a = tt * .35 * (reduce ? 0 : 1), ca = Math.cos(a), sa = Math.sin(a);
    const mx = cx + c.m[0] * ca - c.m[1] * sa, my = cy + c.m[0] * sa + c.m[1] * ca;
    const px = cx + c.dir * (vertical ? 0 : off), py = cy + c.dir * (vertical ? off : 0);
    const bx = px + c.c[0] * Math.cos(-a * 1.6) - c.c[1] * Math.sin(-a * 1.6), by = py + c.c[0] * Math.sin(-a * 1.6) + c.c[1] * Math.cos(-a * 1.6);
    let x = lerp(lerp(mx, bx, s1), c.fx, s2), y = lerp(lerp(my, by, s1), c.fy, s2);
    const amp = (reduce ? 0 : 1) * (5 - 4 * s2);
    x += Math.cos(tt * 1.3 + c.ph) * amp; y += Math.sin(tt * 1.7 + c.ph) * amp;
    if (ptr.on) {
      const dx = x - ptr.x, dy = y - ptr.y, d = Math.hypot(dx, dy);
      if (d < 80 && d > .5) { const f = Math.pow(1 - d / 80, 2) * 40; x += dx / d * f; y += dy / d * f; }
    }
    return [x, y];
  }

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    shown += (prog - shown) * (reduce ? 1 : .1);
    const s1 = ease(clamp((shown - .2) / .26)), s2 = ease(clamp((shown - .64) / .26)), tt = t / 1000;
    for (const c of A) {
      const [x, y] = place(c, t, s1, s2, tt);
      c.el.setAttribute('cx', x.toFixed(1)); c.el.setAttribute('cy', y.toFixed(1));
      c.el.setAttribute('r', Math.max(0, c.r * (1 - s2 * .9)).toFixed(1));
    }
    for (const c of B) {
      const [x, y] = place(c, t, s1, s2, tt);
      c.el.setAttribute('cx', x.toFixed(1)); c.el.setAttribute('cy', y.toFixed(1));
      c.el.setAttribute('r', lerp(c.r, c.rf, s2).toFixed(1));
    }
    // ستارہ: گھومتا ہوا اُچھل کر آئے
    const k = clamp((shown - .82) / .13), kk = k <= 0 ? 0 : back(k);
    star.setAttribute('transform', `translate(${cx + 52},${cy}) rotate(${(1 - k) * -220}) scale(${Math.max(0, kk).toFixed(3)})`);
    // کانفیٹی
    const b = clamp((shown - .74) / .2), burst = 1 - Math.pow(1 - b, 3), al = b > 0 && b < 1 ? Math.sin(Math.PI * Math.pow(b, .6)) : 0;
    for (const c of C) {
      c.el.setAttribute('cx', (cx + 10 + Math.cos(c.a) * c.d * burst).toFixed(1));
      c.el.setAttribute('cy', (cy + Math.sin(c.a) * c.d * burst + 30 * b * b).toFixed(1));
      c.el.setAttribute('r', c.r); c.el.setAttribute('opacity', al.toFixed(2));
    }
    setCaption(shown);
  }

  function onScroll() { const r = scroller.getBoundingClientRect(); prog = clamp(-r.top / (r.height - innerHeight)); }
  const stage = svg.parentElement;
  const setPtr = e => {
    const r = svg.getBoundingClientRect(), s = Math.min(r.width / VW, r.height / VH);
    ptr.x = (e.clientX - r.left - (r.width - VW * s) / 2) / s; ptr.y = (e.clientY - r.top - (r.height - VH * s) / 2) / s; ptr.on = true;
  };
  stage.addEventListener('pointermove', setPtr, { passive: true });
  stage.addEventListener('pointerdown', setPtr, { passive: true });
  ['pointerleave', 'pointerup', 'pointercancel'].forEach(n => stage.addEventListener(n, () => { ptr.on = false; }));

  new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible) onScroll(); }, { rootMargin: '100px' }).observe(scroller);
  addEventListener('scroll', onScroll, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); onScroll(); }, 120); });
  layout(); onScroll(); shown = prog; requestAnimationFrame(frame);

  /* موازنہ، ٹائم لائن، اعداد */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.dataset.count) count(e.target);
  }), { threshold: .25 });
  document.querySelectorAll('.tn-row,.tn-step,.tn-stat').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
  function count(card) {
    const el = card.querySelector('strong'), to = +card.dataset.count, from = to > 1000 ? 1800 : 0, d = 1600, t0 = performance.now();
    (function step(now) {
      const k = reduce ? 1 : clamp((now - t0) / d), v = Math.round(lerp(from, to, 1 - Math.pow(1 - k, 3)));
      el.textContent = v; if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  const steps = document.querySelector('.tn-steps');
  function tl() { const r = steps.getBoundingClientRect(); steps.style.setProperty('--tl', clamp((innerHeight * .8 - r.top) / r.height)); }
  addEventListener('scroll', tl, { passive: true }); tl();
})();

/* ===== ٹائم لائن کارڈ: نظر آتے ہی دو قومیں الگ ہوں؛ باہر نکل کر لوٹنے پر دوبارہ چلے ===== */
(function () {
  const st = document.getElementById('tnmStage'), chips = document.querySelector('.tnm-chips');
  if (!st) return;
  new IntersectionObserver(e => {
    const on = e[0].isIntersecting;
    st.classList.toggle('go', on); chips.classList.toggle('go', on);
  }, { threshold: .6 }).observe(st);
})();
