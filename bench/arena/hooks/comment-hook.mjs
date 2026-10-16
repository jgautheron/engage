// The plugin's comment guard, ungated: arena sessions run --restricted, so no output style is set.
import fs from "node:fs";
import { guard } from "../../../claude/comment-guard.mjs";
let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const out = guard(input);
if (out) process.stdout.write(JSON.stringify(out));
