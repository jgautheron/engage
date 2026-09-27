# engage arena — compact-xl-haiku

n=5 per cell · generator haiku · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"84e78a9"}

| metric | code-hook | engage | engage-compact | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 96% | 97% | 96% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 90% | 92% | 92% | engage | ✅ best |
| evolve-xl: regressions (earlier cases broken, summed) | 17.4 | 12.8 | 15.2 | engage | ✅ best |
| evolve-xl: v1 size — no premature abstraction (tok) | 259 | 262 | 260 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 259 | 241 | 242 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 16 | 14 | 14 | engage | ✅ best |
| evolve-xl: output tokens, whole project | 64600 | 66701 | 64204 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.81× | 1.40× | 1.59× | engage | ✅ best |
| evolve-xl: final size (tok) | 4149 | 3962 | 4083 | code-hook, engage | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1004 | 1037 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 5 best · 7 tied · 0 behind** · run cost $11.76

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
