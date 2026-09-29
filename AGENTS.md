# AGENTS.md

## Stack

SvelteKit 2 + Svelte 5 (runes) + TypeScript, Drizzle ORM over PostgreSQL. Node 24 (`.nvmrc`), npm.

## Commands & verification

- `npm run dev` — needs `DATABASE_URL` in `.env` (copy `.env.example`) pointing at a reachable Postgres; the app throws at startup without it.
- `npm run check` — svelte-check typecheck. `npm run lint` — `prettier --check .` then `eslint .`. Run `npm run format` before linting.
- **There is no test suite or test framework.** The CI badges in the README reference workflows that don't exist in this repo. Verification = `check` + `lint`.
- Schema changes: edit `src/lib/server/db/schema.ts`, then `npm run db:push` (drizzle-kit auto-loads root `.env`). No migrations are committed — the `drizzle/` output dir is untracked/unused.

## Database gotchas

- `npm run db:seed` ignores `.env`: `scripts/seed.ts` hardcodes `postgres://testuser:testpassword@localhost:5432/testdb` and **truncates all five tables** first. Edit the URL in the script before running.
- The seed uses `pg`/node-postgres while the app uses `postgres-js`; `generateUniqueGameCode` accepts either.

## Architecture

- **Event sourcing**: game state is a fold over `game_event` rows ordered by `eventNum`. `applyEvent` in `src/lib/client/Game.svelte.ts` is the single place event types are interpreted — replay, live updates, and local scoring all go through it. Don't handle event types elsewhere.
- `docs/game_events.md` is the gameplay reference — how a game is played, the stored-event table, penalty/overtime rules, and what is derived vs planned. Read it before changing game logic; derived state (penalty releases, paused/timeout, overtime) must never be stored.
- `gameEvent.playerNumber` is a jersey-number snapshot on purpose (not a FK to `player`), so history survives roster edits. Don't "fix" this.
- **No user accounts** (auth was removed; `bcrypt` is a leftover dep). Scorekeepers authorize per game: enter its 6-char code (`/api/games/code/[code]`) → cookie `game_${gameId}_code` → `authorizeGame` in `src/lib/server/game.ts`.
- **Live updates are SSE** via `/api/games/[gameId]/stream`; `src/lib/stream.ts` keeps connections in an in-memory module-level Map — single-instance only.
- **Local games** (`/scorekeeper/local`) run offline in browser localStorage, with negative entity IDs (-1/-2) so they never fake DB rows.
- **Admin CRUD** at `/admin/[tournamentId]` is fully functional but deliberately unlinked (button commented out in `src/routes/+page.svelte`).

## Icon codegen

- Add `.svg` files to `src/lib/icons/svg/`, then `npm run icons:build` → generates `src/lib/icons/components/*.svelte` and the barrel `src/lib/icons/index.ts`. Import from `$lib/icons`; don't hand-edit generated files.
- The script imports `fast-glob`, which is missing from `package.json` — `npm i -D fast-glob` first or it fails.
- Run `npm run format` after generating (generated output is committed formatted).

## Style

- Prettier: tabs, single quotes, no trailing commas, width 100.
- Svelte 5 runes everywhere (`$props()`, `$state`, `$derived`, `Snippet` children), including `.svelte.ts` class stores in `src/lib/client/`.
- Commit messages: short imperative subjects, no prefixes.
