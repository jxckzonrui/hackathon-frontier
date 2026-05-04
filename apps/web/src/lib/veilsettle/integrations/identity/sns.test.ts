import { describe, expect, it } from "vitest";
import { createSnsIdentityProvider } from "./provider";

const wallet = "Client111111111111111111111111111111111111";

describe("SNS identity provider", () => {
  it("resolves .sol names and reverse lookups through an injectable SNS resolver", async () => {
    const provider = createSnsIdentityProvider({
      resolveDomain: async (name) => (name === "client.sol" ? wallet : null),
      reverseLookup: async (address) => (address === wallet ? "client.sol" : null),
    });

    await expect(provider.resolveName("client.sol")).resolves.toBe(wallet);
    await expect(provider.reverseLookup(wallet)).resolves.toBe("client.sol");
  });

  it("rejects invalid SNS names and only displays names after opt-in", async () => {
    const provider = createSnsIdentityProvider({
      resolveDomain: async () => wallet,
      reverseLookup: async () => "client.sol",
    });

    await expect(provider.resolveName("Client.sol")).rejects.toThrow("Invalid SNS name");
    await expect(
      provider.displayIdentity({
        name: "client.sol",
        wallet,
        optIn: true,
      }),
    ).resolves.toBe("client.sol");
    await expect(
      provider.displayIdentity({
        name: "client.sol",
        wallet,
        optIn: false,
      }),
    ).resolves.toBe("Clie...1111");
  });

  it("does not report live SNS configuration from an RPC URL without a safe resolver", () => {
    const provider = createSnsIdentityProvider({
      rpcUrl: "https://example.invalid",
    });

    expect(provider.status()).toEqual(
      expect.objectContaining({
        state: "fallback",
      }),
    );
  });
});
