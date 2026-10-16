# engage arena — commenthook

n=10 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | base | code-hook | engage | engage+commenthook | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| comments: runs with a ticket/issue reference | 25% | 25% | 8% | 0% | engage+commenthook | ❌ behind |
| comments: runs with a war story / date / name | 5% | 18% | 3% | 0% | engage+commenthook | ❌ behind |
| comments: runs with a comment block > 2 lines | 5% | 18% | 3% | 0% | engage+commenthook | ❌ behind |
| comments: longest comment block (lines) | 0.4 | 0.8 | 0.3 | 0.3 | engage, engage+commenthook | 🟰 tied |
| comments: comment lines per run | 0.6 | 1.1 | 0.4 | 0.3 | engage+commenthook | ❌ behind |
| rule footprint, one-time (tok) | 0 | 715 | 1157 | 1157 | code-hook | ❌ behind |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage, engage+commenthook | 🟰 tied |

**engage: 0 best · 2 tied · 5 behind** (comments: runs with a ticket/issue reference; comments: runs with a war story / date / name; comments: runs with a comment block > 2 lines; comments: comment lines per run; rule footprint, one-time (tok)) · run cost $4.38

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
