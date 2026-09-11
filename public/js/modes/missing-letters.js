// Buchstaben-Rätsel (Missing Letters)
const ModeMissingLetters = (() => {
  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function buildMask(word) {
    const chars = word.split('');
    const letterIdx = [];
    chars.forEach((c, i) => { if (/[a-zà-ÿ]/i.test(c)) letterIdx.push(i); });
    const maskCount = Math.max(1, Math.round(letterIdx.length * 0.4));
    const shuffled = WordData.shuffle(letterIdx);
    const masked = new Set(shuffled.slice(0, maskCount));
    return chars.map((c, i) => ({ char: c, masked: masked.has(i) }));
  }

  function render(container, words) {
    const deck = WordData.shuffle(words);
    let index = 0;
    let attempts = 0;

    function draw() {
      const word = deck[index];
      const mask = buildMask(word.answer);
      container.innerHTML = `
        <div class="mode-missing-letters">
          <p class="progress">Wort ${index + 1} / ${deck.length}</p>
          <button class="speaker-btn" id="speakBtn" aria-label="Anhören">🔊</button>
          <p class="hint">${word.german}</p>
          <div class="letter-row" id="letterRow">
            ${mask.map((m, i) => m.masked
              ? `<input class="letter-box" data-idx="${i}" maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false">`
              : `<span class="letter-box letter-fixed">${m.char}</span>`
            ).join('')}
          </div>
          <p class="feedback" id="feedback"></p>
          <button class="btn btn-primary" id="checkBtn">Prüfen</button>
        </div>
      `;

      document.getElementById('speakBtn').addEventListener('click', () => AppAudio.speak(word.french));

      const inputs = Array.from(container.querySelectorAll('.letter-box[data-idx]'));
      inputs.forEach((inp, pos) => {
        inp.addEventListener('input', () => {
          if (inp.value && pos < inputs.length - 1) inputs[pos + 1].focus();
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !inp.value && pos > 0) inputs[pos - 1].focus();
        });
      });
      if (inputs[0]) inputs[0].focus();

      document.getElementById('checkBtn').addEventListener('click', () => check(word, mask, inputs));
    }

    function check(word, mask, inputs) {
      const guessChars = mask.map(m => m.char);
      let allCorrect = true;
      inputs.forEach(inp => {
        const i = Number(inp.dataset.idx);
        const ok = normalize(inp.value || '') === normalize(mask[i].char);
        inp.classList.toggle('is-correct', ok);
        inp.classList.toggle('is-wrong', !ok);
        if (!ok) allCorrect = false;
      });

      const feedback = document.getElementById('feedback');

      if (allCorrect) {
        AppState.registerCorrect();
        AppAudio.correct();
        feedback.textContent = 'Richtig! 🎉';
        feedback.className = 'feedback feedback-good';
        setTimeout(() => next(), 900);
        return;
      }

      attempts++;
      AppAudio.wrong();
      AppState.registerWrong();
      const row = document.getElementById('letterRow');
      row.classList.add('shake');
      setTimeout(() => row.classList.remove('shake'), 400);

      if (attempts >= 2) {
        feedback.textContent = `Die Lösung war: ${word.answer}`;
        feedback.className = 'feedback feedback-reveal';
        inputs.forEach(inp => {
          const i = Number(inp.dataset.idx);
          inp.value = mask[i].char;
          inp.disabled = true;
        });
        setTimeout(() => next(), 1400);
      } else {
        feedback.textContent = 'Fast! Versuch es nochmal.';
        feedback.className = 'feedback feedback-bad';
      }
    }

    function next() {
      index++;
      attempts = 0;
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
          <h2>🎉 Rätsel geschafft!</h2>
          <p>Du hast alle ${deck.length} Wörter geübt.</p>
          <button class="btn btn-primary" id="againBtn">Nochmal spielen</button>
        </div>
      `;
      document.getElementById('againBtn').addEventListener('click', () => render(container, words));
    }

    draw();
  }

  return { render, title: 'Buchstaben-Rätsel', icon: '🔤' };
})();
