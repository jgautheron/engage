# engage arena — stick-sonnet

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"bad48a0e","code-hook":"09c434a","both-hooks":"bad48a0e+09c434a","engage":"232479c"}

| metric | engage | engage-flow2 | engage+flowturn | engage+ccsofthook | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | 100% | 88% | engage, engage+flowturn | 🟰 tied |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | 100% | 75% | engage, engage+flowturn | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | 1.0 | 1.0 | 0.8 | engage+ccsofthook | ❌ behind |
| evolve-xl: v1 size — no premature abstraction (tok) | 246 | 245 | 247 | 245 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 267 | 240 | 229 | 262 | engage+flowturn | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 13 | 11 | 10 | 12 | engage+flowturn | ❌ behind |
| evolve-xl: output tokens, whole project | 56683 | 61368 | 61471 | 60609 | engage | ✅ best |
| evolve-xl: cost growth — late vs early iteration tokens | 1.62× | 1.61× | 1.52× | 1.66× | engage+flowturn | ❌ behind |
| evolve-xl: $ cost, whole project | $1.64 | $1.66 | $1.63 | $1.65 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: agent turns, whole project | 134 | 128 | 124 | 133 | engage+flowturn | ❌ behind |
| evolve-xl: final size (tok) | 4731 | 4470 | 4825 | 4595 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: health — largest file (lines) | 642 | 550 | 593 | 618 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: health — largest function (lines) | 411 | 324 | 342 | 352 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: health — largest function, own lines (nested functions excluded) | 72 | 66 | 68 | 63 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: health — functions over 50 own lines | 2.0 | 0.8 | 1.0 | 1.3 | engage+flowturn | ❌ behind |
| evolve-xl: health — functions over complexity 12 | 3.5 | 3.5 | 2.0 | 1.8 | engage+ccsofthook | ❌ behind |
| evolve-xl: control flow — worst cognitive complexity in a function | 27.5 | 27.3 | 15.8 | 14.5 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: control flow — functions over cognitive complexity 15 | 2.0 | 2.3 | 0.5 | 0.0 | engage+ccsofthook | ❌ behind |
| evolve-xl: control flow — total cognitive complexity | 157 | 136 | 142 | 143 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: control flow — deepest nesting | 3.0 | 2.8 | 2.3 | 3.0 | engage+flowturn | ❌ behind |
| evolve-xl: control flow — longest else-if chain | 1.3 | 1.3 | 1.0 | 1.0 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: control flow — else after return/throw | 0.0 | 0.0 | 0.0 | 0.0 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: health — max branch complexity | 19.8 | 21.0 | 17.0 | 16.0 | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: health — duplicated blocks | 3.3 | 0.0 | 0.0 | 0.8 | engage+flowturn | ❌ behind |
| evolve-xl: health — non-null assertions | 0.3 | 0.5 | 0.5 | 1.3 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 3.8 | 4.0 | 3.8 | 3.6 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 2.5 | 3.2 | 3.9 | 3.0 | engage+flowturn | ❌ behind |
| evolve-xl: design — share of pure functions | 75% | 77% | 79% | 77% | engage+flowturn, engage+ccsofthook | ❌ behind |
| evolve-xl: design — union types (literal + tagged) | 3.3 | 4.3 | 3.5 | 3.0 | engage, engage+flowturn | 🟰 tied |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | 0 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: compliance — split a >300-line file it edits | 0% | 0% | 0% | 0% | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: compliance — functions taking evidence/branded params | 0% | 0% | 0% | 0% | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: compliance — plan stated before the first file (v1) | 0% | 0% | 0% | 0% | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 88% | engage, engage+flowturn | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1460 | 1157 | 1157 | engage, engage+flowturn, engage+ccsofthook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | 62 | 0 | engage, engage+ccsofthook | 🟰 tied |

**engage: 2 best · 19 tied · 18 behind** (evolve-xl: regressions (earlier cases broken, summed); evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: lines changed on the trivial v12; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: agent turns, whole project; evolve-xl: health — largest function (lines); evolve-xl: health — largest function, own lines (nested functions excluded); evolve-xl: health — functions over 50 own lines; evolve-xl: health — functions over complexity 12; evolve-xl: control flow — worst cognitive complexity in a function; evolve-xl: control flow — functions over cognitive complexity 15; evolve-xl: control flow — total cognitive complexity; evolve-xl: control flow — deepest nesting; evolve-xl: control flow — longest else-if chain; evolve-xl: health — max branch complexity; evolve-xl: health — duplicated blocks; evolve-xl: locality — new functions per iteration; evolve-xl: design — share of pure functions) · run cost $26.31

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
