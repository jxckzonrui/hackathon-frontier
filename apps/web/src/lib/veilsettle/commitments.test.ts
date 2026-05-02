import { describe, expect, it } from "vitest";
import { createInvoiceCommitments } from "./commitments";
import type { InvoiceDraft } from "./types";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [
    { label: "Smart contract review", amountMinor: "1500000000" },
    { label: "Findings report", amountMinor: "1000000000" },
  ],
  memo: "Private audit invoice for sprint 12",
  attachmentHash: "sha256-demo-attachment",
};

describe("createInvoiceCommitments", () => {
  it("creates deterministic commitments without exposing private fields", async () => {
    const first = await createInvoiceCommitments(draft);
    const second = await createInvoiceCommitments(draft);

    expect(first.metadataHash).toEqual(second.metadataHash);
    expect(first.amountCommitment).toEqual(second.amountCommitment);
    expect(first.metadataHash).not.toContain("Protocol audit sprint");
    expect(first.amountCommitment).not.toContain("2500000000");
  });
});
