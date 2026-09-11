// Stars + streak tracking, persisted in localStorage.
const AppState = (() => {
  const KEY = 'frenchVocabProgress';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupt or unavailable storage, start fresh */ }
    return { stars: 0, streak: 0, bestStreak: 0 };
  }

  let data = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
    render();
  }

  function render() {
    const starEl = document.getElementById('starCount');
    const streakEl = document.getElementById('streakCount');
    if (starEl) starEl.textContent = data.stars;
    if (streakEl) streakEl.textContent = data.streak;
  }

  function addStar(n = 1) {
    data.stars += n;
    save();
  }

  function registerCorrect() {
    data.stars += 1;
    data.streak += 1;
    if (data.streak > data.bestStreak) data.bestStreak = data.streak;
    save();
    return data.streak;
  }

  function registerWrong() {
    data.streak = 0;
    save();
  }

  function get() {
    return { ...data };
  }

  return { addStar, registerCorrect, registerWrong, get, render };
})();
