# engage arena — abl-prose

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6c8d016"}

| metric | engage | abl-voice | abl-always | abl-engineering | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| prose: rubric pass rate | 90% | 89% | 90% | 90% | engage, abl-voice, abl-always, abl-engineering | 🟰 tied |
| prose: output tokens / reply | 521 | 630 | 552 | 512 | engage, abl-engineering | 🟰 tied |
| rule footprint, one-time (tok) | 1091 | 889 | 929 | 442 | abl-engineering | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | engage, abl-voice, abl-always, abl-engineering | 🟰 tied |

**engage: 0 best · 3 tied · 1 behind** (rule footprint, one-time (tok)) · run cost $1.66

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
