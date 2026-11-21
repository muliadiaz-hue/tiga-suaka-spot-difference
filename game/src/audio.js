// Tiga Suaka — sound.
// One job: every sound the game makes, synthesised with WebAudio so the game
// ships no audio files at all. All calls are safe when the browser has no
// audio (headless screenshots): they simply do nothing.

(function () {
  'use strict';

  var TS = window.TS;
  var ctx = null;

  function audio() {
    if (ctx !== null) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  // A short oscillator note: frequency, start delay, length, shape, volume.
  function note(freq, delay, length, type, volume) {
    var ac = audio();
    if (ac === null) return;
    try {
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + length);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + length + 0.05);
    } catch (e) {
      // Headless or blocked audio: the game plays on silently.
    }
  }

  // Two-note chime, rising: the satisfying mark on every find.
  TS.audioFind = function () {
    note(660, 0, 0.14, 'sine', 0.18);
    note(990, 0.09, 0.22, 'sine', 0.18);
  };

  // Low buzz: a wrong click.
  TS.audioWrong = function () {
    note(140, 0, 0.18, 'sawtooth', 0.08);
  };

  // Soft blip: a hint was spent.
  TS.audioHint = function () {
    note(520, 0, 0.1, 'triangle', 0.12);
  };

  // Little arpeggio: a level is cleared.
  TS.audioClear = function () {
    note(523, 0, 0.14, 'triangle', 0.16);
    note(659, 0.1, 0.14, 'triangle', 0.16);
    note(784, 0.2, 0.22, 'triangle', 0.16);
  };

  // Longer fanfare: all three levels are done.
  TS.audioWin = function () {
    note(523, 0, 0.16, 'triangle', 0.16);
    note(659, 0.12, 0.16, 'triangle', 0.16);
    note(784, 0.24, 0.16, 'triangle', 0.16);
    note(1047, 0.36, 0.34, 'triangle', 0.18);
  };

  // Falling notes: time ran out.
  TS.audioGameOver = function () {
    note(392, 0, 0.2, 'sine', 0.14);
    note(311, 0.16, 0.3, 'sine', 0.14);
  };
})();
