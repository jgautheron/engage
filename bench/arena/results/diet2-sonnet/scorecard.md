# engage arena — diet2-sonnet

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | engage | engage-diet2 | best (excl. base) | engage |
|---|--:|--:|---|---|
| prose: rubric pass rate | 91% | 90% | engage | — |
| prose: output tokens / reply | 612 | 469 | engage | — |
| checkout: spec tests after generation | 100% | 100% | engage | — |
| checkout: change done correctly (weak maintainer) | 100% | 100% | engage | — |
| checkout: runs without a build step | 100% | 100% | engage | — |
| checkout: strict tsc errors | 0.0 | 0.0 | engage | — |
| checkout: code size (tok) | 2383 | 2528 | engage | — |
| checkout: generation output tokens | 17885 | 17083 | engage | — |
| billing: spec tests after generation | 100% | 100% | engage | — |
| billing: preserved behaviour after change | 100% | 100% | engage | — |
| billing: seats prorated like plans | 89% | 100% | engage | — |
| billing: change done correctly (weak maintainer) | 96% | 100% | engage | — |
| billing: runs without a build step | 100% | 100% | engage | — |
| billing: strict tsc errors | 0.0 | 0.0 | engage | — |
| billing: code size (tok) | 1495 | 1559 | engage | — |
| billing: generation output tokens | 15469 | 17553 | engage | — |
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | engage | — |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | engage | — |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | 1.0 | engage | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 237 | 241 | engage | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 258 | 262 | engage | — |
| evolve-xl: lines changed on the trivial v12 | 11 | 12 | engage | — |
| evolve-xl: output tokens, whole project | 52893 | 56564 | engage | — |
| evolve-xl: cost growth — late vs early iteration tokens | 1.62× | 1.56× | engage | — |
| evolve-xl: $ cost, whole project | $1.55 | $1.58 | engage | — |
| evolve-xl: agent turns, whole project | 118 | 121 | engage | — |
| evolve-xl: final size (tok) | 4431 | 4635 | engage | — |
| evolve-xl: health — files at the end | 1.0 | 1.0 | engage | — |
| evolve-xl: health — largest file (lines) | 564 | 607 | engage | — |
| evolve-xl: health — largest function (lines) | 383 | 419 | engage | — |
| evolve-xl: health — max branch complexity | 22.5 | 32.8 | engage | — |
| evolve-xl: health — duplicated blocks | 2.5 | 2.8 | engage | — |
| evolve-xl: health — non-null assertions | 1.3 | 0.0 | engage | — |
| evolve-xl: locality — existing functions changed per iteration | 3.5 | 3.8 | engage | — |
| evolve-xl: locality — new functions per iteration | 2.5 | 2.5 | engage | — |
| evolve-xl: design — share of pure functions | 75% | 76% | engage | — |
| evolve-xl: design — union types (literal + tagged) | 3.8 | 3.3 | engage | — |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | engage | — |
| evolve-xl: design — imports per file | 0.00 | 0.00 | engage | — |
| evolve-xl: tests — test cases written | 0 | 0 | engage | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | engage | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | engage | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | engage | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | engage | — |
| rule footprint, one-time (tok) | 1157 | 625 | engage | — |
| rule footprint, per turn (tok) | 0 | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $18.58

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
