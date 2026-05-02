import { beforeEach, describe, expect, it, vi } from "vitest";

const singleMock = vi.fn();
const insertMock = vi.fn();
const deleteEqMock = vi.fn();
const deleteMock = vi.fn(() => ({ eq: deleteEqMock }));
const eqMock = vi.fn(() => ({ single: singleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ delete: deleteMock, insert: insertMock, select: selectMock }));
const getSupabaseServerClientMock = vi.fn(() => ({
  from: fromMock,
}));

vi.mock("@/lib/veilsettle/storage", () => ({
  getSupabaseServerClient: getSupabaseServerClientMock,
}));

const invoiceDraft = {
  creatorWallet: "Creator11111111111111111111111111111111111",
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Private memo",
  attachmentHash: "sha256-demo-attachment",
};

describe("invoice API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSupabaseServerClientMock.mockImplementation(() => ({
      from: fromMock,
    }));
  });

  it("stores private invoice details only in the encrypted blob row", async () => {
    const { POST } = await import("./route");
    insertMock
      .mockReturnValueOnce({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "invoice-1" }, error: null }),
        }),
      })
      .mockResolvedValueOnce({ error: null });

    const response = await POST(
      new Request("http://localhost/api/invoices", {
        method: "POST",
        body: JSON.stringify(invoiceDraft),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.invoiceId).toBe("invoice-1");
    expect(payload).not.toHaveProperty("amountMinor");
    expect(payload).not.toHaveProperty("memo");
    expect(payload).not.toHaveProperty("lineItems");

    expect(fromMock).toHaveBeenNthCalledWith(1, "invoices");
    expect(fromMock).toHaveBeenNthCalledWith(2, "encrypted_invoice_blobs");
    const invoiceInsert = insertMock.mock.calls[0][0];
    expect(invoiceInsert).toMatchObject({
      creator_wallet: invoiceDraft.creatorWallet,
      status: "created",
    });
    expect(invoiceInsert).not.toHaveProperty("amountMinor");
    expect(invoiceInsert).not.toHaveProperty("memo");
    expect(invoiceInsert).not.toHaveProperty("lineItems");
    expect(invoiceInsert).not.toHaveProperty("attachmentHash");
    expect(invoiceInsert).not.toHaveProperty("clientDisplay");

    const blobInsert = insertMock.mock.calls[1][0];
    expect(blobInsert).toMatchObject({
      invoice_id: "invoice-1",
      authorized_wallets: [invoiceDraft.creatorWallet, invoiceDraft.clientWallet],
    });
    expect(blobInsert.encrypted_blob.ciphertext).not.toContain(invoiceDraft.memo);
    expect(blobInsert.encrypted_blob.ciphertext).not.toContain(invoiceDraft.amountMinor);
  });

  it("deletes the invoice row when encrypted blob storage fails", async () => {
    const { POST } = await import("./route");
    insertMock
      .mockReturnValueOnce({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "invoice-1" }, error: null }),
        }),
      })
      .mockResolvedValueOnce({ error: { message: "blob insert failed" } });
    deleteEqMock.mockResolvedValueOnce({ error: null });

    const response = await POST(
      new Request("http://localhost/api/invoices", {
        method: "POST",
        body: JSON.stringify(invoiceDraft),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Failed to store invoice blob" });
    expect(fromMock).toHaveBeenNthCalledWith(3, "invoices");
    expect(deleteMock).toHaveBeenCalledOnce();
    expect(deleteEqMock).toHaveBeenCalledWith("id", "invoice-1");
  });

  it("returns controlled JSON when create route storage is not configured", async () => {
    const { POST } = await import("./route");
    getSupabaseServerClientMock.mockImplementationOnce(() => {
      throw new Error("Missing Supabase environment variables");
    });

    const response = await POST(
      new Request("http://localhost/api/invoices", {
        method: "POST",
        body: JSON.stringify(invoiceDraft),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Server configuration error" });
  });

  it("public invoice response excludes private and encrypted fields", async () => {
    const { GET } = await import("../public/invoices/[id]/route");
    singleMock.mockResolvedValueOnce({
      data: {
        id: "invoice-1",
        status: "created",
        metadata_hash: "metadata-hash",
        amount_commitment: "amount-commitment",
        due_date_hash: "due-date-hash",
        payment_proof_reference: null,
        created_at: "2026-05-02T00:00:00.000Z",
        paid_at: null,
      },
      error: null,
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "invoice-1" }),
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({
      id: "invoice-1",
      status: "created",
      metadata_hash: "metadata-hash",
      amount_commitment: "amount-commitment",
      due_date_hash: "due-date-hash",
      payment_proof_reference: null,
      created_at: "2026-05-02T00:00:00.000Z",
      paid_at: null,
    });
    expect(JSON.stringify(payload)).not.toContain("Private memo");
  });

  it("returns controlled JSON when public route storage is not configured", async () => {
    const { GET } = await import("../public/invoices/[id]/route");
    getSupabaseServerClientMock.mockImplementationOnce(() => {
      throw new Error("Missing Supabase environment variables");
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "invoice-1" }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Server configuration error" });
  });

  it("authorized invoice route rejects missing and unauthorized wallets", async () => {
    const { GET } = await import("./[id]/route");

    const missingWalletResponse = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "invoice-1" }),
    });
    expect(missingWalletResponse.status).toBe(401);

    singleMock.mockResolvedValueOnce({
      data: {
        id: "invoice-1",
        status: "created",
        metadata_hash: "metadata-hash",
        amount_commitment: "amount-commitment",
        due_date_hash: "due-date-hash",
        payment_proof_reference: null,
        created_at: "2026-05-02T00:00:00.000Z",
        paid_at: null,
        encrypted_invoice_blobs: {
          encrypted_blob: { schemaVersion: 1, ciphertext: "cipher", iv: "iv", recipients: [] },
          authorized_wallets: ["Creator11111111111111111111111111111111111"],
          blob_hash: "blob-hash",
        },
      },
      error: null,
    });

    const unauthorizedResponse = await GET(
      new Request("http://localhost", {
        headers: { "x-veilsettle-wallet": "Intruder1111111111111111111111111111111111" },
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(unauthorizedResponse.status).toBe(403);
  });

  it("returns controlled JSON when authorized route storage is not configured", async () => {
    const { GET } = await import("./[id]/route");
    getSupabaseServerClientMock.mockImplementationOnce(() => {
      throw new Error("Missing Supabase environment variables");
    });

    const response = await GET(
      new Request("http://localhost", {
        headers: { "x-veilsettle-wallet": invoiceDraft.creatorWallet },
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Server configuration error" });
  });

  it("returns encrypted blob for an authorized wallet", async () => {
    const { GET } = await import("./[id]/route");
    singleMock.mockResolvedValueOnce({
      data: {
        id: "invoice-1",
        status: "created",
        metadata_hash: "metadata-hash",
        amount_commitment: "amount-commitment",
        due_date_hash: "due-date-hash",
        payment_proof_reference: null,
        created_at: "2026-05-02T00:00:00.000Z",
        paid_at: null,
        encrypted_invoice_blobs: {
          encrypted_blob: { schemaVersion: 1, ciphertext: "cipher", iv: "iv", recipients: [] },
          authorized_wallets: [invoiceDraft.creatorWallet],
          blob_hash: "blob-hash",
        },
      },
      error: null,
    });

    const response = await GET(
      new Request("http://localhost", {
        headers: { "x-veilsettle-wallet": invoiceDraft.creatorWallet },
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: "invoice-1",
      encrypted_blob: { schemaVersion: 1, ciphertext: "cipher", iv: "iv", recipients: [] },
      authorized_wallets: [invoiceDraft.creatorWallet],
      blob_hash: "blob-hash",
    });
  });
});
