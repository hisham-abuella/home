/* ==========================================================================
   Mascot buddy — mini Hisham pops up in a random spot on articles, tracks and
   the full site, with a short speech bubble in the page's language. Needs
   mascot.js loaded first. Click him for another line; the × hides him for
   good (localStorage 'mascot-buddy' = 'off'). Phones keep him above the
   docked bars, wait for the first real scroll before he appears, and only
   show the bubble when he is tapped (it hides again on scroll), so it never
   sits over the article's opening or its "Listen" player. Printing hides him.
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
        '.mb-x{position:absolute;top:4px;inset-inline-end:4px;width:22px;height:22px;padding:0;border:0;border-radius:50%;background:none;color:#4A5568;font:600 16px/1 system-ui,sans-serif;cursor:pointer}',
        '.mb-x:hover{background:#EEF1F5;color:#14181F}',
        '.mb :focus-visible{outline:2px solid #0040FF;outline-offset:2px}',
        '.mb{animation:mb-in .5s cubic-bezier(.3,1.4,.5,1) both}',
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

    var phone = window.matchMedia('(max-width: 899px)').matches;
    function appear() {
        document.body.appendChild(box);
        window.Mascot.mount(btn);
        var isAr = ar();
        btn.setAttribute('aria-label', LABEL[isAr ? 1 : 0]);
        x.setAttribute('aria-label', HIDE[isAr ? 1 : 0]);
        if (!phone) speak(7000);
    }

    if (!phone) { setTimeout(appear, 2500); return; }

    // Phone: appear after the first real scroll; a scroll also tucks the bubble away.
    var startY = window.scrollY, shown = false;
    window.addEventListener('scroll', function () {
        if (!shown) {
            if (Math.abs(window.scrollY - startY) < 80) return;
            shown = true;
            appear();
            return;
        }
        if (!say.classList.contains('off')) { clearTimeout(hideTimer); say.classList.add('off'); }
    }, { passive: true });
})();
