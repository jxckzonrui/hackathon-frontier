import {
  getPrivatePaymentProvider,
  type PrivatePaymentRequest,
  type PrivatePaymentResult,
} from "./integrations/privacy/provider";

export type { PrivatePaymentRequest, PrivatePaymentResult };

export async function preparePrivatePayment(
  request: PrivatePaymentRequest,
): Promise<PrivatePaymentResult> {
  return getPrivatePaymentProvider().preparePayment(request);
}
