import { displayIdentity } from "../../sns";
import type { IntegrationProviderStatus } from "../status";

export type IdentityDisplayRequest = {
  name: string;
  wallet: string;
  optIn: boolean;
};

export type IdentityProvider = {
  displayIdentity(request: IdentityDisplayRequest): Promise<string>;
  status(): IntegrationProviderStatus;
};

export const optInSnsIdentityProvider: IdentityProvider = {
  async displayIdentity(request) {
    if (!request.optIn) {
      return displayIdentity("", request.wallet);
    }

    return displayIdentity(request.name, request.wallet);
  },
  status() {
    return {
      category: "identity",
      id: "sns-opt-in-display",
      label: "SNS identity",
      state: "fallback",
      publicSafe: true,
      detail: "Opt-in display is wired; real SNS resolution is still pending.",
    };
  },
};
