// Procedural sound effects (Web Audio API) + French text-to-speech.
const AppAudio = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function tone(freq, startTime, duration, type = 'sine', gain = 0.2) {
    const c = getCtx();
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    amp.gain.setValueAtTime(gain, startTime);
    amp.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(amp).connect(c.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function correct() {
    const c = getCtx();
    const now = c.currentTime;
    tone(523.25, now, 0.12);
    tone(783.99, now + 0.1, 0.18);
  }

  function wrong() {
    const c = getCtx();
    const now = c.currentTime;
    tone(180, now, 0.25, 'sawtooth', 0.15);
  }

  function celebrate() {
    const c = getCtx();
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, now + i * 0.11, 0.22, 'triangle', 0.18));
  }

  let frenchVoice = null;
  function pickVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    frenchVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr')) || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    if (frenchVoice) utter.voice = frenchVoice;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }

  return { correct, wrong, celebrate, speak };
})();
