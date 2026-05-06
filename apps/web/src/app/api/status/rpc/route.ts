import { NextResponse } from "next/server";
import { getRpcStatusProvider } from "@/lib/veilsettle/integrations/data/rpc";

export async function GET() {
  const status = await getRpcStatusProvider().checkHealth();

  return NextResponse.json(status);
}
