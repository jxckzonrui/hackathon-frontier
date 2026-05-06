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

    render(await VerifyPage());

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
    expect(screen.getByLabelText(/invoice review agent/i)).toBeVisible();
    expect(screen.getByText(/prepare-private-payment/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /prepare private payment/i })).toBeVisible();

    const settlementsPage = await SettlementsPage();

    rerender(settlementsPage);
    expect(screen.getByRole("heading", { name: /settlement dashboard/i })).toBeVisible();
    expect(screen.getAllByText(/dune sim/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/goldrush/i).length).toBeGreaterThan(0);
  });

  it("does not store a paid proof when private payment is only unsigned", async () => {
    const { PaymentSettlementActions } = await import("@/components/PaymentSettlementActions");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          paymentProofReference: "magicblock:prepared:invoice-123",
          unsignedTransactionBase64: "base64-unsigned-transaction",
        }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<PaymentSettlementActions invoiceId="invoice-123" />);
    fireEvent.click(screen.getByRole("button", { name: /prepare private payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/unsigned private payment prepared/i)).toBeVisible();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/privacy/payment", expect.any(Object));
    expect(screen.queryByRole("link", { name: /verify settlement/i })).toBeNull();
  });

  it("signs and submits an unsigned private payment with the browser wallet", async () => {
    vi.doMock("@solana/web3.js", () => ({
      Connection: vi.fn(function Connection() {
        return {
        sendRawTransaction: vi.fn(() => Promise.resolve("magicblock-devnet-signature")),
        confirmTransaction: vi.fn(() => Promise.resolve({ value: { err: null } })),
        };
      }),
      Transaction: {
        from: vi.fn(() => ({
          serialize: () => new Uint8Array([4, 5, 6]),
        })),
      },
      VersionedTransaction: {
        deserialize: vi.fn(() => {
          throw new Error("legacy transaction");
        }),
      },
    }));
    const { PaymentSettlementActions } = await import("@/components/PaymentSettlementActions");
    const signTransaction = vi.fn(async (transaction: unknown) => transaction);
    vi.stubGlobal("solana", {
      connect: vi.fn(async () => ({
        publicKey: { toString: () => "AzPKxsnUT2N7Bso8Crvm6LNnXKUWyX5SHqtyMtk3GW2U" },
      })),
      signTransaction,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            provider: "magicblock",
            paymentProofReference: "magicblock:invoice-123",
            unsignedTransactionBase64: "AQID",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: "paid" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<PaymentSettlementActions invoiceId="invoice-123" />);
    fireEvent.click(screen.getByRole("button", { name: /prepare private payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/submitted magicblock transaction/i)).toBeVisible();
    });

    expect(signTransaction).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/invoices/invoice-123/payment-proof",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("magicblock-devnet-signature"),
      }),
    );
    expect(screen.getByRole("link", { name: /verify settlement/i })).toBeVisible();
    vi.doUnmock("@solana/web3.js");
  });

  it("blocks private payment preparation until QVAC review is complete", async () => {
    const { PaymentSettlementActions } = await import("@/components/PaymentSettlementActions");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<PaymentSettlementActions invoiceId="invoice-123" reviewCompleted={false} />);

    const button = screen.getByRole("button", { name: /prepare private payment/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/complete local invoice review/i)).toBeVisible();
    fireEvent.click(button);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
