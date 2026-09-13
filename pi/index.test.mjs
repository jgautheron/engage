import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import engage from "./index.js";

process.env.XDG_CONFIG_HOME = fs.mkdtempSync(path.join(os.tmpdir(), "engage-pi-"));

function fakePi() {
  const commands = {};
  const handlers = {};
  const notices = [];
  const pi = {
    registerCommand: (name, def) => (commands[name] = def),
    on: (event, fn) => (handlers[event] = fn),
  };
  const status = {};
  const ctx = { ui: { notify: (msg, level) => notices.push([level, msg]), setStatus: (k, v) => (status[k] = v) } };
  return { pi, commands, handlers, notices, ctx, status };
}

test("pi: registers /engage + /trek, appends style, persists switches", async () => {
  const { pi, commands, handlers, notices, ctx, status } = fakePi();
  engage(pi);
  assert.deepEqual(Object.keys(commands).sort(), ["engage", "trek"]);
  assert.deepEqual(commands.engage.getArgumentCompletions("t").map((c) => c.value), ["terse", "trek on", "trek off"]);
  assert.equal(commands.engage.getArgumentCompletions("zzz"), null);

  let out = await handlers.before_agent_start({ systemPrompt: "BASE" });
  assert.match(out.systemPrompt, /^BASE\n\n/);
  assert.match(out.systemPrompt, /## Voice — terse/);
  assert.match(out.systemPrompt, /Star Trek garnish/);

  await commands.engage.handler("docs", ctx);
  assert.equal(status.engage, "engage:docs");
  await commands.trek.handler("off", ctx);
  out = await handlers.before_agent_start({ systemPrompt: "BASE" });
  assert.match(out.systemPrompt, /## Voice — technical documentation/);
  assert.doesNotMatch(out.systemPrompt, /Star Trek garnish/);
  assert.equal(notices.at(-1)[1], "engage: style docs · trek off");

  await commands.trek.handler("", ctx); // blank toggles
  assert.equal(notices.at(-1)[1], "engage: style docs · trek on");

  await commands.engage.handler("off", ctx);
  assert.equal(status.engage, "");
  assert.equal(await handlers.before_agent_start({ systemPrompt: "BASE" }), undefined);

  await commands.engage.handler("ultra", ctx);
  assert.equal(notices.at(-1)[0], "warning");
  await commands.engage.handler("", ctx);
  assert.equal(notices.at(-1)[1], "engage: style off · trek on");

  // a fresh session re-reads the shared file
  fs.writeFileSync(path.join(process.env.XDG_CONFIG_HOME, "engage", "state.json"), JSON.stringify({ style: "plain", trek: true }));
  await handlers.session_start({}, {});
  out = await handlers.before_agent_start({ systemPrompt: "BASE" });
  assert.match(out.systemPrompt, /## Voice — plain/);
});
