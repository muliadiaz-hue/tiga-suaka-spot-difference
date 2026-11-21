// Tiga Suaka — configuration: canvas layout, scoring, timers, palette.
// One job: every number the rest of the game reads lives here, so tuning the
// feel of the game never means hunting through the painters.

(function () {
  'use strict';

  var TS = (window.TS = window.TS || {});

  // The canvas the game draws into. Panels are 1:1 with scene space.
  TS.CANVAS = { width: 1280, height: 720 };
  TS.HUD = { height: 64 };
  TS.PANEL = { width: 600, height: 500, top: 76, leftX: 20, rightX: 660, gap: 40 };
  TS.BAR = { top: 588, height: 120 };

  // Scoring: a find is worth a flat 100, a wrong click costs 25, a hint costs
  // 50, and clearing a level banks 10 points per second left on the clock.
  TS.SCORE = { find: 100, wrong: -25, hint: -50, timeBonusPerSecond: 10 };

  // Each level gets its own clock; later levels are shorter on purpose.
  TS.HINTS_PER_LEVEL = 3;
  TS.HINT_FLASH_MS = 2000;
  TS.WRONG_SHAKE_MS = 350;

  // Deterministic decoration: a tiny seeded generator so waves, stars and
  // birds sit in the same place on every run (screenshots must reproduce).
  TS.mulberry32 = function (seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Shared palette: dusk harbour, night market, mountain night.
  TS.PALETTE = {
    ink: '#20242e',
    paper: '#f7f2e7',
    duskSkyTop: '#2e3a67',
    duskSkyMid: '#e8804f',
    duskSkyLow: '#f7b267',
    seaDeep: '#274b63',
    seaLight: '#3f7d96',
    sand: '#e8d5a3',
    wood: '#8a5a33',
    woodDark: '#6b4423',
    leaf: '#3e7a4e',
    leafDark: '#2c5a38',
    nightSky: '#141a33',
    marketGlow: '#ffcf5c',
    tent: '#c94f43',
    tentDark: '#a03a30',
    fire: '#ff8c2e',
    fireCore: '#ffd23e',
  };

  TS.LEVEL_NAMES = ['Pelabuhan Senja', 'Pasar Malam', 'Perkemahan Gunung'];
})();
