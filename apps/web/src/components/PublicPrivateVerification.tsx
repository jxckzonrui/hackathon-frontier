import { EyeOff, FileCheck2, LockKeyhole, ReceiptText } from "lucide-react";

export function PublicPrivateVerification() {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <article
        aria-label="Authorized party view"
        className="border border-slate-200 bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <ReceiptText aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500">Authorized party view</p>
            <h2 className="text-xl font-semibold text-slate-950">Protocol audit sprint</h2>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 text-sm">
          <div className="grid gap-1">
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-medium text-slate-950">2,500.00 PUSD</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-slate-500">Line items</dt>
            <dd className="text-slate-800">Smart contract review, findings report</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-slate-500">Memo</dt>
            <dd className="text-slate-800">Private audit invoice for sprint 12</dd>
          </div>
        </dl>
      </article>

      <article aria-label="Public verification" className="border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <FileCheck2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500">Public verification</p>
            <h2 className="text-xl font-semibold text-slate-950">Paid</h2>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 text-sm">
          <div className="grid gap-1">
            <dt className="text-slate-500">Metadata hash</dt>
            <dd className="break-all font-mono text-slate-800">4f9c7b18...a821</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-slate-500">Amount commitment</dt>
            <dd className="break-all font-mono text-slate-800">90ad42fe...f112</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-slate-500">Payment proof</dt>
            <dd className="break-all font-mono text-slate-800">cloak-proof-demo</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <EyeOff aria-hidden="true" className="size-4 text-emerald-700" />
          <span>Amount, memo, line items, attachments, and client context remain hidden.</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <LockKeyhole aria-hidden="true" className="size-4 text-emerald-700" />
          <span>Selective reveal receipt issued to authorized wallets.</span>
        </div>
      </article>
    </section>
  );
}
