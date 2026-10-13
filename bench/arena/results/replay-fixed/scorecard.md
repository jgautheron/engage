# engage arena — replay-fixed

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"487cd74","both-hooks":"2e08b91+487cd74","engage":"e0733bd"}

| metric | base | code-hook | engage | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| replay: real commit's tests passing on the agent's code | 71% | 72% | 68% | code-hook | ❌ behind |
| replay: runs where the real tests compiled | 93% | 93% | 93% | code-hook, engage | 🟰 tied |
| replay: lines changed vs the real commit | 1.46× | 1.03× | 1.29× | code-hook | ❌ behind |
| replay: $ cost per change | $1.18 | $0.97 | $1.06 | code-hook | ❌ behind |
| replay: agent turns per change | 42 | 31 | 38 | code-hook | ❌ behind |
| rule footprint, one-time (tok) | 0 | 715 | 1157 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 0 best · 2 tied · 5 behind** (replay: real commit's tests passing on the agent's code; replay: lines changed vs the real commit; replay: $ cost per change; replay: agent turns per change; rule footprint, one-time (tok)) · run cost $144.34

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
