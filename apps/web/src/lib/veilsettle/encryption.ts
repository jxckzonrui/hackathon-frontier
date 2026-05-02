import type { InvoiceDraft, InvoiceLineItem } from "./types";

export type EncryptedInvoiceBlob = {
  schemaVersion: 1;
  ciphertext: string;
  iv: string;
  recipients: string[];
};

export type RevealableField = keyof Pick<
  InvoiceDraft,
  "serviceTitle" | "currency" | "dueDate" | "lineItems" | "memo" | "attachmentHash" | "clientDisplay"
>;

export type RevealedInvoiceFields = Partial<
  Omit<Pick<InvoiceDraft, RevealableField>, "lineItems"> & {
    lineItems: Pick<InvoiceLineItem, "label">[];
  }
>;

export type ReceiptRevealBundle = {
  revealed: RevealedInvoiceFields;
  revealScope: RevealableField[];
  createdAt: string;
};

let lastKey: CryptoKey | null = null;

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const decoded = atob(value);
  const bytes = new Uint8Array(new ArrayBuffer(decoded.length));
  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }
  return bytes;
}

export async function encryptInvoiceBlob(
  draft: InvoiceDraft,
  recipients: string[],
): Promise<EncryptedInvoiceBlob> {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  lastKey = key;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(draft));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return {
    schemaVersion: 1,
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    iv: toBase64(iv),
    recipients: [...recipients],
  };
}

export async function decryptInvoiceBlob(blob: EncryptedInvoiceBlob): Promise<InvoiceDraft> {
  if (!lastKey) {
    throw new Error("Missing invoice key in this demo session");
  }

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(blob.iv) },
    lastKey,
    fromBase64(blob.ciphertext),
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as InvoiceDraft;
}

export async function createRevealBundle(
  draft: InvoiceDraft,
  fields: RevealableField[],
): Promise<ReceiptRevealBundle> {
  const revealed: ReceiptRevealBundle["revealed"] = {};
  for (const field of fields) {
    if (field === "lineItems") {
      revealed.lineItems = draft.lineItems.map(({ label }) => ({ label }));
    } else {
      revealed[field] = draft[field] as never;
    }
  }
  return {
    revealed,
    revealScope: [...fields],
    createdAt: new Date("2026-05-02T00:00:00.000Z").toISOString(),
  };
}
