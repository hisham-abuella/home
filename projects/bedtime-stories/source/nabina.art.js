/* The Prophet Loved — what he loved, never him.
   There is no figure standing in for the Prophet, peace be upon him, on any
   page: every drawing is a thing or a child, and the pages about him show the
   gentleness rather than the man. */

function mosque(cx, cy, s) {
  s = s || 1;
  return g(
    rect(-110, -20, 220, 110, 10, CREAM) +
    path('M-78 -20 q0 -78 78 -82 q78 4 78 82 z', DEEP) +
    path('M0 -102 v-26', null, 8) +
    crescent(0, -142, 18, CREAM) +
    rect(-104, -96, 20, 76, 8, CREAM) +
    rect(84, -96, 20, 76, 8, CREAM) +
    path('M-94 -96 q0 -22 10 -22 q10 0 10 22 z', DEEP) +
    path('M94 -96 q0 -22 10 -22 q10 0 10 22 z', DEEP) +
    path('M-34 90 v-44 q0 -34 34 -34 q34 0 34 34 v44 z', GOLD),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

/* a plate of dates */
function dates(cx, cy, s) {
  s = s || 1;
  return g(
    path('M-78 0 h156 a78 42 0 0 1 -156 0 z', CREAM) +
    ell(-34, -12, 20, 13, CLAY, 6) + ell(2, -20, 20, 13, CLAY, 6) +
    ell(38, -12, 20, 13, CLAY, 6) + ell(-14, -32, 20, 13, CLAY, 6) +
    ell(22, -36, 20, 13, CLAY, 6),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

ART.cover = svg('A mosque with a green dome under a crescent moon',
  star(74, 72, 16) + star(330, 96, 13) +
  mosque(200, 252, 1.02));

ART.children = svg('Two small children side by side',
  child(142, 206, 1.25, CLAY) +
  child(262, 216, 1.1, DEEP));

ART.salam = svg('A child with an open hand raised in greeting',
  child(166, 220, 1.3, MINT) +
  hand(286, 196, 1.15));

ART.smile = svg('A smiling child',
  g(circ(0, 0, 96, SKIN) +
    '<circle cx="-34" cy="-14" r="11" fill="' + INK + '"/>' +
    '<circle cx="34" cy="-14" r="11" fill="' + INK + '"/>' +
    path('M-44 26 q44 44 88 0', null, 10),
    'transform="translate(200,194)"') +
  star(332, 78, 15) + star(70, 96, 12));

ART.cat = svg('A cat drinking from a bowl of water',
  cat(178, 176, 1.15) +
  bowl(200, 318, 0.9, SKY));

ART.dates = svg('A plate of dates and a cup of milk',
  dates(156, 244, 1.05) +
  cup(300, 232, 0.92, CREAM));

ART.clean = svg('A water jug, a cup and a green twig',
  g(path('M62 -24 q30 4 30 32 q0 28 -30 30', null, 9) +
    path('M-62 -56 q0 -20 22 -20 h80 q22 0 22 20 l-12 112 q-2 20 -24 20 h-52 q-22 0 -24 -20 z', SKY),
    'transform="translate(168,222)"') +
  g(path('M0 -70 v140', null, 13).replace('stroke="' + INK + '"', 'stroke="' + LEAF + '"') +
    path('M0 -70 v140', null, 19).replace('fill="none"', 'fill="none" opacity=".001"') +
    path('M-10 -74 q10 -14 20 0 q-10 8 -20 0 z', LEAF),
    'transform="translate(312,230)"'));

ART.bread = svg('A loaf of bread held out in two hands',
  loaf(200, 168, 1.1) +
  hand(142, 300, 1.05) +
  hand(258, 300, 1.05, true));

ART.home = svg('A lamp, a folded cloak and a broom at home',
  path('M60 318 h280', null, 9) +
  g(path('M-30 -4 q0 -44 30 -44 q30 0 30 44 z', GOLD) + path('M-18 -4 h36 l8 4 h-52 z', CLAY) + circ(0, -62, 11, SAND, 6),
    'transform="translate(122,316)"') +
  rect(196, 238, 104, 32, 8, MINT) +
  rect(206, 268, 84, 26, 8, CREAM) +
  g(path('M0 -96 v70', null, 11) + path('M-24 -26 h48 l12 52 h-72 z', SAND),
    'transform="translate(324,290)"'));

ART.goodnight = svg('A mosque at night under a crescent and stars',
  crescent(316, 84, 42, CREAM) +
  star(80, 70, 17) + star(140, 128, 11) + star(252, 58, 12) +
  mosque(196, 288, 0.84));
