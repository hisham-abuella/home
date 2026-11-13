// "Back" menu on articles: a <details> list of the four reader paths and the full
// website. It works without this script; this closes it on Escape or an outside click,
// and lets it fade out (about 140 ms) instead of vanishing, unless reduced motion is on.
(function () {
  var menu = document.querySelector('.back-menu');
  if (!menu) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  function close() {
    if (!menu.open || menu.classList.contains('closing')) return;
    if (still.matches) { menu.open = false; return; }
    menu.classList.add('closing');
    setTimeout(function () { menu.classList.remove('closing'); menu.open = false; }, 140);
  }
  menu.querySelector('summary').addEventListener('click', function (event) {
    if (menu.open) { event.preventDefault(); close(); }
  });
  document.addEventListener('click', function (event) {
    if (menu.open && !menu.contains(event.target)) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.open) {
      close();
      menu.querySelector('summary').focus();
    }
  });
})();
