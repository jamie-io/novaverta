/* Phönix / Nova Verta Deutschland — progressive enhancement only.
   Every page works with JavaScript disabled; this file adds polish on top. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Sticky header state ------------------------------------------- */
  var header = document.querySelector('[data-header]');

  if (header) {
    var ticking = false;

    var syncHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncHeader);
      }
    }, { passive: true });

    syncHeader();
  }

  /* --- Mobile navigation --------------------------------------------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var drawer = document.querySelector('[data-nav-drawer]');

  if (toggle && drawer) {
    var setDrawer = function (open) {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      document.body.classList.toggle('is-locked', open);
      drawer.setAttribute('aria-hidden', String(!open));
    };

    setDrawer(false);

    toggle.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });

    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) setDrawer(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
        setDrawer(false);
        toggle.focus();
      }
    });

    // Reset when the drawer's breakpoint is passed while it is open.
    window.matchMedia('(min-width: 64rem)').addEventListener('change', function (event) {
      if (event.matches) setDrawer(false);
    });
  }

  /* --- Scroll reveals -------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (!revealTargets.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // Index the children of staggered groups so CSS can offset each delay.
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, index) {
        child.style.setProperty('--i', String(index));
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }
}());
