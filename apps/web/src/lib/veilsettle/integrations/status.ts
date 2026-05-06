import { getInvoiceReviewProvider } from "./ai/provider";
import { getSettlementDataProvider } from "./data/provider";
import { torqueGrowthProvider } from "./growth/provider";
import { optInSnsIdentityProvider } from "./identity/provider";
import { getPrivatePaymentProvider } from "./privacy/provider";

export type IntegrationProviderCategory = "privacy" | "ai" | "data" | "identity" | "growth";

export type IntegrationProviderStatus = {
  category: IntegrationProviderCategory;
  id: string;
  label: string;
  state: "mock" | "fallback" | "configured" | "planned";
  publicSafe: boolean;
  detail: string;
};

export function getIntegrationProviderStatuses(): IntegrationProviderStatus[] {
  return [
    getPrivatePaymentProvider().status(),
    getInvoiceReviewProvider().status(),
    getSettlementDataProvider().status(),
    optInSnsIdentityProvider.status(),
    torqueGrowthProvider.status(),
  ];
}
