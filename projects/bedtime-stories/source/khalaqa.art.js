/* Allah Made It — eight pieces of the world. */

function puff(cx, cy, s) {
  s = s || 1;
  return g(path('M-86 24 a40 40 0 0 1 8 -78 a52 52 0 0 1 96 -16 a44 44 0 0 1 60 48 a34 34 0 0 1 -26 46 z', CREAM),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

ART.cover = svg('A crescent moon, a palm tree and the sea',
  crescent(306, 86, 44, CREAM) +
  star(104, 70, 16) +
  path('M0 258 q100 -30 200 0 q100 30 200 0 L400 400 L0 400 z', SEA) +
  path('M0 300 q100 -26 200 0 q100 26 200 0 L400 400 L0 400 z', DEEP) +
  palmTree(116, 230, .86));

ART.sky = svg('A wide blue sky with two clouds',
  rect(32, 56, 336, 230, 24, SKY) +
  puff(146, 158, .74) +
  puff(268, 222, .54) +
  sun(300, 116, 30));

ART.sea = svg('The sea coming up the sand',
  rect(32, 70, 336, 128, 16, SKY) +
  path('M32 180 q84 -34 168 0 q84 34 168 0 v76 H32 z', SEA) +
  path('M32 232 q84 -30 168 0 q84 30 168 0 v24 H32 z', DEEP) +
  path('M32 256 h336 v62 a16 16 0 0 1 -16 16 H48 a16 16 0 0 1 -16 -16 z', SAND));

ART.palm = svg('A tall date palm in the sand',
  path('M0 320 q100 -26 200 0 q100 26 200 0 L400 400 L0 400 z', SAND) +
  palmTree(200, 196, 1.15));

ART.bee = svg('A bee with round wings',
  g(ell(-54, -34, 36, 26, CREAM) + ell(54, -34, 36, 26, CREAM) +
    ell(0, 10, 66, 52, SAND) +
    path('M-26 -34 q10 76 0 88 M14 -40 q12 84 0 94', null, 11) +
    circ(-70, 14, 24, INK, 0) +
    '<circle cx="-78" cy="8" r="6" fill="' + CREAM + '"/>' +
    path('M-80 -14 q-10 -22 -26 -26 M-62 -18 q-4 -26 -18 -34', null, 6),
    'transform="translate(208,198) scale(1.1)"'));

ART.bird = svg('A small red bird on a branch',
  path('M48 300 q120 -26 300 -10', null, 12) +
  g(ell(0, 0, 58, 44, RED) + circ(44, -32, 31, RED) +
    path('M70 -34 l34 11 -34 13 z', GOLD) +
    '<circle cx="52" cy="-38" r="7" fill="' + CREAM + '"/>' +
    path('M-32 -8 q-26 -20 -56 6 q30 22 56 -6 z', CLAY) +
    path('M-10 42 v22 M24 44 v20', null, 8),
    'transform="translate(176,214)"'));

ART.cat = svg('A cat with wide eyes in the dark',
  cat(200, 210, 1.5) +
  star(336, 86, 15) + star(72, 100, 12));

ART.moon = svg('A crescent moon and many stars',
  crescent(196, 196, 108, CREAM) +
  star(324, 96, 22) + star(86, 92, 16) + star(100, 300, 14) + star(316, 290, 12) + star(236, 44, 11));

ART.rain = svg('Rain falling on green ground',
  puff(200, 118, 1) +
  g(path('M0 0 v46', null, 10), 'transform="translate(132,200)"') +
  g(path('M0 0 v60', null, 10), 'transform="translate(186,206)"') +
  g(path('M0 0 v46', null, 10), 'transform="translate(242,200)"') +
  g(path('M0 0 v36', null, 10), 'transform="translate(292,212)"') +
  path('M0 316 q100 -28 200 0 q100 28 200 0 L400 400 L0 400 z', LEAF));

ART.goodnight = svg('A crescent moon over a sleeping child',
  crescent(292, 104, 56, CREAM) +
  star(96, 88, 16) + star(150, 148, 11) +
  rect(60, 246, 280, 96, 20, MINT) +
  circ(122, 226, 44, SKIN) +
  path('M102 220 q10 -8 20 0 M142 220 q10 -8 20 0', null, 5) +
  path('M114 244 q10 8 20 0', null, 5));
