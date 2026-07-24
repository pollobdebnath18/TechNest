# TechNest

Two independent apps — **not a monorepo**. No shared tooling, no workspace config.

## Structure

- `Backend/` — Express 5 + MongoDB driver (CommonJS). Entry: `server.js`.
- `frontend/` — Next.js 16.2.11 + React 19 + Tailwind CSS v4. App Router. Has its own `.git/`.

## Frontend

- Path alias: `@/*` → `./src/*` (configured in `jsconfig.json`)
- Scripts: `npm run dev`, `npm run build`, `npm run lint`
- ESLint uses flat config format (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals`
- Tailwind CSS v4 via PostCSS plugin (`@tailwindcss/postcss`), not v3-style `tailwind.config`
- **Next.js version warning**: This version has breaking changes. Before writing Next.js code, read the relevant guide from `frontend/node_modules/next/dist/docs/`. See `frontend/AGENTS.md` for details.

### Key patterns

- Auth: Better Auth in `src/lib/auth.js` (server) + `src/lib/auth-client.js` (client). Catch-all route at `src/app/api/auth/[...all]/route.js`.
- State: `CartContext` + `WishlistContext` in `src/lib/` — API-backed, no localStorage.
- API: `src/lib/api.js` talks to Express backend at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`).
- Images: external URLs (ibb.co) stored in MongoDB, rendered via `<img>` tags with error fallbacks.
- Lint rule: `react-hooks/set-state-in-effect` is strict — use `useRef` to avoid re-fetch loops, never call `setState` synchronously inside `useEffect`.
- Components: reusable cards in `src/components/cards/`, home sections in `src/components/home/`, layout in `src/components/layout/`.

## BackendP

- CommonJS module (`"type": "commonjs"` in `package.json`)
- Entry: `Backend/server.js`
- Dependencies: express 5.2.1, mongodb 7.5.0, cors, dotenv
- `.env` requires: `MONGODB_URI`, `PORT`, `FRONTEND_URL` (for CORS)
- Start: `node server.js` or `npm start` from Backend/
- Seed: `POST /api/seed` (drops + reinserts all data including ibb.co image URLs)
- API routes: `/api/products`, `/api/categories`, `/api/brands`, `/api/testimonials`, `/api/features`, `/api/orders`, `/api/cart/:userId`, `/api/wishlist/:userId`, `/api/health`, `/` (status page)
