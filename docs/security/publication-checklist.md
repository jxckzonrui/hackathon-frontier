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
