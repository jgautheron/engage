# engage arena — maintain-s5

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"72f7982"}

| metric | code-hook | engage | best (excl. base) | engage |
|---|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 100% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 0.7 | 0.7 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — lines changed | 115 | 122 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 16267 | 16062 | code-hook, engage | 🟰 tied |
| health: largest function (lines) | 257 | 289 | code-hook | ❌ behind |
| health: largest file (lines) | 374 | 468 | code-hook | ❌ behind |
| health: max branch complexity in a function | 17.0 | 20.7 | code-hook | ❌ behind |
| health: functions with complexity > 10 | 2.3 | 3.0 | code-hook | ❌ behind |
| health: duplicated 4-line blocks | 0.3 | 0.0 | engage | ✅ best |
| health: non-null assertions (!) | 5.3 | 0.0 | engage | ✅ best |
| rule footprint, one-time (tok) | 1307 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 3 best · 5 tied · 4 behind** (health: largest function (lines); health: largest file (lines); health: max branch complexity in a function; health: functions with complexity > 10) · run cost $1.15

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
