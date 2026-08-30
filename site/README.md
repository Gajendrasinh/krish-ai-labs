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
