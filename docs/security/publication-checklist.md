# Publication Safety Checklist

Before pushing or making the repository public:

1. Keep real values only in local `.env.local`, deployment provider secrets, or Supabase dashboard secrets.
2. Never commit Supabase service-role keys, wallet keypairs, private keys, recovery phrases, API tokens, or production database URLs.
3. Publish `apps/web/.env.example`, not `.env.local`.
4. Run a local secret scan before every push:

   ```powershell
   git status --short --untracked-files=all
   git grep -n -I -E "(PRIVATE_KEY|SERVICE_ROLE|SECRET|PASSWORD|TOKEN|API_KEY|BEGIN (RSA|OPENSSH|EC|PRIVATE)|sk-[A-Za-z0-9]|ghp_[A-Za-z0-9])" HEAD
   ```

5. Treat `agent.md`, `documentation.md`, `.worktrees`, and `docs/superpowers` as local planning materials, not public release artifacts.
6. If any real secret was ever committed, rotate it first and publish from a clean history branch instead of pushing the existing history.
7. Confirm submission docs do not claim live Supabase, finalized PUSD metadata, or MagicBlock signing/submission until those blockers are closed.
8. Confirm `pnpm audit` has no critical/high advisories, or every remaining advisory is documented.
9. Confirm README limitations match the implemented payment path.
10. Confirm public verification was checked for amount, memo, line item, attachment, and client leakage.
11. Confirm Supabase service role key is only in server/deployment secrets.
12. Confirm payment proof references are provider-prefixed.

## Final Verification Notes

- 2026-05-04: Web lint, unit tests, build, and Playwright E2E passed.
- 2026-05-04: Dependency audit has no critical/high advisories. One moderate Next/PostCSS advisory remains documented in `docs/submission/live-evidence.md`.
- 2026-05-04: Secret scan matches were inspected and are placeholders, env names, tests, or docs warnings.
- 2026-05-04: Public verification E2E keeps amount and private memo out of the public panel.
