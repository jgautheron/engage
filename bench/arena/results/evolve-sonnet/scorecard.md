# engage arena — evolve-sonnet

n=4 per cell · generator sonnet · maintainer haiku (no rules) · prose sonnet · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"8e207d8"}

| metric | base | code-hook | both-hooks | engage | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| evolve: tests passed, mean over v1–v5 | 100% | 100% | 100% | 100% | code-hook, both-hooks, engage | 🟰 tied |
| evolve: tests passed at v5 (all features) | 100% | 100% | 100% | 100% | code-hook, both-hooks, engage | 🟰 tied |
| evolve: regressions (earlier cases broken, sum v2–v5) | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, both-hooks, engage | 🟰 tied |
| evolve: v1 size (no premature abstraction, tok) | 220 | 207 | 217 | 216 | code-hook, both-hooks, engage | 🟰 tied |
| evolve: lines changed v3+v4 (design pays off) | 122 | 91 | 113 | 107 | code-hook | ❌ behind |
| evolve: lines changed v5 (trivial change stays trivial) | 17 | 16 | 17 | 17 | code-hook, both-hooks, engage | 🟰 tied |
| evolve: output tokens, all 5 iterations | 12383 | 11313 | 9762 | 11137 | both-hooks | ❌ behind |
| evolve: final size v5 (tok) | 844 | 805 | 842 | 886 | code-hook, both-hooks, engage | 🟰 tied |
| evolve: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | code-hook, both-hooks, engage | 🟰 tied |
| rule footprint, one-time (tok) | 0 | 1307 | 2608 | 1008 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 61 | 0 | code-hook, engage | 🟰 tied |

**engage: 1 best · 8 tied · 2 behind** (evolve: lines changed v3+v4 (design pays off); evolve: output tokens, all 5 iterations) · run cost $4.22

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
