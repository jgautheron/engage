# engage arena — arch-maintain

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"6776cd6"}

| metric | code-hook | engage | engage-plan | engage-core | engage-types | engage-tdd | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|--:|---|---|
| maintain: blind maintainer — tests passed at the end | 99% | 97% | 94% | 100% | 100% | 99% | code-hook | ❌ behind |
| maintain: blind maintainer — regressions (summed) | 1.0 | 2.5 | 10.0 | 0.5 | 1.0 | 1.5 | code-hook | ❌ behind |
| maintain: blind maintainer — lines changed | 122 | 140 | 120 | 135 | 152 | 138 | code-hook | ❌ behind |
| maintain: blind maintainer — output tokens | 18420 | 18569 | 17204 | 15136 | 18714 | 14458 | code-hook, engage | 🟰 tied |
| health: largest function (lines) | 378 | 383 | 367 | 393 | 386 | 393 | code-hook, engage | 🟰 tied |
| health: largest file (lines) | 557 | 588 | 572 | 614 | 629 | 551 | code-hook, engage | 🟰 tied |
| health: max branch complexity in a function | 23.5 | 29.0 | 23.5 | 23.0 | 29.5 | 20.5 | code-hook | ❌ behind |
| health: functions with complexity > 10 | 5.0 | 4.0 | 3.5 | 3.5 | 4.0 | 3.5 | engage | ✅ best |
| health: duplicated 4-line blocks | 13.0 | 16.5 | 4.0 | 15.5 | 14.0 | 16.0 | code-hook | ❌ behind |
| health: non-null assertions (!) | 4.5 | 3.0 | 2.0 | 1.0 | 7.5 | 2.5 | engage | ✅ best |
| rule footprint, one-time (tok) | 1307 | 1115 | 1157 | 1152 | 1157 | 1146 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 3 best · 4 tied · 5 behind** (maintain: blind maintainer — tests passed at the end; maintain: blind maintainer — regressions (summed); maintain: blind maintainer — lines changed; health: max branch complexity in a function; health: duplicated 4-line blocks) · run cost $2.47

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
