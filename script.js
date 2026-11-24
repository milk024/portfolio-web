(function () {
  var root = document.documentElement;

  // Theme toggle: paper <-> blueprint
  var btn = document.getElementById('themeBtn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Screenshot tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  var img = document.getElementById('shotImg');
  var cap = document.getElementById('shotCap');
  var panel = document.getElementById('shot');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    img.src = tab.dataset.src;
    img.alt = tab.textContent + ' 화면';
    cap.textContent = tab.dataset.cap;
    panel.setAttribute('aria-labelledby', tab.id);
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });
  // Preload other shots
  tabs.slice(1).forEach(function (t) { var p = new Image(); p.src = t.dataset.src; });

  // Copy email
  var copy = document.getElementById('copyBtn');
  if (copy) {
    copy.addEventListener('click', function () {
      var v = copy.dataset.copy;
      var done = function () { copy.textContent = '복사됨'; setTimeout(function () { copy.textContent = '복사'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () {});
    });
  }

  // Active sheet in nav
  var links = Array.prototype.slice.call(document.querySelectorAll('.sheets a'));
  if ('IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add('on');
            var nav = a.parentNode;
            if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.sheet[id]').forEach(function (s) { io.observe(s); });

    // Reveal on scroll
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      var targets = document.querySelectorAll('.sheet-head, .diagram, .compare, .ledger, .incident, .console, .adr-list, .chain, .big-nums, .decisions, .principles article, .stack, .record');
      var rv = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      targets.forEach(function (t) { t.classList.add('reveal'); rv.observe(t); });
    }
  }
})();
