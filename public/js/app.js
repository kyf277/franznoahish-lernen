// Home screen + routing between the four modes.
(function () {
  const MODES = [ModeFlashcards, ModeMissingLetters, ModeMatching, ModeSentence];
  const app = document.getElementById('app');
  const pageTitle = document.getElementById('pageTitle');
  const homeBtn = document.getElementById('homeBtn');

  let words = [];

  function showHome() {
    pageTitle.textContent = 'Französisch lernen';
    app.innerHTML = `
      <div class="home-grid">
        ${MODES.map((m, i) => `
          <button class="mode-tile" data-idx="${i}">
            <span class="mode-icon">${m.icon}</span>
            <span class="mode-title">${m.title}</span>
          </button>
        `).join('')}
      </div>
    `;
    app.querySelectorAll('.mode-tile').forEach(btn => {
      btn.addEventListener('click', () => openMode(Number(btn.dataset.idx)));
    });
  }

  function openMode(idx) {
    const mode = MODES[idx];
    pageTitle.textContent = mode.title;
    mode.render(app, words);
  }

  homeBtn.addEventListener('click', showHome);

  WordData.load()
    .then(data => {
      words = data;
      AppState.render();
      showHome();
    })
    .catch(() => {
      app.innerHTML = '<p class="loading">Wörter konnten nicht geladen werden. Bitte Seite neu laden.</p>';
    });
})();
