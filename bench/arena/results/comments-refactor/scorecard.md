# engage arena — comments-refactor

n=5 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"50ff840"}

| metric | engage | engage-comments | best (excl. base) | engage |
|---|--:|--:|---|---|
| comments: runs with a ticket/issue reference | 100% | 60% | engage | — |
| comments: runs with a war story / date / name | 60% | 40% | engage | — |
| comments: runs with a comment block > 2 lines | 60% | 40% | engage | — |
| comments: longest comment block (lines) | 2.8 | 2.2 | engage | — |
| comments: comment lines per run | 3.4 | 2.6 | engage | — |
| rule footprint, one-time (tok) | 1034 | 1077 | engage | — |
| rule footprint, per turn (tok) | 0 | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.28

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
