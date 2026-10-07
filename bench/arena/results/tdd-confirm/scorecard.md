# engage arena — tdd-confirm

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"551f23b"}

| metric | code-hook | engage | engage-tdd | engage-tdd-types | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 234 | 264 | 237 | 251 | code-hook | ❌ behind |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 228 | 235 | 228 | 264 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 11 | 11 | 11 | 12 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 69805 | 78166 | 77992 | 80766 | code-hook | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 1.42× | 1.41× | 1.62× | 1.51× | code-hook, engage | 🟰 tied |
| evolve-xl: $ cost, whole project | $2.22 | $2.53 | $2.58 | $2.50 | code-hook | ❌ behind |
| evolve-xl: agent turns, whole project | 206 | 216 | 211 | 209 | code-hook, engage | 🟰 tied |
| evolve-xl: final size (tok) | 3455 | 3933 | 3877 | 3906 | code-hook | ❌ behind |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 429 | 492 | 474 | 488 | code-hook | ❌ behind |
| evolve-xl: health — largest function (lines) | 275 | 260 | 266 | 276 | code-hook, engage | 🟰 tied |
| evolve-xl: health — max branch complexity | 25.0 | 20.3 | 19.3 | 18.5 | engage | ✅ best |
| evolve-xl: health — duplicated blocks | 0.5 | 1.0 | 0.3 | 0.3 | code-hook | ❌ behind |
| evolve-xl: health — non-null assertions | 3.8 | 1.3 | 2.5 | 1.8 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 4.2 | 3.9 | 5.2 | 5.1 | code-hook, engage | 🟰 tied |
| evolve-xl: locality — new functions per iteration | 3.0 | 3.2 | 4.0 | 3.7 | code-hook, engage | 🟰 tied |
| evolve-xl: design — share of pure functions | 75% | 80% | 78% | 77% | engage | ✅ best |
| evolve-xl: design — union types (literal + tagged) | 3.0 | 4.3 | 4.3 | 4.5 | engage | ✅ best |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 45 | 69 | 88 | 84 | engage | ✅ best |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1091 | 1122 | 1164 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 6 best · 15 tied · 6 behind** (evolve-xl: v1 size — no premature abstraction (tok); evolve-xl: output tokens, whole project; evolve-xl: $ cost, whole project; evolve-xl: final size (tok); evolve-xl: health — largest file (lines); evolve-xl: health — duplicated blocks) · run cost $39.33

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
