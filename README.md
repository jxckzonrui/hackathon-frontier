# VeilSettle

Private stablecoin invoice settlement for Web3 agencies.

## Demo Flow

Agency creates an encrypted protocol-audit invoice, client reviews local QVAC checks, client pays through a private payment path, and public verification shows only status and commitments.

## Current Track Status

- Ready demo surface: Main Frontier, 100xDevs, Adevar Labs, RPC Fast.
- Implemented integrations: QVAC deterministic local review fallback, Dune SIM server adapter with redacted analytics, SNS identity provider and API route.
- Partial integration: MagicBlock Private Payments transaction builder. Wallet signing/submission is intentionally deferred.
- Blocked pending confirmation: Palm USD Solana mint/liquidity and live Supabase migration/application.
- Optional later: GoldRush, Torque, Zerion, theMiracle.

## Setup

1. Install dependencies with `corepack.cmd pnpm install`.
2. Copy `apps/web/.env.example` to `apps/web/.env.local` and fill only local or deployment secrets.
3. Run the app with `corepack.cmd pnpm --filter @veilsettle/web dev`.

Useful checks:

```powershell
corepack.cmd pnpm --filter @veilsettle/web test
corepack.cmd pnpm --filter @veilsettle/web build
corepack.cmd pnpm --filter @veilsettle/web test:e2e
```

## Public Safety

Only commit empty variable names in `apps/web/.env.example`. Keep real Supabase keys, wallet files, private keys, sponsor API keys, and local planning notes in ignored local files or deployment secrets.

Before publishing, run the checklist in `docs/security/publication-checklist.md` and confirm secret-scan matches are only placeholders, test stubs, or documentation references.
