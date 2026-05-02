import { LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";

const checks = [
  "No duplicate metadata hash",
  "Due date is inside client approval window",
  "SNS label client.sol matches expected wallet pattern",
];

export default function PayInvoicePage() {
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
            <p className="text-sm font-semibold text-slate-900">QVAC local checks</p>
            <ul className="mt-3 grid gap-3">
              {checks.map((check) => (
                <li className="flex items-center gap-2 text-sm text-slate-700" key={check}>
                  <ShieldCheck aria-hidden="true" className="size-4 text-emerald-700" />
                  {check}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            type="button"
          >
            <WalletCards aria-hidden="true" className="size-4" />
            Prepare private payment
          </button>
        </section>
      </div>
    </main>
  );
}
