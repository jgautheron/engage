# engage arena — drift

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"b088b2d","both-hooks":"2e08b91+b088b2d","engage":"da6f63c"}

| metric | code-hook | engage | engage-drift | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 240 | 264 | 252 | code-hook | ❌ behind |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 219 | 263 | 269 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 10 | 11 | 12 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 75473 | 78720 | 76846 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.48× | 1.59× | 1.44× | code-hook | ❌ behind |
| evolve-xl: $ cost, whole project | $2.23 | $2.33 | $2.39 | code-hook, engage | 🟰 tied |
| evolve-xl: agent turns, whole project | 180 | 199 | 203 | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 3468 | 3988 | 3966 | code-hook | ❌ behind |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 423 | 479 | 508 | code-hook | ❌ behind |
| evolve-xl: health — largest function (lines) | 284 | 254 | 276 | engage | ✅ best |
| evolve-xl: health — max branch complexity | 19.0 | 19.8 | 18.3 | code-hook, engage | 🟰 tied |
| evolve-xl: health — duplicated blocks | 0.8 | 0.0 | 1.0 | engage | ✅ best |
| evolve-xl: health — non-null assertions | 3.3 | 1.8 | 1.8 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 3.8 | 5.2 | 3.7 | code-hook | ❌ behind |
| evolve-xl: locality — new functions per iteration | 2.5 | 3.8 | 2.6 | engage | ✅ best |
| evolve-xl: design — share of pure functions | 77% | 76% | 77% | code-hook, engage | 🟰 tied |
| evolve-xl: design — union types (literal + tagged) | 2.8 | 4.5 | 3.8 | engage | ✅ best |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 60 | 90 | 75 | engage | ✅ best |
| evolve-xl: tests — mutation score (own suite, own code) | 78% | 78% | 75% | code-hook, engage | 🟰 tied |
| evolve-xl: tests — own suite still green | 100% | 100% | 98% | code-hook, engage | 🟰 tied |
| evolve-xl: tests — failing on a correct alternative implementation | 2% | 1% | 4% | code-hook, engage | 🟰 tied |
| evolve-xl: tests — assertions per test | 2.33 | 1.73 | 1.84 | code-hook | ❌ behind |
| evolve-xl: tests — error-path tests | 19.3 | 22.3 | 19.3 | engage | ✅ best |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 712 | 1091 | 1124 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 7 best · 16 tied · 9 behind** (evolve-xl: v1 size — no premature abstraction (tok); evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: agent turns, whole project; evolve-xl: final size (tok); evolve-xl: health — largest file (lines); evolve-xl: locality — existing functions changed per iteration; evolve-xl: tests — assertions per test; rule footprint, one-time (tok)) · run cost $27.78

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
