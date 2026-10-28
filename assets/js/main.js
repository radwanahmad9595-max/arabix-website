/* ARABIx — أرابيكس · site interactions */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'contact@arabix.ai';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* ---------- Current section in nav ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      // stagger siblings
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
      if (el.closest('.hero')) { requestAnimationFrame(function () { el.classList.add('is-visible'); }); return; }
      revObs.observe(el);
    });
  }

  /* ---------- Pixel motif (brand: dense in one corner, fading away) ---------- */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  document.querySelectorAll('[data-pixels]').forEach(function (box, idx) {
    var cols = +box.dataset.cols || 16, rows = +box.dataset.rows || 10, corner = box.dataset.corner || 'tr';
    var light = box.hasAttribute('data-light');
    var palette = light ? ['#6E9BE0', '#3B4EA8', '#8FB2EA', '#2E3F96'] : ['#1F1B57', '#2E3F96', '#6E9BE0', '#2E3F96'];
    var rand = rng(97 + idx * 31);
    box.style.setProperty('--cols', cols);
    var frag = document.createDocumentFragment();
    var maxD = Math.hypot(cols, rows);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        // grid flows RTL: column 0 is the right edge
        var cx = (corner === 'tl' || corner === 'bl') ? cols - 1 - c : c;
        var cy = (corner === 'bl' || corner === 'br') ? rows - 1 - r : r;
        var d = Math.hypot(cx, cy * 1.2) / maxD;
        var p = Math.pow(Math.max(0, 1 - d * 1.35), 1.4);
        var i = document.createElement('i');
        if (rand() < p) {
          i.style.background = palette[Math.floor(rand() * palette.length)];
          var o = light ? 0.35 + 0.55 * (1 - d) : 0.55 + 0.45 * (1 - d);
          i.style.setProperty('--o', o.toFixed(2));
          i.style.transitionDelay = Math.round(d * 900 + rand() * 300) + 'ms';
          if (!reduceMotion && rand() < 0.18) {
            i.className = 'tw';
            i.style.setProperty('--d', (3 + rand() * 4).toFixed(1) + 's');
            i.style.setProperty('--dl', (1 + rand() * 4).toFixed(1) + 's');
          }
        } else {
          i.style.visibility = 'hidden';
        }
        frag.appendChild(i);
      }
    }
    box.appendChild(frag);
    if ('IntersectionObserver' in window) {
      var po = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { box.classList.add('is-on'); po.disconnect(); }
      }, { threshold: 0.05 });
      po.observe(box);
    } else box.classList.add('is-on');
  });

  /* ---------- Hero: live review demo ---------- */
  (function reviewDemo() {
    var text = document.getElementById('review-text');
    if (!text) return;
    var steps = document.querySelectorAll('#review-steps li');
    var checks = document.querySelectorAll('#review-checks span');
    var source = document.getElementById('review-source');
    var bar = document.getElementById('review-bar');
    var words = [
      { raw: 'تتكون', tash: 'تَتَكَوَّنُ' },
      { raw: 'الماده', fix: 'المادة', tash: 'المادَّةُ' },
      { raw: 'من', tash: 'مِنْ' },
      { raw: 'ذرات', tash: 'ذَرّاتٍ' },
      { raw: 'صغيره', fix: 'صغيرة', tash: 'صَغيرَةٍ' },
      { raw: 'جدا', fix: 'جدًا', tash: 'جِدًّا.' }
    ];
    text.innerHTML = '';
    var spans = words.map(function (w) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = w.raw; text.appendChild(s); text.appendChild(document.createTextNode(' ')); return s;
    });
    function set(s, t, cls) {
      if (s.textContent !== t) { s.textContent = t; s.classList.remove('swap'); void s.offsetWidth; s.classList.add('swap'); }
      s.classList.remove('err', 'ok'); if (cls) s.classList.add(cls);
    }
    var DUR = [2200, 2000, 2200, 2400, 3600];
    var stepFor = [0, 1, 1, 2, 3];
    var state = 0, timer = null, running = false;

    function render(st) {
      steps.forEach(function (li, i) {
        li.classList.toggle('is-active', i === stepFor[st]);
        li.classList.toggle('is-done', i < stepFor[st]);
      });
      words.forEach(function (w, i) {
        var s = spans[i];
        if (st === 0) set(s, w.raw);
        else if (st === 1) set(s, w.raw, w.fix ? 'err' : null);
        else if (st === 2) set(s, w.fix || w.raw, w.fix ? 'ok' : null);
        else set(s, w.tash, st === 3 ? 'ok' : null);
      });
      checks[0].classList.toggle('is-on', st >= 2);
      checks[1].classList.toggle('is-on', st >= 3);
      checks[2].classList.toggle('is-on', st >= 3);
      checks[3].classList.toggle('is-on', st >= 4);
      source.classList.toggle('is-on', st >= 4);
      if (!reduceMotion) {
        bar.style.transition = 'none'; bar.style.width = (st / 5 * 100) + '%'; void bar.offsetWidth;
        bar.style.transition = 'width ' + DUR[st] + 'ms linear'; bar.style.width = ((st + 1) / 5 * 100) + '%';
      }
    }
    function tick() { render(state); timer = setTimeout(function () { state = (state + 1) % 5; tick(); }, DUR[state]); }
    function start() { if (running) return; running = true; tick(); }
    function stop() { running = false; clearTimeout(timer); }

    if (reduceMotion) { render(4); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.3 }).observe(text);
    } else start();
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  })();

  /* ---------- Generic tabs helper ---------- */
  function initTabs(list, onChange) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (onChange) onChange(tabs.indexOf(tab));
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = t.classList.contains('is-active') ? 0 : -1;
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        // RTL: ArrowLeft moves forward
        var dir = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        select(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
  }
  var cmp = document.querySelector('.compare-toggle');
  if (cmp) initTabs(cmp, function (i) { cmp.classList.toggle('is-curr', i === 1); });
  var exTabs = document.querySelector('.tab-list');
  if (exTabs) initTabs(exTabs);

  /* ---------- Timeline progress ---------- */
  var tl = document.getElementById('timeline');
  var fill = document.getElementById('timeline-fill');
  if (tl && fill) {
    var ticking = false;
    function updateTL() {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      fill.style.height = Math.max(0, Math.min(1, p)) * 100 + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(updateTL); } }, { passive: true });
    window.addEventListener('resize', updateTL);
    updateTL();
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    function setStatus(msg, cls) { status.textContent = msg; status.className = 'form-status' + (cls ? ' ' + cls : ''); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website.value) return; // bot
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        var valid = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()));
        el.closest('.field').classList.toggle('has-error', !valid);
        if (!valid && ok) { el.focus(); ok = false; }
      });
      if (!ok) { setStatus('يرجى تعبئة الحقول المطلوبة بشكل صحيح.', 'err'); return; }

      var data = {
        name: form.name.value.trim(),
        org: form.org.value.trim(),
        email: form.email.value.trim(),
        type: form.type.value,
        services: Array.prototype.map.call(form.querySelectorAll('input[name="services"]:checked'), function (c) { return c.value; }),
        message: form.message.value.trim()
      };
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setStatus('جارٍ الإرسال…');

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        setStatus('شكرًا لك! وصلنا طلبك وسنتواصل معك قريبًا.', 'ok');
      }).catch(function () {
        // Fallback: open the visitor's email app with the request pre-filled
        var body = 'الاسم: ' + data.name + '\nالجهة: ' + data.org + '\nالبريد: ' + data.email +
          '\nنوع الجهة: ' + data.type + '\nالخدمات: ' + (data.services.join('، ') || '—') + '\n\nتفاصيل المشروع:\n' + data.message;
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('طلب عينة أولية — ' + data.org) + '&body=' + encodeURIComponent(body);
        setStatus('سيُفتح تطبيق البريد لديك لإكمال إرسال الطلب.', 'ok');
      }).finally(function () { btn.disabled = false; });
    });

    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field'); if (f) f.classList.remove('has-error');
    });
  }
})();
