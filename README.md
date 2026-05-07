# VeilSettle

## What It Is

VeilSettle is a hackathon MVP for privacy-preserving stablecoin invoice settlement for Web3 agencies, auditors, and service vendors.

It lets an agency create an encrypted invoice, gives the client a local review step, prepares a private payment path, and exposes only public-safe settlement commitments for verification.

## Demo Flow

1. Agency opens the dashboard and creates a protocol audit sprint invoice.
2. Private invoice details stay in the authorized flow.
3. Client reviews local QVAC-compatible checks and the Local Invoice Agent decision.
4. The app prepares a private payment through the configured provider route only after local review.
5. Public verification shows settlement status, hashes, and proof reference without amount, memo, line items, attachments, or client context.

## Architecture

- `apps/web`: Next.js app, API routes, UI, Vitest tests, Playwright E2E.
- `apps/web/src/lib/veilsettle`: invoice commitments, encryption boundary, storage boundary, and integration providers.
- `supabase/migrations/0001_veilsettle.sql`: invoice and encrypted blob schema with RLS enabled.
- `programs/veilsettle`: Anchor/Solana commitment registry.
- `docs/submission`: demo script, security statement, target mapping, and release evidence.

Provider boundaries keep sponsor integrations isolated:

- Privacy: MagicBlock/mock provider behind one private payment contract.
- Data: Dune SIM SVM balances or RPC/static fallback for redacted settlement analytics.
- Identity: SNS opt-in `.sol` identity through the configured Solana/SNS RPC path when available.
- AI: Local Invoice Agent over a local QVAC OpenAI-compatible runtime when `QVAC_BASE_URL` is localhost, or a QVAC-compatible deterministic local review fallback.

## Current Release Status

VeilSettle is release-positioned as a hackathon MVP for privacy-preserving stablecoin invoice settlement.

Current public surfaces:

- Deployed app: https://hackathon-frontier.vercel.app
- GitHub repository: https://github.com/mih249/hackathon-frontier

Verified in this release:

- Encrypted invoice creation and public/private receipt separation.
- Local invoice review with either a localhost-only QVAC runtime adapter or a QVAC-compatible deterministic fallback.
- Local Invoice Agent that turns local review signals into approve/review/reject decisions before payment preparation.
- Supabase-backed invoice creation and payment proof storage on the current Vercel deployment.
- Dune SIM server adapter for redacted SVM balance analytics; the production route returns `source: "dune-sim"`.
- SNS resolver path for opt-in `.sol` identity through the configured Solana/SNS RPC endpoint; fallback stays explicit when unsupported.
- MagicBlock Private Payments browser-wallet signed devnet transaction submission.
- Palm USD / PUSD official Solana SPL mint metadata verified from Palm USD developer docs.

Not claimed as complete:

- Completed live PUSD mainnet settlement until a real transaction signature is captured.
- Production mainnet MagicBlock settlement; current evidence is devnet browser-wallet signing/submission.
- Production-ready wallet auth, encryption key recovery, or onchain proof verification.

Palm USD / PUSD is used as the invoice settlement denomination in the demo. Official Solana PUSD mint metadata is verified from Palm USD developer docs: `CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s`, SPL, 6 decimals. VeilSettle still does not claim completed live PUSD mainnet settlement until a real transaction signature is captured.

## Track Fit

- Main Colosseum Frontier: core product demo.
- 100xDevs: usable Solana/Web3 MVP.
- Adevar Labs: security statement, threat model, public/private receipt separation, audit posture.
- Dune SIM: redacted SVM balance analytics adapter with production HTTP 200 smoke evidence.
- SNS: opt-in identity resolver/fallback, never exposed on public receipt without opt-in.
- Tether QVAC: localhost-only runtime adapter if configured; otherwise QVAC-compatible local fallback.
- MagicBlock/privacy: signed/submitted devnet browser-wallet flow; no production mainnet settlement claim.
- Palm USD: verified-mint PUSD invoice utility prototype; no completed live mainnet settlement claim.
- GoldRush: optional only with live receipt/wallet enrichment evidence.
- Torque or theMiracle: optional only with credible campaign or user-benefit evidence.

RPC Fast remains evidence-dependent unless the submitted environment is proven to use the sponsor endpoint; `/api/status/rpc` returns redacted health evidence without exposing private endpoint URLs.

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
- `GOLDRUSH_API_KEY`
- `QVAC_BASE_URL`
- `QVAC_MODEL`
- `TORQUE_API_KEY`
- `TORQUE_API_TOKEN`

QVAC local runtime setup:

```powershell
corepack.cmd pnpm --filter @veilsettle/web qvac:doctor
corepack.cmd pnpm --filter @veilsettle/web qvac:prepare:windows
corepack.cmd pnpm --filter @veilsettle/web qvac:serve:windows
```

On Windows, `qvac:serve:windows` runs QVAC from a short local runtime directory to avoid pnpm path-length issues in native Bare addons. When the local QVAC model is serving, set `QVAC_BASE_URL=http://127.0.0.1:11434/v1` and `QVAC_MODEL=qvac-local-invoice-review` in local env or deployment secrets. Do not set a cloud URL; non-local QVAC URLs are rejected.

The submitted demo is safe to run in local fallback mode when Supabase credentials are not configured. The Supabase schema is included in `supabase/migrations/0001_veilsettle.sql`; current release evidence documents the live schema/RLS check and deployed create/payment proof smoke.

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
- `docs/security/public-github-deployment.md`
- `docs/submission/security-statement.md`
- `docs/submission/live-evidence.md`

## Submission Links

- Deployed app: https://hackathon-frontier.vercel.app
- Demo video: not yet published in repo.
- GitHub repository: https://github.com/mih249/hackathon-frontier
- Colosseum project: not yet published in repo.
- Superteam submissions: not yet published in repo.
