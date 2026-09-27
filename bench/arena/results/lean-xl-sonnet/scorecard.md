# engage arena — lean-xl-sonnet

n=2 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"5b1e0fd"}

| metric | code-hook | engage | engage-lean | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 234 | 240 | 239 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 227 | 255 | 239 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 10 | 12 | 11 | code-hook | ❌ behind |
| evolve-xl: output tokens, whole project | 42249 | 43063 | 44623 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 1.33× | 1.81× | 2.02× | code-hook | ❌ behind |
| evolve-xl: final size (tok) | 3278 | 3810 | 3722 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1008 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 7 tied · 4 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: lines changed on the trivial v12; evolve-xl: cost growth — late vs early iteration tokens; evolve-xl: final size (tok)) · run cost $7.08

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
