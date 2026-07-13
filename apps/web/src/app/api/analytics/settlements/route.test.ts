import { describe, expect, it } from "vitest";

describe("settlement analytics API route", () => {
  it("returns redacted aggregate settlement data", async () => {
    const { GET } = await import("./route");

    const response = await GET();

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({
      redacted: true,
      paidCount: expect.any(Number),
      events: expect.any(Array),
    });
    expect(JSON.stringify(payload)).not.toContain("demo-invoice");
    expect(JSON.stringify(payload)).not.toMatch(/amount|memo|lineItems|attachmentHash|clientWallet|clientDisplay/i);
    for (const event of payload.events) {
      expect(Object.keys(event).sort()).toEqual([
        "invoiceHash",
        "observedAt",
        "paymentProofReference",
        "status",
      ]);
    }
  });
});
