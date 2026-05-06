import {
  runLocalInvoiceReview,
  type QvacInvoiceCheck,
  type QvacReviewSignal,
  type QvacVendorConsistencySignal,
} from "../../qvac";
import type { InvoiceDraft } from "../../types";
import type { IntegrationProviderStatus } from "../status";

export type InvoiceReviewRequest = {
  draft: InvoiceDraft;
  knownAttachmentHashes: string[];
};

export type InvoiceReviewResult = {
  provider: "qvac-local-fallback" | "qvac-local-runtime";
  checks: QvacInvoiceCheck[];
  riskScore: number;
  duplicateSignal: QvacReviewSignal;
  vendorConsistency: QvacVendorConsistencySignal;
  suspiciousTerms: QvacReviewSignal;
  privacyNote: string;
};

export type InvoiceReviewProvider = {
  reviewInvoice(request: InvoiceReviewRequest): Promise<InvoiceReviewResult>;
  status(): IntegrationProviderStatus;
};

export const localInvoiceReviewProvider: InvoiceReviewProvider = {
  async reviewInvoice(request) {
    const review = await runLocalInvoiceReview(request.draft, request.knownAttachmentHashes);

    return {
      provider: "qvac-local-fallback",
      ...review,
    };
  },
  status() {
    return {
      category: "ai",
      id: "qvac-local-fallback",
      label: "QVAC-compatible local fallback",
      state: "fallback",
      publicSafe: true,
      detail: "Runs local deterministic checks until the QVAC runtime is connected.",
    };
  },
};

function assertLocalQvacBaseUrl(rawBaseUrl: string): URL {
  let url: URL;

  try {
    url = new URL(rawBaseUrl);
  } catch {
    throw new Error("QVAC_BASE_URL must be a valid local QVAC runtime URL.");
  }

  const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
  const isLocalhost = localHosts.has(url.hostname);
  const isLoopback = /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname);

  if (!["http:", "https:"].includes(url.protocol) || (!isLocalhost && !isLoopback)) {
    throw new Error("QVAC_BASE_URL must point to a local QVAC runtime.");
  }

  return url;
}

function qvacRuntimeReviewProvider(baseUrl: URL, model: string): InvoiceReviewProvider {
  return {
    async reviewInvoice(request) {
      const review = baseUrl.pathname.replace(/\/+$/, "").endsWith("/v1")
        ? await fetchOpenAiCompatibleReview(baseUrl, model, request)
        : await fetchCustomRuntimeReview(baseUrl, model, request);

      return {
        provider: "qvac-local-runtime",
        checks: review.checks,
        riskScore: review.riskScore,
        duplicateSignal: review.duplicateSignal,
        vendorConsistency: review.vendorConsistency,
        suspiciousTerms: review.suspiciousTerms,
        privacyNote:
          review.privacyNote || "QVAC local runtime active; private invoice text stayed local.",
      };
    },
    status() {
      return {
        category: "ai",
        id: "qvac-local-runtime",
        label: "QVAC local runtime active",
        state: "configured",
        publicSafe: true,
        detail: "Uses a local-only QVAC HTTP runtime; cloud URLs are rejected.",
      };
    },
  };
}

async function fetchCustomRuntimeReview(
  baseUrl: URL,
  model: string,
  request: InvoiceReviewRequest,
): Promise<Omit<InvoiceReviewResult, "provider">> {
  const endpoint = new URL("/review/invoice", baseUrl);
  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      draft: request.draft,
      knownAttachmentHashes: request.knownAttachmentHashes,
    }),
  });

  if (!response.ok) {
    return runFallbackReview(request);
  }

  return (await response.json()) as Omit<InvoiceReviewResult, "provider">;
}

async function fetchOpenAiCompatibleReview(
  baseUrl: URL,
  model: string,
  request: InvoiceReviewRequest,
): Promise<Omit<InvoiceReviewResult, "provider">> {
  const endpoint = new URL("chat/completions", baseUrl.href.endsWith("/") ? baseUrl : `${baseUrl.href}/`);
  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Review a private invoice locally. Return only compact JSON with keys checks, riskScore, duplicateSignal, vendorConsistency, suspiciousTerms, privacyNote. Do not echo invoice amounts, memos, line items, wallet addresses, or attachment hashes.",
        },
        {
          role: "user",
          content: JSON.stringify({
            draft: request.draft,
            knownAttachmentHashes: request.knownAttachmentHashes,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    return runFallbackReview(request);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return runFallbackReview(request);
  }

  try {
    return JSON.parse(extractJsonObject(content)) as Omit<InvoiceReviewResult, "provider">;
  } catch {
    return runFallbackReview(request);
  }
}

function extractJsonObject(content: string): string {
  const fencedJson = /```json\s*([\s\S]*?)\s*```/i.exec(content);

  if (fencedJson?.[1]) {
    return fencedJson[1];
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return content;
  }

  return content.slice(firstBrace, lastBrace + 1);
}

async function runFallbackReview(
  request: InvoiceReviewRequest,
): Promise<Omit<InvoiceReviewResult, "provider">> {
  const review = await localInvoiceReviewProvider.reviewInvoice(request);

  return {
    checks: review.checks,
    riskScore: review.riskScore,
    duplicateSignal: review.duplicateSignal,
    vendorConsistency: review.vendorConsistency,
    suspiciousTerms: review.suspiciousTerms,
    privacyNote:
      "QVAC local runtime unavailable; deterministic local fallback kept private invoice details on this machine.",
  };
}

export function getInvoiceReviewProvider(): InvoiceReviewProvider {
  const baseUrl = process.env.QVAC_BASE_URL?.trim();

  if (!baseUrl) {
    return localInvoiceReviewProvider;
  }

  return qvacRuntimeReviewProvider(
    assertLocalQvacBaseUrl(baseUrl),
    process.env.QVAC_MODEL?.trim() || "qvac-local-invoice-review",
  );
}
