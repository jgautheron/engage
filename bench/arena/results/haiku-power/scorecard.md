# engage arena — haiku-power

n=8 per cell · generator haiku · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"f8e7ad4","both-hooks":"2e08b91+f8e7ad4","engage":"e0733bd"}

| metric | code-hook | engage | engage-noextend | engage-triggers | engage-diet | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.3 | 0.0 | 0.8 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 285 | 278 | 280 | 301 | 280 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 234 | 258 | 276 | 303 | 265 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 9 | 8 | 8 | 8 | 8 | engage | ✅ best |
| evolve-xl: output tokens, whole project | 80356 | 78685 | 79331 | 83283 | 82131 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 2.04× | 2.18× | 2.22× | 2.22× | 2.20× | code-hook | ❌ behind |
| evolve-xl: $ cost, whole project | $0.08 | $0.07 | $0.07 | $0.08 | $0.08 | code-hook, engage | 🟰 tied |
| evolve-xl: agent turns, whole project | 105 | 102 | 103 | 101 | 109 | code-hook, engage | 🟰 tied |
| evolve-xl: final size (tok) | 3913 | 4121 | 4252 | 4645 | 4043 | code-hook, engage | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 459 | 477 | 491 | 562 | 511 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest function (lines) | 256 | 238 | 241 | 267 | 258 | code-hook, engage | 🟰 tied |
| evolve-xl: health — max branch complexity | 24.6 | 20.6 | 21.1 | 21.0 | 19.5 | engage | ✅ best |
| evolve-xl: health — duplicated blocks | 4.4 | 2.1 | 1.9 | 0.1 | 1.0 | engage | ✅ best |
| evolve-xl: health — non-null assertions | 1.9 | 0.0 | 0.0 | 0.0 | 0.5 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 4.8 | 5.8 | 5.5 | 6.1 | 5.3 | code-hook | ❌ behind |
| evolve-xl: locality — new functions per iteration | 3.6 | 4.6 | 4.5 | 5.2 | 4.5 | engage | ✅ best |
| evolve-xl: design — share of pure functions | 71% | 76% | 77% | 79% | 78% | engage | ✅ best |
| evolve-xl: design — union types (literal + tagged) | 3.8 | 4.1 | 3.9 | 4.0 | 3.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1127 | 1112 | 565 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 6 best · 17 tied · 4 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: locality — existing functions changed per iteration; rule footprint, one-time (tok)) · run cost $3.04

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
