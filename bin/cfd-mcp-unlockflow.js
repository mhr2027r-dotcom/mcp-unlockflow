#!/usr/bin/env node
/**
 * CLI entry for @capitalflowdesk/mcp-unlockflow
 * Spawns tsx against src/index.ts so npx works without a separate build step.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const entry = join(root, "src", "index.ts");
const require = createRequire(import.meta.url);

let tsxCli;
try {
  tsxCli = require.resolve("tsx/cli");
} catch {
  console.error(
    "[cfd-mcp-unlockflow] Missing dependency `tsx`. Run: npm install @capitalflowdesk/mcp-unlockflow",
  );
  process.exit(1);
}

const child = spawn(process.execPath, [tsxCli, entry], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
