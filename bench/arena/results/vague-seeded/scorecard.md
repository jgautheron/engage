# engage arena — vague-seeded

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"97ff704"}

| metric | terse-hook | engage | engage-vague | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| prose: rubric pass rate | 63% | 47% | 56% | terse-hook | ❌ behind |
| prose: output tokens / reply | 2133 | 2491 | 2195 | terse-hook | ❌ behind |
| rule footprint, one-time (tok) | 1301 | 1095 | 1115 | engage | ✅ best |
| rule footprint, per turn (tok) | 61 | 0 | 0 | engage | ✅ best |

**engage: 2 best · 0 tied · 2 behind** (prose: rubric pass rate; prose: output tokens / reply) · run cost $1.20

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
