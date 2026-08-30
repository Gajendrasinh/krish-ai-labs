# Krish AI Labs — marketing site

A 5-page marketing site (Home, Services, Portfolio, About, Contact) built with React + Vite +
React Router, implementing the design exported from Claude Design (see `../project` and `../chats`
in the repo root for the original source and design conversation).

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Notes

- Colors are defined as CSS custom properties in `src/styles/tokens.css`, using the same `oklch()`
  values as the original design.
- `hello@krishailabs.com` is a placeholder contact email from the design — swap in the real address
  before launch.
- The contact form doesn't submit anywhere yet; wire it up to an email/form backend before launch.
- Routing uses `react-router-dom`'s `BrowserRouter`, which needs the host to rewrite unknown paths
  to `index.html` (most static hosts — Netlify, Vercel, etc. — support this via a redirect rule).

## AI chat widget

`src/components/ChatWidget.jsx` is a floating chat widget shown on every page (wired in via
`Layout.jsx`). It's transport-only — no site data or API keys live in the frontend — and calls:

```
POST /api/chat
Request  { message: string, history: { role: 'user' | 'assistant', content: string }[] }
Response { reply: string, sources?: { source: string, heading: string }[], mode?: 'agent'|'retrieval_only' }
```

There's now a real backend for this at `../backend` — a FastAPI RAG agent (see
`../backend/README.md`). Point `CHAT_ENDPOINT` in `ChatWidget.jsx` at its deployed URL (it only
reads `data.reply`, so the extra `sources`/`mode` fields are ignored but available if you want to
surface them later).

For local dev without running the real backend, `npm run dev` also serves a **dev-only stub** at
`/api/chat` (`dev/chatStubPlugin.js`, wired into `vite.config.js`) that keyword-matches a few
canned replies — just enough to exercise the widget's UI. It only attaches to the Vite dev server
(not `npm run build` / `npm run preview` and not production); delete it once `CHAT_ENDPOINT` points
at the real backend everywhere you need it.
