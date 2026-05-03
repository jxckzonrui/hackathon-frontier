import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvoiceDraft } from "../types";
import { localInvoiceReviewProvider } from "./ai/provider";
import { staticSettlementDataProvider } from "./data/provider";
import { torqueGrowthProvider } from "./growth/provider";
import { optInSnsIdentityProvider } from "./identity/provider";
import { getIntegrationProviderStatuses } from "./status";
import { getPrivatePaymentProvider } from "./privacy/provider";

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

describe("integration provider contracts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("keeps private payment providers behind one public-safe contract", async () => {
    const provider = getPrivatePaymentProvider();

    const result = await provider.preparePayment({
      invoiceId: "invoice-1",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: draft.amountMinor,
      currency: draft.currency,
    });

    expect(provider.status()).toMatchObject({
      category: "privacy",
      publicSafe: true,
    });
    expect(result).toMatchObject({
      provider: "mock",
      paymentProofReference: "mock:invoice-1",
    });
    expect(JSON.stringify(result)).not.toContain(draft.amountMinor);
  });

  it("exposes local invoice review through an AI provider boundary", async () => {
    const review = await localInvoiceReviewProvider.reviewInvoice({
      draft,
      knownAttachmentHashes: [draft.attachmentHash],
    });

    expect(localInvoiceReviewProvider.status()).toMatchObject({
      category: "ai",
      publicSafe: true,
    });
    expect(review.checks.length).toBeGreaterThan(0);
    expect(review.privacyNote).toMatch(/local/i);
    expect(JSON.stringify(review)).not.toContain(draft.amountMinor);
  });

  it("keeps data, identity, and growth integrations behind explicit providers", async () => {
    await expect(staticSettlementDataProvider.fetchSettlementEvents()).resolves.toEqual([
      expect.objectContaining({
        invoiceId: "demo-invoice",
        status: "paid",
      }),
    ]);

    await expect(
      optInSnsIdentityProvider.displayIdentity({
        name: "client.sol",
        wallet: draft.clientWallet,
        optIn: true,
      }),
    ).resolves.toBe("client.sol");
    await expect(
      optInSnsIdentityProvider.displayIdentity({
        name: "client.sol",
        wallet: draft.clientWallet,
        optIn: false,
      }),
    ).resolves.toBe("Clie...1111");

    await expect(
      torqueGrowthProvider.emitEvent({
        eventName: "invoice_paid_early",
        invoiceId: "invoice-1",
        paidAt: "2026-05-07T12:00:00.000Z",
        dueDate: "2026-05-08",
      }),
    ).resolves.toEqual({ queued: true });
  });

  it("aggregates provider status for the dashboard", () => {
    expect(getIntegrationProviderStatuses()).toEqual([
      expect.objectContaining({ category: "privacy" }),
      expect.objectContaining({ category: "ai" }),
      expect.objectContaining({ category: "data" }),
      expect.objectContaining({ category: "identity" }),
      expect.objectContaining({ category: "growth" }),
    ]);
  });
});
