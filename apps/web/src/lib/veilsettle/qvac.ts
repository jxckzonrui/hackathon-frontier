import type { InvoiceDraft } from "./types";

export type QvacInvoiceCheck = {
  severity: "ok" | "warning";
  label: string;
  detail: string;
};

export type QvacReviewSignal = {
  detected: boolean;
  label: string;
};

export type QvacVendorConsistencySignal = {
  consistent: boolean;
  label: string;
};

export type QvacLocalInvoiceReview = {
  checks: QvacInvoiceCheck[];
  riskScore: number;
  duplicateSignal: QvacReviewSignal;
  vendorConsistency: QvacVendorConsistencySignal;
  suspiciousTerms: QvacReviewSignal;
  privacyNote: string;
};

const suspiciousPaymentTerms = [/seed phrase/i, /private key/i, /off[- ]?platform/i, /cash only/i];

function hasSuspiciousPaymentTerms(draft: InvoiceDraft): boolean {
  const textFields = [
    draft.serviceTitle,
    draft.memo,
    ...draft.lineItems.map((item) => item.label),
  ];

  return suspiciousPaymentTerms.some((term) => textFields.some((field) => term.test(field)));
}

export async function runLocalInvoiceChecks(
  draft: InvoiceDraft,
  knownHashes: string[],
): Promise<QvacInvoiceCheck[]> {
  const duplicateDetected = knownHashes.includes(draft.attachmentHash);
  const vendorConsistent = draft.clientDisplay.endsWith(".sol") && draft.clientWallet.length >= 32;
  const suspiciousTermsDetected = hasSuspiciousPaymentTerms(draft);

  return [
    {
      severity: draft.lineItems.length > 0 ? "ok" : "warning",
      label: "Line items",
      detail:
        draft.lineItems.length > 0
          ? "Invoice has itemized services."
          : "Invoice has no itemized services.",
    },
    {
      severity: duplicateDetected ? "warning" : "ok",
      label: "Duplicate attachment hash",
      detail: duplicateDetected
        ? "Attachment hash already appeared locally."
        : "No local duplicate found.",
    },
    {
      severity: vendorConsistent ? "ok" : "warning",
      label: "SNS identity",
      detail: vendorConsistent
        ? "Client identity and wallet shape are consistent."
        : "Client identity needs manual review.",
    },
    {
      severity: suspiciousTermsDetected ? "warning" : "ok",
      label: "Suspicious payment wording",
      detail: suspiciousTermsDetected
        ? "Sensitive payment wording was detected locally."
        : "No suspicious payment wording detected locally.",
    },
  ];
}

export async function runLocalInvoiceReview(
  draft: InvoiceDraft,
  knownHashes: string[],
): Promise<QvacLocalInvoiceReview> {
  const duplicateDetected = knownHashes.includes(draft.attachmentHash);
  const vendorConsistent = draft.clientDisplay.endsWith(".sol") && draft.clientWallet.length >= 32;
  const suspiciousTermsDetected = hasSuspiciousPaymentTerms(draft);
  const checks = await runLocalInvoiceChecks(draft, knownHashes);
  const warningCount = checks.filter((check) => check.severity === "warning").length;

  return {
    checks,
    riskScore: Math.min(100, warningCount * 25),
    duplicateSignal: {
      detected: duplicateDetected,
      label: "Duplicate attachment hash",
    },
    vendorConsistency: {
      consistent: vendorConsistent,
      label: vendorConsistent ? "SNS-shaped client identity" : "Client identity mismatch",
    },
    suspiciousTerms: {
      detected: suspiciousTermsDetected,
      label: "Suspicious payment wording",
    },
    privacyNote:
      "Local deterministic QVAC fallback; private invoice details are not sent to cloud APIs.",
  };
}
