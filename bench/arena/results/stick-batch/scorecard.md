# engage arena — stick-batch

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"bad48a0e","code-hook":"09c434a","both-hooks":"bad48a0e+09c434a","engage":"f7c3582"}

| metric | engage | engage-flow3 | engage-flow2+flowturn | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 99% | 99% | 99% | engage | — |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | 100% | engage | — |
| evolve-xl: regressions (earlier cases broken, summed) | 5.0 | 5.0 | 5.3 | engage | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 1347 | 1394 | 1452 | engage | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 187 | 183 | 174 | engage | — |
| evolve-xl: lines changed on the trivial v12 | 0 | 0 | 0 | engage | — |
| evolve-xl: output tokens, whole project | 45297 | 49485 | 46581 | engage | — |
| evolve-xl: cost growth — late vs early iteration tokens | 5.65× | 4.91× | 6.62× | engage | — |
| evolve-xl: $ cost, whole project | $0.91 | $0.95 | $0.90 | engage | — |
| evolve-xl: agent turns, whole project | 27 | 27 | 28 | engage | — |
| evolve-xl: final size (tok) | 4624 | 4716 | 4662 | engage | — |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | engage | — |
| evolve-xl: health — largest file (lines) | 652 | 606 | 620 | engage | — |
| evolve-xl: health — largest function (lines) | 389 | 299 | 273 | engage | — |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 61 | 50 | 55 | engage | — |
| evolve-xl: health — functions over 50 own lines | 1.5 | 1.0 | 1.0 | engage | — |
| evolve-xl: health — functions over complexity 12 | 3.5 | 1.8 | 1.0 | engage | — |
| evolve-xl: control flow — worst cognitive complexity in a function | 35.0 | 26.5 | 22.3 | engage | — |
| evolve-xl: control flow — functions over cognitive complexity 15 | 3.8 | 2.3 | 1.0 | engage | — |
| evolve-xl: control flow — total cognitive complexity | 185 | 149 | 132 | engage | — |
| evolve-xl: control flow — deepest nesting | 3.5 | 3.0 | 3.3 | engage | — |
| evolve-xl: control flow — longest else-if chain | 1.3 | 1.3 | 1.3 | engage | — |
| evolve-xl: control flow — else after return/throw | 0.0 | 0.0 | 0.0 | engage | — |
| evolve-xl: health — max branch complexity | 20.5 | 19.8 | 14.3 | engage | — |
| evolve-xl: health — duplicated blocks | 0.8 | 1.5 | 2.0 | engage | — |
| evolve-xl: health — non-null assertions | 3.0 | 2.0 | 0.5 | engage | — |
| evolve-xl: locality — existing functions changed per iteration | 1.3 | 1.5 | 1.6 | engage | — |
| evolve-xl: locality — new functions per iteration | 2.5 | 2.8 | 3.2 | engage | — |
| evolve-xl: design — share of pure functions | 76% | 73% | 75% | engage | — |
| evolve-xl: design — union types (literal + tagged) | 2.5 | 4.5 | 3.8 | engage | — |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | engage | — |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | engage | — |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | engage | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | engage | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | engage | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | engage | — |
| rule footprint, one-time (tok) | 1157 | 1519 | 1460 | engage | — |
| rule footprint, per turn (tok) | 0 | 0 | 62 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $11.03

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
