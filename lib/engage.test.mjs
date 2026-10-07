import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { activeStyle, describe, loadStyle, parseCommand, readState, writeState, STYLES } from "./engage.mjs";

const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), "engage-")), "state.json");

test("state: defaults, round-trip, bad values fall back", () => {
  const f = tmp();
  assert.deepEqual(readState(f), { style: "terse", trek: false });
  assert.deepEqual(writeState({ style: "docs" }, f), { style: "docs", trek: false });
  assert.deepEqual(writeState({ trek: true }, f), { style: "docs", trek: true });
  fs.writeFileSync(f, JSON.stringify({ style: "nope", trek: "yes" }));
  assert.deepEqual(readState(f), { style: "terse", trek: false });
  fs.writeFileSync(f, "{not json");
  assert.deepEqual(readState(f), { style: "terse", trek: false });
});

test("loadStyle: every style loads, frontmatter gone, engineering block present", () => {
  for (const s of STYLES) {
    const t = loadStyle(s);
    assert.ok(!t.startsWith("---"), s);
    assert.ok(!/^name: engage-/m.test(t), s);
    assert.match(t, /## Engineering — lazy by default/);
    assert.match(t, /one-line contract/);
  }
  assert.equal(loadStyle("off"), "");
  assert.throws(() => loadStyle("bogus"), /unknown engage style/);
});

test("trek: off by default drops only the garnish bullet; on swaps in the active garnish", () => {
  const off = loadStyle("terse");
  const on = loadStyle("terse", { trek: true });
  assert.doesNotMatch(off, /Star Trek garnish/);
  assert.match(off, /"hit it"/);
  assert.match(on, /Course laid in/);
  assert.doesNotMatch(on, /off unless/);
  assert.equal(on.split("\n").length - off.split("\n").length, 1);
});

test("activeStyle follows state", () => {
  assert.equal(activeStyle({ style: "off", trek: true }), "");
  assert.match(activeStyle({ style: "plain", trek: false }), /## Voice — plain/);
});

test("parseCommand", () => {
  assert.deepEqual(parseCommand(""), { type: "status" });
  assert.deepEqual(parseCommand(" Status "), { type: "status" });
  assert.deepEqual(parseCommand("concise"), { type: "style", style: "concise" });
  assert.deepEqual(parseCommand("off"), { type: "style", style: "off" });
  assert.deepEqual(parseCommand("trek off"), { type: "trek", trek: false });
  assert.deepEqual(parseCommand("trek on"), { type: "trek", trek: true });
  assert.equal(parseCommand("trek maybe").type, "error");
  assert.equal(parseCommand("ultra").type, "error");
  assert.equal(describe({ style: "terse", trek: false }), "engage: style terse · trek off");
});
