# engage arena — gdp-v1

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6ebe48c"}

| metric | code-hook | engage | engage-gdp | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| authz: tests passed, mean over all 4 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| authz: tests passed at v4 (every feature) | 99% | 99% | 100% | code-hook, engage | 🟰 tied |
| authz: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| authz: v1 size — no premature abstraction (tok) | 743 | 766 | 764 | code-hook, engage | 🟰 tied |
| authz: lines changed on design-heavy iterations (v2,v3,v4) | 49 | 47 | 50 | code-hook, engage | 🟰 tied |
| authz: lines changed on the trivial v4 | 26 | 22 | 25 | engage | ✅ best |
| authz: output tokens, whole project | 18010 | 20031 | 18883 | code-hook | ❌ behind |
| authz: cost growth — late vs early iteration tokens | 1.06× | 0.80× | 0.95× | engage | ✅ best |
| authz: $ cost, whole project | $0.54 | $0.61 | $0.55 | code-hook | ❌ behind |
| authz: agent turns, whole project | 57 | 59 | 54 | code-hook, engage | 🟰 tied |
| authz: final size (tok) | 1239 | 1236 | 1264 | code-hook, engage | 🟰 tied |
| authz: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| authz: health — largest file (lines) | 142 | 149 | 155 | code-hook, engage | 🟰 tied |
| authz: health — largest function (lines) | 106 | 109 | 106 | code-hook, engage | 🟰 tied |
| authz: health — max branch complexity | 5.0 | 4.8 | 5.8 | code-hook, engage | 🟰 tied |
| authz: health — duplicated blocks | 2.0 | 2.8 | 3.5 | code-hook | ❌ behind |
| authz: health — non-null assertions | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| authz: locality — existing functions changed per iteration | 1.3 | 1.3 | 1.3 | code-hook, engage | 🟰 tied |
| authz: locality — new functions per iteration | 1.5 | 1.3 | 1.5 | code-hook | ❌ behind |
| authz: design — share of pure functions | 93% | 93% | 94% | code-hook, engage | 🟰 tied |
| authz: design — union types (literal + tagged) | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| authz: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| authz: design — imports per file | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| authz: tests — test cases written | 31 | 35 | 49 | engage | ✅ best |
| authz: tests — mutation score (own suite, own code) | 87% | 86% | 88% | code-hook, engage | 🟰 tied |
| authz: tests — own suite still green | 100% | 100% | 99% | code-hook, engage | 🟰 tied |
| authz: tests — failing on a correct alternative implementation | 8% | 2% | 1% | engage | ✅ best |
| authz: tests — assertions per test | 1.65 | 1.17 | 1.10 | code-hook | ❌ behind |
| authz: tests — error-path tests | 22.3 | 23.8 | 35.3 | code-hook, engage | 🟰 tied |
| authz: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1250 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 4 best · 22 tied · 6 behind** (authz: output tokens, whole project; authz: $ cost, whole project; authz: health — duplicated blocks; authz: locality — new functions per iteration; authz: tests — assertions per test; rule footprint, one-time (tok)) · run cost $6.80

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
