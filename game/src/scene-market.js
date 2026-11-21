// Tiga Suaka — Level 2: Pasar Malam (Night Market).
// One job: paint the night market twice — base, and base with seven small
// alterations for the right-hand panel. Same local-repaint rule as the
// harbour: cover the patch with the exact flat colour, then draw the change.

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

  function awning(ctx, x, y, w, colours) {
    var n = colours.length;
    var sw = w / n;
    for (var i = 0; i < n; i += 1) rect(ctx, x + i * sw, y, sw, 34, colours[i]);
    // Scalloped edge.
    for (var j = 0; j < n; j += 1) {
      ctx.fillStyle = colours[j];
      ctx.beginPath();
      ctx.arc(x + j * sw + sw / 2, y + 34, sw / 2, 0, Math.PI);
      ctx.fill();
    }
  }

  function paperLantern(ctx, x, y, colour) {
    ctx.strokeStyle = '#20242e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 34);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    ellipse(ctx, x, y, 16, 20, colour);
    rect(ctx, x - 7, y - 24, 14, 5, '#e8b23a');
    rect(ctx, x - 7, y + 19, 14, 5, '#e8b23a');
    ctx.strokeStyle = 'rgba(32, 36, 46, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 8);
    ctx.lineTo(x + 14, y - 8);
    ctx.moveTo(x - 14, y + 8);
    ctx.lineTo(x + 14, y + 8);
    ctx.stroke();
  }

  function cat(ctx, x, y) {
    // Sitting cat, seen from the front, dark grey on dark ground.
    ctx.fillStyle = '#454b5e';
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 17, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, x, y - 10, 12, '#454b5e');
    poly(ctx, [[x - 10, y - 18], [x - 13, y - 30], [x - 3, y - 21]], '#454b5e');
    poly(ctx, [[x + 10, y - 18], [x + 13, y - 30], [x + 3, y - 21]], '#454b5e');
    ctx.strokeStyle = '#454b5e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 28);
    ctx.quadraticCurveTo(x + 34, y + 26, x + 32, y + 6);
    ctx.stroke();
    circle(ctx, x - 4, y - 12, 2, '#ffd23e');
    circle(ctx, x + 4, y - 12, 2, '#ffd23e');
  }

  function paintBase(ctx) {
    // Night sky and ground.
    rect(ctx, 0, 0, 600, 420, P.nightSky);
    rect(ctx, 0, 420, 600, 80, '#2a2438');
    // Deterministic stars.
    var rnd = TS.mulberry32(20261121);
    ctx.fillStyle = '#f7f2e7';
    for (var s = 0; s < 40; s += 1) {
      var sx = 10 + rnd() * 580;
      var sy = 8 + rnd() * 180;
      ctx.globalAlpha = 0.4 + rnd() * 0.6;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;
    // Crescent moon.
    circle(ctx, 520, 70, 26, '#f7f2e7');
    circle(ctx, 532, 62, 22, P.nightSky);
    // String lights sagging across the top.
    ctx.strokeStyle = '#3a3f4d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 44);
    ctx.quadraticCurveTo(300, 96, 600, 40);
    ctx.stroke();
    var bulbColours = ['#ffd23e', '#ff8c5a', '#7ad0ff', '#ffd23e', '#ff8c5a', '#7ad0ff', '#ffd23e', '#ff8c5a', '#7ad0ff', '#ffd23e'];
    for (var b = 0; b < 10; b += 1) {
      var bx = 30 + b * 60;
      var by = 44 + Math.sin((bx / 600) * Math.PI) * 44;
      ctx.strokeStyle = '#3a3f4d';
      ctx.beginPath();
      ctx.moveTo(bx, by - 8);
      ctx.lineTo(bx, by);
      ctx.stroke();
      circle(ctx, bx, by + 7, 7, bulbColours[b]);
    }
    // Stall A — fruit (red/white awning).
    rect(ctx, 40, 190, 160, 210, '#4a2f23');
    awning(ctx, 36, 150, 168, ['#c94f43', '#f7f2e7', '#c94f43', '#f7f2e7', '#c94f43']);
    rect(ctx, 36, 372, 168, 28, P.wood);
    // Apples: five red circles on the counter.
    circle(ctx, 95, 368, 9, '#d23c2e');
    circle(ctx, 115, 360, 9, '#d23c2e');
    circle(ctx, 135, 368, 9, '#d23c2e');
    circle(ctx, 105, 378, 9, '#d23c2e');
    circle(ctx, 125, 378, 9, '#d23c2e');
    // Oranges beside them.
    circle(ctx, 165, 368, 9, '#e8804f');
    circle(ctx, 180, 376, 9, '#e8804f');
    // Stall B — satay (green/white awning), sign SATE.
    rect(ctx, 230, 190, 160, 210, '#2e3b2a');
    awning(ctx, 226, 150, 168, ['#3e7a4e', '#f7f2e7', '#3e7a4e', '#f7f2e7', '#3e7a4e']);
    rect(ctx, 275, 205, 70, 28, P.woodDark);
    ctx.fillStyle = '#f7f2e7';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SATE', 310, 220);
    rect(ctx, 226, 372, 168, 28, P.wood);
    // Skewers on the counter.
    ctx.strokeStyle = '#e8d5a3';
    ctx.lineWidth = 3;
    for (var k = 0; k < 4; k += 1) {
      var kx = 250 + k * 30;
      ctx.beginPath();
      ctx.moveTo(kx, 352);
      ctx.lineTo(kx + 14, 372);
      ctx.stroke();
      circle(ctx, kx + 4, 358, 5, '#8a5a33');
      circle(ctx, kx + 8, 364, 5, '#8a5a33');
    }
    // Stall C — lanterns for sale (blue/white awning).
    rect(ctx, 420, 190, 150, 210, '#232c4a');
    awning(ctx, 416, 150, 158, ['#2e5d9e', '#f7f2e7', '#2e5d9e', '#f7f2e7', '#2e5d9e']);
    paperLantern(ctx, 455, 250, '#d23c2e');
    paperLantern(ctx, 495, 250, '#e8b23a');
    paperLantern(ctx, 535, 250, '#3e7a4e');
    rect(ctx, 416, 372, 158, 28, P.wood);
    // Hanging red lantern above stall A.
    paperLantern(ctx, 120, 118, '#d23c2e');
    // The cat, sitting on the ground between the stalls.
    cat(ctx, 310, 412);
    // Cobble dots on the ground.
    ctx.fillStyle = '#3a3348';
    for (var c = 0; c < 24; c += 1) {
      var cx = 20 + (c % 8) * 72 + ((c * 37) % 23);
      var cy = 440 + Math.floor(c / 8) * 18;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function paint(ctx, altered) {
    paintBase(ctx);
    if (!altered) return;
    for (var i = 0; i < TS.Market.diffs.length; i += 1) {
      TS.Market.diffs[i].alter(ctx);
    }
  }

  TS.Market = {
    name: 'Pasar Malam',
    time: 75,
    paint: paint,
    diffs: [
      {
        id: 'lantern-colour',
        label: 'Warna lampion gantung',
        x: 120, y: 118, r: 28,
        alter: function (ctx) {
          paperLantern(ctx, 120, 118, '#3e7a4e');
        },
      },
      {
        id: 'cat',
        label: 'Kucing hilang',
        x: 310, y: 418, r: 28,
        alter: function (ctx) {
          rect(ctx, 282, 382, 62, 66, '#2a2438');
          ctx.fillStyle = '#3a3348';
          ctx.beginPath();
          ctx.ellipse(306, 440, 12, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      {
        id: 'apples',
        label: 'Apel berkurang',
        x: 115, y: 360, r: 24,
        alter: function (ctx) {
          // The top apple is gone: the stall's dark body shows through.
          circle(ctx, 115, 360, 10, '#4a2f23');
        },
      },
      {
        id: 'sign',
        label: 'Tulisan papan',
        x: 310, y: 219, r: 30,
        alter: function (ctx) {
          rect(ctx, 275, 205, 70, 28, P.woodDark);
          ctx.fillStyle = '#f7f2e7';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('SOTO', 310, 220);
        },
      },
      {
        id: 'bulb',
        label: 'Lampu senar padam',
        x: 270, y: 94, r: 22,
        alter: function (ctx) {
          circle(ctx, 270, 94, 7, '#4a4f5e');
        },
      },
      {
        id: 'awning',
        label: 'Garis awning tengah',
        x: 374, y: 167, r: 30,
        alter: function (ctx) {
          // Last green stripe of stall B's awning turns white: 5 stripes -> 4.
          rect(ctx, 358, 150, 34, 34, '#f7f2e7');
          ctx.fillStyle = '#f7f2e7';
          ctx.beginPath();
          ctx.arc(375, 184, 17, 0, Math.PI);
          ctx.fill();
        },
      },
      {
        id: 'moon',
        label: 'Bentuk bulan',
        x: 520, y: 70, r: 30,
        alter: function (ctx) {
          rect(ctx, 488, 38, 64, 64, P.nightSky);
          circle(ctx, 520, 70, 26, '#f7f2e7');
        },
      },
    ],
  };
})();
