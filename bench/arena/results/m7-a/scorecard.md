# engage arena — m7-a

n=6 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | code-hook | engage | engage-gdpx+gdphook | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 99% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 1.5 | 0.7 | 0.5 | engage | ✅ best |
| maintain: blind maintainer — lines changed | 143 | 140 | 234 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 34744 | 38053 | 43333 | code-hook | ❌ behind |
| health: largest function (lines) | 170 | 185 | 281 | code-hook, engage | 🟰 tied |
| health: largest file (lines) | 208 | 233 | 371 | code-hook | ❌ behind |
| health: max branch complexity in a function | 8.0 | 6.2 | 6.3 | engage | ✅ best |
| health: functions with complexity > 10 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| health: duplicated 4-line blocks | 4.5 | 7.5 | 4.7 | code-hook | ❌ behind |
| health: non-null assertions (!) | 0.0 | 0.0 | 2.5 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1347 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 2 best · 6 tied · 4 behind** (maintain: blind maintainer — output tokens; health: largest file (lines); health: duplicated 4-line blocks; rule footprint, one-time (tok)) · run cost $0.81

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
