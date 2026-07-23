# TechNest

Two independent apps — **not a monorepo**. No shared tooling, no workspace config.

## Structure

- `Backend/` — Express 5 + MongoDB driver (CommonJS). No source code yet; only `package.json` with deps.
- `frontend/` — Next.js 16.2.11 + React 19 + Tailwind CSS v4. App Router. Has its own `.git/`.

## Frontend

- Path alias: `@/*` → `./src/*` (configured in `jsconfig.json`)
- Scripts: `npm run dev`, `npm run build`, `npm run lint`
- ESLint uses flat config format (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals`
- Tailwind CSS v4 via PostCSS plugin (`@tailwindcss/postcss`), not v3-style `tailwind.config`
- **Next.js version warning**: This version has breaking changes. Before writing Next.js code, read the relevant guide from `frontend/node_modules/next/dist/docs/`. See `frontend/AGENTS.md` for details.

## 

- CommonJS module (`"type": "commonjs"` in `package.json`)
- Dependencies: express 5.2.1, mongodb 7.5.0, cors, dotenv
- No source files or scripts beyond placeholder test. Needs `index.js` entrypoint.
- Requires `.env` for MongoDB connection string (dotenv is a dependency)
