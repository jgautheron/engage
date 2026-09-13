// engage — pi extension. Appends the active style to the system prompt every
// turn; /engage and /trek switch it (persisted cross-host in ~/.config/engage).
import { activeStyle, describe, parseCommand, readState, STYLES, writeState } from "../lib/engage.mjs";

const CHOICES = [...STYLES, "off", "trek on", "trek off", "status"];

export default function engage(pi) {
  let state = readState();

  const badge = (ctx) => ctx?.ui?.setStatus?.("engage", state.style === "off" ? "" : `engage:${state.style}`);
  const apply = (patch, ctx) => {
    state = writeState(patch);
    badge(ctx);
    ctx?.ui?.notify?.(describe(state), "info");
  };

  pi.registerCommand("engage", {
    description: "engage style: terse|concise|docs|plain|off, trek on|off, status",
    getArgumentCompletions: (prefix) => {
      const hits = CHOICES.filter((c) => c.startsWith(prefix.toLowerCase())).map((c) => ({ value: c, label: c }));
      return hits.length ? hits : null;
    },
    handler: async (args, ctx) => {
      const cmd = parseCommand(args);
      if (cmd.type === "status") return ctx?.ui?.notify?.(describe(state), "info");
      if (cmd.type === "error") return ctx?.ui?.notify?.(cmd.error, "warning");
      apply(cmd.type === "style" ? { style: cmd.style } : { trek: cmd.trek }, ctx);
    },
  });

  pi.registerCommand("trek", {
    description: "Toggle the light Star Trek garnish: /trek on|off",
    handler: async (args, ctx) => {
      const cmd = parseCommand(`trek ${String(args || "").trim() || (state.trek ? "off" : "on")}`);
      if (cmd.type === "error") return ctx?.ui?.notify?.(cmd.error, "warning");
      apply({ trek: cmd.trek }, ctx);
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    state = readState();
    badge(ctx);
  });

  pi.on("before_agent_start", async (event) => {
    const text = activeStyle(state);
    if (!text) return;
    return { systemPrompt: `${event.systemPrompt}\n\n${text}` };
  });
}
