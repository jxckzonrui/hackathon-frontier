import { describe, expect, it } from "vitest";
import type { InvoiceReviewResult } from "./provider";
import { createLocalInvoiceAgentReview } from "./local-agent";

const baseReview: InvoiceReviewResult = {
  provider: "qvac-local-fallback",
  checks: [
    {
      severity: "ok",
      label: "Line items",
      detail: "Invoice has itemized services.",
    },
  ],
  riskScore: 0,
  duplicateSignal: {
    detected: false,
    label: "Duplicate attachment hash",
  },
  vendorConsistency: {
    consistent: true,
    label: "SNS-shaped client identity",
  },
  suspiciousTerms: {
    detected: false,
    label: "Suspicious payment wording",
  },
  privacyNote: "Local deterministic QVAC fallback; private invoice details are not sent to cloud APIs.",
};

describe("Local Invoice Agent", () => {
  it("approves low-risk local reviews for private payment preparation", () => {
    const result = createLocalInvoiceAgentReview(baseReview);

    expect(result).toMatchObject({
      agentMode: "qvac-local-fallback-agent",
      riskScore: 0,
      decision: "approve",
      recommendedAction: "prepare-private-payment",
    });
    expect(result.privacyNotice).toMatch(/local/i);
    expect(result.findings).toContain("No local duplicate invoice signal detected.");
  });

  it("requests changes for identity mismatch without leaking private invoice fields", () => {
    const result = createLocalInvoiceAgentReview({
      ...baseReview,
      riskScore: 25,
      vendorConsistency: {
        consistent: false,
        label: "Client identity mismatch",
      },
    });

    expect(result.decision).toBe("review");
    expect(result.recommendedAction).toBe("request-changes");
    expect(JSON.stringify(result)).not.toMatch(
      /amountMinor|memo|lineItems|attachmentHash|clientWallet|clientDisplay/i,
    );
  });

  it("blocks payment for duplicate or suspicious high-risk invoices", () => {
    const result = createLocalInvoiceAgentReview({
      ...baseReview,
      riskScore: 75,
      duplicateSignal: {
        detected: true,
        label: "Duplicate attachment hash",
      },
      suspiciousTerms: {
        detected: true,
        label: "Suspicious payment wording",
      },
    });

    expect(result).toMatchObject({
      decision: "reject",
      recommendedAction: "block-payment",
    });
    expect(result.findings).toEqual(
      expect.arrayContaining([
        "Duplicate invoice signal detected locally.",
        "Suspicious payment wording detected locally.",
      ]),
    );
  });
});
