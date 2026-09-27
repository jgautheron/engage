# engage arena — lean-xl-haiku

n=5 per cell · generator haiku · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"5b1e0fd"}

| metric | code-hook | engage | engage-lean | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 95% | 96% | 98% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 88% | 93% | 95% | engage | ✅ best |
| evolve-xl: regressions (earlier cases broken, summed) | 23.4 | 16.2 | 11.0 | engage | ✅ best |
| evolve-xl: v1 size — no premature abstraction (tok) | 244 | 265 | 277 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 265 | 262 | 278 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on the trivial v12 | 12 | 13 | 13 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 60898 | 59573 | 60039 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.74× | 1.58× | 1.57× | engage | ✅ best |
| evolve-xl: final size (tok) | 3588 | 4152 | 4204 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1008 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 4 best · 6 tied · 2 behind** (evolve-xl: lines changed on the trivial v12; evolve-xl: final size (tok)) · run cost $11.06

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
