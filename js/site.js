/* Version B — progressive enhancement only.
   Without JavaScript the pages still render: the first slide stays visible and
   the navigation stays expanded. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var list = document.querySelector('[data-nav-list]');

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = !list.classList.contains('is-open');
      list.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    list.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        list.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Slider ---------------------------------------------------------- */
  var slider = document.querySelector('[data-slider]');
  if (!slider) return;

  var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
  if (slides.length < 2) return;

  var dotWrap = slider.querySelector('[data-slider-dots]');
  var index = Math.max(0, slides.findIndex(function (s) {
    return s.classList.contains('is-active');
  }));
  var timer = null;
  var DELAY = 6500;

  var dots = slides.map(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Bild ' + (i + 1) + ' von ' + slides.length);
    dot.addEventListener('click', function () { show(i); restart(); });
    if (dotWrap) dotWrap.appendChild(dot);
    return dot;
  });

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function restart() {
    if (timer) clearInterval(timer);
    if (!reduceMotion) timer = setInterval(function () { show(index + 1); }, DELAY);
  }

  var prev = slider.querySelector('[data-slider-prev]');
  var next = slider.querySelector('[data-slider-next]');
  if (prev) prev.addEventListener('click', function () { show(index - 1); restart(); });
  if (next) next.addEventListener('click', function () { show(index + 1); restart(); });

  slider.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { show(index - 1); restart(); }
    if (event.key === 'ArrowRight') { show(index + 1); restart(); }
  });

  /* Pause while the visitor is reading or tabbing through the slider. */
  ['mouseenter', 'focusin'].forEach(function (evt) {
    slider.addEventListener(evt, function () { if (timer) clearInterval(timer); });
  });
  ['mouseleave', 'focusout'].forEach(function (evt) {
    slider.addEventListener(evt, restart);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (timer) clearInterval(timer); } else { restart(); }
  });

  show(index);
  restart();
}());
