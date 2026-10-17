# engage arena — flow-maint-e-a

n=8 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"a3b45c8"}

| metric | engage | best (excl. base) | engage |
|---|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 88% | engage | — |
| maintain: blind maintainer — regressions (summed) | 173.9 | engage | — |
| maintain: blind maintainer — lines changed | 470 | engage | — |
| maintain: blind maintainer — output tokens | 84936 | engage | — |
| health: largest function (lines) | 637 | engage | — |
| health: largest function, own lines | 98 | engage | — |
| health: functions over 50 own lines | 1.5 | engage | — |
| health: functions over complexity 12 | 4.0 | engage | — |
| control flow: worst cognitive complexity (start) | 39.6 | engage | — |
| health: largest file (lines) | 1080 | engage | — |
| health: max branch complexity in a function | 38.0 | engage | — |
| health: functions with complexity > 10 | 4.4 | engage | — |
| health: duplicated 4-line blocks | 4.0 | engage | — |
| health: non-null assertions (!) | 0.0 | engage | — |
| rule footprint, one-time (tok) | 1157 | engage | — |
| rule footprint, per turn (tok) | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.89

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
