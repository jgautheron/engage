# engage arena — testq-evolve

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"b088b2d","both-hooks":"2e08b91+b088b2d","engage":"b5d4bfd"}

| metric | code-hook | engage | engage-tests | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve: tests passed, mean over all 5 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve: tests passed at v5 (every feature) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve: v1 size — no premature abstraction (tok) | 210 | 219 | 223 | code-hook, engage | 🟰 tied |
| evolve: lines changed on design-heavy iterations (v3,v4) | 84 | 96 | 113 | code-hook | ❌ behind |
| evolve: lines changed on the trivial v5 | 15 | 15 | 18 | code-hook, engage | 🟰 tied |
| evolve: output tokens, whole project | 25000 | 26379 | 26887 | code-hook | ❌ behind |
| evolve: cost growth — late vs early iteration tokens | 1.52× | 1.55× | 1.39× | code-hook, engage | 🟰 tied |
| evolve: $ cost, whole project | $0.68 | $0.75 | $0.75 | code-hook | ❌ behind |
| evolve: agent turns, whole project | 71 | 69 | 76 | code-hook, engage | 🟰 tied |
| evolve: final size (tok) | 794 | 825 | 877 | code-hook, engage | 🟰 tied |
| evolve: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve: health — largest file (lines) | 103 | 126 | 147 | code-hook | ❌ behind |
| evolve: health — largest function (lines) | 42 | 43 | 62 | code-hook, engage | 🟰 tied |
| evolve: health — max branch complexity | 9.3 | 11.8 | 11.0 | code-hook | ❌ behind |
| evolve: health — duplicated blocks | 0.8 | 0.8 | 1.5 | code-hook, engage | 🟰 tied |
| evolve: health — non-null assertions | 0.0 | 0.5 | 0.5 | code-hook | ❌ behind |
| evolve: locality — existing functions changed per iteration | 1.0 | 1.1 | 1.0 | code-hook, engage | 🟰 tied |
| evolve: locality — new functions per iteration | 0.8 | 0.8 | 0.8 | code-hook, engage | 🟰 tied |
| evolve: design — share of pure functions | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve: design — union types (literal + tagged) | 3.0 | 3.0 | 3.0 | code-hook, engage | 🟰 tied |
| evolve: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve: design — imports per file | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve: tests — test cases written | 21 | 40 | 41 | engage | ✅ best |
| evolve: tests — mutation score (own suite, own code) | 75% | 100% | 99% | engage | ✅ best |
| evolve: tests — own suite still green | 75% | 100% | 100% | engage | ✅ best |
| evolve: tests — failing on a correct alternative implementation | 25% | 0% | 3% | engage | ✅ best |
| evolve: tests — assertions per test | 1.25 | 1.49 | 1.43 | engage | ✅ best |
| evolve: tests — error-path tests | 4.0 | 6.3 | 6.5 | engage | ✅ best |
| evolve: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 712 | 1091 | 1205 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 6 best · 19 tied · 7 behind** (evolve: lines changed on design-heavy iterations (v3,v4); evolve: output tokens, whole project; evolve: $ cost, whole project; evolve: health — largest file (lines); evolve: health — max branch complexity; evolve: health — non-null assertions; rule footprint, one-time (tok)) · run cost $8.73

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
