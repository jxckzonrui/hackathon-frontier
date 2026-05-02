import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvoiceDraft } from "./types";

const draft: InvoiceDraft = {
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

describe("sponsor integration adapters", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("runs local QVAC invoice checks without exposing private amounts", async () => {
    const { runLocalInvoiceChecks } = await import("./qvac");

    const checks = await runLocalInvoiceChecks(draft, [draft.attachmentHash]);

    expect(checks).toContainEqual({
      severity: "ok",
      label: "Line items",
      detail: "Invoice has itemized services.",
    });
    expect(checks).toContainEqual({
      severity: "warning",
      label: "Duplicate attachment hash",
      detail: "Attachment hash already appeared locally.",
    });
    expect(JSON.stringify(checks)).not.toContain(draft.amountMinor);
  });

  it("prepares mock payments by default and Cloak references when enabled", async () => {
    const { preparePrivatePayment } = await import("./privacy-payments");
    const request = {
      invoiceId: "invoice-1",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: "2500000000",
      currency: "PUSD" as const,
    };

    await expect(preparePrivatePayment(request)).resolves.toMatchObject({
      provider: "mock",
      paymentProofReference: "mock:invoice-1",
    });

    vi.stubEnv("NEXT_PUBLIC_ENABLE_CLOAK", "true");
    await expect(preparePrivatePayment(request)).resolves.toMatchObject({
      provider: "cloak",
      paymentProofReference: "cloak:invoice-1",
    });
  });

  it("returns settlement events for the dashboard adapter", async () => {
    const { fetchSettlementEvents } = await import("./analytics");

    await expect(fetchSettlementEvents()).resolves.toEqual([
      {
        invoiceId: "demo-invoice",
        status: "paid",
        paymentProofReference: "cloak-proof-demo",
        observedAt: "2026-05-02T12:00:00.000Z",
      },
    ]);
  });

  it("queues only early Torque payment events without requiring an API key", async () => {
    const { emitEarlyPaymentEvent } = await import("./torque");

    await expect(
      emitEarlyPaymentEvent({
        eventName: "invoice_paid_early",
        invoiceId: "invoice-1",
        paidAt: "2026-05-07T12:00:00.000Z",
        dueDate: "2026-05-08",
      }),
    ).resolves.toEqual({ queued: true });

    await expect(
      emitEarlyPaymentEvent({
        eventName: "invoice_paid_early",
        invoiceId: "invoice-1",
        paidAt: "2026-05-09T12:00:00.000Z",
        dueDate: "2026-05-08",
      }),
    ).resolves.toEqual({ queued: false });
  });

  it("formats SNS names and wallet fallbacks", async () => {
    const { displayIdentity, isSnsName } = await import("./sns");

    expect(isSnsName("client.sol")).toBe(true);
    expect(isSnsName("Client.sol")).toBe(false);
    expect(displayIdentity("client.sol", draft.clientWallet)).toBe("client.sol");
    expect(displayIdentity("Client", draft.clientWallet)).toBe("Clie...1111");
  });
});
