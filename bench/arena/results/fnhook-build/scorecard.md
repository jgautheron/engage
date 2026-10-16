# engage arena — fnhook-build

n=8 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"cc9ee6c"}

| metric | engage | engage+fnhook | best (excl. base) | engage |
|---|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 20 iterations | 93% | 100% | engage+fnhook | ❌ behind |
| evolve-xl: tests passed at v20 (every feature) | 88% | 100% | engage+fnhook | ❌ behind |
| evolve-xl: regressions (earlier cases broken, summed) | 88.0 | 2.6 | engage+fnhook | ❌ behind |
| evolve-xl: v1 size — no premature abstraction (tok) | 287 | 256 | engage+fnhook | ❌ behind |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 247 | 268 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 8 | 7 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: output tokens, whole project | 126754 | 153792 | engage | ✅ best |
| evolve-xl: cost growth — late vs early iteration tokens | 0.80× | 1.03× | engage | ✅ best |
| evolve-xl: $ cost, whole project | $0.13 | $0.15 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: agent turns, whole project | 185 | 216 | engage | ✅ best |
| evolve-xl: final size (tok) | 6153 | 6184 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: health — largest file (lines) | 652 | 674 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: health — largest function (lines) | 367 | 319 | engage+fnhook | ❌ behind |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 60 | 49 | engage+fnhook | ❌ behind |
| evolve-xl: health — functions over 50 own lines | 0.9 | 0.1 | engage+fnhook | ❌ behind |
| evolve-xl: health — functions over complexity 12 | 3.9 | 0.0 | engage+fnhook | ❌ behind |
| evolve-xl: health — max branch complexity | 23.8 | 11.6 | engage+fnhook | ❌ behind |
| evolve-xl: health — duplicated blocks | 1.6 | 1.5 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: health — non-null assertions | 0.0 | 0.0 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: locality — existing functions changed per iteration | 4.9 | 5.3 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 3.5 | 4.6 | engage+fnhook | ❌ behind |
| evolve-xl: design — share of pure functions | 77% | 77% | engage, engage+fnhook | 🟰 tied |
| evolve-xl: design — union types (literal + tagged) | 2.6 | 1.9 | engage | ✅ best |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | engage, engage+fnhook | 🟰 tied |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | engage, engage+fnhook | 🟰 tied |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | engage, engage+fnhook | 🟰 tied |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | engage, engage+fnhook | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | engage, engage+fnhook | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1157 | engage, engage+fnhook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | engage, engage+fnhook | 🟰 tied |

**engage: 4 best · 19 tied · 10 behind** (evolve-xl: tests passed, mean over all 20 iterations; evolve-xl: tests passed at v20 (every feature); evolve-xl: regressions (earlier cases broken, summed); evolve-xl: v1 size — no premature abstraction (tok); evolve-xl: health — largest function (lines); evolve-xl: health — largest function, own lines (nested functions excluded); evolve-xl: health — functions over 50 own lines; evolve-xl: health — functions over complexity 12; evolve-xl: health — max branch complexity; evolve-xl: locality — new functions per iteration) · run cost $2.27

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
