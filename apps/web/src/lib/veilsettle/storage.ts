import { createClient } from "@supabase/supabase-js";
import type { PublicInvoiceStatus } from "./types";

type StorageError = { message?: string } | null;
type StorageResult<T> = Promise<{ data: T | null; error: StorageError }>;

export type InvoiceRowInsert = {
  creator_wallet: string;
  payer_hash: string;
  metadata_hash: string;
  amount_commitment: string;
  due_date_hash: string;
  status: PublicInvoiceStatus;
};

export type EncryptedInvoiceBlobRowInsert = {
  invoice_id: string;
  encrypted_blob: unknown;
  authorized_wallets: string[];
  blob_hash: string;
};

export type PublicInvoiceRow = {
  id: string;
  status: PublicInvoiceStatus;
  metadata_hash: string;
  amount_commitment: string;
  due_date_hash: string;
  payment_proof_reference: string | null;
  created_at: string;
  paid_at: string | null;
};

type InvoiceInsertClient = {
  from(table: "invoices"): {
    insert(row: InvoiceRowInsert): {
      select(columns: "id"): {
        single<T>(): StorageResult<T>;
      };
    };
  };
};

type BlobInsertClient = {
  from(table: "encrypted_invoice_blobs"): {
    insert(row: EncryptedInvoiceBlobRowInsert): Promise<{ error: StorageError }>;
  };
};

type PublicInvoiceFetchClient = {
  from(table: "invoices"): {
    select(columns: string): {
      eq(column: "id", value: string): {
        single<T>(): StorageResult<T>;
      };
    };
  };
};

const publicInvoiceProjection =
  "id,status,metadata_hash,amount_commitment,due_date_hash,payment_proof_reference,created_at,paid_at";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function createInvoiceRow(
  supabase: InvoiceInsertClient,
  invoice: InvoiceRowInsert,
): Promise<string> {
  const { data, error } = await supabase.from("invoices").insert(invoice).select("id").single<{
    id: string;
  }>();

  if (error || !data) {
    throw new Error("Failed to create invoice");
  }

  return data.id;
}

export async function storeEncryptedInvoiceBlob(
  supabase: BlobInsertClient,
  blob: EncryptedInvoiceBlobRowInsert,
): Promise<void> {
  const { error } = await supabase.from("encrypted_invoice_blobs").insert(blob);

  if (error) {
    throw new Error("Failed to store invoice blob");
  }
}

export async function fetchPublicInvoiceRow(
  supabase: PublicInvoiceFetchClient,
  invoiceId: string,
): Promise<PublicInvoiceRow> {
  const { data, error } = await supabase
    .from("invoices")
    .select(publicInvoiceProjection)
    .eq("id", invoiceId)
    .single<PublicInvoiceRow>();

  if (error || !data) {
    throw new Error("Invoice not found");
  }

  return data;
}
