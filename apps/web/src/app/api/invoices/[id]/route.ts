import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type EncryptedBlobRow = {
  encrypted_blob: unknown;
  authorized_wallets: string[];
  blob_hash: string;
};

type InvoiceWithBlob = {
  id: string;
  status: string;
  metadata_hash: string;
  amount_commitment: string;
  due_date_hash: string;
  payment_proof_reference: string | null;
  created_at: string;
  paid_at: string | null;
  encrypted_invoice_blobs: EncryptedBlobRow | EncryptedBlobRow[] | null;
};

function getBlobRow(invoice: InvoiceWithBlob): EncryptedBlobRow | null {
  const blob = invoice.encrypted_invoice_blobs;

  if (Array.isArray(blob)) {
    return blob[0] ?? null;
  }

  return blob;
}

export async function GET(request: Request, context: RouteContext) {
  const wallet = request.headers.get("x-veilsettle-wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Missing wallet identity" }, { status: 401 });
  }

  const { id } = await context.params;
  let data: InvoiceWithBlob | null;
  let error: unknown;

  try {
    const supabase = getSupabaseServerClient();
    const result = await supabase
      .from("invoices")
      .select(
        "id,status,metadata_hash,amount_commitment,due_date_hash,payment_proof_reference,created_at,paid_at,encrypted_invoice_blobs(encrypted_blob,authorized_wallets,blob_hash)",
      )
      .eq("id", id)
      .single<InvoiceWithBlob>();

    data = result.data;
    error = result.error;
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (error || !data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const blob = getBlobRow(data);

  if (!blob) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (!blob.authorized_wallets.includes(wallet)) {
    return NextResponse.json({ error: "Wallet not authorized" }, { status: 403 });
  }

  return NextResponse.json({
    id: data.id,
    status: data.status,
    metadata_hash: data.metadata_hash,
    amount_commitment: data.amount_commitment,
    due_date_hash: data.due_date_hash,
    payment_proof_reference: data.payment_proof_reference,
    created_at: data.created_at,
    paid_at: data.paid_at,
    encrypted_blob: blob.encrypted_blob,
    authorized_wallets: blob.authorized_wallets,
    blob_hash: blob.blob_hash,
  });
}
