/* ==========================================================================
   Shared behaviour for every page: appearance switching and section reveals.

   Usage on any page:
     1. <html data-appearance="midnight">
     2. link css/base.css plus css/themes/*.css
     3. inline the pre-paint snippet (see APPEARANCE.md) so there is no flash
     4. <script src="js/appearance.js" defer></script>

   Markup the switcher expects, anywhere on the page:
     <div class="appearance-set" role="radiogroup" aria-label="Appearance">
       <button type="button" role="radio" data-appearance="midnight">Midnight</button>
       ...
     </div>
   ========================================================================== */

(function () {
    'use strict';

    var APPEARANCES = ['midnight', 'daylight', 'contrast'];
    var STORAGE_KEY = 'appearance';
    var root = document.documentElement;

    root.classList.add('js');

    /* ----------------------------------------------------------------------
       Appearance
       ---------------------------------------------------------------------- */

    function current() {
        var value = root.getAttribute('data-appearance');
        return APPEARANCES.indexOf(value) > -1 ? value : APPEARANCES[0];
    }

    var buttons = Array.prototype.slice.call(
        document.querySelectorAll('.appearance-set button[data-appearance]')
    );

    function apply(name) {
        if (APPEARANCES.indexOf(name) === -1) return;

        root.setAttribute('data-appearance', name);

        buttons.forEach(function (button) {
            var selected = button.dataset.appearance === name;
            button.setAttribute('aria-checked', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });

        try {
            localStorage.setItem(STORAGE_KEY, name);
        } catch (error) {
            /* Storage is unavailable in private mode; the choice just won't persist. */
        }

        // Let page-specific code (canvases, charts) repaint in the new palette.
        document.dispatchEvent(new CustomEvent('appearancechange', { detail: { name: name } }));
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            apply(button.dataset.appearance);
        });

        // A radiogroup is expected to move between options with the arrow keys.
        button.addEventListener('keydown', function (event) {
            var step = 0;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') step = 1;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') step = -1;
            if (!step) return;

            event.preventDefault();
            var index = APPEARANCES.indexOf(current());
            var next = APPEARANCES[(index + step + APPEARANCES.length) % APPEARANCES.length];
            apply(next);

            var target = buttons.filter(function (b) { return b.dataset.appearance === next; })[0];
            if (target) target.focus();
        });
    });

    apply(current());

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
