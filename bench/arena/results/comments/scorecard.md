# engage arena — comments

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"50ff840"}

| metric | code-hook | engage | engage-comments | best (excl. base) | engage |
|---|--:|--:|--:|---|---|
| comments: runs with a ticket/issue reference | 33% | 25% | 25% | engage | ✅ best |
| comments: runs with a war story / date / name | 17% | 17% | 8% | code-hook, engage | 🟰 tied |
| comments: runs with a comment block > 2 lines | 17% | 17% | 8% | code-hook, engage | 🟰 tied |
| comments: longest comment block (lines) | 0.9 | 0.9 | 0.8 | code-hook, engage | 🟰 tied |
| comments: comment lines per run | 1.1 | 1.1 | 0.8 | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1034 | 1062 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 2 best · 5 tied · 0 behind** · run cost $0.94

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
