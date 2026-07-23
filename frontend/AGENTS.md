<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Quick reference

- `npm run dev` — dev server (localhost:3000)
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)
- `npm run build` / `npm run start` — production build
- Path alias `@/*` maps to `./src/*` (see `jsconfig.json`)
- Tailwind CSS v4: uses `@tailwindcss/postcss` plugin in `postcss.config.mjs`. No `tailwind.config` file — use `@theme` in CSS (`src/app/globals.css`)
- App Router (`src/app/`), not Pages Router. Only two pages exist: `layout.js` and `page.js`.
