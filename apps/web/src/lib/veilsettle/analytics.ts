import type { PublicInvoiceStatus } from "./types";

export type SettlementEvent = {
  invoiceId: string;
  status: PublicInvoiceStatus;
  paymentProofReference: string | null;
  observedAt: string;
};

export async function fetchSettlementEvents(): Promise<SettlementEvent[]> {
  return [
    {
      invoiceId: "demo-invoice",
      status: "paid",
      paymentProofReference: "cloak-proof-demo",
      observedAt: "2026-05-02T12:00:00.000Z",
    },
  ];
}
