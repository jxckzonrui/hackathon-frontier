import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";
import { emitEarlyPaymentEvent } from "@/lib/veilsettle/torque";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const paymentProofSchema = z.object({
  paymentProofReference: z.string().min(1),
  transactionSignature: z.string().min(1),
  paidAt: z.string().datetime(),
  dueDate: z.string().min(10),
});

const allowedProofPrefixes = ["magicblock:", "cloak:", "umbra:", "mock:"];

export async function POST(request: Request, context: RouteContext) {
  const parsed = paymentProofSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment proof payload" }, { status: 400 });
  }

  const { id } = await context.params;
  const body = parsed.data;

  if (!allowedProofPrefixes.some((prefix) => body.paymentProofReference.startsWith(prefix))) {
    return NextResponse.json({ error: "Unsupported payment proof provider" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_proof_reference: body.paymentProofReference,
        paid_at: body.paidAt,
      })
      .eq("id", id)
      .eq("status", "created");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  await emitEarlyPaymentEvent({
    eventName: "invoice_paid_early",
    invoiceId: id,
    paidAt: body.paidAt,
    dueDate: body.dueDate,
  });

  return NextResponse.json({ status: "paid" });
}
