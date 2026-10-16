# engage arena — gdpx-maint6

n=6 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | code-hook | engage | engage-gdp | engage-gdpx | engage-gdpx+gdphook | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 98% | 99% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 1.7 | 0.7 | 0.0 | 0.0 | 0.3 | engage | ✅ best |
| maintain: blind maintainer — lines changed | 107 | 109 | 105 | 104 | 163 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 28373 | 31579 | 29778 | 29299 | 36408 | code-hook | ❌ behind |
| health: largest function (lines) | 144 | 158 | 159 | 155 | 235 | code-hook | ❌ behind |
| health: largest file (lines) | 179 | 204 | 202 | 203 | 314 | code-hook | ❌ behind |
| health: max branch complexity in a function | 6.8 | 6.5 | 6.0 | 5.3 | 5.8 | code-hook, engage | 🟰 tied |
| health: functions with complexity > 10 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| health: duplicated 4-line blocks | 1.7 | 5.2 | 5.7 | 4.0 | 3.8 | code-hook | ❌ behind |
| health: non-null assertions (!) | 0.0 | 0.0 | 0.0 | 0.2 | 2.7 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1250 | 1347 | 1347 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 6 tied · 5 behind** (maintain: blind maintainer — output tokens; health: largest function (lines); health: largest file (lines); health: duplicated 4-line blocks; rule footprint, one-time (tok)) · run cost $1.06

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
