# VeilSettle Frontier Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public-safe, working VeilSettle demo that credibly covers the highest-fit Frontier tracks before adding lower-priority integrations.

**Architecture:** The Next.js web app remains the main demo. Supabase stores encrypted invoice blobs and non-sensitive indexes, Solana stores public commitments/status, and sponsor integrations sit behind focused provider contracts so the product does not become a bundle of scattered API calls.

**Tech Stack:** Next.js, React, TypeScript, Tailwind, Supabase Postgres, Solana web3/wallet adapter, Anchor, Vitest, Playwright, one real privacy SDK/API, QVAC, Dune SIM, SNS.

---

## Scope

This is the current execution plan for the core hackathon push. It intentionally separates primary tracks from optional tracks.

Primary tracks to close first:

- Main Colosseum Frontier: overall product quality and submission readiness.
- 100xDevs: working Solana app, useful UX, public repo, demo.
- Adevar Labs: security posture, docs, threat model, audit readiness.
- RPC Fast: reliable RPC configuration and documented infrastructure usage.
- Tether QVAC: meaningful local invoice review using QVAC.
- Palm USD: real PUSD utility after official mint/liquidity confirmation.
- One privacy rail: MagicBlock OR Cloak OR Umbra with a demonstrable private payment path.
- Dune SIM: privacy-safe settlement analytics using real SIM endpoints.
- SNS Identity: `.sol` resolution/reverse lookup for opt-in merchant identity.

Optional tracks after the core demo is stable:

- GoldRush/Covalent: onchain receipt enrichment.
- Torque: incentive events and campaign flow.
- Additional privacy rail: only after the first privacy provider is real.
- Zerion Global: separate CLI-agent artifact with scoped real transaction.
- theMiracle: wallet-placement benefit only if a credible user incentive budget exists.

Not targeted by default:

- LPAgent/Jupiter: invoice settlement does not need liquidity routing yet.
- Encrypt/Ika: only relevant if the product expands into encrypted capital-market settlement.
- SagaPad/dum.fun: separate artifacts or unrelated activity.
- Regional tracks: only if the team can truthfully satisfy regional eligibility.

## Required Safety Rules

- Never commit `.env`, `.env.local`, wallet files, private keys, service-role keys, or sponsor API keys.
- Use `apps/web/.env.example` for empty variable names only.
- Keep Supabase service role keys server-side only.
- Keep real wallet keys outside the repo. If a local demo wallet is unavoidable, use low-value test funds and an ignored path.
- Before any public push, run secret scans and prefer a clean public release branch if old history contains private planning notes.

## What I Need From The User

- Permission before applying the Supabase migration to the live project.
- Local Supabase service role key added by the user to `apps/web/.env.local`; do not paste it into chat.
- Sponsor credentials when those phases start: Dune SIM key, optional GoldRush key, optional Torque token, optional Zerion key.
- Sponsor confirmation for official PUSD Solana mint/liquidity before hardcoding PUSD metadata.
- Decision on the first real privacy rail after quick feasibility check: MagicBlock, Cloak, or Umbra.
- Confirmation that all team members satisfy Colosseum/Superteam eligibility requirements.

## File Structure Target

- `apps/web/src/lib/veilsettle/core/*`: invoice domain logic, commitments, receipt contracts, privacy-safe public fields.
- `apps/web/src/lib/veilsettle/storage.ts`: Supabase persistence boundary.
- `apps/web/src/lib/veilsettle/integrations/privacy/*`: MagicBlock/Cloak/Umbra/mock providers behind one interface.
- `apps/web/src/lib/veilsettle/integrations/ai/*`: QVAC local invoice review adapter.
- `apps/web/src/lib/veilsettle/integrations/stablecoins/*`: PUSD/USDC/USDT metadata and validation.
- `apps/web/src/lib/veilsettle/integrations/data/*`: Dune SIM and optional GoldRush adapters.
- `apps/web/src/lib/veilsettle/integrations/identity/*`: SNS resolution/reverse lookup.
- `apps/web/src/lib/veilsettle/integrations/growth/*`: Torque events and optional campaign integration.
- `apps/web/src/app/api/*`: server routes that keep secrets off the browser.
- `apps/web/src/app/dashboard/*`: primary demo flow.
- `docs/submission/*`: judge-facing docs, demo script, security statement, track mapping.
- `tools/zerion-agent/*`: optional separate artifact only if pursuing Zerion.

## Execution Method

- Use TDD for implementation: write a failing test, verify the expected failure, implement minimal code, verify green, then refactor.
- Use subagent-driven development for independent implementation tasks.
- After each major task, request code review before continuing.
- Commit in small units when a task passes tests and review.
- Keep optional work out of the critical path until the core demo is stable.

## Core Plan

### Task 1: Public Safety And Repo Baseline

**Purpose:** Make the repository safe for GitHub before more integrations are added.

**Files:**

- Modify: `.gitignore`
- Modify: `apps/web/.env.example`
- Modify: `docs/security/publication-checklist.md`
- Modify: `README.md`

- [x] Check current git status with `git status --short --untracked-files=all`.
- [x] Verify ignored private files include `.env`, `.env.*`, wallet/key files, `.worktrees`, `agent.md`, `documentation.md`, and local Playwright artifacts.
- [x] Add empty env variable names to `apps/web/.env.example` for Supabase, RPC, Dune, GoldRush, Torque, Zerion, and selected privacy provider.
- [x] Run a secret scan:

```powershell
git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD
```

- [x] Confirm any matches are only safe placeholders or documentation.
- [x] Commit with `chore: harden public repo safety`.

### Task 2: Supabase Live Connection

**Purpose:** Make the demo persist invoices through the user's Supabase project.

**Files:**

- Modify: `supabase/migrations/0001_veilsettle.sql`
- Modify: `apps/web/src/lib/veilsettle/storage.ts`
- Modify: `apps/web/.env.example`
- Test: `apps/web/src/lib/veilsettle/storage.test.ts`

- [ ] Ask for explicit approval before applying the migration to Supabase project `fbggsyazebrtiwbcursq`.
- [ ] Write failing storage tests for create invoice, fetch invoice, store encrypted blob, and reject missing server env.
- [ ] Run `corepack.cmd pnpm --filter @veilsettle/web test -- storage`.
- [ ] Apply migration through Supabase tools after approval.
- [ ] Add local `apps/web/.env.local` values only on the user's machine, never in chat or git.
- [ ] Implement or adjust storage code until tests pass.
- [ ] Verify with a safe SQL schema check that `invoices` and `encrypted_invoice_blobs` exist and RLS is enabled.
- [ ] Commit with `feat: connect invoice storage to supabase`.

**Current blocker:** Local storage tests pass, but live Supabase migration/schema checks for project `fbggsyazebrtiwbcursq` require user approval and Supabase MCP reauthentication.

### Task 3: Working Invoice End-To-End Flow

**Purpose:** Ensure the site works as a real demo before sponsor integrations.

**Files:**

- Modify: `apps/web/src/app/dashboard/*`
- Modify: `apps/web/src/app/api/invoices/*`
- Modify: `apps/web/src/lib/veilsettle/core/*`
- Test: `apps/web/src/app/api/invoices/*.test.ts`
- Test: `apps/web/e2e/invoice-flow.spec.ts`

- [x] Write failing API tests for create invoice, fetch invoice, mark paid, and public verify.
- [x] Write failing Playwright test for create invoice -> view invoice -> settle -> verify status.
- [x] Run Vitest and Playwright and confirm failures are for missing behavior.
- [x] Implement the minimum API/UI path for the full invoice lifecycle.
- [x] Verify no private invoice amount, memo, line items, or client context appears in public verify responses.
- [x] Run:

```powershell
corepack.cmd pnpm --filter @veilsettle/web test
corepack.cmd pnpm --filter @veilsettle/web build
corepack.cmd pnpm --filter @veilsettle/web test:e2e
```

- [x] Commit with `feat: complete invoice demo flow`.

### Task 4: Integration Provider Boundaries

**Purpose:** Keep sponsor integrations structured and testable.

**Files:**

- Create: `apps/web/src/lib/veilsettle/integrations/privacy/provider.ts`
- Create: `apps/web/src/lib/veilsettle/integrations/ai/provider.ts`
- Create: `apps/web/src/lib/veilsettle/integrations/data/provider.ts`
- Create: `apps/web/src/lib/veilsettle/integrations/identity/provider.ts`
- Create: `apps/web/src/lib/veilsettle/integrations/growth/provider.ts`
- Modify: existing adapter files under `apps/web/src/lib/veilsettle`
- Test: `apps/web/src/lib/veilsettle/integrations/**/*.test.ts`

- [x] Write failing contract tests for each provider boundary.
- [x] Verify the tests fail because provider interfaces/adapters are absent or incomplete.
- [x] Move existing mock/static adapters behind explicit provider interfaces.
- [x] Ensure provider return types expose public-safe receipt fields only.
- [x] Add provider status data for the dashboard.
- [x] Run unit tests and build.
- [x] Commit with `refactor: add integration provider boundaries`.

### Task 5: First Real Privacy Rail

**Purpose:** Close one serious privacy track with a real payment path.

**Track decision order:**

- MagicBlock if Private Payments API access is available and can be shown live.
- Cloak if SDK setup is fastest for a real private invoice payment.
- Umbra if SDK/indexer/relayer flow is fastest for a real payment link and viewing-key story.

**Deferred risk note:** For the MagicBlock/privacy track, completing signing/submission is preferable, but it should be treated as a separate risky mini-task after the core demo is stable.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/privacy/*`
- Modify: `apps/web/src/app/api/privacy/*`
- Modify: `apps/web/src/app/dashboard/*`
- Test: `apps/web/src/lib/veilsettle/integrations/privacy/*.test.ts`
- Test: `apps/web/e2e/private-settlement.spec.ts`

- [x] Run a short feasibility check for MagicBlock, Cloak, and Umbra docs/examples.
- [x] Pick exactly one provider for the core build.
- [x] Write failing provider contract tests for quote/payment/proof/status behavior.
- [x] Verify the tests fail for missing real provider behavior.
- [x] Implement the selected provider behind the existing interface.
- [ ] Store only proof references, commitment IDs, and status in Supabase.
- [x] Add dashboard copy that clearly identifies the selected real provider.
- [ ] Run unit tests, build, and E2E private settlement test.
- [ ] Commit with `feat: add real private settlement provider`.

**Current blocker:** MagicBlock unsigned transaction building is wired. Wallet signing/submission and the private settlement E2E are deferred as the separate risky mini-task noted above.

### Task 6: QVAC Local Invoice Review

**Purpose:** Make Tether QVAC central to the invoice review step.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/ai/*`
- Modify: `apps/web/src/app/api/invoices/review/*`
- Modify: `apps/web/src/app/dashboard/*`
- Test: `apps/web/src/lib/veilsettle/integrations/ai/qvac.test.ts`

- [x] Write failing tests for local review result shape: risk score, duplicate signal, vendor consistency, suspicious terms, and privacy note.
- [x] Verify tests fail for missing QVAC-backed review.
- [x] Integrate QVAC SDK or local QVAC runtime behind the AI provider.
- [x] Keep a clearly labeled deterministic fallback for machines without QVAC runtime.
- [x] Ensure no private invoice content is sent to cloud APIs.
- [x] Show review results in the invoice approval flow.
- [x] Run tests and build.
- [x] Commit with `feat: add qvac local invoice review`.

### Task 7: PUSD Settlement Support

**Purpose:** Make Palm USD coverage honest and visible.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/stablecoins/*`
- Modify: `apps/web/src/lib/veilsettle/core/*`
- Modify: `apps/web/src/app/dashboard/*`
- Test: `apps/web/src/lib/veilsettle/integrations/stablecoins/pusd.test.ts`

- [ ] Confirm official PUSD Solana mint/liquidity with sponsor or official docs before implementation.
- [ ] Write failing tests for PUSD metadata, invoice denomination, SPL mint validation, and fallback currency behavior.
- [ ] Verify tests fail for missing or unconfirmed PUSD metadata.
- [ ] Add confirmed PUSD metadata and validation.
- [ ] Show PUSD-first invoice flow in the dashboard.
- [ ] Keep USDC/USDT fallback when the selected privacy provider does not support PUSD directly.
- [ ] Run tests and build.
- [ ] Commit with `feat: support pusd invoice settlement`.

**Current blocker:** Public Palm USD docs mention Solana support, but no official PUSD SPL mint/liquidity reference was found. Do not hardcode PUSD metadata until the sponsor or official docs confirm it.

### Task 8: Dune SIM Analytics

**Purpose:** Add real privacy-safe analytics for the Dune track.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/data/*`
- Create: `apps/web/src/app/api/analytics/settlements/route.ts`
- Modify: `apps/web/src/app/dashboard/*`
- Test: `apps/web/src/lib/veilsettle/integrations/data/dune.test.ts`

- [x] Write failing tests for Dune SIM request construction, redaction, and no-key behavior.
- [x] Verify tests fail for missing Dune adapter behavior.
- [x] Implement server-side Dune SIM adapter using `DUNE_SIM_API_KEY`.
- [x] Return aggregate settlement data with hashed invoice IDs only.
- [x] Add dashboard analytics panel backed by the server route.
- [x] Run tests and build.
- [x] Commit with `feat: add dune settlement analytics`.

### Task 9: SNS Identity

**Purpose:** Add real Solana-native identity without weakening privacy.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/identity/*`
- Modify: `apps/web/src/app/api/identity/*`
- Modify: `apps/web/src/app/dashboard/*`
- Test: `apps/web/src/lib/veilsettle/integrations/identity/sns.test.ts`

- [x] Write failing tests for `.sol` forward resolution, reverse lookup, invalid names, and opt-in display.
- [x] Verify tests fail for current regex-only behavior.
- [x] Implement SNS resolution behind the identity provider.
- [x] Add merchant identity display only where the user opts in.
- [x] Run tests and build.
- [x] Commit with `feat: add sns identity resolution`.

### Task 10: Submission Package

**Purpose:** Make the project easy for judges to understand and run.

**Files:**

- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/security-statement.md`
- Modify: `docs/submission/hackathon-targets.md`
- Modify: `docs/security/publication-checklist.md`

- [x] Update README with product overview, architecture, setup, env variables, demo flow, track mapping, and limitations.
- [x] Update demo script for a 3 to 5 minute recording.
- [x] Update security statement with threat model, privacy model, known MVP risks, and audit readiness.
- [x] Update hackathon target mapping to match actual completed integrations.
- [x] Run secret scan and docs placeholder scan.
- [x] Run full build/test suite.
- [x] Commit with `docs: prepare frontier submission package`.

## Optional Plan After Core Demo

### Optional Task A: GoldRush Receipt Enrichment

**Purpose:** Add Covalent/GoldRush as a real optional data integration.

- [ ] Add `GOLDRUSH_API_KEY` to `apps/web/.env.example` as an empty value.
- [ ] Write failing tests for transaction history enrichment and no-key fallback.
- [ ] Implement server-side GoldRush adapter.
- [ ] Add optional dashboard panel.
- [ ] Commit with `feat: add goldrush receipt enrichment`.

### Optional Task B: Torque Incentives

**Purpose:** Add real growth/incentive events only after settlement works.

- [ ] Confirm sponsor token name and campaign setup.
- [ ] Add `TORQUE_API_TOKEN` to `apps/web/.env.example` as an empty value.
- [ ] Write failing tests for `invoice_created`, `invoice_settled`, `early_payment`, and referral event payloads.
- [ ] Implement server-side Torque event queue.
- [ ] Add a friction log to submission docs.
- [ ] Commit with `feat: add torque settlement incentives`.

### Optional Task C: Second Privacy Rail

**Purpose:** Add another privacy sidetrack only if the first privacy path is already real.

- [ ] Choose the second provider from MagicBlock, Cloak, or Umbra.
- [ ] Reuse the existing privacy provider contract.
- [ ] Write failing contract tests for the second provider.
- [ ] Implement the second provider without changing the dashboard flow shape.
- [ ] Commit with `feat: add second privacy provider`.

### Optional Task D: Zerion CLI Agent

**Purpose:** Pursue Zerion as a separate artifact without disrupting the web demo.

- [ ] Fork or add separate `tools/zerion-agent` artifact according to Zerion track requirements.
- [ ] Add `ZERION_API_KEY` as an empty env example only.
- [ ] Implement scoped policy: chain lock, spend limit, allowed recipient, allowed token, expiry.
- [ ] Execute one low-value real transaction through the required Zerion route.
- [ ] Document private-key handling and never place keys inside the repo.
- [ ] Commit with `feat: add scoped zerion invoice agent`.

### Optional Task E: theMiracle Benefit Package

**Purpose:** Submit only if the team can offer a credible user benefit.

- [ ] Define Audience, Action, Incentive, and Value for invoice settlement users.
- [ ] Confirm whether the team can commit at least the required perceived incentive value.
- [ ] Add benefit proposal to submission docs.
- [ ] Add tracking for the benefit action without exposing private invoice details.
- [ ] Commit with `docs: add themiracle benefit proposal`.

## Completion Gates

Core work is not complete until:

- The app creates, stores, settles, and verifies an invoice through Supabase.
- One privacy provider is real and demonstrable.
- QVAC review is part of the user-facing approval flow.
- PUSD support uses confirmed official metadata.
- Dune SIM returns real privacy-safe analytics.
- SNS resolution is real or the track is removed from primary targeting.
- README and submission docs match implemented behavior.
- Secret scan passes.
- `corepack.cmd pnpm --filter @veilsettle/web test` passes.
- `corepack.cmd pnpm --filter @veilsettle/web build` passes.
- Playwright E2E passes for the main demo path.
- Code review is requested before merge/public push.
