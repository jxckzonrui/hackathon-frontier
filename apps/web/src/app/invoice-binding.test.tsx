import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSupabaseServerClientMock = vi.fn(() => ({ from: vi.fn() }));
const fetchPublicInvoiceRowMock = vi.fn();

vi.mock("@/lib/veilsettle/storage", () => ({
  getSupabaseServerClient: getSupabaseServerClientMock,
  fetchPublicInvoiceRow: fetchPublicInvoiceRowMock,
}));

const publicInvoiceRow = {
  id: "invoice-live",
  status: "paid",
  metadata_hash: "metadata-hash-live",
  amount_commitment: "amount-commitment-live",
  due_date_hash: "due-date-hash-live",
  payment_proof_reference: "mock:invoice-live",
  created_at: "2026-05-06T17:00:00.000Z",
  paid_at: "2026-05-07T12:00:00.000Z",
};

describe("invoice-bound pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchPublicInvoiceRowMock.mockResolvedValue(publicInvoiceRow);
  });

  it("loads public-safe invoice state on the pay page for non-demo invoices", async () => {
    const PayInvoicePage = (await import("./pay/[id]/page")).default;

    render(
      await PayInvoicePage({
        params: Promise.resolve({ id: "invoice-live" }),
      }),
    );

    expect(fetchPublicInvoiceRowMock).toHaveBeenCalledWith(expect.anything(), "invoice-live");
    expect(screen.getByText(/loaded from supabase/i)).toBeVisible();
    expect(screen.getByText("invoice-live")).toBeVisible();
    expect(screen.getByText("paid")).toBeVisible();
    expect(screen.getByText("metadata-hash-live")).toBeVisible();
  });

  it("binds public verification to the requested invoice id", async () => {
    const VerifyPage = (await import("./verify/[id]/page")).default;

    render(
      await VerifyPage({
        params: Promise.resolve({ id: "invoice-live" }),
      }),
    );

    expect(fetchPublicInvoiceRowMock).toHaveBeenCalledWith(expect.anything(), "invoice-live");

    const publicPanel = screen.getByLabelText("Public verification");
    expect(within(publicPanel).getByText("Paid")).toBeVisible();
    expect(within(publicPanel).getByText("metadata-hash-live")).toBeVisible();
    expect(within(publicPanel).getByText("amount-commitment-live")).toBeVisible();
    expect(within(publicPanel).getByText("mock:invoice-live")).toBeVisible();
    expect(within(publicPanel).queryByText("2,500.00 PUSD")).toBeNull();
    expect(within(publicPanel).queryByText(/private audit invoice/i)).toBeNull();
  });
});
