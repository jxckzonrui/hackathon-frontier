# VeilSettle Live Evidence

Date: 2026-05-04
Branch: `codex/veilsettle-core-tasks`
Deployment URL: not yet published in repo
Demo video URL: not yet published in repo
GitHub URL: not yet published in repo

## Verification Commands

| Check | Command | Result |
|---|---|---|
| Lint | `corepack.cmd pnpm --filter @veilsettle/web lint` | |
| Unit tests | `corepack.cmd pnpm --filter @veilsettle/web test` | |
| Build | `corepack.cmd pnpm --filter @veilsettle/web build` | |
| E2E | `corepack.cmd pnpm --filter @veilsettle/web test:e2e` | |
| Audit | `corepack.cmd pnpm audit --audit-level moderate` | |
| Secret scan | `git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD` | |

## Integration Evidence

| Integration | Evidence | Claim |
|---|---|---|
| Supabase | | |
| MagicBlock | | |
| Dune SIM | | |
| SNS | | |
| QVAC | | |
| PUSD | | |
| RPC Fast | | |

## Supabase Evidence

- Release mode: local fallback unless live project migration is confirmed before submission.
- `apps/web/.env.example` includes empty `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` names.
- `supabase/migrations/0001_veilsettle.sql` includes `invoices` and `encrypted_invoice_blobs`.
- RLS is enabled in the migration for both invoice tables.
- `corepack.cmd pnpm --filter @veilsettle/web test -- storage`: passed, 1 test file and 5 tests.
- Live migration was not applied in this task, and live Supabase mode is not claimed.

## Dependency Audit Evidence

- Removed unused web dependencies: `@coral-xyz/anchor`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`.
- Removed vulnerable SNS SDK dependency path: `@bonfida/spl-name-service -> @solana/spl-token -> bigint-buffer`.
- Current `corepack.cmd pnpm audit --audit-level moderate` status: no critical or high advisories remain.
- Remaining moderate advisory: `postcss <8.5.10` through `next@16.2.4 -> postcss@8.4.31`. Mitigation for hackathon release: no user-supplied CSS stringification path is exposed by VeilSettle; keep Next.js patched when an upstream release updates the transitive PostCSS version.

## SNS Evidence

- Provider/API contract exists for opt-in `.sol` identity.
- Live SNS resolver is fallback-only until a safe resolver dependency or API path is configured.
- Removed the vulnerable `@bonfida/spl-name-service` dependency to keep the public repo free of critical/high audit findings.
- `corepack.cmd pnpm --filter @veilsettle/web test -- sns`: passed as part of Task 8 provider evidence.

## Provider Status Evidence

- Integration status aggregation now uses `getSettlementDataProvider().status()` for data integrations.
- With `DUNE_SIM_API_KEY` and `DUNE_SIM_WALLET_ADDRESS` configured, the dashboard status reports `dune-sim-settlement-analytics` as `configured`.
- `corepack.cmd pnpm --filter @veilsettle/web test -- provider-contracts`: passed, 1 test file and 6 tests.

## Private Payment Preparation Evidence

- Added `/api/privacy/payment` as the server route for private payment preparation through the configured provider.
- `PaymentSettlementActions` calls the private payment route before storing a payment proof reference.
- Payment proof references are restricted to known provider prefixes: `magicblock:`, `cloak:`, `umbra:`, `mock:`.
- Demo mode still works without live Supabase; non-demo invoices store the provider proof reference through `/api/invoices/[id]/payment-proof`.
- `corepack.cmd pnpm --filter @veilsettle/web test -- privacy payment-proof`: passed, 2 test files and 6 tests.
- `corepack.cmd pnpm --filter @veilsettle/web test:e2e`: passed, 2 Playwright tests.
- `corepack.cmd pnpm --filter @veilsettle/web build`: passed and includes `/api/privacy/payment`.

## MagicBlock Evidence

- Provider: MagicBlock Private Payments when `PRIVACY_PROVIDER=magicblock`.
- Current release claim: unsigned private SPL transfer preparation only.
- API response support: provider parses `transactionBase64`, `sendTo`, and `requiredSigners`.
- Wallet signing: not verified in this environment.
- Submission signature: not verified in this environment.
- Release decision: do not claim completed MagicBlock private payment settlement until wallet signing/submission and final signature capture are wired.

## PUSD Evidence

- Public source check on 2026-05-04 found Palm USD product pages, but no official Solana SPL mint/liquidity source suitable for hardcoding in the app.
- Release decision: PUSD remains a demo invoice denomination.
- Private payment preparation uses USDC by default until an official `MAGICBLOCK_PUSD_MINT` value is confirmed.
- VeilSettle does not claim live PUSD settlement in this release.

## Dune SIM Evidence

- Server-side Dune SIM adapter and redacted analytics route exist.
- No live `DUNE_SIM_API_KEY` / wallet evidence was available in this session.
- Current release evidence is unit/provider coverage plus static fallback behavior.
- `corepack.cmd pnpm --filter @veilsettle/web test -- dune`: passed as part of Task 8 provider evidence.

## QVAC Evidence

- Runtime: deterministic local fallback.
- Private invoice text leaves local machine: no.
- Checks shown in UI: risk score, duplicate signal, vendor consistency, suspicious terms, privacy note.
- Submission claim: QVAC-compatible local review design, not full QVAC SDK runtime.
- `corepack.cmd pnpm --filter @veilsettle/web test -- qvac`: passed as part of Task 8 provider evidence.

## RPC Evidence

- No RPC Fast endpoint was configured or verified in this session.
- Release claim: RPC Fast remains evidence-dependent, not a completed integration.
- `SOLANA_RPC_URL` remains the server-side env hook for future Solana/SNS/RPC verification.
