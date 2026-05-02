# VeilSettle Security Statement

VeilSettle stores invoice details encrypted offchain and stores only commitments on Solana. Public observers can verify status and hashes, but cannot read amounts, line items, memo, attachments, or client context.

MVP risks:

- Demo key handling is session-scoped and must be replaced with wallet-encrypted per-recipient keys before production.
- PUSD may use a devnet mock asset if official devnet access is unavailable.
- Cloak integration must be verified against current SDK behavior before mainnet use.
- Supabase service-role keys must never be exposed to the browser.
