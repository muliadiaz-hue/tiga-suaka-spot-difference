// Tiga Suaka — Level 3: Perkemahan Gunung (Mountain Camp).
// One job: paint the mountain camp twice — base, and base with seven small
// alterations for the right-hand panel. Same local-repaint rule: cover the
// patch with the exact flat colour, then draw the change.

(function () {
  'use strict';

  var TS = window.TS;
  var P = TS.PALETTE;

  function circle(ctx, x, y, r, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function rect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }

  function poly(ctx, points, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  function sparkle(ctx, x, y, size, colour) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  function pine(ctx, x, y, s) {
    // A small pine: trunk + three stacked triangles, base at (x, y).
    rect(ctx, x - 3 * s, y - 14 * s, 6 * s, 14 * s, '#5a3a22');
    poly(ctx, [[x - 26 * s, y - 8 * s], [x + 26 * s, y - 8 * s], [x, y - 44 * s]], P.leaf);
    poly(ctx, [[x - 21 * s, y - 32 * s], [x + 21 * s, y - 32 * s], [x, y - 62 * s]], P.leafDark);
    poly(ctx, [[x - 15 * s, y - 54 * s], [x + 15 * s, y - 54 * s], [x, y - 80 * s]], P.leaf);
  }

  function flame(ctx, x, y, s, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y - 26 * s);
    ctx.quadraticCurveTo(x + 12 * s, y - 8 * s, x + 8 * s, y);
    ctx.quadraticCurveTo(x + 4 * s, y + 4 * s, x, y + 4 * s);
    ctx.quadraticCurveTo(x - 4 * s, y + 4 * s, x - 8 * s, y);
    ctx.quadraticCurveTo(x - 12 * s, y - 8 * s, x, y - 26 * s);
    ctx.fill();
  }

  function paintBase(ctx) {
    // Night sky and ground.
    rect(ctx, 0, 0, 600, 380, P.nightSky);
    rect(ctx, 0, 380, 600, 120, '#24301f');
    // Deterministic faint stars.
    var rnd = TS.mulberry32(770031);
    ctx.fillStyle = '#f7f2e7';
    for (var s = 0; s < 46; s += 1) {
      var sx = 8 + rnd() * 584;
      var sy = 8 + rnd() * 190;
      ctx.globalAlpha = 0.35 + rnd() * 0.6;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;
    // Three bright sparkles whose positions the differences know.
    sparkle(ctx, 120, 60, 7, '#ffe9a8');
    sparkle(ctx, 200, 40, 6, '#f7f2e7');
    sparkle(ctx, 90, 140, 6, '#f7f2e7');
    // Full moon with craters.
    circle(ctx, 500, 80, 28, '#f7f2e7');
    circle(ctx, 492, 72, 5, '#ddd2b8');
    circle(ctx, 508, 88, 4, '#ddd2b8');
    circle(ctx, 506, 68, 3, '#ddd2b8');
    // Mountains.
    poly(ctx, [[0, 380], [150, 240], [300, 380]], '#1d2438');
    poly(ctx, [[250, 380], [420, 220], [600, 380]], '#232c44');
    // Snow caps.
    poly(ctx, [[132, 258], [150, 240], [168, 258], [158, 266], [150, 258], [142, 266]], '#f7f2e7');
    poly(ctx, [[402, 238], [420, 220], [438, 238], [428, 246], [420, 238], [412, 246]], '#f7f2e7');
    // Pines.
    pine(ctx, 75, 382, 1.0);
    pine(ctx, 545, 385, 0.9);
    pine(ctx, 335, 382, 0.62);
    // Sapling pine on the open ground.
    pine(ctx, 430, 392, 0.34);
    // Tent: red triangle, shaded half, dark door.
    poly(ctx, [[140, 400], [220, 290], [300, 400]], P.tent);
    poly(ctx, [[220, 290], [300, 400], [220, 400]], P.tentDark);
    poly(ctx, [[205, 400], [235, 400], [220, 352]], '#4a1f1a');
    ctx.strokeStyle = '#20242e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(140, 400);
    ctx.lineTo(220, 290);
    ctx.lineTo(300, 400);
    ctx.stroke();
    // Guy ropes + pegs.
    ctx.beginPath();
    ctx.moveTo(220, 290);
    ctx.lineTo(180, 400);
    ctx.moveTo(220, 290);
    ctx.lineTo(262, 400);
    ctx.stroke();
    // Campfire: stone ring, crossed logs, three flame tongues.
    ellipse(ctx, 378, 440, 9, 6, '#8a8a7a');
    ellipse(ctx, 422, 440, 9, 6, '#8a8a7a');
    ellipse(ctx, 400, 448, 10, 6, '#8a8a7a');
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(384, 430);
    ctx.lineTo(416, 442);
    ctx.moveTo(416, 430);
    ctx.lineTo(384, 442);
    ctx.stroke();
    flame(ctx, 388, 430, 0.9, P.fire);
    flame(ctx, 400, 428, 1.15, P.fire);
    flame(ctx, 412, 430, 0.9, P.fire);
    flame(ctx, 400, 430, 0.7, P.fireCore);
    // Warm glow on the ground.
    ctx.fillStyle = 'rgba(255, 140, 46, 0.18)';
    ctx.beginPath();
    ctx.ellipse(400, 442, 70, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Smoke drifting right.
    ctx.fillStyle = 'rgba(200, 200, 210, 0.55)';
    circle(ctx, 405, 372, 7, 'rgba(200, 200, 210, 0.55)');
    circle(ctx, 416, 352, 9, 'rgba(200, 200, 210, 0.45)');
    circle(ctx, 430, 332, 11, 'rgba(200, 200, 210, 0.35)');
    // Backpack leaning on the ground.
    rect(ctx, 472, 420, 36, 34, '#7a5a2e');
    ctx.fillStyle = '#5a4120';
    ctx.fillRect(472, 420, 36, 10);
    rect(ctx, 480, 428, 20, 14, '#93703a');
    ctx.strokeStyle = '#3a2c14';
    ctx.lineWidth = 2;
    ctx.strokeRect(472, 420, 36, 34);
    // Grass tufts.
    ctx.strokeStyle = '#3e7a4e';
    ctx.lineWidth = 2;
    var tufts = [[40, 460], [150, 470], [250, 455], [330, 465], [560, 460], [90, 490], [300, 488], [520, 488]];
    for (var t = 0; t < tufts.length; t += 1) {
      var tx = tufts[t][0];
      var ty = tufts[t][1];
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - 4, ty - 10);
      ctx.moveTo(tx + 4, ty);
      ctx.lineTo(tx + 4, ty - 12);
      ctx.moveTo(tx + 8, ty);
      ctx.lineTo(tx + 10, ty - 9);
      ctx.stroke();
    }
  }

  function paint(ctx, altered) {
    paintBase(ctx);
    if (!altered) return;
    for (var i = 0; i < TS.Camp.diffs.length; i += 1) {
      TS.Camp.diffs[i].alter(ctx);
    }
  }

  TS.Camp = {
    name: 'Perkemahan Gunung',
    time: 60,
    paint: paint,
    diffs: [
      {
        id: 'star',
        label: 'Bintang hilang',
        x: 120, y: 60, r: 20,
        alter: function (ctx) {
          rect(ctx, 110, 50, 20, 20, P.nightSky);
        },
      },
      {
        id: 'moon',
        label: 'Bentuk bulan',
        x: 500, y: 80, r: 30,
        alter: function (ctx) {
          circle(ctx, 500, 80, 28, '#f7f2e7');
          circle(ctx, 512, 72, 24, P.nightSky);
        },
      },
      {
        id: 'door',
        label: 'Pintu tenda tertutup',
        x: 220, y: 378, r: 28,
        alter: function (ctx) {
          poly(ctx, [[205, 400], [235, 400], [220, 352]], P.tent);
        },
      },
      {
        id: 'flame',
        label: 'Lidah api berkurang',
        x: 400, y: 414, r: 26,
        alter: function (ctx) {
          // Cover the middle flame tongue with ground colour, then redraw
          // the side tongues' inner edges so the fire still reads as fire.
          rect(ctx, 392, 392, 16, 34, '#24301f');
          flame(ctx, 388, 430, 0.9, P.fire);
          flame(ctx, 412, 430, 0.9, P.fire);
        },
      },
      {
        id: 'sapling',
        label: 'Pohon kecil hilang',
        x: 430, y: 384, r: 26,
        alter: function (ctx) {
          rect(ctx, 414, 362, 34, 32, '#24301f');
        },
      },
      {
        id: 'smoke',
        label: 'Arah asap',
        x: 412, y: 350, r: 30,
        alter: function (ctx) {
          // The smoke patch sits on the right mountain: cover with its colour.
          rect(ctx, 388, 318, 62, 62, '#232c44');
          circle(ctx, 395, 372, 7, 'rgba(200, 200, 210, 0.55)');
          circle(ctx, 384, 352, 9, 'rgba(200, 200, 210, 0.45)');
          circle(ctx, 370, 332, 11, 'rgba(200, 200, 210, 0.35)');
        },
      },
      {
        id: 'backpack',
        label: 'Ransel hilang',
        x: 490, y: 437, r: 26,
        alter: function (ctx) {
          rect(ctx, 468, 416, 44, 42, '#24301f');
          ctx.strokeStyle = '#3e7a4e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(486, 452);
          ctx.lineTo(482, 442);
          ctx.moveTo(490, 452);
          ctx.lineTo(490, 440);
          ctx.moveTo(494, 452);
          ctx.lineTo(496, 443);
          ctx.stroke();
        },
      },
    ],
  };
})();
