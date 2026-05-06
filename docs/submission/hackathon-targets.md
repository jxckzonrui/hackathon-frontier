# VeilSettle Hackathon Targets

Status meanings:

- `Primary verified`: ready to submit with current repo evidence.
- `Primary pending evidence`: strong fit, but needs a live key, endpoint, runtime, deployment, or submission artifact before claiming live integration.
- `Primary pending deployment evidence`: live local evidence exists, but the deployed public demo still needs matching env proof.
- `Conditional`: submit only if the listed evidence is added.
- `Optional`: useful extra surface, not required for the core submission.
- `Not targeted`: do not submit unless a separate implementation starts.

| Track | Status | Honest submission claim | Evidence gate / user input |
|---|---|---|---|
| Colosseum Frontier | Primary pending evidence | Privacy-preserving Solana invoice settlement MVP with encrypted invoice details, local review, private payment preparation, and public-safe receipt verification. | Needs public GitHub URL, deployment URL, demo video, and Colosseum project/submission access. |
| 100xDevs | Primary pending evidence | Usable builder MVP with a judge-visible Next.js flow and clear setup. | Needs deployment/demo links and final verification rerun. |
| Adevar Labs | Primary verified | Security-conscious MVP with explicit threat model, public/private receipt separation, RLS schema, and known limitations. | Keep final secret scan and public verification evidence current. |
| Tether QVAC | Primary pending evidence | Local QVAC runtime-backed invoice review when `QVAC_BASE_URL` points to localhost; otherwise QVAC-compatible deterministic fallback. | Needs real local QVAC runtime/API/CLI evidence to claim runtime mode. |
| Dune SIM | Primary pending deployment evidence | Server-side Dune SIM SVM balances adapter for redacted settlement analytics. | Local HTTP 200 smoke exists; needs deployment secret/evidence before public submission. |
| SNS | Primary pending evidence | Opt-in `.sol` identity provider/API contract with fallback mode. | Needs safe `.sol` name or wallet plus resolver smoke evidence. |
| MagicBlock Privacy | Conditional | MagicBlock Private Payments unsigned transaction preparation. | Signing/submission requires explicit risk approval, test wallet, and live signature evidence. |
| Palm USD / PUSD | Conditional | Demo invoice denomination only. | Live PUSD settlement needs official Solana SPL mint/liquidity confirmation. |
| RPC Fast | Conditional | Solana RPC endpoint hook for SNS/status/toolchain evidence. | Submit only if `SOLANA_RPC_URL` is an RPC Fast endpoint and smoke evidence is captured. |
| GoldRush | Optional | Receipt or wallet enrichment only if a live endpoint is added. | Needs `GOLDRUSH_API_KEY` and redacted endpoint evidence. |
| Torque or theMiracle | Optional | Growth/campaign or user-benefit story only with credible live evidence or budget confirmation. | Needs `TORQUE_API_KEY` or a concrete theMiracle benefit-budget decision. |

## Explicit Non-Claims

- MagicBlock: unsigned private payment preparation unless signing/submission evidence exists.
- PUSD: demo denomination unless official Solana SPL mint/liquidity is confirmed.
- Supabase: live-backed only after migration/RLS verification.
- Dune SIM: live-backed only after HTTP 200 smoke evidence; deployment-backed only after deployment env evidence.
- SNS: live resolver only after safe resolver evidence.
- QVAC: real runtime only after local runtime evidence; otherwise QVAC-compatible fallback.
- RPC Fast: claimed only when `SOLANA_RPC_URL` uses RPC Fast and smoke evidence is captured.

## Not Targeted

Cloak, Umbra, Zerion, LPAgent, Jupiter, Encrypt/Ika, SagaPad, dum.fun, and regional-only tracks are not targeted unless a separate implementation starts and team eligibility is truthful.
