import { describe, expect, it } from "vitest";

const validDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Private audit invoice", amountMinor: "2500000000" }],
  memo: "Milestone review",
  attachmentHash: "attachment-hash-1",
};

describe("Local Invoice Agent review route", () => {
  it("returns a local agent decision without echoing private invoice fields", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/invoices/review/agent", {
        method: "POST",
        body: JSON.stringify({
          draft: validDraft,
          knownAttachmentHashes: [],
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      agentMode: "qvac-local-fallback-agent",
      decision: "approve",
      recommendedAction: "prepare-private-payment",
      redacted: true,
    });
    expect(JSON.stringify(payload)).not.toContain(validDraft.amountMinor);
    expect(JSON.stringify(payload)).not.toContain(validDraft.memo);
    expect(JSON.stringify(payload)).not.toContain(validDraft.attachmentHash);
    expect(JSON.stringify(payload)).not.toContain(validDraft.clientWallet);
  });

  it("rejects invalid payloads", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/invoices/review/agent", {
        method: "POST",
        body: JSON.stringify({ draft: null }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
