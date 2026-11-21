// Tiga Suaka — Level 1: Pelabuhan Senja (Dusk Harbour).
// One job: paint the harbour twice — the base picture, and the same picture
// with seven small alterations for the right-hand panel. Every alteration is
// a local repaint: it covers its patch with the exact flat colour that was
// there, then draws the changed thing. The sky is flat bands on purpose, so
// a patch never shows a seam.

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

  function gull(ctx, x, y, colour) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.quadraticCurveTo(x - 5, y - 8, x, y);
    ctx.quadraticCurveTo(x + 5, y - 8, x + 12, y);
    ctx.stroke();
  }

  function crate(ctx, x, y, s) {
    rect(ctx, x, y, s, s, '#a9764f');
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.stroke();
  }

  function boat(ctx, x, y, hullColour, flagColour) {
    // Hull
    poly(ctx, [[x - 42, y], [x + 42, y], [x + 28, y + 18], [x - 28, y + 18]], hullColour);
    // Mast + flag
    rect(ctx, x - 2, y - 58, 4, 58, P.woodDark);
    poly(ctx, [[x + 2, y - 58], [x + 26, y - 50], [x + 2, y - 42]], flagColour);
  }

  function paintBase(ctx) {
    // Sky in three flat dusk bands.
    rect(ctx, 0, 0, 600, 120, P.duskSkyTop);
    rect(ctx, 0, 120, 600, 110, '#c96a5e');
    rect(ctx, 0, 230, 600, 70, P.duskSkyLow);
    // Sun.
    circle(ctx, 480, 90, 36, '#ff9d3c');
    circle(ctx, 480, 90, 26, '#ffc46b');
    // Clouds (flat, pale).
    ellipse(ctx, 300, 82, 62, 14, '#f2d8c9');
    ellipse(ctx, 130, 130, 48, 11, '#e8b48f');
    ellipse(ctx, 520, 170, 54, 12, '#f2d8c9');
    // Gulls — one of them sits on the pale cloud so its patch is exact.
    gull(ctx, 180, 70, '#20242e');
    gull(ctx, 300, 80, '#20242e');
    gull(ctx, 420, 60, '#20242e');
    // Distant hills.
    poly(ctx, [[0, 300], [120, 258], [260, 300]], '#3a2f4d');
    poly(ctx, [[330, 300], [470, 262], [600, 300]], '#3a2f4d');
    // Sea.
    rect(ctx, 0, 300, 600, 200, P.seaDeep);
    // Sun reflection column.
    for (var i = 0; i < 5; i += 1) {
      rect(ctx, 462 + (i % 2) * 8, 312 + i * 22, 34 - i * 3, 6, 'rgba(255, 196, 107, 0.55)');
    }
    // Wave strokes.
    ctx.strokeStyle = P.seaLight;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    var waveY = [330, 370, 410, 455];
    for (var w = 0; w < waveY.length; w += 1) {
      for (var x = 20; x < 580; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, waveY[w]);
        ctx.quadraticCurveTo(x + 18, waveY[w] - 7, x + 36, waveY[w]);
        ctx.stroke();
      }
    }
    // Lighthouse: white tower, three red bands, lamp room, beam.
    rect(ctx, 62, 150, 46, 150, '#f7f2e7');
    rect(ctx, 62, 170, 46, 20, '#c94f43');
    rect(ctx, 62, 210, 46, 20, '#c94f43');
    rect(ctx, 62, 250, 46, 20, '#c94f43');
    rect(ctx, 56, 138, 58, 14, '#20242e');
    rect(ctx, 70, 116, 30, 22, '#ffd23e');
    ctx.strokeStyle = '#20242e';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 116, 30, 22);
    poly(ctx, [[66, 116], [100, 116], [85, 100]], '#20242e');
    // Light beam to the right.
    ctx.fillStyle = 'rgba(255, 210, 62, 0.28)';
    poly(ctx, [[100, 122], [330, 96], [330, 148]], 'rgba(255, 210, 62, 0.28)');
    // Pier.
    rect(ctx, 120, 330, 460, 22, P.wood);
    for (var p = 130; p < 580; p += 46) rect(ctx, p, 330, 3, 22, P.woodDark);
    rect(ctx, 150, 352, 10, 34, P.woodDark);
    rect(ctx, 540, 352, 10, 34, P.woodDark);
    // Boats.
    boat(ctx, 210, 352, '#7a3b2e', '#d23c2e');
    boat(ctx, 400, 372, '#2e5d7a', '#d23c2e');
    // Sail on the second boat.
    poly(ctx, [[400, 314], [400, 360], [438, 360]], '#f7f2e7');
    // Crates on the pier.
    crate(ctx, 292, 300, 30);
    crate(ctx, 326, 306, 24);
    // Lantern post, lit.
    rect(ctx, 518, 282, 5, 48, P.woodDark);
    circle(ctx, 520, 276, 16, 'rgba(255, 210, 62, 0.35)');
    rect(ctx, 510, 284, 20, 20, '#ffd23e');
    ctx.strokeStyle = '#20242e';
    ctx.lineWidth = 2;
    ctx.strokeRect(510, 284, 20, 20);
    // Buoy.
    poly(ctx, [[512, 430], [528, 430], [520, 414]], '#d23c2e');
    rect(ctx, 512, 430, 16, 8, '#f7f2e7');
    rect(ctx, 512, 438, 16, 6, '#d23c2e');
  }

  function paint(ctx, altered) {
    paintBase(ctx);
    if (!altered) return;
    for (var i = 0; i < TS.Harbour.diffs.length; i += 1) {
      TS.Harbour.diffs[i].alter(ctx);
    }
  }

  TS.Harbour = {
    name: 'Pelabuhan Senja',
    time: 90,
    paint: paint,
    diffs: [
      {
        id: 'sun',
        label: 'Warna matahari',
        x: 480, y: 90, r: 40,
        alter: function (ctx) {
          circle(ctx, 480, 90, 36, '#fff3b0');
          circle(ctx, 480, 90, 26, '#fffbe0');
        },
      },
      {
        id: 'gull',
        label: 'Camar hilang',
        x: 300, y: 80, r: 26,
        alter: function (ctx) {
          // The gull sat on the pale cloud: repaint the cloud over it.
          ellipse(ctx, 300, 82, 62, 14, '#f2d8c9');
        },
      },
      {
        id: 'flag',
        label: 'Warna bendera perahu',
        x: 214, y: 292, r: 26,
        alter: function (ctx) {
          poly(ctx, [[212, 294], [236, 302], [212, 310]], '#2e5d9e');
        },
      },
      {
        id: 'bands',
        label: 'Garis mercusuar',
        x: 85, y: 220, r: 30,
        alter: function (ctx) {
          // Middle red band becomes tower white.
          rect(ctx, 62, 210, 46, 20, '#f7f2e7');
        },
      },
      {
        id: 'crate',
        label: 'Peti tambahan',
        x: 372, y: 318, r: 30,
        alter: function (ctx) {
          crate(ctx, 358, 306, 24);
        },
      },
      {
        id: 'lantern',
        label: 'Lentera padam',
        x: 520, y: 294, r: 28,
        alter: function (ctx) {
          // The glow sits against the low dusk band: cover with that colour.
          circle(ctx, 520, 276, 16, '#f7b267');
          rect(ctx, 510, 284, 20, 20, '#5a5148');
          ctx.strokeStyle = '#20242e';
          ctx.lineWidth = 2;
          ctx.strokeRect(510, 284, 20, 20);
        },
      },
      {
        id: 'buoy',
        label: 'Pelampung hilang',
        x: 520, y: 430, r: 26,
        alter: function (ctx) {
          rect(ctx, 508, 410, 28, 38, P.seaDeep);
          ctx.strokeStyle = P.seaLight;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(506, 432);
          ctx.quadraticCurveTo(520, 425, 534, 432);
          ctx.stroke();
        },
      },
    ],
  };
})();
