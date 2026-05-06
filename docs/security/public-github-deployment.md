# Public GitHub And Deployment Checklist

Use this checklist before switching the private repository to public and before deploying the app.

## Public Repository Gate

1. Commit only source, docs, migrations, tests, and empty examples.
2. Do not commit `.env`, `.env.local`, `.env.production`, `.vercel`, `.netlify`, wallet JSON files, keypairs, PEM files, local runtime folders, or local planning folders.
3. Keep `apps/web/.env.example` empty. It should list variable names only.
4. If any real secret was ever committed to git history, rotate that secret before making the repository public.
5. Run the repository scan from `docs/security/publication-checklist.md` before push/public switch.

## Deployment Settings

Recommended deployment shape for Vercel or another Next.js host:

- Framework: Next.js
- Install command: `corepack pnpm install`
- Build command from repo root: `corepack pnpm --filter @veilsettle/web build`
- Output/root app: `apps/web`
- Node runtime: use the host default supported by Next 16

If the deployment provider lets you select the project root directly, set root directory to `apps/web` and keep the build command as `corepack pnpm build`.

## Deployment Secrets

Set these in the deployment provider environment UI, not in git.

Required for deployed Supabase-backed demo:

- `NEXT_PUBLIC_SUPABASE_URL` - public browser-safe Supabase URL.
- `SUPABASE_SERVICE_ROLE_KEY` - secret server-only key. Never prefix with `NEXT_PUBLIC_`.

Required for deployed Dune SIM claim:

- `DUNE_SIM_API_KEY` - secret.
- `DUNE_SIM_WALLET_ADDRESS` - raw Solana base58 public key. This is not a secret, but keep it in env for configurability.

Recommended for deployed Solana RPC fallback:

- `SOLANA_RPC_URL` - treat as secret when the URL contains an API key.

Current safe privacy setting:

- `PRIVACY_PROVIDER=mock`
- Leave `MAGICBLOCK_PAYMENTS_API_URL`, `MAGICBLOCK_TEE_RPC_URL`, and `MAGICBLOCK_PUSD_MINT` empty until signing/submission is actually wired and verified.

QVAC:

- Leave `QVAC_BASE_URL` empty for cloud deployment unless a real local/loopback QVAC runtime is colocated with the app. The app rejects non-local QVAC URLs before invoice content can leave the server.
- For local demo only: `QVAC_BASE_URL=http://127.0.0.1:11434/v1` and `QVAC_MODEL=qvac-local-invoice-review`.

Optional tracks only:

- `GOLDRUSH_API_KEY`
- `TORQUE_API_KEY`
- `TORQUE_API_TOKEN`
- `ZERION_API_KEY`

## After Deployment

1. Smoke test invoice creation.
2. Smoke test public verification and confirm it does not reveal amount, memo, line items, attachments, or client context.
3. Smoke test Dune SIM status only if Dune env is configured and the HTTP response is 200.
4. Do not claim MagicBlock completed payment until there is a signed/submitted transaction signature.
5. Record deployment URL and evidence in `docs/submission/live-evidence.md`.
