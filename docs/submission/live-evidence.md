# VeilSettle Live Evidence

Date:
Branch:
Deployment URL:
Demo video URL:
GitHub URL:

## Verification Commands

| Check | Command | Result |
|---|---|---|
| Lint | `corepack.cmd pnpm --filter @veilsettle/web lint` | |
| Unit tests | `corepack.cmd pnpm --filter @veilsettle/web test` | |
| Build | `corepack.cmd pnpm --filter @veilsettle/web build` | |
| E2E | `corepack.cmd pnpm --filter @veilsettle/web test:e2e` | |
| Audit | `corepack.cmd pnpm audit --audit-level moderate` | |
| Secret scan | `git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD` | |

## Integration Evidence

| Integration | Evidence | Claim |
|---|---|---|
| Supabase | | |
| MagicBlock | | |
| Dune SIM | | |
| SNS | | |
| QVAC | | |
| PUSD | | |
| RPC Fast | | |
