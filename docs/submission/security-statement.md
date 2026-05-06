# VeilSettle Security Statement

VeilSettle stores invoice details encrypted offchain and stores only commitments on Solana. Public observers can verify status and hashes, but cannot read amounts, line items, memo, attachments, or client context.

Submission eligibility and team registration are verified outside the public repository. This file intentionally does not include private team-member data.

## Release Security Posture

VeilSettle is a hackathon MVP, not a production payment processor.

Strong properties in this release:

- Public verification exposes status and commitments, not invoice amount, memo, line items, attachments, or client context.
- Supabase service role access is server-side only.
- RLS is enabled on invoice tables, with no browser-side direct table writes.
- Payment provider adapters return public-safe proof references.
- Payment proof references must use a known provider prefix: `magicblock:`, `cloak:`, `umbra:`, or `mock:`.

Known MVP limitations:

- Wallet authentication is demo-grade and does not yet require signed wallet challenges for every invoice read.
- Payment proof submission stores provider proof references but does not independently verify every onchain execution path.
- Invoice encryption key recovery is demo-grade and not suitable for production account recovery.
- MagicBlock signing/submission is not claimed in the safe release path; the current claim is unsigned private payment preparation only.

MVP risks:

- Demo key handling is session-scoped and must be replaced with wallet-encrypted per-recipient keys before production.
- Palm USD support must not hardcode PUSD metadata until an official Solana SPL mint/liquidity source is confirmed by sponsor or official docs.
- MagicBlock Private Payments currently builds unsigned private SPL transfer transactions; wallet signing/submission is tracked as a separate risky mini-task.
- Supabase live migration and schema verification are blocked until the user reauthenticates Supabase MCP and approves applying the migration.
- Supabase service-role keys must never be exposed to the browser.
- Dune SIM analytics returns hashed settlement identifiers only and must not expose raw invoice IDs, private memo, amount, line items, or client context.
- SNS identity is opt-in; merchant/client `.sol` names should not be displayed where the user has not opted in.
- QVAC runtime URLs must remain localhost/loopback only. Cloud QVAC URLs are rejected before private invoice content can leave the server.
