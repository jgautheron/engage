# engage arena — evolve-xl-haiku

n=3 per cell · generator haiku · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"0b587c0"}

| metric | base | code-hook | engage | engage-next | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 97% | 96% | 92% | 93% | code-hook | ❌ behind |
| evolve-xl: tests passed at v12 (every feature) | 95% | 93% | 78% | 84% | code-hook | ❌ behind |
| evolve-xl: regressions (earlier cases broken, summed) | 14.0 | 18.0 | 36.0 | 30.0 | code-hook | ❌ behind |
| evolve-xl: v1 size — no premature abstraction (tok) | 260 | 270 | 275 | 288 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 282 | 248 | 256 | 301 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 13 | 12 | 18 | 18 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 68530 | 60541 | 69615 | 71487 | code-hook | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 1.58× | 1.55× | 1.98× | 1.64× | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 4105 | 3717 | 5006 | 4888 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 0 | 1307 | 1008 | 1189 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 4 tied · 7 behind** (evolve-xl: tests passed, mean over all 12 iterations; evolve-xl: tests passed at v12 (every feature); evolve-xl: regressions (earlier cases broken, summed); evolve-xl: lines changed on the trivial v12; evolve-xl: output tokens, whole project; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: final size (tok)) · run cost $9.53

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
