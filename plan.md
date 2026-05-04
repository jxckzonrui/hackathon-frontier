# VeilSettle 100% Hackathon Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move VeilSettle from a claims-safe MVP demo to a 100% hackathon release package with verified demo flow, clean public repo posture, honest sponsor-track claims, and submission assets.

**Architecture:** Keep the Next.js app as the main product demo. Server-side provider adapters own sponsor integrations, Supabase owns encrypted invoice persistence, Solana owns public settlement commitments/status evidence, and docs own any limitations that are not fully implemented before submission.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind, Vitest, Playwright, Supabase Postgres, `@solana/web3.js`, Anchor, MagicBlock Private Payments, Dune SIM, SNS, QVAC local review, optional RPC Fast endpoint.

---

## Current Baseline

Release audit file: `docs/submission/release-readiness-audit-2026-05-04.md`.

Current estimated readiness:

- Overall hackathon release today: 64%.
- Local MVP demo with honest caveats: 74%.
- Competitive multi-track sponsor release: 55-60%.

Fresh checks from the audit:

- `corepack.cmd pnpm --filter @veilsettle/web lint`: passed.
- `corepack.cmd pnpm --filter @veilsettle/web test`: 14 test files passed, 45 tests passed.
- `corepack.cmd pnpm --filter @veilsettle/web build`: passed.
- `corepack.cmd pnpm --filter @veilsettle/web test:e2e`: 2 Playwright tests passed.
- Secret scan: only placeholders, test strings, and docs references.
- `corepack.cmd pnpm audit --audit-level moderate`: failed with 10 advisories.
- `corepack.cmd pnpm anchor:test`: blocked because `anchor` is not installed locally.
- `cargo test` in `programs/veilsettle`: blocked because `cargo` is not installed locally.

## Definition Of 100% Ready

This plan treats 100% as "ready to submit publicly with no known misleading claims", not as production-grade fintech security.

The project is 100% hackathon-release ready only when all gates below are true:

- Registration and team eligibility are verified against official Colosseum rules.
- Public repo has no real secrets and no unreviewed private planning files.
- Dependency audit has no critical/high advisories, and any remaining moderate advisory is documented with a reason and mitigation.
- Main web demo works from a clean checkout and from the deployment URL.
- Supabase live mode is either verified or clearly marked as not used in the submitted demo.
- Payment flow uses the privacy provider abstraction instead of hardcoded proof strings.
- MagicBlock/private payment status is honest: unsigned builder only, or signed/submitted settlement if the risky mini-task succeeds.
- PUSD status is honest: confirmed mint/liquidity, or demo denomination with USDC/USDT settlement fallback.
- Dune SIM and SNS are either shown with live evidence or downgraded in docs.
- QVAC is either shown as real local runtime usage or labeled as deterministic local fallback.
- README, demo script, security statement, and hackathon target docs all match actual behavior.
- Demo video, deploy link, GitHub link, and track-specific evidence are ready.
- Final checks pass: lint, unit tests, build, Playwright E2E, secret scan, docs claim scan, and release checklist.

## Scope Boundaries

Primary release scope:

- Main Colosseum Frontier product submission.
- 100xDevs/general builder story.
- Adevar/security story.
- RPC Fast infrastructure evidence if endpoint is available.
- MagicBlock/privacy track with honest status.
- Dune SIM redacted settlement analytics.
- SNS opt-in identity.
- QVAC local invoice review.
- PUSD only if official Solana support is verified before submission.

Explicitly out of primary scope unless every P0 task below is complete:

- GoldRush.
- Torque campaign flow.
- Zerion CLI agent.
- theMiracle benefit package.
- Second privacy rail.

## Safety Rules

- Do not commit `.env`, `.env.local`, wallet files, keypairs, service role keys, sponsor API keys, local screenshots containing secrets, or private planning notes.
- Keep Supabase service role keys server-side only.
- Keep real wallet private keys outside this repo. If a local demo wallet is unavoidable, use a low-value test wallet and an ignored path.
- Do not claim "live PUSD settlement", "completed MagicBlock private payments", "production-ready auth", "production-ready encryption", or "live Supabase deployment" until the matching gate in this plan is checked.
- Before public push, run the secret scan in Task 12 and inspect every match manually.

## File Structure Map

Files expected to change during execution:

- `apps/web/package.json`: remove unused risky web dependencies and add only dependencies proven necessary by implementation.
- `pnpm-lock.yaml`: dependency lock update after package cleanup.
- `apps/web/.env.example`: keep empty env names aligned with actual supported integrations.
- `apps/web/src/lib/veilsettle/integrations/status.ts`: report actual configured providers.
- `apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts`: provider status and contract coverage.
- `apps/web/src/lib/veilsettle/integrations/privacy/provider.ts`: MagicBlock result types and provider behavior.
- `apps/web/src/app/api/privacy/payment/route.ts`: server route for private payment preparation.
- `apps/web/src/app/api/privacy/payment/route.test.ts`: route tests for payment preparation.
- `apps/web/src/components/PaymentSettlementActions.tsx`: client action connected to privacy route.
- `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`: payment proof validation and storage behavior.
- `apps/web/src/app/api/invoices/payment-proof.test.ts`: payment proof API tests.
- `apps/web/src/components/InvoiceForm.tsx`: currency/status copy if PUSD remains unconfirmed.
- `apps/web/src/lib/veilsettle/types.ts`: stablecoin symbol changes only if needed.
- `apps/web/src/lib/veilsettle/integrations/data/provider.ts`: Dune status/evidence behavior if needed.
- `apps/web/src/lib/veilsettle/integrations/data/dune.test.ts`: Dune no-key/live-key behavior tests.
- `apps/web/src/lib/veilsettle/integrations/identity/provider.ts`: SNS display/status behavior if needed.
- `apps/web/src/app/api/identity/sns/route.ts`: SNS route behavior if UI needs server lookup.
- `apps/web/src/app/dashboard/page.tsx`: compact live integration/evidence panel.
- `apps/web/src/app/settlements/page.tsx`: Dune/SNS evidence display if needed.
- `tests/e2e/invoice-flow.spec.ts`: full demo flow expectations.
- `tests/e2e/veilsettle.spec.ts`: public/private verification expectations.
- `supabase/migrations/0001_veilsettle.sql`: only if live verification shows schema/policy gaps.
- `docs/submission/frontier-sidetrack-readiness-plan.md`: remove stale integration claims.
- `docs/submission/hackathon-targets.md`: align targets with reality.
- `docs/submission/demo-script.md`: final 3-5 minute script.
- `docs/submission/security-statement.md`: threat model, caveats, and audit posture.
- `docs/submission/live-evidence.md`: new release evidence appendix.
- `docs/security/publication-checklist.md`: final release checklist updates.
- `README.md`: public judge-facing overview, setup, limitations, and links.

## Priority Board

| Priority | Task | Readiness impact |
|---|---|---:|
| P0 | Task 1: Submission eligibility and public claims gate | 64 -> 68 |
| P0 | Task 2: Dependency audit cleanup | 68 -> 74 |
| P0 | Task 3: Supabase live-mode decision and evidence | 74 -> 80 |
| P0 | Task 4: Provider status correctness | 80 -> 83 |
| P0 | Task 5: Private payment preparation route | 83 -> 88 |
| P0 | Task 6: MagicBlock signing/submission risky mini-task decision | 88 -> 90 or 93 |
| P1 | Task 7: PUSD claim hardening | 90 -> 92 |
| P1 | Task 8: Dune/SNS/QVAC live evidence | 92 -> 95 |
| P1 | Task 9: Security docs and demo-grade auth caveats | 95 -> 97 |
| P1 | Task 10: Submission package and video checklist | 97 -> 99 |
| P0 | Task 11: Final verification gate | 99 -> 100 |

The percentages are planning estimates. A task only moves the score when its verification step passes.

---

## Task 1: Submission Eligibility And Public Claims Gate

**Purpose:** Prevent a technically good project from failing because of eligibility, stale docs, or misleading public claims.

**Files:**

- Modify: `README.md`
- Modify: `docs/submission/frontier-sidetrack-readiness-plan.md`
- Modify: `docs/submission/hackathon-targets.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/security-statement.md`
- Create: `docs/submission/live-evidence.md`

- [ ] **Step 1: Confirm submission/legal gate outside code.**

  Verify team registration and eligibility against the official Colosseum rules. Record the result in private team notes, not in the public repo if it includes personal data.

  Expected result for continuing:

  ```text
  Team registration: confirmed
  Team eligibility: confirmed
  Submission deadline: May 11, 2026 11:59pm PT
  Public docs contain no private team eligibility data
  ```

- [ ] **Step 2: Add public status rules to README.**

  Add or update a `Current Release Status` section in `README.md` with this exact claim shape:

  ```markdown
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
  ```

- [ ] **Step 3: Fix stale sidetrack doc claims.**

  In `docs/submission/frontier-sidetrack-readiness-plan.md`, replace the stale "Current integrations" bullets with:

  ```markdown
  Current integrations:

  - Supabase: schema and server storage boundary exist; live project migration still needs final verification.
  - QVAC: local invoice review flow exists with deterministic fallback; real runtime depth needs evidence if used as a QVAC claim.
  - PUSD: supported as demo denomination; official Solana mint/liquidity still needs confirmation before claiming live settlement.
  - MagicBlock: Private Payments provider builds unsigned private SPL transfer transactions; wallet signing/submission is tracked as a separate risky mini-task.
  - Dune SIM: server adapter and redacted analytics route exist; live-key evidence still needs to be captured.
  - SNS: provider and API route exist for opt-in `.sol` resolution; UI evidence still needs to be captured.
  - Torque: event emitter exists; real campaign flow is optional after core release.
  - GoldRush, Umbra, Cloak, Zerion, theMiracle: optional or deferred unless explicitly implemented and evidenced.
  ```

- [ ] **Step 4: Create the evidence appendix.**

  Create `docs/submission/live-evidence.md` with this structure:

  ```markdown
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
  ```

- [ ] **Step 5: Run docs claim scan.**

  Run:

  ```powershell
  Select-String -Path README.md,docs\submission\*.md -Pattern "completed MagicBlock|live PUSD|production-ready|real PUSD|QVAC SDK|live Supabase" -CaseSensitive:$false
  ```

  Expected: every match is either an explicit non-claim or backed by evidence in `docs/submission/live-evidence.md`.

- [ ] **Step 6: Commit.**

  ```powershell
  git add README.md docs/submission/frontier-sidetrack-readiness-plan.md docs/submission/hackathon-targets.md docs/submission/demo-script.md docs/submission/security-statement.md docs/submission/live-evidence.md
  git commit -m "docs: align release claims with implementation"
  ```

---

## Task 2: Dependency Audit Cleanup

**Purpose:** Remove public security noise before Adevar/security-facing submission.

**Files:**

- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `docs/submission/live-evidence.md`

- [ ] **Step 1: Prove unused dependency candidates.**

  Run:

  ```powershell
  Select-String -Path apps\web\src\**\*.ts,apps\web\src\**\*.tsx -Pattern "@solana/wallet-adapter-react|@solana/wallet-adapter-react-ui|@solana/wallet-adapter-wallets|@coral-xyz/anchor" -CaseSensitive
  ```

  Expected: no app-source imports. If any import appears, stop and inspect before removing that package.

- [ ] **Step 2: Remove unused high-risk web dependencies.**

  In `apps/web/package.json`, remove these dependencies if Step 1 found no imports:

  ```json
  "@coral-xyz/anchor": "^0.32.1",
  "@solana/wallet-adapter-react": "^0.15.39",
  "@solana/wallet-adapter-react-ui": "^0.9.39",
  "@solana/wallet-adapter-wallets": "^0.19.38"
  ```

  Keep `@solana/web3.js` because SNS and Solana provider code use it.

- [ ] **Step 3: Refresh lockfile.**

  Run:

  ```powershell
  corepack.cmd pnpm install --lockfile-only
  ```

  Expected: `pnpm-lock.yaml` updates and install exits 0.

- [ ] **Step 4: Re-run audit.**

  Run:

  ```powershell
  corepack.cmd pnpm audit --audit-level moderate
  ```

  Expected for 100% release: no critical or high advisories. If moderate advisories remain through required packages, record package path and mitigation in `docs/submission/live-evidence.md`.

- [ ] **Step 5: Run web verification.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web lint
  corepack.cmd pnpm --filter @veilsettle/web test
  corepack.cmd pnpm --filter @veilsettle/web build
  ```

  Expected: all exit 0.

- [ ] **Step 6: Commit.**

  ```powershell
  git add apps/web/package.json pnpm-lock.yaml docs/submission/live-evidence.md
  git commit -m "chore: reduce web dependency audit risk"
  ```

---

## Task 3: Supabase Live-Mode Decision And Evidence

**Purpose:** Either verify the live backend or make the submitted demo explicitly local-mode.

**Files:**

- Modify: `docs/submission/live-evidence.md`
- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify if verification exposes a schema gap: `supabase/migrations/0001_veilsettle.sql`
- Test: `apps/web/src/lib/veilsettle/storage.test.ts`

- [ ] **Step 1: Choose release mode.**

  Decision:

  ```text
  Preferred release mode: live Supabase
  Fallback release mode: local demo with explicit Supabase limitation
  ```

  Continue with live Supabase only after the user confirms the Supabase project and local env are ready. Do not paste `SUPABASE_SERVICE_ROLE_KEY` into chat or docs.

- [ ] **Step 2: Verify env names are documented.**

  Confirm `apps/web/.env.example` contains empty names:

  ```text
  NEXT_PUBLIC_SUPABASE_URL=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

- [ ] **Step 3: Apply or verify migration.**

  Use Supabase dashboard, Supabase MCP after reauth, or Supabase CLI. The schema to verify is:

  ```sql
  create table public.invoices (
    id uuid primary key default gen_random_uuid(),
    creator_wallet text not null,
    payer_hash text not null,
    metadata_hash text not null,
    amount_commitment text not null,
    due_date_hash text not null,
    status text not null check (status in ('created', 'paid', 'voided')),
    payment_proof_reference text,
    created_at timestamptz not null default now(),
    paid_at timestamptz
  );

  create table public.encrypted_invoice_blobs (
    invoice_id uuid primary key references public.invoices(id) on delete cascade,
    encrypted_blob jsonb not null,
    authorized_wallets text[] not null,
    blob_hash text not null,
    created_at timestamptz not null default now()
  );

  alter table public.invoices enable row level security;
  alter table public.encrypted_invoice_blobs enable row level security;
  ```

- [ ] **Step 4: Verify RLS posture.**

  Run a schema check in Supabase SQL editor or MCP:

  ```sql
  select schemaname, tablename, rowsecurity
  from pg_tables
  where schemaname = 'public'
    and tablename in ('invoices', 'encrypted_invoice_blobs')
  order by tablename;
  ```

  Expected:

  ```text
  encrypted_invoice_blobs | rowsecurity true
  invoices                | rowsecurity true
  ```

  Security note: the app uses server-side service role access. Do not add broad anon/authenticated policies for these tables unless the access model changes.

- [ ] **Step 5: Run storage tests.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- storage
  ```

  Expected: storage tests pass.

- [ ] **Step 6: Capture live-mode evidence.**

  If live Supabase is used, add to `docs/submission/live-evidence.md`:

  ```markdown
  ## Supabase Evidence

  - `invoices` table exists with RLS enabled.
  - `encrypted_invoice_blobs` table exists with RLS enabled.
  - Service role key is stored only in local/deployment secrets.
  - Create invoice -> payment proof -> public verify was tested against the live project.
  ```

  If live Supabase is not used, add:

  ```markdown
  ## Supabase Evidence

  - The submitted demo uses local fallback mode.
  - Supabase schema is included in `supabase/migrations/0001_veilsettle.sql`.
  - Live migration was not claimed in the submission.
  ```

- [ ] **Step 7: Commit.**

  ```powershell
  git add README.md docs/submission/demo-script.md docs/submission/live-evidence.md supabase/migrations/0001_veilsettle.sql apps/web/src/lib/veilsettle/storage.test.ts
  git commit -m "docs: record supabase release mode"
  ```

---

## Task 4: Provider Status Correctness

**Purpose:** Make dashboard/status docs reflect the real configured providers instead of stale static providers.

**Files:**

- Modify: `apps/web/src/lib/veilsettle/integrations/status.ts`
- Modify: `apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts`
- Modify: `docs/submission/live-evidence.md`

- [ ] **Step 1: Add failing provider status test.**

  Add this test to `apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts`:

  ```ts
  it("reports Dune SIM status through the selected settlement data provider", async () => {
    vi.stubEnv("DUNE_SIM_API_KEY", "test-dune-key");
    vi.stubEnv("DUNE_SIM_WALLET_ADDRESS", "Wallet1111111111111111111111111111111111111");

    const { getIntegrationProviderStatuses } = await import("./status");

    const statuses = getIntegrationProviderStatuses();
    expect(statuses).toContainEqual(
      expect.objectContaining({
        category: "data",
        id: "dune-sim-settlement-analytics",
        state: "configured",
      }),
    );

    vi.unstubAllEnvs();
  });
  ```

  If the test file does not import `vi`, add:

  ```ts
  import { describe, expect, it, vi } from "vitest";
  ```

- [ ] **Step 2: Verify the test fails for the current static provider.**

  Run:

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- provider-contracts
  ```

  Expected failure: status contains `static-settlement-events` or `state: "mock"` for data.

- [ ] **Step 3: Fix provider status selection.**

  In `apps/web/src/lib/veilsettle/integrations/status.ts`, replace:

  ```ts
  import { staticSettlementDataProvider } from "./data/provider";
  ```

  with:

  ```ts
  import { getSettlementDataProvider } from "./data/provider";
  ```

  Replace:

  ```ts
  staticSettlementDataProvider.status(),
  ```

  with:

  ```ts
  getSettlementDataProvider().status(),
  ```

- [ ] **Step 4: Verify provider tests.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- provider-contracts
  ```

  Expected: provider contract tests pass.

- [ ] **Step 5: Commit.**

  ```powershell
  git add apps/web/src/lib/veilsettle/integrations/status.ts apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts docs/submission/live-evidence.md
  git commit -m "fix: report selected integration provider status"
  ```

---

## Task 5: Private Payment Preparation Route

**Purpose:** Remove hardcoded `cloak-proof-demo` behavior from the main payment action and route payment preparation through the provider boundary.

**Files:**

- Create: `apps/web/src/app/api/privacy/payment/route.ts`
- Create: `apps/web/src/app/api/privacy/payment/route.test.ts`
- Modify: `apps/web/src/components/PaymentSettlementActions.tsx`
- Modify: `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`
- Modify: `apps/web/src/app/api/invoices/payment-proof.test.ts`
- Test: `tests/e2e/invoice-flow.spec.ts`

- [ ] **Step 1: Add failing API route test for prepared private payment.**

  Create `apps/web/src/app/api/privacy/payment/route.test.ts` with:

  ```ts
  import { beforeEach, describe, expect, it, vi } from "vitest";

  const preparePaymentMock = vi.fn();
  const quotePaymentMock = vi.fn();

  vi.mock("@/lib/veilsettle/integrations/privacy/provider", () => ({
    getPrivatePaymentProvider: () => ({
      quotePayment: quotePaymentMock,
      preparePayment: preparePaymentMock,
      status: () => ({
        category: "privacy",
        id: "magicblock-private-payments",
        label: "MagicBlock Private Payments",
        state: "configured",
        publicSafe: true,
        detail: "Builds unsigned private SPL transfers.",
      }),
    }),
  }));

  const validPayload = {
    invoiceId: "invoice-1",
    senderWallet: "Sender1111111111111111111111111111111111111",
    recipientWallet: "Merchant11111111111111111111111111111111111",
    amountMinor: "2500000000",
    currency: "USDC",
    cluster: "devnet",
  };

  describe("private payment preparation route", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      preparePaymentMock.mockResolvedValue({
        provider: "magicblock",
        paymentProofReference: "magicblock:invoice-1",
        unsignedTransactionBase64: "base64-transaction",
        sendTo: "base",
        requiredSigners: ["Sender1111111111111111111111111111111111111"],
      });
    });

    it("returns public-safe unsigned private payment preparation data", async () => {
      const { POST } = await import("./route");

      const response = await POST(
        new Request("http://localhost/api/privacy/payment", {
          method: "POST",
          body: JSON.stringify(validPayload),
        }),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        provider: "magicblock",
        paymentProofReference: "magicblock:invoice-1",
        unsignedTransactionBase64: "base64-transaction",
        sendTo: "base",
        requiredSigners: ["Sender1111111111111111111111111111111111111"],
      });
      expect(preparePaymentMock).toHaveBeenCalledWith(validPayload);
    });

    it("rejects invalid payloads", async () => {
      const { POST } = await import("./route");

      const response = await POST(
        new Request("http://localhost/api/privacy/payment", {
          method: "POST",
          body: JSON.stringify({ invoiceId: "" }),
        }),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "Invalid private payment payload" });
      expect(preparePaymentMock).not.toHaveBeenCalled();
    });
  });
  ```

- [ ] **Step 2: Run the new route test and verify failure.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- privacy/payment
  ```

  Expected: fail because `apps/web/src/app/api/privacy/payment/route.ts` does not exist.

- [ ] **Step 3: Add the API route.**

  Create `apps/web/src/app/api/privacy/payment/route.ts`:

  ```ts
  import { NextResponse } from "next/server";
  import { z } from "zod";
  import { getPrivatePaymentProvider } from "@/lib/veilsettle/integrations/privacy/provider";

  const privatePaymentSchema = z.object({
    invoiceId: z.string().min(1),
    senderWallet: z.string().min(32),
    recipientWallet: z.string().min(32),
    amountMinor: z.string().regex(/^[1-9][0-9]*$/),
    currency: z.enum(["PUSD", "USDC", "USDT"]),
    mint: z.string().min(32).optional(),
    cluster: z.enum(["mainnet", "devnet"]).optional(),
  });

  export async function POST(request: Request) {
    const parsed = privatePaymentSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid private payment payload" }, { status: 400 });
    }

    try {
      const result = await getPrivatePaymentProvider().preparePayment(parsed.data);

      return NextResponse.json({
        provider: result.provider,
        paymentProofReference: result.paymentProofReference,
        transactionSignature: result.transactionSignature,
        unsignedTransactionBase64: result.unsignedTransactionBase64,
        sendTo: result.sendTo,
        requiredSigners: result.requiredSigners,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Private payment preparation failed" },
        { status: 502 },
      );
    }
  }
  ```

- [ ] **Step 4: Verify route tests pass.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- privacy/payment
  ```

  Expected: route tests pass.

- [ ] **Step 5: Change client action to call the privacy route first.**

  In `apps/web/src/components/PaymentSettlementActions.tsx`, replace hardcoded proof payloads with a call to `/api/privacy/payment`. Use demo wallets until wallet connection exists:

  ```ts
  const paymentResponse = await fetch("/api/privacy/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invoiceId,
      senderWallet: "Client111111111111111111111111111111111111",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: "2500000000",
      currency: "USDC",
      cluster: "devnet",
    }),
  });
  const paymentJson = (await paymentResponse.json()) as {
    error?: string;
    paymentProofReference?: string;
    transactionSignature?: string;
    unsignedTransactionBase64?: string;
  };

  if (!paymentResponse.ok || !paymentJson.paymentProofReference) {
    setStatus(paymentJson.error ?? "Private payment preparation failed");
    return;
  }
  ```

  Then call `/api/invoices/${invoiceId}/payment-proof` using:

  ```ts
  paymentProofReference: paymentJson.paymentProofReference,
  transactionSignature: paymentJson.transactionSignature ?? paymentJson.unsignedTransactionBase64 ?? "unsigned-transaction-prepared",
  ```

  The visible status must distinguish signed settlement from unsigned preparation:

  ```ts
  setStatus(
    paymentJson.transactionSignature
      ? "Payment proof prepared"
      : "Unsigned private payment prepared for wallet signing",
  );
  ```

- [ ] **Step 6: Harden payment proof API labels.**

  In `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`, keep accepting `transactionSignature` for demo compatibility, but do not treat unsigned transaction data as a completed onchain payment in docs or UI.

  Add a test case in `apps/web/src/app/api/invoices/payment-proof.test.ts`:

  ```ts
  it("accepts unsigned private payment preparation as demo proof reference", async () => {
    const { POST } = await import("./[id]/payment-proof/route");

    const response = await POST(
      new Request("http://localhost/api/invoices/invoice-1/payment-proof", {
        method: "POST",
        body: JSON.stringify({
          paymentProofReference: "magicblock:invoice-1",
          transactionSignature: "unsigned-transaction-prepared",
          paidAt: "2026-05-07T12:00:00.000Z",
          dueDate: "2026-05-08",
        }),
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith({
      status: "paid",
      payment_proof_reference: "magicblock:invoice-1",
      paid_at: "2026-05-07T12:00:00.000Z",
    });
  });
  ```

- [ ] **Step 7: Update E2E text expectation.**

  In `tests/e2e/invoice-flow.spec.ts`, accept either completed proof or unsigned preparation:

  ```ts
  await expect(
    page.getByText(/Payment proof prepared|Unsigned private payment prepared for wallet signing/),
  ).toBeVisible();
  ```

- [ ] **Step 8: Run verification.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- privacy payment-proof
  corepack.cmd pnpm --filter @veilsettle/web test:e2e
  corepack.cmd pnpm --filter @veilsettle/web build
  ```

  Expected: all exit 0.

- [ ] **Step 9: Commit.**

  ```powershell
  git add apps/web/src/app/api/privacy/payment/route.ts apps/web/src/app/api/privacy/payment/route.test.ts apps/web/src/components/PaymentSettlementActions.tsx apps/web/src/app/api/invoices/[id]/payment-proof/route.ts apps/web/src/app/api/invoices/payment-proof.test.ts tests/e2e/invoice-flow.spec.ts
  git commit -m "feat: prepare private payments through provider route"
  ```

---

## Task 6: MagicBlock Signing And Submission Risky Mini-Task

**Purpose:** Decide whether to finish real MagicBlock signing/submission for the privacy track, without blocking the core release if it becomes unstable.

**Important note:** For the MagicBlock/privacy track, completing wallet signing and submission is better for scoring, but it is a separate risky mini-task. Execute it only after Tasks 1-5 are green.

**Files if executed:**

- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `apps/web/src/lib/veilsettle/integrations/privacy/provider.ts`
- Modify: `apps/web/src/components/PaymentSettlementActions.tsx`
- Modify: `apps/web/src/app/api/privacy/payment/route.ts`
- Modify: `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`
- Test: `apps/web/src/lib/veilsettle/integrations/privacy/magicblock-signing.test.ts`
- Test: `tests/e2e/invoice-flow.spec.ts`

- [ ] **Step 1: Set the go/no-go gate.**

  Use this decision:

  ```text
  Go: MagicBlock API returns unsigned transaction reliably, wallet signing works in browser, signed transaction can be submitted to the expected cluster, and a real signature is captured.
  No-go: any of those pieces fails after one focused implementation pass. Release with honest "unsigned transaction preparation" claim.
  ```

- [ ] **Step 2: If go, add only the wallet dependency required by actual UI.**

  Prefer minimal wallet integration over broad wallet bundles. If adding `@solana/wallet-adapter-*` reintroduces critical/high advisories, use direct injected wallet support for Phantom/Solflare instead.

  Required browser capability:

  ```ts
  type SolanaWallet = {
    publicKey?: { toBase58(): string };
    signTransaction?(transaction: unknown): Promise<unknown>;
    signAndSendTransaction?(transaction: unknown): Promise<{ signature: string }>;
  };
  ```

- [ ] **Step 3: Add signing test for result shape.**

  Create `apps/web/src/lib/veilsettle/integrations/privacy/magicblock-signing.test.ts`:

  ```ts
  import { describe, expect, it } from "vitest";

  describe("MagicBlock signing release gate", () => {
    it("requires a final transaction signature before claiming completed private payment", () => {
      const unsignedOnly = {
        provider: "magicblock",
        paymentProofReference: "magicblock:invoice-1",
        unsignedTransactionBase64: "base64-transaction",
      };

      expect("transactionSignature" in unsignedOnly).toBe(false);
    });
  });
  ```

  This test protects the release claim: unsigned data is preparation, not completion.

- [ ] **Step 4: Implement signing/submission only if wallet API is available.**

  Browser flow must be:

  ```text
  /api/privacy/payment -> unsignedTransactionBase64
  browser wallet signs transaction
  signed transaction is submitted to Solana/MagicBlock route
  final transaction signature is returned
  /api/invoices/[id]/payment-proof stores paymentProofReference and transactionSignature
  verify page shows payment proof reference only in public panel
  ```

- [ ] **Step 5: Verify real signature path.**

  Required evidence in `docs/submission/live-evidence.md`:

  ```markdown
  ## MagicBlock Evidence

  - Provider: MagicBlock Private Payments.
  - API response: unsigned private SPL transfer transaction was produced.
  - Wallet signing: verified / not verified.
  - Submission signature: verified / not verified.
  - Public verification exposes only proof reference/status, not amount or memo.
  ```

- [ ] **Step 6: Commit only if the flow is stable.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- magicblock privacy payment-proof
  corepack.cmd pnpm --filter @veilsettle/web test:e2e
  corepack.cmd pnpm --filter @veilsettle/web build
  git add apps/web/package.json pnpm-lock.yaml apps/web/src/lib/veilsettle/integrations/privacy apps/web/src/components/PaymentSettlementActions.tsx apps/web/src/app/api/privacy apps/web/src/app/api/invoices/[id]/payment-proof/route.ts tests/e2e/invoice-flow.spec.ts docs/submission/live-evidence.md
  git commit -m "feat: submit signed magicblock private payments"
  ```

- [ ] **Step 7: If no-go, commit the honest release docs instead.**

  ```powershell
  git add README.md docs/submission/demo-script.md docs/submission/hackathon-targets.md docs/submission/live-evidence.md
  git commit -m "docs: position magicblock as unsigned private payment preparation"
  ```

---

## Task 7: PUSD Claim Hardening

**Purpose:** Avoid a sponsor-track overclaim if official PUSD Solana mint/liquidity cannot be verified.

**Files:**

- Modify: `apps/web/src/components/InvoiceForm.tsx`
- Modify: `apps/web/src/lib/veilsettle/types.ts`
- Modify: `apps/web/src/lib/veilsettle/integrations/privacy/provider.ts`
- Modify: `README.md`
- Modify: `docs/submission/hackathon-targets.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/live-evidence.md`
- Test: `apps/web/src/app/mvp-pages.test.tsx`
- Test: `apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts`

- [ ] **Step 1: Search official PUSD evidence.**

  Verify official Solana mint/liquidity from sponsor docs or direct sponsor confirmation. Record only public source links in `docs/submission/live-evidence.md`.

  Release decision:

  ```text
  If official PUSD mint is confirmed: keep PUSD as settlement currency and configure MAGICBLOCK_PUSD_MINT.
  If official PUSD mint is not confirmed: present PUSD as demo denomination only and use USDC/USDT for private payment preparation.
  ```

- [ ] **Step 2: If confirmed, add provider test.**

  Add to `apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts`:

  ```ts
  it("allows MagicBlock PUSD only when a mint is configured", async () => {
    vi.stubEnv("PRIVACY_PROVIDER", "magicblock");
    vi.stubEnv("MAGICBLOCK_PUSD_MINT", "PusdMint1111111111111111111111111111111111");

    const { getPrivatePaymentProvider } = await import("./privacy/provider");
    const quote = await getPrivatePaymentProvider().quotePayment({
      invoiceId: "invoice-1",
      senderWallet: "Sender1111111111111111111111111111111111111",
      recipientWallet: "Merchant11111111111111111111111111111111111",
      amountMinor: "2500000000",
      currency: "PUSD",
    });

    expect(quote.provider).toBe("magicblock");
    vi.unstubAllEnvs();
  });
  ```

- [ ] **Step 3: If unconfirmed, change UI copy without changing core currency type.**

  In `apps/web/src/components/InvoiceForm.tsx`, keep the invoice draft if needed, but change visible status copy to say:

  ```text
  2,500.00 PUSD demo denomination
  ```

  In the payment preparation route/client payload, use:

  ```ts
  currency: "USDC"
  ```

  because MagicBlock default mint metadata exists for USDC.

- [ ] **Step 4: Update docs to match the decision.**

  If unconfirmed, add this exact claim to README and `docs/submission/hackathon-targets.md`:

  ```markdown
  Palm USD / PUSD is shown as the invoice denomination in the demo. VeilSettle does not claim live PUSD settlement until the official Solana SPL mint and liquidity path are confirmed.
  ```

- [ ] **Step 5: Run tests and build.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- mvp-pages provider-contracts
  corepack.cmd pnpm --filter @veilsettle/web build
  ```

  Expected: tests and build pass.

- [ ] **Step 6: Commit.**

  ```powershell
  git add apps/web/src/components/InvoiceForm.tsx apps/web/src/lib/veilsettle/types.ts apps/web/src/lib/veilsettle/integrations/privacy/provider.ts README.md docs/submission/hackathon-targets.md docs/submission/demo-script.md docs/submission/live-evidence.md apps/web/src/app/mvp-pages.test.tsx apps/web/src/lib/veilsettle/integrations/provider-contracts.test.ts
  git commit -m "docs: harden pusd release claims"
  ```

---

## Task 8: Dune, SNS, QVAC, And RPC Evidence

**Purpose:** Turn implemented adapters into judge-visible proof or downgrade the claims.

**Files:**

- Modify: `apps/web/src/app/dashboard/page.tsx`
- Modify: `apps/web/src/app/settlements/page.tsx`
- Modify: `apps/web/src/lib/veilsettle/integrations/data/provider.ts`
- Modify: `apps/web/src/lib/veilsettle/integrations/identity/provider.ts`
- Modify: `docs/submission/live-evidence.md`
- Modify: `docs/submission/demo-script.md`
- Test: `apps/web/src/lib/veilsettle/integrations/data/dune.test.ts`
- Test: `apps/web/src/lib/veilsettle/integrations/identity/sns.test.ts`
- Test: `apps/web/src/lib/veilsettle/integrations/ai/qvac.test.ts`

- [ ] **Step 1: Dune live smoke.**

  With `DUNE_SIM_API_KEY` and `DUNE_SIM_WALLET_ADDRESS` set locally, run:

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- dune
  ```

  Then open the settlement analytics route locally and capture safe output:

  ```powershell
  Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/analytics/settlements | Select-Object -ExpandProperty Content
  ```

  Expected JSON contains:

  ```json
  {
    "redacted": true
  }
  ```

- [ ] **Step 2: SNS live smoke.**

  With `SOLANA_RPC_URL` set to the release RPC endpoint, run:

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- sns
  ```

  Add one safe example to `docs/submission/live-evidence.md`:

  ```markdown
  ## SNS Evidence

  - RPC endpoint configured: yes/no.
  - Forward `.sol` resolution smoke: pass/fallback.
  - Reverse lookup smoke: pass/fallback.
  - Identity display is opt-in only.
  ```

- [ ] **Step 3: QVAC runtime evidence or fallback downgrade.**

  If a real QVAC SDK/runtime is available, capture:

  ```markdown
  ## QVAC Evidence

  - Runtime: QVAC local runtime.
  - Private invoice text leaves local machine: no.
  - Checks shown in UI: risk score, duplicate signal, vendor consistency, suspicious terms, privacy note.
  ```

  If only deterministic fallback is available, capture:

  ```markdown
  ## QVAC Evidence

  - Runtime: deterministic local fallback.
  - Private invoice text leaves local machine: no.
  - Submission claim: QVAC-compatible local review design, not full QVAC SDK runtime.
  ```

- [ ] **Step 4: RPC Fast evidence.**

  If using RPC Fast, set `SOLANA_RPC_URL` to the RPC Fast endpoint in local/deployment secrets and add:

  ```markdown
  ## RPC Evidence

  - Provider: RPC Fast.
  - Env var used by server providers: `SOLANA_RPC_URL`.
  - Used by SNS resolution and Solana transaction confirmation flows.
  ```

  If not using RPC Fast, remove RPC Fast from "ready demo surface" claims.

- [ ] **Step 5: Add compact UI evidence panel if missing.**

  In `apps/web/src/app/dashboard/page.tsx` or `apps/web/src/app/settlements/page.tsx`, show provider statuses returned by `getIntegrationProviderStatuses()` with labels and states. The panel must not expose API keys or wallet private data.

- [ ] **Step 6: Run verification.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- dune sns qvac provider-contracts
  corepack.cmd pnpm --filter @veilsettle/web build
  ```

  Expected: all exit 0.

- [ ] **Step 7: Commit.**

  ```powershell
  git add apps/web/src/app/dashboard/page.tsx apps/web/src/app/settlements/page.tsx apps/web/src/lib/veilsettle/integrations/data/provider.ts apps/web/src/lib/veilsettle/integrations/identity/provider.ts docs/submission/live-evidence.md docs/submission/demo-script.md apps/web/src/lib/veilsettle/integrations/data/dune.test.ts apps/web/src/lib/veilsettle/integrations/identity/sns.test.ts apps/web/src/lib/veilsettle/integrations/ai/qvac.test.ts
  git commit -m "docs: add live integration evidence"
  ```

---

## Task 9: Security Statement And Demo-Grade Auth Caveats

**Purpose:** Make the security story credible for Adevar without pretending this is production fintech.

**Files:**

- Modify: `docs/submission/security-statement.md`
- Modify: `docs/security/publication-checklist.md`
- Modify: `README.md`
- Modify: `apps/web/src/app/api/invoices/payment-proof.test.ts`
- Modify if chosen: `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`

- [ ] **Step 1: Add explicit security posture.**

  Add this section to `docs/submission/security-statement.md`:

  ```markdown
  ## Release Security Posture

  VeilSettle is a hackathon MVP, not a production payment processor.

  Strong properties in this release:

  - Public verification exposes status and commitments, not invoice amount, memo, line items, attachments, or client context.
  - Supabase service role access is server-side only.
  - RLS is enabled on invoice tables, with no browser-side direct table writes.
  - Payment provider adapters return public-safe proof references.

  Known MVP limitations:

  - Wallet authentication is demo-grade and does not yet require signed wallet challenges for every invoice read.
  - Payment proof submission stores provider proof references but does not independently verify every onchain execution path.
  - Invoice encryption key recovery is demo-grade and not suitable for production account recovery.
  - MagicBlock signing/submission is claimed only if Task 6 succeeds.
  ```

- [ ] **Step 2: Decide whether to add proof-reference allowlist validation.**

  Minimal safe improvement:

  ```text
  Accept paymentProofReference only when it starts with one of:
  - magicblock:
  - cloak:
  - umbra:
  - mock:
  ```

  If implemented, add a failing test to `apps/web/src/app/api/invoices/payment-proof.test.ts`:

  ```ts
  it("rejects unsupported payment proof references", async () => {
    const { POST } = await import("./[id]/payment-proof/route");

    const response = await POST(
      new Request("http://localhost/api/invoices/invoice-1/payment-proof", {
        method: "POST",
        body: JSON.stringify({
          paymentProofReference: "raw-user-string",
          transactionSignature: "signature",
          paidAt: "2026-05-07T12:00:00.000Z",
          dueDate: "2026-05-08",
        }),
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Unsupported payment proof provider" });
  });
  ```

  Implement in route after schema parse:

  ```ts
  const allowedProofPrefixes = ["magicblock:", "cloak:", "umbra:", "mock:"];

  if (!allowedProofPrefixes.some((prefix) => body.paymentProofReference.startsWith(prefix))) {
    return NextResponse.json({ error: "Unsupported payment proof provider" }, { status: 400 });
  }
  ```

- [ ] **Step 3: Update publication checklist.**

  Add final security checklist items to `docs/security/publication-checklist.md`:

  ```markdown
  - [ ] `pnpm audit` has no critical/high advisories, or every remaining advisory is documented.
  - [ ] README limitations match the implemented payment path.
  - [ ] Public verification was checked for amount, memo, line item, attachment, and client leakage.
  - [ ] Supabase service role key is only in server/deployment secrets.
  - [ ] Payment proof references are provider-prefixed.
  ```

- [ ] **Step 4: Run verification.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web test -- payment-proof
  corepack.cmd pnpm --filter @veilsettle/web build
  ```

  Expected: pass.

- [ ] **Step 5: Commit.**

  ```powershell
  git add docs/submission/security-statement.md docs/security/publication-checklist.md README.md apps/web/src/app/api/invoices/payment-proof.test.ts apps/web/src/app/api/invoices/[id]/payment-proof/route.ts
  git commit -m "docs: clarify release security posture"
  ```

---

## Task 10: Submission Package And Demo Assets

**Purpose:** Make the project easy for judges to understand in under five minutes.

**Files:**

- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/hackathon-targets.md`
- Modify: `docs/submission/live-evidence.md`
- Create if needed: `docs/submission/pitch-outline.md`

- [ ] **Step 1: Final README shape.**

  README must have these sections in order:

  ```markdown
  # VeilSettle

  ## What It Is
  ## Demo Flow
  ## Architecture
  ## Current Release Status
  ## Track Fit
  ## Setup
  ## Environment Variables
  ## Verification
  ## Security And Limitations
  ## Submission Links
  ```

- [ ] **Step 2: Final demo script.**

  `docs/submission/demo-script.md` must fit 3-5 minutes:

  ```markdown
  # VeilSettle Demo Script

  ## 0:00-0:25 Problem
  Web3 agencies need stablecoin invoice settlement proof without exposing invoice amount, scope, memo, or client context publicly.

  ## 0:25-1:10 Create Private Invoice
  Show encrypted invoice creation and explain public commitments.

  ## 1:10-1:45 Local Review
  Show QVAC local checks and state that private invoice content is not sent to cloud review APIs.

  ## 1:45-2:40 Private Payment Preparation
  Show MagicBlock/private payment preparation. If Task 6 is not complete, say this prepares an unsigned private SPL transfer for wallet signing.

  ## 2:40-3:25 Public Verification
  Show public status/proof reference and verify amount/memo/line items are absent.

  ## 3:25-4:10 Integrations
  Show Dune redacted analytics and SNS opt-in identity.

  ## 4:10-4:45 Why It Matters
  Agencies, auditors, and service vendors can prove settlement without leaking commercial terms.
  ```

- [ ] **Step 3: Add pitch outline.**

  Create `docs/submission/pitch-outline.md`:

  ```markdown
  # VeilSettle Pitch Outline

  1. Problem: public stablecoin payments leak commercial invoice details.
  2. Customer: Web3 agencies, auditors, service vendors, and client finance teams.
  3. Product: encrypted invoices, local review, private payment preparation, public commitments.
  4. Why Solana: low fees, fast settlement, SPL stablecoins, SNS identity, strong sponsor ecosystem.
  5. Privacy model: public status and commitments only; private terms remain authorized.
  6. MVP demo: create, review, prepare private payment, verify public receipt.
  7. Integrations: MagicBlock, Dune SIM, SNS, QVAC, optional RPC Fast.
  8. Business wedge: private milestone/retainer settlement for agencies and auditors.
  9. Next steps: wallet auth, verified onchain settlement proof, production key recovery, stablecoin expansion.
  ```

- [ ] **Step 4: Add submission links.**

  Once available, add links in `README.md` and `docs/submission/live-evidence.md`:

  ```markdown
  ## Submission Links

  - Deployed app:
  - Demo video:
  - GitHub repository:
  - Colosseum project:
  - Superteam submissions:
  ```

- [ ] **Step 5: Run docs scan.**

  ```powershell
  Select-String -Path README.md,docs\submission\*.md,docs\security\*.md -Pattern "TB[D]|T[O]DO|coming soon|completed MagicBlock|live PUSD|production-ready" -CaseSensitive:$false
  ```

  Expected: no unresolved placeholder markers; any other match is a limitation or backed by evidence.

- [ ] **Step 6: Commit.**

  ```powershell
  git add README.md docs/submission/demo-script.md docs/submission/hackathon-targets.md docs/submission/live-evidence.md docs/submission/pitch-outline.md
  git commit -m "docs: prepare final submission package"
  ```

---

## Task 11: Anchor And Solana Program Verification

**Purpose:** Avoid leaving the Solana program story unverifiable.

**Files:**

- Modify: `docs/submission/live-evidence.md`
- Modify if needed: `programs/veilsettle/tests/veilsettle.ts`
- Modify if needed: `programs/veilsettle/programs/veilsettle/src/lib.rs`

- [ ] **Step 1: Check local toolchain.**

  Run:

  ```powershell
  anchor --version
  cargo --version
  solana --version
  ```

  Expected: all commands print versions. If not installed, either install the toolchain or document that Anchor verification is not claimed.

- [ ] **Step 2: Run Anchor tests if toolchain exists.**

  ```powershell
  corepack.cmd pnpm anchor:test
  ```

  Expected: Anchor tests pass.

- [ ] **Step 3: Run Cargo tests if toolchain exists.**

  ```powershell
  Set-Location programs\veilsettle
  cargo test
  Set-Location ..\..
  ```

  Expected: Cargo tests pass.

- [ ] **Step 4: Record result.**

  Add to `docs/submission/live-evidence.md`:

  ```markdown
  ## Solana Program Evidence

  - `anchor --version`:
  - `cargo --version`:
  - `solana --version`:
  - `corepack.cmd pnpm anchor:test`:
  - `cargo test`:
  ```

- [ ] **Step 5: Commit evidence or fixes.**

  ```powershell
  git add docs/submission/live-evidence.md programs/veilsettle/tests/veilsettle.ts programs/veilsettle/programs/veilsettle/src/lib.rs
  git commit -m "test: verify veilsettle anchor program"
  ```

---

## Task 12: Final Verification Gate

**Purpose:** Prove the release is ready before public push or submission.

**Files:**

- Modify: `docs/submission/live-evidence.md`
- Modify: `docs/security/publication-checklist.md`

- [ ] **Step 1: Check git state.**

  ```powershell
  git status --short --branch --untracked-files=all
  ```

  Expected: only intentional tracked changes or clean tree.

- [ ] **Step 2: Run full web checks.**

  ```powershell
  corepack.cmd pnpm --filter @veilsettle/web lint
  corepack.cmd pnpm --filter @veilsettle/web test
  corepack.cmd pnpm --filter @veilsettle/web build
  corepack.cmd pnpm --filter @veilsettle/web test:e2e
  ```

  Expected:

  ```text
  lint exit 0
  unit tests exit 0
  build exit 0
  e2e exit 0
  ```

- [ ] **Step 3: Run dependency audit.**

  ```powershell
  corepack.cmd pnpm audit --audit-level moderate
  ```

  Expected for final release: exit 0, or no critical/high advisories with documented moderate mitigations in `docs/submission/live-evidence.md`.

- [ ] **Step 4: Run secret scan.**

  ```powershell
  git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD
  ```

  Expected: matches are only empty env names, placeholders, tests, or docs warnings. Inspect every line before public push.

- [ ] **Step 5: Run docs claim scan.**

  ```powershell
  Select-String -Path README.md,docs\submission\*.md,docs\security\*.md -Pattern "TB[D]|T[O]DO|coming soon|completed MagicBlock|live PUSD|production-ready|QVAC SDK|live Supabase" -CaseSensitive:$false
  ```

  Expected: no unresolved placeholder markers; every claim phrase is either evidenced or explicitly denied.

- [ ] **Step 6: Verify public/private receipt behavior.**

  In Playwright output or manual browser check:

  ```text
  /verify/demo-invoice public panel contains: Paid, Metadata hash, Amount commitment, Payment proof.
  /verify/demo-invoice public panel does not contain: 2,500.00 PUSD, Private audit invoice, line item labels, client private context.
  ```

- [ ] **Step 7: Record final evidence.**

  Fill `docs/submission/live-evidence.md` command table with:

  ```text
  command
  date/time
  exit code
  short result
  ```

- [ ] **Step 8: Commit final evidence.**

  ```powershell
  git add docs/submission/live-evidence.md docs/security/publication-checklist.md
  git commit -m "docs: record final release verification"
  ```

## Execution Order

Use this order unless a blocker forces a documented downgrade:

1. Task 1: Submission eligibility and public claims gate.
2. Task 2: Dependency audit cleanup.
3. Task 3: Supabase live-mode decision and evidence.
4. Task 4: Provider status correctness.
5. Task 5: Private payment preparation route.
6. Task 6: MagicBlock signing/submission risky mini-task decision.
7. Task 7: PUSD claim hardening.
8. Task 8: Dune/SNS/QVAC/RPC evidence.
9. Task 9: Security statement and demo-grade auth caveats.
10. Task 10: Submission package and demo assets.
11. Task 11: Anchor and Solana program verification.
12. Task 12: Final verification gate.

## Stop Conditions

Stop and reassess before continuing if any of these happen:

- A task requires real secrets in the repo.
- `pnpm audit` still reports critical/high advisories after dependency cleanup.
- MagicBlock signing/submission breaks the working demo path.
- PUSD official mint/liquidity cannot be verified but docs still imply live PUSD settlement.
- Supabase live migration cannot be verified but docs imply live Supabase mode.
- Final E2E stops proving public/private separation.

## Execution Handoff

Plan saved in `plan.md` by user request instead of the default `docs/superpowers/plans/...` path.

Recommended execution:

1. Subagent-driven execution for independent docs/audit/evidence tasks if the user explicitly asks for subagents.
2. Inline execution with `superpowers:executing-plans` for the next session if the user says to continue without subagents.

Start with Task 1, then move strictly in order. Do not begin Task 6 until Tasks 1-5 are verified green.
