# engage arena — vague

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"97ff704"}

| metric | terse-hook | engage | engage-vague | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| prose: rubric pass rate | 87% | 89% | 90% | terse-hook, engage | 🟰 tied |
| prose: output tokens / reply | 146 | 143 | 128 | terse-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1301 | 1095 | 1115 | engage | ✅ best |
| rule footprint, per turn (tok) | 61 | 0 | 0 | engage | ✅ best |

**engage: 2 best · 2 tied · 0 behind** · run cost $0.82

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
