# engage arena — gdp-maint

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6ebe48c"}

| metric | code-hook | engage | engage-gdp | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 99% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — lines changed | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 0 | 0 | 0 | code-hook, engage | 🟰 tied |
| health: largest function (lines) | 106 | 109 | 106 | code-hook, engage | 🟰 tied |
| health: largest file (lines) | 142 | 149 | 155 | code-hook, engage | 🟰 tied |
| health: max branch complexity in a function | 5.0 | 4.8 | 5.8 | code-hook, engage | 🟰 tied |
| health: functions with complexity > 10 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| health: duplicated 4-line blocks | 2.0 | 2.8 | 3.5 | code-hook | ❌ behind |
| health: non-null assertions (!) | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 715 | 1157 | 1250 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 0 best · 10 tied · 2 behind** (health: duplicated 4-line blocks; rule footprint, one-time (tok)) · run cost $0.00

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
