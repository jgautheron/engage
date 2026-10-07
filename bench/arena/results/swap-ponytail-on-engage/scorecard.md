# engage arena — swap-ponytail-on-engage

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"6776cd6"}

| metric | code-hook | best (excl. base) | engage |
|---|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | code-hook | — |
| evolve-xl: tests passed at v12 (every feature) | 100% | code-hook | — |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | code-hook | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 241 | code-hook | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 213 | code-hook | — |
| evolve-xl: lines changed on the trivial v12 | 9 | code-hook | — |
| evolve-xl: output tokens, whole project | 66727 | code-hook | — |
| evolve-xl: cost growth — late vs early iteration tokens | 1.72× | code-hook | — |
| evolve-xl: $ cost, whole project | $2.07 | code-hook | — |
| evolve-xl: agent turns, whole project | 177 | code-hook | — |
| evolve-xl: final size (tok) | 3662 | code-hook | — |
| evolve-xl: health — files at the end | 1.0 | code-hook | — |
| evolve-xl: health — largest file (lines) | 435 | code-hook | — |
| evolve-xl: health — largest function (lines) | 268 | code-hook | — |
| evolve-xl: health — max branch complexity | 21.5 | code-hook | — |
| evolve-xl: health — duplicated blocks | 1.5 | code-hook | — |
| evolve-xl: health — non-null assertions | 2.5 | code-hook | — |
| evolve-xl: locality — existing functions changed per iteration | 3.5 | code-hook | — |
| evolve-xl: locality — new functions per iteration | 2.3 | code-hook | — |
| evolve-xl: design — share of pure functions | 76% | code-hook | — |
| evolve-xl: design — union types (literal + tagged) | 3.0 | code-hook | — |
| evolve-xl: design — exhaustive never checks | 0.0 | code-hook | — |
| evolve-xl: design — imports per file | 0.00 | code-hook | — |
| evolve-xl: tests — test cases written | 53 | code-hook | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | code-hook | — |
| rule footprint, one-time (tok) | 1307 | code-hook | — |
| rule footprint, per turn (tok) | 0 | code-hook | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $4.15

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
