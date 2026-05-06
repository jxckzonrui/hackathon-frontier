export type StablecoinSymbol = "PUSD" | "USDC" | "USDT";

export type InvoiceLineItem = {
  label: string;
  amountMinor: string;
};

export type InvoiceDraft = {
  clientDisplay: string;
  clientWallet: string;
  amountMinor: string;
  currency: StablecoinSymbol;
  dueDate: string;
  serviceTitle: string;
  lineItems: InvoiceLineItem[];
  memo: string;
  attachmentHash: string;
};

export type InvoiceCommitments = {
  metadataHash: string;
  amountCommitment: string;
  dueDateHash: string;
  payerHash: string;
};

export type PublicInvoiceStatus = "created" | "paid" | "voided";
