// ── Shared "More" dropdown behavior ────────────────────────────────────
(function () {
  function initMore(more) {
    var toggle = more.querySelector('.nav-more-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = more.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!more.contains(e.target)) {
        more.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        more.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.nav-more').forEach(initMore);
})();

// ── Intro hand-off ────────────────────────────────────────────────────
// Leave a short-lived note when a visitor follows a link within this site,
// so the home-page intro only plays on a fresh load or refresh.
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || /^(mailto:|tel:|#)/.test(href)) return;
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin && url.protocol !== 'file:') return;
      sessionStorage.setItem('jc-site-nav', String(Date.now()));
    } catch (err) {}
  }, true);
})();
