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
| Colosseum Frontier | Primary pending evidence | Privacy-preserving Solana invoice settlement MVP with encrypted invoice details, local review, private payment preparation, and public-safe receipt verification. | Public GitHub and deployment URLs exist; needs demo video, final verification rerun, and Colosseum project/submission access. |
| 100xDevs | Primary pending evidence | Usable builder MVP with a judge-visible Next.js flow and clear setup. | Deployment URL exists; needs demo video link and final verification rerun. |
| Adevar Labs | Primary verified | Security-conscious MVP with explicit threat model, public/private receipt separation, RLS schema, and known limitations. | Keep final secret scan and public verification evidence current. |
| Tether QVAC | Primary pending video evidence | Local QVAC runtime-backed invoice review when `QVAC_BASE_URL` points to localhost; otherwise QVAC-compatible deterministic fallback. | Local runtime evidence exists in `live-evidence.md`; final video must show runtime or explicitly show fallback mode. |
| Dune SIM | Primary verified | Server-side Dune SIM SVM balances adapter for redacted settlement analytics. | Production `/api/analytics/settlements` smoke returned HTTP 200 with `source: "dune-sim"`; rerun before final submission. |
| SNS | Primary pending evidence | Opt-in `.sol` identity provider/API contract with fallback mode. | Needs safe `.sol` name or wallet plus resolver smoke evidence. |
| MagicBlock Privacy | Primary verified on devnet | MagicBlock Private Payments browser-wallet signed devnet SPL transfer with public-safe signature evidence. | Devnet signature `4b6qjNPWff5sHzL9hUvAvWN4KLLJzi7G69NyTtLXLS9GfpmMvugf8UiGC5vRiCNu4GeM3fcsZZQKE8VRqryZ1zk6`; do not imply production mainnet settlement. |
| Palm USD / PUSD | Conditional | Demo invoice denomination only. | Live PUSD settlement needs official Solana SPL mint/liquidity confirmation. |
| RPC Fast | Conditional | Solana RPC endpoint hook for SNS/status/toolchain evidence. | Submit only if final deployed `SOLANA_RPC_URL` is confirmed as an RPC Fast endpoint and smoke evidence is captured. |
| GoldRush | Optional | Receipt or wallet enrichment only if a live endpoint is added. | Needs `GOLDRUSH_API_KEY` and redacted endpoint evidence. |
| Torque or theMiracle | Optional | Growth/campaign or user-benefit story only with credible live evidence or budget confirmation. | Needs `TORQUE_API_KEY` or a concrete theMiracle benefit-budget decision. |

## Explicit Non-Claims

- MagicBlock: signed/submitted devnet evidence exists; do not claim production mainnet settlement.
- PUSD: demo denomination unless official Solana SPL mint/liquidity is confirmed.
- Supabase: live-backed only after migration/RLS verification.
- Dune SIM: live-backed only after HTTP 200 smoke evidence; deployment-backed only after deployment env evidence.
- SNS: live resolver only after safe resolver evidence.
- QVAC: real runtime only after local runtime evidence; otherwise QVAC-compatible fallback.
- RPC Fast: claimed only when `SOLANA_RPC_URL` uses RPC Fast and smoke evidence is captured.

## Not Targeted

Cloak, Umbra, Zerion, LPAgent, Jupiter, Encrypt/Ika, SagaPad, dum.fun, and regional-only tracks are not targeted unless a separate implementation starts and team eligibility is truthful.
