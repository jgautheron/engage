# engage arena — stick-sonnet-flow3

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"bad48a0e","code-hook":"09c434a","both-hooks":"bad48a0e+09c434a","engage":"f7c3582"}

| metric | engage-flow3 | best (excl. base) | engage |
|---|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% |  | — |
| evolve-xl: tests passed at v15 (every feature) | 99% |  | — |
| evolve-xl: regressions (earlier cases broken, summed) | 1.5 |  | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 246 |  | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 244 |  | — |
| evolve-xl: lines changed on the trivial v12 | 10 |  | — |
| evolve-xl: output tokens, whole project | 57368 |  | — |
| evolve-xl: cost growth — late vs early iteration tokens | 1.59× |  | — |
| evolve-xl: $ cost, whole project | $1.62 |  | — |
| evolve-xl: agent turns, whole project | 128 |  | — |
| evolve-xl: final size (tok) | 4296 |  | — |
| evolve-xl: health — files at the end | 1.0 |  | — |
| evolve-xl: health — largest file (lines) | 518 |  | — |
| evolve-xl: health — largest function (lines) | 316 |  | — |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 51 |  | — |
| evolve-xl: health — functions over 50 own lines | 0.8 |  | — |
| evolve-xl: health — functions over complexity 12 | 2.8 |  | — |
| evolve-xl: control flow — worst cognitive complexity in a function | 25.8 |  | — |
| evolve-xl: control flow — functions over cognitive complexity 15 | 1.8 |  | — |
| evolve-xl: control flow — total cognitive complexity | 131 |  | — |
| evolve-xl: control flow — deepest nesting | 2.8 |  | — |
| evolve-xl: control flow — longest else-if chain | 1.3 |  | — |
| evolve-xl: control flow — else after return/throw | 0.0 |  | — |
| evolve-xl: health — max branch complexity | 19.5 |  | — |
| evolve-xl: health — duplicated blocks | 0.8 |  | — |
| evolve-xl: health — non-null assertions | 0.5 |  | — |
| evolve-xl: locality — existing functions changed per iteration | 4.1 |  | — |
| evolve-xl: locality — new functions per iteration | 3.1 |  | — |
| evolve-xl: design — share of pure functions | 77% |  | — |
| evolve-xl: design — union types (literal + tagged) | 4.3 |  | — |
| evolve-xl: design — exhaustive never checks | 0.0 |  | — |
| evolve-xl: design — imports per file | 0.00 |  | — |
| evolve-xl: tests — test cases written | 0 |  | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% |  | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% |  | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% |  | — |
| evolve-xl: runs without a build step (all snapshots) | 100% |  | — |
| rule footprint, one-time (tok) | 1519 |  | — |
| rule footprint, per turn (tok) | 0 |  | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $6.48

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
