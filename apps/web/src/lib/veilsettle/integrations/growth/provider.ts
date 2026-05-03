import { emitEarlyPaymentEvent, type TorqueEventPayload } from "../../torque";
import type { IntegrationProviderStatus } from "../status";

export type GrowthEventProvider = {
  emitEvent(payload: TorqueEventPayload): Promise<{ queued: boolean }>;
  status(): IntegrationProviderStatus;
};

export const torqueGrowthProvider: GrowthEventProvider = {
  emitEvent: emitEarlyPaymentEvent,
  status() {
    return {
      category: "growth",
      id: "torque-early-payment",
      label: "Torque early-payment event",
      state: process.env.TORQUE_API_KEY || process.env.TORQUE_API_TOKEN ? "configured" : "fallback",
      publicSafe: true,
      detail: "Queues early-payment events without exposing private invoice details.",
    };
  },
};
