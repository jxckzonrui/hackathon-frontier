import { PublicKey } from "@solana/web3.js";
import { displayIdentity, isSnsName, normalizeSnsName } from "../../sns";
import type { IntegrationProviderStatus } from "../status";

export type IdentityDisplayRequest = {
  name: string;
  wallet: string;
  optIn: boolean;
};

type SnsIdentityProviderOptions = {
  rpcUrl?: string;
  resolveDomain?: (name: string) => Promise<string | null>;
  reverseLookup?: (wallet: string) => Promise<string | null>;
};

type SnsSdkResolverOptions = {
  rpcUrl?: string;
  resolveDomain?: (request: { domain: string }) => Promise<string | null>;
  reverseLookup?: (request: { wallet: string }) => Promise<string | null>;
  fetcher?: typeof fetch;
};

export type IdentityProvider = {
  resolveName(name: string): Promise<string | null>;
  reverseLookup(wallet: string): Promise<string | null>;
  displayIdentity(request: IdentityDisplayRequest): Promise<string>;
  status(): IntegrationProviderStatus;
};

const unresolvedSnsLookup = async () => null;

export function createSnsSdkResolver(options: SnsSdkResolverOptions = {}): SnsIdentityProviderOptions {
  const rpcUrl = options.rpcUrl?.trim();

  if (options.resolveDomain || options.reverseLookup) {
    return {
      rpcUrl,
      resolveDomain: options.resolveDomain
        ? (name) => options.resolveDomain?.({ domain: name }) ?? Promise.resolve(null)
        : undefined,
      reverseLookup: options.reverseLookup
        ? (wallet) => options.reverseLookup?.({ wallet }) ?? Promise.resolve(null)
        : undefined,
    };
  }

  if (!rpcUrl) {
    return { rpcUrl };
  }

  const rpcEndpoint = rpcUrl;
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);

  async function callSnsRpc(method: string, params: string[]): Promise<string | null> {
    const response = await fetcher(rpcEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "veilsettle-sns",
        method,
        params,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as { result?: unknown } | null;
    const result = payload?.result;

    if (typeof result === "string") {
      return result;
    }

    if (
      result &&
      typeof result === "object" &&
      "value" in result &&
      typeof result.value === "string"
    ) {
      return result.value;
    }

    return null;
  }

  return {
    rpcUrl,
    async resolveDomain(name) {
      try {
        return callSnsRpc("sns_resolveDomain", [name]);
      } catch {
        return null;
      }
    },
    async reverseLookup(wallet) {
      try {
        const owner = new PublicKey(wallet);
        const resolvedName = await callSnsRpc("sns_reverseLookup", [owner.toBase58()]);

        return resolvedName ? normalizeSnsName(resolvedName) : null;
      } catch {
        return null;
      }
    },
  };
}

export function createSnsIdentityProvider(
  options: SnsIdentityProviderOptions = {},
): IdentityProvider {
  const resolveDomain = options.resolveDomain ?? unresolvedSnsLookup;
  const reverseLookupDomain = options.reverseLookup ?? unresolvedSnsLookup;
  const hasResolver = Boolean(options.resolveDomain || options.reverseLookup);
  const shouldVerifyDisplay = Boolean(options.resolveDomain);

  return {
    async resolveName(name) {
      const normalized = normalizeSnsName(name);

      if (!isSnsName(name) || normalized !== name) {
        throw new Error("Invalid SNS name");
      }

      return resolveDomain(normalized);
    },
    reverseLookup(wallet) {
      return reverseLookupDomain(wallet);
    },
    async displayIdentity(request) {
      if (!request.optIn) {
        return displayIdentity("", request.wallet);
      }

      if (!isSnsName(request.name)) {
        return displayIdentity("", request.wallet);
      }

      if (!shouldVerifyDisplay) {
        return request.name;
      }

      const resolvedWallet = await resolveDomain(request.name).catch(() => null);

      if (resolvedWallet !== request.wallet) {
        return displayIdentity("", request.wallet);
      }

      return request.name;
    },
    status() {
      return {
        category: "identity",
        id: "sns-opt-in-resolution",
        label: "SNS identity",
        state: hasResolver ? "configured" : "fallback",
        publicSafe: true,
        detail: hasResolver
          ? "Resolves .sol names and reverse lookup only for opt-in merchant display."
          : "SNS provider contract is available; live resolver is disabled until a safe dependency or API path is configured.",
      };
    },
  };
}

export const optInSnsIdentityProvider: IdentityProvider = createSnsIdentityProvider({
  rpcUrl: process.env.SOLANA_RPC_URL,
});

export function getSnsIdentityProvider(): IdentityProvider {
  return createSnsIdentityProvider(createSnsSdkResolver({
    rpcUrl: process.env.SOLANA_RPC_URL,
  }));
}
