// Tiga Suaka — bootstrap.
// One job: wire the canvas, the input and the frame loop together, then keep
// the clock running. Everything else lives in the files loaded before this one.

(function () {
  'use strict';

  var TS = window.TS;

  function boot() {
    var canvas = document.getElementById('game');
    if (canvas === null) return;
    canvas.width = TS.CANVAS.width;
    canvas.height = TS.CANVAS.height;
    var ctx = canvas.getContext('2d');
    if (ctx === null) return;

    TS.attachInput(canvas);
    TS.applyShot();

    var last = performance.now();
    function frame(now) {
      var dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      TS.tick(dt);
      TS.render(ctx);
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
