"use client";

import { ArrowRight, FileLock2, Loader2, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const demoInvoice = {
  creatorWallet: "Agency111111111111111111111111111111111111",
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

export function InvoiceForm() {
  const [status, setStatus] = useState("Ready");
  const [isCreating, setIsCreating] = useState(false);

  async function createInvoice() {
    setIsCreating(true);
    setStatus("Creating encrypted invoice...");

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoInvoice),
      });
      const json = (await response.json()) as { invoiceId?: string; error?: string };

      if (!response.ok || !json.invoiceId) {
        setStatus(json.error ?? "Invoice creation failed");
        return;
      }

      setStatus(`Created invoice ${json.invoiceId}`);
    } catch {
      setStatus("Invoice creation failed");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <FileLock2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Protocol audit sprint</h2>
            <p className="text-sm text-slate-600">2,500.00 PUSD due 2026-05-08</p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_280px]">
        <div className="divide-y divide-slate-100">
          {demoInvoice.lineItems.map((item) => (
            <div className="flex items-center justify-between px-5 py-4" key={item.label}>
              <span className="text-sm font-medium text-slate-800">{item.label}</span>
              <span className="font-mono text-sm text-slate-600">
                {(Number(item.amountMinor) / 1_000_000).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                PUSD
              </span>
            </div>
          ))}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
              Private memo
            </p>
            <p className="mt-1 text-sm text-slate-700">{demoInvoice.memo}</p>
          </div>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-5 md:border-l md:border-t-0">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Client</span>
              <span className="font-medium text-slate-900">{demoInvoice.clientDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Public leakage</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <ShieldCheck aria-hidden="true" className="size-4" />
                0 fields
              </span>
            </div>
          </div>

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isCreating}
            onClick={createInvoice}
            type="button"
          >
            {isCreating ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
            Create encrypted invoice
          </button>
          <p className="mt-3 min-h-5 text-sm text-slate-600">{status}</p>
          <Link
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-950"
            href="/pay/demo-invoice"
          >
            Review client flow
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
