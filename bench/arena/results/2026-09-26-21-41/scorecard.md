# engage arena — 2026-09-26-21-41

n=2 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"bdb27b8"}

| metric | base | terse-hook | code-hook | both-hooks | engage | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| prose: rubric pass rate | 82% | 93% | 81% | 93% | 93% | terse-hook, both-hooks, engage | 🟰 tied |
| prose: output tokens / reply | 198 | 115 | 157 | 102 | 125 | both-hooks | ❌ behind |
| checkout: spec tests after generation | 100% | 100% | 100% | 100% | 100% | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| checkout: change done correctly (weak maintainer) | 100% | 50% | 100% | 100% | 100% | code-hook, both-hooks, engage | 🟰 tied |
| checkout: strict tsc errors | 0.0 | 0.0 | 0.0 | 0.5 | 0.0 | terse-hook, code-hook, engage | 🟰 tied |
| checkout: code size (tok) | 2440 | 2315 | 2219 | 2313 | 2239 | terse-hook, code-hook, both-hooks, engage | 🟰 tied |
| checkout: generation output tokens | 18102 | 15813 | 14737 | 13408 | 15613 | both-hooks | ❌ behind |
| billing: spec tests after generation | 100% | 50% | 50% | 50% | 0% | terse-hook, code-hook, both-hooks | ❌ behind |
| billing: preserved behaviour after change | 100% | 50% | 50% | 50% | 0% | terse-hook, code-hook, both-hooks | ❌ behind |
| billing: seats prorated like plans | 100% | 50% | 50% | 50% | 0% | terse-hook, code-hook, both-hooks | ❌ behind |
| billing: change done correctly (weak maintainer) | 100% | 50% | 50% | 50% | 0% | terse-hook, code-hook, both-hooks | ❌ behind |
| billing: strict tsc errors | 0.0 | 0.5 | 0.0 | 0.0 | 0.0 | code-hook, both-hooks, engage | 🟰 tied |
| billing: code size (tok) | 1972 | 1617 | 1515 | 1647 | 1716 | code-hook | ❌ behind |
| billing: generation output tokens | 17823 | 17726 | 17772 | 16117 | 17030 | both-hooks | ❌ behind |
| rule footprint, one-time (tok) | 0 | 1301 | 1307 | 2608 | 984 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 61 | 0 | 61 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 7 tied · 8 behind** (prose: output tokens / reply; checkout: generation output tokens; billing: spec tests after generation; billing: preserved behaviour after change; billing: seats prorated like plans; billing: change done correctly (weak maintainer); billing: code size (tok); billing: generation output tokens) · run cost $9.14

Tie band: ±2% for rates, ±5% for token counts. Small n — rerun with a larger --n before trusting a single-cell gap.
