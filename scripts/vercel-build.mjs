#!/usr/bin/env node
/**
 * Post-build step: restructure `dist/client` + `dist/server` into the
 * Vercel Build Output API v3 layout at `.vercel/output/`.
 *
 * Layout produced:
 *   .vercel/output/
 *     config.json
 *     static/                 (copy of dist/client)
 *     functions/index.func/
 *       .vc-config.json       (edge runtime)
 *       index.js              (re-exports the SSR fetch handler)
 *       <bundled server files copied from dist/server>
 */
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

// Wipe previous .vercel/output
await rm(outDir, { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });
await mkdir(fnDir, { recursive: true });

// 1. Static assets
await cp(distClient, staticDir, { recursive: true });

// 2. Server bundle into the edge function directory
await cp(distServer, fnDir, { recursive: true });

// 3. Function entry that re-exports the SSR handler's fetch as default
//    (Vercel Edge runtime expects `export default { fetch }` or a fetch fn)
await writeFile(
  path.join(fnDir, "index.js"),
  `import handler from "./server.js";\nexport default handler;\n`,
  "utf8",
);

// 4. Function config — edge runtime
await writeFile(
  path.join(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "edge",
      entrypoint: "index.js",
    },
    null,
    2,
  ),
  "utf8",
);

// 5. Top-level Build Output config: static-first, fall through to the SSR fn
const staticFiles = await readdir(staticDir);
const assetFolders = staticFiles.filter((n) => !n.includes("."));

await writeFile(
  path.join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Serve hashed assets directly with long-cache headers
        ...assetFolders.map((folder) => ({
          src: `^/${folder}/(.*)$`,
          headers: { "cache-control": "public, max-age=31536000, immutable" },
          continue: true,
        })),
        // Let the platform serve any matching static file first
        { handle: "filesystem" },
        // Everything else hits the SSR function
        { src: "/.*", dest: "/index" },
      ],
    },
    null,
    2,
  ),
  "utf8",
);

console.log("vercel-build: .vercel/output ready");
