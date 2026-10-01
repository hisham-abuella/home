/* ==========================================================================
   Motion — the page's one orchestrated entrance, plus scroll reveals.

   Add <script src="js/motion.js" defer></script> after js/appearance.js.
   Everything here is opt-in from the markup:

     class="enter delay-2"     element flies in on load, staggered
     class="enter-scale"       element scales in on load
     class="reveal-up"         reveals when scrolled into view
     class="reveal-left/right" same, from the side
     class="stagger"           its children reveal one after another
     data-typed="…"            the element types this string out
     data-count-to="10"        the number counts up when revealed

   All of it is inert under prefers-reduced-motion: the CSS neutralises the
   classes, and this file renders final values immediately.
   ========================================================================== */

(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       Typed role line
       ---------------------------------------------------------------------- */

    function typeLine(el) {
        var text = el.dataset.typed || el.textContent.trim();
        var cursor = document.createElement('span');
        cursor.className = 'typed-cursor';

        if (reduced) {
            el.textContent = text;
            return;
        }

        el.textContent = '';
        el.appendChild(cursor);

        var i = 0;
        // A touch of jitter reads like typing; a fixed interval reads like a machine.
        function step() {
            if (i >= text.length) {
                cursor.classList.add('done');
                return;
            }
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
            setTimeout(step, 34 + Math.random() * 46);
        }
        setTimeout(step, 520);   // let the name land first
    }

    /* ----------------------------------------------------------------------
       Count-up figures
       ---------------------------------------------------------------------- */

    function countUp(el) {
        var target = parseFloat(el.dataset.countTo);
        if (isNaN(target)) return;

        var prefix = el.dataset.countPrefix || '';
        var suffix = el.dataset.countSuffix || '';

        if (reduced) {
            el.textContent = prefix + target + suffix;
            return;
        }

        var DURATION = 1100;
        var start = null;

        requestAnimationFrame(function frame(now) {
            if (start === null) start = now;
            var p = Math.min((now - start) / DURATION, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(frame);
        });
    }

    /* ----------------------------------------------------------------------
       Wire everything up
       ---------------------------------------------------------------------- */

    function init() {
        document.querySelectorAll('[data-typed]').forEach(typeLine);

        var revealed = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right, .stagger'
        );
        var counters = document.querySelectorAll('[data-count-to]');

        if (reduced || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(revealed, function (el) { el.classList.add('in'); });
            Array.prototype.forEach.call(counters, countUp);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');

                // Any figures inside this block start counting as it arrives.
                entry.target.querySelectorAll('[data-count-to]').forEach(function (c) {
                    if (!c.dataset.counted) {
                        c.dataset.counted = '1';
                        countUp(c);
                    }
                });

                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

        Array.prototype.forEach.call(revealed, function (el) { io.observe(el); });

        // Counters that sit outside any revealed block still need an observer.
        var loose = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting || entry.target.dataset.counted) return;
                entry.target.dataset.counted = '1';
                countUp(entry.target);
                loose.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        Array.prototype.forEach.call(counters, function (c) {
            if (!c.closest('.reveal-up, .reveal-left, .reveal-right, .stagger')) loose.observe(c);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
