import { describe, expect, it } from "vitest";
import {
  OFFICIAL_SOLANA_PUSD_MINT,
  getStablecoinMetadata,
  stablecoinMetadata,
} from "./stablecoins";

describe("stablecoin metadata", () => {
  it("records the official Palm USD Solana mint metadata", () => {
    expect(OFFICIAL_SOLANA_PUSD_MINT).toBe("CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s");
    expect(getStablecoinMetadata("PUSD")).toEqual({
      symbol: "PUSD",
      name: "Palm USD",
      network: "solana-mainnet",
      tokenStandard: "SPL",
      decimals: 6,
      mint: OFFICIAL_SOLANA_PUSD_MINT,
      sourceUrl: "https://www.palmusd.com/pages/developers.html",
      liveSettlementClaim: false,
    });
  });

  it("keeps every stablecoin metadata entry explicit and public-safe", () => {
    expect(Object.keys(stablecoinMetadata).sort()).toEqual(["PUSD", "USDC", "USDT"]);
    for (const metadata of Object.values(stablecoinMetadata)) {
      expect(Object.keys(metadata).join(" ")).not.toMatch(/api[_-]?key|secret|password/i);
    }
  });
});
