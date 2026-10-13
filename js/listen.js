// "Listen to this article": the player stays hidden until the narration exists,
// so an article whose audio hasn't been generated yet shows nothing at all.
(function () {
  document.querySelectorAll('.listen[data-src]').forEach(function (box) {
    var src = box.getAttribute('data-src');
    fetch(src, { method: 'HEAD' })
      .then(function (response) {
        if (!response.ok) return;
        box.querySelector('audio').src = src;
        box.hidden = false;
      })
      .catch(function () { /* offline, or no audio yet */ });
  });
})();
