// engage — OpenCode plugin (server). Pushes the active style onto the system
// prompt every turn; /engage and /trek persist switches (cross-host, ~/.config/engage).
// OpenCode ≥ 1.1.26 (command.execute.before); system transform since 1.0.154.
import { activeStyle, describe, parseCommand, readState, writeState } from "../lib/engage.mjs";

async function server() {
  return {
    "experimental.chat.system.transform": async (_input, output) => {
      const text = activeStyle(readState());
      if (text) output.system.push(text);
    },

    // Runs before the request is built, so the switch applies to this very turn.
    // A command always sends a turn; rewrite its text so the model confirms the real state.
    "command.execute.before": async (input, output) => {
      if (!input || (input.command !== "engage" && input.command !== "trek")) return;
      const args = String(input.arguments || "").trim();
      const cmd = input.command === "trek"
        ? parseCommand(`trek ${args || (readState().trek ? "off" : "on")}`)
        : parseCommand(args);
      let line;
      if (cmd.type === "error") line = cmd.error;
      else if (cmd.type === "status") line = describe(readState());
      else line = describe(writeState(cmd.type === "style" ? { style: cmd.style } : { trek: cmd.trek }));
      const part = output?.parts?.find((p) => p.type === "text");
      if (part) part.text = `${line}. Reply with exactly that line, nothing else.`;
    },
  };
}

export default { id: "engage", server };
