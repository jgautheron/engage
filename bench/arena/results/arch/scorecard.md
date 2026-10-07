# engage arena — arch

n=2 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"6776cd6"}

| metric | code-hook | engage | engage-plan | engage-core | engage-types | engage-tdd | best (excl. base) | engage |
|---|--:|--:|--:|--:|--:|--:|---|---|
| evolve-xl: tests passed, mean over all 12 iterations | 100% | 100% | 99% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: tests passed at v12 (every feature) | 100% | 100% | 95% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| evolve-xl: regressions (earlier cases broken, summed) | 0.0 | 0.0 | 2.5 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: v1 size — no premature abstraction (tok) | 225 | 241 | 259 | 236 | 235 | 242 | code-hook, engage | 🟰 tied |
| evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11) | 206 | 227 | 241 | 250 | 248 | 190 | code-hook | ❌ behind |
| evolve-xl: lines changed on the trivial v12 | 10 | 11 | 11 | 12 | 11 | 10 | code-hook, engage | 🟰 tied |
| evolve-xl: output tokens, whole project | 0 | 0 | 0 | 4911 | 45219 | 55844 | code-hook, engage | 🟰 tied |
| evolve-xl: cost growth — late vs early iteration tokens | 0.00× | 0.00× | 0.00× | 0.00× | 2.39× | 2.59× | code-hook, engage | 🟰 tied |
| evolve-xl: $ cost, whole project | $0.00 | $0.00 | $0.00 | $0.20 | $1.46 | $1.70 | code-hook, engage | 🟰 tied |
| evolve-xl: agent turns, whole project | 0 | 0 | 0 | 17 | 101 | 129 | code-hook, engage | 🟰 tied |
| evolve-xl: final size (tok) | 3657 | 3697 | 3847 | 3816 | 3912 | 3502 | code-hook, engage | 🟰 tied |
| evolve-xl: health — files at the end | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest file (lines) | 444 | 456 | 458 | 488 | 482 | 423 | code-hook, engage | 🟰 tied |
| evolve-xl: health — largest function (lines) | 269 | 262 | 261 | 271 | 255 | 269 | code-hook, engage | 🟰 tied |
| evolve-xl: health — max branch complexity | 19.5 | 18.5 | 16.5 | 19.0 | 19.0 | 16.5 | code-hook, engage | 🟰 tied |
| evolve-xl: health — duplicated blocks | 4.0 | 0.0 | 1.5 | 1.0 | 0.0 | 0.0 | engage | ✅ best |
| evolve-xl: health — non-null assertions | 4.0 | 2.5 | 2.0 | 0.5 | 4.5 | 2.0 | engage | ✅ best |
| evolve-xl: locality — existing functions changed per iteration | 4.1 | 3.0 | 4.1 | 3.9 | 4.2 | 3.8 | engage | ✅ best |
| evolve-xl: locality — new functions per iteration | 2.7 | 2.4 | 2.7 | 3.1 | 3.4 | 2.5 | code-hook | ❌ behind |
| evolve-xl: design — share of pure functions | 80% | 76% | 80% | 79% | 78% | 80% | code-hook | ❌ behind |
| evolve-xl: design — union types (literal + tagged) | 3.5 | 4.0 | 4.5 | 3.0 | 5.0 | 3.5 | engage | ✅ best |
| evolve-xl: design — exhaustive never checks | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| evolve-xl: design — imports per file | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | code-hook, engage | 🟰 tied |
| evolve-xl: tests — test cases written | 60 | 53 | 57 | 72 | 84 | 92 | code-hook | ❌ behind |
| evolve-xl: runs without a build step (all snapshots) | 100% | 100% | 100% | 100% | 100% | 100% | code-hook, engage | 🟰 tied |
| rule footprint, one-time (tok) | 1307 | 1115 | 1157 | 1152 | 1157 | 1146 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 5 best · 18 tied · 4 behind** (evolve-xl: lines changed on design-heavy iterations (v5,v9,v10,v11); evolve-xl: locality — new functions per iteration; evolve-xl: design — share of pure functions; evolve-xl: tests — test cases written) · run cost $6.74

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
