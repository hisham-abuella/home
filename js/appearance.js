/* ==========================================================================
   Shared behaviour for every page: appearance switching and section reveals.

   Usage on any page:
     1. <html data-appearance="midnight">
     2. link css/base.css plus css/themes/*.css
     3. inline the pre-paint snippet (see APPEARANCE.md) so there is no flash
     4. <script src="js/appearance.js" defer></script>

   Markup the switcher expects, anywhere on the page:
     <div class="appearance-set" role="radiogroup" aria-label="Appearance">
       <button type="button" role="radio" data-appearance="auto">Auto</button>
       <button type="button" role="radio" data-appearance="midnight">Dark</button>
       <button type="button" role="radio" data-appearance="daylight">Light</button>
       <button type="button" role="radio" data-appearance="contrast">Contrast</button>
     </div>

   "auto" follows the system light/dark setting (Midnight or Daylight) and is the
   default; the stored value is the visitor's preference, data-appearance the result.
   ========================================================================== */

(function () {
    'use strict';

    // A visitor picks a preference; the page shows a resolved appearance.
    // "auto" follows the system light/dark setting and is the default.
    var PREFERENCES = ['auto', 'midnight', 'daylight', 'contrast'];
    var STORAGE_KEY = 'appearance';
    var root = document.documentElement;
    var systemLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

    root.classList.add('js');

    /* ----------------------------------------------------------------------
       Appearance
       ---------------------------------------------------------------------- */

    function stored() {
        try {
            var value = localStorage.getItem(STORAGE_KEY);
            return PREFERENCES.indexOf(value) > -1 ? value : 'auto';
        } catch (error) {
            return 'auto';
        }
    }

    function resolve(preference) {
        if (preference !== 'auto') return preference;
        return systemLight && systemLight.matches ? 'daylight' : 'midnight';
    }

    var preference = stored();

    var buttons = Array.prototype.slice.call(
        document.querySelectorAll('.appearance-set button[data-appearance]')
    );

    function apply(choice, save) {
        if (PREFERENCES.indexOf(choice) === -1) return;
        preference = choice;

        var name = resolve(choice);
        root.setAttribute('data-appearance', name);
        root.setAttribute('data-appearance-preference', choice);

        buttons.forEach(function (button) {
            var selected = button.dataset.appearance === choice;
            button.setAttribute('aria-checked', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });

        if (save) {
            try {
                localStorage.setItem(STORAGE_KEY, choice);
                // Keep the reader tracks' Auto / Light / Dark switch in step.
                var reader = { auto: 'auto', midnight: 'dark', daylight: 'light' }[choice];
                if (reader) localStorage.setItem('reader-theme', reader);
            } catch (error) {
                /* Storage is unavailable in private mode; the choice just won't persist. */
            }
        }

        // Let page-specific code (canvases, charts) repaint in the new palette.
        document.dispatchEvent(new CustomEvent('appearancechange', { detail: { name: name, preference: choice } }));
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            apply(button.dataset.appearance, true);
        });

        // A radiogroup is expected to move between options with the arrow keys.
        button.addEventListener('keydown', function (event) {
            var step = 0;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') step = 1;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') step = -1;
            if (!step) return;

            event.preventDefault();
            // Step through the options this page shows (articles hide Contrast).
            var shown = buttons.filter(function (b) { return b.offsetParent !== null; })
                               .map(function (b) { return b.dataset.appearance; });
            var index = shown.indexOf(preference);
            var next = shown[(index + step + shown.length) % shown.length];
            apply(next, true);

            var target = buttons.filter(function (b) { return b.dataset.appearance === next; })[0];
            if (target) target.focus();
        });
    });

    // In auto, follow the system when it switches (e.g. a phone going dark at sunset).
    if (systemLight) {
        var follow = function () { if (preference === 'auto') apply('auto', false); };
        if (systemLight.addEventListener) systemLight.addEventListener('change', follow);
        else if (systemLight.addListener) systemLight.addListener(follow);
    }

    apply(preference, false);

    /* ----------------------------------------------------------------------
       Reveals — one gentle entrance per section
       ---------------------------------------------------------------------- */

    var targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -12% 0px' });

    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
})();
