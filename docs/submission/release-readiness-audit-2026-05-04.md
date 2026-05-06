# VeilSettle Release Readiness Audit

Date: 2026-05-04
Branch: `codex/veilsettle-core-tasks`
Scope: release/polish audit only. No code changes and no `plan.md` changes are intended from this document.

## Short Verdict

Overall readiness for a hackathon release today: **64%**.

This is not a "do not submit" score. It means the project is already a coherent, test-passing MVP demo, but it is not yet a strong claims-safe release for the privacy/PUSD/live-backend sponsor story.

Two useful readings:

- **Local MVP demo with honest caveats:** about **74% ready**.
- **Competitive multi-track/sponsor release:** about **55-60% ready**.

The main reason is simple: the web demo works, but the most judge-sensitive pieces are still partially simulated or unverified live: Supabase project migration, MagicBlock signing/submission, official PUSD mint/liquidity, real QVAC runtime depth, live Dune/SNS/RPC evidence, and submission assets.

## Fresh Verification

Commands run on 2026-05-04:

- `corepack.cmd pnpm --filter @veilsettle/web lint` - exit 0.
- `corepack.cmd pnpm --filter @veilsettle/web test` - 14 test files passed, 45 tests passed.
- `corepack.cmd pnpm --filter @veilsettle/web build` - production build passed.
- `corepack.cmd pnpm --filter @veilsettle/web test:e2e` - 2 Playwright tests passed.
- Secret scan with the documented `git grep` pattern - only safe placeholders/test/docs references.
- `corepack.cmd pnpm audit --audit-level moderate` - failed with 10 advisories: 1 critical, 2 high, 6 moderate, 1 low.
- `corepack.cmd pnpm anchor:test` - not executed successfully because `anchor` CLI is not installed in this environment.
- `cargo test` in `programs/veilsettle` - not executed successfully because `cargo` is not installed in this environment.

## What Is Strong

- The core web flow is real enough for a demo: dashboard -> create invoice -> client review -> prepare payment proof -> public/private verification.
- The repo is much safer for publication than before: env examples are empty, private local files are ignored, and the current secret scan is clean.
- The provider architecture is a good decision. Privacy, AI, data, identity, and growth integrations are isolated instead of scattered through UI code.
- Public/private receipt separation is visible and tested. The E2E tests assert that amount and memo do not appear in public verification.
- The submission docs now avoid some dangerous overclaims: MagicBlock signing/submission and PUSD metadata are marked as unfinished elsewhere.
- Dune and SNS are no longer just labels at the library/API level; there are server-side adapters/routes and tests.

## Release Blockers

### P0: Submission/Eligibility Risk

The official Colosseum rules say individual registration closes on **May 4, 2026 at 11:59pm PT** and the contest period ends **May 11, 2026 at 11:59pm PT**. In Europe/Simferopol time, that is approximately **May 5, 2026 at 09:59** for registration and **May 12, 2026 at 09:59** for submission.

Also verify every team member's eligibility before any public submission. The official rules exclude several locations/residencies, including Russia and the Crimea/Sevastopol, Donetsk, Luhansk, Zaporizhzhia, and Kherson regions of Ukraine. Treat this as a legal/submission stop if relevant.

### P0: Dependency Audit Is Not Clean

`pnpm audit` currently reports a critical `protobufjs` advisory through the Trezor wallet adapter path, high advisories via `bigint-buffer` and `lodash`, plus moderate advisories including `uuid` and `postcss`.

This matters for a public repo and especially for an Adevar/security-facing story. A quick fix path is to remove unused broad wallet packages from the web app if they are not actually imported, then re-run audit. Current source search shows `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`, and `@coral-xyz/anchor` are declared in `apps/web/package.json` but not imported from app source.

### P0: Live Supabase Is Still Unproven

The app has schema/code/tests, but the live Supabase migration and schema verification are still blocked. The demo falls back locally when Supabase env is missing.

For a release, either:

- apply and verify the migration in the real project, or
- submit as a local-only MVP and make that limitation impossible to miss.

### P0: Private Settlement Is Not Actually Settled

MagicBlock currently builds unsigned private transfer transactions. The UI still prepares demo proof strings for the main flow, and the payment proof API accepts proof/signature strings without verifying onchain execution.

Do not claim a completed MagicBlock/private payment integration until wallet signing, submission, signature capture, and proof storage are wired and shown.

### P0: PUSD Is Still A UI Currency, Not Confirmed Settlement Support

The UI prominently says PUSD, but no official Solana SPL mint/liquidity source has been confirmed. This is fine as a demo denomination only if the submission copy is careful. It is not ready as a Palm USD track claim.

## Weak Or Risky Areas

- `docs/submission/frontier-sidetrack-readiness-plan.md` is stale in its "Current integrations" section. It still says MagicBlock, Dune, and SNS are not implemented, which conflicts with the current README and code.
- The official Colosseum announcement says Frontier removed tracks and bounties. Sponsor sidetracks on Superteam are separate. Public docs should separate "main Colosseum submission" from "Superteam sidetrack submissions" more clearly.
- `apps/web/src/lib/veilsettle/integrations/status.ts` uses `staticSettlementDataProvider.status()` directly, so the dashboard status can show data as mock even if Dune SIM env is configured.
- `apps/web/src/components/PaymentSettlementActions.tsx` is not connected to the privacy provider abstraction. It posts demo `cloak-proof-demo` data for non-demo invoices instead of preparing through MagicBlock/Dune/Solana-aware settlement flow.
- `apps/web/src/lib/veilsettle/encryption.ts` uses a process-local `lastKey`. This is acceptable for a demo, but not for a reliable reload/share/deploy story.
- Auth is demo-grade. `GET /api/invoices/[id]` trusts an `x-veilsettle-wallet` header and payment proof submission trusts caller-provided proof/signature strings.
- Supabase RLS is enabled in the migration, but policies are not defined. The server service-role flow can work, but this should be documented and verified.
- QVAC is currently a deterministic local fallback. That supports the privacy story, but it may be too shallow if the QVAC sidetrack expects SDK/runtime depth.
- SNS is implemented in provider/API tests, but not yet surfaced strongly in the product UI.
- Dune SIM is implemented server-side, but without a live key/wallet evidence the dashboard may remain static fallback.
- There is no fresh proof of Anchor tests or devnet deployment because Anchor/Cargo are not installed here.
- There is no live deployment URL, demo video, pitch deck, screenshots, or "why this wins" business narrative in the repo.

## Track Readiness Estimate

| Area | Readiness | Notes |
|---|---:|---|
| Main Colosseum product demo | 70% | Coherent MVP, tests pass, but needs deployment/video/business story. |
| 100xDevs/general builder track | 75% | Good enough if positioned as MVP; needs polish assets. |
| Adevar/security | 58% | Security statement exists, but audit advisories and auth/proof caveats are material. |
| RPC Fast | 50% | Env hooks exist; no clear live RPC Fast usage evidence. |
| QVAC | 50% | User-facing local review exists; real SDK/runtime depth is weak. |
| MagicBlock/privacy | 45% | Unsigned transaction builder only; signing/submission deferred. |
| PUSD/Palm USD | 25% | Demo denomination only until official mint/liquidity is confirmed. |
| Dune SIM | 70% | Server adapter and tests exist; live data proof still needed. |
| SNS | 70% | Provider/API exists; needs UI/demo evidence and live RPC check. |
| Supabase-backed product | 50% | Code/schema exist; live migration and env verification blocked. |
| Submission package | 60% | README/security/demo docs exist; stale doc, no video/deck/deploy links. |

## Recommended Work Before Release

### Must Do Before Public Release

1. Verify registration/team eligibility against the official rules today.
2. Fix or explicitly mitigate `pnpm audit` findings. Start by removing unused wallet/Anchor packages from the web app if they are not needed.
3. Update stale docs, especially `docs/submission/frontier-sidetrack-readiness-plan.md`, so no public file contradicts the current implementation.
4. Add a "live status / limitations" section to README and demo script that separates:
   - local MVP demo,
   - live Supabase mode,
   - MagicBlock unsigned builder,
   - PUSD unconfirmed metadata,
   - optional Superteam sidetracks.
5. Produce a 3-5 minute demo video and add deployment/GitHub/submission links.

### Highest ROI Engineering Polish

1. Apply and verify the Supabase migration in the live project.
2. Fix provider status so Dune/MagicBlock/SNS status reflects real env configuration.
3. Connect `PaymentSettlementActions` to the privacy provider abstraction, even if the final action remains "prepare unsigned transaction".
4. Add a Dune SIM live-data smoke test or screenshot/curl evidence using a safe wallet.
5. Surface SNS in the UI as opt-in merchant/client identity rather than only API/provider code.
6. Install Anchor/Cargo or document the exact Solana program verification path, then run `anchor test`.

### Convincing Additions For Judges

1. Add a short architecture diagram: invoice private data -> encrypted Supabase blob -> Solana commitments -> private payment proof -> public verification.
2. Add a "why now / target customer" section: agencies, auditors, payroll/service vendors, and clients who need proof of settlement without public invoice leakage.
3. Add a "privacy model" table: public fields, authorized fields, never exposed fields, demo-only assumptions.
4. Add screenshots or a video chapter list matching the demo script.
5. Add a small business wedge: first customers are Web3 agencies and audit shops settling retainers/milestones in stablecoins.
6. Add a live evidence appendix: Supabase table check, Dune response redaction, SNS resolution, MagicBlock unsigned transaction response, secret scan, audit status.

## Recommended Submission Positioning

Submit the main project as:

> VeilSettle: privacy-preserving stablecoin invoice settlement for Web3 agencies. The demo shows encrypted invoices, local invoice risk review, Solana commitment receipts, selective public verification, and privacy-safe analytics.

Avoid claiming:

- "live PUSD settlement" until official mint/liquidity is confirmed;
- "completed MagicBlock private payments" until signing/submission works;
- "production-ready encryption/auth" until wallet-encrypted keys and signed wallet auth are added;
- "live Supabase-backed demo" until migration/env/schema are verified;
- "QVAC SDK integration" unless the actual runtime/SDK is used.

## Sources Checked

- Colosseum Frontier announcement: https://blog.colosseum.com/announcing-the-solana-frontier-hackathon/
- Colosseum Frontier official rules PDF: https://colosseum.com/legal/Solana%20Frontier%20Hackathon%20Rules.pdf
- MagicBlock Superteam Privacy Track listing: https://superteam.fun/earn/listing/privacy-track-colosseum-hackathon-powered-by-magicblock-st-my-and-sns
- SNS Superteam Identity Track listing: https://superteam.fun/earn/listing/sns-identity-track-colosseum-hackathon-powered-by-sns-stmy-magicblock
- RPC Fast Frontier support post: https://rpcfast.com/blog/frontier-hackathon-rpc-fast-support
