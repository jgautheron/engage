# engage arena — flow-haiku

n=8 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"a3b45c8"}

| metric | engage | engage-flow | engage+cchook | engage-flow+cchook | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 20 iterations | 93% | 100% | 100% | 99% | engage+cchook | ❌ behind |
| evolve-xl: tests passed at v20 (every feature) | 88% | 100% | 100% | 100% | engage+cchook | ❌ behind |
| evolve-xl: regressions (earlier cases broken, summed) | 87.4 | 0.5 | 0.5 | 0.5 | engage+cchook | ❌ behind |
| evolve-xl: v1 size — no premature abstraction (tok) | 271 | 259 | 256 | 253 | engage, engage+cchook | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 252 | 272 | 301 | 269 | engage | ✅ best |
| evolve-xl: lines changed on the trivial v12 | 8 | 6 | 7 | 8 | engage+cchook | ❌ behind |
| evolve-xl: output tokens, whole project | 124672 | 131875 | 137396 | 136346 | engage | ✅ best |
| evolve-xl: cost growth — late vs early iteration tokens | 0.80× | 0.84× | 0.83× | 0.96× | engage, engage+cchook | 🟰 tied |
| evolve-xl: $ cost, whole project | $0.13 | $0.13 | $0.13 | $0.13 | engage, engage+cchook | 🟰 tied |
| evolve-xl: agent turns, whole project | 191 | 194 | 194 | 187 | engage, engage+cchook | 🟰 tied |
| evolve-xl: final size (tok) | 6049 | 5926 | 6164 | 6034 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest file (lines) | 695 | 684 | 706 | 689 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest function (lines) | 394 | 380 | 374 | 359 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 62 | 47 | 51 | 52 | engage+cchook | ❌ behind |
| evolve-xl: health — functions over 50 own lines | 1.0 | 0.6 | 0.5 | 0.5 | engage+cchook | ❌ behind |
| evolve-xl: health — functions over complexity 12 | 3.5 | 3.3 | 2.1 | 1.6 | engage+cchook | ❌ behind |
| evolve-xl: control flow — worst cognitive complexity in a function | 28.3 | 19.4 | 14.1 | 13.4 | engage+cchook | ❌ behind |
| evolve-xl: control flow — functions over cognitive complexity 15 | 2.5 | 1.6 | 0.0 | 0.0 | engage+cchook | ❌ behind |
| evolve-xl: control flow — total cognitive complexity | 144 | 127 | 133 | 129 | engage, engage+cchook | 🟰 tied |
| evolve-xl: control flow — deepest nesting | 2.4 | 2.1 | 2.3 | 2.0 | engage+cchook | ❌ behind |
| evolve-xl: control flow — longest else-if chain | 2.0 | 1.9 | 2.0 | 1.6 | engage, engage+cchook | 🟰 tied |
| evolve-xl: control flow — else after return/throw | 0.0 | 0.0 | 0.0 | 0.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — max branch complexity | 28.9 | 22.3 | 16.6 | 16.8 | engage+cchook | ❌ behind |
| evolve-xl: health — duplicated blocks | 3.5 | 1.3 | 0.6 | 0.8 | engage+cchook | ❌ behind |
| evolve-xl: health — non-null assertions | 0.0 | 0.0 | 0.0 | 0.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: locality — existing functions changed per iteration | 4.5 | 4.8 | 4.9 | 4.4 | engage | ✅ best |
| evolve-xl: locality — new functions per iteration | 3.2 | 3.5 | 4.1 | 3.7 | engage+cchook | ❌ behind |
| evolve-xl: design — share of pure functions | 76% | 76% | 78% | 79% | engage, engage+cchook | 🟰 tied |
| evolve-xl: design — union types (literal + tagged) | 3.0 | 2.3 | 3.8 | 2.6 | engage+cchook | ❌ behind |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | engage, engage+cchook | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | 0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 99% | engage, engage+cchook | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1285 | 1157 | 1285 | engage, engage+cchook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | engage, engage+cchook | 🟰 tied |

**engage: 3 best · 22 tied · 14 behind** (evolve-xl: tests passed, mean over all 20 iterations; evolve-xl: tests passed at v20 (every feature); evolve-xl: regressions (earlier cases broken, summed); evolve-xl: lines changed on the trivial v12; evolve-xl: health — largest function, own lines (nested functions excluded); evolve-xl: health — functions over 50 own lines; evolve-xl: health — functions over complexity 12; evolve-xl: control flow — worst cognitive complexity in a function; evolve-xl: control flow — functions over cognitive complexity 15; evolve-xl: control flow — deepest nesting; evolve-xl: health — max branch complexity; evolve-xl: health — duplicated blocks; evolve-xl: locality — new functions per iteration; evolve-xl: design — union types (literal + tagged)) · run cost $4.22

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
