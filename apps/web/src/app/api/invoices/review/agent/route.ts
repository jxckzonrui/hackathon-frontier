import { NextResponse } from "next/server";
import { createLocalInvoiceAgentReview } from "@/lib/veilsettle/integrations/ai/local-agent";
import { getInvoiceReviewProvider } from "@/lib/veilsettle/integrations/ai/provider";
import { reviewRequestSchema } from "../schema";

export async function POST(request: Request) {
  const parsed = reviewRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid agent review payload" }, { status: 400 });
  }

  const review = await getInvoiceReviewProvider().reviewInvoice(parsed.data);
  const agentReview = createLocalInvoiceAgentReview(review);

  return NextResponse.json(agentReview);
}
