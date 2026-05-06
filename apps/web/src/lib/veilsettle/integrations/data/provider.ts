import { createHash } from "node:crypto";
import { PublicKey } from "@solana/web3.js";
import { fetchSettlementEvents, type SettlementEvent } from "../../analytics";
import type { IntegrationProviderStatus } from "../status";

export type RedactedSettlementEvent = {
  invoiceHash: string;
  status: SettlementEvent["status"];
  paymentProofReference: string | null;
  observedAt: string;
};

export type SettlementAnalytics = {
  source: "static" | "dune-sim" | "rpc-fast";
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
  rpcUrl?: string;
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

function getSolanaPublicKey(address: string | undefined): PublicKey | null {
  const trimmedAddress = address?.trim();

  if (!trimmedAddress) {
    return null;
  }

  try {
    return new PublicKey(trimmedAddress);
  } catch {
    return null;
  }
}

function getDuneBalancesPath(wallet: PublicKey): string {
  return `/beta/svm/balances/${encodeURIComponent(wallet.toBase58())}`;
}

async function fetchRpcFastSettlementAnalytics(
  fetcher: Fetcher,
  rpcUrl: string | undefined,
  wallet: PublicKey,
): Promise<SettlementAnalytics> {
  if (!rpcUrl) {
    return fetchStaticSettlementAnalytics();
  }

  const response = await fetcher(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "veilsettle-dune-fallback",
      method: "getBalance",
      params: [wallet.toBase58()],
    }),
  });

  if (!response.ok) {
    return fetchStaticSettlementAnalytics();
  }

  const payload = (await response.json()) as {
    result?: {
      value?: unknown;
    };
  };
  const lamports = typeof payload.result?.value === "number" ? payload.result.value : 0;
  const proofReference = `rpc:${redactedHash(`${wallet.toBase58()}:${lamports}`)}`;

  return {
    source: "rpc-fast",
    paidCount: lamports > 0 ? 1 : 0,
    events: [
      {
        invoiceHash: redactedHash(wallet.toBase58()),
        status: lamports > 0 ? "paid" : "created",
        paymentProofReference: proofReference,
        observedAt: new Date(0).toISOString(),
      },
    ],
    redacted: true,
  };
}

function toDuneBalanceEvents(balances: unknown[], wallet: PublicKey): RedactedSettlementEvent[] {
  return balances.map((balance, index) => {
    const record = balance as {
      chain?: unknown;
      address?: unknown;
      amount?: unknown;
      balance?: unknown;
    };
    const chain = typeof record.chain === "string" ? record.chain : "solana";
    const tokenAddress = typeof record.address === "string" ? record.address : `balance-${index}`;
    const tokenAmount =
      typeof record.amount === "string" || typeof record.amount === "number"
        ? String(record.amount)
        : String(record.balance ?? "0");
    const reference = `${wallet.toBase58()}:${chain}:${tokenAddress}:${tokenAmount}`;

    return {
      invoiceHash: redactedHash(`${chain}:${tokenAddress}`),
      status: tokenAmount !== "0" ? "paid" : "created",
      paymentProofReference: `sim:${redactedHash(reference)}`,
      observedAt: new Date(0).toISOString(),
    };
  });
}

export function createDuneSettlementDataProvider(
  options: DuneSettlementDataProviderOptions = {},
): SettlementDataProvider {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const apiUrl = (options.apiUrl ?? duneSimApiUrl).replace(/\/+$/, "");
  const limit = options.limit ?? 10;

  return {
    fetchSettlementEvents,
    async fetchSettlementAnalytics() {
      const wallet = getSolanaPublicKey(options.settlementWallet);

      if (!options.apiKey || !wallet) {
        return fetchStaticSettlementAnalytics();
      }

      const response = await fetcher(
        `${apiUrl}${getDuneBalancesPath(wallet)}?chains=solana&limit=${limit}`,
        {
          method: "GET",
          headers: { "X-Sim-Api-Key": options.apiKey },
        },
      );

      if (!response.ok) {
        return fetchRpcFastSettlementAnalytics(fetcher, options.rpcUrl, wallet);
      }

      const payload = (await response.json()) as { balances?: unknown[] };
      const events = toDuneBalanceEvents(payload.balances ?? [], wallet);

      return {
        source: "dune-sim",
        paidCount: events.filter((event) => event.status === "paid").length,
        events,
        redacted: true,
      };
    },
    status() {
      const wallet = getSolanaPublicKey(options.settlementWallet);

      return {
        category: "data",
        id: "dune-sim-settlement-analytics",
        label: "Dune SIM settlement analytics",
        state: options.apiKey && wallet ? "configured" : "fallback",
        publicSafe: true,
        detail: "Uses SVM balances with chains=solana and returns hashed settlement identifiers only.",
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
      rpcUrl: process.env.SOLANA_RPC_URL,
    });
  }

  return staticSettlementDataProvider;
}
