// Demo UIs for "How My AI Engine Works Now" (English and Arabic pages).
// Every word lives in the HTML, so each page carries its own language; this script only
// moves the demos between states. The data in the demos is made up.
// Without JavaScript every step stays visible as a static walk-through.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  // Timeline player: [data-at="ms"] appears at that time, [data-until="ms"] hides again.
  // [data-state] on a step copies its value to the demo root (for CSS), [data-play] starts it.
  function player(root) {
    var items = all(root, '[data-at]');
    var timers = [];
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      items.forEach(function (el) { el.hidden = true; el.classList.remove('on'); });
      root.removeAttribute('data-state');
      root.classList.remove('playing', 'done');
    }
    function play() {
      reset();
      root.classList.add('playing');
      var end = 0;
      items.forEach(function (el) {
        var at = +el.dataset.at, until = el.dataset.until ? +el.dataset.until : null;
        end = Math.max(end, until || at);
        timers.push(setTimeout(function () {
          el.hidden = false;
          requestAnimationFrame(function () { el.classList.add('on'); });
          if (el.dataset.state) root.setAttribute('data-state', el.dataset.state);
        }, at));
        if (until !== null) timers.push(setTimeout(function () { el.hidden = true; }, until));
      });
      timers.push(setTimeout(function () { root.classList.remove('playing'); root.classList.add('done'); }, end + 300));
    }
    reset();
    return play;
  }

  function showButtons(root) { all(root, '[data-js]').forEach(function (b) { b.hidden = false; }); }

  // Approval card: a change waits for a tap.
  function approval(root) {
    var play = player(root);
    all(root, '[data-play]').forEach(function (b) { b.addEventListener('click', play); });
    all(root, '[data-choice]').forEach(function (b) {
      b.addEventListener('click', function () { root.setAttribute('data-choice', b.dataset.choice); });
    });
    all(root, '[data-play]').forEach(function (b) {
      b.addEventListener('click', function () { root.removeAttribute('data-choice'); });
    });
  }

  // Simple timeline demos: Thinking Buddy, crowd-check.
  // An <audio data-demo-audio> track is timed to the same timeline and starts with the tap,
  // so phone browsers allow it to play.
  function timeline(root) {
    var play = player(root);
    var audio = root.querySelector('audio[data-demo-audio]');
    all(root, '[data-play]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (audio) {
          audio.pause();
          try { audio.currentTime = 0; } catch (e) { /* not loaded yet */ }
          var p = audio.play();
          if (p && p.catch) p.catch(function () { /* no sound allowed: the demo still runs */ });
        }
        play();
      });
    });
  }

  // Image Studio: pick up to three styles, then the jobs render one at a time.
  function studio(root) {
    var chips = all(root, '[data-style-chip]');
    var tiles = all(root, '[data-tile]');
    var queue = root.querySelector('[data-queue]');
    var go = root.querySelector('[data-generate]');
    var fixCard = root.querySelector('[data-fix-card]');
    var timers = [];
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var on = c.getAttribute('aria-pressed') === 'true';
        if (!on && chips.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length >= 3) return;
        c.setAttribute('aria-pressed', on ? 'false' : 'true');
      });
    });
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      tiles.forEach(function (t) { t.hidden = true; t.classList.remove('on', 'rendering'); });
      if (queue) queue.hidden = true;
      if (fixCard) fixCard.hidden = true;
      root.removeAttribute('data-fix');
    }
    go.addEventListener('click', function () {
      reset();
      var picked = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
                        .map(function (c) { return c.dataset.styleChip; });
      if (!picked.length) picked = chips.slice(0, 3).map(function (c) { return c.dataset.styleChip; }); // "none" = chosen for you
      if (queue) queue.hidden = false;
      var step = reduce ? 300 : 1400;
      picked.forEach(function (name, i) {
        var tile = root.querySelector('[data-tile="' + name + '"]');
        if (!tile) return;
        timers.push(setTimeout(function () { tile.hidden = false; tile.classList.add('rendering'); }, i * step));
        timers.push(setTimeout(function () {
          tile.classList.remove('rendering');
          requestAnimationFrame(function () { tile.classList.add('on'); });
          // A flagged image gets a fix offer; the fix always asks first.
          if (fixCard && tile.querySelector('.issue')) fixCard.hidden = false;
        }, (i + 1) * step - 150));
      });
      timers.push(setTimeout(function () { if (queue) queue.hidden = true; }, picked.length * step));
    });
    all(root, '[data-fix-choice]').forEach(function (b) {
      b.addEventListener('click', function () { root.setAttribute('data-fix', b.dataset.fixChoice); });
    });
    reset();
  }

  // Finance: starts locked; a turn on Claude cannot see it.
  function finance(root) {
    var form = root.querySelector('[data-unlock]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      root.setAttribute('data-state', 'open');
      var first = root.querySelector('[data-after-unlock]');
      if (first) first.focus();
    });
    all(root, '[data-lock]').forEach(function (b) {
      b.addEventListener('click', function () {
        root.removeAttribute('data-state'); root.removeAttribute('data-ask');
        form.reset();
      });
    });
    all(root, '[data-ask]').forEach(function (b) {
      b.addEventListener('click', function () { root.setAttribute('data-ask', b.dataset.ask); });
    });
  }

  var kinds = { approval: approval, buddy: timeline, crowd: timeline, studio: studio, finance: finance };
  all(document, '[data-demo]').forEach(function (root) {
    var fn = kinds[root.dataset.demo];
    if (!fn) return;
    root.setAttribute('data-ready', '');
    showButtons(root);
    fn(root);
  });
})();
