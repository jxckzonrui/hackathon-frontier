import { NextResponse } from "next/server";
import { getSnsIdentityProvider } from "@/lib/veilsettle/integrations/identity/provider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const wallet = searchParams.get("wallet");
  const provider = getSnsIdentityProvider();

  if (name) {
    try {
      const resolvedWallet = await provider.resolveName(name);

      if (!resolvedWallet) {
        return NextResponse.json({ error: "SNS name not found" }, { status: 404 });
      }

      return NextResponse.json({ name, wallet: resolvedWallet, source: "sns" });
    } catch {
      return NextResponse.json({ error: "Invalid SNS name" }, { status: 400 });
    }
  }

  if (wallet) {
    const resolvedName = await provider.reverseLookup(wallet);

    if (!resolvedName) {
      return NextResponse.json({ error: "SNS reverse lookup not found" }, { status: 404 });
    }

    return NextResponse.json({ wallet, name: resolvedName, source: "sns" });
  }

  return NextResponse.json({ error: "Missing SNS query" }, { status: 400 });
}
