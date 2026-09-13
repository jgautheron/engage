#!/usr/bin/env node
// engage — tiny CLI for hosts without a native command: node codex/engage.mjs <args>
import { describe, parseCommand, readState, writeState } from "../lib/engage.mjs";

const cmd = parseCommand(process.argv.slice(2).join(" "));
if (cmd.type === "error") {
  console.error(cmd.error);
  process.exit(2);
}
const state = cmd.type === "status" ? readState() : writeState(cmd.type === "style" ? { style: cmd.style } : { trek: cmd.trek });
console.log(describe(state));
