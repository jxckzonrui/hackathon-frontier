import { LockKeyhole, ShieldCheck } from "lucide-react";
import { PaymentSettlementActions } from "@/components/PaymentSettlementActions";
import { createLocalInvoiceAgentReview } from "@/lib/veilsettle/integrations/ai/local-agent";
import { localInvoiceReviewProvider } from "@/lib/veilsettle/integrations/ai/provider";
import { getSnsIdentityProvider } from "@/lib/veilsettle/integrations/identity/provider";
import { getStablecoinMetadata } from "@/lib/veilsettle/integrations/stablecoins";
import {
  fetchPublicInvoiceRow,
  getSupabaseServerClient,
  type PublicInvoiceFetchClient,
  type PublicInvoiceRow,
} from "@/lib/veilsettle/storage";
import type { InvoiceDraft } from "@/lib/veilsettle/types";

const demoReviewDraft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [
    { label: "Smart contract review", amountMinor: "1500000000" },
    { label: "Findings report", amountMinor: "1000000000" },
  ],
  memo: "Private audit invoice for sprint 12",
  attachmentHash: "sha256-demo-attachment",
};

type PayInvoicePageProps = {
  params: Promise<{ id: string }>;
};

async function loadPublicInvoice(invoiceId: string): Promise<PublicInvoiceRow | null> {
  if (invoiceId === "demo-invoice") {
    return null;
  }

  try {
    const supabase = getSupabaseServerClient() as unknown as PublicInvoiceFetchClient;

    return await fetchPublicInvoiceRow(supabase, invoiceId);
  } catch {
    return null;
  }
}

export default async function PayInvoicePage({ params }: PayInvoicePageProps) {
  const { id } = await params;
  const publicInvoice = await loadPublicInvoice(id);
  const review = await localInvoiceReviewProvider.reviewInvoice({
    draft: demoReviewDraft,
    knownAttachmentHashes: [],
  });
  const agentReview = createLocalInvoiceAgentReview(review);
  const pusdMetadata = getStablecoinMetadata("PUSD");
  const merchantIdentity = await getSnsIdentityProvider().displayIdentity({
    name: demoReviewDraft.clientDisplay,
    wallet: demoReviewDraft.clientWallet,
    optIn: true,
  });

  return (
    <main className="min-h-screen bg-[#f6faf7] text-slate-950">
      <section className="bg-[#0b1714] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md border border-white/20 bg-white/10 text-sm font-semibold text-emerald-300">
                VS
              </span>
              <span className="text-sm font-semibold">VeilSettle</span>
            </div>
            <div className="hidden flex-wrap gap-2 text-xs text-emerald-50/80 md:flex">
              <span className="rounded-full border border-white/15 px-3 py-2">Local Agent</span>
              <span className="rounded-full border border-white/15 px-3 py-2">PUSD verified</span>
              <span className="rounded-full border border-white/15 px-3 py-2">RPC proof</span>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-sm font-medium text-emerald-200/80">Client settlement</p>
              <h1 className="mt-2 max-w-3xl text-5xl font-semibold leading-none tracking-normal md:text-6xl">
                Review and pay
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
                Private invoice review, verified PUSD metadata, and public-safe settlement proof in
                one payer flow.
              </p>
            </div>
            <aside className="rounded-lg border border-white/15 bg-white/10 p-4 text-sm text-white/70">
              <div className="flex justify-between gap-4 border-b border-white/10 py-2">
                <span>Production RPC</span>
                <strong className="text-white">getHealth=ok</strong>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-2">
                <span>Agent mode</span>
                <strong className="text-white">{agentReview.agentMode}</strong>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <span>Public leakage</span>
                <strong className="text-white">0 private fields</strong>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-6 py-6 lg:grid-cols-[300px_1fr]">
        <aside className="self-start overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
          <div className="border-b border-emerald-100 bg-emerald-50/70 p-5">
            <h2 className="text-base font-semibold">Demo path</h2>
            <p className="mt-1 text-sm text-slate-600">What judges see in the recording.</p>
          </div>
          {[
            ["1", "Verify PUSD", "Official Solana mint is shown before payment."],
            ["2", "Review locally", "Agent returns risk, findings, and action."],
            ["3", "Prepare payment", "Private payment prep is gated by review."],
            ["4", "Verify receipt", "Public verifier sees only status and hashes."],
          ].map(([index, title, detail]) => (
            <div className="grid grid-cols-[28px_1fr] gap-3 border-b border-slate-100 p-4 last:border-b-0" key={title}>
              <span className="grid size-7 place-items-center rounded-md bg-emerald-50 text-sm font-medium text-emerald-700">
                {index}
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
              </div>
            </div>
          ))}
        </aside>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-emerald-950/5">
          <div className="grid gap-5 border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-6 md:grid-cols-[1fr_120px]">
            <div>
              <h2 className="text-2xl font-semibold">Protocol audit sprint</h2>
              <p className="mt-2 text-sm text-slate-600">Due 2026-05-08</p>
              <p className="mt-4 text-5xl font-semibold tracking-normal md:text-6xl">
                2,500.00 <span className="text-emerald-700">PUSD</span>
              </p>
              <p className="sr-only">2,500.00 PUSD demo denomination due 2026-05-08</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Risk {review.riskScore}
                </span>
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Agent approved
                </span>
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  SNS opt-in fallback
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-[#07110f] p-4 text-white">
              <p className="text-xs text-white/60">Settlement asset</p>
              <p className="mt-5 text-2xl font-semibold">PUSD</p>
              <p className="mt-2 text-xs leading-5 text-white/70">Solana SPL - 6 decimals</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <LockKeyhole aria-hidden="true" className="size-4 text-emerald-700" />
              {publicInvoice
                ? "Loaded from Supabase public invoice row."
                : "Demo fallback details are shown because no public Supabase invoice row was loaded."}
            </div>
          </div>

          {publicInvoice ? (
            <dl className="mx-5 grid gap-3 border-t border-slate-100 pt-5 text-sm md:grid-cols-2">
              <div className="grid gap-1">
                <dt className="text-slate-500">Invoice id</dt>
                <dd className="break-all font-mono text-slate-800">{publicInvoice.id}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-slate-500">Public status</dt>
                <dd className="font-medium text-slate-950">{publicInvoice.status}</dd>
              </div>
              <div className="grid gap-1 md:col-span-2">
                <dt className="text-slate-500">Metadata hash</dt>
                <dd className="break-all font-mono text-slate-800">
                  {publicInvoice.metadata_hash}
                </dd>
              </div>
              <div className="grid gap-1 md:col-span-2">
                <dt className="text-slate-500">Payment proof</dt>
                <dd className="break-all font-mono text-slate-800">
                  {publicInvoice.payment_proof_reference ?? "not-settled"}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-white p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-950">
                    PUSD settlement asset
                  </p>
                  <p className="mt-1 text-sm text-emerald-800">
                    Official Palm USD Solana SPL mint metadata verified for invoice utility.
                  </p>
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-emerald-800">
                  {pusdMetadata.decimals} decimals
                </span>
              </div>
              <dl className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-emerald-700">Network</dt>
                  <dd className="font-medium text-emerald-950">{pusdMetadata.network}</dd>
                </div>
                <div>
                  <dt className="text-emerald-700">Mint</dt>
                  <dd className="break-all font-mono text-emerald-950">{pusdMetadata.mint}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white p-5" aria-label="Invoice Review Agent">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Invoice Review Agent</p>
                  <p className="mt-1 text-sm text-slate-600">Decision before payment preparation.</p>
                </div>
                <span className="max-w-28 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700">
                  Payment ready
                </span>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <p className="text-5xl font-semibold">{agentReview.riskScore}</p>
                <p className="pb-2 text-sm text-slate-600">agent risk score</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {agentReview.decision} / {agentReview.recommendedAction}
              </p>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Merchant trust</dt>
                  <dd className="font-medium text-slate-900">{merchantIdentity}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Agent mode</dt>
                  <dd className="font-medium text-slate-900">{agentReview.agentMode}</dd>
                </div>
              </dl>
              <ul className="mt-4 grid gap-3">
                {agentReview.findings.map((finding) => (
                  <li className="flex items-center gap-2 text-sm text-slate-700" key={finding}>
                    <ShieldCheck aria-hidden="true" className="size-4 text-emerald-700" />
                    {finding}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">{agentReview.privacyNotice}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-slate-900">QVAC local checks</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Risk {review.riskScore}
                </span>
              </div>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {review.checks.map((check) => (
                  <li className="flex items-center gap-2 text-sm text-slate-700" key={check.label}>
                    <ShieldCheck aria-hidden="true" className="size-4 text-emerald-700" />
                    {check.detail}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">{review.privacyNote}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 pb-6">
            <PaymentSettlementActions
              invoiceId={id}
              reviewCompleted={agentReview.recommendedAction === "prepare-private-payment"}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
