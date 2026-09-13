import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import plugin from "./engage.mjs";

process.env.XDG_CONFIG_HOME = fs.mkdtempSync(path.join(os.tmpdir(), "engage-oc-"));

test("opencode: v1 module shape, transform pushes style, commands switch same-turn", async () => {
  assert.equal(plugin.id, "engage");
  const hooks = await plugin.server({});
  const transform = hooks["experimental.chat.system.transform"];
  const before = hooks["command.execute.before"];
  const run = async (command, args) => {
    const output = { parts: [{ type: "text", text: `${command} ${args}` }] };
    await before({ command, arguments: args }, output);
    return output.parts[0].text;
  };

  let output = { system: ["BASE"] };
  await transform({}, output);
  assert.equal(output.system.length, 2);
  assert.match(output.system[1], /## Voice — terse/);

  assert.match(await run("engage", "concise"), /^engage: style concise · trek on\./);
  assert.match(await run("trek", "off"), /^engage: style concise · trek off\./);
  output = { system: [] };
  await transform({}, output);
  assert.match(output.system[0], /## Voice — concise/);
  assert.doesNotMatch(output.system[0], /Star Trek garnish/);

  assert.match(await run("trek", ""), /trek on\./); // blank toggles back
  assert.match(await run("engage", "bogus"), /^unknown style/);
  assert.match(await run("engage", ""), /^engage: style concise · trek on\./);
  const untouched = { parts: [{ type: "text", text: "hello" }] };
  await before({ command: "other", arguments: "off" }, untouched);
  assert.equal(untouched.parts[0].text, "hello");

  assert.match(await run("engage", "off"), /style off/);
  output = { system: [] };
  await transform({}, output);
  assert.deepEqual(output.system, []);
});
