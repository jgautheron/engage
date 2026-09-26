# engage arena

One command pits engage against other agent rule sets and prints a scorecard.

```sh
node bench/arena/arena.mjs                      # full run: n=2, all suites, all contenders
node bench/arena/arena.mjs --n 3 --suites billing --variants code-hook,engage
```

**Contenders.** `base` (no rules, reference only) · `terse-hook` · `code-hook` · `both-hooks` ·
`engage` (engage-terse). Hook-based rule sets are pulled fresh from their public repos into
`~/.cache/engage-bench/` and run through their own hooks, so the text is exactly what they inject;
it is never stored here. Hook text is delivered as reminders in the user turn (how hooks deliver it);
engage is appended to the system prompt (how an output style is delivered).

**Clean room.** Every call is `claude -p --restricted --strict-mcp-config`: no user/project settings,
output style, plugins, CLAUDE.md or MCP; no shell; file tools confined to a temp working dir.
Uses your Claude Code login — `claude -p` usage draws on the metered pool.

**Suites.**
- `prose` — 10 prompts ([prose.json](prose.json)) with pass/fail checks: correct fix, options on a
  vague ask, confirmation before a destructive action, security flags, false-premise correction,
  no AI slop. Also output tokens per reply.
- `checkout` — precise multi-file spec (from `bench/multifile`); a weaker, rule-free maintainer then
  applies a cross-module change. Hidden tests score both steps.
- `billing` — **ambiguous** spec: the generator chooses the proration rules. The maintainer adds
  seats that must follow *exactly the same* rules. Scored against each codebase's own decisions:
  behaviour preserved, seats prorated like plans, spec invariants. The scorer is validated on two
  references with different proration choices (both 100%) and fails a mismatched pair.

**Scorecard.** Per metric: every contender's value, the leaders (excluding `base`), and whether
engage is best, tied (±2% rates, ±5% token counts) or behind. Raw replies and code land in
`results/<stamp>/work/` (git-ignored); `scorecard.md`, `results.json` and `footprint.json` are kept.
