import { describe, expect, it, vi } from "vitest";
import { createRpcStatusProvider } from "./rpc";

describe("RPC status provider", () => {
  it("verifies RPC Fast-like endpoints without exposing the endpoint URL", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ result: "ok" }),
    });
    const provider = createRpcStatusProvider({
      rpcUrl: "https://example.rpcfast.com/private-token",
      fetcher,
    });

    const status = await provider.checkHealth();

    expect(fetcher).toHaveBeenCalledWith(
      "https://example.rpcfast.com/private-token",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"method":"getHealth"'),
      }),
    );
    expect(status).toMatchObject({
      provider: "rpc-fast",
      healthy: true,
      evidence: "getHealth=ok",
      endpointPublic: false,
    });
    expect(JSON.stringify(status)).not.toContain("private-token");
  });

  it("downgrades unconfirmed endpoints to generic Solana RPC fallback", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ result: "ok" }),
    });
    const provider = createRpcStatusProvider({
      rpcUrl: "https://api.devnet.solana.com",
      fetcher,
    });

    await expect(provider.checkHealth()).resolves.toMatchObject({
      provider: "generic-solana-rpc",
      healthy: true,
      claimable: false,
    });
  });

  it("reports missing endpoints as fallback evidence", async () => {
    const provider = createRpcStatusProvider();

    await expect(provider.checkHealth()).resolves.toMatchObject({
      provider: "generic-solana-rpc",
      healthy: false,
      claimable: false,
      evidence: "SOLANA_RPC_URL is not configured",
    });
  });
});
