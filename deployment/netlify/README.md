# Netlify Deployment Notes

This project is a Vite + React static app. Netlify can deploy it directly from the repository root.

Important: the embedded BODA GPT chat needs a Netlify Function. Do not deploy only the `dist/`
folder with drag-and-drop if you want the chatbot to work, because that can leave out
`netlify/functions/boda-chat.mjs`.

## Build Settings

- Base directory: leave blank / repository root
- Build command: `npm run build`
- Publish directory: `dist`

These are also defined in `netlify.toml` at the project root.

## Environment Variables

Add this in Netlify Site configuration > Environment variables:

```text
VITE_GOOGLE_MAPS_API_KEY=your_restricted_browser_key
OPENAI_API_KEY=your_rotated_server_side_openai_key
OPENAI_MODEL=gpt-5-mini
```

For safety, restrict the key in Google Cloud to the deployed Netlify domain and enable only the Google Maps APIs needed for the prototype.

The OpenAI key must be server-side only. Do not prefix it with `VITE_`, and do not paste it into the React source. If a key has been shared in chat, revoke it in the OpenAI dashboard and create a fresh one for Netlify.

## BODA GPT Chat

The landing page includes a desk-sticker chat panel backed by `netlify/functions/boda-chat.mjs`.
It uses OpenAI's Responses API through the `/api/boda-chat` Netlify Function so the browser never receives the API key.

The panel also includes a fallback link to the BODA Strategy / Diaspora Connector GPT:

```text
https://chatgpt.com/g/g-6a038f0d8c6081919f5540134c939e81-boda-strategy-diaspora-connector
```

The embedded chat does add OpenAI API usage cost. Keep the default `OPENAI_MODEL` low-cost unless you intentionally upgrade it, and set usage limits in the OpenAI project.

## Private Tester Flow

1. Push or upload the full repository root to Netlify, not just `dist/`.
2. Set `VITE_GOOGLE_MAPS_API_KEY`.
3. Set `OPENAI_API_KEY` to a fresh server-side OpenAI key.
4. Trigger a deploy.
5. Share the Netlify preview URL with the selected testers.

If deploying manually with Netlify CLI from the project root, use:

```bash
npm run build
npx netlify deploy --prod --dir=dist --functions=netlify/functions
```

After deployment, this endpoint should return JSON rather than a 404:

```text
https://your-site.netlify.app/api/boda-chat
```

The one-time intro animation is session-based. Testers can force it again with:

```text
/?intro=1
```

The Family Layer can be opened directly for review with:

```text
/?family=1&familyPoint=rowans-park
```

## Local Verification

Run:

```bash
npm run build
```

Then check that `dist/` contains the built app and copied public assets.
