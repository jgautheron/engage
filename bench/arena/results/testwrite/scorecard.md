# engage arena — testwrite

n=4 per cell · generator claude-sonnet-5 · maintainer haiku (no rules) · prose claude-sonnet-5 · versions {"terse-hook":"99aafe1","code-hook":"552acd5","both-hooks":"99aafe1+552acd5","engage":"b5d4bfd"}

| metric | base | code-hook | engage | engage-tests | best (excl. base) | engage |
|---|--:|--:|--:|--:|---|---|
| tests: planted bugs caught (of 3) | 3.00 | 2.75 | 3.00 | 2.25 | engage | ✅ best |
| tests: share failing on the correct code (encode a bug) | 0% | 0% | 0% | 0% | code-hook, engage | 🟰 tied |
| tests: mutation score on the correct code | 54% | 54% | 55% | 40% | code-hook, engage | 🟰 tied |
| tests: assertions per test | 1.51 | 1.88 | 1.68 | 1.32 | code-hook | ❌ behind |
| tests: error-path tests | 36.8 | 24.3 | 27.3 | 21.0 | engage | ✅ best |
| tests: weak or missing assertions | 0.0 | 0.3 | 0.0 | 0.3 | engage | ✅ best |
| tests: mocks | 0.0 | 0.0 | 0.0 | 0.0 | code-hook, engage | 🟰 tied |
| tests: test cases written | 150 | 98 | 115 | 80 | engage | ✅ best |
| tests: $ cost per suite | $0.84 | $0.56 | $0.69 | $0.46 | code-hook | ❌ behind |
| rule footprint, one-time (tok) | 0 | 1307 | 1091 | 1205 | engage | ✅ best |
| rule footprint, per turn (tok) | 0 | 0 | 0 | 0 | code-hook, engage | 🟰 tied |

**engage: 5 best · 4 tied · 2 behind** (tests: assertions per test; tests: $ cost per suite) · run cost $10.23

Tie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.
