#!/usr/bin/env node
/**
 * ARM CLI Entry Point
 * Checks Node version first, then delegates to the main CLI module.
 */

import { fileURLToPath } from "node:url";
import path from "node:path";

const REQUIRED_NODE_VERSION = "22.18";

function checkNodeVersion() {
  const current = process.version.slice(1); // Remove 'v'
  const required = REQUIRED_NODE_VERSION;
  const currentParts = current.split(".").map(Number);
  const requiredParts = required.split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
    const c = currentParts[i] ?? 0;
    const r = requiredParts[i] ?? 0;
    if (c > r) return; // Current is newer
    if (c < r) {
      console.error(`ARM needs Node ${REQUIRED_NODE_VERSION} or newer. Current: ${current}`);
      console.error("Install a current Node from https://nodejs.org/");
      process.exit(1);
    }
  }
}

checkNodeVersion();

// Resolve the compiled CLI entry point
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliEntry = path.resolve(__dirname, "..", "dist", "cli", "main.js");

// Import and run the CLI
import(cliEntry).catch((err) => {
  console.error("Failed to load ARM CLI:", err);
  process.exit(1);
});