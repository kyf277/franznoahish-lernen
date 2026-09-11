// Loads words.json once and exposes it to the rest of the app.
const WordData = (() => {
  let words = null;

  async function load() {
    if (words) return words;
    const res = await fetch('words.json', { cache: 'no-store' });
    words = await res.json();
    return words;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { load, shuffle };
})();
