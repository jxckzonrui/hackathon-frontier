# VeilSettle

## What It Is

VeilSettle is a hackathon MVP for privacy-preserving stablecoin invoice settlement for Web3 agencies, auditors, and service vendors.

It lets an agency create an encrypted invoice, gives the client a local review step, prepares a private payment path, and exposes only public-safe settlement commitments for verification.

## Demo Flow

1. Agency opens the dashboard and creates a protocol audit sprint invoice.
2. Private invoice details stay in the authorized flow.
3. Client reviews local QVAC-compatible checks.
4. The app prepares a private payment through the configured provider route.
5. Public verification shows settlement status, hashes, and proof reference without amount, memo, line items, attachments, or client context.

## Architecture

- `apps/web`: Next.js app, API routes, UI, Vitest tests, Playwright E2E.
- `apps/web/src/lib/veilsettle`: invoice commitments, encryption boundary, storage boundary, and integration providers.
- `supabase/migrations/0001_veilsettle.sql`: invoice and encrypted blob schema with RLS enabled.
- `programs/veilsettle`: Anchor/Solana commitment registry.
- `docs/submission`: demo script, security statement, target mapping, and release evidence.

Provider boundaries keep sponsor integrations isolated:

- Privacy: MagicBlock/mock provider behind one private payment contract.
- Data: Dune SIM or static fallback for redacted settlement analytics.
- Identity: SNS provider/API contract for opt-in `.sol` identity.
- AI: QVAC-compatible deterministic local invoice review fallback.

## Current Release Status

VeilSettle is submitted as a hackathon MVP for privacy-preserving stablecoin invoice settlement.

Verified in this release:

- Encrypted invoice creation and public/private receipt separation.
- Local invoice review with a QVAC-compatible deterministic fallback.
- Dune SIM server adapter for redacted settlement analytics.
- SNS provider/API contract for opt-in `.sol` identity; live resolver evidence is pending.
- MagicBlock Private Payments unsigned transaction preparation.

Not claimed as complete:

- Live PUSD settlement until the official Solana mint/liquidity source is confirmed.
- Completed MagicBlock private payments until wallet signing/submission is wired.
- Production-ready wallet auth, encryption key recovery, or onchain proof verification.

Palm USD / PUSD is shown as the invoice denomination in the demo. VeilSettle does not claim live PUSD settlement until the official Solana SPL mint and liquidity path are confirmed.

## Track Fit

- Main Colosseum Frontier: core product demo.
- 100xDevs: usable Solana/Web3 MVP.
- Adevar Labs: security statement, threat model, public/private receipt separation, audit posture.
- Dune SIM: redacted settlement analytics adapter, live key evidence pending.
- SNS: opt-in identity provider/API contract, safe live resolver evidence pending.
- QVAC: local invoice review flow with deterministic fallback.
- MagicBlock/privacy: unsigned private payment preparation; signing/submission deferred.
- Palm USD: demo denomination only until official Solana mint/liquidity is confirmed.

RPC Fast remains evidence-dependent until a release endpoint is configured.

## Setup

1. Install dependencies:

   ```powershell
   corepack.cmd pnpm install
   ```

2. Copy the web env example:

   ```powershell
   Copy-Item apps/web/.env.example apps/web/.env.local
   ```

3. Fill only local or deployment secrets in `apps/web/.env.local`.

4. Run the app:

   ```powershell
   corepack.cmd pnpm --filter @veilsettle/web dev
   ```

## Environment Variables

Keep real values in `.env.local` or deployment secrets only.

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SOLANA_RPC_URL`
- `SOLANA_WS_URL`
- `YELLOWSTONE_GRPC_URL`
- `PRIVACY_PROVIDER`
- `MAGICBLOCK_PAYMENTS_API_URL`
- `MAGICBLOCK_TEE_RPC_URL`
- `MAGICBLOCK_PUSD_MINT`
- `DUNE_SIM_API_KEY`
- `DUNE_SIM_WALLET_ADDRESS`
- `TORQUE_API_TOKEN`

The submitted demo is safe to run in local fallback mode when Supabase credentials are not configured. The Supabase schema is included in `supabase/migrations/0001_veilsettle.sql`, but live project migration is not claimed until the project migration and RLS checks are verified.

## Verification

Useful checks:

```powershell
corepack.cmd pnpm --filter @veilsettle/web lint
corepack.cmd pnpm --filter @veilsettle/web test
corepack.cmd pnpm --filter @veilsettle/web build
corepack.cmd pnpm --filter @veilsettle/web test:e2e
corepack.cmd pnpm audit --audit-level moderate
```

Before publishing, run:

```powershell
git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD
```

## Security And Limitations

Only commit empty variable names in `apps/web/.env.example`. Keep real Supabase keys, wallet files, private keys, sponsor API keys, and local planning notes in ignored local files or deployment secrets.

See:

- `docs/security/publication-checklist.md`
- `docs/submission/security-statement.md`
- `docs/submission/live-evidence.md`

## Submission Links

- Deployed app: not yet published in repo.
- Demo video: not yet published in repo.
- GitHub repository: not yet published in repo.
- Colosseum project: not yet published in repo.
- Superteam submissions: not yet published in repo.
