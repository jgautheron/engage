---
name: engage
description: Switch the engage output style or its Star Trek garnish. Use when the user says "$engage terse|concise|docs|plain|off", "$engage trek on|off", "/trek", or asks to change the engage style.
---

engage keeps one shared setting for every host in `~/.config/engage/state.json`.

1. Run the CLI that ships two directories above this file (this skill lives at
   `<plugin>/codex/skills/engage/SKILL.md`; the CLI is `<plugin>/codex/engage.mjs`):

   ```
   node <plugin>/codex/engage.mjs terse|concise|docs|plain|off
   node <plugin>/codex/engage.mjs trek on|off
   node <plugin>/codex/engage.mjs            # status
   ```

   The path is also printed in the session context under "Switching".

2. The saved setting loads at the next session start. For the rest of this
   session, read `<plugin>/output-styles/engage-<style>.md` and follow it
   immediately; for `trek off`, drop the Star Trek garnish from now on.

3. Confirm in one line, e.g. `engage: style docs · trek off`.
