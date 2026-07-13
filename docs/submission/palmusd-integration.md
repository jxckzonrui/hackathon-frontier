# Palm USD / PUSD Integration

## Scope

VeilSettle uses PUSD as the core invoice settlement denomination for a privacy-first B2B invoice flow on Solana.

This submission claims a verified-mint PUSD invoice utility prototype. It does not claim PUSD mainnet payment proof unless a real PUSD transaction signature is captured.

## Official Metadata

Source: https://www.palmusd.com/pages/developers.html

| Field | Value |
|---|---|
| Symbol | PUSD |
| Name | Palm USD |
| Network | Solana mainnet |
| Token standard | SPL |
| Decimals | 6 |
| Mint | `CZzgUBvxaMLwMhVSLgqJn3npmxoTo6nzMNQPAnwtHF3s` |
| Mint authority | Locked, according to Palm USD developer docs |

Palm USD public API smoke on 2026-05-07:

- `GET https://www.palmusd.com/api/v1/circulation`
- HTTP 200
- Response included a SOLANA circulation row.

## Product Flow

1. Merchant creates a PUSD-denominated private invoice.
2. Payer reviews the invoice through QVAC-compatible local checks and the Local Invoice Agent.
3. The payment action prepares a private payment only after the agent recommends payment preparation.
4. Public verification shows status, hashes, and proof references without invoice amount, memo, line items, attachments, or client context.

## Claim Boundary

Allowed in submission:

- PUSD is the invoice denomination and target settlement asset.
- Official Solana PUSD mint metadata is verified and wired into the codebase.
- The private payment provider can prepare PUSD transfers when the PUSD mint is configured.

Not claimed in submission:

- PUSD mainnet payment proof.
- Custody, redemption, or market liquidity through VeilSettle.
- MagicBlock mainnet settlement.
