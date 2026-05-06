import { beforeEach, describe, expect, it, vi } from "vitest";

const preparePaymentMock = vi.fn();
const quotePaymentMock = vi.fn();

vi.mock("@/lib/veilsettle/integrations/privacy/provider", () => ({
  getPrivatePaymentProvider: () => ({
    quotePayment: quotePaymentMock,
    preparePayment: preparePaymentMock,
    status: () => ({
      category: "privacy",
      id: "magicblock-private-payments",
      label: "MagicBlock Private Payments",
      state: "configured",
      publicSafe: true,
      detail: "Builds unsigned private SPL transfers.",
    }),
  }),
}));

const validPayload = {
  invoiceId: "invoice-1",
  senderWallet: "Sender1111111111111111111111111111111111111",
  recipientWallet: "Merchant11111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "USDC",
  cluster: "devnet",
};

describe("private payment preparation route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    preparePaymentMock.mockResolvedValue({
      provider: "magicblock",
      paymentProofReference: "magicblock:invoice-1",
      unsignedTransactionBase64: "base64-transaction",
      sendTo: "base",
      requiredSigners: ["Sender1111111111111111111111111111111111111"],
    });
  });

  it("returns public-safe unsigned private payment preparation data", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/privacy/payment", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      provider: "magicblock",
      paymentProofReference: "magicblock:invoice-1",
      unsignedTransactionBase64: "base64-transaction",
      sendTo: "base",
      requiredSigners: ["Sender1111111111111111111111111111111111111"],
    });
    expect(preparePaymentMock).toHaveBeenCalledWith(validPayload);
  });

  it("accepts the MagicBlock devnet one-unit signed-flow payload", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/privacy/payment", {
        method: "POST",
        body: JSON.stringify({
          invoiceId: "invoice-1",
          senderWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
          recipientWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
          amountMinor: "1",
          currency: "USDC",
          cluster: "devnet",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(preparePaymentMock).toHaveBeenCalledWith({
      invoiceId: "invoice-1",
      senderWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
      recipientWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
      amountMinor: "1",
      currency: "USDC",
      cluster: "devnet",
    });
  });

  it("rejects invalid payloads", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/privacy/payment", {
        method: "POST",
        body: JSON.stringify({ invoiceId: "" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid private payment payload" });
    expect(preparePaymentMock).not.toHaveBeenCalled();
  });
});
