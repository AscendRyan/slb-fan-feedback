**Do I know what the issue is?** Yes.

**Problem:** Vercel is still deploying Git commit `d5ba29f`, and the log shows the post-build script is not running: there is no `vercel-build: .vercel/output ready` message after `vite build`. That means Vercel is either building an older Git commit that does not include the latest `vercel.json`/`scripts/vercel-build.mjs` changes, or Vercel’s project settings are overriding the repository config and still expecting an output directory named `output`.

**Plan:**
1. Make the Vercel build harder to misconfigure by moving the post-build step into `package.json` as a dedicated `build:vercel` script.
2. Update `vercel.json` to call that script directly, so the Vercel logs clearly show whether the Vercel output builder runs.
3. Keep `outputDirectory` pointed at `.vercel/output`, because that is the directory our script creates.
4. Add a short deployment note in the repo explaining that the GitHub repo must be pushed/updated and Vercel project settings must not override the Build Command or Output Directory.

**After implementation, redeploy checklist:**
- Confirm Vercel deploy log clones a new commit, not `d5ba29f`.
- Confirm the build log includes `vercel-build: .vercel/output ready`.
- If Vercel still says `output`, clear any Vercel Dashboard override for Output Directory or set it to `.vercel/output`.

<presentation-actions>
  <presentation-open-history>View History</presentation-open-history>
</presentation-actions>

<presentation-actions>
<presentation-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</presentation-link>
</presentation-actions>