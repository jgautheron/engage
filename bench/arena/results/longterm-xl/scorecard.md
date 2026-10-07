# engage arena — longterm-xl

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"28b037a"}

| metric | code-hook | engage | engage-longterm | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v15 (every feature) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.7 | 1.0 | 1.0 | code-hook | ❌ behind |
| evolve-xl: v1 size — no premature abstraction (tok) | 237 | 239 | 242 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 262 | 255 | 214 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 11 | 12 | 11 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 52807 | 56874 | 57974 | code-hook | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 1.44× | 1.67× | 1.52× | code-hook | ❌ behind |
| evolve-xl: $ cost, whole project | $1.60 | $1.59 | $1.62 | code-hook, engage | 🟰 tied |
| evolve-xl: agent turns, whole project | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| evolve-xl: final size (tok) | 4112 | 4499 | 4539 | code-hook, engage | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 511 | 576 | 547 | code-hook | ❌ behind |
| evolve-xl: health — largest function (lines) | 365 | 382 | 335 | code-hook, engage | 🟰 tied |
| evolve-xl: health — max branch complexity | 24.0 | 22.7 | 21.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — duplicated blocks | 1.3 | 0.0 | 0.0 | engage | ✅ best |
| evolve-xl: health — non-null assertions | 2.3 | 2.7 | 0.0 | code-hook | ❌ behind |
| evolve-xl: locality — existing functions changed per iteration | 4.2 | 3.8 | 3.7 | code-hook, engage | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 2.6 | 2.9 | 2.5 | engage | ✅ best |
| evolve-xl: design — share of pure functions | 73% | 74% | 75% | code-hook, engage | 🟰 tied |
| evolve-xl: design — union types (literal + tagged) | 3.3 | 3.7 | 4.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1034 | 1137 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 3 best · 19 tied · 5 behind** (evolve-xl: regressions (earlier cases broken, summed); evolve-xl: output tokens, whole project; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: health — largest file (lines); evolve-xl: health — non-null assertions) · run cost $14.44

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
