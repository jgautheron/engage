# engage arena — fnhook-maint-b

n=8 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"cc9ee6c"}

| metric | engage | engage+fnhook | best (excl. base) | engage |
|---|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 100% | engage, engage+fnhook | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 22.0 | 5.8 | engage+fnhook | ❌ behind |
| maintain: blind maintainer — lines changed | 454 | 426 | engage, engage+fnhook | 🟰 tied |
| maintain: blind maintainer — output tokens | 83615 | 78967 | engage+fnhook | ❌ behind |
| health: largest function (lines) | 601 | 544 | engage+fnhook | ❌ behind |
| health: largest function, own lines | 90 | 80 | engage+fnhook | ❌ behind |
| health: functions over 50 own lines | 1.4 | 1.0 | engage+fnhook | ❌ behind |
| health: functions over complexity 12 | 4.1 | 1.4 | engage+fnhook | ❌ behind |
| health: largest file (lines) | 1002 | 1009 | engage, engage+fnhook | 🟰 tied |
| health: max branch complexity in a function | 30.9 | 14.6 | engage+fnhook | ❌ behind |
| health: functions with complexity > 10 | 4.0 | 3.0 | engage+fnhook | ❌ behind |
| health: duplicated 4-line blocks | 2.5 | 1.5 | engage+fnhook | ❌ behind |
| health: non-null assertions (!) | 0.0 | 0.0 | engage, engage+fnhook | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1157 | engage, engage+fnhook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | engage, engage+fnhook | 🟰 tied |

**engage: 0 best · 6 tied · 9 behind** (maintain: blind maintainer — regressions (summed); maintain: blind maintainer — output tokens; health: largest function (lines); health: largest function, own lines; health: functions over 50 own lines; health: functions over complexity 12; health: max branch complexity in a function; health: functions with complexity > 10; health: duplicated 4-line blocks) · run cost $1.76

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
