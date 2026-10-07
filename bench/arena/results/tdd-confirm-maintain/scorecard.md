# engage arena — tdd-confirm-maintain

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"551f23b"}

| metric | code-hook | engage | engage-tdd | engage-tdd-types | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — regressions (summed) | 1.5 | 1.3 | 1.3 | 0.5 | engage | ✅ best |
| maintain: blind maintainer — lines changed | 142 | 141 | 121 | 144 | code-hook, engage | 🟰 tied |
| maintain: blind maintainer — output tokens | 15917 | 17830 | 17758 | 15603 | code-hook | ❌ behind |
| health: largest function (lines) | 395 | 377 | 370 | 401 | code-hook, engage | 🟰 tied |
| health: largest file (lines) | 550 | 624 | 588 | 623 | code-hook | ❌ behind |
| health: max branch complexity in a function | 30.5 | 27.3 | 24.3 | 25.8 | engage | ✅ best |
| health: functions with complexity > 10 | 3.5 | 3.8 | 4.3 | 4.0 | code-hook, engage | 🟰 tied |
| health: duplicated 4-line blocks | 10.8 | 14.3 | 6.8 | 13.8 | code-hook | ❌ behind |
| health: non-null assertions (!) | 4.0 | 2.8 | 3.8 | 2.8 | engage | ✅ best |
| rule footprint, one-time (tok) | 1307 | 1091 | 1122 | 1164 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 4 best · 5 tied · 3 behind** (maintain: blind maintainer — output tokens; health: largest file (lines); health: duplicated 4-line blocks) · run cost $3.24

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
