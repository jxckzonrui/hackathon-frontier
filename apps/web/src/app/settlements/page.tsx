import { Activity, Database, ReceiptText } from "lucide-react";
import { getSettlementDataProvider } from "@/lib/veilsettle/integrations/data/provider";

export default async function SettlementsPage() {
  const analytics = await getSettlementDataProvider().fetchSettlementAnalytics();
  const sourceLabel = analytics.source === "dune-sim" ? "Dune SIM" : "Static fallback";
  const rows = analytics.events.map((event) => ({
    invoice: event.invoiceHash,
    status: event.status,
    source: sourceLabel,
    proof: event.paymentProofReference ?? "pending",
  }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-medium text-slate-500">Onchain status</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">Settlement dashboard</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="border border-slate-200 bg-white p-4">
            <Database aria-hidden="true" className="size-5 text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">Dune SIM events</p>
            <p className="mt-1 text-2xl font-semibold">{analytics.events.length}</p>
          </article>
          <article className="border border-slate-200 bg-white p-4">
            <ReceiptText aria-hidden="true" className="size-5 text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">GoldRush proofs</p>
            <p className="mt-1 text-2xl font-semibold">Pending</p>
          </article>
          <article className="border border-slate-200 bg-white p-4">
            <Activity aria-hidden="true" className="size-5 text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">Torque rewards</p>
            <p className="mt-1 text-2xl font-semibold">Queued</p>
          </article>
        </section>

        <section className="overflow-hidden border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.invoice}>
                  <td className="px-4 py-3 font-mono text-slate-800">{row.invoice}</td>
                  <td className="px-4 py-3 text-slate-800">{row.status}</td>
                  <td className="px-4 py-3 text-slate-800">{row.source}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">{row.proof}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
