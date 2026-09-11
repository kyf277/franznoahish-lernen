# 🇫🇷 Französisch "franznoahish" lernen

A gamified French vocabulary trainer for a German-speaking child. Four practice
modes, stars/streak scoring, confetti, and sound — all as a single static site
with no backend or build step, deployed on Cloudflare Pages.

## Project layout

| File | Purpose |
|---|---|
| `public/words.json` | The vocabulary list. **Edit this for weekly updates.** |
| `public/index.html` | App shell (header, home menu, mount point) |
| `public/css/style.css` | Theme, layout, animations |
| `public/js/data.js` | Loads `words.json` |
| `public/js/state.js` | Stars/streak, persisted in `localStorage` |
| `public/js/audio.js` | Web Audio chimes + French text-to-speech |
| `public/js/confetti.js` | Confetti burst on milestones |
| `public/js/modes/*.js` | The four game modes |
| `public/js/app.js` | Home screen + routing between modes |

## Editing the word list

Each entry in `public/words.json` looks like:

```json
{
  "id": "chat",
  "french": "le chat",
  "german": "die Katze",
  "sentence": "Le ___ dort sur le canapé.",
  "answer": "chat"
}
```

- `french` — shown on flashcards/matching, spoken aloud (with article, if any).
- `german` — the translation shown on the flashcard back, in matching, and as
  the hint in Satz-Trainer.
- `answer` — the bare word (no article) used for Missing-Letters and as the
  fill-in-the-blank answer for the sentence.
- `sentence` — a French sentence with `___` marking where `answer` belongs.

Add, remove, or edit entries any time — no restart needed, just redeploy
(see below). Aim for at least 6 words so Zuordnungsspiel has enough pairs, and
at least 4 words so Satz-Trainer has enough choices.

## Run locally

```sh
npm install
npm run dev      # http://localhost:8788
```

## Deploy to Cloudflare Pages

One-time setup (requires a free [Cloudflare account](https://dash.cloudflare.com/sign-up)):

```sh
npx wrangler login     # opens browser to authorize
```

Then, any time you want to publish (including after editing `words.json`):

```sh
npm run deploy
```

This runs `wrangler pages deploy public --project-name=french-vocab-app` and
prints your live URL (something like `https://french-vocab-app.pages.dev`).
