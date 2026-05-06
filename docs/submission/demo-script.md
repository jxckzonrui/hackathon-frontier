# VeilSettle Demo Script

## 0:00-0:25 Problem

Web3 agencies need stablecoin invoice settlement proof without exposing invoice amount, scope, memo, attachments, or client context publicly.

## 0:25-1:10 Create Private Invoice

Show the agency dashboard, open the new invoice flow, and create the protocol audit sprint invoice for `client.sol`. Explain that the demo invoice is PUSD-denominated, while live PUSD settlement is not claimed until the official Solana mint/liquidity path is confirmed.

## 1:10-1:45 Local Review

Open the client review page and show either `QVAC local runtime active` or `QVAC-compatible local fallback`: risk score, duplicate signal, vendor consistency, suspicious wording, and privacy note. Say that private invoice content is never sent to cloud review APIs; `QVAC_BASE_URL` is accepted only for localhost/loopback runtimes. If a real QVAC model is not serving on the local OpenAI-compatible `/v1/chat/completions` endpoint, describe this as fallback mode.

## 1:45-2:40 Private Payment Preparation

Click `Prepare private payment`. Explain that the app calls the server-side private payment provider route. For MagicBlock, this release prepares an unsigned private SPL transfer for wallet signing; completed signing/submission is not claimed unless separate live evidence is added.

## 2:40-3:25 Public Verification

Open the split verification page. Show that the authorized party can see the amount and line items, while the public verification panel shows only status, commitments, and proof reference. Confirm that amount, memo, line items, attachments, and client context are absent from the public panel.

## 3:25-4:10 Integrations

Open the settlement dashboard and show Dune SIM-backed or static-fallback redacted analytics. Show the integration status panel. Mention SNS as an opt-in identity provider/API contract; only claim live `.sol` resolution if safe resolver evidence has been added. Mention RPC Fast, GoldRush, Torque, and theMiracle only if their evidence is present in `live-evidence.md`.

## 4:10-4:45 Why It Matters

Agencies, auditors, and service vendors can prove settlement without leaking commercial terms. The next production steps are signed wallet auth, verified onchain settlement proof, production key recovery, live Supabase verification, and confirmed stablecoin mint support.
