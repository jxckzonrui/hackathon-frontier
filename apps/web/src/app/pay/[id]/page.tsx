import { LockKeyhole, ShieldCheck } from "lucide-react";
import { PaymentSettlementActions } from "@/components/PaymentSettlementActions";
import { localInvoiceReviewProvider } from "@/lib/veilsettle/integrations/ai/provider";
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

export default async function PayInvoicePage({ params }: PayInvoicePageProps) {
  const { id } = await params;
  const review = await localInvoiceReviewProvider.reviewInvoice({
    draft: demoReviewDraft,
    knownAttachmentHashes: [],
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
              <p className="mt-1 text-sm text-slate-600">2,500.00 PUSD due 2026-05-08</p>
            </div>
            <span className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
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

          <PaymentSettlementActions invoiceId={id} />
        </section>
      </div>
    </main>
  );
}
