# engage arena — splithook-maint

n=10 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | engage-split | engage-split+splithook | engage+splithook | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 100% | 100% | engage+splithook | — |
| maintain: blind maintainer — regressions (summed) | 2.0 | 0.3 | 0.0 | engage+splithook | — |
| maintain: blind maintainer — lines changed | 124 | 131 | 122 | engage+splithook | — |
| maintain: blind maintainer — output tokens | 13879 | 15516 | 14155 | engage+splithook | — |
| health: largest function (lines) | 293 | 292 | 297 | engage+splithook | — |
| health: largest file (lines) | 543 | 340 | 342 | engage+splithook | — |
| health: max branch complexity in a function | 19.9 | 20.8 | 20.6 | engage+splithook | — |
| health: functions with complexity > 10 | 4.0 | 4.0 | 3.9 | engage+splithook | — |
| health: duplicated 4-line blocks | 1.1 | 0.8 | 0.6 | engage+splithook | — |
| health: non-null assertions (!) | 0.2 | 0.0 | 0.0 | engage+splithook | — |
| rule footprint, one-time (tok) | 1212 | 1212 | 1157 | engage+splithook | — |
| rule footprint, per turn (tok) | 0 | 0 | 0 | engage+splithook | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $0.52

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
