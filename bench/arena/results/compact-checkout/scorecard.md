# engage arena — compact-checkout

n=3 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"84e78a9"}

| metric | code-hook | engage | engage-compact | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| checkout: spec tests after generation | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| checkout: change done correctly (weak maintainer) | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| checkout: runs without a build step | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| checkout: strict tsc errors | 0.0 | 5.0 | 0.0 | code-hook | ❌ behind |
| checkout: code size (tok) | 2428 | 2677 | 2456 | code-hook | ❌ behind |
| checkout: generation output tokens | 19188 | 15742 | 15844 | engage | ✅ best |
| rule footprint, one-time (tok) | 1307 | 1004 | 1037 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 2 best · 4 tied · 2 behind** (checkout: strict tsc errors; checkout: code size (tok)) · run cost $4.10

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
