// Tiga Suaka — renderer.
// One job: draw one frame from TS.state — HUD, both panels, markers, hint,
// messages, and the title / clear / over / win screens. Nothing here changes
// state; it only reads it.

(function () {
  'use strict';

  var TS = window.TS;
  var P = TS.PALETTE;

  // Hint button rectangle (canvas coordinates), shared with input.js.
  TS.HINT_BUTTON = { x: 1050, y: 636, w: 200, h: 44 };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawMarker(ctx, x, y, pulse) {
    var r = 24 + pulse * 3;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#2e9e5b';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#2e9e5b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 11, y + 1);
    ctx.lineTo(x - 3, y + 9);
    ctx.lineTo(x + 12, y - 9);
    ctx.stroke();
  }

  function drawHud(ctx, S) {
    var level = TS.currentLevel();
    // Top bar.
    ctx.fillStyle = P.ink;
    ctx.fillRect(0, 0, TS.CANVAS.width, TS.HUD.height);
    ctx.fillStyle = P.paper;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('TIGA SUAKA', 24, 32);
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#c9c2b2';
    ctx.fillText(level.name, 240, 33);
    // Remaining counter — the hero number of the HUD.
    var remaining = TS.remainingCount(level, S.foundIds);
    ctx.textAlign = 'center';
    ctx.fillStyle = remaining === 0 ? '#7ad07a' : P.paper;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('TERSISA  ' + remaining + '  dari  ' + level.diffs.length, 640, 26);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#c9c2b2';
    ctx.fillText('perbedaan', 640, 50);
    // Timer bar under the counter.
    var frac = Math.max(0, S.timeLeft / level.time);
    ctx.fillStyle = '#3a3f4d';
    ctx.fillRect(500, 56, 280, 6);
    ctx.fillStyle = frac > 0.33 ? '#ffd23e' : '#d23c2e';
    ctx.fillRect(500, 56, 280 * frac, 6);
    // Score, right.
    ctx.textAlign = 'right';
    ctx.fillStyle = P.paper;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('SKOR ' + S.score, 1256, 32);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#c9c2b2';
    ctx.fillText(Math.ceil(S.timeLeft) + ' dtk', 1256, 54);
  }

  function drawBottomBar(ctx, S) {
    var y0 = TS.BAR.top;
    ctx.fillStyle = P.paper;
    ctx.fillRect(0, y0, TS.CANVAS.width, TS.BAR.height);
    ctx.fillStyle = P.ink;
    ctx.fillRect(0, y0, TS.CANVAS.width, 3);
    // Level pills.
    var levels = TS.LEVELS();
    for (var i = 0; i < levels.length; i += 1) {
      var px = 24 + i * 220;
      var done = i < S.levelIndex || (i === S.levelIndex && S.screen !== 'play' && S.screen !== 'title' && TS.allFound(levels[i], S.foundIds));
      var active = i === S.levelIndex && S.screen === 'play';
      roundRect(ctx, px, y0 + 16, 200, 40, 10);
      ctx.fillStyle = active ? '#2e5d9e' : done ? '#2e9e5b' : '#e3dcc9';
      ctx.fill();
      ctx.fillStyle = active || done ? '#ffffff' : P.ink;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1) + '. ' + levels[i].name + (done ? '  ✓' : ''), px + 14, y0 + 37);
    }
    // Message line.
    ctx.fillStyle = P.ink;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    var msg = Date.now() < S.messageUntil ? S.message : 'Klik perbedaan di gambar kiri atau kanan';
    ctx.fillText(msg, 640, y0 + 76);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#6b6558';
    ctx.fillText('Panah + Enter untuk main pakai keyboard  ·  H hint  ·  R ulang  ·  1/2/3 pilih level', 640, y0 + 100);
    // Hint button.
    var b = TS.HINT_BUTTON;
    roundRect(ctx, b.x, b.y, b.w, b.h, 10);
    ctx.fillStyle = S.hintsLeft > 0 ? '#e8b23a' : '#c9c2b2';
    ctx.fill();
    ctx.fillStyle = P.ink;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HINT (H) · ' + S.hintsLeft + ' tersisa', b.x + b.w / 2, b.y + b.h / 2 + 1);
  }

  function drawMarkers(ctx, S) {
    var level = TS.currentLevel();
    var now = Date.now();
    var pulse = (Math.sin(now / 300) + 1) / 2;
    for (var i = 0; i < S.foundIds.length; i += 1) {
      var diff = null;
      for (var j = 0; j < level.diffs.length; j += 1) {
        if (level.diffs[j].id === S.foundIds[i]) diff = level.diffs[j];
      }
      if (diff === null) continue;
      var left = TS.toCanvas('left', diff.x, diff.y);
      var right = TS.toCanvas('right', diff.x, diff.y);
      drawMarker(ctx, left.x, left.y, pulse);
      drawMarker(ctx, right.x, right.y, pulse);
    }
    // Hint pulse on both panels.
    if (S.hintedId !== null && now < S.hintUntil) {
      var hinted = null;
      for (var k = 0; k < level.diffs.length; k += 1) {
        if (level.diffs[k].id === S.hintedId) hinted = level.diffs[k];
      }
      if (hinted !== null) {
        var pr = hinted.r + 8 + pulse * 6;
        ctx.setLineDash([8, 6]);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#e8b23a';
        var lp = TS.toCanvas('left', hinted.x, hinted.y);
        var rp = TS.toCanvas('right', hinted.x, hinted.y);
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // Wrong-click X.
    if (S.wrongAt !== null && now < S.wrongUntil) {
      ctx.strokeStyle = '#d23c2e';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      var wx = S.wrongAt.x;
      var wy = S.wrongAt.y;
      ctx.beginPath();
      ctx.moveTo(wx - 12, wy - 12);
      ctx.lineTo(wx + 12, wy + 12);
      ctx.moveTo(wx + 12, wy - 12);
      ctx.lineTo(wx - 12, wy + 12);
      ctx.stroke();
    }
  }

  function overlay(ctx, title, lines, accent) {
    ctx.fillStyle = 'rgba(20, 24, 46, 0.86)';
    ctx.fillRect(0, 0, TS.CANVAS.width, TS.CANVAS.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(title, 640, 250);
    ctx.fillStyle = P.paper;
    ctx.font = '20px sans-serif';
    for (var i = 0; i < lines.length; i += 1) {
      ctx.fillText(lines[i], 640, 310 + i * 34);
    }
  }

  TS.render = function (ctx) {
    var S = TS.state;
    ctx.clearRect(0, 0, TS.CANVAS.width, TS.CANVAS.height);
    ctx.fillStyle = '#e9e2cf';
    ctx.fillRect(0, 0, TS.CANVAS.width, TS.CANVAS.height);

    // Wrong-click shake: shift both panels a few pixels for a moment.
    var shakeX = 0;
    if (Date.now() < S.wrongUntil) {
      shakeX = (Math.random() < 0.5 ? -1 : 1) * 4;
    }
    ctx.save();
    if (shakeX !== 0) ctx.translate(shakeX, 0);

    var level = TS.currentLevel();
    TS.paintPanel(ctx, level, 'left');
    TS.paintPanel(ctx, level, 'right');
    ctx.restore();

    if (S.screen === 'play' || S.screen === 'levelClear' || S.screen === 'gameOver') {
      drawMarkers(ctx, S);
    }
    drawHud(ctx, S);
    drawBottomBar(ctx, S);

    // Crosshair for keyboard play.
    if (S.crosshair.visible && S.screen === 'play') {
      ctx.strokeStyle = 'rgba(32, 36, 46, 0.8)';
      ctx.lineWidth = 2;
      var cx = S.crosshair.x;
      var cy = S.crosshair.y;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx, cy + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (S.screen === 'title') {
      overlay(ctx, 'TIGA SUAKA', [
        'Cari 7 perbedaan di setiap adegan — klik di gambar kiri atau kanan.',
        'Tiga tempat: Pelabuhan Senja  ·  Pasar Malam  ·  Perkemahan Gunung.',
        'Waktu makin singkat, perbedaan makin halus. Hint (H) hanya 3× per level.',
        '',
        'KLIK UNTUK MULAI',
      ], '#ffd23e');
    } else if (S.screen === 'levelClear') {
      overlay(ctx, 'LEVEL SELESAI!', [
        level.name + ' — semua 7 perbedaan ketemu.',
        'Bonus waktu: +' + S.levelBonus + '   ·   Skor: ' + S.score,
        '',
        'KLIK / N — lanjut ke level berikut',
      ], '#7ad07a');
    } else if (S.screen === 'gameOver') {
      overlay(ctx, 'WAKTU HABIS', [
        level.name + ' — ketemu ' + S.foundIds.length + ' dari 7 perbedaan.',
        'Skor: ' + S.score + '   ·   Akurasi: ' + TS.accuracy() + '%',
        '',
        'KLIK UNTUK COBA LAGI',
      ], '#ff8c5a');
    } else if (S.screen === 'win') {
      overlay(ctx, 'KETIGA SUAKA DITEMUKAN!', [
        'Semua 21 perbedaan ketemu.',
        'Skor akhir: ' + S.score + '   ·   Akurasi: ' + TS.accuracy() + '%',
        'Waktu total: ' + Math.round(S.totalTimeUsed) + ' detik',
        '',
        'KLIK UNTUK MAIN LAGI',
      ], '#ffd23e');
    }
  };
})();
