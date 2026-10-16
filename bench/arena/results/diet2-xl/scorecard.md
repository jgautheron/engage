# engage arena — diet2-xl

n=8 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | engage | engage-diet2 | best (excl. base) | engage |
|---|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 96% | 96% | engage | — |
| evolve-xl: tests passed at v12 (every feature) | 88% | 88% | engage | — |
| evolve-xl: regressions (earlier cases broken, summed) | 21.8 | 22.4 | engage | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 264 | 282 | engage | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 255 | 269 | engage | — |
| evolve-xl: lines changed on the trivial v12 | 8 | 8 | engage | — |
| evolve-xl: output tokens, whole project | 81002 | 83457 | engage | — |
| evolve-xl: cost growth — late vs early iteration tokens | 2.01× | 2.14× | engage | — |
| evolve-xl: $ cost, whole project | $0.07 | $0.08 | engage | — |
| evolve-xl: agent turns, whole project | 105 | 108 | engage | — |
| evolve-xl: final size (tok) | 4296 | 4236 | engage | — |
| evolve-xl: health — files at the end | 1.0 | 1.0 | engage | — |
| evolve-xl: health — largest file (lines) | 464 | 505 | engage | — |
| evolve-xl: health — largest function (lines) | 239 | 234 | engage | — |
| evolve-xl: health — max branch complexity | 20.3 | 19.6 | engage | — |
| evolve-xl: health — duplicated blocks | 0.6 | 0.5 | engage | — |
| evolve-xl: health — non-null assertions | 0.0 | 0.0 | engage | — |
| evolve-xl: locality — existing functions changed per iteration | 5.7 | 5.7 | engage | — |
| evolve-xl: locality — new functions per iteration | 4.6 | 4.8 | engage | — |
| evolve-xl: design — share of pure functions | 75% | 77% | engage | — |
| evolve-xl: design — union types (literal + tagged) | 3.0 | 3.0 | engage | — |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | engage | — |
| evolve-xl: design — imports per file | 0.00 | 0.00 | engage | — |
| evolve-xl: tests — test cases written | 0 | 0 | engage | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | engage | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | engage | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | engage | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | engage | — |
| rule footprint, one-time (tok) | 1157 | 625 | engage | — |
| rule footprint, per turn (tok) | 0 | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $1.21

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
