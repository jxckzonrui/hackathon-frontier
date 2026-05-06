import { describe, expect, it, vi } from "vitest";
import {
  createDuneSettlementDataProvider,
  staticSettlementDataProvider,
} from "./provider";

describe("Dune SIM settlement analytics provider", () => {
  const solanaWallet = "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U";

  it("constructs SVM balance requests and returns redacted settlement analytics", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          balances: [
            {
              chain: "solana",
              address: "native",
              amount: "1000000000",
              balance: "1.0",
            },
          ],
        }),
    });
    const provider = createDuneSettlementDataProvider({
      apiKey: "dune-key",
      settlementWallet: `  ${solanaWallet}  `,
      fetcher,
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).toHaveBeenCalledWith(
      `https://api.sim.dune.com/beta/svm/balances/${solanaWallet}?chains=solana&limit=10`,
      expect.objectContaining({
        method: "GET",
        headers: { "X-Sim-Api-Key": "dune-key" },
      }),
    );
    expect(analytics).toMatchObject({
      source: "dune-sim",
      paidCount: 1,
      redacted: true,
    });
    expect(analytics.events[0]).toMatchObject({
      status: "paid",
      paymentProofReference: expect.stringMatching(/^sim:[a-f0-9]{16}$/),
      invoiceHash: expect.stringMatching(/^[a-f0-9]{16}$/),
    });
    expect(JSON.stringify(analytics)).not.toContain(solanaWallet);
  });

  it("validates the configured wallet as a raw Solana public key before calling Dune", async () => {
    const fetcher = vi.fn();
    const provider = createDuneSettlementDataProvider({
      apiKey: "dune-key",
      settlementWallet: "0x1111111111111111111111111111111111111111",
      fetcher,
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).not.toHaveBeenCalled();
    expect(analytics).toMatchObject({
      source: "static",
      redacted: true,
    });
  });

  it("falls back to static analytics when Dune SIM rejects configured credentials", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: "unauthorized" }),
    });
    const provider = createDuneSettlementDataProvider({
      apiKey: "invalid-dune-key",
      settlementWallet: solanaWallet,
      fetcher,
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(analytics).toMatchObject({
      source: "static",
      redacted: true,
    });
  });

  it("falls back to RPC Fast when Dune SIM returns a non-200 response", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "invalid svm address" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: { value: 1_000_000_000 } }),
      });
    const provider = createDuneSettlementDataProvider({
      apiKey: "dune-key",
      settlementWallet: solanaWallet,
      fetcher,
      rpcUrl: "https://rpcfast.example.invalid/solana",
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      "https://rpcfast.example.invalid/solana",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"method":"getBalance"'),
      }),
    );
    expect(analytics).toMatchObject({
      source: "rpc-fast",
      paidCount: 1,
      redacted: true,
    });
    expect(JSON.stringify(analytics)).not.toContain(solanaWallet);
  });

  it("does not call Dune for .sol names because live claims require raw public keys", async () => {
    const fetcher = vi.fn();
    const provider = createDuneSettlementDataProvider({
      apiKey: "dune-key",
      settlementWallet: "vitalik.sol",
      fetcher,
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).not.toHaveBeenCalled();
    expect(analytics).toMatchObject({
      source: "static",
      redacted: true,
    });
  });

  it("uses static redacted analytics when the Dune key or wallet is missing", async () => {
    const fetcher = vi.fn();
    const provider = createDuneSettlementDataProvider({ fetcher });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).not.toHaveBeenCalled();
    expect(analytics).toMatchObject({
      source: "static",
      paidCount: 1,
      redacted: true,
    });
    expect(analytics.events[0].invoiceHash).toMatch(/^[a-f0-9]{16}$/);

    await expect(staticSettlementDataProvider.fetchSettlementAnalytics()).resolves.toMatchObject({
      source: "static",
      redacted: true,
    });
  });
});
