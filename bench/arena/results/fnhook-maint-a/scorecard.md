# engage arena — fnhook-maint-a

n=8 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"742e0ab","both-hooks":"d262ab38+742e0ab","engage":"cc9ee6c"}

| metric | engage | engage+fnhook | best (excl. base) | engage |
|---|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 98% | 100% | engage, engage+fnhook | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 22.8 | 69.3 | engage | ✅ best |
| maintain: blind maintainer — lines changed | 447 | 457 | engage, engage+fnhook | 🟰 tied |
| maintain: blind maintainer — output tokens | 82323 | 87539 | engage | ✅ best |
| health: largest function (lines) | 596 | 548 | engage, engage+fnhook | 🟰 tied |
| health: largest function, own lines | 89 | 80 | engage+fnhook | ❌ behind |
| health: functions over 50 own lines | 1.3 | 1.0 | engage+fnhook | ❌ behind |
| health: functions over complexity 12 | 4.1 | 1.8 | engage+fnhook | ❌ behind |
| health: largest file (lines) | 1000 | 1028 | engage, engage+fnhook | 🟰 tied |
| health: max branch complexity in a function | 30.1 | 14.5 | engage+fnhook | ❌ behind |
| health: functions with complexity > 10 | 4.1 | 3.3 | engage+fnhook | ❌ behind |
| health: duplicated 4-line blocks | 1.9 | 1.8 | engage, engage+fnhook | 🟰 tied |
| health: non-null assertions (!) | 0.0 | 0.0 | engage, engage+fnhook | 🟰 tied |
| rule footprint, one-time (tok) | 1157 | 1157 | engage, engage+fnhook | 🟰 tied |
| rule footprint, per turn (tok) | 0 | 0 | engage, engage+fnhook | 🟰 tied |

**engage: 2 best · 8 tied · 5 behind** (health: largest function, own lines; health: functions over 50 own lines; health: functions over complexity 12; health: max branch complexity in a function; health: functions with complexity > 10) · run cost $1.83

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
