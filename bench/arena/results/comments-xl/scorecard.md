# engage arena — comments-xl

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"2fd153c","code-hook":"e3ba2aa","both-hooks":"2fd153c+e3ba2aa","engage":"e3273bf"}

| metric | engage | best (excl. base) | engage |
|---|--:|---|---|
| evolve-xl: tests passed, mean over all 15 iterations | 100% | engage | — |
| evolve-xl: tests passed at v15 (every feature) | 100% | engage | — |
| evolve-xl: regressions (earlier cases broken, summed) | 1.0 | engage | — |
| evolve-xl: v1 size — no premature abstraction (tok) | 234 | engage | — |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 210 | engage | — |
| evolve-xl: lines changed on the trivial v12 | 11 | engage | — |
| evolve-xl: output tokens, whole project | 56297 | engage | — |
| evolve-xl: cost growth — late vs early iteration tokens | 1.46× | engage | — |
| evolve-xl: final size (tok) | 4106 | engage | — |
| evolve-xl: health — files at the end | 1.0 | engage | — |
| evolve-xl: health — largest file (lines) | 500 | engage | — |
| evolve-xl: health — largest function (lines) | 324 | engage | — |
| evolve-xl: health — max branch complexity | 20.5 | engage | — |
| evolve-xl: health — duplicated blocks | 0.5 | engage | — |
| evolve-xl: health — non-null assertions | 3.5 | engage | — |
| evolve-xl: runs without a build step (all snapshots) | 100% | engage | — |
| rule footprint, one-time (tok) | 1095 | engage | — |
| rule footprint, per turn (tok) | 0 | engage | — |

**engage: 0 best · 0 tied · 0 behind** · run cost $3.03

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
