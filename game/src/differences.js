// Tiga Suaka — level registry and difference hit-testing.
// One job: know the levels, know where each difference hides, and answer
// "did this click land on a difference that is still unfound?"
// The painters (scene-*.js) own the pictures; this file only aggregates them.

(function () {
  'use strict';

  var TS = window.TS;

  // Levels register themselves here in order. Each level exposes:
  //   name, time (seconds), paint(ctx, altered), diffs[]
  // A diff is { id, label, x, y, r, alter(ctx) } in scene coordinates
  // (600 x 500). alter() repaints the small patch the difference lives in,
  // drawing the changed version over the base picture.
  TS.LEVELS = function () {
    return [TS.Harbour, TS.Market, TS.Camp];
  };

  TS.levelCount = function () {
    return TS.LEVELS().length;
  };

  TS.levelAt = function (index) {
    return TS.LEVELS()[index];
  };

  // The difference whose circle contains scene point (x, y) and which has
  // not been found yet, or null. The nearest circle wins when two overlap.
  TS.unfoundDiffAt = function (level, foundIds, x, y) {
    var best = null;
    var bestD = Infinity;
    for (var i = 0; i < level.diffs.length; i += 1) {
      var d = level.diffs[i];
      if (foundIds.indexOf(d.id) !== -1) continue;
      var dx = x - d.x;
      var dy = y - d.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= d.r && dist < bestD) {
        best = d;
        bestD = dist;
      }
    }
    return best;
  };

  TS.remainingCount = function (level, foundIds) {
    return level.diffs.length - foundIds.length;
  };

  TS.allFound = function (level, foundIds) {
    return foundIds.length >= level.diffs.length;
  };
})();
