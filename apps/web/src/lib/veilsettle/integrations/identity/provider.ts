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

export type IdentityProvider = {
  resolveName(name: string): Promise<string | null>;
  reverseLookup(wallet: string): Promise<string | null>;
  displayIdentity(request: IdentityDisplayRequest): Promise<string>;
  status(): IntegrationProviderStatus;
};

const unresolvedSnsLookup = async () => null;

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
  return createSnsIdentityProvider({
    rpcUrl: process.env.SOLANA_RPC_URL,
  });
}
