import type { StablecoinSymbol } from "./types";

export type PrivatePaymentRequest = {
  invoiceId: string;
  recipientWallet: string;
  amountMinor: string;
  currency: StablecoinSymbol;
};

export type PrivatePaymentResult = {
  provider: "cloak" | "umbra" | "mock";
  paymentProofReference: string;
  transactionSignature: string;
};

export async function preparePrivatePayment(
  request: PrivatePaymentRequest,
): Promise<PrivatePaymentResult> {
  if (process.env.NEXT_PUBLIC_ENABLE_CLOAK === "true") {
    return {
      provider: "cloak",
      paymentProofReference: `cloak:${request.invoiceId}`,
      transactionSignature: "cloak-demo-signature",
    };
  }

  return {
    provider: "mock",
    paymentProofReference: `mock:${request.invoiceId}`,
    transactionSignature: "mock-demo-signature",
  };
}
