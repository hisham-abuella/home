/* Copy buttons in the identity block: [data-copy="text"] copies, the label inside
   [data-copy-label] confirms in the page's language, then restores itself. */
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
        var b = e.target.closest && e.target.closest('.ident [data-copy]');
        if (!b) return;
        var label = b.querySelector('[data-copy-label]') || b, before = label.innerHTML;
        var ar = document.documentElement.dir === 'rtl';
        copy(b.dataset.copy).then(function () { label.textContent = ar ? 'اتنسخ' : 'Copied'; },
                                  function () { label.textContent = b.dataset.copy; })
            .then(function () { setTimeout(function () { label.innerHTML = before; }, 2000); });
    });
})();
