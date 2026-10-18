# engage arena — stick-haiku

n=8 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"bad48a0e","code-hook":"09c434a","both-hooks":"bad48a0e+09c434a","engage":"f7c3582"}

| metric | engage | engage-flow2 | engage-flow3 | engage-flow2+flowturn | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 20 iterations | 100% | 100% | 98% | 100% | engage | — |
| evolve-xl: tests passed at v20 (every feature) | 100% | 100% | 90% | 100% | engage | — |
| evolve-xl: regressions (earlier cases broken, summed) | 0.5 | 0.3 | 36.1 | 0.3 | engage | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 273 | 268 | 259 | 264 | engage | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 270 | 257 | 279 | 263 | engage | — |
| evolve-xl: lines changed on the trivial v12 | 9 | 7 | 7 | 7 | engage | — |
| evolve-xl: output tokens, whole project | 128394 | 143923 | 148713 | 142521 | engage | — |
| evolve-xl: cost growth — late vs early iteration tokens | 0.74× | 0.85× | 0.73× | 0.80× | engage | — |
| evolve-xl: $ cost, whole project | $0.13 | $0.14 | $0.15 | $0.14 | engage | — |
| evolve-xl: agent turns, whole project | 194 | 197 | 191 | 196 | engage | — |
| evolve-xl: final size (tok) | 6223 | 6021 | 6120 | 6371 | engage | — |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | engage | — |
| evolve-xl: health — largest file (lines) | 763 | 679 | 707 | 728 | engage | — |
| evolve-xl: health — largest function (lines) | 419 | 329 | 342 | 348 | engage | — |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 59 | 37 | 56 | 56 | engage | — |
| evolve-xl: health — functions over 50 own lines | 1.3 | 0.0 | 0.5 | 0.5 | engage | — |
| evolve-xl: health — functions over complexity 12 | 3.1 | 2.3 | 1.5 | 1.3 | engage | — |
| evolve-xl: control flow — worst cognitive complexity in a function | 28.0 | 23.6 | 18.4 | 18.6 | engage | — |
| evolve-xl: control flow — functions over cognitive complexity 15 | 2.6 | 1.8 | 1.0 | 1.0 | engage | — |
| evolve-xl: control flow — total cognitive complexity | 171 | 140 | 121 | 123 | engage | — |
| evolve-xl: control flow — deepest nesting | 3.0 | 2.8 | 2.9 | 2.5 | engage | — |
| evolve-xl: control flow — longest else-if chain | 2.0 | 2.0 | 1.9 | 1.9 | engage | — |
| evolve-xl: control flow — else after return/throw | 0.0 | 0.0 | 0.0 | 0.0 | engage | — |
| evolve-xl: health — max branch complexity | 24.8 | 20.6 | 19.6 | 20.6 | engage | — |
| evolve-xl: health — duplicated blocks | 2.8 | 1.1 | 0.6 | 1.4 | engage | — |
| evolve-xl: health — non-null assertions | 0.0 | 0.0 | 0.0 | 0.0 | engage | — |
| evolve-xl: locality — existing functions changed per iteration | 4.5 | 5.1 | 4.8 | 5.1 | engage | — |
| evolve-xl: locality — new functions per iteration | 3.4 | 4.3 | 4.3 | 4.8 | engage | — |
| evolve-xl: design — share of pure functions | 78% | 78% | 79% | 79% | engage | — |
| evolve-xl: design — union types (literal + tagged) | 2.0 | 3.5 | 3.1 | 2.8 | engage | — |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | engage | — |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | engage | — |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | 0 | engage | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | 0% | engage | — |
| evolve-xl: compliance — exhaustive never on literal-union switches | 0% | 0% | 0% | 0% | engage | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | 0% | engage | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | 0% | 0% | engage | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | engage | — |
| rule footprint, one-time (tok) | 1157 | 1460 | 1519 | 1460 | engage | — |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 62 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $4.50

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
