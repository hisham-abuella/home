// "Back" menu on articles: a <details> list of the four reader paths and the full
// website. It works without this script; this only closes it on Escape or an outside click.
(function () {
  var menu = document.querySelector('.back-menu');
  if (!menu) return;
  document.addEventListener('click', function (event) {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
})();
