# engage arena — split-xl

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"28b037a"}

| metric | code-hook | engage | engage-split | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v15 (every feature) | 99% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 1.7 | 1.0 | 1.0 | engage | ✅ best |
| evolve-xl: v1 size — no premature abstraction (tok) | 233 | 232 | 241 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 204 | 237 | 253 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 9 | 12 | 10 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 56288 | 51709 | 53520 | engage | ✅ best |
| evolve-xl: cost growth — late vs early iteration tokens | 1.56× | 1.48× | 1.62× | engage | ✅ best |
| evolve-xl: final size (tok) | 4132 | 4307 | 4425 | code-hook, engage | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 463 | 557 | 551 | code-hook | ❌ behind |
| evolve-xl: health — largest function (lines) | 327 | 390 | 366 | code-hook | ❌ behind |
| evolve-xl: health — max branch complexity | 23.0 | 25.3 | 20.3 | code-hook | ❌ behind |
| evolve-xl: health — duplicated blocks | 0.0 | 1.3 | 1.0 | code-hook | ❌ behind |
| evolve-xl: health — non-null assertions | 4.7 | 3.0 | 2.0 | engage | ✅ best |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1034 | 1162 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 5 best · 7 tied · 6 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: lines changed on the trivial v12; evolve-xl: health — largest file (lines); evolve-xl: health — largest function (lines); evolve-xl: health — max branch complexity; evolve-xl: health — duplicated blocks) · run cost $14.04

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
