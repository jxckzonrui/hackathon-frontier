import { createRequire } from "node:module";
import { Connection, PublicKey } from "@solana/web3.js";
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

type SnsSdk = {
  resolve(connection: Connection, domain: string): Promise<PublicKey>;
  getFavoriteDomain(
    connection: Connection,
    owner: PublicKey,
  ): Promise<{ reverse: string; stale: boolean }>;
};

export type IdentityProvider = {
  resolveName(name: string): Promise<string | null>;
  reverseLookup(wallet: string): Promise<string | null>;
  displayIdentity(request: IdentityDisplayRequest): Promise<string>;
  status(): IntegrationProviderStatus;
};

const requireSnsSdk = createRequire(import.meta.url);

function loadSnsSdk(): SnsSdk {
  return requireSnsSdk("@bonfida/spl-name-service") as SnsSdk;
}

function createDefaultResolveDomain(rpcUrl?: string) {
  if (!rpcUrl) {
    return async () => null;
  }

  const connection = new Connection(rpcUrl);

  return async (name: string) => {
    const publicKey = await loadSnsSdk().resolve(connection, name);

    return publicKey.toBase58();
  };
}

function createDefaultReverseLookup(rpcUrl?: string) {
  if (!rpcUrl) {
    return async () => null;
  }

  const connection = new Connection(rpcUrl);

  return async (wallet: string) => {
    const favoriteDomain = await loadSnsSdk()
      .getFavoriteDomain(connection, new PublicKey(wallet))
      .catch(() => null);

    if (!favoriteDomain || favoriteDomain.stale) {
      return null;
    }

    return normalizeSnsName(favoriteDomain.reverse);
  };
}

export function createSnsIdentityProvider(
  options: SnsIdentityProviderOptions = {},
): IdentityProvider {
  const resolveDomain = options.resolveDomain ?? createDefaultResolveDomain(options.rpcUrl);
  const reverseLookupDomain = options.reverseLookup ?? createDefaultReverseLookup(options.rpcUrl);
  const shouldVerifyDisplay = Boolean(options.rpcUrl || options.resolveDomain);

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
        state: options.rpcUrl ? "configured" : "fallback",
        publicSafe: true,
        detail: "Resolves .sol names and reverse lookup only for opt-in merchant display.",
      };
    },
  };
}

export const optInSnsIdentityProvider: IdentityProvider = createSnsIdentityProvider({
  rpcUrl: process.env.SOLANA_RPC_URL,
});

export function getSnsIdentityProvider(): IdentityProvider {
  return createSnsIdentityProvider({
    rpcUrl: process.env.SOLANA_RPC_URL,
  });
}
