# engage arena — replay-cachet-strict

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6ebe48c"}

| metric | base | code-hook | engage | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| replay: real commit's tests passing on the agent's code | 81% | 80% | 70% | code-hook | ❌ behind |
| replay: runs where the real tests compiled | 94% | 94% | 78% | code-hook | ❌ behind |
| replay: lines changed vs the real commit | 2.07× | 1.38× | 1.38× | code-hook, engage | 🟰 tied |
| replay: $ cost per change | $1.56 | $1.51 | $1.58 | code-hook, engage | 🟰 tied |
| replay: agent turns per change | 48 | 54 | 54 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 0 | 715 | 1157 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 0 best · 4 tied · 3 behind** (replay: real commit's tests passing on the agent's code; replay: runs where the real tests compiled; rule footprint, one-time (tok)) · run cost $83.76

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
