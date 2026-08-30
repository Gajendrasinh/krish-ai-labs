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
`Layout.jsx`), meant to be backed by a real AI/RAG service. It's transport-only — no site data or
API keys live in the frontend — and calls:

```
POST /api/chat
Request  { message: string, history: { role: 'user' | 'assistant', content: string }[] }
Response { reply: string }
```

Point `CHAT_ENDPOINT` in `ChatWidget.jsx` at a real backend (same-origin path, or a full URL) once
one exists. That backend is where the actual retrieval/grounding and LLM call should happen — keep
API keys server-side, never in this frontend bundle.

Until then, `npm run dev` serves a **dev-only stub** at `/api/chat` (`dev/chatStubPlugin.js`, wired
into `vite.config.js`) that keyword-matches a few canned replies about services/portfolio/pricing —
just enough to exercise the widget end to end. It only attaches to the Vite dev server (not
`npm run build` / `npm run preview` and not production), and can be deleted once a real backend is
wired in.
