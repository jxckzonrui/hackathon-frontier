import { beforeEach, describe, expect, it, vi } from "vitest";

const eqStatusMock = vi.fn();
const eqIdMock = vi.fn(() => ({ eq: eqStatusMock }));
const updateMock = vi.fn(() => ({ eq: eqIdMock }));
const fromMock = vi.fn(() => ({ update: updateMock }));
const getSupabaseServerClientMock = vi.fn(() => ({ from: fromMock }));
const emitEarlyPaymentEventMock = vi.fn();

vi.mock("@/lib/veilsettle/storage", () => ({
  getSupabaseServerClient: getSupabaseServerClientMock,
}));

vi.mock("@/lib/veilsettle/torque", () => ({
  emitEarlyPaymentEvent: emitEarlyPaymentEventMock,
}));

const validPayload = {
  paymentProofReference: "cloak-proof-demo",
  transactionSignature: "cloak-demo-signature",
  paidAt: "2026-05-07T12:00:00.000Z",
  dueDate: "2026-05-08",
};

describe("payment proof API route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSupabaseServerClientMock.mockImplementation(() => ({ from: fromMock }));
    eqStatusMock.mockResolvedValue({ error: null });
    emitEarlyPaymentEventMock.mockResolvedValue({ queued: true });
  });

  it("marks a created invoice paid and emits early payment event", async () => {
    const { POST } = await import("./[id]/payment-proof/route");

    const response = await POST(
      new Request("http://localhost/api/invoices/invoice-1/payment-proof", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "paid" });
    expect(fromMock).toHaveBeenCalledWith("invoices");
    expect(updateMock).toHaveBeenCalledWith({
      status: "paid",
      payment_proof_reference: "cloak-proof-demo",
      paid_at: "2026-05-07T12:00:00.000Z",
    });
    expect(eqIdMock).toHaveBeenCalledWith("id", "invoice-1");
    expect(eqStatusMock).toHaveBeenCalledWith("status", "created");
    expect(emitEarlyPaymentEventMock).toHaveBeenCalledWith({
      eventName: "invoice_paid_early",
      invoiceId: "invoice-1",
      paidAt: "2026-05-07T12:00:00.000Z",
      dueDate: "2026-05-08",
    });
  });

  it("returns controlled JSON for invalid payment proof payloads", async () => {
    const { POST } = await import("./[id]/payment-proof/route");

    const response = await POST(
      new Request("http://localhost/api/invoices/invoice-1/payment-proof", {
        method: "POST",
        body: JSON.stringify({ paymentProofReference: "" }),
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid payment proof payload" });
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("returns controlled JSON when storage is not configured", async () => {
    const { POST } = await import("./[id]/payment-proof/route");
    getSupabaseServerClientMock.mockImplementationOnce(() => {
      throw new Error("Missing Supabase environment variables");
    });

    const response = await POST(
      new Request("http://localhost/api/invoices/invoice-1/payment-proof", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
      { params: Promise.resolve({ id: "invoice-1" }) },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Server configuration error" });
  });
});
