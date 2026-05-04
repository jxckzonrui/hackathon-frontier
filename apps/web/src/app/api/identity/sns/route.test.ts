import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/veilsettle/integrations/identity/provider", () => ({
  getSnsIdentityProvider: () => ({
    resolveName: async (name: string) => (name === "client.sol" ? "Client111111111111111111111111111111111111" : null),
    reverseLookup: async (wallet: string) =>
      wallet === "Client111111111111111111111111111111111111" ? "client.sol" : null,
  }),
}));

describe("SNS identity API route", () => {
  it("resolves names and reverse lookups without exposing identity unless requested", async () => {
    const { GET } = await import("./route");

    const resolved = await GET(new Request("http://localhost/api/identity/sns?name=client.sol"));
    expect(resolved.status).toBe(200);
    await expect(resolved.json()).resolves.toEqual({
      name: "client.sol",
      wallet: "Client111111111111111111111111111111111111",
      source: "sns",
    });

    const reversed = await GET(
      new Request(
        "http://localhost/api/identity/sns?wallet=Client111111111111111111111111111111111111",
      ),
    );
    expect(reversed.status).toBe(200);
    await expect(reversed.json()).resolves.toEqual({
      wallet: "Client111111111111111111111111111111111111",
      name: "client.sol",
      source: "sns",
    });
  });
});
