// Karteikarten (Flashcards)
const ModeFlashcards = (() => {
  function render(container, words) {
    const deck = WordData.shuffle(words);
    let index = 0;
    let flipped = false;

    function draw() {
      const word = deck[index];
      container.innerHTML = `
        <div class="mode-flashcards">
          <p class="progress">Karte ${index + 1} / ${deck.length}</p>
          <div class="flip-card ${flipped ? 'is-flipped' : ''}" id="flipCard">
            <div class="flip-card-inner">
              <div class="flip-card-face flip-card-front">
                <button class="speaker-btn" id="speakBtn" aria-label="Anhören">🔊</button>
                <div class="word-text">${word.french}</div>
                <p class="hint">Zum Umdrehen tippen</p>
              </div>
              <div class="flip-card-face flip-card-back">
                <div class="word-text">${word.german}</div>
              </div>
            </div>
          </div>
          <div class="flashcard-actions ${flipped ? '' : 'is-hidden'}">
            <button class="btn btn-secondary" id="againBtn">🔁 Nochmal üben</button>
            <button class="btn btn-primary" id="knewBtn">✅ Ich wusste es!</button>
          </div>
        </div>
      `;

      document.getElementById('flipCard').addEventListener('click', () => {
        flipped = !flipped;
        draw();
      });
      document.getElementById('speakBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        AppAudio.speak(word.french);
      });
      const again = document.getElementById('againBtn');
      const knew = document.getElementById('knewBtn');
      if (again) again.addEventListener('click', (e) => { e.stopPropagation(); advance(false); });
      if (knew) knew.addEventListener('click', (e) => { e.stopPropagation(); advance(true); });
    }

    function advance(knewIt) {
      if (knewIt) {
        AppState.registerCorrect();
        AppAudio.correct();
      }
      index++;
      flipped = false;
      if (index >= deck.length) {
        finish();
      } else {
        draw();
      }
    }

    function finish() {
      AppAudio.celebrate();
      Confetti.burst({ particleCount: 100 });
      container.innerHTML = `
        <div class="mode-complete">
          <h2>🎉 Stapel geschafft!</h2>
          <p>Du hast alle ${deck.length} Karten durchgesehen.</p>
          <button class="btn btn-primary" id="againDeckBtn">Nochmal spielen</button>
        </div>
      `;
      document.getElementById('againDeckBtn').addEventListener('click', () => render(container, words));
    }

    draw();
  }

  return { render, title: 'Karteikarten', icon: '🃏' };
})();
