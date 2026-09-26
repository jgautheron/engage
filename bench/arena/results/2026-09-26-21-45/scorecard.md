# engage arena — 2026-09-26-21-45

n=3 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"5063635"}

| metric | base | terse-hook | code-hook | both-hooks | engage | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| prose: rubric pass rate | 83% | 91% | 86% | 92% | 94% | both-hooks, engage | 🟰 tied |
| prose: output tokens / reply | 206 | 107 | 143 | 113 | 116 | terse-hook | ❌ behind |
| checkout: spec tests after generation | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| checkout: change done correctly (weak maintainer) | 67% | 89% | 91% | 93% | 96% | engage | ✅ best |
| checkout: runs without a build step | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| checkout: strict tsc errors | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| checkout: code size (tok) | 2538 | 2537 | 2241 | 2359 | 2418 | code-hook | ❌ behind |
| checkout: generation output tokens | 18789 | 15617 | 16692 | 17131 | 17371 | terse-hook | ❌ behind |
| billing: spec tests after generation | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| billing: preserved behaviour after change | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| billing: seats prorated like plans | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| billing: change done correctly (weak maintainer) | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| billing: runs without a build step | 100% | 100% | 67% | 67% | 67% | terse-hook | ❌ behind |
| billing: strict tsc errors | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| billing: code size (tok) | 1705 | 1754 | 1406 | 1609 | 1618 | code-hook | ❌ behind |
| billing: generation output tokens | 17323 | 18874 | 18006 | 12113 | 18509 | both-hooks | ❌ behind |
| rule footprint, one-time (tok) | 0 | 1301 | 1307 | 2608 | 984 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 61 | 0 | 61 | 0 | code-hook, engage | 🟰 tied |

**engage: 2 best · 10 tied · 6 behind** (prose: output tokens / reply; checkout: code size (tok); checkout: generation output tokens; billing: runs without a build step; billing: code size (tok); billing: generation output tokens) · run cost $13.84

Tie band: ±2% for rates, ±5% for token counts. Small n — rerun with a larger --n before trusting a single-cell gap.
