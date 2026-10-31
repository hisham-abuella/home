/* ==========================================================================
   Mascot — a character that turns its head toward the pointer and reacts
   when booped. A vanilla port of page-mascot by Kamran Ahmed (MIT,
   https://github.com/nilbuild/page-mascot).

   Markup:
     <button type="button" class="mascot" data-mascot="tracks/assets/mascot/radio"
             aria-label="Boop the radio" data-i18n-aria="mascot"></button>
   loads <path>-directions.webp and <path>-reactions.webp: two 3x3 sheets, nine
   head directions and nine expressions. Size comes from CSS (width/height).
   Tracking needs a fine pointer; the squash honours reduced motion.
   ========================================================================== */

(function () {
    'use strict';

    var DIRECTIONS = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
    var REACTIONS = ['blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted'];
    // Clockwise from the right, matching atan2 with y pointing down.
    var CLOCKWISE = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
    var SECTOR = Math.PI * 2 / CLOCKWISE.length;
    var HYSTERESIS = 0.12, DEAD_ZONE = 70;
    var PAYOFFS = ['heart', 'sparkle', 'delighted'];
    var BOOP_PAYOFF = 120, BOOP_END = 560, SQUASH_MS = 420;
    var DIZZY_AFTER = 4, DIZZY_WINDOW = 1600, DIZZY_END = 1100;
    var IDLE_MIN = 6000, IDLE_MAX = 14000, IDLE_SHOW = 900;
    var SQUASH = [
        { transform: 'scale(1, 1)', easing: 'ease-in' },
        { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
        { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
        { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
        { transform: 'scale(1, 1)' }
    ];

    // background-size 300% makes each cell a clean 0/50/100% step on both axes.
    function cell(list, name) {
        var i = list.indexOf(name);
        return (i % 3) * 50 + '% ' + Math.floor(i / 3) * 50 + '%';
    }
    function wrap(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }
    function layer(src) {
        var s = document.createElement('span');
        s.style.cssText = 'position:absolute;inset:0;background:url("' + src + '") no-repeat;background-size:300% 300%;transition:none';
        return s;
    }

    function mount(button) {
        var base = button.dataset.mascot;
        var squash = document.createElement('span');
        squash.style.cssText = 'position:relative;display:block;width:100%;height:100%;transform-origin:50% 78%';
        var face = layer(base + '-directions.webp');
        // Always mounted so the sheet is fetched up front, never on the first click.
        var react = layer(base + '-reactions.webp');
        react.style.opacity = '0';
        squash.appendChild(face);
        squash.appendChild(react);
        button.appendChild(squash);

        var timers = [], boops = { count: 0, at: 0 };
        function look(dir) { face.style.backgroundPosition = cell(DIRECTIONS, dir); }
        function show(r) {
            face.style.opacity = r ? '0' : '1';
            react.style.opacity = r ? '1' : '0';
            react.style.backgroundPosition = cell(REACTIONS, r || 'blink');
        }
        look('center');
        show(null);

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            var sector = -1, pointer = null;
            var aim = function () {
                if (!pointer) return;
                var box = button.getBoundingClientRect();
                var dx = pointer.x - (box.left + box.width / 2);
                var dy = pointer.y - (box.top + box.height / 2);
                if (Math.hypot(dx, dy) < DEAD_ZONE) { sector = -1; look('center'); return; }
                // Hold the current sector until the pointer is well past its edge.
                var angle = Math.atan2(dy, dx);
                if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) return;
                sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
                look(CLOCKWISE[sector]);
            };
            window.addEventListener('pointermove', function (e) { pointer = { x: e.clientX, y: e.clientY }; aim(); }, { passive: true });
            window.addEventListener('scroll', aim, { passive: true });
        }

        // Now and then, while left alone, it smiles (or blinks) on its own.
        var idle = function () {
            setTimeout(function () {
                if (!timers.length && !document.hidden) {
                    show(Math.random() < 0.7 ? 'delighted' : 'blink');
                    timers.push(setTimeout(function () { timers = []; show(null); }, IDLE_SHOW));
                }
                idle();
            }, IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN));
        };
        idle();

        button.addEventListener('click', function () {
            timers.forEach(clearTimeout);
            timers = [];
            var later = function (ms, next) { timers.push(setTimeout(function () { if (!next) timers = []; show(next); }, ms)); };
            var now = Date.now();
            boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
            boops.at = now;
            if (boops.count >= DIZZY_AFTER) {
                boops.count = 0;
                show('dizzy');
                later(DIZZY_END, null);
            } else {
                show('blink');
                later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
                later(BOOP_END, null);
            }
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !squash.animate) return;
            // Per-keyframe easing with the effect itself linear, so the bounce is not front-loaded.
            squash.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
        });
    }

    window.Mascot = { mount: mount };
    document.querySelectorAll('[data-mascot]').forEach(mount);
})();
