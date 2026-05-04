import { createHash } from "node:crypto";
import { fetchSettlementEvents, type SettlementEvent } from "../../analytics";
import type { IntegrationProviderStatus } from "../status";

export type RedactedSettlementEvent = {
  invoiceHash: string;
  status: SettlementEvent["status"];
  paymentProofReference: string | null;
  observedAt: string;
};

export type SettlementAnalytics = {
  source: "static" | "dune-sim";
  paidCount: number;
  events: RedactedSettlementEvent[];
  redacted: true;
};

export type SettlementDataProvider = {
  fetchSettlementEvents(): Promise<SettlementEvent[]>;
  fetchSettlementAnalytics(): Promise<SettlementAnalytics>;
  status(): IntegrationProviderStatus;
};

type Fetcher = (
  input: string,
  init?: RequestInit,
) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

type DuneSettlementDataProviderOptions = {
  apiKey?: string;
  settlementWallet?: string;
  fetcher?: Fetcher;
  apiUrl?: string;
  limit?: number;
};

const duneSimApiUrl = "https://api.sim.dune.com";

function redactedHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function toRedactedSettlementEvents(events: SettlementEvent[]): RedactedSettlementEvent[] {
  return events.map((event) => ({
    invoiceHash: redactedHash(event.invoiceId),
    status: event.status,
    paymentProofReference: event.paymentProofReference
      ? `proof:${redactedHash(event.paymentProofReference)}`
      : null,
    observedAt: event.observedAt,
  }));
}

async function fetchStaticSettlementAnalytics(): Promise<SettlementAnalytics> {
  const events = toRedactedSettlementEvents(await fetchSettlementEvents());

  return {
    source: "static",
    paidCount: events.filter((event) => event.status === "paid").length,
    events,
    redacted: true,
  };
}

function getTransactionSignature(transaction: unknown): string {
  const record = transaction as {
    raw_transaction?: {
      transaction?: {
        signatures?: unknown[];
      };
    };
    block_slot?: unknown;
  };
  const signature = record.raw_transaction?.transaction?.signatures?.[0];

  if (typeof signature === "string" && signature.length > 0) {
    return signature;
  }

  return String(record.block_slot ?? "unknown-transaction");
}

function getObservedAt(transaction: unknown): string {
  const record = transaction as {
    block_time?: unknown;
    raw_transaction?: {
      blockTime?: unknown;
    };
  };

  if (typeof record.block_time === "number") {
    return new Date(Math.floor(record.block_time / 1000)).toISOString();
  }

  if (typeof record.raw_transaction?.blockTime === "number") {
    return new Date(record.raw_transaction.blockTime * 1000).toISOString();
  }

  return new Date(0).toISOString();
}

function getSettlementStatus(transaction: unknown): SettlementEvent["status"] {
  const record = transaction as {
    raw_transaction?: {
      meta?: {
        err?: unknown;
      };
    };
  };

  return record.raw_transaction?.meta?.err ? "voided" : "paid";
}

export function createDuneSettlementDataProvider(
  options: DuneSettlementDataProviderOptions = {},
): SettlementDataProvider {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const apiUrl = (options.apiUrl ?? duneSimApiUrl).replace(/\/+$/, "");
  const limit = options.limit ?? 20;

  return {
    fetchSettlementEvents,
    async fetchSettlementAnalytics() {
      if (!options.apiKey || !options.settlementWallet) {
        return fetchStaticSettlementAnalytics();
      }

      const response = await fetcher(
        `${apiUrl}/beta/svm/transactions/${encodeURIComponent(options.settlementWallet)}?limit=${limit}`,
        {
          method: "GET",
          headers: { "X-Sim-Api-Key": options.apiKey },
        },
      );

      if (!response.ok) {
        throw new Error(`Dune SIM request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as { transactions?: unknown[] };
      const events = (payload.transactions ?? []).map((transaction) => {
        const signature = getTransactionSignature(transaction);

        return {
          invoiceHash: redactedHash(signature),
          status: getSettlementStatus(transaction),
          paymentProofReference: `sim:${redactedHash(signature)}`,
          observedAt: getObservedAt(transaction),
        };
      });

      return {
        source: "dune-sim",
        paidCount: events.filter((event) => event.status === "paid").length,
        events,
        redacted: true,
      };
    },
    status() {
      return {
        category: "data",
        id: "dune-sim-settlement-analytics",
        label: "Dune SIM settlement analytics",
        state: options.apiKey && options.settlementWallet ? "configured" : "fallback",
        publicSafe: true,
        detail: "Uses SVM transactions and returns hashed settlement identifiers only.",
      };
    },
  };
}

export const staticSettlementDataProvider: SettlementDataProvider = {
  fetchSettlementEvents,
  fetchSettlementAnalytics: fetchStaticSettlementAnalytics,
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

export function getSettlementDataProvider(): SettlementDataProvider {
  if (process.env.DUNE_SIM_API_KEY || process.env.DUNE_SIM_WALLET_ADDRESS) {
    return createDuneSettlementDataProvider({
      apiKey: process.env.DUNE_SIM_API_KEY,
      settlementWallet: process.env.DUNE_SIM_WALLET_ADDRESS,
    });
  }

  return staticSettlementDataProvider;
}
