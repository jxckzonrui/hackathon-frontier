import { NextResponse } from "next/server";
import { z } from "zod";
import { createInvoiceCommitments } from "@/lib/veilsettle/commitments";
import { encryptInvoiceBlob } from "@/lib/veilsettle/encryption";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";

const invoiceSchema = z.object({
  creatorWallet: z.string().min(32),
  clientDisplay: z.string().min(1),
  clientWallet: z.string().min(32),
  amountMinor: z.string().regex(/^\d+$/),
  currency: z.enum(["PUSD", "USDC", "USDT"]),
  dueDate: z.string().min(10),
  serviceTitle: z.string().min(1),
  lineItems: z
    .array(
      z.object({
        label: z.string().min(1),
        amountMinor: z.string().regex(/^\d+$/),
      }),
    )
    .min(1),
  memo: z.string(),
  attachmentHash: z.string(),
});

const textEncoder = new TextEncoder();

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function POST(request: Request) {
  const parsed = invoiceSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice payload" }, { status: 400 });
  }

  let supabase: ReturnType<typeof getSupabaseServerClient>;

  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = parsed.data;
  const commitments = await createInvoiceCommitments(body);
  const authorizedWallets = [body.creatorWallet, body.clientWallet];
  const encryptedBlob = await encryptInvoiceBlob(body, authorizedWallets);
  const blobHash = await sha256Hex(JSON.stringify(encryptedBlob));

  try {
    const invoiceInsert = await supabase
      .from("invoices")
      .insert({
        creator_wallet: body.creatorWallet,
        payer_hash: commitments.payerHash,
        metadata_hash: commitments.metadataHash,
        amount_commitment: commitments.amountCommitment,
        due_date_hash: commitments.dueDateHash,
        status: "created",
      })
      .select("id")
      .single();

    if (invoiceInsert.error || !invoiceInsert.data) {
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    const blobInsert = await supabase.from("encrypted_invoice_blobs").insert({
      invoice_id: invoiceInsert.data.id,
      encrypted_blob: encryptedBlob,
      authorized_wallets: authorizedWallets,
      blob_hash: blobHash,
    });

    if (blobInsert.error) {
      await supabase.from("invoices").delete().eq("id", invoiceInsert.data.id);

      return NextResponse.json({ error: "Failed to store invoice blob" }, { status: 500 });
    }

    return NextResponse.json({
      invoiceId: invoiceInsert.data.id,
      commitments,
    });
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
