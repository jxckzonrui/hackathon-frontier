"use client";

import { Loader2, ReceiptText, WalletCards } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PaymentSettlementActionsProps = {
  invoiceId: string;
};

type PrivatePaymentResponse = {
  error?: string;
  paymentProofReference?: string;
  transactionSignature?: string;
  unsignedTransactionBase64?: string;
};

export function PaymentSettlementActions({ invoiceId }: PaymentSettlementActionsProps) {
  const [status, setStatus] = useState("Ready to prepare proof");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);

  async function preparePaymentProof() {
    setIsPreparing(true);
    setStatus("Preparing private payment proof...");

    try {
      const paymentResponse = await fetch("/api/privacy/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          senderWallet: "Client111111111111111111111111111111111111",
          recipientWallet: "Agency111111111111111111111111111111111111",
          amountMinor: "2500000000",
          currency: "USDC",
          cluster: "devnet",
        }),
      });
      const paymentJson = (await paymentResponse.json()) as PrivatePaymentResponse;

      if (!paymentResponse.ok || !paymentJson.paymentProofReference) {
        setStatus(paymentJson.error ?? "Private payment preparation failed");
        return;
      }

      if (invoiceId !== "demo-invoice") {
        const response = await fetch(`/api/invoices/${invoiceId}/payment-proof`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentProofReference: paymentJson.paymentProofReference,
            transactionSignature:
              paymentJson.transactionSignature ??
              paymentJson.unsignedTransactionBase64 ??
              "unsigned-transaction-prepared",
            paidAt: "2026-05-07T12:00:00.000Z",
            dueDate: "2026-05-08",
          }),
        });
        const json = (await response.json()) as { error?: string; status?: string };

        if (!response.ok && json.error !== "Server configuration error") {
          setStatus(json.error ?? "Payment proof failed");
          return;
        }
      }

      setIsPrepared(true);
      setStatus(
        paymentJson.transactionSignature
          ? "Payment proof prepared"
          : "Unsigned private payment prepared for wallet signing",
      );
    } catch {
      setStatus("Payment proof failed");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <button
        className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isPreparing}
        onClick={preparePaymentProof}
        type="button"
      >
        {isPreparing ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <WalletCards aria-hidden="true" className="size-4" />
        )}
        Prepare private payment
      </button>
      <p className="mt-3 min-h-5 text-sm text-slate-600">{status}</p>
      {isPrepared ? (
        <Link
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-950"
          href={`/verify/${invoiceId}`}
        >
          <ReceiptText aria-hidden="true" className="size-4" />
          Verify settlement
        </Link>
      ) : null}
    </div>
  );
}
