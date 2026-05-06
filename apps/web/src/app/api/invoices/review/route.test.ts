import { describe, expect, it } from "vitest";

const draft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Private memo that must stay out of review output",
  attachmentHash: "sha256-demo-attachment",
};

describe("invoice review API route", () => {
  it("returns QVAC fallback review signals without private invoice fields", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/invoices/review", {
        method: "POST",
        body: JSON.stringify({
          draft,
          knownAttachmentHashes: [draft.attachmentHash],
        }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.riskScore).toBeGreaterThan(0);
    expect(payload.duplicateSignal.detected).toBe(true);
    expect(payload.vendorConsistency.consistent).toBe(true);
    expect(payload.privacyNote).toMatch(/local/i);
    expect(JSON.stringify(payload)).not.toContain(draft.amountMinor);
    expect(JSON.stringify(payload)).not.toContain(draft.memo);
  });
});
