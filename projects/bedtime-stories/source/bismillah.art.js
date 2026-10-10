/* Bismillah — one ordinary moment of the day on every page. */

ART.cover = svg('The sun rising over a quiet house',
  sun(200, 150, 62) +
  ground(272, SAND) +
  path('M118 272 v-64 l82 -56 l82 56 v64 z', CREAM) +
  path('M118 208 l82 -56 l82 56', null, 8) +
  rect(174, 216, 52, 56, 6, GOLD));

ART.waking = svg('Morning light coming in at a window',
  rect(96, 70, 208, 240, 12, SKY) +
  path('M200 70 v240 M96 190 h208', null, 8) +
  sun(258, 128, 34) +
  path('M60 330 h280', null, 8) +
  path('M96 310 l-30 20 M304 310 l30 20', null, 8));

ART.water = svg('Water running over two small hands',
  path('M200 54 v70', null, 10) +
  drop(200, 120, 1) +
  drop(160, 170, 0.5) +
  drop(240, 176, 0.45) +
  hand(150, 250, 1.05) +
  hand(250, 250, 1.05, true));

ART.eating = svg('A bowl of dates and a loaf of bread',
  loaf(132, 196, 0.92) +
  bowl(268, 250, 0.9) +
  g(ell(-22, -4, 15, 10, CLAY, 6) + ell(6, -10, 15, 10, CLAY, 6) + ell(-8, -22, 15, 10, CLAY, 6),
    'transform="translate(268,236)"'));

ART.drinking = svg('A cup of water with a drop above it',
  drop(200, 92, 0.78) +
  cup(200, 250, 1.1, SKY));

ART.door = svg('An open door with morning light behind it',
  rect(104, 72, 192, 256, 10, CLAY) +
  rect(132, 96, 136, 208, 8, SAND) +
  circ(150, 204, 9, CREAM, 6) +
  sun(268, 150, 26) +
  path('M60 328 h280', null, 8));

ART.home = svg('A small house with a lit window',
  ground(300, LEAF) +
  path('M96 300 v-80 l104 -72 l104 72 v80 z', CREAM) +
  path('M96 220 l104 -72 l104 72', null, 8) +
  rect(168, 240, 64, 60, 6, GOLD) +
  path('M200 240 v60 M168 270 h64', null, 6) +
  crescent(312, 96, 34, CREAM));

ART.bowl = svg('A cat beside a full bowl',
  cat(150, 196, 1.1) +
  bowl(290, 300, 0.78, CLAY));

ART.sleep = svg('A sleeping child under a blanket with a lamp',
  crescent(306, 92, 36, CREAM) +
  star(246, 74, 15) +
  rect(70, 232, 260, 92, 20, MINT) +
  circ(126, 212, 42, SKIN) +
  path('M108 206 q10 -8 20 0 M144 206 q10 -8 20 0', null, 5) +
  path('M118 230 q10 8 20 0', null, 5));

ART.goodnight = svg('A crescent moon and stars over a sleeping house',
  crescent(214, 140, 74, CREAM) +
  star(306, 92, 20) +
  star(108, 108, 15) +
  star(132, 196, 11) +
  ground(300, NIGHT) +
  path('M140 300 v-54 l60 -44 l60 44 v54 z', CREAM) +
  rect(182, 262, 36, 38, 5, GOLD));
