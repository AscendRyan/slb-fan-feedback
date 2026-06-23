#!/usr/bin/env node
/**
 * Post-build: produce a Vercel Build Output API v3 bundle at .vercel/output/
 *
 *   .vercel/output/
 *     config.json
 *     static/                 (copy of dist/client)
 *     functions/index.func/
 *       .vc-config.json       (edge runtime)
 *       index.js              (esbuild-bundled SSR — all deps inlined)
 *
 * Vercel's edge runtime has no node_modules at runtime, so we re-bundle the
 * SSR output (dist/server/server.js) with esbuild and inline every dependency
 * into a single self-contained file.
 */
import { build } from "esbuild";
import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distClient = path.join(root, "dist", "client");
const distServer = path.join(root, "dist", "server");
const outDir = path.join(root, ".vercel", "output");
const staticDir = path.join(outDir, "static");
const fnDir = path.join(outDir, "functions", "index.func");

if (!existsSync(distClient) || !existsSync(distServer)) {
  console.error("vercel-build: dist/client or dist/server missing. Did `vite build` run?");
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });
await mkdir(fnDir, { recursive: true });

// 1. Static assets
await cp(distClient, staticDir, { recursive: true });

// 2. Bundle the SSR entry with all dependencies inlined.
await build({
  entryPoints: [path.join(distServer, "server.js")],
  outfile: path.join(fnDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  mainFields: ["module", "main"],
  conditions: ["workerd", "worker", "browser", "import", "default"],
  legalComments: "none",
  logLevel: "info",
  // Edge runtime exposes Web APIs natively; leave node: built-ins alone so
  // the runtime resolves them (workerd has node compat for the ones we use).
  external: ["node:*"],
});

// 3. Function config — edge runtime
await writeFile(
  path.join(fnDir, ".vc-config.json"),
  JSON.stringify({ runtime: "edge", entrypoint: "index.js" }, null, 2),
  "utf8",
);

// 4. Top-level Build Output config: static-first, fall through to the SSR fn
const staticFiles = await readdir(staticDir);
const assetFolders = staticFiles.filter((n) => !n.includes("."));

await writeFile(
  path.join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        ...assetFolders.map((folder) => ({
          src: `^/${folder}/(.*)$`,
          headers: { "cache-control": "public, max-age=31536000, immutable" },
          continue: true,
        })),
        { handle: "filesystem" },
        { src: "/.*", dest: "/index" },
      ],
    },
    null,
    2,
  ),
  "utf8",
);

console.log("vercel-build: .vercel/output ready");
