import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("VeilSettle MVP pages", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the agency dashboard with privacy and settlement entry points", async () => {
    const DashboardPage = (await import("./dashboard/page")).default;

    render(<DashboardPage />);

    expect(screen.getByRole("heading", { name: /private stablecoin settlement/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /new invoice/i })).toHaveAttribute(
      "href",
      "/invoices/new",
    );
    expect(screen.getByRole("link", { name: /settlements/i })).toHaveAttribute(
      "href",
      "/settlements",
    );
    expect(screen.getByText("Private fields exposed publicly")).toBeVisible();
    expect(screen.getByText("0")).toBeVisible();
  });

  it("creates a demo invoice from the invoice form", async () => {
    const { InvoiceForm } = await import("@/components/InvoiceForm");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invoiceId: "invoice-123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<InvoiceForm />);
    fireEvent.click(screen.getByRole("button", { name: /create encrypted invoice/i }));

    await waitFor(() => {
      expect(screen.getByText(/created invoice invoice-123/i)).toBeVisible();
    });
    expect(screen.getByRole("link", { name: /review client flow/i })).toHaveAttribute(
      "href",
      "/pay/invoice-123",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/invoices",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("falls back to the local demo invoice when persistence is not configured", async () => {
    const { InvoiceForm } = await import("@/components/InvoiceForm");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Server configuration error" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<InvoiceForm />);
    expect(screen.getByText("2,500.00 PUSD demo denomination")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /create encrypted invoice/i }));

    await waitFor(() => {
      expect(screen.getByText(/demo invoice demo-invoice ready locally/i)).toBeVisible();
    });
    expect(screen.getByRole("link", { name: /review client flow/i })).toHaveAttribute(
      "href",
      "/pay/demo-invoice",
    );
  });

  it("keeps private invoice details out of the public verification panel", async () => {
    const VerifyPage = (await import("./verify/[id]/page")).default;

    render(<VerifyPage />);

    const authorizedPanel = screen.getByLabelText("Authorized party view");
    const publicPanel = screen.getByLabelText("Public verification");

    expect(within(authorizedPanel).getByText("2,500.00 PUSD")).toBeVisible();
    expect(within(authorizedPanel).getByText(/private audit invoice/i)).toBeVisible();
    expect(within(publicPanel).getByText("Paid")).toBeVisible();
    expect(within(publicPanel).getByText("Metadata hash")).toBeVisible();
    expect(within(publicPanel).queryByText("2,500.00 PUSD")).toBeNull();
    expect(within(publicPanel).queryByText(/private audit invoice/i)).toBeNull();
  });

  it("renders client review and settlement dashboard pages", async () => {
    const PayInvoicePage = (await import("./pay/[id]/page")).default;
    const SettlementsPage = (await import("./settlements/page")).default;

    const payInvoicePage = await PayInvoicePage({
      params: Promise.resolve({ id: "demo-invoice" }),
    });

    const { rerender } = render(payInvoicePage);
    expect(screen.getByRole("heading", { name: /review and pay/i })).toBeVisible();
    expect(screen.getByText(/qvac local checks/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /prepare private payment/i })).toBeVisible();

    const settlementsPage = await SettlementsPage();

    rerender(settlementsPage);
    expect(screen.getByRole("heading", { name: /settlement dashboard/i })).toBeVisible();
    expect(screen.getAllByText(/dune sim/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/goldrush/i).length).toBeGreaterThan(0);
  });
});
