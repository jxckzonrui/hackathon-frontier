import * as anchor from "@anchor-lang/core";
import { assert } from "chai";

describe("veilsettle", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = (anchor.workspace as { veilsettle: any }).veilsettle;
  const creator = anchor.getProvider().publicKey!;

  function invoicePda(invoiceId: number[]) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("invoice"), creator.toBuffer(), Buffer.from(invoiceId)],
      program.programId
    )[0];
  }

  it("creates and marks an invoice paid", async () => {
    const invoiceId = Array.from(Buffer.from("1234567890abcdef"));
    const invoice = invoicePda(invoiceId);
    const hash = Array(32).fill(1);

    await program.methods
      .createInvoiceCommitment(invoiceId, hash, hash, hash, hash)
      .accounts({ invoice, creator })
      .rpc();

    let account = await program.account.invoiceCommitment.fetch(invoice);
    assert.deepEqual(account.status, { created: {} });

    const proof = Array(32).fill(2);
    await program.methods.markPaid(proof).accounts({ invoice, creator }).rpc();

    account = await program.account.invoiceCommitment.fetch(invoice);
    assert.deepEqual(account.status, { paid: {} });
    assert.deepEqual(account.paymentProofReference, proof);
  });

  it("voids an unpaid invoice and rejects payment after void", async () => {
    const invoiceId = Array.from(Buffer.from("voided-invoice01"));
    const invoice = invoicePda(invoiceId);
    const hash = Array(32).fill(3);

    await program.methods
      .createInvoiceCommitment(invoiceId, hash, hash, hash, hash)
      .accounts({ invoice, creator })
      .rpc();

    await program.methods.voidInvoice().accounts({ invoice, creator }).rpc();

    const account = await program.account.invoiceCommitment.fetch(invoice);
    assert.deepEqual(account.status, { voided: {} });

    try {
      await program.methods.markPaid(Array(32).fill(4)).accounts({ invoice, creator }).rpc();
      assert.fail("Expected voided invoice payment to fail");
    } catch (error) {
      assert.include(String(error), "InvalidStatus");
    }
  });
});
