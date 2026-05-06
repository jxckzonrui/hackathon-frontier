import type { InvoiceCommitments, InvoiceDraft } from "./types";

type CanonicalValue =
  | string
  | number
  | boolean
  | null
  | CanonicalValue[]
  | { [key: string]: CanonicalValue };

const textEncoder = new TextEncoder();

function canonicalJson(value: CanonicalValue): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }

  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(value),
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function createInvoiceCommitments(
  draft: InvoiceDraft,
): Promise<InvoiceCommitments> {
  const metadata = {
    attachmentHash: draft.attachmentHash,
    currency: draft.currency,
    lineItems: draft.lineItems,
    memo: draft.memo,
    serviceTitle: draft.serviceTitle,
  };

  const [metadataHash, amountCommitment, dueDateHash, payerHash] =
    await Promise.all([
      sha256Hex(canonicalJson(metadata)),
      sha256Hex(`${draft.currency}:${draft.amountMinor}`),
      sha256Hex(draft.dueDate),
      sha256Hex(draft.clientWallet),
    ]);

  return {
    metadataHash,
    amountCommitment,
    dueDateHash,
    payerHash,
  };
}
