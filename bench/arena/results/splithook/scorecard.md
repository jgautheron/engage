# engage arena — splithook

n=10 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | engage-split | engage-split+splithook | engage+splithook | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 99% | engage+splithook | — |
| evolve-xl: tests passed at v12 (every feature) | 99% | 100% | 100% | engage+splithook | — |
| evolve-xl: regressions (earlier cases broken, summed) | 1.7 | 0.6 | 3.7 | engage+splithook | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 270 | 261 | 257 | engage+splithook | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 272 | 481 | 379 | engage+splithook | — |
| evolve-xl: lines changed on the trivial v12 | 8 | 9 | 13 | engage+splithook | — |
| evolve-xl: output tokens, whole project | 81685 | 99954 | 97290 | engage+splithook | — |
| evolve-xl: cost growth — late vs early iteration tokens | 2.19× | 3.05× | 2.68× | engage+splithook | — |
| evolve-xl: $ cost, whole project | $0.08 | $0.09 | $0.09 | engage+splithook | — |
| evolve-xl: agent turns, whole project | 100 | 129 | 126 | engage+splithook | — |
| evolve-xl: final size (tok) | 4299 | 4512 | 4429 | engage+splithook | — |
| evolve-xl: health — files at the end | 1.1 | 4.9 | 4.4 | engage+splithook | — |
| evolve-xl: health — largest file (lines) | 469 | 277 | 283 | engage+splithook | — |
| evolve-xl: health — largest function (lines) | 241 | 233 | 241 | engage+splithook | — |
| evolve-xl: health — max branch complexity | 19.7 | 20.8 | 20.1 | engage+splithook | — |
| evolve-xl: health — duplicated blocks | 1.1 | 0.8 | 0.6 | engage+splithook | — |
| evolve-xl: health — non-null assertions | 0.2 | 0.0 | 0.0 | engage+splithook | — |
| evolve-xl: locality — existing functions changed per iteration | 5.4 | 6.3 | 5.7 | engage+splithook | — |
| evolve-xl: locality — new functions per iteration | 4.4 | 5.4 | 5.0 | engage+splithook | — |
| evolve-xl: design — share of pure functions | 78% | 78% | 77% | engage+splithook | — |
| evolve-xl: design — union types (literal + tagged) | 2.8 | 2.8 | 3.0 | engage+splithook | — |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | engage+splithook | — |
| evolve-xl: design — imports per file | 0.15 | 2.05 | 1.91 | engage+splithook | — |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | engage+splithook | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | engage+splithook | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | engage+splithook | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | 0% | engage+splithook | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | engage+splithook | — |
| rule footprint, one-time (tok) | 1212 | 1212 | 1157 | engage+splithook | — |
| rule footprint, per turn (tok) | 0 | 0 | 0 | engage+splithook | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $2.56

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
