# VeilSettle Live Evidence

Date: 2026-05-06
Branch: `codex/veilsettle-release-ledger`
Deployment URL: https://hackathon-frontier.vercel.app
Demo video URL: provided through the Colosseum portal, not tracked in repo
GitHub URL: https://github.com/mih249/hackathon-frontier

## Verification Commands

| Check | Command | Result |
|---|---|---|
| Lint | `corepack.cmd pnpm --filter @veilsettle/web lint` | Passed on 2026-05-06, exit 0. |
| Unit tests | `corepack.cmd pnpm --filter @veilsettle/web test` | Passed on 2026-05-06 20:45 +03, 15 files and 62 tests. |
| Build | `corepack.cmd pnpm --filter @veilsettle/web build` | Passed on 2026-05-06, exit 0. |
| E2E | `corepack.cmd pnpm --filter @veilsettle/web test:e2e` | Passed on 2026-05-06, 2 Playwright tests. |
| Production smoke | dashboard, new invoice, create invoice, pay page, payment proof, verify page, analytics | Passed on 2026-05-06 20:46 +03; smoke invoice `f3128c02-ffe0-42cb-b259-cfc6e554b5df`; analytics source `dune-sim`. |
| Final production smoke | dashboard, pay page, RPC status, analytics | Passed on 2026-05-07 against `https://hackathon-frontier.vercel.app`; production `/api/status/rpc` returned `provider: "rpc-fast"`, `healthy: true`, `claimable: true`, `evidence: "getHealth=ok"`; production analytics returned `source: "dune-sim"`. |
| Audit | `corepack.cmd pnpm audit --audit-level moderate` | Exit 1 from one documented moderate `postcss` advisory through Next/PostCSS; no critical/high advisories observed. |
| Secret scan | local ignored env values checked against tracked `HEAD` | `TRACKED_SECRET_VALUE_LEAKS=NONE`; `apps/web/.env.local` is ignored. |

## Integration Evidence

| Integration | Evidence | Claim |
|---|---|---|
| Supabase | Live project schema verified through Supabase MCP; `invoices` and `encrypted_invoice_blobs` exist with RLS enabled. Production smoke created an invoice and stored payment proof through the deployed app. | Live-backed schema/RLS and deployed create/proof write evidence exists. |
| MagicBlock | Browser wallet signed and submitted a MagicBlock private SPL transfer on devnet; signature `4b6qjNPWff5sHzL9hUvAvWN4KLLJzi7G69NyTtLXLS9GfpmMvugf8UiGC5vRiCNu4GeM3fcsZZQKE8VRqryZ1zk6` finalized with `err=null`. | Signed/submitted MagicBlock devnet evidence exists for the browser-wallet flow. |
| Dune SIM | Server adapter uses the SVM/Solana balances endpoint with `chains=solana`; local key/wallet smoke returned HTTP 200; production `/api/analytics/settlements` returned HTTP 200 with `source: "dune-sim"`. | Production Dune SIM analytics evidence exists for redacted settlement analytics. |
| SNS | Provider/API contract and tests exist; resolver uses the configured Solana/SNS RPC path when supported and falls back safely when unsupported. | Opt-in identity resolver/fallback; live claim requires `/api/identity/sns` smoke evidence. |
| QVAC / Local Agent | `@qvac/sdk` and `@qvac/cli` are installed; local model smoke returned HTTP 200; Local Invoice Agent converts local review signals into approve/review/reject decisions. | Live local QVAC model evidence exists; app still keeps deterministic fallback when runtime is absent. |
| PUSD | Official Palm USD developer docs publish Solana mainnet SPL mint `CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s`, 6 decimals, mint authority locked. | Verified-mint PUSD invoice utility prototype; no PUSD mainnet payment proof claim. |
| RPC Fast | Production `/api/status/rpc` returns redacted provider/health/evidence without exposing private endpoint URLs. | RPC Fast production proof exists: `provider: "rpc-fast"`, `healthy: true`, `claimable: true`, `evidence: "getHealth=ok"`. |
| GoldRush | Env hook exists; live endpoint evidence pending. | Optional, not claimed. |
| Torque or theMiracle | Env hook/story path only; evidence pending. | Optional, not claimed. |

## User Inputs And Evidence Status

| Input | Status | Needed for |
|---|---|---|
| Colosseum project/submission access | missing | Colosseum Frontier submission. |
| Public GitHub repository URL and push decision | repo documented as `https://github.com/mih249/hackathon-frontier`; final push still must match final commit | Public judging link and final release gate. |
| Deployment target access, project name, and public URL | production URL documented as `https://hackathon-frontier.vercel.app`; final deployment must match final commit | Judge-visible demo, screenshots, video. |
| `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` | configured in Vercel according to final readiness checklist; values are not printed or committed | Live Supabase claim and RLS verification. |
| `DUNE_SIM_API_KEY` and safe raw Solana `DUNE_SIM_WALLET_ADDRESS` | configured in Vercel according to final readiness checklist; production analytics smoke returned `source: "dune-sim"` | Deployment Dune SIM claim. |
| RPC Fast `SOLANA_RPC_URL` | provided locally, verified | RPC Fast claim and Solana/SNS smoke evidence. |
| Safe `.sol` name or wallet | provided locally | SNS live resolver evidence. |
| QVAC local runtime/API/CLI details | SDK/CLI installed, doctor passed, model smoke returned 200 | Runtime-backed QVAC model claim. |
| MagicBlock signing/submission risk decision and test wallet | decision provided, mini-plan created | Completed MagicBlock payment claim. |
| Demo video publishing destination | missing | Final submission package. |
| GoldRush API key | missing | Optional GoldRush receipt/wallet enrichment. |
| Torque API key or theMiracle benefit-budget decision | missing | Optional growth/user-benefit track evidence. |

## Supabase Evidence

- Release mode: live schema/RLS verified, and production smoke confirmed deployed invoice create/payment proof write flow.
- `apps/web/.env.example` includes empty `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` names.
- `supabase/migrations/0001_veilsettle.sql` includes `invoices` and `encrypted_invoice_blobs`.
- RLS is enabled in the migration for both invoice tables.
- Supabase MCP project `fbggsyazebrtiwbcursq` has both public invoice tables present with RLS enabled.
- Supabase advisors report informational `RLS Enabled No Policy` notices on both tables; this keeps browser/API table access closed until explicit policies are added.
- `corepack.cmd pnpm --filter @veilsettle/web test -- storage`: passed, 1 test file and 5 tests.
- Production smoke flow captured deployed create/read/payment proof behavior in `docs/submission/final-readiness-checklist-2026-05-06.md`.

## Dependency Audit Evidence

- Removed unused web dependencies: `@coral-xyz/anchor`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`.
- Removed vulnerable SNS SDK dependency path: `@bonfida/spl-name-service -> @solana/spl-token -> bigint-buffer`.
- Current `corepack.cmd pnpm audit --audit-level moderate` status: no critical or high advisories remain.
- Remaining moderate advisory: `postcss <8.5.10` through `next@16.2.4 -> postcss@8.4.31`. Mitigation for hackathon release: no user-supplied CSS stringification path is exposed by VeilSettle; keep Next.js patched when an upstream release updates the transitive PostCSS version.

## Local Invoice Agent Evidence

- Local Invoice Agent is local-only by default and does not require DeepSeek, OpenAI, or any paid cloud model.
- Agent mode values: `qvac-local-runtime-agent`, `qvac-local-fallback-agent`, or `local-deterministic-agent`.
- Agent decision values: `approve`, `review`, or `reject`.
- Agent recommended actions: `prepare-private-payment`, `request-changes`, or `block-payment`.
- Agent output is redacted and excludes amount, memo, line items, attachment hash, client wallet, and client display.
- Targeted tests:
  - `corepack.cmd pnpm --filter @veilsettle/web test -- src/lib/veilsettle/integrations/ai/local-agent.test.ts src/app/api/invoices/review/agent/route.test.ts`.

## SNS Evidence

- Provider/API contract exists for opt-in `.sol` identity.
- Resolver uses official SNS Quicknode JSON-RPC methods through the configured Solana/SNS RPC endpoint when supported:
  - `sns_resolveDomain`;
  - `sns_reverseLookup`.
- The resolver remains fallback-safe when the endpoint does not support SNS methods.
- No SNS identity is shown on public receipts without opt-in.
- `@bonfida/spl-name-service` is not required in this release; this avoids the prior vulnerable dependency path.
- Targeted test:
  - `corepack.cmd pnpm --filter @veilsettle/web test -- src/lib/veilsettle/integrations/identity/sns.test.ts`.

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
- Current release claim: browser-wallet signed and submitted MagicBlock private SPL transfer on devnet.
- API response support: provider parses `transactionBase64`, `sendTo`, and `requiredSigners`.
- Browser-wallet signing: verified with wallet `AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U` on devnet.
- Submission signature: `4b6qjNPWff5sHzL9hUvAvWN4KLLJzi7G69NyTtLXLS9GfpmMvugf8UiGC5vRiCNu4GeM3fcsZZQKE8VRqryZ1zk6`.
- Devnet status: finalized, `err=null`, slot `460572346`, block time `2026-05-06 21:48:25 UTC`.
- Devnet mint: MagicBlock documented devnet USDC `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`.
- Local `.env.local` is set to `PRIVACY_PROVIDER=magicblock` for the signed-flow demo and remains ignored.
- Release decision: MagicBlock can be claimed as signed/submitted devnet browser-wallet flow, not production mainnet settlement.

## PUSD Evidence

- Public source check on 2026-05-07 found Palm USD developer docs with official Solana PUSD metadata.
- Official Solana PUSD mint: `CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s`.
- Palm USD docs describe the Solana deployment as mainnet SPL, 6 decimals, with mint authority locked.
- Palm USD public circulation API returned HTTP 200 on 2026-05-07 and included a SOLANA circulation row.
- Release decision: PUSD is upgraded from demo-only denomination to verified-mint invoice utility prototype.
- Private payment preparation can use PUSD when `MAGICBLOCK_PUSD_MINT` or the default metadata path is configured, but the release still does not claim PUSD mainnet payment proof until a real PUSD transaction signature is captured.

## Dune SIM Evidence

- Server-side Dune SIM adapter and redacted analytics route exist.
- Adapter uses the SVM/Solana balances endpoint with `chains=solana` and `limit=10` because VeilSettle targets Solana settlement evidence.
- `DUNE_SIM_WALLET_ADDRESS` is trimmed and validated as a raw Solana `PublicKey` before any Dune request; `.sol` names and EVM `0x` addresses fall back without calling Dune.
- Provided Dune SIM key and Solana wallet were added to ignored local env; live smoke returned HTTP 200 from `GET /beta/svm/balances/{address}?chains=solana&limit=10`.
- Dune response matched the queried wallet and returned `balances_count=0` for the provided wallet at smoke time.
- Dune non-200 responses fall back through the configured RPC Fast `getBalance` path before static fallback.
- `corepack.cmd pnpm --filter @veilsettle/web test -- dune`: passed on 2026-05-06, 1 file and 6 tests.

## QVAC Evidence

- Runtime: localhost-only QVAC OpenAI-compatible adapter when `QVAC_BASE_URL` is configured; deterministic local fallback when empty or when the runtime returns an unusable response.
- Installed packages: `@qvac/sdk`, `@qvac/cli`, `bare-runtime-win32-x64`, and `bare-https`.
- Local config: `apps/web/qvac.config.json` declares `qvac-local-invoice-review` using `QWEN3_600M_INST_Q4`.
- Windows runtime helper: `corepack.cmd pnpm --filter @veilsettle/web qvac:serve:windows` runs QVAC from a short local runtime directory to avoid pnpm/native-addon path-length failures.
- Local base URL to use only when the runtime is serving: `http://127.0.0.1:11434/v1`.
- Expected endpoint/contract: OpenAI-compatible API, `POST /v1/chat/completions`, not `/review/invoice`.
- `corepack.cmd pnpm --filter @veilsettle/web qvac:doctor`: passed on 2026-05-06.
- Runtime smoke: after preparing the local model cache, `GET /v1/models` returned HTTP 200 with `qvac-local-invoice-review`; `POST /v1/chat/completions` returned HTTP 200 from the local QVAC model.
- App behavior: QVAC model output is parsed from raw JSON or fenced JSON; invalid/unavailable runtime responses fall back locally without exposing private invoice details.
- Private invoice text leaves local machine: no.
- Checks shown in UI: risk score, duplicate signal, vendor consistency, suspicious terms, privacy note.
- Cloud URL handling: rejected before private invoice content can be sent.
- Submission claim: QVAC-compatible local review design unless local QVAC runtime evidence is captured.
- `corepack.cmd pnpm --filter @veilsettle/web test -- qvac`: passed on 2026-05-06, 1 file and 7 tests.

## RPC Evidence

- RPC Fast endpoint was configured in ignored local env and returned `getHealth=ok` in a JSON-RPC smoke test.
- Dune SIM non-200 handling can use the same `SOLANA_RPC_URL` as a server-side `getBalance` fallback for the configured Solana wallet.
- `/api/status/rpc` checks `getHealth` and returns only redacted status: provider classification, health, claimability, and evidence string.
- Production evidence on 2026-05-07: `/api/status/rpc` returned `{"provider":"rpc-fast","healthy":true,"claimable":true,"evidence":"getHealth=ok","endpointPublic":false}`.
- Release claim: RPC Fast can be submitted with this production proof.
- `SOLANA_RPC_URL` remains the server-side env hook for future Solana/SNS/RPC verification.
- Targeted test:
  - `corepack.cmd pnpm --filter @veilsettle/web test -- src/lib/veilsettle/integrations/data/rpc.test.ts`.

## Screenshot Evidence

- `docs/submission/screenshots/dashboard.png`
- `docs/submission/screenshots/invoice-new.png`
- `docs/submission/screenshots/pay-agent-review.png`
- `docs/submission/screenshots/verify-public.png`
- `docs/submission/screenshots/settlements.png`

## Solana Program Evidence

- `anchor --version`: failed, `anchor` command is not installed in this PowerShell environment.
- `cargo --version`: failed, `cargo` command is not installed in this PowerShell environment.
- `solana --version`: failed, `solana` command is not installed in this PowerShell environment.
- `corepack.cmd pnpm anchor:test`: not run in Task 11 because Anchor CLI is unavailable.
- `cargo test`: not run in Task 11 because Cargo is unavailable.
- Release claim: Anchor program source is included, but fresh local program test execution is not claimed from this environment.

## Final Verification Evidence

- `git status --short --branch --untracked-files=all`: working branch is `codex/veilsettle-release-ledger` with the documented release-readiness edits pending commit.
- Docs claim scan: no unresolved placeholder markers; matches are explicit non-claims, track requirements, sources, or historical audit warnings.
- Public/private receipt behavior: Playwright checks confirm public verification contains status/proof/commitments and does not expose amount or private memo.
- Generated `apps/web/next-env.d.ts` build churn was reverted to the tracked route types import.
