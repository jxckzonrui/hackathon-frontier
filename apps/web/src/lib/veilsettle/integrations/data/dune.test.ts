import { describe, expect, it, vi } from "vitest";
import {
  createDuneSettlementDataProvider,
  staticSettlementDataProvider,
} from "./provider";

describe("Dune SIM settlement analytics provider", () => {
  it("constructs SVM transaction requests and returns redacted settlement analytics", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          transactions: [
            {
              block_time: 1680000000000000,
              raw_transaction: {
                meta: { err: null },
                transaction: {
                  signatures: ["5SzSbWKM9yZC7cCGMhUhvnYdWQytrk9NBaWwug1gQBKKwNEBvBKqPSfVeYYnZwUuUyvcCHgYhDkTRrB6YBfwzfv8"],
                },
              },
            },
          ],
        }),
    });
    const provider = createDuneSettlementDataProvider({
      apiKey: "dune-key",
      settlementWallet: "Agency111111111111111111111111111111111111",
      fetcher,
    });

    const analytics = await provider.fetchSettlementAnalytics();

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.sim.dune.com/beta/svm/transactions/Agency111111111111111111111111111111111111?limit=20",
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
    expect(JSON.stringify(analytics)).not.toContain("5SzSbWKM9yZC7cCG");
    expect(JSON.stringify(analytics)).not.toContain("Agency111111111111111111111111111111111111");
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
