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
- **Long-term health (Sonnet 5, 15 iterations, v13–v15 = actors, atomic bulk complete, edit):** new
  `health.ts` (TS-5 AST: largest file/function, branch complexity, duplication, non-null escapes) and
  `--maintain <run>` (a rule-free Haiku applies extra change requests to finished projects). Every
  contender, engage included, ends with one 450–660-line file around a single 300–450-line closure.
  Blind maintenance of engage vs ponytail code: tie (100%/100%). Engage's measurable health edges:
  fewer non-null escapes, ~0 duplication, fewer regressions, churn at ponytail's level (after 0.4.4).
- **engage-longterm** (split past ~300 lines, one choke point for cross-cutting concerns, name state
  by role) and **engage-split** (extract-before-adding past ~300 lines + "already in repo? reuse it"
  rung): rejected — no project was ever split; style rules did not change macro-architecture.
- **Comment discipline (`--suites comments`, 2026-09-28):** probes that tempt ticket IDs, war stories
  and long doc blocks, plus a refactor of a file full of legacy comment noise. New code was already
  clean (0 ticket refs for engage). The real leak was *inherited* comments: when refactoring, engage
  kept tickets/banners/authors. **Adopted in 0.4.5:** comments only when they add real value, ≤2 lines,
  no banners/war stories/ticket IDs/dates/names, and "code you rewrite: bring its comments and header
  to this bar — strip ticket/issue IDs, names and dates even from comments you keep". Full suite:
  runs with ticket refs 25% → 8%, war stories 25% → 0%, blocks > 2 lines 25% → 0%, comment lines −60%.
- **Vague requests (2026-09-28):** the old check (a "?" only) mostly measured the harness. In an empty
  dir the right move is "where's the project?" — engage does that; in a real project the request stops
  being vague and acting on the obvious reading is fine. Vague prompts now run in a seeded API project
  (`tasks/prose-seeds/api`) and are checked for asking + ≥2 listed options + a recommended pick.
  **engage-vague adopted in 0.4.6** ("asking the user anything: look first; 2–3 concrete options as a
  list, each with a one-line trade-off, say which you'd pick"): never worse, shorter — full suite 90% vs
  89% at 128 vs 143 tokens/reply; seeded vague 56% vs 47% at 2,195 vs 2,491 tokens.
- **Agent mode (`--agent 1`, 2026-09-28):** sessions may run `bunx tsc` and `bun test` (permission rules
  allow only those; workspaces live in a temp dir outside the repo). 15-iteration evolve on Sonnet 5,
  n=2: every contender 100% correct — with a test loop, style rules stop mattering for correctness.
  Cost per project: ponytail $3.14 / 262 turns, engage $3.45 / 310 turns (+10%), churn on design steps
  217 vs 262. Engage keeps its type-safety edge (0 vs 6 non-null assertions). **engage-verify
  rejected** — nothing to gain once tests run. Next target: engage's extra turns/tokens in agent mode.
- **Architecture round (2026-10-07):** new metrics (`health.ts`: pure-function share, union types,
  exhaustive checks, coupling, tests; `locality.ts`: existing functions changed per iteration), resume
  for interrupted runs, `--iters`, `--start-from` (swap). Agent mode, Sonnet 5, v1–v12, n=2, then a
  rule-free Haiku maintains v13–v15.
  - **engage-tdd** (failing test first, one behaviour per test) — best of the race: fewest design-step
    lines (190 vs engage 227 / ponytail 206), smallest code, lowest complexity, most tests (92), and the
    cheapest code for Haiku to maintain (14.5k tokens). Candidate for adoption after confirmation.
  - **engage-plan** (3-line design before v1) — rejected: only contender with regressions, and its code
    was the hardest to maintain (Haiku: 94%, 10 regressions).
  - **engage-core** / **engage-types** — no gain while building; their code was the safest to maintain
    (Haiku 100%, ≤1 regression) — weak signal at n=2. Nobody wrote an exhaustive `never` check.
  - **Swap:** hygiene (duplication, complexity) follows the contender's habits; change locality follows
    the v1 design — engage starts → 3.0–3.5 existing functions changed per feature, ponytail starts → 4.1–4.3.
- **TDD confirmation (n=4, agent mode, Sonnet 5, 2026-10-08):** engage-tdd's n=2 lead did **not**
  replicate — design churn 228 vs engage 235, size 3,877 vs 3,933, complexity 19.3 vs 20.3 (all ties), and
  change locality got worse (5.2 vs 3.9 existing functions changed per feature). Only stable effect: +28%
  tests. Parked, not adopted. Engage vs ponytail (n=4): both 100% correct; engage lower complexity
  (20.3 vs 25.0), fewer non-null escapes (1.3 vs 3.8), better locality (3.9 vs 4.2), more tests (69 vs 45),
  Haiku maintenance 100% vs 99%; ponytail ~12% smaller code and ~14% cheaper per project.
- **Test quality (2026-10-08):** `testq.ts` scores a suite by mutation score (≤40 AST mutants; killed =
  more failures than baseline), staleness (own suite green), brittleness (fails on an independent correct
  implementation) and smells; `--suites testwrite` = write tests for a finished build with 3 planted bugs.
  - Retro on 28 long (12-step) agent projects: engage suites catch fewer mutants than ponytail's
    (60% vs 75%) and go stale (left `priority: "normal"` assertions red after v10).
  - **engage-tests** (spec-derived oracles, one plausible bug per test, exact assertions, boundaries/
    errors, mock only externals, keep the suite green) — parked: testwrite at ceiling (all catch 3/3
    planted bugs, 0% bug-encoding tests, ~54% mutation), 5-step evolve at ceiling (engage 100% mutation,
    0% brittle; engage-tests 99%, 3%). Ponytail skipped tests entirely in 1 of 4 projects.
  - The weakness is drift on long projects; testing a rule against it needs the 12-step agent run.
- **Test drift (12-step agent, n=4, 2026-10-09):** engage = ponytail on mutation score (78% / 78%) and
  suite health (100% green both); the retro 60%-vs-75% gap did not replicate (pooled n=10: ~67% vs ~76%,
  noisy). **engage-drift** ("update/delete obsoleted tests; every feature gets tests") rejected: 75%
  mutation, 98% green, 4% brittle. Stable difference across all runs: ponytail 2.3 assertions per test vs
  engage 1.7 — engage writes more, smaller tests (90 vs 60) with more error-path cases.
- **Ablation (2026-10-09, Sonnet 5, n=3):** engage minus one section at a time. Prose: no voice → replies
  +21% tokens; no Always → +6%. Comments: no comment rules → ticket refs 8% → 25%. 12-step build: no
  engineering block → largest function 274 → 336 lines, complexity 18.7 → 21.0; no perf → complexity 29.7;
  no reader rules → largest function 330, churn +11%; no design → 317; no never-drop → one broken project.
  Ladder: no measurable change, but the task never exercises dependency/stdlib choices. **No cuts.**
- **Real-repo replay (`--suites replay`):** real cachet commits — plain export of the parent (no .git),
  commit message as the task, scored only on tests that fail on the parent and pass on the real commit
  (`tasks/replay/validate.mjs` found 12 of 24 candidate commits usable). Each session gets an APFS
  clone of the warm cargo target dir (no shared lock).
- **Real-repo replay, cachet (Rust), Sonnet 5, n=2 (2026-10-09):** 6 commits run, 2 broken in the
  harness (real tests never compiled for any contender — likely non-.rs fixtures not copied) and
  excluded. On the 4 valid commits, real-commit tests passing on the agent's code: **engage 83%**, no
  rules 58%, ponytail 42%; real tests compiled: engage 8/8, no rules 7/8, ponytail 6/8. Engage never
  failed a whole task. Caveats: several sessions hit the 20-minute cap (cost recorded as $0, edits kept;
  affected all contenders), and "lines changed" includes the dropped-in test files — ignore it.
  Harness to-do: longer session cap, exclude tests/ from churn, copy non-.rs fixture files.
- **Single style (v0.7.0):** engage is now only `engage:engage-terse`; it absorbed the docs-writing rules
  (controlled prose for docs/READMEs/error messages). concise/docs/plain removed.
- **gdp-ts (rauchg/gdp-ts, "Ghosts of Departed Proofs") → engage-gdp** ("preconditions as types: checks
  return evidence the sensitive operation requires"): parked — 0 of 4 Sonnet 5 projects adopted the
  pattern on the new `authz` task (plain `requireX`/boolean checks throughout); authz correctness was at
  ceiling (97–100%) for every contender. The pattern needs gdp-ts's library + lint + skill, not a style
  sentence. (Harness note: the run built v1–v4 itself — pass `--iters 1` before `--maintain` next time.)
