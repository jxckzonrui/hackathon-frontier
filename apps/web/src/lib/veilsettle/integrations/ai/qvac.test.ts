import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvoiceDraft } from "../../types";
import { getInvoiceReviewProvider, localInvoiceReviewProvider } from "./provider";

const draft: InvoiceDraft = {
  clientDisplay: "client.sol",
  clientWallet: "Client111111111111111111111111111111111111",
  amountMinor: "2500000000",
  currency: "PUSD",
  dueDate: "2026-05-08",
  serviceTitle: "Protocol audit sprint",
  lineItems: [{ label: "Audit", amountMinor: "2500000000" }],
  memo: "Do not echo this private memo",
  attachmentHash: "sha256-demo-attachment",
};

describe("QVAC local invoice review provider", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns local review signals without echoing private invoice content", async () => {
    const review = await localInvoiceReviewProvider.reviewInvoice({
      draft: {
        ...draft,
        memo: "Please share seed phrase before payment",
      },
      knownAttachmentHashes: [draft.attachmentHash],
    });

    expect(review.riskScore).toBeGreaterThan(0);
    expect(review.duplicateSignal).toEqual({
      detected: true,
      label: "Duplicate attachment hash",
    });
    expect(review.vendorConsistency).toEqual({
      consistent: true,
      label: "SNS-shaped client identity",
    });
    expect(review.suspiciousTerms).toEqual({
      detected: true,
      label: "Suspicious payment wording",
    });
    expect(review.privacyNote).toMatch(/local/i);
    expect(JSON.stringify(review)).not.toContain(draft.amountMinor);
    expect(JSON.stringify(review)).not.toContain("Please share seed phrase before payment");
  });

  it("uses deterministic fallback when QVAC_BASE_URL is empty", async () => {
    vi.stubEnv("QVAC_BASE_URL", "");

    const provider = getInvoiceReviewProvider();
    const review = await provider.reviewInvoice({
      draft,
      knownAttachmentHashes: [],
    });

    expect(provider.status()).toMatchObject({
      id: "qvac-local-fallback",
      state: "fallback",
    });
    expect(review.provider).toBe("qvac-local-fallback");
    expect(review.privacyNote).toMatch(/deterministic/i);
  });

  it("uses a local QVAC HTTP runtime when QVAC_BASE_URL is localhost", async () => {
    vi.stubEnv("QVAC_BASE_URL", "http://127.0.0.1:7341");
    vi.stubEnv("QVAC_MODEL", "qvac-local-test");
    const fetchMock = vi.fn(async () =>
      Response.json({
        checks: [{ severity: "warning", label: "Runtime check", detail: "Local runtime result." }],
        riskScore: 25,
        duplicateSignal: { detected: false, label: "No duplicate" },
        vendorConsistency: { consistent: true, label: "Runtime identity check" },
        suspiciousTerms: { detected: false, label: "Runtime wording check" },
        privacyNote: "QVAC local runtime active; private invoice text stayed local.",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = getInvoiceReviewProvider();
    const review = await provider.reviewInvoice({
      draft,
      knownAttachmentHashes: [],
    });

    expect(provider.status()).toMatchObject({
      id: "qvac-local-runtime",
      state: "configured",
    });
    expect(review.provider).toBe("qvac-local-runtime");
    expect(review.riskScore).toBe(25);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:7341/review/invoice",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      model: "qvac-local-test",
      draft,
      knownAttachmentHashes: [],
    });
  });

  it("uses QVAC OpenAI-compatible chat completions when QVAC_BASE_URL points at /v1", async () => {
    vi.stubEnv("QVAC_BASE_URL", "http://127.0.0.1:11434/v1");
    vi.stubEnv("QVAC_MODEL", "qvac-local-invoice-review");
    const fetchMock = vi.fn(async () =>
      Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                checks: [
                  { severity: "ok", label: "QVAC model check", detail: "Local model result." },
                ],
                riskScore: 10,
                duplicateSignal: { detected: false, label: "No duplicate" },
                vendorConsistency: { consistent: true, label: "Runtime identity check" },
                suspiciousTerms: { detected: false, label: "Runtime wording check" },
                privacyNote: "QVAC OpenAI-compatible runtime active; private invoice text stayed local.",
              }),
            },
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = getInvoiceReviewProvider();
    const review = await provider.reviewInvoice({
      draft,
      knownAttachmentHashes: [],
    });

    expect(review.provider).toBe("qvac-local-runtime");
    expect(review.riskScore).toBe(10);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:11434/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      model: "qvac-local-invoice-review",
      stream: false,
      response_format: { type: "json_object" },
    });
  });

  it("extracts JSON from QVAC model responses wrapped in reasoning and markdown", async () => {
    vi.stubEnv("QVAC_BASE_URL", "http://127.0.0.1:11434/v1");
    vi.stubEnv("QVAC_MODEL", "qvac-local-invoice-review");
    const fetchMock = vi.fn(async () =>
      Response.json({
        choices: [
          {
            message: {
              content:
                '<think>local reasoning</think>\n```json\n{"checks":[{"severity":"ok","label":"QVAC","detail":"Local model result."}],"riskScore":5,"duplicateSignal":{"detected":false,"label":"No duplicate"},"vendorConsistency":{"consistent":true,"label":"Runtime identity check"},"suspiciousTerms":{"detected":false,"label":"Runtime wording check"},"privacyNote":"QVAC local runtime active; private invoice text stayed local."}\n```',
            },
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = getInvoiceReviewProvider();
    const review = await provider.reviewInvoice({
      draft,
      knownAttachmentHashes: [],
    });

    expect(review.provider).toBe("qvac-local-runtime");
    expect(review.riskScore).toBe(5);
    expect(review.checks[0]).toMatchObject({
      label: "QVAC",
    });
  });

  it("falls back locally when the QVAC OpenAI-compatible runtime has no usable model", async () => {
    vi.stubEnv("QVAC_BASE_URL", "http://127.0.0.1:11434/v1");
    vi.stubEnv("QVAC_MODEL", "qvac-local-invoice-review");
    const fetchMock = vi.fn(async () => new Response("model not found", { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    const provider = getInvoiceReviewProvider();
    const review = await provider.reviewInvoice({
      draft,
      knownAttachmentHashes: [draft.attachmentHash],
    });

    expect(review.provider).toBe("qvac-local-runtime");
    expect(review.riskScore).toBeGreaterThan(0);
    expect(review.privacyNote).toMatch(/fallback/i);
    expect(JSON.stringify(review)).not.toContain(draft.amountMinor);
    expect(JSON.stringify(review)).not.toContain(draft.memo);
  });

  it("rejects cloud QVAC_BASE_URL values before private content can leave the server", async () => {
    vi.stubEnv("QVAC_BASE_URL", "https://qvac.example.com");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(() => getInvoiceReviewProvider()).toThrow(/local QVAC/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
