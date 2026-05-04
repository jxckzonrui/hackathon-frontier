# VeilSettle Live Evidence

Date:
Branch:
Deployment URL:
Demo video URL:
GitHub URL:

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

## Provider Status Evidence

- Integration status aggregation now uses `getSettlementDataProvider().status()` for data integrations.
- With `DUNE_SIM_API_KEY` and `DUNE_SIM_WALLET_ADDRESS` configured, the dashboard status reports `dune-sim-settlement-analytics` as `configured`.
- `corepack.cmd pnpm --filter @veilsettle/web test -- provider-contracts`: passed, 1 test file and 6 tests.

## Private Payment Preparation Evidence

- Added `/api/privacy/payment` as the server route for private payment preparation through the configured provider.
- `PaymentSettlementActions` calls the private payment route before storing a payment proof reference.
- Demo mode still works without live Supabase; non-demo invoices store the provider proof reference through `/api/invoices/[id]/payment-proof`.
- `corepack.cmd pnpm --filter @veilsettle/web test -- privacy payment-proof`: passed, 2 test files and 6 tests.
- `corepack.cmd pnpm --filter @veilsettle/web test:e2e`: passed, 2 Playwright tests.
- `corepack.cmd pnpm --filter @veilsettle/web build`: passed and includes `/api/privacy/payment`.
