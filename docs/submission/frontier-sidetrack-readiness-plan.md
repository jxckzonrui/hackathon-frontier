# Frontier Sidetrack Readiness Plan

Research date: 2026-05-03

This document records the current Superteam Earn Frontier sidetrack requirements and maps them to the VeilSettle MVP. It is intentionally safe for a public repository: no API keys, wallet private keys, Supabase secrets, or private team data are included.

## Executive Summary

VeilSettle is a strong fit for a privacy-preserving stablecoin invoice settlement demo, but the current demo is not yet a complete submission for every sidetrack. The app already has a Next.js web demo, Supabase storage schema, an Anchor commitment registry, PUSD invoice UI, local QVAC-compatible review checks, MagicBlock unsigned private transfer preparation, Dune SIM redacted analytics adapter, SNS provider/API, and a Torque event stub.

To make the project credible for hackathon judging, the next build should focus on one coherent product:

1. Private B2B invoice creation and review.
2. Real persistence through Supabase.
3. One real private payment rail as the default path.
4. Local QVAC invoice review as a functional, user-facing step.
5. PUSD as a real supported settlement currency after confirming the official mint/liquidity.
6. Privacy-safe analytics and settlement verification using Dune SIM or GoldRush.
7. Public-safe docs, README, demo video, and pitch deck.

Do not try to make every sponsor integration equally deep in one pass. Some tracks require real sponsor SDK/API usage and will reject shallow labels. The practical strategy is to build a clean integration layer, ship one deep private payment path, then add smaller but real adapters for data, identity, and growth.

## Critical Dates And Eligibility

- Colosseum Frontier official contest period: April 6, 2026 at 6:00am PT through May 11, 2026 at 11:59pm PT.
- Colosseum individual registration deadline: May 4, 2026 at 11:59pm PT.
- Superteam Earn Frontier sidetrack listings observed through the live page/API mostly close on May 12, 2026 at 11:59:59 UTC.
- Colosseum official winner announcement: on or about June 23, 2026.
- Superteam sponsor winner dates differ by listing.
- Colosseum rules require all submitted content to be in English.
- Colosseum rules say each entrant may only be a member of one team and a team may only submit one project at a time.
- Important eligibility risk: the official Colosseum Frontier rules exclude persons located or ordinarily resident in several sanctioned/restricted jurisdictions, including Russia and the Crimea/Sevastopol, Donetsk, Luhansk, Zaporizhzhia, and Kherson regions of Ukraine. Verify every team member's eligibility before submission.

## Current Project Baseline

Tracked product surfaces:

- `apps/web`: Next.js 16, React 19, TypeScript, Tailwind, API routes, Vitest, Playwright.
- `programs/veilsettle`: Anchor/Solana commitment registry.
- `supabase/migrations/0001_veilsettle.sql`: invoice and encrypted blob tables with RLS enabled.
- `docs/submission`: demo, security, and target docs.

Current integrations:

- Supabase: schema and server storage boundary exist; live project migration still needs final verification.
- QVAC: local invoice review flow exists with deterministic fallback; real runtime depth needs evidence if used as a QVAC claim.
- PUSD: supported as demo denomination; official Solana mint/liquidity still needs confirmation before claiming live settlement.
- MagicBlock: Private Payments provider builds unsigned private SPL transfer transactions; wallet signing/submission is tracked as a separate risky mini-task.
- Dune SIM: server adapter and redacted analytics route exist; live-key evidence still needs to be captured.
- SNS: provider and API route exist for opt-in `.sol` resolution; UI evidence still needs to be captured.
- Torque: event emitter exists; real campaign flow is optional after core release.
- GoldRush, Umbra, Cloak, Zerion, theMiracle: optional or deferred unless explicitly implemented and evidenced.

## Recommended Architecture

Keep the web app as the main demo interface. Add integrations behind server-side adapters and explicit provider contracts:

- `apps/web/src/lib/veilsettle/core`: invoice domain logic, commitments, encryption, public/private receipt contracts.
- `apps/web/src/lib/veilsettle/integrations/privacy`: `magicblock`, `cloak`, `umbra`, and `mock` providers behind one `PrivatePaymentProvider` interface.
- `apps/web/src/lib/veilsettle/integrations/ai`: QVAC local review adapter.
- `apps/web/src/lib/veilsettle/integrations/stablecoins`: PUSD/USDC/USDT mint metadata and settlement validation.
- `apps/web/src/lib/veilsettle/integrations/data`: Dune SIM and GoldRush adapters.
- `apps/web/src/lib/veilsettle/integrations/identity`: SNS resolution and reverse lookup.
- `apps/web/src/lib/veilsettle/integrations/growth`: Torque event and reward campaign adapter.
- `tools/zerion-agent` or a separate forked repo: only if pursuing Zerion, because that track explicitly requires a Zerion CLI fork and real transaction execution.

All API keys and service-role credentials must stay server-side. Browser code should only call our own API routes.

## Track Matrix

| Track | Status for VeilSettle | Requirements | Needed stack | Costs / keys | Work needed |
|---|---|---|---|---|---|
| 100xDevs | Strong broad fit | Solana project, Colosseum + Superteam submission, GitHub, usable demo. Judged on execution, innovation, real use case, UX, completeness. | Current Next.js/Solana/Supabase stack. | No sponsor API or fee. | Polish full demo, README, setup docs, video, product story. |
| Adevar Labs | Strong if security package is real | Frontier submission, public GitHub, complete technical docs, project description, security statement, funding/pitch deck. Focus includes DeFi, RWAs, consumer apps, stablecoins. | Anchor tests, threat model, security docs, audit scope, invariant tests. | No API key. Prize is audit credits, reportedly applicable up to 50 percent of total audit cost, so it may not cover a full audit. | Add threat model, program/account diagrams, admin/key policy, known risks, audit readiness checklist, pitch/funding summary. |
| RPC Fast | Good low-risk infra track | Colosseum submission, public repo, README, demo/deck, follow RPC Fast on X, join Telegram. Bonus requires using RPC Fast. | `@solana/web3.js`, RPC provider abstraction, optional WebSocket/Yellowstone watcher. | Hackathon plan advertised with 120M CU/month, 500 req/s, unlimited bandwidth, Shredstream/Yellowstone, Frankfurt endpoint. Paid plans may apply after hackathon. Env: `SOLANA_RPC_URL`, `SOLANA_WS_URL`, optional `YELLOWSTONE_GRPC_URL`. | Use RPC Fast endpoint for settlement status, transaction confirmation, and watcher demo; document why reliable RPC matters. |
| Tether QVAC | Strong if QVAC becomes core | Meaningful QVAC SDK integration, not a wrapper. Must be valid Colosseum submission, public GitHub, working demo/video, answer how QVAC is integrated. Judging: 40 percent QVAC depth, 30 percent product value, 20 percent innovation, 10 percent demo. | `@qvac/sdk`, optional `@qvac/cli`, local model files, Node >= 22.17 for SDK flow. | No cloud API key. Cost is local compute, model storage, and hardware time. | Replace static checks with local QVAC review: OCR/embedding/RAG or local LLM consistency checks over invoice terms. Best demo: "invoice review happens locally; private invoice data never leaves device." |
| Palm USD | Strong stablecoin fit, needs confirmation | Build PUSD utility on Solana after official mint/liquidity confirmation. Requires Colosseum link, GitHub, demo video, 5 min pitch deck max 12 slides. Judged on technical execution, use case, innovation, traction, team. | SPL token support, wallet adapter, PUSD mint metadata, optional settlement receipt. | Public self-serve API/mint docs were not clearly found. Need sponsor-confirmed official Solana mint and liquidity. Normal SPL transfers require RPC and wallet. | Keep PUSD as default invoice denomination, confirm official mint, show PUSD settlement path only after evidence, add Palm-specific deck slide. |
| Cloak | Excellent direct fit | Working demo/live deployment or clear local setup. Public GitHub. README must explain problem, target users, Cloak SDK centrality, setup, deployed IDs/links. Demo video under 5 minutes. Judged: 40 percent integration depth, 30 percent product, 30 percent real-world use. | `@cloak.dev/sdk`, `@solana/web3.js`, Solana wallet/RPC. | No API key visible. Costs include Solana fees plus Cloak fee floor and percentage fee according to Cloak docs/listing research. Env: `SOLANA_RPC_URL`, wallet/key path for local demo only. | Build real Cloak private invoice payment or claim-link flow, plus viewing-key/auditor export. |
| Umbra | Excellent direct fit | Build product/prototype using Umbra SDK. Public GitHub, README with problem/users/Umbra usage/build instructions/deployed links, demo video under 5 minutes. Judged on SDK centrality, innovation, technical execution, commercial potential, impact, UX, clarity. | `@umbra-privacy/sdk`, Solana RPC, subscription RPC, optional indexer/relayer endpoints. | No API key visible. Costs include Solana fees and Umbra protocol/dynamic fees. Env: `SOLANA_RPC_URL`, `SOLANA_WS_URL`, optional `UMBRA_INDEXER_API_URL`. | Build Umbra settlement adapter, encrypted balance/payment-link demo, viewing-key audit report. |
| MagicBlock | Excellent direct fit | Privacy-first systems using ER, PER, or Private Payments API. Requires live deployment with successful MagicBlock integration, public GitHub, 3 min demo. Judged: technology 40 percent, impact 30 percent, creativity/UX 30 percent. | MagicBlock ER/PER SDK/API, Private Payments API, wallet auth, Solana RPC. | Public pricing unclear; likely needs sponsor/docs coordination for production. Env likely `MAGICBLOCK_PAYMENTS_API_URL`, `MAGICBLOCK_TEE_RPC_URL`, `SOLANA_RPC_URL`, `USDC_MINT`, auth/session token. | Build deposit -> private transfer -> private balance -> withdraw invoice flow with invoice reference. This may be the best single privacy rail for the demo if API access is straightforward. |
| Dune | High fit and relatively fast | Must use one or more Dune SIM endpoints for SVM/EVM and clearly demo usage. Prize is SIM Enterprise plan, not cash. Criteria: requirements 50 percent, SIM effectiveness 20 percent, creativity/UX 20 percent, innovation 10 percent. | Dune SIM API, server route, settlement analytics cache. | Needs Dune SIM account and `DUNE_SIM_API_KEY`. Free plan: 1M compute units/month, 5 RPS. Enterprise starts at about $500/month. | Add privacy-safe settlement analytics: wallet/token balances, transaction/activity feed, webhooks, paid invoice count using hashed invoice IDs only. |
| GoldRush | High fit | Must use GoldRush endpoint(s), public GitHub, website, demo video posted on X tagging `@goldrushdev`, Colosseum profile, Telegram POC. | GoldRush REST API or `@covalenthq/client-sdk`, optional CLI. | Needs `GOLDRUSH_API_KEY`. Free 14-day trial with 25k credits and 4 RPS. Paid plans start around $10/month; pro tiers higher. | Add onchain receipt feed, stablecoin transfer verification, counterparty risk/trust score, compliance dashboard. |
| Torque | Medium fit, growth-dependent | Must pass `custom_events`, trigger incentives/distributors through Torque MCP/API, public repo, demo on X tagging `@torqueprotocol`, and include a Friction Log. Judged on measurable incentive use. | Torque MCP/API, server-side event queue, campaign config. | Needs Torque account and `TORQUE_API_TOKEN` or equivalent. Public pricing unclear. Real incentives require a reward budget. | Convert current `TORQUE_API_KEY` stub to real event/campaign adapter. Emit `invoice_created`, `invoice_settled`, `early_payment`, `referral_completed`; show rebate/raffle/leaderboard. |
| SNS | High fit, but eligibility wording needs care | Listing is shown as Global, but description says register/submit selecting Malaysia or Network State. Must build identity/social identity/agent identity on Solana. English required. | SNS SDK/API, Solana RPC, optional `.sol` registration. | No API key. Registering `.sol` names may cost money; 5+ char names around $20 one-time in SNS docs, shorter names more. | Replace regex with real `.sol` resolution/reverse lookup. Add opt-in merchant identity and optional invoice-agent identity without weakening privacy. |
| Zerion | Medium fit, separate track path | Must fork Zerion CLI, build autonomous onchain agent, execute at least one real transaction, implement scoped policy, route swaps through Zerion API, public GitHub, demo/live demo. Germany listing is regional; use Global unless team is eligible for Germany. | Fork `zeriontech/zerion-ai`, Zerion API, policy engine, minimal wallet with low-value funds. | Needs `ZERION_API_KEY`. Official pricing page currently shows Developer free plan with limited requests/RPS, then paid tiers. x402/MPP can introduce pay-per-request costs. Never commit private keys. | Build separate "invoice settlement agent": chain lock, spend limit, expiry, allowed recipient/mint, low-value real settlement/rebalance transaction. |
| theMiracle | Medium growth fit, budget-dependent | Product must be live/testable. Requires GitHub, website/deck, ideal customer persona, benefit proposal with Audience/Action/Incentive/Value, growth context. Award is wallet placement value, not cash. Winner must commit at least $5k perceived user-facing incentive value. | Benefit simulator, campaign assets, landing/action tracking. No SDK found. | No API key found. Real campaign likely requires $5k perceived incentive budget in credits, tier access, tokens, or similar. | Create benefit proposal: "settle first private invoice and receive fee credits/premium tier." Only pursue if incentive budget is credible. |

## Priority Recommendation

Recommended primary submission stack:

- Main app: Next.js web app plus Supabase.
- Blockchain: Solana devnet/mainnet-ready Anchor commitment registry and SPL token settlement support.
- Privacy rail: choose one deep path first. Recommended order: MagicBlock if Private Payments API access is smooth; otherwise Cloak or Umbra. Do not submit to Cloak/Umbra/MagicBlock with labels only.
- AI: QVAC local invoice review.
- Stablecoin: PUSD support after sponsor-confirmed mint.
- Data: Dune SIM first, GoldRush second.
- Identity: SNS resolution.
- Growth: Torque only after core flow works.
- Agent: Zerion only as a separate fork/demo if time remains.
- Distribution: theMiracle only if a real $5k user benefit can be offered.

If time is limited, the highest-confidence target bundle is:

1. 100xDevs.
2. Adevar Labs.
3. RPC Fast.
4. Tether QVAC.
5. Palm USD.
6. One of MagicBlock, Cloak, or Umbra as the real private payment rail.
7. Dune.
8. SNS.

GoldRush, Torque, Zerion, and theMiracle can be added after the core demo is stable.

## Implementation Roadmap

### Phase 0: Public Safety And Submission Hygiene

Purpose: prevent secrets or private notes from reaching GitHub and make the repo judge-friendly.

Actions:

- Keep `agent.md`, `documentation.md`, `.worktrees`, and `docs/superpowers` out of the release.
- Keep real values only in local `.env.local`, Vercel/project env, Supabase dashboard secrets, and sponsor dashboards.
- Keep `apps/web/.env.example` with empty placeholders only.
- Add any new env placeholders without values.
- Use a clean public release branch or orphan branch before pushing if old history may contain planning notes.
- Run a secret scan before push:

```powershell
git status --short --untracked-files=all
git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD
```

Expected outcome: public repository contains code, docs, and examples only; no secrets, no wallet files, no service role keys.

### Phase 1: Supabase-Backed Working Demo

Purpose: make the current website persist invoices reliably.

Actions:

- Apply `supabase/migrations/0001_veilsettle.sql` to the Supabase project.
- Configure `apps/web/.env.local` locally with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Keep Supabase service role key server-only.
- Verify create invoice -> fetch invoice -> payment proof -> public verify flow.
- Add README setup instructions for Supabase.

Expected outcome: the demo no longer depends on local fallback for normal invoice creation.

### Phase 2: Core Product Structure

Purpose: make sponsor integrations composable instead of scattered.

Actions:

- Define provider contracts for private payments, AI review, identity, data, and growth events.
- Move current mock adapters behind explicit interfaces.
- Ensure every provider returns safe public receipt fields and does not leak amount, memo, line items, attachments, or counterparties to public endpoints.
- Add a provider status panel in the app for demo clarity.

Expected outcome: project is structured enough to add sponsor APIs without turning the app into one large demo script.

### Phase 3: Real Private Payment Rail

Purpose: satisfy at least one serious privacy track.

Options:

- MagicBlock: best if Private Payments API access is smooth and live deployment is feasible.
- Cloak: best if the SDK quickstart can produce a working private invoice payment quickly.
- Umbra: best if SDK/indexer/relayer flow is easiest for payment links and viewing-key reporting.

Actions:

- Choose one active provider for the first real implementation.
- Keep other providers disabled or clearly marked as planned unless real flows are implemented.
- Implement deposit/transfer/withdraw or private claim-link flow.
- Store payment proof references in Supabase and public verification.
- Add selective reveal/auditor viewing key story.

Expected outcome: a judge can run or watch a real private settlement flow, not just see a mock proof string.

### Phase 4: QVAC Local Invoice Review

Purpose: satisfy Tether QVAC with a meaningful integration.

Actions:

- Integrate QVAC SDK or QVAC local server for one real local capability.
- Recommended capability: local invoice consistency review using embeddings/RAG or local LLM checks over invoice terms.
- Optional capability: OCR for uploaded invoice attachments.
- Add UI showing checks are local and no invoice private data leaves the device.
- Add a fallback mock only for missing local QVAC runtime, clearly labeled as fallback.

Expected outcome: QVAC is part of the product's core review step.

### Phase 5: Stablecoin And PUSD Path

Purpose: make Palm USD coverage honest.

Actions:

- Confirm official PUSD Solana mint and test/dev liquidity with Palm USD sponsor or official docs.
- Add mint metadata and SPL transfer validation.
- Keep USDC/USDT fallback for privacy rails that support them more readily.
- Show invoice denominated in PUSD and public receipt with only commitments/proof.

Expected outcome after sponsor confirmation: VeilSettle can be submitted as a PUSD utility demo instead of only showing PUSD as a UI denomination.

### Phase 6: Data And Analytics

Purpose: satisfy Dune and optionally GoldRush with privacy-safe data.

Actions:

- Dune SIM: fetch SVM wallet balances, transactions, or activity for settlement/escrow wallets.
- GoldRush: fetch structured transaction history or balances for proof/receipt dashboard.
- Cache or server-proxy all sponsor API requests.
- Redact private fields and use hashed invoice IDs/nullifiers.
- Add settlement analytics dashboard that shows aggregate status without exposing invoice details.

Expected outcome: Dune/GoldRush are used for real data intelligence while preserving the product's privacy promise.

### Phase 7: SNS Identity

Purpose: make Solana-native identity real and optional.

Actions:

- Resolve `.sol` names to wallets.
- Reverse lookup wallet to primary `.sol` where available.
- Add opt-in merchant identity display.
- Add optional agent identity for an invoice clerk or settlement bot if it supports the SNS track story.

Expected outcome: SNS improves UX and trust without weakening private settlement.

### Phase 8: Growth And Agent Tracks

Purpose: cover lower-priority tracks only after core demo works.

Actions:

- Torque: emit real campaign events and create a friction log.
- theMiracle: create Audience/Action/Incentive/Value proposal only if a $5k perceived incentive is credible.
- Zerion: fork CLI separately and build a scoped invoice settlement agent with one real low-value transaction.

Expected outcome: these become honest add-ons, not distractions from the core submission.

### Phase 9: Submission Package

Purpose: give judges everything needed quickly.

Actions:

- Rewrite root README for public judges: overview, architecture, setup, env, demo flow, track mapping.
- Add security statement, threat model, and known limitations.
- Record a 3 to 5 minute demo video.
- Prepare a 12-slide max deck for Palm/Adevar/theMiracle where needed.
- Add links to Colosseum profile, Superteam submissions, deployed app, GitHub, and X demo posts where required.

Expected outcome: each sidetrack submission can be filled without searching through code or private notes.

## TDD And Verification Plan

For implementation, use test-first work per integration:

- Write Vitest contract tests for each adapter before implementation.
- Verify tests fail for the expected missing behavior.
- Implement the minimum code to pass.
- Keep external API tests disabled by default unless corresponding env vars are present.
- Add Playwright E2E for the full invoice flow.
- Keep Anchor tests for commitment registry transitions.
- Run before any completion claim:

```powershell
corepack.cmd pnpm --filter @veilsettle/web test
corepack.cmd pnpm --filter @veilsettle/web build
corepack.cmd pnpm --filter @veilsettle/web test:e2e
```

If Anchor code changes:

```powershell
wsl bash -lc "cd /mnt/c/Users/miha2/Project/collesiumpr/programs/veilsettle && anchor test --validator legacy"
```

## Required Accounts And Secrets

Keep these in `.env.local` or deployment secrets only:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Solana/RPC Fast: `SOLANA_RPC_URL`, optional `SOLANA_WS_URL`, optional `YELLOWSTONE_GRPC_URL`.
- MagicBlock: `MAGICBLOCK_PAYMENTS_API_URL`, `MAGICBLOCK_TEE_RPC_URL`, auth/session token if required.
- Dune SIM: `DUNE_SIM_API_KEY`.
- GoldRush: `GOLDRUSH_API_KEY`.
- Torque: `TORQUE_API_TOKEN` or sponsor-confirmed key name.
- Zerion: `ZERION_API_KEY`.
- QVAC: local config path only if needed; no cloud key expected.
- Wallet private keys: avoid in the web repo. If a local demo wallet is unavoidable, keep it outside the repo or in ignored files and fund it with only tiny devnet/low-value test funds.

## Sources

- Superteam Earn Frontier page: https://superteam.fun/earn/hackathon/frontier
- 100xDevs listing: https://superteam.fun/earn/listing/100xdevs-frontier-hackathon-track
- Adevar listing: https://superteam.fun/earn/listing/50k-adevarlabs-bounty
- RPC Fast listing: https://superteam.fun/earn/listing/dollar10000-in-rpc-infrastructure-credits-for-colosseum-frontier-hackathon
- Tether QVAC listing: https://superteam.fun/earn/listing/tether-frontier-hackathon-track
- Palm USD listing: https://superteam.fun/earn/listing/palm-usd-x-superteam-uae-solana-builders-1
- Cloak listing: https://superteam.fun/earn/listing/cloak-track
- Umbra listing: https://superteam.fun/earn/listing/umbra-side-track
- MagicBlock listing: https://superteam.fun/earn/listing/privacy-track-colosseum-hackathon-powered-by-magicblock-st-my-and-sns
- Dune listing: https://superteam.fun/earn/listing/dune-analytics-x-superteam-earn-or-frontier-data-sidetrack
- GoldRush listing: https://superteam.fun/earn/listing/build-with-goldrush-track-powered-by-covalent
- Torque listing: https://superteam.fun/earn/listing/build-with-torque-mcp-1
- SNS listing: https://superteam.fun/earn/listing/sns-identity-track-colosseum-hackathon-powered-by-sns-stmy-magicblock
- Zerion global listing: https://superteam.fun/earn/listing/build-a-autonomous-onchain-agent-using-zerion-cli
- Zerion Germany listing: https://superteam.fun/earn/listing/build-an-autonomous-onchain-agent-using-the-zerion-cli
- theMiracle listing: https://superteam.fun/earn/listing/build-the-best-benefit-win-a-wallet-placement
- Colosseum Frontier page: https://colosseum.com/hackathon
- Colosseum Frontier official rules: https://colosseum.com/legal/Solana%20Frontier%20Hackathon%20Rules.pdf
- Colosseum Frontier announcement: https://blog.colosseum.com/announcing-the-solana-frontier-hackathon/
- QVAC docs: https://docs.qvac.tether.io/
- QVAC SDK page: https://qvac.tether.io/dev/sdk
- Cloak docs: https://docs.cloak.ag/sdk/introduction
- Umbra docs: https://sdk.umbraprivacy.com/
- MagicBlock Private Payments API: https://docs.magicblock.gg/pages/private-ephemeral-rollups-pers/api-reference/per/introduction
- Dune SIM docs: https://docs.sim.dune.com/
- Dune SIM pricing: https://sim.dune.com/pricing
- GoldRush docs: https://goldrush.dev/docs
- GoldRush pricing: https://goldrush.dev/pricing/
- Torque MCP quickstart: https://platform.torque.so/docs/mcp/quickstart
- SNS guide: https://sns.guide/
- SNS API users guide: https://sns.guide/sns-api/users.html
- Zerion API docs: https://developers.zerion.io/
- Zerion API pricing: https://zerion.io/api
- theMiracle simulator: https://app.themiracle.io/simulator
