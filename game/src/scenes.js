// Tiga Suaka — panel painter.
// One job: take a level and paint it into one panel rectangle on the canvas,
// clipping to the panel so no scene ever bleeds over the frame. The left
// panel gets the base picture, the right panel the altered one.

(function () {
  'use strict';

  var TS = window.TS;
  var PANEL = TS.PANEL;

  // Paint `level` into the panel on the given side ('left' | 'right').
  TS.paintPanel = function (ctx, level, side) {
    var x = side === 'left' ? PANEL.leftX : PANEL.rightX;
    var y = PANEL.top;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, PANEL.width, PANEL.height);
    ctx.clip();
    ctx.translate(x, y);
    level.paint(ctx, side === 'right');
    ctx.restore();
    // Frame.
    ctx.strokeStyle = '#20242e';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, PANEL.width - 4, PANEL.height - 4);
  };

  // Which panel (if any) holds canvas point (x, y)? Returns 'left', 'right'
  // or null. The frame itself counts as outside.
  TS.panelAt = function (x, y) {
    if (y < PANEL.top || y >= PANEL.top + PANEL.height) return null;
    if (x >= PANEL.leftX && x < PANEL.leftX + PANEL.width) return 'left';
    if (x >= PANEL.rightX && x < PANEL.rightX + PANEL.width) return 'right';
    return null;
  };

  // Convert a canvas point inside a panel to scene coordinates (600 x 500).
  TS.toScene = function (side, x, y) {
    var originX = side === 'left' ? PANEL.leftX : PANEL.rightX;
    return { x: x - originX, y: y - PANEL.top };
  };

  // Convert scene coordinates back to canvas coordinates on a panel.
  TS.toCanvas = function (side, sx, sy) {
    var originX = side === 'left' ? PANEL.leftX : PANEL.rightX;
    return { x: originX + sx, y: PANEL.top + sy };
  };
})();
