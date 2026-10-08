# engage arena — replay-cachet

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6c8d016"}

| metric | base | code-hook | engage | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| replay: real commit's tests passing on the agent's code | 31% | 28% | 56% | engage | ✅ best |
| replay: runs where the real tests compiled | 58% | 50% | 67% | engage | ✅ best |
| replay: lines changed vs the real commit | 6.84× | 7.08× | 6.44× | code-hook, engage | 🟰 tied |
| replay: $ cost per change | $0.53 | $0.91 | $0.76 | engage | ✅ best |
| replay: agent turns per change | 23 | 35 | 28 | engage | ✅ best |
| rule footprint, one-time (tok) | 0 | 715 | 1091 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 4 best · 2 tied · 1 behind** (rule footprint, one-time (tok)) · run cost $26.43

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
