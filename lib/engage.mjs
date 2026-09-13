// Shared core for the non-Claude hosts (codex, pi, opencode).
// Claude Code reads output-styles/*.md natively; the other hosts load the same
// files through this module so there is one source of truth.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const STYLES = ["terse", "concise", "docs", "plain"];
export const DEFAULT_STATE = { style: "terse", trek: true };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Cross-host state file: ~/.config/engage/state.json (XDG_CONFIG_HOME honoured). */
export function stateFile() {
  const base = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  return path.join(base, "engage", "state.json");
}

/** Current {style, trek}; unknown or missing values fall back to defaults. */
export function readState(file = stateFile()) {
  let raw = {};
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { ...DEFAULT_STATE };
  }
  return {
    style: STYLES.includes(raw.style) || raw.style === "off" ? raw.style : DEFAULT_STATE.style,
    trek: typeof raw.trek === "boolean" ? raw.trek : DEFAULT_STATE.trek,
  };
}

/** Merge `patch` into the state file and return the new state. */
export function writeState(patch, file = stateFile()) {
  const next = { ...readState(file), ...patch };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  return next;
}

/** Style text ready for a system prompt: frontmatter stripped, Trek bullet dropped when trek=false. Empty string for "off". */
export function loadStyle(style, { trek = true } = {}) {
  if (style === "off") return "";
  if (!STYLES.includes(style)) throw new Error(`unknown engage style: ${style}`);
  const md = fs.readFileSync(path.join(ROOT, "output-styles", `engage-${style}.md`), "utf8");
  const body = md.replace(/^---[\s\S]*?\n---\n/, "").trim();
  if (trek) return body;
  return body
    .split("\n")
    .filter((line) => !/star trek garnish/i.test(line))
    .join("\n");
}

/** Text for the active state, or "" when the style is off. */
export function activeStyle(state = readState()) {
  return loadStyle(state.style, { trek: state.trek });
}

/**
 * Parse `/engage <args>`: "" | "status" → status; "off"; a style name; "trek on|off".
 * Returns {type, style?, trek?, error?}.
 */
export function parseCommand(args) {
  const [head, tail] = String(args || "").trim().toLowerCase().split(/\s+/);
  if (!head || head === "status") return { type: "status" };
  if (head === "off") return { type: "style", style: "off" };
  if (STYLES.includes(head)) return { type: "style", style: head };
  if (head === "trek") {
    if (tail === "on" || tail === "off") return { type: "trek", trek: tail === "on" };
    return { type: "error", error: "usage: /engage trek on|off" };
  }
  return { type: "error", error: `unknown style "${head}" — one of ${STYLES.join("|")}, off, trek on|off` };
}

/** One-line status for notifications. */
export function describe(state) {
  return `engage: style ${state.style} · trek ${state.trek ? "on" : "off"}`;
}
