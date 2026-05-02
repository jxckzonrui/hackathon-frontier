import { describe, expect, it } from "vitest";
import { createRevealBundle, decryptInvoiceBlob, encryptInvoiceBlob } from "./encryption";
import type { InvoiceDraft } from "./types";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Private memo",
  attachmentHash: "sha256-demo-attachment",
};

describe("invoice encryption", () => {
  it("encrypts invoice details and supports selected reveal", async () => {
    const encrypted = await encryptInvoiceBlob(draft, ["agency-wallet", "client-wallet"]);
    expect(encrypted.ciphertext).not.toContain("Protocol audit sprint");
    expect(encrypted.ciphertext).not.toContain("2500000000");

    const decrypted = await decryptInvoiceBlob(encrypted);
    expect(decrypted.serviceTitle).toBe("Protocol audit sprint");

    const reveal = await createRevealBundle(decrypted, ["serviceTitle", "currency"]);
    expect(reveal.revealed).toEqual({
      serviceTitle: "Protocol audit sprint",
      currency: "PUSD",
    });
    expect(reveal.revealed).not.toHaveProperty("amountMinor");
  });
});
