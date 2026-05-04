# VeilSettle Security Statement

VeilSettle stores invoice details encrypted offchain and stores only commitments on Solana. Public observers can verify status and hashes, but cannot read amounts, line items, memo, attachments, or client context.

Submission eligibility and team registration are verified outside the public repository. This file intentionally does not include private team-member data.

MVP risks:

- Demo key handling is session-scoped and must be replaced with wallet-encrypted per-recipient keys before production.
- Palm USD support must not hardcode PUSD metadata until an official Solana SPL mint/liquidity source is confirmed by sponsor or official docs.
- MagicBlock Private Payments currently builds unsigned private SPL transfer transactions; wallet signing/submission is tracked as a separate risky mini-task.
- Supabase live migration and schema verification are blocked until the user reauthenticates Supabase MCP and approves applying the migration.
- Supabase service-role keys must never be exposed to the browser.
- Dune SIM analytics returns hashed settlement identifiers only and must not expose raw invoice IDs, private memo, amount, line items, or client context.
- SNS identity is opt-in; merchant/client `.sol` names should not be displayed where the user has not opted in.
