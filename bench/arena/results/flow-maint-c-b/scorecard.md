# engage arena — flow-maint-c-b

n=8 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"16352ac","both-hooks":"d262ab38+16352ac","engage":"a3b45c8"}

| metric | engage+cchook | best (excl. base) | engage |
|---|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 100% | engage+cchook | — |
| maintain: blind maintainer — regressions (summed) | 9.9 | engage+cchook | — |
| maintain: blind maintainer — lines changed | 464 | engage+cchook | — |
| maintain: blind maintainer — output tokens | 87365 | engage+cchook | — |
| health: largest function (lines) | 572 | engage+cchook | — |
| health: largest function, own lines | 80 | engage+cchook | — |
| health: functions over 50 own lines | 0.9 | engage+cchook | — |
| health: functions over complexity 12 | 3.0 | engage+cchook | — |
| control flow: worst cognitive complexity (start) | 18.0 | engage+cchook | — |
| health: largest file (lines) | 1030 | engage+cchook | — |
| health: max branch complexity in a function | 22.3 | engage+cchook | — |
| health: functions with complexity > 10 | 4.1 | engage+cchook | — |
| health: duplicated 4-line blocks | 1.1 | engage+cchook | — |
| health: non-null assertions (!) | 0.0 | engage+cchook | — |
| rule footprint, one-time (tok) | 1157 | engage+cchook | — |
| rule footprint, per turn (tok) | 0 | engage+cchook | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.93

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
