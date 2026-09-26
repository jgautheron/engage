# Multi-file follow-up study (2026-09-26)

Follow-up to [docs/agent-readability-study.md](../../docs/agent-readability-study.md), aimed at its
two main limitations: single-module tasks and a strong model on both ends.

**Task.** A checkout engine ([spec.md](spec.md)) that generators split into 7–9 files: cart validation,
promos, BOGO, a global discount cap, discount attribution across categories, shipping with a shared
free-shipping threshold, per-category tax, and a second function that must agree with the first.
Then a three-part change ([change.md](change.md)) that crosses modules: move the threshold and its
basis, add a promo kind that touches types/discounts/tax, make codes lenient and add a receipt field.

**Method.** Sonnet generates one shot, no running (4 variants × 3 samples; v0-3 did not finish).
Haiku, with no style rules, applies the change blind to each result. Hidden suites: 30 generation
cases, 15 change cases; both validated 100% against the references in `ref/`, and the change suite
fails 13/15 on unmodified code. `tsc --strict --noUnused*`. Structure via [metrics.ts](metrics.ts).

Variants (`variants/`): v0 no rules · v1 engage v0.2 (pre-M-min) · v2 engage now (M-min) ·
v3 engage with compressed Voice/Always sections.

## Results

| variant | generation 30 | Haiku change 15 | tsc errors | code tok | comment lines | contracts on exports | Haiku tokens for change |
|---|--:|--:|--:|--:|--:|--:|--:|
| v0 no rules (n=2) | 30, 30 | 15, **13** | 0 | ~3780 | ~75 | 10–11 | ~57k |
| v1 engage v0.2 | 30 ×3 | 15 ×3 | 0 | ~2430 | 1–5 | 1–2 | ~53k |
| v2 engage now | 30 ×3 | 15 ×3 | 0 | ~3050 | 30–43 | 13–19 | ~57k |
| v3 compressed | 30 ×3 | 15 ×3 | 0 | ~2970 | 9–30 | 9–11 | ~50k |

- **Correctness is still a ceiling.** 41/42 scored runs perfect. The one failure (v0-2, cap logic
  after adding the category promo) is a no-rules codebase; one failure at n=2 is not evidence.
- **Duplication did not bite.** v2-3 defined the free-shipping threshold in two files; Haiku still
  found and changed both.
- **Rules move cost and shape.** M-min writes ~25% more code than v0.2 — nearly all of it the
  export contracts — and ~20% less than no rules. No measurable maintenance payoff for the
  contracts at this scale; kept on research grounds (see the main study).

## Compression check (item from the same pass)

Compressing the Voice/Always sections saves only 38–87 tokens per style (3–7%): the engineering
block is most of each file and was left verbatim. Code shape did not move (v3 ≈ v2). But in the
prose check ([prompts.md](prompts.md), `results/prose/`, [prose.ts](prose.ts)) compressed *terse*
wrote 58% more words and 3× the articles, likely from shortening "Drop articles (a/an/the)" to
"Drop articles". n=1, but the prize is too small to risk the default voice: **not applied.**

## Reproduce

`./run.sh gen|mod <dir> [-v]` (needs Bun) · `bun metrics.ts <dir>` · `bun prose.ts`.
Raw outputs: `results/generated/`, `results/modified/`, `results/prose/`.
