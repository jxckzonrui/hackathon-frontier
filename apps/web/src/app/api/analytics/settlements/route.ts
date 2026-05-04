import { NextResponse } from "next/server";
import { getSettlementDataProvider } from "@/lib/veilsettle/integrations/data/provider";

export async function GET() {
  const analytics = await getSettlementDataProvider().fetchSettlementAnalytics();

  return NextResponse.json(analytics);
}
