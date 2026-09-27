# engage arena — lean-checkout

n=3 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"5b1e0fd"}

| metric | code-hook | engage | engage-lean | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| checkout: spec tests after generation | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| checkout: change done correctly (weak maintainer) | 100% | 96% | 96% | code-hook | ❌ behind |
| checkout: runs without a build step | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| checkout: strict tsc errors | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| checkout: code size (tok) | 1993 | 2311 | 2730 | code-hook | ❌ behind |
| checkout: generation output tokens | 16062 | 16042 | 17077 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1008 | 1004 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 5 tied · 2 behind** (checkout: change done correctly (weak maintainer); checkout: code size (tok)) · run cost $3.96

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
