// Zuordnungsspiel (Word Matching)
const ModeMatching = (() => {
  const PAIR_COUNT = 6;

  function render(container, words) {
    const pairs = WordData.shuffle(words).slice(0, Math.min(PAIR_COUNT, words.length));
    const cards = WordData.shuffle([
      ...pairs.map(w => ({ id: w.id, text: w.french, lang: 'fr' })),
      ...pairs.map(w => ({ id: w.id, text: w.german, lang: 'de' })),
    ]);

    let selected = null;
    let matchedCount = 0;
    let mistakes = 0;
    let locked = false;

    function draw() {
      container.innerHTML = `
        <div class="mode-matching">
          <p class="progress">Paare gefunden: ${matchedCount} / ${pairs.length}</p>
          <div class="matching-grid">
            ${cards.map((c, i) => `
              <button class="match-card" data-idx="${i}" data-id="${c.id}">
                ${c.lang === 'fr' ? '🇫🇷' : '🇩🇪'} ${c.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.match-card').forEach(btn => {
        btn.addEventListener('click', () => onPick(Number(btn.dataset.idx)));
      });
    }

    function onPick(idx) {
      if (locked) return;
      const btn = container.querySelector(`.match-card[data-idx="${idx}"]`);
      if (!btn || btn.classList.contains('is-matched') || btn.classList.contains('is-selected')) return;

      if (selected === null) {
        selected = idx;
        btn.classList.add('is-selected');
        return;
      }

      const first = container.querySelector(`.match-card[data-idx="${selected}"]`);
      const isMatch = cards[selected].id === cards[idx].id && selected !== idx;

      if (isMatch) {
        first.classList.remove('is-selected');
        first.classList.add('is-matched');
        btn.classList.add('is-matched');
        matchedCount++;
        AppState.registerCorrect();
        AppAudio.correct();
        selected = null;
        document.querySelector('.progress').textContent = `Paare gefunden: ${matchedCount} / ${pairs.length}`;
        if (matchedCount === pairs.length) {
          setTimeout(finish, 500);
        }
      } else {
        mistakes++;
        AppState.registerWrong();
        AppAudio.wrong();
        btn.classList.add('is-selected');
        locked = true;
        setTimeout(() => {
          first.classList.remove('is-selected');
          btn.classList.remove('is-selected');
          selected = null;
          locked = false;
        }, 600);
      }
    }

    function finish() {
      AppAudio.celebrate();
      Confetti.burst({ particleCount: mistakes === 0 ? 140 : 90 });
      container.innerHTML = `
        <div class="mode-complete">
          <h2>🎉 Alle Paare gefunden!</h2>
          <p>${mistakes === 0 ? 'Perfekt, ohne Fehler!' : `Geschafft mit ${mistakes} Fehlversuch(en).`}</p>
          <button class="btn btn-primary" id="againBtn">Nochmal spielen</button>
        </div>
      `;
      document.getElementById('againBtn').addEventListener('click', () => render(container, words));
    }

    draw();
  }

  return { render, title: 'Zuordnungsspiel', icon: '🧩' };
})();
