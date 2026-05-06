import type { StablecoinSymbol } from "../../types";
import type { IntegrationProviderStatus } from "../status";

type PrivatePaymentProviderId = "cloak" | "umbra" | "magicblock" | "mock";

export type PrivatePaymentRequest = {
  invoiceId: string;
  senderWallet: string;
  recipientWallet: string;
  amountMinor: string;
  currency: StablecoinSymbol;
  mint?: string;
  cluster?: "mainnet" | "devnet";
};

export type PrivatePaymentQuote = {
  provider: PrivatePaymentProviderId;
  paymentRail: "private-spl-transfer";
  paymentProofReference: string;
  requiresWalletSignature: boolean;
  publicSafe: true;
};

export type PrivatePaymentResult = {
  provider: PrivatePaymentProviderId;
  paymentProofReference: string;
  transactionSignature?: string;
  unsignedTransactionBase64?: string;
  sendTo?: "base" | "ephemeral";
  requiredSigners?: string[];
};

export type PrivatePaymentProvider = {
  quotePayment(request: PrivatePaymentRequest): Promise<PrivatePaymentQuote>;
  preparePayment(request: PrivatePaymentRequest): Promise<PrivatePaymentResult>;
  status(): IntegrationProviderStatus;
};

type Fetcher = (
  input: string,
  init?: RequestInit,
) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

type MagicBlockTransferResponse = {
  transactionBase64: string;
  sendTo: "base" | "ephemeral";
  requiredSigners: string[];
};

type MagicBlockProviderOptions = {
  apiUrl?: string;
  fetcher?: Fetcher;
  mintByCurrency?: Partial<Record<StablecoinSymbol, string>>;
};

const defaultMagicBlockApiUrl = "https://payments.magicblock.app";
const defaultMagicBlockMints: Partial<Record<StablecoinSymbol, string>> = {
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkYkByTzW1C9S2da",
};

export const MAGICBLOCK_DEVNET_USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

function proofReference(provider: PrivatePaymentProviderId, invoiceId: string) {
  return `${provider}:${invoiceId}`;
}

function parseMagicBlockTransferResponse(payload: unknown): MagicBlockTransferResponse {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid MagicBlock transfer response");
  }

  const record = payload as Record<string, unknown>;

  if (
    typeof record.transactionBase64 !== "string" ||
    (record.sendTo !== "base" && record.sendTo !== "ephemeral") ||
    !Array.isArray(record.requiredSigners) ||
    !record.requiredSigners.every((signer) => typeof signer === "string")
  ) {
    throw new Error("Invalid MagicBlock transfer response");
  }

  return {
    transactionBase64: record.transactionBase64,
    sendTo: record.sendTo,
    requiredSigners: record.requiredSigners,
  };
}

function amountMinorToNumber(amountMinor: string): number {
  const amount = Number(amountMinor);

  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new Error("Invalid private payment amount");
  }

  return amount;
}

function omitUndefinedMints(
  mintByCurrency: Partial<Record<StablecoinSymbol, string>> = {},
): Partial<Record<StablecoinSymbol, string>> {
  return Object.fromEntries(
    Object.entries(mintByCurrency).filter((entry): entry is [StablecoinSymbol, string] =>
      Boolean(entry[1]),
    ),
  ) as Partial<Record<StablecoinSymbol, string>>;
}

function resolveMagicBlockMint(
  request: PrivatePaymentRequest,
  mintByCurrency: Partial<Record<StablecoinSymbol, string>>,
  configuredMintByCurrency: Partial<Record<StablecoinSymbol, string>>,
): string | undefined {
  if (request.mint) {
    return request.mint;
  }

  if (request.currency === "USDC" && request.cluster === "devnet") {
    return configuredMintByCurrency.USDC ?? MAGICBLOCK_DEVNET_USDC_MINT;
  }

  return mintByCurrency[request.currency];
}

const mockPrivatePaymentProvider: PrivatePaymentProvider = {
  async quotePayment(request) {
    return {
      provider: "mock",
      paymentRail: "private-spl-transfer",
      paymentProofReference: proofReference("mock", request.invoiceId),
      requiresWalletSignature: true,
      publicSafe: true,
    };
  },
  async preparePayment(request) {
    return {
      provider: "mock",
      paymentProofReference: proofReference("mock", request.invoiceId),
      transactionSignature: "mock-demo-signature",
    };
  },
  status() {
    return {
      category: "privacy",
      id: "mock-private-payment",
      label: "Mock private settlement",
      state: "mock",
      publicSafe: true,
      detail: "Fallback proof references only; no private amount or memo leaves the app.",
    };
  },
};

const cloakFlagPrivatePaymentProvider: PrivatePaymentProvider = {
  async quotePayment(request) {
    return {
      provider: "cloak",
      paymentRail: "private-spl-transfer",
      paymentProofReference: proofReference("cloak", request.invoiceId),
      requiresWalletSignature: true,
      publicSafe: true,
    };
  },
  async preparePayment(request) {
    return {
      provider: "cloak",
      paymentProofReference: proofReference("cloak", request.invoiceId),
      transactionSignature: "cloak-demo-signature",
    };
  },
  status() {
    return {
      category: "privacy",
      id: "cloak-flag",
      label: "Cloak private settlement",
      state: "planned",
      publicSafe: true,
      detail: "Provider boundary is ready; real Cloak SDK settlement still requires integration.",
    };
  },
};

export function createMagicBlockPrivatePaymentProvider(
  options: MagicBlockProviderOptions = {},
): PrivatePaymentProvider {
  const apiUrl = (options.apiUrl ?? defaultMagicBlockApiUrl).replace(/\/+$/, "");
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const configuredMintByCurrency = omitUndefinedMints(options.mintByCurrency);
  const mintByCurrency = {
    ...defaultMagicBlockMints,
    ...configuredMintByCurrency,
  };

  return {
    async quotePayment(request) {
      return {
        provider: "magicblock",
        paymentRail: "private-spl-transfer",
        paymentProofReference: proofReference("magicblock", request.invoiceId),
        requiresWalletSignature: true,
        publicSafe: true,
      };
    },
    async preparePayment(request) {
      const mint = resolveMagicBlockMint(request, mintByCurrency, configuredMintByCurrency);

      if (!mint) {
        throw new Error(`Missing MagicBlock SPL mint for ${request.currency}`);
      }

      const response = await fetcher(`${apiUrl}/v1/spl/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: request.senderWallet,
          to: request.recipientWallet,
          mint,
          amount: amountMinorToNumber(request.amountMinor),
          visibility: "private",
          fromBalance: "base",
          toBalance: "base",
          cluster: request.cluster,
          initIfMissing: true,
          initAtasIfMissing: true,
          initVaultIfMissing: false,
          minDelayMs: "0",
          maxDelayMs: "0",
          split: 1,
          legacy: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`MagicBlock private transfer failed with status ${response.status}`);
      }

      const payload = parseMagicBlockTransferResponse(await response.json());

      return {
        provider: "magicblock",
        paymentProofReference: proofReference("magicblock", request.invoiceId),
        unsignedTransactionBase64: payload.transactionBase64,
        sendTo: payload.sendTo,
        requiredSigners: payload.requiredSigners,
      };
    },
    status() {
      return {
        category: "privacy",
        id: "magicblock-private-payments",
        label: "MagicBlock Private Payments",
        state: "configured",
        publicSafe: true,
        detail:
          "Builds unsigned private SPL transfers; wallet signing and submission are tracked separately.",
      };
    },
  };
}

export function getPrivatePaymentProvider(): PrivatePaymentProvider {
  if (process.env.PRIVACY_PROVIDER === "magicblock") {
    return createMagicBlockPrivatePaymentProvider({
      apiUrl: process.env.MAGICBLOCK_PAYMENTS_API_URL,
      mintByCurrency: {
        USDC: process.env.MAGICBLOCK_USDC_MINT,
        PUSD: process.env.MAGICBLOCK_PUSD_MINT,
      },
    });
  }

  if (
    process.env.PRIVACY_PROVIDER === "cloak" ||
    process.env.NEXT_PUBLIC_ENABLE_CLOAK === "true"
  ) {
    return cloakFlagPrivatePaymentProvider;
  }

  return mockPrivatePaymentProvider;
}
