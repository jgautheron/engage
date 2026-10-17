# engage arena — flow-maint-e-b

n=8 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"a3b45c8"}

| metric | engage | best (excl. base) | engage |
|---|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 100% | engage | — |
| maintain: blind maintainer — regressions (summed) | 2.0 | engage | — |
| maintain: blind maintainer — lines changed | 502 | engage | — |
| maintain: blind maintainer — output tokens | 82759 | engage | — |
| health: largest function (lines) | 660 | engage | — |
| health: largest function, own lines | 98 | engage | — |
| health: functions over 50 own lines | 2.0 | engage | — |
| health: functions over complexity 12 | 4.0 | engage | — |
| control flow: worst cognitive complexity (start) | 39.3 | engage | — |
| health: largest file (lines) | 1086 | engage | — |
| health: max branch complexity in a function | 37.3 | engage | — |
| health: functions with complexity > 10 | 4.4 | engage | — |
| health: duplicated 4-line blocks | 4.1 | engage | — |
| health: non-null assertions (!) | 0.0 | engage | — |
| rule footprint, one-time (tok) | 1157 | engage | — |
| rule footprint, per turn (tok) | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.86

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
