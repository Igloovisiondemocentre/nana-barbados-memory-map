# Nana's Barbados Memory Map

A React + Vite prototype for an interactive Barbados memory map built around Nana's voice recordings, BODA branding, and 360-ready place views.

## Run Locally

```bash
npm install
npm run dev
```

The app runs at the URL Vite prints in the terminal, usually `http://127.0.0.1:5173`.

## Google Street View

Street View is lazy-loaded. The app shows the selected memory first and only creates the Google iframe after someone clicks `Enter 360`.

To enable Google Street View locally, create `.env.local`:

```bash
VITE_GOOGLE_MAPS_API_KEY=your-restricted-browser-key
```

Do not commit `.env.local`. Restrict the key in Google Cloud to the final website domain and only the APIs this app needs.

## Deploy

- Netlify deployment notes: `deployment/netlify/README.md`
- GitHub Pages deployment notes and `git` / `gh` commands: `deployment/github/README.md`

GitHub Pages can host the static memory map and Google 360 embeds. The embedded OpenAI chatbot still needs a server-side backend; on GitHub Pages it falls back to the full BODA GPT link.

## Media

- Audio files live in `public/assets/audio`.
- BODA logo and family drawing live in `public/assets/images`.
- Google Street View coordinates are stored in `src/data/memories.ts`.
- Future family-owned 360 images or videos can replace Google by changing a memory's `media.kind` and `media.src`.
