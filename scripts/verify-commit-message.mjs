#!/usr/bin/env node
/**
 * Validates the first line of a Git commit message (commit-msg hook).
 * See docs/COMMIT_MESSAGES.md for the convention.
 */
import { readFileSync, writeFileSync } from "node:fs";

const ALLOWED_TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
];

const msgFile = process.argv[2];

if (!msgFile) {
  console.error("verify-commit-message: missing path to commit message file.");
  process.exit(1);
}

const raw = readFileSync(msgFile, "utf8");
const lines = raw.split(/\r?\n/);
const cleanedLines = lines.filter((line) => !/^co-authored-by:/i.test(line.trim()));
const cleaned = cleanedLines
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trimEnd();

if (cleaned !== raw.trimEnd()) {
  writeFileSync(msgFile, cleaned ? `${cleaned}\n` : "", "utf8");
}

const firstLine = cleanedLines[0]?.trim() ?? "";

if (firstLine.startsWith("Merge ")) {
  process.exit(0);
}

const typePattern = ALLOWED_TYPES.join("|");
const pattern = new RegExp(`^(${typePattern}):\\s+.+$`);

if (!pattern.test(firstLine)) {
  console.error("");
  console.error("Invalid commit message subject line.");
  console.error("");
  console.error("  Required format:  <type>: <description>");
  console.error("");
  console.error("  <type> must be one of:");
  console.error(`    ${ALLOWED_TYPES.join(", ")}`);
  console.error("");
  console.error("  Examples:");
  console.error("    feat: add admin settings page");
  console.error("    fix: handle empty chat history");
  console.error("    chore: bump dependencies");
  console.error("");
  console.error(`  Your first line was:\n    ${firstLine || "(empty)"}`);
  console.error("");
  console.error("  See docs/COMMIT_MESSAGES.md for details.");
  console.error("");
  process.exit(1);
}

process.exit(0);
