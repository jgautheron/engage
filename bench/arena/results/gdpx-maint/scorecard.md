# engage arena — gdpx-maint

n=6 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | code-hook | engage | engage-gdp | engage-gdpx | engage-gdpx+gdphook | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 100% | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — lines changed | 53 | 49 | 55 | 52 | 105 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 14014 | 13470 | 13344 | 13991 | 19069 | code-hook, engage | 🟰 tied |
| health: largest function (lines) | 96 | 110 | 112 | 107 | 183 | code-hook | ❌ behind |
| health: largest file (lines) | 129 | 153 | 153 | 152 | 260 | code-hook | ❌ behind |
| health: max branch complexity in a function | 7.8 | 6.5 | 5.7 | 5.0 | 5.2 | engage | ✅ best |
| health: functions with complexity > 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| health: duplicated 4-line blocks | 0.5 | 2.7 | 1.3 | 0.8 | 1.2 | code-hook | ❌ behind |
| health: non-null assertions (!) | 0.0 | 0.0 | 0.0 | 0.0 | 2.2 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1250 | 1347 | 1347 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 7 tied · 4 behind** (health: largest function (lines); health: largest file (lines); health: duplicated 4-line blocks; rule footprint, one-time (tok)) · run cost $0.52

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
