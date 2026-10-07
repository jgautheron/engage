# engage arena — agent-xl

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"1804d26"}

| metric | code-hook | engage | engage-verify | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 230 | 254 | 264 | code-hook | ❌ behind |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 217 | 262 | 231 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 11 | 11 | 12 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 96480 | 107442 | 100991 | code-hook | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 1.53× | 1.45× | 1.54× | engage | ✅ best |
| evolve-xl: $ cost, whole project | $3.14 | $3.45 | $3.27 | code-hook | ❌ behind |
| evolve-xl: agent turns, whole project | 262 | 310 | 281 | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 4068 | 4459 | 4611 | code-hook, engage | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 517 | 575 | 562 | code-hook | ❌ behind |
| evolve-xl: health — largest function (lines) | 359 | 344 | 326 | code-hook, engage | 🟰 tied |
| evolve-xl: health — max branch complexity | 22.0 | 21.5 | 22.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — duplicated blocks | 0.0 | 0.5 | 2.0 | code-hook | ❌ behind |
| evolve-xl: health — non-null assertions | 6.0 | 0.0 | 2.0 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 3.7 | 5.2 | 3.9 | code-hook | ❌ behind |
| evolve-xl: locality — new functions per iteration | 2.4 | 3.6 | 3.3 | engage | ✅ best |
| evolve-xl: design — share of pure functions | 75% | 75% | 78% | code-hook, engage | 🟰 tied |
| evolve-xl: design — union types (literal + tagged) | 3.5 | 5.0 | 4.0 | engage | ✅ best |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1115 | 1157 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 5 best · 14 tied · 8 behind** (evolve-xl: v1 size — no premature abstraction (tok); evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: output tokens, whole project; evolve-xl: $ cost, whole project; evolve-xl: agent turns, whole project; evolve-xl: health — largest file (lines); evolve-xl: health — duplicated blocks; evolve-xl: locality — existing functions changed per iteration) · run cost $19.73

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
