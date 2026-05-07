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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-medium text-slate-500">Client settlement</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">Review and pay</h1>
        </header>

        <section className="border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Protocol audit sprint</h2>
              <p className="mt-1 text-sm text-slate-600">
                2,500.00 PUSD demo denomination due 2026-05-08
              </p>
              {publicInvoice ? (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Loaded from Supabase public invoice row
                </p>
              ) : null}
            </div>
            <span className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>
          </div>
          {publicInvoice ? (
            <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-5 text-sm md:grid-cols-2">
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
          ) : (
            <p className="mt-5 border-t border-slate-100 pt-5 text-xs text-slate-500">
              Demo fallback details are shown because no public Supabase invoice row was loaded.
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-5 border border-emerald-100 bg-emerald-50 p-4">
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

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-900">QVAC local checks</p>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Risk {review.riskScore}
              </span>
            </div>
            <ul className="mt-3 grid gap-3">
              {review.checks.map((check) => (
                <li className="flex items-center gap-2 text-sm text-slate-700" key={check.label}>
                  <ShieldCheck aria-hidden="true" className="size-4 text-emerald-700" />
                  {check.detail}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">{review.privacyNote}</p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5" aria-label="Invoice Review Agent">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Invoice Review Agent</p>
                <p className="mt-1 text-sm text-slate-600">
                  {agentReview.decision} / {agentReview.recommendedAction}
                </p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {agentReview.agentMode}
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-slate-500">Merchant trust</dt>
                <dd className="font-medium text-slate-900">{merchantIdentity}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Agent risk score</dt>
                <dd className="font-medium text-slate-900">{agentReview.riskScore}</dd>
              </div>
            </dl>
            <ul className="mt-3 grid gap-3">
              {agentReview.findings.map((finding) => (
                <li className="flex items-center gap-2 text-sm text-slate-700" key={finding}>
                  <ShieldCheck aria-hidden="true" className="size-4 text-slate-600" />
                  {finding}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">{agentReview.privacyNotice}</p>
          </div>

          <PaymentSettlementActions
            invoiceId={id}
            reviewCompleted={agentReview.recommendedAction === "prepare-private-payment"}
          />
        </section>
      </div>
    </main>
  );
}
