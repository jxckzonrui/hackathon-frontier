# VeilSettle Live Evidence

Date: 2026-05-06
Branch: `codex/hackathon-readiness-check`
Deployment URL: not yet published in repo
Demo video URL: not yet published in repo
GitHub URL: not yet published in repo

## Verification Commands

| Check | Command | Result |
|---|---|---|
| Lint | `corepack.cmd pnpm --filter @veilsettle/web lint` | Passed on 2026-05-06, exit 0. |
| Unit tests | `corepack.cmd pnpm --filter @veilsettle/web test` | Passed on 2026-05-06, 15 files and 61 tests. |
| Build | `corepack.cmd pnpm --filter @veilsettle/web build` | Passed on 2026-05-06, exit 0. |
| E2E | `corepack.cmd pnpm --filter @veilsettle/web test:e2e` | Passed on 2026-05-06, 2 Playwright tests. |
| Audit | `corepack.cmd pnpm audit --audit-level moderate` | Exit 1 from one documented moderate `postcss` advisory through Next/PostCSS; no critical/high advisories observed. |
| Secret scan | local ignored env values checked against tracked `HEAD` | `TRACKED_SECRET_VALUE_LEAKS=NONE`; `apps/web/.env.local` is ignored. |

## Integration Evidence

| Integration | Evidence | Claim |
|---|---|---|
| Supabase | Live project schema verified through Supabase MCP; `invoices` and `encrypted_invoice_blobs` exist with RLS enabled. | Live-backed schema/RLS evidence exists; app flow still needs deployed live create/read proof. |
| MagicBlock | Provider prepares unsigned private SPL transfer payloads. | Unsigned private payment preparation only. |
| Dune SIM | Server adapter uses the SVM/Solana balances endpoint with `chains=solana`; local key/wallet smoke returned HTTP 200. | Local live Dune SIM evidence exists; add deployment evidence before public submission claim. |
| SNS | Provider/API contract and tests exist; safe wallet provided; resolver smoke pending. | Opt-in identity contract/fallback until live resolver evidence exists. |
| QVAC | `@qvac/sdk` and `@qvac/cli` are installed; `qvac doctor` passes; OpenAI-compatible runtime setup is present; local model smoke returned HTTP 200. | Live local QVAC model evidence exists; app still keeps deterministic fallback when runtime is absent. |
| PUSD | No official Solana SPL mint/liquidity source verified. | Demo denomination only. |
| RPC Fast | Provided `SOLANA_RPC_URL` returned `getHealth=ok` in local smoke. | Endpoint evidence exists locally; add deployment evidence before public submission claim. |
| GoldRush | Env hook exists; live endpoint evidence pending. | Optional, not claimed. |
| Torque or theMiracle | Env hook/story path only; evidence pending. | Optional, not claimed. |

## User Inputs And Evidence Status

| Input | Status | Needed for |
|---|---|---|
| Colosseum project/submission access | missing | Colosseum Frontier submission. |
| Public GitHub repository URL and push decision | missing | Public judging link and final release gate. |
| Deployment target access, project name, and public URL | missing | Judge-visible demo, screenshots, video. |
| `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` | missing | Live Supabase claim and RLS verification. |
| `DUNE_SIM_API_KEY` and safe raw Solana `DUNE_SIM_WALLET_ADDRESS` | provided locally, balances smoke returned 200 | Deployment Dune SIM claim. |
| RPC Fast `SOLANA_RPC_URL` | provided locally, verified | RPC Fast claim and Solana/SNS smoke evidence. |
| Safe `.sol` name or wallet | provided locally | SNS live resolver evidence. |
| QVAC local runtime/API/CLI details | SDK/CLI installed, doctor passed, model smoke returned 200 | Runtime-backed QVAC model claim. |
| MagicBlock signing/submission risk decision and test wallet | decision provided, mini-plan created | Completed MagicBlock payment claim. |
| Demo video publishing destination | missing | Final submission package. |
| GoldRush API key | missing | Optional GoldRush receipt/wallet enrichment. |
| Torque API key or theMiracle benefit-budget decision | missing | Optional growth/user-benefit track evidence. |

## Supabase Evidence

- Release mode: live schema/RLS verified, but deployed live app create/read proof is still pending.
- `apps/web/.env.example` includes empty `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` names.
- `supabase/migrations/0001_veilsettle.sql` includes `invoices` and `encrypted_invoice_blobs`.
- RLS is enabled in the migration for both invoice tables.
- Supabase MCP project `fbggsyazebrtiwbcursq` has both public invoice tables present with RLS enabled.
- Supabase advisors report informational `RLS Enabled No Policy` notices on both tables; this keeps browser/API table access closed until explicit policies are added.
- `corepack.cmd pnpm --filter @veilsettle/web test -- storage`: passed, 1 test file and 5 tests.
- Live deployment create/read proof was not captured in this task.

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
- User approved attempting signing/submission with a test wallet and accepted dependency/audit risk; a separate mini-plan exists at `docs/superpowers/plans/2026-05-06-magicblock-signing-submission.md`.
- Local `.env.local` remains on `PRIVACY_PROVIDER=mock` for the stable demo path until that mini-plan is executed.
- Release decision: do not claim completed MagicBlock private payment settlement until wallet signing/submission and final signature capture are wired.

## PUSD Evidence

- Public source check on 2026-05-04 found Palm USD product pages, but no official Solana SPL mint/liquidity source suitable for hardcoding in the app.
- Release decision: PUSD remains a demo invoice denomination.
- Private payment preparation uses USDC by default until an official `MAGICBLOCK_PUSD_MINT` value is confirmed.
- VeilSettle does not claim live PUSD settlement in this release.

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
- Release claim: local RPC Fast endpoint evidence exists; deployment evidence is pending.
- `SOLANA_RPC_URL` remains the server-side env hook for future Solana/SNS/RPC verification.

## Solana Program Evidence

- `anchor --version`: failed, `anchor` command is not installed in this PowerShell environment.
- `cargo --version`: failed, `cargo` command is not installed in this PowerShell environment.
- `solana --version`: failed, `solana` command is not installed in this PowerShell environment.
- `corepack.cmd pnpm anchor:test`: not run in Task 11 because Anchor CLI is unavailable.
- `cargo test`: not run in Task 11 because Cargo is unavailable.
- Release claim: Anchor program source is included, but fresh local program test execution is not claimed from this environment.

## Final Verification Evidence

- `git status --short --branch --untracked-files=all`: working branch is `codex/hackathon-readiness-check` with the documented release-readiness edits pending commit.
- Docs claim scan: no unresolved placeholder markers; matches are explicit non-claims, track requirements, sources, or historical audit warnings.
- Public/private receipt behavior: Playwright checks confirm public verification contains status/proof/commitments and does not expose amount or private memo.
- Generated `apps/web/next-env.d.ts` build churn was reverted to the tracked route types import.
