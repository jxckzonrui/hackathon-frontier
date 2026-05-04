import {
  runLocalInvoiceReview,
  type QvacInvoiceCheck,
  type QvacReviewSignal,
  type QvacVendorConsistencySignal,
} from "../../qvac";
import type { InvoiceDraft } from "../../types";
import type { IntegrationProviderStatus } from "../status";

export type InvoiceReviewRequest = {
  draft: InvoiceDraft;
  knownAttachmentHashes: string[];
};

export type InvoiceReviewResult = {
  provider: "qvac-local-fallback";
  checks: QvacInvoiceCheck[];
  riskScore: number;
  duplicateSignal: QvacReviewSignal;
  vendorConsistency: QvacVendorConsistencySignal;
  suspiciousTerms: QvacReviewSignal;
  privacyNote: string;
};

export type InvoiceReviewProvider = {
  reviewInvoice(request: InvoiceReviewRequest): Promise<InvoiceReviewResult>;
  status(): IntegrationProviderStatus;
};

export const localInvoiceReviewProvider: InvoiceReviewProvider = {
  async reviewInvoice(request) {
    const review = await runLocalInvoiceReview(request.draft, request.knownAttachmentHashes);

    return {
      provider: "qvac-local-fallback",
      ...review,
    };
  },
  status() {
    return {
      category: "ai",
      id: "qvac-local-fallback",
      label: "QVAC local invoice review",
      state: "fallback",
      publicSafe: true,
      detail: "Runs local deterministic checks until the QVAC runtime is connected.",
    };
  },
};
