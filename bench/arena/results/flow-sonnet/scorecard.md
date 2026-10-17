# engage arena — flow-sonnet

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"a3b45c8"}

| metric | engage | engage-flow | engage+cchook | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | 100% | engage, engage+cchook | 🟰 tied |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | 100% | engage, engage+cchook | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | 1.0 | 1.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 255 | 252 | 253 | engage, engage+cchook | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 262 | 255 | 281 | engage, engage+cchook | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 12 | 12 | 13 | engage, engage+cchook | 🟰 tied |
| evolve-xl: output tokens, whole project | 55934 | 53175 | 61487 | engage | ✅ best |
| evolve-xl: cost growth — late vs early iteration tokens | 1.62× | 1.56× | 1.76× | engage | ✅ best |
| evolve-xl: $ cost, whole project | $1.64 | $1.56 | $1.69 | engage, engage+cchook | 🟰 tied |
| evolve-xl: agent turns, whole project | 128 | 124 | 132 | engage, engage+cchook | 🟰 tied |
| evolve-xl: final size (tok) | 4616 | 4531 | 4794 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest file (lines) | 615 | 615 | 645 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest function (lines) | 379 | 373 | 376 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 59 | 61 | 71 | engage | ✅ best |
| evolve-xl: health — functions over 50 own lines | 1.5 | 1.5 | 0.8 | engage+cchook | ❌ behind |
| evolve-xl: health — functions over complexity 12 | 3.3 | 3.3 | 1.5 | engage+cchook | ❌ behind |
| evolve-xl: control flow — worst cognitive complexity in a function | 24.5 | 32.0 | 14.8 | engage+cchook | ❌ behind |
| evolve-xl: control flow — functions over cognitive complexity 15 | 2.0 | 1.8 | 0.0 | engage+cchook | ❌ behind |
| evolve-xl: control flow — total cognitive complexity | 142 | 147 | 131 | engage, engage+cchook | 🟰 tied |
| evolve-xl: control flow — deepest nesting | 3.0 | 3.0 | 2.5 | engage+cchook | ❌ behind |
| evolve-xl: control flow — longest else-if chain | 1.5 | 1.3 | 1.0 | engage+cchook | ❌ behind |
| evolve-xl: control flow — else after return/throw | 0.0 | 0.0 | 0.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: health — max branch complexity | 22.0 | 25.3 | 16.0 | engage+cchook | ❌ behind |
| evolve-xl: health — duplicated blocks | 0.0 | 0.8 | 0.3 | engage | ✅ best |
| evolve-xl: health — non-null assertions | 4.0 | 1.3 | 0.3 | engage+cchook | ❌ behind |
| evolve-xl: locality — existing functions changed per iteration | 4.4 | 3.7 | 4.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 3.3 | 2.7 | 3.5 | engage, engage+cchook | 🟰 tied |
| evolve-xl: design — share of pure functions | 76% | 75% | 71% | engage | ✅ best |
| evolve-xl: design — union types (literal + tagged) | 3.3 | 3.3 | 4.0 | engage+cchook | ❌ behind |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | engage, engage+cchook | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | 0% | engage, engage+cchook | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | engage, engage+cchook | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1285 | 1157 | engage, engage+cchook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | 0 | engage, engage+cchook | 🟰 tied |

**engage: 5 best · 25 tied · 9 behind** (evolve-xl: health — functions over 50 own lines; evolve-xl: health — functions over complexity 12; evolve-xl: control flow — worst cognitive complexity in a function; evolve-xl: control flow — functions over cognitive complexity 15; evolve-xl: control flow — deepest nesting; evolve-xl: control flow — longest else-if chain; evolve-xl: health — max branch complexity; evolve-xl: health — non-null assertions; evolve-xl: design — union types (literal + tagged)) · run cost $19.56

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
