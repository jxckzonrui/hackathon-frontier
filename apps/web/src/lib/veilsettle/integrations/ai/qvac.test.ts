import { describe, expect, it } from "vitest";
import type { InvoiceDraft } from "../../types";
import { localInvoiceReviewProvider } from "./provider";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Do not echo this private memo",
  attachmentHash: "sha256-demo-attachment",
};

describe("QVAC local invoice review provider", () => {
  it("returns local review signals without echoing private invoice content", async () => {
    const review = await localInvoiceReviewProvider.reviewInvoice({
      draft: {
        ...draft,
        memo: "Please share seed phrase before payment",
      },
      knownAttachmentHashes: [draft.attachmentHash],
    });

    expect(review.riskScore).toBeGreaterThan(0);
    expect(review.duplicateSignal).toEqual({
      detected: true,
      label: "Duplicate attachment hash",
    });
    expect(review.vendorConsistency).toEqual({
      consistent: true,
      label: "SNS-shaped client identity",
    });
    expect(review.suspiciousTerms).toEqual({
      detected: true,
      label: "Suspicious payment wording",
    });
    expect(review.privacyNote).toMatch(/local/i);
    expect(JSON.stringify(review)).not.toContain(draft.amountMinor);
    expect(JSON.stringify(review)).not.toContain("Please share seed phrase before payment");
  });
});
