# engage arena — gdpskill-v1

n=6 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"d262ab38","code-hook":"84740e3","both-hooks":"d262ab38+84740e3","engage":"501e19c"}

| metric | engage-gdpskill | best (excl. base) | engage |
|---|--:|---|---|
| authz: tests passed, mean over all 1 iterations | 100% |  | — |
| authz: tests passed at v1 (every feature) | 100% |  | — |
| authz: regressions (earlier cases broken, summed) | 0.0 |  | — |
| authz: v1 size — no premature abstraction (tok) | 2950 |  | — |
| authz: output tokens, whole project | 30328 |  | — |
| authz: cost growth — late vs early iteration tokens | 0.00× |  | — |
| authz: $ cost, whole project | $0.88 |  | — |
| authz: agent turns, whole project | 42 |  | — |
| authz: final size (tok) | 2950 |  | — |
| authz: health — files at the end | 11.2 |  | — |
| authz: health — largest file (lines) | 75 |  | — |
| authz: health — largest function (lines) | 50 |  | — |
| authz: health — max branch complexity | 4.0 |  | — |
| authz: health — duplicated blocks | 0.0 |  | — |
| authz: health — non-null assertions | 2.0 |  | — |
| authz: locality — existing functions changed per iteration | 0.0 |  | — |
| authz: locality — new functions per iteration | 0.0 |  | — |
| authz: design — share of pure functions | 92% |  | — |
| authz: design — union types (literal + tagged) | 3.0 |  | — |
| authz: design — exhaustive never checks | 0.0 |  | — |
| authz: design — imports per file | 3.34 |  | — |
| authz: tests — test cases written | 19 |  | — |
| authz: tests — mutation score (own suite, own code) | 94% |  | — |
| authz: tests — own suite still green | 100% |  | — |
| authz: tests — failing on a correct alternative implementation | 0% |  | — |
| authz: tests — assertions per test | 0.98 |  | — |
| authz: tests — error-path tests | 11.3 |  | — |
| authz: compliance — functions taking evidence/branded params | 21% |  | — |
| authz: compliance — own test suite green after an iteration | 100% |  | — |
| authz: compliance — test edited before src (agent mode) | 0% |  | — |
| authz: compliance — plan stated before the first file (v1) | 0% |  | — |
| authz: runs without a build step (all snapshots) | 100% |  | — |
| rule footprint, one-time (tok) | 5917 |  | — |
| rule footprint, per turn (tok) | 0 |  | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $5.30

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
