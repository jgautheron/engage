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

## Findings so far (2026-09-27)

- **evolve-xl (12 iterations)** — on Sonnet every contender stays 100% correct; ponytail is 20–25%
  leaner. On Haiku the cross-cutting undo (v5) separates designs: ponytail's minimal undo missed later
  mutations in 2/3 projects, engage in 0/3. Engage's Haiku losses came from one local recursion slip
  (identical in 2 samples — Haiku repeats itself on identical input, so treat n as ~2).
- **engage-next** (8 rules imported from open ponytail PRs, +183 tok): rejected — worse undo design
  (2/3 failures) and one compile-breaking name clash on Sonnet. Kept in `candidates/_rejected/`.
- **engage-lean** (contract rule 1–3 lines → one line): **adopted in 0.4.3**. Never worse on correctness
  (Haiku XL n=5: 95% vs 93% at v12, 11 vs 16 regressions; tied on Sonnet XL and checkout); code size
  unchanged — the model barely writes contracts under a real system prompt, so they weren't the cost.
  The size gap vs ponytail (12–16%) comes from structure: more files and exported internals.
- Samples now carry a neutral session tag; before that, Haiku repeated byte-identical code across
  "independent" samples. With independent samples the undo trap catches every contender on Haiku
  (ponytail 2/5, engage 3/5, engage-lean 1/5) — the earlier "0/3 for engage" did not hold.
- **engage-compact** (new module only when it hides real complexity; export only what callers use):
  rejected — size effect inconsistent (checkout −8%, Sonnet XL +7%, Haiku XL +3%), correctness tied or
  slightly worse.
- **engage vs ponytail, pooled independent samples (Haiku XL n=10, Sonnet XL n=4):** engage 92.5% vs
  89% at v12, 14.5 vs 20.4 regressions, late/early cost per iteration 1.49× vs 1.78×; Sonnet 4/4 vs 3/4
  projects correct at v12 (ponytail's miss: undo stack named `history`, colliding with v9's `history()`).
  Ponytail stays smaller: +5% (Haiku) / +12% (Sonnet) final size for engage.
- **Sonnet 5 focus (2026-09-27)** — default models pinned to `claude-sonnet-5` (the `sonnet` alias
  already resolved to it). Prose runs now get read-only tools in an empty dir: without them, "look at
  the repo first" (good agent behaviour) was scored as a failure on vague requests.
- **engage-extend** ("extend the existing structure; restructure only when the change can't fit, and
  say so"): **adopted in 0.4.4** — design-heavy churn 253 → 213 lines (ponytail 216), same tokens,
  same correctness. **engage-verify** (re-read touched files, run checks): held — churn also down but
  +7% tokens, and no name collision occurred to test its point. **engage-brief** (reply length rule):
  rejected — no gain.
- Prose on Sonnet 5 with tools: engage 93% vs terse hook 89% on checks, 144 vs 137 tokens per reply.
