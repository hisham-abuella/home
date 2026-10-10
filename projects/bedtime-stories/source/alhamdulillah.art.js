/* Alhamdulillah — eight plain gifts. */

function cloud(cx, cy, s, fill) {
  s = s || 1;
  return g(path('M-86 24 a40 40 0 0 1 8 -78 a52 52 0 0 1 96 -16 a44 44 0 0 1 60 48 a34 34 0 0 1 -26 46 z', fill || CREAM),
    'transform="translate(' + cx + ',' + cy + ') scale(' + s + ')"');
}

ART.cover = svg('Two open hands under a warm sun',
  sun(200, 118, 52) +
  hand(146, 282, 1.25) +
  hand(254, 282, 1.25, true));

ART.hands = svg('Two small open hands',
  hand(136, 236, 1.6) +
  hand(264, 236, 1.6, true));

ART.eyes = svg('Two wide open eyes',
  g(path('M-96 0 q96 -78 192 0 q-96 78 -192 0 z', CREAM) + circ(0, 0, 40, NIGHT) + '<circle cx="0" cy="0" r="17" fill="' + INK + '"/><circle cx="14" cy="-14" r="8" fill="' + CREAM + '"/>',
    'transform="translate(108,196) scale(.84)"') +
  g(path('M-96 0 q96 -78 192 0 q-96 78 -192 0 z', CREAM) + circ(0, 0, 40, NIGHT) + '<circle cx="0" cy="0" r="17" fill="' + INK + '"/><circle cx="14" cy="-14" r="8" fill="' + CREAM + '"/>',
    'transform="translate(292,196) scale(.84)"'));

ART.voice = svg('A child listening, with sound coming towards him',
  child(150, 210, 1.15, CLAY) +
  g(path('M0 -56 q34 56 0 112', null, 10) + path('M34 -74 q46 74 0 148', null, 10) + path('M68 -92 q58 92 0 184', null, 10),
    'transform="translate(272,200)"'));

ART.bread = svg('A warm loaf of bread',
  loaf(200, 216, 1.5));

ART['cool-water'] = svg('A tall glass of cool water',
  g(path('M-52 -86 h104 l-12 158 q-2 16 -18 16 h-44 q-16 0 -18 -16 z', CREAM) +
    path('M-44 -10 q44 -20 88 0 l-8 92 q-2 10 -12 10 h-48 q-10 0 -12 -10 z', SKY, 0) +
    path('M-44 -10 q44 -20 88 0', null, 6),
    'transform="translate(200,214)"') +
  drop(200, 60, 0.5));

ART.rain = svg('A cloud with rain falling from it',
  cloud(200, 140, 1) +
  g(path('M0 0 v44', null, 10), 'transform="translate(136,222)"') +
  g(path('M0 0 v58', null, 10), 'transform="translate(188,230)"') +
  g(path('M0 0 v44', null, 10), 'transform="translate(240,222)"') +
  g(path('M0 0 v34', null, 10), 'transform="translate(288,236)"'));

ART.susu = svg('Susu the cat, sitting',
  cat(200, 206, 1.5));

ART.bed = svg('A small bed under a roof',
  path('M60 196 l140 -96 l140 96', null, 10) +
  rect(96, 196, 208, 110, 14, MINT) +
  rect(96, 174, 208, 34, 10, CREAM) +
  circ(150, 174, 26, SKIN));

ART.goodnight = svg('A crescent moon over two open hands',
  crescent(200, 128, 72, CREAM) +
  star(306, 86, 17) +
  star(96, 104, 13) +
  hand(150, 320, 1.1) +
  hand(250, 320, 1.1, true));
