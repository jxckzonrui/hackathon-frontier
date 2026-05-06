# Final Readiness Checklist

Date: 2026-05-06
Production URL: https://hackathon-frontier.vercel.app
Vercel project: `hackathon-frontier`
GitHub repo: `mih249/hackathon-frontier`

## Current Live Status

- Vercel project is created from GitHub with `apps/web` as the root directory.
- Framework preset is `Next.js`.
- Install command is `corepack pnpm install`.
- Build command is `corepack pnpm build`.
- Output directory is Vercel default.
- Production deployment is `READY` and promoted.
- Live app redirects from `/` to `/dashboard`.
- Production smoke flow passed:
  - dashboard renders;
  - `/invoices/new` renders;
  - UI creates an invoice through `POST /api/invoices`;
  - Supabase write path works;
  - `/pay/:id` renders;
  - `Prepare private payment` works with `PRIVACY_PROVIDER=mock`;
  - payment proof writes through `/api/invoices/:id/payment-proof`;
  - `/verify/:id` renders;
  - `/settlements` returns HTTP 200;
  - `/api/analytics/settlements` returns HTTP 200 with `source: "dune-sim"`.

## Environment Variables Set In Vercel

These are configured in Vercel, not GitHub:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DUNE_SIM_API_KEY`
- `DUNE_SIM_WALLET_ADDRESS`
- `SOLANA_RPC_URL`
- `PRIVACY_PROVIDER=mock`

These are intentionally not configured for the current production deployment:

- `QVAC_BASE_URL`, because cloud URLs are rejected by the app and private invoice text must not be sent to a cloud QVAC URL.
- MagicBlock variables, because the current production demo remains on the stable mock provider path. MagicBlock browser-wallet signing/submission is verified separately on devnet with local evidence.
- GoldRush, Torque, and Zerion variables, because optional tracks are not part of the current live claim.

## Problems Encountered

- Local `vercel` CLI was not installed in PATH. Used `npx.cmd vercel` instead.
- PowerShell execution policy blocked `npx.ps1` and `npm.ps1`. Used `.cmd` entrypoints where needed.
- `rg.exe` failed with `Access is denied` in this environment. Used PowerShell file search instead.
- The workspace was not linked to a Vercel project before deployment. Created the project through authenticated Vercel API/CLI.
- Vercel MCP could read some data, but scoped deployment/build-log calls returned authorization/scope issues. Used Vercel CLI with `--scope mih249s-projects` for reliable inspection.
- `Invoke-WebRequest` returned a local PowerShell null-reference issue for one POST check. Re-ran the API smoke with `curl.exe`, which succeeded.
- Browser smoke emitted `ERR_ABORTED` for Next.js `_rsc` prefetch/navigation requests. The user-facing flow still completed with no console errors or HTTP 4xx/5xx in the actual interaction path.
- Build logs show non-blocking warnings:
  - Node `url.parse()` deprecation warning from dependencies;
  - pnpm lockfile/packageManager version notice;
  - Vercel warning that a `.env` file exists in the build context.
- `apps/web/.env.local` is ignored and not tracked, but the Vercel warning should still be remembered before public release.

## Current Non-Claims

Do not claim these as completed:

- production mainnet MagicBlock private payment settlement;
- live PUSD settlement;
- QVAC cloud/runtime-backed production review;
- GoldRush/Torque/Zerion optional tracks;
- production-grade wallet auth or production-grade cryptographic key management;
- Anchor/devnet program test execution from this environment.

Allowed current positioning:

- live Vercel demo;
- Supabase-backed invoice creation and payment proof storage;
- privacy-preserving invoice demo with public/private receipt separation;
- mock private payment provider for stable demo path;
- MagicBlock browser-wallet signed/submitted devnet flow when citing the recorded devnet signature evidence;
- Dune SIM analytics route configured and returning live production responses;
- QVAC-compatible local review design, with cloud QVAC URL intentionally disabled.

## Remaining Work Before Final Submission

1. Update public docs with the production URL:
   - `README.md`;
   - `docs/submission/live-evidence.md`;
   - demo script and pitch notes.

2. Record final demo video:
   - dashboard;
   - create encrypted invoice;
   - open client payment flow;
   - prepare private payment with mock provider;
   - verify selective reveal receipt;
   - show settlements/analytics page;
   - clearly state what is mocked and what is live.

3. Capture final screenshots:
   - dashboard;
   - new invoice page;
   - pay page after payment prepared;
   - verify page;
   - settlements page.

4. Tighten submission claims:
   - call PUSD a demo denomination unless an official Solana PUSD mint/liquidity source is verified;
   - call MagicBlock signed/submitted on devnet only when citing the recorded signature evidence; keep production deployment described as the stable mock-provider path unless MagicBlock env is deployed;
   - call QVAC localhost/local-compatible only unless local runtime evidence is part of the video.

5. Re-run final verification before submission:
   - `corepack.cmd pnpm --filter @veilsettle/web lint`;
   - `corepack.cmd pnpm --filter @veilsettle/web test`;
   - `corepack.cmd pnpm --filter @veilsettle/web build`;
   - `corepack.cmd pnpm --filter @veilsettle/web test:e2e`;
   - production smoke flow against `https://hackathon-frontier.vercel.app`.

6. Confirm repository/publication state:
   - no real secrets tracked;
   - `.env.local` remains ignored;
   - GitHub repo visibility is correct for judging;
   - final commit hash matches the deployed Vercel build or a fresh deployment is triggered.

7. Decide optional tracks only after core submission is stable:
   - MagicBlock: devnet signature evidence exists; only submit stronger production claims after final deployed MagicBlock env/signature evidence exists;
   - GoldRush/Torque/Zerion: only if there is time and real evidence;
   - SNS: only if a safe `.sol` or wallet lookup can be shown reliably.

## Final Gate

The project is ready for a cautious MVP submission once the demo video, public docs, and final claim wording are updated. It is not ready for broad sponsor-track claims until the non-claims above are either implemented and verified or explicitly left out of the submission.
