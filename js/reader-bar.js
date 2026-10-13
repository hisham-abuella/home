/* ==========================================================================
   Reader bar for articles. When the page has a skin (set in the pre-paint
   snippet from the visitor's reader track), add the track's own controls:
   a chip back to the track page (catalogue = recruiter, constellation = engineer,
   terminal = vibe coder, journal = learner), "change" to the gateway (index.html?choose), and the same
   Auto / Light / Dark pill. On Arabic pages (dir="rtl") the labels are Egyptian Arabic and the
   links open the Arabic track and gateway. The pill drives the page's appearance switch, so
   there is one preference, shared with the footer and with the tracks.

   Load after js/appearance.js:  <script src="../js/reader-bar.js" defer></script>
   ========================================================================== */

(function () {
    'use strict';

    var root = document.documentElement;
    var skin = root.getAttribute('data-skin');
    if (!skin) return;

    // Links are built from the site root, found from this script's own address, so the bar
    // works from Articles/ and from the Arabic pages in Articles/ar/.
    var script = document.currentScript || document.querySelector('script[src*="reader-bar.js"]');
    var SITE = new URL('../', script.src).href;
    var ar = root.dir === 'rtl';
    var TRACK = {
        catalogue: { page: 'recruiter.html', label: ['Recruiter track', 'مسار التوظيف'] },
        constellation: { page: 'engineer.html', label: ['Engineer track', 'مسار المهندسين'] },
        terminal:  { page: 'vibe.html',      label: ['Vibe coder track', 'مسار الـ vibe coding'] },
        journal:   { page: 'learner.html',   label: ['Learner track', 'مسار التعلّم'] }
    }[skin];
    if (!TRACK) return;
    var T = function (en, arabic) { return ar ? arabic : en; };

    var CHOICES = [['auto', T('Auto', 'تلقائي')], ['daylight', T('Light', 'فاتح')],
                   ['midnight', T('Dark', 'غامق')], ['contrast', T('Contrast', 'تباين عالي')]];

    var bar = document.createElement('div');
    bar.className = 'reader-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', T('Reader controls', 'إعدادات القراية'));

    var track = document.createElement('div');
    track.className = 'reader-track';
    var back = document.createElement('a');
    back.href = SITE + 'tracks/' + TRACK.page + (ar ? '?lang=ar' : '');
    back.textContent = TRACK.label[ar ? 1 : 0];
    var change = document.createElement('a');
    change.className = 'reader-change';
    change.href = SITE + 'index.html?choose' + (ar ? '&lang=ar' : '');
    change.textContent = T('change', 'غيّر');
    track.appendChild(back);
    track.appendChild(change);

    var pill = document.createElement('div');
    pill.className = 'reader-theme';
    pill.setAttribute('role', 'group');
    pill.setAttribute('aria-label', T('Theme', 'المظهر'));
    CHOICES.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.choice = c[0];
        b.textContent = c[1];
        // Contrast is never skinned and has no control here: its button only appears to show the stored state.
        if (c[0] === 'contrast') b.hidden = true;
        pill.appendChild(b);
    });

    bar.appendChild(track);
    bar.appendChild(pill);

    // Under the navigation on a laptop; CSS docks it to the bottom on a phone.
    var nav = document.querySelector('nav, .nav, header');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(bar, nav.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);

    function sync(preference) {
        pill.querySelectorAll('button').forEach(function (b) {
            if (b.dataset.choice === 'contrast') b.hidden = preference !== 'contrast';
            b.setAttribute('aria-pressed', String(b.dataset.choice === preference));
        });
    }

    pill.addEventListener('click', function (event) {
        var b = event.target.closest('button');
        if (!b) return;
        // Use the page's own appearance switch, so saving and repainting stay in one place.
        var source = document.querySelector('.appearance-set button[data-appearance="' + b.dataset.choice + '"]');
        if (source) source.click();
    });

    document.addEventListener('appearancechange', function (event) { sync(event.detail.preference); });
    sync(root.getAttribute('data-appearance-preference') || 'auto');
})();
