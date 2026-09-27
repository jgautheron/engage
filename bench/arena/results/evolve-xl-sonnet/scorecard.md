# engage arena — evolve-xl-sonnet

n=3 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"0b587c0"}

| metric | base | code-hook | engage | engage-next | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | 89% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | 67% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 253 | 233 | 250 | 240 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 325 | 184 | 237 | 252 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 14 | 11 | 13 | 10 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 53881 | 46165 | 49379 | 44951 | code-hook | ❌ behind |
| evolve-xl: cost growth — late vs early iteration tokens | 2.24× | 2.12× | 2.35× | 1.93× | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 4400 | 3293 | 4004 | 3889 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 89% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 0 | 1307 | 1008 | 1189 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 6 tied · 5 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: lines changed on the trivial v12; evolve-xl: output tokens, whole project; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: final size (tok)) · run cost $14.69

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
