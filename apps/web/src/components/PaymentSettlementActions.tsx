"use client";

import { Loader2, ReceiptText, WalletCards } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ClickSpark } from "./ClickSpark";

type PaymentSettlementActionsProps = {
  invoiceId: string;
  reviewCompleted?: boolean;
  recipientWallet?: string;
};

type PrivatePaymentResponse = {
  provider?: string;
  error?: string;
  paymentProofReference?: string;
  transactionSignature?: string;
  unsignedTransactionBase64?: string;
};

type SolanaBrowserWallet = {
  connect(): Promise<{ publicKey: { toString(): string } }>;
  signTransaction<T>(transaction: T): Promise<T>;
};

declare global {
  interface Window {
    solana?: SolanaBrowserWallet;
  }
}

const defaultDevnetWallet = "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U";
const defaultDevnetRpcUrl = "https://api.devnet.solana.com";

function getBrowserWallet(): SolanaBrowserWallet | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.solana ?? null;
}

function base64ToBytes(value: string): Uint8Array {
  const decoded = atob(value);
  const bytes = new Uint8Array(decoded.length);

  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }

  return bytes;
}

async function deserializeUnsignedTransaction(unsignedTransactionBase64: string) {
  const { Transaction, VersionedTransaction } = await import("@solana/web3.js");
  const bytes = base64ToBytes(unsignedTransactionBase64);

  try {
    return VersionedTransaction.deserialize(bytes);
  } catch {
    return Transaction.from(bytes);
  }
}

async function signAndSubmitPrivatePayment(
  unsignedTransactionBase64: string,
): Promise<string> {
  const wallet = getBrowserWallet();

  if (!wallet) {
    throw new Error("Browser wallet unavailable for signing");
  }

  const { Connection } = await import("@solana/web3.js");
  const transaction = await deserializeUnsignedTransaction(unsignedTransactionBase64);
  const signedTransaction = await wallet.signTransaction(transaction);
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || defaultDevnetRpcUrl;
  const connection = new Connection(rpcUrl, "confirmed");
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  const confirmation = await connection.confirmTransaction(signature, "confirmed");

  if (confirmation.value.err) {
    throw new Error("MagicBlock transaction confirmation failed");
  }

  return signature;
}

export function PaymentSettlementActions({
  invoiceId,
  reviewCompleted = true,
  recipientWallet,
}: PaymentSettlementActionsProps) {
  const [status, setStatus] = useState(
    reviewCompleted
      ? "Ready to prepare proof"
      : "Complete local invoice review before private payment preparation",
  );
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);

  async function preparePaymentProof() {
    if (!reviewCompleted) {
      setStatus("Complete local invoice review before private payment preparation");
      return;
    }

    setIsPreparing(true);
    setStatus("Preparing private payment proof...");

    try {
      const wallet = getBrowserWallet();
      const connectedWallet = wallet ? await wallet.connect() : null;
      const senderWallet = connectedWallet?.publicKey.toString() ?? defaultDevnetWallet;
      const paymentRecipientWallet =
        recipientWallet ?? process.env.NEXT_PUBLIC_DEMO_RECIPIENT_WALLET ?? senderWallet;

      const paymentResponse = await fetch("/api/privacy/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          senderWallet,
          recipientWallet: paymentRecipientWallet,
          amountMinor: process.env.NEXT_PUBLIC_MAGICBLOCK_TEST_AMOUNT_MINOR ?? "1",
          currency: "USDC",
          cluster: "devnet",
        }),
      });
      const paymentJson = (await paymentResponse.json()) as PrivatePaymentResponse;

      if (!paymentResponse.ok || !paymentJson.paymentProofReference) {
        setStatus(paymentJson.error ?? "Private payment preparation failed");
        return;
      }

      if (!paymentJson.transactionSignature) {
        if (!paymentJson.unsignedTransactionBase64) {
          setIsPrepared(false);
          setStatus("Unsigned private payment prepared for wallet signing");
          return;
        }

        setStatus("Signing private payment with browser wallet...");

        try {
          paymentJson.transactionSignature = await signAndSubmitPrivatePayment(
            paymentJson.unsignedTransactionBase64,
          );
          setStatus("Submitted MagicBlock transaction");
        } catch (error) {
          setIsPrepared(false);
          setStatus(
            error instanceof Error
              ? `Unsigned private payment prepared; ${error.message}`
              : "Unsigned private payment prepared for wallet signing",
          );
          return;
        }
      }

      if (invoiceId !== "demo-invoice") {
        const response = await fetch(`/api/invoices/${invoiceId}/payment-proof`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentProofReference: paymentJson.paymentProofReference,
            transactionSignature: paymentJson.transactionSignature,
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
        paymentJson.provider === "magicblock"
          ? "Submitted MagicBlock transaction"
          : "Payment proof prepared",
      );
    } catch {
      setStatus("Payment proof failed");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <ClickSpark sparkColor="#19b98d" sparkRadius={22} sparkSize={9}>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isPreparing || !reviewCompleted}
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
      </ClickSpark>
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
