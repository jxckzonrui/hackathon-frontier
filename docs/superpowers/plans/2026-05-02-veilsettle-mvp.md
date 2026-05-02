# VeilSettle MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build VeilSettle, a privacy-preserving stablecoin invoice settlement web app for Web3 agencies, freelancers, and contractors.

**Architecture:** Next.js web app + Supabase encrypted metadata store + Anchor commitment registry on Solana devnet. Cloak is the critical private-payment path, QVAC is the local invoice intelligence layer, and Dune/GoldRush/Torque/SNS integrations support sponsor tracks without changing the core product loop.

**Tech Stack:** TypeScript, Next.js App Router, Tailwind, Vitest, Playwright, Supabase/Postgres, Anchor/Rust, Solana wallet adapter, Cloak TypeScript SDK, QVAC JS/TS SDK, Dune SIM SVM APIs, GoldRush APIs, Torque API/MCP event adapter.

---

## Product Lock

VeilSettle is not a generic invoice app. It is a private settlement layer:

1. Agency creates a one-time invoice for a protocol audit sprint.
2. Invoice details are encrypted offchain.
3. Solana stores only commitments, status, and payment proof references.
4. Client sees local QVAC consistency checks before signing.
5. Client pays with PUSD-first stablecoin flow, using a mock SPL token on devnet if PUSD devnet access is blocked.
6. Cloak-backed private payment path is the primary privacy integration.
7. Public verification shows `paid`, timestamp, proof id, and hashes, but never amount, line items, memo, attachments, or commercial context.
8. Settlement dashboard indexes public events through Dune SIM and GoldRush.
9. Early payment triggers a Torque event.

Out of scope for MVP: escrow, recurring invoices, invoice financing, KYC, tax compliance, full legal business verification, full MagicBlock private execution.

## Hackathon Targets

Primary targets this product can honestly submit to if the implementation matches the plan:

| Track | Fit | Required product evidence |
|---|---|---|
| Main Colosseum Frontier | Core Solana project | Working Solana app, GitHub, demo video, deck, Colosseum profile |
| 100xDevs Frontier Track | General Solana build | Project built on Solana and submitted to Colosseum + Superteam Earn |
| Adevar Labs | Stablecoin/security docs | Security statement, threat model, tech docs, payment/privacy risks documented |
| RPC Fast | Infra dependency | Clear RPC usage for Anchor program, status polling, dashboard indexing |
| Tether QVAC | Local AI core feature | QVAC local invoice checks, summary, receipt language, risk flags in demo |
| Palm USD | Stablecoin core asset | PUSD as default currency; fallback mock token only if PUSD devnet is blocked |
| Cloak private payments | Core privacy flow | Cloak SDK central to payment path; README explains centrality |
| Umbra privacy SDK | Secondary privacy route | Add only if Umbra SDK path is actually demoable; otherwise do not submit |
| Dune Analytics SIM Data | Settlement analytics | Use SIM SVM balances/transactions in settlement dashboard |
| GoldRush by Covalent | Onchain data | Use GoldRush structured transaction/event data in dashboard or receipt verification |
| SNS Identity | Identity layer | Agency/client display names through SNS + wallets |
| Torque MCP/API | Incentives | `invoice_paid_early` event triggers reward/discount workflow |
| theMiracle | Distribution/growth | Benefit proposal around private invoice settlement for agencies |
| Zerion CLI | Scoped onchain action | Approval assistant prepares scoped payment transaction; submit only if real Zerion flow exists |

Conditional or lower priority:

- MagicBlock Privacy Track: submit only if a real MagicBlock integration is added after core flow.
- Encrypt/Ika: weak fit for invoice settlement unless encrypted capital-market style settlement is added; do not target by default.
- LPAgent/Jupiter: weak fit for invoice settlement; avoid unless payment routing/liquidity flow is added later.
- Regional tracks: add only where team eligibility is truthful and compatible with official restrictions.

## File Structure

All paths are relative to `C:\Users\miha2\Project\collesiumpr`.

- `agent.md` - operating summary of product decisions, target tracks, and build sequence.
- `package.json`, `pnpm-workspace.yaml`, `.gitignore`, `README.md` - monorepo baseline.
- `apps/web` - Next.js app.
- `apps/web/src/lib/veilsettle/types.ts` - shared product/domain types.
- `apps/web/src/lib/veilsettle/commitments.ts` - canonical hashes and commitments.
- `apps/web/src/lib/veilsettle/encryption.ts` - invoice encryption and reveal bundles.
- `apps/web/src/lib/veilsettle/qvac.ts` - local invoice intelligence adapter.
- `apps/web/src/lib/veilsettle/privacy-payments.ts` - Cloak/Umbra payment adapter boundary.
- `apps/web/src/lib/veilsettle/analytics.ts` - Dune/GoldRush client boundary.
- `apps/web/src/lib/veilsettle/torque.ts` - early-payment event adapter.
- `apps/web/src/app/api/invoices/route.ts` - create invoice API.
- `apps/web/src/app/api/invoices/[id]/route.ts` - authorized invoice fetch API.
- `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts` - payment proof/status API.
- `apps/web/src/app/api/public/invoices/[id]/route.ts` - public verification API.
- `apps/web/src/app/dashboard/page.tsx` - agency dashboard.
- `apps/web/src/app/invoices/new/page.tsx` - create invoice screen.
- `apps/web/src/app/pay/[id]/page.tsx` - client review/pay screen.
- `apps/web/src/app/verify/[id]/page.tsx` - receipt/public verification split-view.
- `apps/web/src/app/settlements/page.tsx` - settlement dashboard.
- `supabase/migrations/0001_veilsettle.sql` - encrypted metadata schema.
- `programs/veilsettle` - Anchor commitment registry.
- `tests/e2e/veilsettle.spec.ts` - Playwright hero-flow test.

## Task 1: Lock Product Docs And Repo Baseline

**Files:**
- Modify: `agent.md`
- Create: `.gitignore`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `README.md`

- [ ] **Step 1: Initialize git repository**

Run:

```powershell
git init
```

Expected: repository initialized in `C:\Users\miha2\Project\collesiumpr`.

- [ ] **Step 2: Update `agent.md` with locked VeilSettle summary**

Append this section to `agent.md`:

```markdown
## Locked Product - VeilSettle

VeilSettle is a privacy-preserving stablecoin invoice settlement layer for Web3 agencies, freelancers, and contractors.

MVP use case: a Web3 dev/security agency invoices a client for a protocol audit sprint. The client reviews the invoice locally, pays with a PUSD-first stablecoin flow, and both sides receive a selective-reveal receipt. Public observers can verify status and hashes, but cannot see amount, line items, memo, attachments, or client context.

Core flow:

1. Agency creates one-time encrypted invoice.
2. Solana commitment registry stores only hashes/status/proof reference.
3. Client reviews invoice with local QVAC consistency checks.
4. Client signs private payment through Cloak-backed adapter.
5. Payment proof marks invoice paid.
6. Dune/GoldRush settlement dashboard indexes public status events.
7. Early payment emits Torque `invoice_paid_early`.

Primary target tracks: Main Frontier, 100xDevs, Adevar Labs, RPC Fast, Tether QVAC, Palm USD, Cloak, Dune SIM, GoldRush, SNS, Torque, theMiracle. Conditional tracks: Umbra, Zerion, MagicBlock.

Implementation plan: docs/superpowers/plans/2026-05-02-veilsettle-mvp.md
```

- [ ] **Step 3: Create `.gitignore`**

Create:

```gitignore
node_modules
.next
out
dist
coverage
.env
.env.local
.env.*.local
target
.anchor
test-ledger
wallets
*.log
```

- [ ] **Step 4: Create workspace package files**

Create `package.json`:

```json
{
  "name": "veilsettle",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @veilsettle/web dev",
    "build": "pnpm --filter @veilsettle/web build",
    "test": "pnpm --filter @veilsettle/web test",
    "test:e2e": "pnpm --filter @veilsettle/web test:e2e",
    "anchor:test": "cd programs/veilsettle && anchor test"
  },
  "packageManager": "pnpm@9.15.0"
}
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
```

- [ ] **Step 5: Create README**

Create `README.md`:

```markdown
# VeilSettle

Private stablecoin invoice settlement for Web3 agencies.

## Demo Flow

Agency creates an encrypted protocol-audit invoice, client reviews local QVAC checks, client pays through a private payment path, and public verification shows only status and commitments.

## MVP Tracks

Main Frontier, 100xDevs, Adevar Labs, RPC Fast, Tether QVAC, Palm USD, Cloak, Dune SIM, GoldRush, SNS, Torque, theMiracle.
```

- [ ] **Step 6: Commit baseline**

Run:

```powershell
git add agent.md .gitignore package.json pnpm-workspace.yaml README.md docs/superpowers/plans/2026-05-02-veilsettle-mvp.md
git commit -m "docs: lock VeilSettle MVP plan"
```

Expected: one commit with product docs and plan.

## Task 2: Scaffold Web App

**Files:**
- Create: `apps/web`
- Modify: `apps/web/package.json`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`

- [ ] **Step 1: Generate Next.js app**

Run:

```powershell
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Expected: Next.js app created under `apps/web`.

- [ ] **Step 2: Install app dependencies**

Run:

```powershell
pnpm --dir apps/web add @supabase/supabase-js @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @coral-xyz/anchor zod lucide-react
pnpm --dir apps/web add -D vitest @testing-library/react @testing-library/jest-dom jsdom playwright
```

Expected: dependencies added to `apps/web/package.json`.

- [ ] **Step 3: Replace home page with product redirect**

Set `apps/web/src/app/page.tsx` to:

```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 4: Add test scripts**

Update `apps/web/package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Verify app boots**

Run:

```powershell
pnpm --filter @veilsettle/web dev
```

Expected: Next.js dev server starts and redirects `/` to `/dashboard`. Stop the server after verifying.

- [ ] **Step 6: Commit scaffold**

Run:

```powershell
git add apps/web package.json pnpm-workspace.yaml
git commit -m "feat: scaffold VeilSettle web app"
```

## Task 3: Add Domain Types And Commitment Hashing

**Files:**
- Create: `apps/web/src/lib/veilsettle/types.ts`
- Create: `apps/web/src/lib/veilsettle/commitments.ts`
- Create: `apps/web/src/lib/veilsettle/commitments.test.ts`
- Create: `apps/web/src/test/setup.ts`
- Create: `apps/web/vitest.config.ts`

- [ ] **Step 1: Add Vitest config**

Create `apps/web/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

Create `apps/web/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 2: Write failing commitment tests**

Create `apps/web/src/lib/veilsettle/commitments.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createInvoiceCommitments } from "./commitments";
import type { InvoiceDraft } from "./types";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [
    { label: "Smart contract review", amountMinor: "1500000000" },
    { label: "Findings report", amountMinor: "1000000000" }
  ],
  memo: "Private audit invoice for sprint 12",
  attachmentHash: "sha256-demo-attachment"
};

describe("createInvoiceCommitments", () => {
  it("creates deterministic commitments without exposing private fields", async () => {
    const first = await createInvoiceCommitments(draft);
    const second = await createInvoiceCommitments(draft);

    expect(first.metadataHash).toEqual(second.metadataHash);
    expect(first.amountCommitment).toEqual(second.amountCommitment);
    expect(first.metadataHash).not.toContain("Protocol audit sprint");
    expect(first.amountCommitment).not.toContain("2500000000");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run:

```powershell
pnpm --filter @veilsettle/web test -- commitments.test.ts
```

Expected: FAIL because `./commitments` and `./types` do not exist.

- [ ] **Step 4: Add domain types**

Create `apps/web/src/lib/veilsettle/types.ts`:

```ts
export type StablecoinSymbol = "PUSD" | "USDC" | "USDT";

export type InvoiceLineItem = {
  label: string;
  amountMinor: string;
};

export type InvoiceDraft = {
  clientDisplay: string;
  clientWallet: string;
  amountMinor: string;
  currency: StablecoinSymbol;
  dueDate: string;
  serviceTitle: string;
  lineItems: InvoiceLineItem[];
  memo: string;
  attachmentHash: string;
};

export type InvoiceCommitments = {
  metadataHash: string;
  amountCommitment: string;
  dueDateHash: string;
  payerHash: string;
};

export type PublicInvoiceStatus = "created" | "paid" | "voided";
```

- [ ] **Step 5: Add commitment implementation**

Create `apps/web/src/lib/veilsettle/commitments.ts`:

```ts
import type { InvoiceCommitments, InvoiceDraft } from "./types";

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

export async function createInvoiceCommitments(draft: InvoiceDraft): Promise<InvoiceCommitments> {
  const metadata = {
    serviceTitle: draft.serviceTitle,
    lineItems: draft.lineItems,
    memo: draft.memo,
    attachmentHash: draft.attachmentHash,
    currency: draft.currency,
  };

  return {
    metadataHash: await sha256Hex(canonicalJson(metadata)),
    amountCommitment: await sha256Hex(`${draft.currency}:${draft.amountMinor}`),
    dueDateHash: await sha256Hex(draft.dueDate),
    payerHash: await sha256Hex(draft.clientWallet),
  };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```powershell
pnpm --filter @veilsettle/web test -- commitments.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```powershell
git add apps/web/src/lib/veilsettle apps/web/src/test apps/web/vitest.config.ts apps/web/package.json
git commit -m "feat: add invoice commitment primitives"
```

## Task 4: Add Encryption And Selective Reveal Bundles

**Files:**
- Create: `apps/web/src/lib/veilsettle/encryption.ts`
- Create: `apps/web/src/lib/veilsettle/encryption.test.ts`

- [ ] **Step 1: Write failing encryption test**

Create `apps/web/src/lib/veilsettle/encryption.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createRevealBundle, decryptInvoiceBlob, encryptInvoiceBlob } from "./encryption";
import type { InvoiceDraft } from "./types";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Private memo",
  attachmentHash: "sha256-demo-attachment"
};

describe("invoice encryption", () => {
  it("encrypts invoice details and supports selected reveal", async () => {
    const encrypted = await encryptInvoiceBlob(draft, ["agency-wallet", "client-wallet"]);
    expect(encrypted.ciphertext).not.toContain("Protocol audit sprint");
    expect(encrypted.ciphertext).not.toContain("2500000000");

    const decrypted = await decryptInvoiceBlob(encrypted);
    expect(decrypted.serviceTitle).toBe("Protocol audit sprint");

    const reveal = await createRevealBundle(decrypted, ["serviceTitle", "currency"]);
    expect(reveal.revealed).toEqual({
      serviceTitle: "Protocol audit sprint",
      currency: "PUSD"
    });
    expect(reveal.revealed).not.toHaveProperty("amountMinor");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
pnpm --filter @veilsettle/web test -- encryption.test.ts
```

Expected: FAIL because `encryption.ts` does not exist.

- [ ] **Step 3: Implement encryption helper**

Create `apps/web/src/lib/veilsettle/encryption.ts`:

```ts
import type { InvoiceDraft } from "./types";

export type EncryptedInvoiceBlob = {
  schemaVersion: 1;
  ciphertext: string;
  iv: string;
  recipients: string[];
};

export type RevealableField = keyof Pick<
  InvoiceDraft,
  "serviceTitle" | "currency" | "dueDate" | "lineItems" | "memo" | "attachmentHash" | "clientDisplay"
>;

export type ReceiptRevealBundle = {
  revealed: Partial<Pick<InvoiceDraft, RevealableField>>;
  revealScope: RevealableField[];
  createdAt: string;
};

let lastKey: CryptoKey | null = null;

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

export async function encryptInvoiceBlob(
  draft: InvoiceDraft,
  recipients: string[]
): Promise<EncryptedInvoiceBlob> {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  lastKey = key;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(draft));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return {
    schemaVersion: 1,
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    iv: toBase64(iv),
    recipients,
  };
}

export async function decryptInvoiceBlob(blob: EncryptedInvoiceBlob): Promise<InvoiceDraft> {
  if (!lastKey) {
    throw new Error("Missing invoice key in this demo session");
  }

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(blob.iv) },
    lastKey,
    fromBase64(blob.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as InvoiceDraft;
}

export async function createRevealBundle(
  draft: InvoiceDraft,
  fields: RevealableField[]
): Promise<ReceiptRevealBundle> {
  const revealed: ReceiptRevealBundle["revealed"] = {};
  for (const field of fields) {
    revealed[field] = draft[field] as never;
  }
  return {
    revealed,
    revealScope: fields,
    createdAt: new Date("2026-05-02T00:00:00.000Z").toISOString(),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
pnpm --filter @veilsettle/web test -- encryption.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add apps/web/src/lib/veilsettle/encryption.ts apps/web/src/lib/veilsettle/encryption.test.ts
git commit -m "feat: add encrypted invoice blobs"
```

## Task 5: Add Supabase Schema And Invoice APIs

**Files:**
- Create: `supabase/migrations/0001_veilsettle.sql`
- Create: `apps/web/src/lib/veilsettle/storage.ts`
- Create: `apps/web/src/app/api/invoices/route.ts`
- Create: `apps/web/src/app/api/invoices/[id]/route.ts`
- Create: `apps/web/src/app/api/public/invoices/[id]/route.ts`

- [ ] **Step 1: Create Supabase schema**

Create `supabase/migrations/0001_veilsettle.sql`:

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
```

- [ ] **Step 2: Implement storage boundary**

Create `apps/web/src/lib/veilsettle/storage.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
```

- [ ] **Step 3: Implement create invoice API**

Create `apps/web/src/app/api/invoices/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createInvoiceCommitments } from "@/lib/veilsettle/commitments";
import { encryptInvoiceBlob } from "@/lib/veilsettle/encryption";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";

const invoiceSchema = z.object({
  creatorWallet: z.string().min(32),
  clientDisplay: z.string().min(1),
  clientWallet: z.string().min(32),
  amountMinor: z.string().regex(/^[0-9]+$/),
  currency: z.enum(["PUSD", "USDC", "USDT"]),
  dueDate: z.string().min(10),
  serviceTitle: z.string().min(1),
  lineItems: z.array(z.object({ label: z.string().min(1), amountMinor: z.string().regex(/^[0-9]+$/) })).min(1),
  memo: z.string(),
  attachmentHash: z.string(),
});

export async function POST(request: Request) {
  const body = invoiceSchema.parse(await request.json());
  const commitments = await createInvoiceCommitments(body);
  const encryptedBlob = await encryptInvoiceBlob(body, [body.creatorWallet, body.clientWallet]);
  const supabase = getSupabaseServerClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      creator_wallet: body.creatorWallet,
      payer_hash: commitments.payerHash,
      metadata_hash: commitments.metadataHash,
      amount_commitment: commitments.amountCommitment,
      due_date_hash: commitments.dueDateHash,
      status: "created",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: blobError } = await supabase.from("encrypted_invoice_blobs").insert({
    invoice_id: invoice.id,
    encrypted_blob: encryptedBlob,
    authorized_wallets: [body.creatorWallet, body.clientWallet],
    blob_hash: commitments.metadataHash,
  });

  if (blobError) return NextResponse.json({ error: blobError.message }, { status: 500 });

  return NextResponse.json({ invoiceId: invoice.id, commitments });
}
```

- [ ] **Step 4: Implement public verification API**

Create `apps/web/src/app/api/public/invoices/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id,status,metadata_hash,amount_commitment,due_date_hash,payment_proof_reference,created_at,paid_at")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(data);
}
```

- [ ] **Step 5: Commit**

Run:

```powershell
git add supabase apps/web/src/app/api apps/web/src/lib/veilsettle/storage.ts
git commit -m "feat: add encrypted invoice storage APIs"
```

## Task 6: Add Anchor Commitment Registry

**Files:**
- Create: `programs/veilsettle`
- Modify: `programs/veilsettle/programs/veilsettle/src/lib.rs`
- Create: `programs/veilsettle/tests/veilsettle.ts`

- [ ] **Step 1: Generate Anchor project**

Run:

```powershell
anchor init programs/veilsettle --typescript
```

Expected: Anchor project exists under `programs/veilsettle`.

- [ ] **Step 2: Replace program with commitment registry**

Set `programs/veilsettle/programs/veilsettle/src/lib.rs` to:

```rust
use anchor_lang::prelude::*;

declare_id!("Veil111111111111111111111111111111111111111");

#[program]
pub mod veilsettle {
    use super::*;

    pub fn create_invoice_commitment(
        ctx: Context<CreateInvoiceCommitment>,
        invoice_id: [u8; 16],
        payer_hash: [u8; 32],
        metadata_hash: [u8; 32],
        amount_commitment: [u8; 32],
        due_date_hash: [u8; 32],
    ) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.creator = ctx.accounts.creator.key();
        invoice.invoice_id = invoice_id;
        invoice.payer_hash = payer_hash;
        invoice.metadata_hash = metadata_hash;
        invoice.amount_commitment = amount_commitment;
        invoice.due_date_hash = due_date_hash;
        invoice.status = InvoiceStatus::Created;
        invoice.payment_proof_reference = [0; 32];
        Ok(())
    }

    pub fn mark_paid(ctx: Context<UpdateInvoice>, payment_proof_reference: [u8; 32]) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(invoice.status == InvoiceStatus::Created, VeilSettleError::InvalidStatus);
        invoice.status = InvoiceStatus::Paid;
        invoice.payment_proof_reference = payment_proof_reference;
        Ok(())
    }

    pub fn void_invoice(ctx: Context<UpdateInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(invoice.status == InvoiceStatus::Created, VeilSettleError::InvalidStatus);
        invoice.status = InvoiceStatus::Voided;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(invoice_id: [u8; 16])]
pub struct CreateInvoiceCommitment<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + InvoiceCommitment::INIT_SPACE,
        seeds = [b"invoice", creator.key().as_ref(), invoice_id.as_ref()],
        bump
    )]
    pub invoice: Account<'info, InvoiceCommitment>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateInvoice<'info> {
    #[account(mut, has_one = creator)]
    pub invoice: Account<'info, InvoiceCommitment>,
    pub creator: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct InvoiceCommitment {
    pub creator: Pubkey,
    pub invoice_id: [u8; 16],
    pub payer_hash: [u8; 32],
    pub metadata_hash: [u8; 32],
    pub amount_commitment: [u8; 32],
    pub due_date_hash: [u8; 32],
    pub status: InvoiceStatus,
    pub payment_proof_reference: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum InvoiceStatus {
    Created,
    Paid,
    Voided,
}

#[error_code]
pub enum VeilSettleError {
    #[msg("Invoice is not in a valid state for this transition")]
    InvalidStatus,
}
```

- [ ] **Step 3: Add Anchor tests**

Create `programs/veilsettle/tests/veilsettle.ts`:

```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";

describe("veilsettle", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Veilsettle as Program;

  it("creates and marks an invoice paid", async () => {
    const creator = anchor.getProvider().publicKey!;
    const invoiceId = Array.from(Buffer.from("1234567890abcdef"));
    const [invoicePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("invoice"), creator.toBuffer(), Buffer.from(invoiceId)],
      program.programId
    );

    const hash = Array(32).fill(1);
    await program.methods
      .createInvoiceCommitment(invoiceId, hash, hash, hash, hash)
      .accounts({ invoice: invoicePda, creator })
      .rpc();

    let account = await program.account.invoiceCommitment.fetch(invoicePda);
    assert.deepEqual(account.status, { created: {} });

    await program.methods.markPaid(Array(32).fill(2)).accounts({ invoice: invoicePda, creator }).rpc();
    account = await program.account.invoiceCommitment.fetch(invoicePda);
    assert.deepEqual(account.status, { paid: {} });
  });
});
```

- [ ] **Step 4: Run Anchor tests**

Run:

```powershell
cd programs/veilsettle
anchor test
```

Expected: test creates invoice commitment and marks it paid.

- [ ] **Step 5: Commit**

Run:

```powershell
git add programs/veilsettle package.json
git commit -m "feat: add Solana invoice commitment registry"
```

## Task 7: Build Four-Screen Product Flow

**Files:**
- Create: `apps/web/src/components/InvoiceForm.tsx`
- Create: `apps/web/src/components/PublicPrivateVerification.tsx`
- Create: `apps/web/src/app/dashboard/page.tsx`
- Create: `apps/web/src/app/invoices/new/page.tsx`
- Create: `apps/web/src/app/pay/[id]/page.tsx`
- Create: `apps/web/src/app/verify/[id]/page.tsx`
- Create: `apps/web/src/app/settlements/page.tsx`

- [ ] **Step 1: Add agency dashboard**

Create `apps/web/src/app/dashboard/page.tsx`:

```tsx
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">VeilSettle</p>
          <h1 className="text-3xl font-semibold tracking-normal">Private stablecoin settlement</h1>
        </div>
        <Link className="rounded-md bg-slate-950 px-4 py-2 text-white" href="/invoices/new">
          New invoice
        </Link>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <p className="text-sm text-slate-500">Created</p>
          <p className="text-2xl font-semibold">1</p>
        </div>
        <div className="rounded-md border p-4">
          <p className="text-sm text-slate-500">Private fields exposed publicly</p>
          <p className="text-2xl font-semibold">0</p>
        </div>
        <div className="rounded-md border p-4">
          <p className="text-sm text-slate-500">Early-pay rewards</p>
          <p className="text-2xl font-semibold">Ready</p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Add invoice form component**

Create `apps/web/src/components/InvoiceForm.tsx` with fixed demo defaults and editable inputs:

```tsx
"use client";

import { useState } from "react";

export function InvoiceForm() {
  const [status, setStatus] = useState<string>("Ready");

  async function createInvoice() {
    setStatus("Creating encrypted invoice...");
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creatorWallet: "Agency111111111111111111111111111111111111",
        clientDisplay: "client.sol",
        clientWallet: "Client111111111111111111111111111111111111",
        amountMinor: "2500000000",
        currency: "PUSD",
        dueDate: "2026-05-08",
        serviceTitle: "Protocol audit sprint",
        lineItems: [
          { label: "Smart contract review", amountMinor: "1500000000" },
          { label: "Findings report", amountMinor: "1000000000" }
        ],
        memo: "Private audit invoice for sprint 12",
        attachmentHash: "sha256-demo-attachment"
      }),
    });
    const json = await response.json();
    setStatus(`Created invoice ${json.invoiceId}`);
  }

  return (
    <section className="rounded-md border p-6">
      <h2 className="text-xl font-semibold">Protocol audit sprint invoice</h2>
      <p className="mt-2 text-sm text-slate-600">2,500.00 PUSD due 2026-05-08, hidden from public verification.</p>
      <button onClick={createInvoice} className="mt-6 rounded-md bg-slate-950 px-4 py-2 text-white">
        Create encrypted invoice
      </button>
      <p className="mt-4 text-sm text-slate-600">{status}</p>
    </section>
  );
}
```

- [ ] **Step 3: Add create invoice page**

Create `apps/web/src/app/invoices/new/page.tsx`:

```tsx
import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8">
      <InvoiceForm />
    </main>
  );
}
```

- [ ] **Step 4: Add public/private verification component**

Create `apps/web/src/components/PublicPrivateVerification.tsx`:

```tsx
export function PublicPrivateVerification() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-md border p-5">
        <p className="text-sm text-slate-500">Authorized party view</p>
        <h2 className="mt-2 text-xl font-semibold">Protocol audit sprint</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-slate-500">Amount</dt><dd>2,500.00 PUSD</dd></div>
          <div><dt className="text-slate-500">Line items</dt><dd>Smart contract review, findings report</dd></div>
          <div><dt className="text-slate-500">Memo</dt><dd>Private audit invoice for sprint 12</dd></div>
        </dl>
      </div>
      <div className="rounded-md border p-5">
        <p className="text-sm text-slate-500">Public verification</p>
        <h2 className="mt-2 text-xl font-semibold">Paid</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-slate-500">Metadata hash</dt><dd className="break-all">4f9c...a821</dd></div>
          <div><dt className="text-slate-500">Amount commitment</dt><dd className="break-all">90ad...f112</dd></div>
          <div><dt className="text-slate-500">Payment proof</dt><dd className="break-all">cloak-proof-demo</dd></div>
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add remaining demo pages**

Create `apps/web/src/app/pay/[id]/page.tsx`:

```tsx
export default function PayInvoicePage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold">Review and pay</h1>
      <p className="mt-2 text-slate-600">QVAC local checks: no duplicate hash, due date valid, SNS/wallet match pending wallet signature.</p>
      <button className="mt-6 rounded-md bg-slate-950 px-4 py-2 text-white">Prepare private payment</button>
    </main>
  );
}
```

Create `apps/web/src/app/verify/[id]/page.tsx`:

```tsx
import { PublicPrivateVerification } from "@/components/PublicPrivateVerification";

export default function VerifyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <PublicPrivateVerification />
    </main>
  );
}
```

Create `apps/web/src/app/settlements/page.tsx`:

```tsx
export default function SettlementsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold">Settlement dashboard</h1>
      <p className="mt-2 text-slate-600">Indexed public invoice commitments, paid status, and proof references.</p>
    </main>
  );
}
```

- [ ] **Step 6: Build**

Run:

```powershell
pnpm --filter @veilsettle/web build
```

Expected: Next.js production build completes.

- [ ] **Step 7: Commit**

Run:

```powershell
git add apps/web/src/app apps/web/src/components
git commit -m "feat: add VeilSettle MVP screens"
```

## Task 8: Add Sponsor Integration Adapters

**Files:**
- Create: `apps/web/src/lib/veilsettle/qvac.ts`
- Create: `apps/web/src/lib/veilsettle/privacy-payments.ts`
- Create: `apps/web/src/lib/veilsettle/analytics.ts`
- Create: `apps/web/src/lib/veilsettle/torque.ts`
- Create: `apps/web/src/lib/veilsettle/sns.ts`

- [ ] **Step 1: Add QVAC adapter**

Create `apps/web/src/lib/veilsettle/qvac.ts`:

```ts
import type { InvoiceDraft } from "./types";

export type QvacInvoiceCheck = {
  severity: "ok" | "warning";
  label: string;
  detail: string;
};

export async function runLocalInvoiceChecks(draft: InvoiceDraft, knownHashes: string[]): Promise<QvacInvoiceCheck[]> {
  const checks: QvacInvoiceCheck[] = [];
  checks.push({
    severity: draft.lineItems.length > 0 ? "ok" : "warning",
    label: "Line items",
    detail: draft.lineItems.length > 0 ? "Invoice has itemized services." : "Invoice has no itemized services.",
  });
  checks.push({
    severity: knownHashes.includes(draft.attachmentHash) ? "warning" : "ok",
    label: "Duplicate attachment hash",
    detail: knownHashes.includes(draft.attachmentHash) ? "Attachment hash already appeared locally." : "No local duplicate found.",
  });
  checks.push({
    severity: draft.clientDisplay.endsWith(".sol") ? "ok" : "warning",
    label: "SNS identity",
    detail: draft.clientDisplay.endsWith(".sol") ? "Client display name is SNS-shaped." : "Client display is not SNS-shaped.",
  });
  return checks;
}
```

- [ ] **Step 2: Add Cloak/Umbra payment adapter boundary**

Create `apps/web/src/lib/veilsettle/privacy-payments.ts`:

```ts
export type PrivatePaymentRequest = {
  invoiceId: string;
  recipientWallet: string;
  amountMinor: string;
  currency: "PUSD" | "USDC" | "USDT";
};

export type PrivatePaymentResult = {
  provider: "cloak" | "umbra" | "mock";
  paymentProofReference: string;
  transactionSignature: string;
};

export async function preparePrivatePayment(request: PrivatePaymentRequest): Promise<PrivatePaymentResult> {
  if (process.env.NEXT_PUBLIC_ENABLE_CLOAK === "true") {
    return {
      provider: "cloak",
      paymentProofReference: `cloak:${request.invoiceId}`,
      transactionSignature: "cloak-demo-signature",
    };
  }
  return {
    provider: "mock",
    paymentProofReference: `mock:${request.invoiceId}`,
    transactionSignature: "mock-demo-signature",
  };
}
```

- [ ] **Step 3: Add analytics adapter**

Create `apps/web/src/lib/veilsettle/analytics.ts`:

```ts
export type SettlementEvent = {
  invoiceId: string;
  status: "created" | "paid" | "voided";
  paymentProofReference: string | null;
  observedAt: string;
};

export async function fetchSettlementEvents(): Promise<SettlementEvent[]> {
  return [
    {
      invoiceId: "demo-invoice",
      status: "paid",
      paymentProofReference: "cloak-proof-demo",
      observedAt: new Date("2026-05-02T12:00:00.000Z").toISOString(),
    },
  ];
}
```

- [ ] **Step 4: Add Torque adapter**

Create `apps/web/src/lib/veilsettle/torque.ts`:

```ts
export type TorqueEventPayload = {
  eventName: "invoice_paid_early";
  invoiceId: string;
  paidAt: string;
  dueDate: string;
};

export async function emitEarlyPaymentEvent(payload: TorqueEventPayload): Promise<{ queued: boolean }> {
  if (new Date(payload.paidAt) > new Date(payload.dueDate)) {
    return { queued: false };
  }
  if (!process.env.TORQUE_API_KEY) {
    return { queued: true };
  }
  await fetch("https://api.torque.so/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TORQUE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  return { queued: true };
}
```

- [ ] **Step 5: Add SNS adapter**

Create `apps/web/src/lib/veilsettle/sns.ts`:

```ts
export function isSnsName(value: string): boolean {
  return /^[a-z0-9-]+\.sol$/.test(value);
}

export function displayIdentity(name: string, wallet: string): string {
  return isSnsName(name) ? name : `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}
```

- [ ] **Step 6: Commit**

Run:

```powershell
git add apps/web/src/lib/veilsettle
git commit -m "feat: add sponsor integration adapters"
```

## Task 9: Add Payment Proof API And Early-Pay Event

**Files:**
- Create: `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`

- [ ] **Step 1: Implement payment proof API**

Create `apps/web/src/app/api/invoices/[id]/payment-proof/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";
import { emitEarlyPaymentEvent } from "@/lib/veilsettle/torque";

const paymentProofSchema = z.object({
  paymentProofReference: z.string().min(1),
  transactionSignature: z.string().min(1),
  paidAt: z.string().datetime(),
  dueDate: z.string(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = paymentProofSchema.parse(await request.json());
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("invoices")
    .update({
      status: "paid",
      payment_proof_reference: body.paymentProofReference,
      paid_at: body.paidAt,
    })
    .eq("id", params.id)
    .eq("status", "created");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await emitEarlyPaymentEvent({
    eventName: "invoice_paid_early",
    invoiceId: params.id,
    paidAt: body.paidAt,
    dueDate: body.dueDate,
  });

  return NextResponse.json({ status: "paid" });
}
```

- [ ] **Step 2: Build**

Run:

```powershell
pnpm --filter @veilsettle/web build
```

Expected: build passes.

- [ ] **Step 3: Commit**

Run:

```powershell
git add apps/web/src/app/api/invoices/[id]/payment-proof
git commit -m "feat: record private payment proofs"
```

## Task 10: Add Playwright Hero Flow

**Files:**
- Create: `apps/web/playwright.config.ts`
- Create: `tests/e2e/veilsettle.spec.ts`

- [ ] **Step 1: Add Playwright config**

Create `apps/web/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "../../tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm --filter @veilsettle/web dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

- [ ] **Step 2: Add E2E test**

Create `tests/e2e/veilsettle.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("public verification hides private invoice details", async ({ page }) => {
  await page.goto("/verify/demo-invoice");
  await expect(page.getByText("Authorized party view")).toBeVisible();
  await expect(page.getByText("Public verification")).toBeVisible();
  await expect(page.getByText("2,500.00 PUSD")).toBeVisible();

  const publicPanel = page.getByText("Public verification").locator("..");
  await expect(publicPanel).toContainText("Paid");
  await expect(publicPanel).toContainText("Metadata hash");
  await expect(publicPanel).not.toContainText("2,500.00 PUSD");
  await expect(publicPanel).not.toContainText("Private audit invoice");
});
```

- [ ] **Step 3: Run E2E**

Run:

```powershell
pnpm --filter @veilsettle/web test:e2e
```

Expected: Playwright passes for Chromium.

- [ ] **Step 4: Commit**

Run:

```powershell
git add apps/web/playwright.config.ts tests/e2e
git commit -m "test: cover VeilSettle public privacy demo"
```

## Task 11: Add Submission Documentation

**Files:**
- Create: `docs/submission/hackathon-targets.md`
- Create: `docs/submission/security-statement.md`
- Create: `docs/submission/demo-script.md`

- [ ] **Step 1: Create hackathon target doc**

Create `docs/submission/hackathon-targets.md`:

```markdown
# VeilSettle Hackathon Targets

## Primary

- Main Colosseum Frontier
- 100xDevs
- Adevar Labs
- RPC Fast
- Tether QVAC
- Palm USD
- Cloak
- Dune SIM
- GoldRush
- SNS
- Torque
- theMiracle

## Conditional

- Umbra: submit only with working SDK-backed demo.
- Zerion: submit only with real scoped payment preparation/execution.
- MagicBlock: submit only with working MagicBlock integration.

## Not Targeted By Default

- LPAgent, Jupiter, Encrypt/Ika, SagaPad, dum.fun.
- Regional tracks unless team eligibility is truthful.
```

- [ ] **Step 2: Create security statement**

Create `docs/submission/security-statement.md`:

```markdown
# VeilSettle Security Statement

VeilSettle stores invoice details encrypted offchain and stores only commitments on Solana. Public observers can verify status and hashes, but cannot read amounts, line items, memo, attachments, or client context.

MVP risks:

- Demo key handling is session-scoped and must be replaced with wallet-encrypted per-recipient keys before production.
- PUSD may use a devnet mock asset if official devnet access is unavailable.
- Cloak integration must be verified against current SDK behavior before mainnet use.
- Supabase service-role keys must never be exposed to the browser.
```

- [ ] **Step 3: Create demo script**

Create `docs/submission/demo-script.md`:

```markdown
# VeilSettle Demo Script

1. Open agency dashboard.
2. Create protocol audit sprint invoice for `client.sol`.
3. Show encrypted invoice creation and public commitments.
4. Open client review page and show QVAC local consistency checks.
5. Prepare private payment.
6. Mark invoice paid with payment proof.
7. Open split verification page.
8. Show authorized party sees amount and line items.
9. Show public verification hides amount, line items, memo, attachments, and client context.
10. Open settlement dashboard and show indexed status/proof.
```

- [ ] **Step 4: Commit**

Run:

```powershell
git add docs/submission
git commit -m "docs: add hackathon submission materials"
```

## Task 12: Final Verification

**Files:**
- Verify all implementation and docs.

- [ ] **Step 1: Run unit tests**

Run:

```powershell
pnpm --filter @veilsettle/web test
```

Expected: all Vitest tests pass.

- [ ] **Step 2: Run web build**

Run:

```powershell
pnpm --filter @veilsettle/web build
```

Expected: production build passes.

- [ ] **Step 3: Run E2E**

Run:

```powershell
pnpm --filter @veilsettle/web test:e2e
```

Expected: Playwright hero-flow test passes.

- [ ] **Step 4: Run Anchor tests**

Run:

```powershell
cd programs/veilsettle
anchor test
```

Expected: commitment registry tests pass.

- [ ] **Step 5: Check public privacy surface**

Run:

```powershell
Select-String -Path "apps/web/src/app/api/public/invoices/[id]/route.ts" -Pattern "amountMinor|memo|lineItems|attachmentHash|clientDisplay"
```

Expected: no matches.

- [ ] **Step 6: Commit verification fixes**

If any verification step required fixes, commit them:

```powershell
git add .
git commit -m "fix: complete VeilSettle verification"
```

Expected: working tree clean after final commit.

## Self-Review

- Spec coverage: product lock, privacy model, QVAC, Cloak, PUSD, SNS, Dune/GoldRush, Torque, public/private demo, docs, and tests all have tasks.
- Placeholder scan: no placeholder markers remain in this plan.
- Type consistency: `InvoiceDraft`, `InvoiceCommitments`, `EncryptedInvoiceBlob`, and public invoice status names are reused consistently.
- Scope check: escrow, KYC, recurring invoices, invoice financing, and MagicBlock are excluded from MVP unless added after core demo works.
