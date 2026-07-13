import { PublicPrivateVerification } from "@/components/PublicPrivateVerification";
import {
  fetchPublicInvoiceRow,
  getSupabaseServerClient,
  type PublicInvoiceFetchClient,
  type PublicInvoiceRow,
} from "@/lib/veilsettle/storage";

type VerifyPageProps = {
  params?: Promise<{ id: string }>;
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

export default async function VerifyPage({ params }: VerifyPageProps = {}) {
  const { id } = params ? await params : { id: "demo-invoice" };
  const publicInvoice = await loadPublicInvoice(id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-medium text-slate-500">Receipt verification</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">Selective reveal receipt</h1>
        </header>
        <PublicPrivateVerification publicInvoice={publicInvoice} />
      </div>
    </main>
  );
}
