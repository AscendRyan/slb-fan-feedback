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

// 2. Write a small entry wrapper that exposes the Web fetch handler as the
//    function's default export (Vercel Node runtime supports Web Request/Response).
const wrapperPath = path.join(root, "dist", "server", "_vercel-entry.mjs");
await writeFile(
  wrapperPath,
  [
    `import handler from "./server.js";`,
    `export default async function (request) {`,
    `  return handler.fetch(request, {}, {});`,
    `}`,
  ].join("\n"),
  "utf8",
);

// 3. Bundle the wrapper + SSR entry with all dependencies inlined.
await build({
  entryPoints: [wrapperPath],
  outfile: path.join(fnDir, "index.mjs"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  mainFields: ["module", "main"],
  legalComments: "none",
  logLevel: "warning",
  banner: {
    js: [
      "import { createRequire } from 'node:module';",
      "const require = createRequire(import.meta.url);",
    ].join("\n"),
  },
});

// 3. Function config — Node serverless runtime (supports Web fetch handler)
await writeFile(
  path.join(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
  "utf8",
);
// Vercel's Node launcher requires package.json with "type":"module" for .mjs ESM
await writeFile(
  path.join(fnDir, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
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
