# Deploying to Vercel

This project builds a Vercel Build Output API v3 bundle into `.vercel/output`.

## Required Vercel project settings

In **Vercel Dashboard → Project → Settings → Build & Development Settings**, make sure NOTHING is overridden (all toggles off). The values in `vercel.json` must win:

- Framework Preset: **Other** (or leave default — `vercel.json` sets `framework: null`)
- Build Command: *(not overridden)* — comes from `vercel.json`: `bun run build:vercel`
- Output Directory: *(not overridden)* — comes from `vercel.json`: `.vercel/output`
- Install Command: *(not overridden)* — comes from `vercel.json`: `bun install`

If the deploy log shows:

```
Error: No Output Directory named "output" found after the Build completed.
```

it means a Dashboard override is still set. Click the **Override** toggles OFF for Output Directory and Build Command and redeploy.

## Verifying the build ran correctly

A successful deploy log will contain:

```
vercel-build: .vercel/output ready
```

If you do NOT see that line, the post-build step did not run — Vercel is using a Dashboard override or building an old commit. Push the latest commit and clear overrides.

## Local test

```bash
bun run build:vercel
ls .vercel/output            # should contain config.json, static/, functions/
```
