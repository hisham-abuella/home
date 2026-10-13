/* ==========================================================================
   Mockup language switch — English and Egyptian Arabic.

   English is written in the markup. Each element that changes carries
   data-i18n="key", and the page holds its Arabic in
   <script type="application/json" id="i18n-ar">{ "key": "…" }</script>.
   Any button with [data-lang-toggle] flips the language; ?lang=ar opens in
   Arabic. Switching sets <html lang dir>, so layout written with logical
   properties (inline-start/end) mirrors itself without per-page RTL rules.
   ========================================================================== */

(function () {
    'use strict';

    var root = document.documentElement;
    var source = document.getElementById('i18n-ar');
    var ar = source ? JSON.parse(source.textContent) : {};
    var nodes = document.querySelectorAll('[data-i18n]');

    nodes.forEach(function (el) { el.dataset.en = el.innerHTML; });

    function apply(lang) {
        var isAr = lang === 'ar';
        root.lang = isAr ? 'ar-EG' : 'en';
        root.dir = isAr ? 'rtl' : 'ltr';
        nodes.forEach(function (el) {
            var text = isAr ? ar[el.dataset.i18n] : el.dataset.en;
            if (text != null) el.innerHTML = text;
        });
        document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
            b.textContent = isAr ? 'English' : 'عربي';
            b.setAttribute('lang', isAr ? 'en' : 'ar');
            b.setAttribute('aria-label', isAr ? 'Switch to English' : 'اقرا الصفحة بالعربي');
        });
        try { localStorage.setItem('mockup-lang', lang); } catch (e) { /* storage unavailable */ }
        document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }

    // First visit follows the browser language; after that, the visitor's own choice.
    var start = /^ar\b/i.test(navigator.language || '') ? 'ar' : 'en';
    try { start = localStorage.getItem('mockup-lang') || start; } catch (e) { /* storage unavailable */ }
    var param = new URLSearchParams(location.search).get('lang');
    if (param === 'ar' || param === 'en') start = param;

    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
        b.addEventListener('click', function () { apply(root.dir === 'rtl' ? 'en' : 'ar'); });
    });
    apply(start);
})();
