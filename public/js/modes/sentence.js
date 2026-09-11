// Satz-Trainer (Sentence Context)
const ModeSentence = (() => {
  function buildChoices(word, allWords) {
    const pool = allWords.filter(w => w.id !== word.id);
    const distractors = WordData.shuffle(pool).slice(0, 3).map(w => w.answer);
    return WordData.shuffle([word.answer, ...distractors]);
  }

  function render(container, words) {
    const deck = WordData.shuffle(words);
    let index = 0;

    function draw() {
      const word = deck[index];
      const choices = buildChoices(word, words);
      const sentenceHtml = word.sentence.replace('___', '<span class="blank">＿＿＿</span>');

      container.innerHTML = `
        <div class="mode-sentence">
          <p class="progress">Satz ${index + 1} / ${deck.length}</p>
          <p class="hint">Hinweis: ${word.german}</p>
          <p class="sentence">${sentenceHtml}</p>
          <div class="choice-grid">
            ${choices.map(c => `<button class="btn btn-choice" data-value="${c}">${c}</button>`).join('')}
          </div>
          <p class="feedback" id="feedback"></p>
        </div>
      `;

      container.querySelectorAll('.btn-choice').forEach(btn => {
        btn.addEventListener('click', () => onChoose(btn, word));
      });
    }

    function onChoose(btn, word) {
      container.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);
      const feedback = document.getElementById('feedback');
      const correct = btn.dataset.value === word.answer;

      if (correct) {
        btn.classList.add('is-correct');
        AppState.registerCorrect();
        AppAudio.correct();
        feedback.textContent = 'Richtig! 🎉';
        feedback.className = 'feedback feedback-good';
        AppAudio.speak(word.sentence.replace('___', word.answer));
      } else {
        btn.classList.add('is-wrong');
        AppState.registerWrong();
        AppAudio.wrong();
        const correctBtn = container.querySelector(`.btn-choice[data-value="${CSS.escape(word.answer)}"]`);
        if (correctBtn) correctBtn.classList.add('is-correct');
        feedback.textContent = `Die richtige Antwort ist: ${word.answer}`;
        feedback.className = 'feedback feedback-bad';
      }

      setTimeout(() => next(), 1300);
    }

    function next() {
      index++;
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
          <h2>🎉 Alle Sätze geschafft!</h2>
          <p>Du hast ${deck.length} Sätze geübt.</p>
          <button class="btn btn-primary" id="againBtn">Nochmal spielen</button>
        </div>
      `;
      document.getElementById('againBtn').addEventListener('click', () => render(container, words));
    }

    draw();
  }

  return { render, title: 'Satz-Trainer', icon: '📝' };
})();
