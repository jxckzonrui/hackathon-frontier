# VeilSettle

Private stablecoin invoice settlement for Web3 agencies.

## Demo Flow

Agency creates an encrypted protocol-audit invoice, client reviews local QVAC checks, client pays through a private payment path, and public verification shows only status and commitments.

## Current Release Status

VeilSettle is submitted as a hackathon MVP for privacy-preserving stablecoin invoice settlement.

Verified in this release:

- Encrypted invoice creation and public/private receipt separation.
- Local invoice review with a QVAC-compatible deterministic fallback.
- Dune SIM server adapter for redacted settlement analytics.
- SNS provider/API for opt-in `.sol` identity.
- MagicBlock Private Payments unsigned transaction preparation.

Not claimed as complete:

- Live PUSD settlement until the official Solana mint/liquidity source is confirmed.
- Completed MagicBlock private payments until wallet signing/submission is wired.
- Production-ready wallet auth, encryption key recovery, or onchain proof verification.

## Current Track Status

- Ready MVP surface: Main Frontier, 100xDevs, Adevar Labs.
- Evidence-dependent tracks: RPC Fast, Dune SIM, SNS, QVAC, MagicBlock.
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
