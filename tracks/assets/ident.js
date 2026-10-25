/* Copy buttons: [data-copy="text"] copies, the label inside [data-copy-label]
   confirms in the page's language, then restores itself. If the browser blocks
   the clipboard (some in-app browsers do), the label shows the text itself,
   selected, and stays long enough to copy it by hand. */
(function () {
    'use strict';
    function copy(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
        return new Promise(function (ok, fail) {
            var a = document.createElement('textarea'); a.value = text; a.style.position = 'fixed'; a.style.opacity = '0';
            document.body.appendChild(a); a.select();
            try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(); }
            document.body.removeChild(a);
        });
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-copy]');
        if (!b) return;
        var label = b.querySelector('[data-copy-label]') || b;
        // Keep the resting label once, so a second click while "Copied" shows can't overwrite it.
        if (!label.hasAttribute('data-copy-busy')) label.dataset.copyRest = label.innerHTML;
        clearTimeout(label._copyTimer);
        label.setAttribute('data-copy-busy', '');
        var ar = document.documentElement.dir === 'rtl', wait = 2000;
        copy(b.dataset.copy).then(function () { label.textContent = ar ? 'اتنسخ' : 'Copied'; }, function () {
            label.textContent = b.dataset.copy;
            label.setAttribute('dir', 'ltr'); label.style.userSelect = 'text';
            try { var r = document.createRange(); r.selectNodeContents(label); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (err) { /* no selection API */ }
            wait = 10000;
        }).then(function () {
            label._copyTimer = setTimeout(function () {
                label.innerHTML = label.dataset.copyRest;
                label.removeAttribute('data-copy-busy');
                label.removeAttribute('dir'); label.style.userSelect = '';
            }, wait);
        });
    });
})();
