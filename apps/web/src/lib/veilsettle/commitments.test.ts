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
    expect(first.amountCommitment).toBe(
      "14ffee66f2657620f5e243404592af858c1a350f5e6d57d422268ea8c41dba09",
    );
    expect(first.dueDateHash).toBe(
      "d0c045745ed60653112c3e5a80b074f283c6286cb9a53f2d3219872ecb2c7be0",
    );
    expect(first.payerHash).toBe(
      "d277c26833f97328a3bc5c471ef5591a1dfead5b43945ebeeee305107a0f0759",
    );
    expect(first.metadataHash).not.toContain("Protocol audit sprint");
    expect(first.amountCommitment).not.toContain("2500000000");
  });
});
