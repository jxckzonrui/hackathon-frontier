import { NextResponse } from "next/server";
import { z } from "zod";
import { localInvoiceReviewProvider } from "@/lib/veilsettle/integrations/ai/provider";

const invoiceDraftSchema = z.object({
  clientDisplay: z.string().min(1),
  clientWallet: z.string().min(32),
  amountMinor: z.string().regex(/^\d+$/),
  currency: z.enum(["PUSD", "USDC", "USDT"]),
  dueDate: z.string().min(10),
  serviceTitle: z.string().min(1),
  lineItems: z
    .array(
      z.object({
        label: z.string().min(1),
        amountMinor: z.string().regex(/^\d+$/),
      }),
    )
    .min(1),
  memo: z.string(),
  attachmentHash: z.string(),
});

const reviewRequestSchema = z.object({
  draft: invoiceDraftSchema,
  knownAttachmentHashes: z.array(z.string()),
});

export async function POST(request: Request) {
  const parsed = reviewRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
  }

  const review = await localInvoiceReviewProvider.reviewInvoice(parsed.data);

  return NextResponse.json(review);
}
