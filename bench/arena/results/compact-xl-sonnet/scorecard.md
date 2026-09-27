# engage arena — compact-xl-sonnet

n=2 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"84e78a9"}

| metric | code-hook | engage | engage-compact | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 83% | 100% | 100% | engage | ✅ best |
| evolve-xl: tests passed at v12 (every feature) | 50% | 100% | 100% | engage | ✅ best |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 239 | 234 | 240 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 183 | 212 | 232 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 11 | 11 | 11 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 41338 | 42346 | 43486 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.72× | 1.74× | 1.95× | code-hook, engage | 🟰 tied |
| evolve-xl: final size (tok) | 3243 | 3515 | 3744 | code-hook, engage | 🟰 tied |
| evolve-xl: runs without a build step (all snapshots) | 83% | 100% | 100% | engage | ✅ best |
| rule footprint, one-time (tok) | 1307 | 1004 | 1037 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 4 best · 7 tied · 1 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11)) · run cost $6.78

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
