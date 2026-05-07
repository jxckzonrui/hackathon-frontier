# VeilSettle Demo Script

## 0:00-0:25 Problem

Web3 agencies need stablecoin invoice settlement proof without exposing invoice amount, scope, memo, attachments, or client context publicly.

## 0:25-1:10 Create Private Invoice

Show the agency dashboard, open the new invoice flow, and create the protocol audit sprint invoice for `client.sol`. Explain that PUSD is the invoice denomination and that the official Solana PUSD mint metadata is verified from Palm USD developer docs. Be precise: this is a verified-mint PUSD invoice utility prototype, not PUSD mainnet payment proof.

## 1:10-1:45 Local Review

Open the client review page and show either `QVAC local runtime active` or `QVAC-compatible local fallback`: risk score, duplicate signal, vendor consistency, suspicious wording, and privacy note. Then show the Local Invoice Agent panel: approve/review/reject decision, findings, recommended action, and privacy notice. Say that private invoice content is never sent to cloud review APIs; `QVAC_BASE_URL` is accepted only for localhost/loopback runtimes. If a real QVAC model is not serving on the local OpenAI-compatible `/v1/chat/completions` endpoint, describe this as fallback mode.

## 1:45-2:40 Private Payment Preparation

Click `Prepare private payment`. Explain that payment preparation is gated by the Local Invoice Agent recommendation. The deployed stable demo may use the mock provider for a public-safe proof write, while the MagicBlock provider path signs and submits a devnet USDC private SPL transfer through the browser wallet when MagicBlock env is configured. PUSD preparation remains env/provider-based using the official mint metadata; claim MagicBlock only as signed/submitted devnet USDC evidence, not mainnet settlement or PUSD payment proof.

## 2:40-3:25 Public Verification

Open the split verification page. Show that the authorized party can see the amount and line items, while the public verification panel shows only status, commitments, and proof reference. Confirm that amount, memo, line items, attachments, and client context are absent from the public panel.

## 3:25-4:10 Integrations

Open the settlement dashboard and show Dune SIM-backed redacted analytics if the deployed route reports `source: "dune-sim"`; otherwise call it a fallback. Show the integration status panel. Mention SNS as an opt-in identity resolver/fallback and only claim live `.sol` resolution when `/api/identity/sns` evidence succeeds. Mention RPC Fast only if `/api/status/rpc` reports `provider: "rpc-fast"` with `getHealth=ok`. Do not mention GoldRush, Torque, or theMiracle unless their evidence is present in `live-evidence.md`.

## 4:10-4:45 Why It Matters

Agencies, auditors, and service vendors can prove settlement without leaking commercial terms. The next production steps are production wallet auth, PUSD mainnet payment proof, production key recovery, and deeper onchain proof verification.
