export type RpcStatusProviderId = "rpc-fast" | "generic-solana-rpc";

export type RpcHealthStatus = {
  provider: RpcStatusProviderId;
  healthy: boolean;
  claimable: boolean;
  evidence: string;
  endpointPublic: false;
};

type RpcStatusFetcher = (
  input: string,
  init?: RequestInit,
) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

type RpcStatusProviderOptions = {
  rpcUrl?: string;
  fetcher?: RpcStatusFetcher;
};

export type RpcStatusProvider = {
  checkHealth(): Promise<RpcHealthStatus>;
};

function isRpcFastEndpoint(rpcUrl: string): boolean {
  return /rpcfast/i.test(rpcUrl);
}

function classifyProvider(rpcUrl: string): RpcStatusProviderId {
  return isRpcFastEndpoint(rpcUrl) ? "rpc-fast" : "generic-solana-rpc";
}

export function createRpcStatusProvider(
  options: RpcStatusProviderOptions = {},
): RpcStatusProvider {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);

  return {
    async checkHealth() {
      const rpcUrl = options.rpcUrl?.trim();

      if (!rpcUrl) {
        return {
          provider: "generic-solana-rpc",
          healthy: false,
          claimable: false,
          evidence: "SOLANA_RPC_URL is not configured",
          endpointPublic: false,
        };
      }

      const provider = classifyProvider(rpcUrl);

      try {
        const response = await fetcher(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "veilsettle-rpc-health",
            method: "getHealth",
          }),
        });
        const payload = (await response.json().catch(() => null)) as { result?: unknown } | null;
        const healthy = response.ok && payload?.result === "ok";

        return {
          provider,
          healthy,
          claimable: provider === "rpc-fast" && healthy,
          evidence: healthy ? "getHealth=ok" : `getHealth failed with HTTP ${response.status}`,
          endpointPublic: false,
        };
      } catch {
        return {
          provider,
          healthy: false,
          claimable: false,
          evidence: "getHealth request failed",
          endpointPublic: false,
        };
      }
    },
  };
}

export function getRpcStatusProvider(): RpcStatusProvider {
  return createRpcStatusProvider({
    rpcUrl: process.env.SOLANA_RPC_URL,
  });
}
