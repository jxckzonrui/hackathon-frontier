import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrivatePaymentProvider } from "@/lib/veilsettle/integrations/privacy/provider";

const privatePaymentSchema = z.object({
  invoiceId: z.string().min(1),
  senderWallet: z.string().min(32),
  recipientWallet: z.string().min(32),
  amountMinor: z.string().regex(/^[1-9][0-9]*$/),
  currency: z.enum(["PUSD", "USDC", "USDT"]),
  mint: z.string().min(32).optional(),
  cluster: z.enum(["mainnet", "devnet"]).optional(),
});

export async function POST(request: Request) {
  const parsed = privatePaymentSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid private payment payload" }, { status: 400 });
  }

  try {
    const result = await getPrivatePaymentProvider().preparePayment(parsed.data);

    return NextResponse.json({
      provider: result.provider,
      paymentProofReference: result.paymentProofReference,
      transactionSignature: result.transactionSignature,
      unsignedTransactionBase64: result.unsignedTransactionBase64,
      sendTo: result.sendTo,
      requiredSigners: result.requiredSigners,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Private payment preparation failed" },
      { status: 502 },
    );
  }
}
