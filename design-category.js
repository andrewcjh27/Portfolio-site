// ── Slider + lightbox for Design category subpages ───────────────────────
(function () {
  // ─────────── Lightbox ───────────
  var lightbox     = document.getElementById('lightbox');
  var lightboxImg  = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-inner')) {
        closeLightbox();
      }
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ─────────── Sliders ───────────
  document.querySelectorAll('.slider').forEach(function (slider) {
    var viewport = slider.querySelector('.slider-viewport');
    var track    = slider.querySelector('.slider-track');
    var slides   = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var prevBtn  = slider.querySelector('.slider-arrow.prev');
    var nextBtn  = slider.querySelector('.slider-arrow.next');
    var dotsWrap = slider.querySelector('.slider-dots');
    var idx      = 0;

    if (!track || slides.length === 0) return;

    // Build dots
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var btn = document.createElement('button');
        btn.className = 'slider-dot';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.addEventListener('click', function () { go(i); });
        dotsWrap.appendChild(btn);
      });
    }

    // Hide arrows entirely if only one slide
    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsWrap) dotsWrap.style.display = 'none';
    }

    function update() {
      var slide = slides[idx];
      if (!slide) return;
      var vw = viewport.clientWidth;
      var sw = slide.offsetWidth;
      var offset = slide.offsetLeft - (vw - sw) / 2;
      track.style.transform = 'translateX(' + (-offset) + 'px)';

      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === slides.length - 1;
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle('active', i === idx);
        });
      }
    }

    function go(i) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      update();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });

    // Click on a slide: inactive → navigate to it; active → open lightbox
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () {
        if (i !== idx) {
          go(i);
        } else {
          var img = slide.querySelector('img');
          var full = slide.getAttribute('data-full') || (img && img.src);
          if (full) openLightbox(full, img ? img.alt : '');
        }
      });
    });

    // Keyboard navigation
    slider.tabIndex = 0;
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    });

    // Basic touch swipe
    var startX = 0, startY = 0, tracking = false;
    slider.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var touch = e.changedTouches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(idx + (dx < 0 ? 1 : -1));
      }
    });

    // Recompute position when the window resizes or images finish loading
    window.addEventListener('resize', update);
    slider.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', update);
    });

    // Jump to a specific slide if the URL contains a matching hash
    function jumpToHash() {
      var hash = (window.location.hash || '').replace('#', '');
      if (!hash) return;
      var target = slides.findIndex(function (s) { return s.id === hash; });
      if (target >= 0) go(target);
    }

    // Initial layout + hash jump (next frame so fonts / images have settled)
    requestAnimationFrame(function () {
      update();
      jumpToHash();
    });
    window.addEventListener('hashchange', jumpToHash);
  });
})();
