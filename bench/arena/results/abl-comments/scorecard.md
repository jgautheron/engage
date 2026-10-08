# engage arena — abl-comments

n=3 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2e08b91","code-hook":"9cc65d0","both-hooks":"2e08b91+9cc65d0","engage":"6c8d016"}

| metric | engage | abl-comments | best (excl. base) | engage |
|---|--:|--:|---|---|
| comments: runs with a ticket/issue reference | 8% | 25% | engage | ✅ best |
| comments: runs with a war story / date / name | 0% | 0% | engage, abl-comments | 🟰 tied |
| comments: runs with a comment block > 2 lines | 0% | 0% | engage, abl-comments | 🟰 tied |
| comments: longest comment block (lines) | 0.4 | 0.3 | abl-comments | ❌ behind |
| comments: comment lines per run | 0.4 | 0.3 | abl-comments | ❌ behind |
| rule footprint, one-time (tok) | 1091 | 971 | abl-comments | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | engage, abl-comments | 🟰 tied |

**engage: 1 best · 3 tied · 3 behind** (comments: longest comment block (lines); comments: comment lines per run; rule footprint, one-time (tok)) · run cost $0.59

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
