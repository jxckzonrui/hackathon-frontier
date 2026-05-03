import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";
import {
  createInvoiceRow,
  fetchPublicInvoiceRow,
  getSupabaseServerClient,
  storeEncryptedInvoiceBlob,
} from "./storage";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ from: vi.fn() })),
}));

const invoiceInsert = {
  creator_wallet: "Creator11111111111111111111111111111111111",
  payer_hash: "payer-hash",
  metadata_hash: "metadata-hash",
  amount_commitment: "amount-commitment",
  due_date_hash: "due-date-hash",
  status: "created" as const,
};

const encryptedBlobInsert = {
  invoice_id: "invoice-1",
  encrypted_blob: { schemaVersion: 1, ciphertext: "cipher", iv: "iv", recipients: [] },
  authorized_wallets: ["Creator11111111111111111111111111111111111"],
  blob_hash: "blob-hash",
};

describe("Supabase storage boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("rejects missing server environment before creating a client", () => {
    expect(() => getSupabaseServerClient()).toThrow("Missing Supabase environment variables");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("marks the service-role storage module as server-only", () => {
    const source = readFileSync("src/lib/veilsettle/storage.ts", "utf8");

    expect(source.startsWith('import "server-only";')).toBe(true);
  });

  it("creates an invoice row and returns the generated id", async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: "invoice-1" }, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const supabase = { from: vi.fn(() => ({ insert })) };

    await expect(createInvoiceRow(supabase, invoiceInsert)).resolves.toBe("invoice-1");

    expect(supabase.from).toHaveBeenCalledWith("invoices");
    expect(insert).toHaveBeenCalledWith(invoiceInsert);
    expect(select).toHaveBeenCalledWith("id");
  });

  it("stores encrypted invoice blobs separately from public invoice rows", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const supabase = { from: vi.fn(() => ({ insert })) };

    await expect(storeEncryptedInvoiceBlob(supabase, encryptedBlobInsert)).resolves.toBeUndefined();

    expect(supabase.from).toHaveBeenCalledWith("encrypted_invoice_blobs");
    expect(insert).toHaveBeenCalledWith(encryptedBlobInsert);
  });

  it("fetches the privacy-safe public invoice projection", async () => {
    const row = {
      id: "invoice-1",
      status: "created",
      metadata_hash: "metadata-hash",
      amount_commitment: "amount-commitment",
      due_date_hash: "due-date-hash",
      payment_proof_reference: null,
      created_at: "2026-05-02T00:00:00.000Z",
      paid_at: null,
    };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn(() => ({ single }));
    const select = vi.fn(() => ({ eq }));
    const supabase = { from: vi.fn(() => ({ select })) };

    await expect(fetchPublicInvoiceRow(supabase, "invoice-1")).resolves.toEqual(row);

    expect(supabase.from).toHaveBeenCalledWith("invoices");
    expect(select).toHaveBeenCalledWith(
      "id,status,metadata_hash,amount_commitment,due_date_hash,payment_proof_reference,created_at,paid_at",
    );
    expect(eq).toHaveBeenCalledWith("id", "invoice-1");
  });
});
