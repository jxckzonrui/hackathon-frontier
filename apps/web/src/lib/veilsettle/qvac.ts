import type { InvoiceDraft } from "./types";

export type QvacInvoiceCheck = {
  severity: "ok" | "warning";
  label: string;
  detail: string;
};

export async function runLocalInvoiceChecks(
  draft: InvoiceDraft,
  knownHashes: string[],
): Promise<QvacInvoiceCheck[]> {
  return [
    {
      severity: draft.lineItems.length > 0 ? "ok" : "warning",
      label: "Line items",
      detail:
        draft.lineItems.length > 0
          ? "Invoice has itemized services."
          : "Invoice has no itemized services.",
    },
    {
      severity: knownHashes.includes(draft.attachmentHash) ? "warning" : "ok",
      label: "Duplicate attachment hash",
      detail: knownHashes.includes(draft.attachmentHash)
        ? "Attachment hash already appeared locally."
        : "No local duplicate found.",
    },
    {
      severity: draft.clientDisplay.endsWith(".sol") ? "ok" : "warning",
      label: "SNS identity",
      detail: draft.clientDisplay.endsWith(".sol")
        ? "Client display name is SNS-shaped."
        : "Client display is not SNS-shaped.",
    },
  ];
}
