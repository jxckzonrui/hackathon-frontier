import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/veilsettle/storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  let data: unknown;
  let error: unknown;

  try {
    const supabase = getSupabaseServerClient();
    const result = await supabase
      .from("invoices")
      .select(
        "id,status,metadata_hash,amount_commitment,due_date_hash,payment_proof_reference,created_at,paid_at",
      )
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (error || !data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
