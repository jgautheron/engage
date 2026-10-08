# engage arena — abl-code

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6c8d016"}

| metric | engage | abl-ladder | abl-reader | abl-design | abl-perf | abl-comments | abl-neverdrop | abl-engineering | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | 100% | 100% | 100% | 89% | 100% | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-engineering | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | 100% | 100% | 100% | 67% | 100% | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-engineering | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 241 | 239 | 252 | 261 | 245 | 252 | 238 | 253 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 232 | 233 | 258 | 250 | 235 | 250 | 239 | 244 | engage, abl-ladder, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 10 | 10 | 13 | 13 | 12 | 13 | 12 | 13 | engage, abl-ladder | 🟰 tied |
| evolve-xl: output tokens, whole project | 47786 | 44749 | 46642 | 47432 | 44323 | 46791 | 45972 | 44179 | abl-ladder, abl-perf, abl-neverdrop, abl-engineering | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 2.58× | 1.97× | 2.06× | 2.02× | 2.21× | 2.11× | 2.38× | 2.15× | abl-ladder, abl-reader, abl-design | ❌ behind |
| evolve-xl: $ cost, whole project | $1.29 | $1.20 | $1.25 | $1.29 | $1.16 | $1.27 | $1.25 | $1.16 | abl-ladder, abl-perf, abl-engineering | ❌ behind |
| evolve-xl: agent turns, whole project | 102 | 98 | 102 | 108 | 100 | 106 | 101 | 101 | engage, abl-ladder, abl-reader, abl-perf, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: final size (tok) | 3849 | 3934 | 4076 | 4047 | 3888 | 3988 | 3838 | 4077 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: health — largest file (lines) | 457 | 463 | 543 | 556 | 527 | 531 | 483 | 550 | engage, abl-ladder, abl-neverdrop | 🟰 tied |
| evolve-xl: health — largest function (lines) | 274 | 278 | 330 | 317 | 324 | 307 | 294 | 336 | engage, abl-ladder, abl-neverdrop | 🟰 tied |
| evolve-xl: health — max branch complexity | 18.7 | 19.7 | 18.3 | 19.3 | 29.7 | 17.7 | 18.7 | 21.0 | engage, abl-reader, abl-design, abl-comments, abl-neverdrop | 🟰 tied |
| evolve-xl: health — duplicated blocks | 1.0 | 2.0 | 1.0 | 0.0 | 1.0 | 0.0 | 0.0 | 0.3 | abl-design, abl-comments, abl-neverdrop | ❌ behind |
| evolve-xl: health — non-null assertions | 3.7 | 2.0 | 3.3 | 1.0 | 4.0 | 0.7 | 1.0 | 1.7 | abl-comments | ❌ behind |
| evolve-xl: locality — existing functions changed per iteration | 3.8 | 4.0 | 4.2 | 4.1 | 4.3 | 3.9 | 4.9 | 4.1 | engage, abl-ladder, abl-design, abl-comments, abl-engineering | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 2.5 | 3.0 | 3.1 | 2.9 | 2.9 | 2.8 | 3.6 | 2.9 | abl-neverdrop | ❌ behind |
| evolve-xl: design — share of pure functions | 73% | 75% | 78% | 78% | 77% | 78% | 77% | 76% | abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | ❌ behind |
| evolve-xl: design — union types (literal + tagged) | 3.7 | 3.7 | 4.3 | 4.0 | 2.7 | 3.7 | 4.7 | 3.0 | abl-reader, abl-neverdrop | ❌ behind |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | 100% | 100% | 89% | 100% | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-engineering | 🟰 tied |
| rule footprint, one-time (tok) | 1091 | 1030 | 901 | 948 | 1034 | 971 | 1021 | 442 | abl-engineering | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | engage, abl-ladder, abl-reader, abl-design, abl-perf, abl-comments, abl-neverdrop, abl-engineering | 🟰 tied |

**engage: 0 best · 18 tied · 9 behind** (evolve-xl: output tokens, whole project; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: $ cost, whole project; evolve-xl: health — duplicated blocks; evolve-xl: health — non-null assertions; evolve-xl: locality — new functions per iteration; evolve-xl: design — share of pure functions; evolve-xl: design — union types (literal + tagged); rule footprint, one-time (tok)) · run cost $29.60

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
