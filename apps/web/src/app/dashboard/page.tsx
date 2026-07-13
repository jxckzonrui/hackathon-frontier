import { BarChart3, FilePlus2, ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";
import { getIntegrationProviderStatuses } from "@/lib/veilsettle/integrations/status";

const metrics = [
  { label: "Created", value: "1", icon: FilePlus2 },
  { label: "Private fields exposed publicly", value: "0", icon: ShieldCheck },
  { label: "Early-pay rewards", value: "Ready", icon: WalletCards },
];

export default function DashboardPage() {
  const providerStatuses = getIntegrationProviderStatuses();

  return (
    <main className="min-h-screen bg-[#f6faf7] text-slate-950">
      <section className="bg-[#0b1714] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-md border border-white/20 bg-white/10 text-sm font-semibold text-emerald-300">
                  VS
                </span>
                <p className="text-sm font-semibold">VeilSettle</p>
              </div>
              <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-none tracking-normal md:text-6xl">
                Private stablecoin settlement
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
                Encrypted PUSD-denominated invoices, local payer review, Solana commitments, and
                public-safe settlement proof.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                href="/settlements"
              >
                <BarChart3 aria-hidden="true" className="size-4" />
                Settlements
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950"
                href="/invoices/new"
              >
                <FilePlus2 aria-hidden="true" className="size-4" />
                New invoice
              </Link>
            </nav>
          </header>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map(({ icon: Icon, label, value }) => (
            <article className="rounded-lg border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5" key={label}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-emerald-950/5">
          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-6">
              <p className="text-sm font-medium text-slate-500">Active invoice</p>
              <h2 className="mt-1 text-xl font-semibold">Protocol audit sprint</h2>
              <p className="mt-2 text-sm text-slate-600">
                Client `client.sol`, due 2026-05-08, receipt visibility restricted to authorized
                wallets.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  PUSD verified
                </span>
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Local Agent ready
                </span>
                <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Public leakage 0
                </span>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
              <div className="flex gap-2">
                <Link
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium"
                  href="/pay/demo-invoice"
                >
                  Client view
                </Link>
                <Link
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white"
                  href="/verify/demo-invoice"
                >
                  Verify
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-emerald-950/5">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Integration status</h2>
          </div>
          <div className="grid divide-y divide-slate-100 md:grid-cols-5 md:divide-x md:divide-y-0">
            {providerStatuses.map((provider) => (
              <article className="p-4" key={provider.id}>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  {provider.category}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-950">{provider.label}</h3>
                <p className="mt-2 text-xs text-slate-600">{provider.state}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
