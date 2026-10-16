import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { commentProblems } from "./comment-guard.mjs";

const HOOK = new URL("./comment-guard.mjs", import.meta.url).pathname;
const configWith = (outputStyle) => { const c = fs.mkdtempSync(path.join(os.tmpdir(), "eng-c-")); fs.writeFileSync(path.join(c, "settings.json"), JSON.stringify({ outputStyle })); return c; };
const run = (input, style = "engage:engage-terse") =>
  execFileSync("node", [HOOK], { input: JSON.stringify(input), encoding: "utf8", env: { ...process.env, CLAUDE_CONFIG_DIR: configWith(style), CLAUDE_PROJECT_DIR: os.tmpdir() } });

test("two-line comments and code pass", () => {
  assert.deepEqual(commentProblems("a.ts", "// why one\n// why two\nconst x = 1; // trailing why\n"), []);
});

test("a three-line comment block is flagged", () => {
  assert.equal(commentProblems("a.ts", "// one\n// two\n// three\nf();").length, 1);
  assert.equal(commentProblems("a.ts", "/*\n * one\n * two\n * three\n */\nf();").length, 1);
});

test("a one-line JSDoc contract with bare delimiters passes", () => {
  assert.deepEqual(commentProblems("a.ts", "/**\n * Parses the header; throws on bad input.\n */\nexport function f() {}"), []);
});

test("ticket references are flagged in any comment", () => {
  assert.equal(commentProblems("a.ts", "// fixes PROJ-123\nf();").length, 1);
  assert.equal(commentProblems("a.ts", "f(); // see #482").length, 1);
  assert.equal(commentProblems("a.py", "# workaround for issue 17\nf()").length, 1);
});

test("license headers, lint pragmas and string contents are exempt", () => {
  assert.deepEqual(commentProblems("a.ts", "// SPDX-License-Identifier: MIT\n// Copyright 2026 Someone\n// All rights reserved.\n"), []);
  assert.deepEqual(commentProblems("a.ts", 'const url = "http://x/#123"; const k = "ABC-12";'), []);
});

test("files that are not covered pass untouched", () => {
  assert.deepEqual(commentProblems("README.md", "# Title\n# Two\n# Three\n#123"), []);
});

test("the hook blocks an Edit that adds a ticket reference and stays quiet otherwise", () => {
  const bad = run({ tool_input: { file_path: "/x/a.ts", old_string: "f();", new_string: "// JIRA-9 fix\nf();" } });
  assert.equal(JSON.parse(bad).decision, "block");
  assert.equal(run({ tool_input: { file_path: "/x/a.ts", content: "f();\n" } }), "");
});

test("the hook stays quiet when engage isn't the output style", () => {
  assert.equal(run({ tool_input: { file_path: "/x/a.ts", content: "// JIRA-9 fix\nf();" } }, "default"), "");
});
