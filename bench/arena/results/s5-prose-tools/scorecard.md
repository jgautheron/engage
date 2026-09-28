# engage arena — s5-prose-tools

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"72f7982"}

| metric | base | terse-hook | code-hook | both-hooks | engage | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| prose: rubric pass rate | 0% | 89% | 0% | 0% | 93% | engage | ✅ best |
| prose: output tokens / reply | 0 | 137 | 0 | 0 | 144 | code-hook, both-hooks | ❌ behind |
| rule footprint, one-time (tok) | 0 | 1301 | 1307 | 2608 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 61 | 0 | 61 | 0 | code-hook, engage | 🟰 tied |

**engage: 2 best · 1 tied · 1 behind** (prose: output tokens / reply) · run cost $0.63

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
