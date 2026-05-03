import { fetchSettlementEvents, type SettlementEvent } from "../../analytics";
import type { IntegrationProviderStatus } from "../status";

export type SettlementDataProvider = {
  fetchSettlementEvents(): Promise<SettlementEvent[]>;
  status(): IntegrationProviderStatus;
};

export const staticSettlementDataProvider: SettlementDataProvider = {
  fetchSettlementEvents,
  status() {
    return {
      category: "data",
      id: "static-settlement-events",
      label: "Settlement analytics",
      state: "mock",
      publicSafe: true,
      detail: "Static privacy-safe events; Dune SIM and GoldRush adapters are next.",
    };
  },
};
