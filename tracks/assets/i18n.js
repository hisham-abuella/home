/* ==========================================================================
   Mockup language switch — English and Egyptian Arabic.

   English is written in the markup. Each element that changes carries
   data-i18n="key", and the page holds its Arabic in
   <script type="application/json" id="i18n-ar">{ "key": "…" }</script>.
   Any button with [data-lang-toggle] flips the language; ?lang=ar opens in
   Arabic. Labels only screen readers hear change too: data-i18n-aria="key"
   swaps aria-label and data-i18n-alt="key" swaps an image's alt, from the
   same Arabic block. Links to articles (Articles/<slug>.html) open the Arabic
   version (Articles/ar/<slug>.html) while the page is in Arabic, and a link with
   data-href-ar="…" opens that address instead. Switching sets <html lang dir>, so layout written with logical
   properties (inline-start/end) mirrors itself without per-page RTL rules.
   ========================================================================== */

(function () {
    'use strict';

    var root = document.documentElement;
    var source = document.getElementById('i18n-ar');
    var ar = source ? JSON.parse(source.textContent) : {};
    var nodes = document.querySelectorAll('[data-i18n]');

    var attrs = [['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt']];

    nodes.forEach(function (el) { el.dataset.en = el.innerHTML; });
    var articleLinks = Array.prototype.filter.call(document.querySelectorAll('a[href]'), function (a) {
        return /(^|\/)Articles\/[\w-]+\.html/.test(a.getAttribute('href'));
    });
    articleLinks.forEach(function (a) { a.dataset.hrefEn = a.getAttribute('href'); });
    attrs.forEach(function (a) {
        document.querySelectorAll('[' + a[0] + ']').forEach(function (el) {
            el.setAttribute(a[0] + '-en', el.getAttribute(a[1]) || '');
        });
    });

    function apply(lang) {
        var isAr = lang === 'ar';
        root.lang = isAr ? 'ar-EG' : 'en';
        root.dir = isAr ? 'rtl' : 'ltr';
        nodes.forEach(function (el) {
            var text = isAr ? ar[el.dataset.i18n] : el.dataset.en;
            if (text != null) el.innerHTML = text;
        });
        attrs.forEach(function (a) {
            document.querySelectorAll('[' + a[0] + ']').forEach(function (el) {
                var text = isAr ? ar[el.getAttribute(a[0])] : el.getAttribute(a[0] + '-en');
                if (text != null) el.setAttribute(a[1], text);
            });
        });
        document.querySelectorAll('a[data-href-ar]').forEach(function (a) {
            if (!a.dataset.hrefEn) a.dataset.hrefEn = a.getAttribute('href');
            a.setAttribute('href', isAr ? a.dataset.hrefAr : a.dataset.hrefEn);
        });
        articleLinks.forEach(function (a) {
            a.setAttribute('href', isAr ? a.dataset.hrefEn.replace(/Articles\//, 'Articles/ar/') : a.dataset.hrefEn);
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

    // Opened as the Arabic page: point canonical and og:url at the ?lang=ar address.
    if (param === 'ar') {
        var canonical = document.querySelector('link[rel="canonical"]');
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (canonical) canonical.href = canonical.href.split('?')[0] + '?lang=ar';
        if (ogUrl) ogUrl.content = ogUrl.content.split('?')[0] + '?lang=ar';
    }

    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
        b.addEventListener('click', function () { apply(root.dir === 'rtl' ? 'en' : 'ar'); });
    });
    apply(start);
})();
