// Tiga Suaka — game state.
// One job: hold everything that changes while playing (screen, level, finds,
// score, clock, hints) and the rules that move it. Nothing here draws; the
// renderer reads this object every frame.

(function () {
  'use strict';

  var TS = window.TS;

  function freshState() {
    return {
      screen: 'title', // title | play | levelClear | gameOver | win
      levelIndex: 0,
      foundIds: [],
      score: 0,
      timeLeft: 0,
      hintsLeft: TS.HINTS_PER_LEVEL,
      hintedId: null,
      hintUntil: 0,
      wrongUntil: 0,
      wrongAt: null,
      message: '',
      messageUntil: 0,
      clicks: 0,
      hits: 0,
      levelBonus: 0,
      totalTimeUsed: 0,
      crosshair: { x: 640, y: 330, visible: false },
      startedAt: 0,
    };
  }

  var S = freshState();
  TS.state = S;

  TS.currentLevel = function () {
    return TS.levelAt(S.levelIndex);
  };

  TS.newGame = function () {
    var keep = S;
    var next = freshState();
    next.score = 0;
    next.totalTimeUsed = 0;
    for (var k in next) keep[k] = next[k];
    TS.startLevel(0);
  };

  TS.startLevel = function (index) {
    var level = TS.levelAt(index);
    S.levelIndex = index;
    S.foundIds = [];
    S.timeLeft = level.time;
    S.hintsLeft = TS.HINTS_PER_LEVEL;
    S.hintedId = null;
    S.hintUntil = 0;
    S.wrongUntil = 0;
    S.wrongAt = null;
    S.message = '';
    S.levelBonus = 0;
    S.screen = 'play';
    S.startedAt = Date.now();
  };

  // A click landed on an unfound difference: mark it on both panels.
  TS.markFound = function (diff) {
    S.foundIds.push(diff.id);
    S.hits += 1;
    S.score += TS.SCORE.find;
    S.message = 'Ketemu: ' + diff.label + '  (+' + TS.SCORE.find + ')';
    S.messageUntil = Date.now() + 1600;
    TS.audioFind();
    if (TS.allFound(TS.currentLevel(), S.foundIds)) {
      S.levelBonus = Math.ceil(S.timeLeft) * TS.SCORE.timeBonusPerSecond;
      S.score += S.levelBonus;
      S.totalTimeUsed += TS.currentLevel().time - S.timeLeft;
      S.screen = 'levelClear';
      TS.audioClear();
    }
  };

  // A click landed on nothing: cost points, shake the frame briefly.
  TS.markWrong = function (x, y) {
    S.score = Math.max(0, S.score + TS.SCORE.wrong);
    S.wrongUntil = Date.now() + TS.WRONG_SHAKE_MS;
    S.wrongAt = { x: x, y: y };
    S.message = 'Bukan di situ  (' + TS.SCORE.wrong + ')';
    S.messageUntil = Date.now() + 1200;
    TS.audioWrong();
  };

  TS.registerClick = function () {
    S.clicks += 1;
  };

  // Spend one hint: pulse the area of a random unfound difference for a
  // couple of seconds. The pick is the first unfound one, so a hint is
  // deterministic — the same game state always hints the same difference.
  TS.useHint = function () {
    if (S.screen !== 'play') return false;
    if (S.hintsLeft <= 0) {
      S.message = 'Hint habis untuk level ini';
      S.messageUntil = Date.now() + 1200;
      return false;
    }
    var level = TS.currentLevel();
    for (var i = 0; i < level.diffs.length; i += 1) {
      if (S.foundIds.indexOf(level.diffs[i].id) === -1) {
        S.hintedId = level.diffs[i].id;
        break;
      }
    }
    if (S.hintedId === null) return false;
    S.hintsLeft -= 1;
    S.score = Math.max(0, S.score + TS.SCORE.hint);
    S.hintUntil = Date.now() + TS.HINT_FLASH_MS;
    S.message = 'Hint: cari di sekitar lingkaran  (' + TS.SCORE.hint + ')';
    S.messageUntil = Date.now() + 1600;
    TS.audioHint();
    return true;
  };

  TS.nextLevel = function () {
    if (S.levelIndex + 1 >= TS.levelCount()) {
      S.screen = 'win';
      TS.audioWin();
      return;
    }
    TS.startLevel(S.levelIndex + 1);
  };

  // Advance the clock by dt seconds. Returns true when time just ran out.
  TS.tick = function (dt) {
    if (S.screen !== 'play') return false;
    S.timeLeft -= dt;
    if (S.timeLeft <= 0) {
      S.timeLeft = 0;
      S.totalTimeUsed += TS.currentLevel().time;
      S.screen = 'gameOver';
      TS.audioGameOver();
      return true;
    }
    return false;
  };

  TS.accuracy = function () {
    if (S.clicks === 0) return 100;
    return Math.round((S.hits / S.clicks) * 100);
  };
})();
