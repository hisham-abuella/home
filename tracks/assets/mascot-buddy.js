/* ==========================================================================
   Mascot buddy — mini Hisham pops up in a random spot on articles, tracks and
   the full site, with a short speech bubble in the page's language. Needs
   mascot.js loaded first. Click him for another line; the × hides him for
   good (localStorage 'mascot-buddy' = 'off'). Phones keep him above the
   docked bars, wait for the first real scroll before he appears, and only
   show the bubble when he is tapped (it hides again on scroll), so it never
   sits over the article's opening or its "Listen" player. He fades out while
   the page scrolls, and when it settles he takes whichever side is clear of
   links, buttons and text (he stays hidden if neither is), so he never covers
   a control or a line of text for long. Printing hides him.
   ========================================================================== */

(function () {
    'use strict';

    var KEY = 'mascot-buddy';
    try { if (localStorage.getItem(KEY) === 'off') return; } catch (e) { /* storage unavailable */ }
    if (!window.Mascot) return;

    var base = new URL('mascot/hisham', document.currentScript.src).href;

    // [English, Egyptian Arabic]
    var LINES = [
        ['Hi! I\'m mini Hisham.', 'أهلاً! أنا هشام الصغير.'],
        ['Built with Claude, one prompt at a time.', 'اتبنى مع Claude، prompt ورا prompt.'],
        ['Signal looks good from here.', 'الإشارة هنا حلوة.'],
        ['Still learning. Always.', 'لسه بتعلم. وعلى طول.'],
        ['Psst… click me.', 'بُص… دوس عليّا.'],
        ['Every bug is a lesson.', 'كل bug درس.'],
        ['Good choice of page.', 'اخترت صفحة حلوة.'],
        ['Low latency, high vibes.', 'latency قليلة وvibes عالية.'],
        ['Keep going, the good part is coming.', 'كمّل، الحلو جاي.'],
        ['I watch your cursor. Politely.', 'أنا بتابع الـ cursor بتاعك. بأدب.']
    ];
    var LABEL = ['Boop mini Hisham', 'دوس على هشام الصغير'];
    var HIDE = ['Hide mini Hisham', 'خبّي هشام الصغير'];
    // Spots: [vertical, horizontal]. Middle spots are laptop only.
    var SPOTS = [['bottom', 'right'], ['bottom', 'left'], ['middle', 'right'], ['middle', 'left']];
    var wide = window.matchMedia('(min-width: 1200px)').matches;
    var spot = SPOTS[Math.floor(Math.random() * (wide ? 4 : 2))];

    var css = document.createElement('style');
    css.textContent = [
        '.mb{position:fixed;z-index:50;direction:ltr;display:flex;align-items:flex-start;gap:6px;pointer-events:none}',
        '.mb[data-v=bottom]{bottom:24px}.mb[data-v=middle]{top:50%;margin-top:-48px}',
        '.mb[data-h=right]{right:12px;flex-direction:row-reverse}.mb[data-h=left]{left:12px}',
        '.mb .mascot{position:relative;flex:none;width:96px;height:96px;padding:0;border:0;background:none;cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent}',
        '.mb-say{position:relative;margin-top:10px;max-width:210px;padding:9px 30px 9px 12px;border:1.5px solid #14181F;border-radius:14px;background:#FFF;color:#14181F;font:600 14px/1.35 "Barlow",system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.18);pointer-events:auto;transition:opacity .25s,transform .25s}',
        '.mb-say[dir=rtl]{padding:9px 12px 9px 30px;font-family:"IBM Plex Sans Arabic",system-ui,sans-serif;line-height:1.6}',
        '.mb-say.off{opacity:0;transform:translateY(4px);pointer-events:none}',
        '.mb-x{position:absolute;top:-7px;inset-inline-end:-7px;display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:none;color:#4A5568;font:600 16px/1 system-ui,sans-serif;cursor:pointer;z-index:0}',
        '.mb-x::before{content:"";position:absolute;top:11px;left:11px;width:22px;height:22px;border-radius:50%;z-index:-1}',
        '.mb-x:hover{color:#14181F}.mb-x:hover::before{background:#EEF1F5}',
        '.mb-x:focus-visible{outline-offset:-9px}',
        '.mb{transition:opacity .2s,visibility 0s}',
        '.mb.mb-away{opacity:0;visibility:hidden;transition:opacity .2s,visibility 0s .2s}',
        '.mb.mb-away *{pointer-events:none!important}',
        '.mb :focus-visible{outline:2px solid #0040FF;outline-offset:2px}',
        '.mb{animation:mb-in .5s cubic-bezier(.3,1.4,.5,1) backwards}',
        '@keyframes mb-in{from{opacity:0;transform:translateY(24px) scale(.85)}}',
        '@media (max-width:899px){.mb[data-v]{top:auto;margin:0;bottom:calc(92px + env(safe-area-inset-bottom,0px))}.mb .mascot{width:56px;height:56px}.mb-say{max-width:170px;font-size:13px;margin-top:4px}}',
        '@media (prefers-reduced-motion:reduce){.mb,.mb-say{animation:none;transition:none}}',
        '@media print{.mb{display:none!important}}'
    ].join('\n');
    document.head.appendChild(css);

    function ar() { return document.documentElement.dir === 'rtl'; }
    function pick(i) { return LINES[i][ar() ? 1 : 0]; }

    var box = document.createElement('div');
    box.className = 'mb';
    box.dataset.v = spot[0];
    box.dataset.h = spot[1];
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mascot';
    btn.dataset.mascot = base;
    var say = document.createElement('div');
    say.className = 'mb-say off';
    var text = document.createElement('span');
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'mb-x';
    x.textContent = '×';
    say.appendChild(text);
    say.appendChild(x);
    box.appendChild(btn);
    box.appendChild(say);

    var line = -1, hideTimer = 0;
    function speak(ms) {
        var next;
        do { next = Math.floor(Math.random() * LINES.length); } while (next === line && LINES.length > 1);
        line = next;
        var isAr = ar();
        text.textContent = pick(line);
        say.dir = isAr ? 'rtl' : 'ltr';
        say.lang = isAr ? 'ar-EG' : 'en';
        btn.setAttribute('aria-label', LABEL[isAr ? 1 : 0]);
        x.setAttribute('aria-label', HIDE[isAr ? 1 : 0]);
        say.classList.remove('off');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { say.classList.add('off'); }, ms);
    }

    btn.addEventListener('click', function () { speak(5000); });
    x.addEventListener('click', function () {
        try { localStorage.setItem(KEY, 'off'); } catch (e) { /* storage unavailable */ }
        box.remove();
    });

    // --- Stay clear of controls and text --------------------------------
    var CONTROLS = 'a[href],button,input,select,textarea,summary,label,audio,video,iframe,[role=button],[role=link],[role=tab],[tabindex]:not([tabindex="-1"])';
    var home = spot[1];

    // Is there a line of text under this point? Uses the caret's text node and
    // its line boxes, which holds for right-to-left and mixed-direction lines too.
    function charAt(x, y) {
        var node;
        if (document.caretPositionFromPoint) {
            var p = document.caretPositionFromPoint(x, y);
            node = p && p.offsetNode;
        } else if (document.caretRangeFromPoint) {
            var r = document.caretRangeFromPoint(x, y);
            node = r && r.startContainer;
        }
        if (!node || node.nodeType !== 3 || !/\S/.test(node.data)) return false;
        var range = document.createRange();
        range.selectNodeContents(node);
        var rects = range.getClientRects();
        for (var i = 0; i < rects.length; i++) {
            var b = rects[i];
            if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) return true;
        }
        return false;
    }

    // Is anything worth seeing under the buddy if he stood on this side?
    function blocked(side) {
        box.dataset.h = side;
        // Layout position, not the drawn one, so the entrance animation does not skew it.
        var r = { left: box.offsetLeft + btn.offsetLeft, top: box.offsetTop + btn.offsetTop,
                  width: btn.offsetWidth, height: btn.offsetHeight };
        var right = r.left + r.width, bottom = r.top + r.height;
        // Any control whose box touches his, even at a corner.
        var controls = document.querySelectorAll(CONTROLS);
        for (var k = 0; k < controls.length; k++) {
            if (box.contains(controls[k])) continue;
            var c = controls[k].getBoundingClientRect();
            if (c.width && c.height && c.left < right && c.right > r.left && c.top < bottom && c.bottom > r.top) return true;
        }
        // Text: a grid of points, each checked against the glyph actually under it.
        // He is taken out of rendering while we look (display:none, not visibility),
        // because reduced-motion CSS turns a visibility change into a tiny transition
        // and the hit test would land on his own picture instead of the text beneath.
        var steps = 5, hit = false;
        box.style.display = 'none';
        for (var i = 0; i < steps && !hit; i++) {
            for (var j = 0; j < steps && !hit; j++) {
                hit = charAt(r.left + 3 + (r.width - 6) * i / (steps - 1), r.top + 3 + (r.height - 6) * j / (steps - 1));
            }
        }
        box.style.display = '';
        return hit;
    }

    function place() {
        if (!box.isConnected) return;
        var sides = home === 'right' ? ['right', 'left'] : ['left', 'right'];
        var side = null;
        for (var i = 0; i < sides.length; i++) {
            if (!blocked(sides[i])) { side = sides[i]; break; }
        }
        box.dataset.h = side || home;
        box.classList.toggle('mb-away', !side);
        if (!side) { clearTimeout(hideTimer); say.classList.add('off'); }
    }

    // Check now, and again once scroll reveals and other entrances have settled.
    var settle = 0, recheck = 0;
    function settleAt(ms) {
        clearTimeout(settle);
        clearTimeout(recheck);
        settle = setTimeout(function () {
            place();
            recheck = setTimeout(place, 900);
        }, ms);
    }
    function onScroll() {
        if (!box.classList.contains('mb-away')) box.classList.add('mb-away');
        clearTimeout(hideTimer);
        say.classList.add('off');
        settleAt(350);
    }
    window.addEventListener('resize', function () { settleAt(350); });
    document.addEventListener('langchange', function () { settleAt(100); });
    // Keyboard focus landing under him moves (or hides) him.
    document.addEventListener('focusin', function (e) {
        if (!box.isConnected || box.contains(e.target) || !e.target.getBoundingClientRect) return;
        var a = e.target.getBoundingClientRect(), b = box.getBoundingClientRect();
        if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) place();
    });

    var phone = window.matchMedia('(max-width: 899px)').matches;
    function appear() {
        document.body.appendChild(box);
        window.Mascot.mount(btn);
        var isAr = ar();
        btn.setAttribute('aria-label', LABEL[isAr ? 1 : 0]);
        x.setAttribute('aria-label', HIDE[isAr ? 1 : 0]);
        settleAt(0);
        place();
        if (!phone && !box.classList.contains('mb-away')) speak(7000);
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (!phone) { setTimeout(appear, 2500); return; }

    // Phone: appear after the first real scroll has settled.
    var startY = window.scrollY, waiting = 0;
    function firstScroll() {
        if (Math.abs(window.scrollY - startY) < 80 && !waiting) return;
        clearTimeout(waiting);
        waiting = setTimeout(function () {
            window.removeEventListener('scroll', firstScroll);
            appear();
        }, 350);
    }
    window.addEventListener('scroll', firstScroll, { passive: true });
})();
