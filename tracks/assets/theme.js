/* ==========================================================================
   Reader-page theme switch — Auto / Light / Dark.

   Each page defines its colours as tokens for both themes, keyed on
   <html data-theme="light|dark">. The visitor's preference (auto by default)
   is stored as 'reader-theme'; auto follows the system setting and keeps
   following it if the system changes. Pages inline this pre-paint snippet in
   <head> so nothing flashes:

     <script>(function(){var p=null;try{p=localStorage.getItem('reader-theme')}catch(e){}
     if(['light','dark'].indexOf(p)<0)p=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
     document.documentElement.setAttribute('data-theme',p)})();</script>

   The switch renders into any element with [data-theme-switch].
   ========================================================================== */

(function () {
    'use strict';

    var KEY = 'reader-theme';
    var CHOICES = ['auto', 'light', 'dark'];
    var LABELS = { en: { auto: 'Auto', light: 'Light', dark: 'Dark', group: 'Theme' },
                   ar: { auto: 'تلقائي', light: 'فاتح', dark: 'غامق', group: 'المظهر' } };
    var root = document.documentElement;
    var system = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function stored() {
        try { var v = localStorage.getItem(KEY); return CHOICES.indexOf(v) > -1 ? v : 'auto'; }
        catch (e) { return 'auto'; }
    }
    var choice = stored();

    function resolve(c) { return c === 'auto' ? (system && system.matches ? 'dark' : 'light') : c; }

    function lang() { return root.dir === 'rtl' ? 'ar' : 'en'; }

    function render() {
        var l = LABELS[lang()];
        document.querySelectorAll('[data-theme-switch]').forEach(function (holder) {
            holder.setAttribute('role', 'group');
            holder.setAttribute('aria-label', l.group);
            holder.innerHTML = CHOICES.map(function (c) {
                return '<button type="button" data-theme-choice="' + c + '" aria-pressed="' + (c === choice) + '">' + l[c] + '</button>';
            }).join('');
        });
    }

    function apply(c, save) {
        choice = c;
        root.setAttribute('data-theme', resolve(c));
        if (save) {
            try {
                localStorage.setItem(KEY, c);
                // Keep the main site and articles in step (they call light/dark daylight/midnight).
                localStorage.setItem('appearance', { auto: 'auto', light: 'daylight', dark: 'midnight' }[c]);
            } catch (e) { /* storage unavailable */ }
        }
        document.querySelectorAll('[data-theme-choice]').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.dataset.themeChoice === c));
        });
        // Canvas drawings repaint in the new palette.
        document.dispatchEvent(new CustomEvent('themechange', { detail: resolve(c) }));
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-theme-choice]');
        if (b) apply(b.dataset.themeChoice, true);
    });
    if (system) {
        var follow = function () { if (choice === 'auto') apply('auto', false); };
        if (system.addEventListener) system.addEventListener('change', follow); else if (system.addListener) system.addListener(follow);
    }
    document.addEventListener('langchange', render);

    render();
    apply(choice, false);
})();
