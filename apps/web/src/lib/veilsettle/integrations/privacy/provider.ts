import type { StablecoinSymbol } from "../../types";
import type { IntegrationProviderStatus } from "../status";

export type PrivatePaymentRequest = {
  invoiceId: string;
  recipientWallet: string;
  amountMinor: string;
  currency: StablecoinSymbol;
};

export type PrivatePaymentResult = {
  provider: "cloak" | "umbra" | "magicblock" | "mock";
  paymentProofReference: string;
  transactionSignature: string;
};

export type PrivatePaymentProvider = {
  preparePayment(request: PrivatePaymentRequest): Promise<PrivatePaymentResult>;
  status(): IntegrationProviderStatus;
};

const mockPrivatePaymentProvider: PrivatePaymentProvider = {
  async preparePayment(request) {
    return {
      provider: "mock",
      paymentProofReference: `mock:${request.invoiceId}`,
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
  async preparePayment(request) {
    return {
      provider: "cloak",
      paymentProofReference: `cloak:${request.invoiceId}`,
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

export function getPrivatePaymentProvider(): PrivatePaymentProvider {
  if (
    process.env.PRIVACY_PROVIDER === "cloak" ||
    process.env.NEXT_PUBLIC_ENABLE_CLOAK === "true"
  ) {
    return cloakFlagPrivatePaymentProvider;
  }

  return mockPrivatePaymentProvider;
}
