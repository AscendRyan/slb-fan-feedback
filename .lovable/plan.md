# Fix Vercel "No Output Directory" error

## Problem
The Vercel build fails with: `No Output Directory named "output" found after the Build completed. Update vercel.json#outputDirectory...`

Because `vercel.json` sets `framework: null` with a custom `buildCommand`, Vercel does not auto-detect where `vite build` wrote the deployment bundle.

## Diagnosis
- `vite.config.ts` already passes `target: "vercel"` to the TanStack Start plugin when `process.env.VERCEL` is set.
- TanStack Start's Vercel target emits the build in `.vercel/output` (Vercel Build Output API format).
- `vercel.json` currently lacks `outputDirectory`, so Vercel looks for a default/non-existent `output` folder.

## Fix
Update `vercel.json` to point Vercel at the directory the TanStack Start plugin generates:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "vite build",
  "installCommand": "bun install",
  "framework": null,
  "outputDirectory": ".vercel/output"
}
```

## Verification steps
1. Trigger a new Vercel deployment (or run `VERCEL=true bun run build` locally and confirm `.vercel/output` is produced).
2. Confirm the Vercel deployment no longer reports the missing output directory error.
3. Smoke-test a route on the deployed site to ensure SSR/static delivery works.

## Notes
- Keep the conditional `target: "vercel"` in `vite.config.ts` so local builds remain unaffected.
- If Vercel's build environment does not auto-detect Bun, a `BUN_VERSION` environment variable may be needed in the Vercel project settings; this can be added only if the build later fails on package manager detection.
