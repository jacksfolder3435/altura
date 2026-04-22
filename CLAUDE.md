# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**Altura Persona Card** (`persona.altura.trade`) — a web app that takes an X (Twitter) handle, looks up the user's wallet in Altura's vault snapshot and their recent tweets on the X API, runs both through a data-driven persona engine, and renders a shareable "Platinum" PnL card. Clicking Share on X logs a raffle entry.

The canonical spec for the persona engine lives in `altura-persona-engine.pdf` at the repo root — read it first when touching scoring, thresholds, or titles. Source-of-truth code is `server/src/services/persona.ts`.

## Architecture

Two deployable pieces that are kept in a single repo and deployed together:

- **Client** (`src/`) — Vite + React + TypeScript + shadcn-ui + Tailwind. Single-page app with routes `/`, `/princess`, `/pitch`, `/leaderboard`, `/meetings`. Everyone sees the Platinum card now (the old Standard/toggle was removed in v1.4).
- **Server** (`server/`) — Express + TypeScript, runs on `:8787`. Proxies the X API and Altura snapshot API (so bearer tokens never reach the browser), runs the persona engine server-side, and writes raffle entries to Postgres.

The frontend calls the backend at `/api/*` — same-origin in production (nginx proxies), and via a Vite dev-server proxy locally (`vite.config.ts` forwards `/api` and `/health` to `127.0.0.1:8787`). Override with `VITE_BACKEND_URL` in `.env.local` if you need to bypass the proxy.

### Request flow for `GET /api/profile/:username`

1. `server/src/routes/profile.ts` fans out `fetchXProfile(username)` and `fetchAlturaHolder(username)` in parallel via `Promise.allSettled` — either is allowed to fail.
2. Altura snapshot returns `costBasis` (USD deposited), `unrealizedPnL` (USDC 6-decimal raw units — parsed by `altura.ts`), `transferCount`, `lastUpdatedTimestamp`. `firstDepositTimestampMs` is only set when `transferCount === 1` (see caveat below).
3. `resolvePersona()` in `server/src/services/persona.ts` runs the decision tree:
   - **Vault titles first** (rarest wins): Altura OG → Epoch 0 Survivor → Altura Gigachad → Baby Whale → Diamond Hands.
   - **Then X activity titles** via a *score-based* selector (v1.2): for each rule `score = matches / threshold`; the highest qualifying score wins (not first-match). Rules: Hyperliquid Maxi, InfoFi Enjooooyor, Memecoins, Airdrop Hunter, Thread Guy, Based Take Merchant, Quote Tweet Warrior, **Crypto Native** (broad safety net).
   - **Fallback**: Normie (previously "NPC").
4. Response shape includes `cardType: "platinum" | "standard"` (platinum when the user is a holder), `persona` (archetype + trigger), and the raw `x`/`altura` payloads.

### Known data caveat (Altura snapshot)

Altura's snapshot endpoint only exposes `lastUpdatedTimestamp` (latest tx, not first deposit). That means **Altura OG and Epoch 0 Survivor only fire reliably when `transferCount === 1`** (first = last). Multi-deposit users fall through to Gigachad/Baby Whale/Diamond Hands. Altura adding a `firstDepositTimestamp` field is a one-line fix on their side. The open question is tracked inline in `server/src/services/altura.ts` (`TODO(altura)`).

### Keyword lists

All X-activity keyword catalogs (`KW_HYPERLIQUID`, `KW_INFOFI`, `KW_MEMECOINS`, `KW_AIRDROPS`, `KW_BASED_TAKES`, `KW_CRYPTO_NATIVE`) live at the top of `server/src/services/persona.ts`. Matching uses `hasAny()` with lookaround word boundaries so `$hype`, `info-fi`, and plain words all tokenize correctly. Edit the lists in-place — no other file references them.

### Avatar proxy

`server/src/routes/avatar.ts` whitelists `pbs.twimg.com` / `abs.twimg.com` / `ton.twimg.com` and re-streams the bytes with `Access-Control-Allow-Origin: *`. This exists because `html-to-image` / `html2canvas` need the avatar on a non-tainted canvas to export the card as PNG for the Share button. Don't remove this route — the share flow depends on it.

### Share / raffle DB

Postgres, single table `shares`, wired up in `server/src/services/db.ts`. The pool connects lazily so the backend boots fine without `DATABASE_URL` (dev). IPs are SHA-256-hashed (16 hex chars) before storage. `GET /api/admin/shares.csv` is gated by a `Bearer $ADMIN_TOKEN` header.

## Commands

### Frontend (from repo root)

```bash
bun install            # or npm install — both lockfiles are checked in
bun run dev            # Vite on :8080, proxies /api + /health to :8787
bun run build          # production build → dist/
bun run lint           # ESLint
bun run test           # Vitest run (jsdom, src/**/*.test.{ts,tsx})
bun run test:watch
```

### Backend (from `server/`)

```bash
cd server
npm install
npm run dev            # tsx watch, reads server/.env
npm run build          # tsc → server/dist/
npm start              # node server/dist/index.js (what systemd runs in prod)
```

You need `server/.env` with at minimum `ALTURA_API_URL` and `ALTURA_API_KEY` (these are `required()` and the process exits without them — see `server/src/config.ts`). `X_BEARER_TOKEN` and `DATABASE_URL` are optional; the server degrades gracefully when missing (`isXConfigured`, `isDatabaseConfigured` flags).

## Deployment

Production is served at `persona.altura.trade` from a Linux VPS. Deployment details (host, IP, paths, systemd unit names, nginx config) are intentionally kept out of this file — ask the maintainer for a handoff doc. High level:

- Static client (`dist/` from `bun run build`) is served by nginx.
- Backend (`server/dist/index.js` from `npm run build` in `server/`) runs as a systemd service on `:8787`.
- Nginx reverse-proxies `/api/` and `/health` to `127.0.0.1:8787` and falls through to `try_files $uri $uri/ /index.html` for the SPA.
- Postgres hosts the `shares` table for the raffle.

Deploy loop is the obvious one: pull, rebuild client, rebuild backend, restart the backend service, reload nginx only if its config changed.

## Routing (frontend)

`src/App.tsx` — all routes live here, and any new route **must go above the catch-all `*`**. The current set: `/` (main persona flow), `/princess` (internal/demo), `/pitch` (presentation deck), `/leaderboard`, `/meetings`.

## Persona engine gotchas

- **"Platinum" vs "Standard"** is a leftover distinction — v1.4 ripped out the Standard card and the theme toggle, so `cardType` in the response is informational only and the frontend always renders `FigmaPlatinumCard`.
- **`transferCount === 1` gate** on OG / Epoch 0: not a bug. It's a deliberate safety rail until Altura ships `firstDepositTimestamp`.
- **Score-based X selector** (v1.2, recent): the *highest* matching score wins, not the first rule in the list. Adding a new X rule means picking a realistic threshold — too low and it'll steal everyone; too high and it'll never fire. Compare against the existing thresholds in `classifyX()`.
- **`src/lib/personaGenerator.ts`** is a legacy client-side fallback that only runs if the backend is unreachable — the real engine is server-side. Don't add new archetypes there; add them in `server/src/services/persona.ts`.
- **Easter egg**: `jackhaldorsson` is hardcoded to archetype index 8 in `personaGenerator.ts` (client fallback only).

## Share-to-X flow

`src/pages/Index.tsx` captures the live card DOM to PNG via `html-to-image` / `html2canvas`, attaches it to an X intent URL, and posts to `/api/share`. The share request uses `fetch(..., { keepalive: true })` so the raffle entry still logs after the page navigates to X. Failures are swallowed — sharing always works even if the backend is down.
