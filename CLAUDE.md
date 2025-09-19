# Project Rules
Tech: Next.js App Router (TypeScript), Supabase (Auth, Postgres, RLS), Vercel deploy.
Style: ESLint default, Prettier, Zod for validation. Module boundary: /web/src.
Testing: Vitest for units, Playwright for e2e. All PRs must keep tests green.
Security: RLS policies required for all tables; no admin keys client-side.
Deliverables: Each feature = PRP + code + tests + docs. ADR in /docs/adr.
Conventions: Use server actions; keep DB I/O in /web/src/lib/db/*.ts.
CI: GitHub Actions runs `npm run test` + `npx playwright test`.
TODO: link Supabase schema docs and any domain specifics.
