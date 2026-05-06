import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvoiceDraft } from "../types";
import { localInvoiceReviewProvider } from "./ai/provider";
import { staticSettlementDataProvider } from "./data/provider";
import { torqueGrowthProvider } from "./growth/provider";
import { optInSnsIdentityProvider } from "./identity/provider";
import { getIntegrationProviderStatuses } from "./status";
import {
  MAGICBLOCK_DEVNET_USDC_MINT,
  createMagicBlockPrivatePaymentProvider,
  getPrivatePaymentProvider,
} from "./privacy/provider";

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

    const quote = await provider.quotePayment({
      invoiceId: "invoice-1",
      senderWallet: "Client111111111111111111111111111111111111",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: draft.amountMinor,
      currency: draft.currency,
    });
    const result = await provider.preparePayment({
      invoiceId: "invoice-1",
      senderWallet: "Client111111111111111111111111111111111111",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: draft.amountMinor,
      currency: draft.currency,
    });

    expect(provider.status()).toMatchObject({
      category: "privacy",
      publicSafe: true,
    });
    expect(quote).toMatchObject({
      provider: "mock",
      requiresWalletSignature: true,
      publicSafe: true,
    });
    expect(result).toMatchObject({
      provider: "mock",
      paymentProofReference: "mock:invoice-1",
    });
    expect(JSON.stringify(result)).not.toContain(draft.amountMinor);
  });

  it("builds MagicBlock private SPL transfer transactions without exposing invoice details", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          kind: "transfer",
          version: "legacy",
          transactionBase64: "base64-transaction",
          sendTo: "base",
          recentBlockhash: "blockhash",
          lastValidBlockHeight: 123,
          instructionCount: 1,
          requiredSigners: ["Client111111111111111111111111111111111111"],
          validator: "validator",
        }),
    });
    const provider = createMagicBlockPrivatePaymentProvider({
      apiUrl: "https://payments.magicblock.app",
      fetcher,
      mintByCurrency: {
        PUSD: "PusdMint111111111111111111111111111111111111",
      },
    });

    const result = await provider.preparePayment({
      invoiceId: "invoice-1",
      senderWallet: "Client111111111111111111111111111111111111",
      recipientWallet: "Agency111111111111111111111111111111111111",
      amountMinor: draft.amountMinor,
      currency: "PUSD",
    });

    expect(fetcher).toHaveBeenCalledWith(
      "https://payments.magicblock.app/v1/spl/transfer",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const requestBody = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(requestBody).toMatchObject({
      from: "Client111111111111111111111111111111111111",
      to: "Agency111111111111111111111111111111111111",
      mint: "PusdMint111111111111111111111111111111111111",
      amount: 2500000000,
      visibility: "private",
      fromBalance: "base",
      toBalance: "base",
      initIfMissing: true,
      initAtasIfMissing: true,
      initVaultIfMissing: false,
      split: 1,
      legacy: true,
    });
    expect(requestBody).not.toHaveProperty("memo");
    expect(result).toMatchObject({
      provider: "magicblock",
      paymentProofReference: "magicblock:invoice-1",
      unsignedTransactionBase64: "base64-transaction",
      sendTo: "base",
      requiredSigners: ["Client111111111111111111111111111111111111"],
    });
    expect(JSON.stringify(result)).not.toContain(draft.memo);
    expect(JSON.stringify(result)).not.toContain(draft.amountMinor);
  });

  it("uses MagicBlock documented devnet USDC mint for devnet signed flow", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          kind: "transfer",
          version: "legacy",
          transactionBase64: "base64-transaction",
          sendTo: "base",
          recentBlockhash: "blockhash",
          lastValidBlockHeight: 123,
          instructionCount: 1,
          requiredSigners: ["AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U"],
        }),
    });
    const provider = createMagicBlockPrivatePaymentProvider({ fetcher });

    await provider.preparePayment({
      invoiceId: "invoice-1",
      senderWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
      recipientWallet: "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U",
      amountMinor: "1",
      currency: "USDC",
      cluster: "devnet",
    });

    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({
      mint: MAGICBLOCK_DEVNET_USDC_MINT,
      amount: 1,
      cluster: "devnet",
    });
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

  it("reports Dune SIM status through the selected settlement data provider", () => {
    vi.stubEnv("DUNE_SIM_API_KEY", "test-dune-key");
    vi.stubEnv("DUNE_SIM_WALLET_ADDRESS", "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U");

    const statuses = getIntegrationProviderStatuses();

    expect(statuses).toContainEqual(
      expect.objectContaining({
        category: "data",
        id: "dune-sim-settlement-analytics",
        state: "configured",
      }),
    );
  });
});
