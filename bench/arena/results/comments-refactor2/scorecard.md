# engage arena — comments-refactor2

n=5 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"50ff840"}

| metric | engage-comments | best (excl. base) | engage |
|---|--:|---|---|
| comments: runs with a ticket/issue reference | 80% |  | — |
| comments: runs with a war story / date / name | 20% |  | — |
| comments: runs with a comment block > 2 lines | 20% |  | — |
| comments: longest comment block (lines) | 1.6 |  | — |
| comments: comment lines per run | 1.8 |  | — |
| rule footprint, one-time (tok) | 1080 |  | — |
| rule footprint, per turn (tok) | 0 |  | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.18

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
