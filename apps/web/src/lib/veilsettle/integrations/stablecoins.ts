import type { StablecoinSymbol } from "../types";

export type StablecoinMetadata = {
  symbol: StablecoinSymbol;
  name: string;
  network: "solana-mainnet";
  tokenStandard: "SPL";
  decimals: 6;
  mint: string;
  sourceUrl: string;
  liveSettlementClaim: boolean;
};

export const OFFICIAL_SOLANA_PUSD_MINT = "CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s";

export const stablecoinMetadata = {
  PUSD: {
    symbol: "PUSD",
    name: "Palm USD",
    network: "solana-mainnet",
    tokenStandard: "SPL",
    decimals: 6,
    mint: OFFICIAL_SOLANA_PUSD_MINT,
    sourceUrl: "https://www.palmusd.com/pages/developers.html",
    liveSettlementClaim: false,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    network: "solana-mainnet",
    tokenStandard: "SPL",
    decimals: 6,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    sourceUrl: "https://spl.solana.com/token",
    liveSettlementClaim: false,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    network: "solana-mainnet",
    tokenStandard: "SPL",
    decimals: 6,
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkYkByTzW1C9S2da",
    sourceUrl: "https://spl.solana.com/token",
    liveSettlementClaim: false,
  },
} as const satisfies Record<StablecoinSymbol, StablecoinMetadata>;

export function getStablecoinMetadata(symbol: StablecoinSymbol): StablecoinMetadata {
  return stablecoinMetadata[symbol];
}
