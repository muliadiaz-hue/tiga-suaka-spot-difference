// Tiga Suaka — input: mouse clicks and keyboard play.
// One job: turn pointer and key events into game actions. A click is tested
// against both panels (a difference can be marked on either picture), and
// the arrow keys drive a crosshair so the whole game is playable without a
// mouse too.

(function () {
  'use strict';

  var TS = window.TS;

  // Convert a browser pointer event to canvas coordinates (the canvas is
  // 1280x720 internally and may be CSS-scaled).
  function eventPoint(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * TS.CANVAS.width,
      y: ((event.clientY - rect.top) / rect.height) * TS.CANVAS.height,
    };
  }

  // Try to mark a difference at canvas point (x, y). Returns true when a
  // difference was found there.
  TS.tryMarkAt = function (x, y) {
    var S = TS.state;
    if (S.screen !== 'play') return false;
    var side = TS.panelAt(x, y);
    if (side === null) return false;
    var scene = TS.toScene(side, x, y);
    var diff = TS.unfoundDiffAt(TS.currentLevel(), S.foundIds, scene.x, scene.y);
    TS.registerClick();
    if (diff) {
      TS.markFound(diff);
      return true;
    }
    TS.markWrong(x, y);
    return false;
  };

  TS.attachInput = function (canvas) {
    var S = TS.state;

    canvas.addEventListener('click', function (event) {
      var p = eventPoint(canvas, event);
      if (S.screen === 'title') {
        TS.newGame();
        return;
      }
      if (S.screen === 'levelClear') {
        TS.nextLevel();
        return;
      }
      if (S.screen === 'gameOver' || S.screen === 'win') {
        TS.newGame();
        return;
      }
      // The hint button lives in the bottom bar, outside both panels.
      var b = TS.HINT_BUTTON;
      if (b && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) {
        TS.useHint();
        return;
      }
      TS.tryMarkAt(p.x, p.y);
    });

    canvas.addEventListener('mousemove', function (event) {
      var p = eventPoint(canvas, event);
      S.crosshair.x = p.x;
      S.crosshair.y = p.y;
      S.crosshair.visible = true;
    });

    window.addEventListener('keydown', function (event) {
      var step = event.shiftKey ? 24 : 8;
      var c = S.crosshair;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
          event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        c.visible = true;
        if (event.key === 'ArrowLeft') c.x = Math.max(0, c.x - step);
        if (event.key === 'ArrowRight') c.x = Math.min(TS.CANVAS.width, c.x + step);
        if (event.key === 'ArrowUp') c.y = Math.max(0, c.y - step);
        if (event.key === 'ArrowDown') c.y = Math.min(TS.CANVAS.height, c.y + step);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (S.screen === 'title' || S.screen === 'gameOver' || S.screen === 'win') {
          TS.newGame();
        } else if (S.screen === 'levelClear') {
          TS.nextLevel();
        } else {
          TS.tryMarkAt(c.x, c.y);
        }
        return;
      }
      if (event.key === 'h' || event.key === 'H') {
        TS.useHint();
        return;
      }
      if (event.key === 'n' || event.key === 'N') {
        if (S.screen === 'levelClear') TS.nextLevel();
        return;
      }
      if (event.key === 'r' || event.key === 'R') {
        TS.newGame();
        return;
      }
      if (event.key === '1' || event.key === '2' || event.key === '3') {
        var index = Number(event.key) - 1;
        if (index < TS.levelCount()) TS.startLevel(index);
      }
    });
  };
})();
