# engage arena — evolve-haiku

n=4 per cell · generator haiku · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"8e207d8"}

| metric | base | code-hook | both-hooks | engage | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve: tests passed, mean over v1–v5 | 98% | 100% | 97% | 99% | code-hook, engage | 🟰 tied |
| evolve: tests passed at v5 (all features) | 97% | 98% | 95% | 97% | code-hook, engage | 🟰 tied |
| evolve: regressions (earlier cases broken, sum v2–v5) | 1.8 | 0.0 | 2.3 | 0.0 | code-hook, engage | 🟰 tied |
| evolve: v1 size (no premature abstraction, tok) | 221 | 212 | 215 | 218 | code-hook, both-hooks, engage | 🟰 tied |
| evolve: lines changed v3+v4 (design pays off) | 136 | 109 | 127 | 113 | code-hook, engage | 🟰 tied |
| evolve: lines changed v5 (trivial change stays trivial) | 15 | 11 | 11 | 12 | code-hook, both-hooks | ❌ behind |
| evolve: output tokens, all 5 iterations | 22637 | 22224 | 21866 | 19997 | engage | ✅ best |
| evolve: final size v5 (tok) | 1119 | 954 | 966 | 853 | engage | ✅ best |
| evolve: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | code-hook, both-hooks, engage | 🟰 tied |
| rule footprint, one-time (tok) | 0 | 1307 | 2608 | 1008 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 61 | 0 | code-hook, engage | 🟰 tied |

**engage: 3 best · 7 tied · 1 behind** (evolve: lines changed v5 (trivial change stays trivial)) · run cost $3.35

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
