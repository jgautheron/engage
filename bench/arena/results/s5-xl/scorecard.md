# engage arena — s5-xl

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"72f7982"}

| metric | code-hook | engage | engage-extend | engage-verify | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 228 | 238 | 234 | 243 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 216 | 253 | 213 | 211 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 9 | 10 | 11 | 10 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 44251 | 43041 | 43046 | 45959 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.94× | 2.13× | 2.02× | 2.17× | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 3219 | 3740 | 3733 | 3820 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1004 | 1034 | 1045 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 7 tied · 4 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: lines changed on the trivial v12; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: final size (tok)) · run cost $14.21

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
