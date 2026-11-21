// Tiga Suaka — screenshot shots.
// One job: put the game into a fixed, photogenic state for the screenshots
// the entry hands in, using the same code paths a player uses (startLevel,
// markFound) so every shot is a real render of the game's own code.
//   ?shot=cover  — level 1, 3 of 7 found, 4 remaining (the cover)
//   ?shot=market — level 2, 2 of 7 found
//   ?shot=camp   — level 3, just started, 0 found
//   ?shot=win    — level 1 cleared, the level-clear screen
// No randomness: the same query always gives the same frame.

(function () {
  'use strict';

  var TS = window.TS;

  // The shots the entry ships, in file order. The cover is first by name.
  TS.SHOTS = [
    { name: '1-cover.jpg', query: 'cover' },
    { name: '2-market.jpg', query: 'market' },
    { name: '3-camp.jpg', query: 'camp' },
    { name: '4-win.jpg', query: 'win' },
  ];

  TS.applyShot = function () {
    var params = new URLSearchParams(window.location.search);
    var shot = params.get('shot');
    if (shot === null) return;
    var S = TS.state;
    // Silence the find chime while staging a shot.
    var quiet = TS.audioFind;
    TS.audioFind = function () {};
    try {
      if (shot === 'cover') {
        TS.startLevel(0);
        S.timeLeft = 61;
        var level = TS.currentLevel();
        TS.markFound(level.diffs[0]);
        TS.markFound(level.diffs[2]);
        TS.markFound(level.diffs[4]);
        S.screen = 'play';
        S.message = 'Ketemu: Peti tambahan  (+100)';
        S.messageUntil = Date.now() + 60000;
      } else if (shot === 'market') {
        TS.startLevel(1);
        S.timeLeft = 48;
        var m = TS.currentLevel();
        TS.markFound(m.diffs[1]);
        TS.markFound(m.diffs[3]);
        S.screen = 'play';
        S.message = '';
        S.messageUntil = 0;
      } else if (shot === 'camp') {
        TS.startLevel(2);
        S.timeLeft = 60;
        S.screen = 'play';
      } else if (shot === 'win') {
        TS.startLevel(0);
        S.timeLeft = 34;
        var w = TS.currentLevel();
        for (var i = 0; i < w.diffs.length; i += 1) TS.markFound(w.diffs[i]);
        // markFound already flipped the screen to levelClear on the last find.
      }
    } finally {
      TS.audioFind = quiet;
    }
    S.crosshair.visible = false;
  };
})();
