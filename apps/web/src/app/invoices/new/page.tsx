import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="min-h-screen bg-[#f6faf7] text-slate-950">
      <section className="bg-[#0b1714] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md border border-white/20 bg-white/10 text-sm font-semibold text-emerald-300">
              VS
            </span>
            <span className="text-sm font-semibold">VeilSettle</span>
          </div>
          <p className="mt-10 text-sm font-medium text-emerald-200/80">New invoice</p>
          <h1 className="mt-2 max-w-3xl text-5xl font-semibold leading-none tracking-normal md:text-6xl">
            Create encrypted invoice
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
            Issue a PUSD-denominated request with private commercial terms and a public-safe
            receipt path.
          </p>
        </div>
      </section>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
        <InvoiceForm />
      </div>
    </main>
  );
}
