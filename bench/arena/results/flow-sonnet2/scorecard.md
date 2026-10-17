# engage arena — flow-sonnet2

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"16352ac","both-hooks":"d262ab38+16352ac","engage":"a3b45c8"}

| metric | engage+cchook | best (excl. base) | engage |
|---|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | engage+cchook | — |
| evolve-xl: tests passed at v15 (every feature) | 100% | engage+cchook | — |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | engage+cchook | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 246 | engage+cchook | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 261 | engage+cchook | — |
| evolve-xl: lines changed on the trivial v12 | 12 | engage+cchook | — |
| evolve-xl: output tokens, whole project | 62686 | engage+cchook | — |
| evolve-xl: cost growth — late vs early iteration tokens | 1.71× | engage+cchook | — |
| evolve-xl: $ cost, whole project | $1.71 | engage+cchook | — |
| evolve-xl: agent turns, whole project | 134 | engage+cchook | — |
| evolve-xl: final size (tok) | 4745 | engage+cchook | — |
| evolve-xl: health — files at the end | 1.0 | engage+cchook | — |
| evolve-xl: health — largest file (lines) | 637 | engage+cchook | — |
| evolve-xl: health — largest function (lines) | 346 | engage+cchook | — |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 64 | engage+cchook | — |
| evolve-xl: health — functions over 50 own lines | 0.8 | engage+cchook | — |
| evolve-xl: health — functions over complexity 12 | 1.5 | engage+cchook | — |
| evolve-xl: control flow — worst cognitive complexity in a function | 14.8 | engage+cchook | — |
| evolve-xl: control flow — functions over cognitive complexity 15 | 0.0 | engage+cchook | — |
| evolve-xl: control flow — total cognitive complexity | 132 | engage+cchook | — |
| evolve-xl: control flow — deepest nesting | 2.3 | engage+cchook | — |
| evolve-xl: control flow — longest else-if chain | 1.0 | engage+cchook | — |
| evolve-xl: control flow — else after return/throw | 0.0 | engage+cchook | — |
| evolve-xl: health — max branch complexity | 16.3 | engage+cchook | — |
| evolve-xl: health — duplicated blocks | 1.0 | engage+cchook | — |
| evolve-xl: health — non-null assertions | 4.0 | engage+cchook | — |
| evolve-xl: locality — existing functions changed per iteration | 3.9 | engage+cchook | — |
| evolve-xl: locality — new functions per iteration | 3.7 | engage+cchook | — |
| evolve-xl: design — share of pure functions | 74% | engage+cchook | — |
| evolve-xl: design — union types (literal + tagged) | 3.0 | engage+cchook | — |
| evolve-xl: design — exhaustive never checks | 0.0 | engage+cchook | — |
| evolve-xl: design — imports per file | 0.00 | engage+cchook | — |
| evolve-xl: tests — test cases written | 0 | engage+cchook | — |
| evolve-xl: compliance — split a >300-line file it edits | 0% | engage+cchook | — |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | engage+cchook | — |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | engage+cchook | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | engage+cchook | — |
| rule footprint, one-time (tok) | 1157 | engage+cchook | — |
| rule footprint, per turn (tok) | 0 | engage+cchook | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $6.86

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
