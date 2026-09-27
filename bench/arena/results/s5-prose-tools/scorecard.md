# engage arena — s5-prose-tools

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"72f7982"}

| metric | terse-hook | engage | best (excl. base) | engage |
|---|--:|--:|---|---|
| prose: rubric pass rate | 89% | 93% | engage | ✅ best |
| prose: output tokens / reply | 137 | 144 | terse-hook | ❌ behind |
| rule footprint, one-time (tok) | 1301 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 61 | 0 | engage | ✅ best |

**engage: 3 best · 0 tied · 1 behind** (prose: output tokens / reply) · run cost $0.63

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
