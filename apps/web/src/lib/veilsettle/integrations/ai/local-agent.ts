import type { InvoiceReviewResult } from "./provider";

export type LocalInvoiceAgentMode =
  | "local-deterministic-agent"
  | "qvac-local-runtime-agent"
  | "qvac-local-fallback-agent";

export type LocalInvoiceAgentDecision = "approve" | "review" | "reject";

export type LocalInvoiceAgentRecommendedAction =
  | "prepare-private-payment"
  | "request-changes"
  | "block-payment";

export type LocalInvoiceAgentReview = {
  agentMode: LocalInvoiceAgentMode;
  riskScore: number;
  decision: LocalInvoiceAgentDecision;
  findings: string[];
  recommendedAction: LocalInvoiceAgentRecommendedAction;
  privacyNotice: string;
  redacted: true;
};

function toAgentMode(provider: InvoiceReviewResult["provider"]): LocalInvoiceAgentMode {
  if (provider === "qvac-local-runtime") {
    return "qvac-local-runtime-agent";
  }

  if (provider === "qvac-local-fallback") {
    return "qvac-local-fallback-agent";
  }

  return "local-deterministic-agent";
}

function toDecision(review: InvoiceReviewResult): Pick<
  LocalInvoiceAgentReview,
  "decision" | "recommendedAction"
> {
  const mustBlock =
    review.riskScore >= 50 ||
    review.duplicateSignal.detected ||
    review.suspiciousTerms.detected;

  if (mustBlock) {
    return {
      decision: "reject",
      recommendedAction: "block-payment",
    };
  }

  if (review.riskScore > 0 || !review.vendorConsistency.consistent) {
    return {
      decision: "review",
      recommendedAction: "request-changes",
    };
  }

  return {
    decision: "approve",
    recommendedAction: "prepare-private-payment",
  };
}

function toFindings(review: InvoiceReviewResult): string[] {
  return [
    review.duplicateSignal.detected
      ? "Duplicate invoice signal detected locally."
      : "No local duplicate invoice signal detected.",
    review.vendorConsistency.consistent
      ? "Vendor identity signal is consistent."
      : "Vendor identity needs manual review.",
    review.suspiciousTerms.detected
      ? "Suspicious payment wording detected locally."
      : "No suspicious payment wording detected locally.",
  ];
}

export function createLocalInvoiceAgentReview(
  review: InvoiceReviewResult,
): LocalInvoiceAgentReview {
  return {
    agentMode: toAgentMode(review.provider),
    riskScore: review.riskScore,
    ...toDecision(review),
    findings: toFindings(review),
    privacyNotice: `${review.privacyNote} Local Invoice Agent returns redacted risk signals only.`,
    redacted: true,
  };
}
