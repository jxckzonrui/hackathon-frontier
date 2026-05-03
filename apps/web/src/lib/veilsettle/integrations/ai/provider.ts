import { runLocalInvoiceChecks, type QvacInvoiceCheck } from "../../qvac";
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
  privacyNote: string;
};

export type InvoiceReviewProvider = {
  reviewInvoice(request: InvoiceReviewRequest): Promise<InvoiceReviewResult>;
  status(): IntegrationProviderStatus;
};

export const localInvoiceReviewProvider: InvoiceReviewProvider = {
  async reviewInvoice(request) {
    const checks = await runLocalInvoiceChecks(request.draft, request.knownAttachmentHashes);
    const warningCount = checks.filter((check) => check.severity === "warning").length;

    return {
      provider: "qvac-local-fallback",
      checks,
      riskScore: Math.min(100, warningCount * 35),
      privacyNote: "Local deterministic fallback; private invoice details are not sent to cloud APIs.",
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
