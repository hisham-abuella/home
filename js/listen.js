// "Listen to this article": the player stays hidden until the narration exists,
// so an article whose audio hasn't been generated yet shows nothing at all.
// Arabic narration (audio/articles/ar/) is listed in audio/articles/ar/available.json;
// a slug that isn't listed there is never probed, so missing files log no 404.
(function () {
  function show(box, src) {
    fetch(src, { method: 'HEAD' })
      .then(function (response) {
        if (!response.ok) return;
        box.querySelector('audio').src = src;
        box.hidden = false;
      })
      .catch(function () { /* offline, or no audio yet */ });
  }

  var manifests = {};
  function manifestFor(dir) {
    if (!manifests[dir]) {
      manifests[dir] = fetch(dir + 'available.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : []; })
        .catch(function () { return []; });
    }
    return manifests[dir];
  }

  document.querySelectorAll('.listen[data-src]').forEach(function (box) {
    var src = box.getAttribute('data-src');
    var m = src.match(/^(.*audio\/articles\/ar\/)([^\/]+)\.mp3$/);
    if (!m) { show(box, src); return; }
    manifestFor(m[1]).then(function (list) {
      if (Array.isArray(list) && list.indexOf(m[2]) !== -1) show(box, src);
    });
  });
})();
