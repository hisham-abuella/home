/* Shared drawing kit for the story books.
   Every page is one motif on a 400x400 field: thick outlines, flat fills,
   plenty of empty paper. A baby resolves edges long before he resolves detail,
   so the outline is doing most of the work here. */

var SKY = '#9CC4D8', SEA = '#2F6FA8', SAND = '#E8C27A', LEAF = '#8FB58A',
    DEEP = '#2E8B74', CLAY = '#C97B4A', GOLD = '#C9842E', NIGHT = '#6E7FA8',
    CREAM = '#FCFBF6', MINT = '#8FCBB8', SKIN = '#E3B894', FUR = '#A89079',
    STRIPE = '#4F4136';

function svg(label, body) {
  return '<svg class="art breathe" viewBox="0 0 400 400" role="img" aria-label="' +
    label + '">' + body + '</svg>';
}
function g(body, attrs) { return '<g ' + (attrs || '') + '>' + body + '</g>'; }
function out(w) { return 'stroke="' + INK + '" stroke-width="' + (w || 8) + '" stroke-linejoin="round" stroke-linecap="round"'; }
function circ(cx, cy, r, fill, w) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" ' + out(w) + '/>'; }
function ell(cx, cy, rx, ry, fill, w) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" ' + out(w) + '/>'; }
function rect(x, y, w, h, r, fill, sw) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + fill + '" ' + out(sw) + '/>'; }
function path(d, fill, w) { return '<path d="' + d + '" fill="' + (fill || 'none') + '" ' + out(w) + '/>'; }

/* the sun, low and friendly */
function sun(cx, cy, r) {
  var rays = '';
  for (var i = 0; i < 8; i++) {
    var a = i * Math.PI / 4,
        x1 = cx + Math.cos(a) * (r + 14), y1 = cy + Math.sin(a) * (r + 14),
        x2 = cx + Math.cos(a) * (r + 34), y2 = cy + Math.sin(a) * (r + 34);
    rays += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
            '" stroke="' + GOLD + '" stroke-width="10" stroke-linecap="round"/>';
  }
  return rays + circ(cx, cy, r, SAND);
}

/* a crescent: one disc with a second disc of the page colour bitten out of it.
   Two arcs in a single path collapse into a lens, so this does it the way the
   zoo book's moon does — it only works on the page colour, which is what the
   stage always is. */
function crescent(cx, cy, r, fill) {
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (fill || CREAM) + '" ' + out(8) + '/>' +
         '<circle cx="' + (cx + r * 0.36) + '" cy="' + (cy - r * 0.22) + '" r="' + (r * 0.86) + '" fill="' + PAPER + '"/>';
}

function star(cx, cy, r, fill) {
  var p = '';
  for (var i = 0; i < 10; i++) {
    var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.44 : r;
    p += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1) + ' ';
  }
  return '<path d="' + p + 'z" fill="' + (fill || SAND) + '" ' + out(6) + '/>';
}

/* a child: round head, round body, no features beyond eyes and a smile */
function child(cx, cy, s, shirt) {
  s = s || 1;
  var t = 'translate(' + cx + ',' + cy + ') scale(' + s + ')';
  return g(
    path('M-38 86 q0 -62 38 -62 q38 0 38 62 z', shirt || CLAY) +
    circ(0, -24, 40, SKIN) +
    '<circle cx="-14" cy="-28" r="5" fill="' + INK + '"/>' +
    '<circle cx="14" cy="-28" r="5" fill="' + INK + '"/>' +
    path('M-13 -6 q13 12 26 0', null, 6),
    'transform="' + t + '"');
}

/* an open hand, fingers up */
function hand(cx, cy, s, flip) {
  s = s || 1;
  return g(
    path('M-26 40 q-6 -34 -4 -56 q2 -12 10 -11 q8 1 8 13 l0 26 l0 -46 q0 -12 9 -12 q9 0 9 12 l0 44 l0 -38 q0 -12 9 -12 q9 0 9 12 l0 40 l2 -26 q2 -11 10 -10 q8 2 7 13 l-6 44 q-4 24 -28 24 q-26 0 -35 -17 z', SKIN),
    'transform="translate(' + cx + ',' + cy + ') scale(' + (flip ? -s : s) + ',' + s + ')"');
}

/* a simple sitting cat, Susu-coloured: body, head, ears, tail, whiskers */
function cat(cx, cy, s) {
  s = s || 1;
  return g(
    path('M48 44 q44 4 40 -34 q-2 -18 -18 -15 q-13 3 -10 17', null, 14) +
    ell(0, 34, 50, 54, FUR) +
    path('M0 -12 q24 22 24 60 q0 24 -24 26 q-24 -2 -24 -26 q0 -38 24 -60 z', CREAM, 0) +
    path('M-42 -40 l4 -40 l34 24 z', FUR) +
    path('M42 -40 l-4 -40 l-34 24 z', FUR) +
    ell(0, -26, 44, 38, FUR) +
    '<circle cx="-16" cy="-32" r="7" fill="' + INK + '"/>' +
    '<circle cx="16" cy="-32" r="7" fill="' + INK + '"/>' +
    path('M0 -10 l-8 -7 h16 z', '#E0919E', 4) +
    path('M-44 -16 h-22 M-44 -6 h-20 M44 -16 h22 M44 -6 h20', null, 4),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a bowl, optionally full */
function bowl(cx, cy, s, fill) {
  s = s || 1;
  return g(
    path('M-56 -8 h112 a56 56 0 0 1 -112 0 z', CREAM) +
    (fill ? path('M-44 -8 q44 -18 88 0 z', fill, 6) : ''),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a loaf of bread, scored on top */
function loaf(cx, cy, s) {
  s = s || 1;
  return g(
    path('M-82 34 q-8 -72 82 -72 q90 0 82 72 z', GOLD) +
    path('M-44 -16 l16 -16 M-6 -22 l16 -16 M32 -16 l16 -16', null, 7),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a cup with a handle */
function cup(cx, cy, s, fill) {
  s = s || 1;
  return g(
    path('M44 -16 q26 0 26 22 q0 22 -26 22', null, 8) +
    path('M-44 -30 h88 l-8 72 q-2 14 -16 14 h-40 q-14 0 -16 -14 z', fill || CREAM),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a water drop */
function drop(cx, cy, s, fill) {
  s = s || 1;
  return g(path('M0 -46 q34 40 34 62 a34 34 0 0 1 -68 0 q0 -22 34 -62 z', fill || SKY),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a date palm: a short thick trunk under a wide crown, so it reads as a tree
   and not as a sprig floating above a line */
function palmTree(cx, cy, s) {
  s = s || 1;
  return g(
    path('M-13 150 q-8 -86 4 -152 l20 2 q-10 68 2 150 z', CLAY) +
    path('M-10 90 h18 M-11 46 h20 M-10 2 h20', null, 5) +
    g(path('M0 0 q-76 -34 -106 22 q62 22 106 -22 z', LEAF) +
      path('M0 0 q76 -34 106 22 q-62 22 -106 -22 z', LEAF) +
      path('M0 0 q-36 -76 22 -96 q30 58 -22 96 z', LEAF) +
      path('M0 0 q48 -68 100 -40 q-40 52 -100 40 z', LEAF) +
      path('M0 0 q-54 -62 -102 -26 q44 50 102 26 z', LEAF) +
      circ(-20, 24, 12, CLAY, 5) + circ(12, 30, 12, CLAY, 5) + circ(-4, 46, 12, CLAY, 5),
      'transform="translate(0,-4)"'),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* rolling hills along the bottom */
function ground(y, fill) {
  return path('M0 ' + y + ' q100 -34 200 0 q100 34 200 0 L400 400 L0 400 z', fill || LEAF);
}
