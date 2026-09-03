# Agent-readable, bug-free code: research + A/B study → proposed engage changes

*2026-09-03 · evaluated by Fable 5.1 · status: APPLIED — M-min is the engineering block in all four styles as of 2026-09-03*

## TL;DR

1. **Correctness is a ceiling.** Across 5 tasks, 9 rule-sets, and 61 one-shot generations (2 samples on the two hard tasks), **every variant — including "no rules" — passed 100% of the hidden edge-case suites.** A neutral reader agent then correctly extended all 27 round-1 outputs (100%). `tsc --strict --noUnusedLocals --noUnusedParameters` over 60 modules: **0 errors.** On single-module, well-specified tasks, rule text does not move correctness, modifiability, or type cleanliness for this model class. Any "our rules make code bug-free" claim is unsupported at this scale — for engage or anyone else.
2. **What rules *do* change is structure and cost**, and those differences are large and repeatable: a 2.6× token spread between rule-sets, comment density from 0 → 25 lines, whether the domain is encoded in types or inline regex, whether "clever" idioms appear, and how big the test artifact is.
3. **The research is about system scale**, not single functions: dead code, stale comments, duplicated business logic, hidden magic, and lost-in-the-middle position effects degrade agents on real codebases. Micro-benches can't reach that regime, so the research — not the bench — is the basis for those rules.
4. **Net proposal:** keep most of engage; tighten "boring over clever" with explicit bans; split *contract comments* from *inline comments*; swap "fewest files/one-liners/rule-of-three" for the agent-scale versions; add a lean types rule and an explicit no-dead-code rule; **soften the functional-pipeline rule** (it correlated with clever idioms, and the loop variant had zero of them at the lowest cost); do **not** adopt the full "agent bundle" (2.2× tokens, over-builds past the spec).

---

## 1. Research synthesis (what actually helps LLM agents)

| Finding | Source | Implication for engage |
|---|---|---|
| Dead/garbage code is the **single most disruptive** perturbation; LLMs lose the ability to localize a bug in 81% of programs under semantics-preserving mutations, and weight comments and dead code equal to real logic | Assessing the Impact of Code Changes on Fault Localizability (arXiv 2504.04372) | Make "no dead code" explicit (unreachable branches, unused params, commented-out code) |
| Correct inline comments help comprehension **little**; several studies found removing comments *improved* results; **wrong/stale comments hurt a lot** (−23% under misleading comments; models treat comments as execution guidance) | Macke & Doyle 2404.03114; RepoQA; CodeCrash 2504.14119; Inside Out 2512.16790 | Keep terse-why inline; add "every comment must be true; delete stale ones" |
| **Docstrings/contracts matter for generation** — removing them tanks results; they are the spec the next agent works from | EACL-24 docstring study; class-level generation study 2510.26130 | A 1–3 line contract on every *exported* symbol (intent, inputs, invariants, throws) — not a spec restatement |
| Identifier names matter at least as much as comments | Nikiema et al.; Macke & Doyle | Intention-revealing names (already in engage) ✓ |
| LLMs comprehend code **earlier in a file** better; comprehension degrades with size (lost-in-the-middle, context rot) | 2504.04372; Context Compaction Theory 2608.01326 | Public entry point first, helpers after; small cohesive units — not "fewest files" |
| LLMs are weak at **dynamic semantics**: tracking state through loops, control-flow rewrites, mutation | Position paper 2507.09135; mutation-robustness studies | Explicit state, immutability by default, no truthiness tricks, no positional tuples |
| Top LLM bug classes: misinterpretation, **missing corner case**, wrong input type, **hallucinated API**, non-prompted consideration, incomplete generation | Tambon et al. (EMSE 2025); survey 2512.05239 | Enumerate edge cases before coding; only call APIs you can see; don't add unrequested behavior |
| AI defaults to "optional-field soup"; discriminated unions + exhaustive `never` + parse-don't-validate give the compiler leverage | TS-rules-for-AI; Krycho; Wlaschin | Add a lean types rule |
| Duplicate *structure* to keep behavior local (agents flail on registries/decorators/magic); never duplicate *business logic/constants* (agents update one copy, miss the rest) | HackerNoon "boring code"; maintainable.software; Faros | Replace rule-of-three with "single-source business rules at first reuse"; add "explicit over magic" |
| Short instruction files (<200 lines) outperform long ones; concrete, verifiable rules beat vague ones | Anthropic Claude Code best practices; community meta-analyses | Keep engage lean; prefer bans on named idioms over abstract virtues |

## 2. Method

**Variants (rule-sets):** `v0 base` (no rules) · `v1 engage` (current) · `v2 +types` · `v3 +edge-cases/tests` · `v4 +contract comments` · `v5 +explicit state` · `v6 challenge` (engage with three existing rules altered: one-idea-per-line, single-source business rules, small units instead of fewest files) · `v7 agent bundle` (v6 + v2..v5) · `v8 no-functional` (engage with explicit loops instead of pipelines). Pinned verbatim in `/tmp/exp-hidden/variants/`.

**Tasks** (spec given; tests hidden in a directory agents could not see):
- t1 duration parser (20 cases) · t2 LRU cache (18) · t3 promo pricing with a shared business rule + discriminated union (13) · **t4 strict RFC-4180 CSV line parser (19, corner-case dense)** · **t5 full SemVer 2.0.0 precedence incl. pre-release rules (23)**.
- Every suite validated 100% against a reference solution; modification suites verified to *fail* on unmodified code.

**Measures:** hidden-suite pass rate (one-shot, no running/iterating, so rule *text* is isolated from tool use) · neutral-reader modification pass rate (original + new cases) · `tsc --strict --noUnused*` · structure (tokens, LOC, comments, contracts, named types, exhaustive `never`, named constants, truthiness idioms, test-file size) · my own read of representative outputs.

## 3. Results

### 3.1 Correctness — ceiling everywhere
| task | variants × samples | hidden cases | result |
|---|---|---|---|
| t1 duration | 9 × 1 | 20 | 9/9 at 20/20 |
| t2 LRU | 9 × 1 | 18 | 9/9 at 18/18 |
| t3 promo | 9 × 1 | 13 | 9/9 at 13/13 |
| t4 CSV (hard) | 9 × 2 | 19 | 18/18 at 19/19 |
| t5 SemVer (hard) | 9 × 2 (16 landed; API 529s) | 23 | 16/16 at 23/23 |

### 3.2 Modifiability — ceiling
Neutral reader (no style rules) extended every round-1 output correctly: t1 24/24 ×9, t2 22/22 ×9, t3 15/15 ×9.

### 3.3 Strict types — ceiling
60 modules, `--strict --noUnusedLocals --noUnusedParameters`: 0 errors, from every variant.

### 3.4 Structure — where the rules actually differ (means over t4+t5 samples)
| variant | tok | LOC | comment lines | contracts on exports | named types | truthiness idioms | exhaustive `never` | UPPER consts | test-file lines |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| v0 base | **1012** | 90 | **25.5** | 1.0 | 1.3 | 0.8 | 0 | 2.0 | 24 |
| v1 engage | 457 | 49 | 0.5 | 0.3 | 1.3 | 0.5 | 0 | 2.5 | 32 |
| v2 +types | 640 | 71 | 1.0 | 0.8 | 2.0 | **1.5** | 0.5 | 2.5 | 42 |
| v3 +edge | 513 | 55 | 2.0 | 0.7 | 1.0 | 0.3 | 0 | 2.7 | **87** |
| v4 +contract | 586 | 49 | 6.5 | **1.0** | 1.0 | 0.5 | 0 | 2.0 | 32 |
| v5 +state | 507 | 53 | 0.5 | 0.5 | 1.8 | 1.3 | 0 | 3.3 | 35 |
| v6 challenge | 579 | 64 | 1.0 | 0.5 | 1.5 | 0.8 | 0 | 3.3 | 51 |
| v7 bundle | **1003** | 103 | 6.5 | 1.0 | **2.8** | 0.3 | **1.0** | **4.3** | 74 |
| v8 no-functional | **393** | 44 | 0.7 | 0.3 | 0.3 | **0.0** | 0 | 0.7 | 19 |

Round-1 extras: on t3 the "single-source business rules" wording cut inline business literals 3 → 1 (bundle → 0); only TYPES-carrying variants emitted exhaustive `never` checks; base wrote a 15-line spec-restating JSDoc for what engage did in 26 lines.

### 3.5 What I saw reading the code (t4 CSV, t5 SemVer)
- **base:** monolithic, nesting depth 4–6, spec restated verbatim in JSDoc plus inline "what" comments — the exact redundant-doc pattern the research says rots.
- **engage (current):** lean, decomposed, guard-clause flat. Weaknesses a reading agent would trip on: positional tuple returns (`[field, end]`), a dense ternary-destructure dispatch produced by rule 5, ordering-by-truthiness (`compareCore(...) || comparePrerelease(...)`, `map().find(r=>r!==0) ?? 0`), and under-named regexes (`NUMERIC` vs `DIGITS` hides the leading-zero rule). "Boring over clever" did not stop any of these.
- **bundle:** domain encoded in types (`{kind:'numeric'|'alphanumeric'}` + `assertNever`), names like `INTEGER_WITHOUT_LEADING_ZEROS`, named booleans, a 4-line contract, one idea per line. Most agent-readable — but 2.2–2.4× tokens and it **over-built past the spec** (bigint cores, iterator-based generic comparer, unrequested build-metadata validation): the "non-prompted consideration" bug class in embryo.
- **no-functional:** cheapest, zero clever idioms, identical correctness — the pipeline rule is what invites `reduce`/`find`-as-control-flow tricks.

## 4. Proposed changes to engage's engineering block

Legend: **KEEP** (validated), **TWEAK** (reword existing), **ADD** (new, lean), **DROP** (do not adopt).

### KEEP
Ladder rungs 1–4 & 6 · "boring over clever" (but see T2) · deletion over addition · intention-revealing names · name magic literals · guard clauses / flat happy path · never simplify away validation, error handling, security · measure before optimizing · terse *why* inline comments · no war stories.

### TWEAK
- **T1 — rung 5.** `one line if it reads clearer, not if it just packs more in` → **`one idea per line; no dense one-liners`**. *Why:* produced the packed dispatch; LLMs shortcut on dense dynamic semantics. *Cost:* ~0.
- **T2 — give "boring over clever" teeth.** Append: **`No truthiness tricks on numbers or orderings (no `a || b` on -1/0/1, no `?? 0` as control flow). Return a named object, not a positional tuple, for multi-value results.`** *Why:* both appeared in engage's own outputs; research on superficial-cue shortcuts. *Cost:* ~0.
- **T3 — comments: split contracts from inline.** Keep the terse-why inline rule and add: **`Every exported function/type gets a 1–3 line contract: intent, inputs, invariants, and exactly what it throws — never a restatement of the spec. A stale or wrong comment is worse than none: every comment must be true of the code; delete any that no longer match.`** *Why:* contracts are the spec the next agent generates/modifies from; stale comments are the measured harm. *Cost:* ~+6 lines/module on exports only.
- **T4 — structure.** `fewest files; shortest diff that stays readable` → **`small cohesive units with explicit boundaries; public entry point first, helpers after; minimize files *touched* per change`**. *Why:* position/lost-in-the-middle effects; locality. *Cost:* 0.
- **T5 — duplication.** `Extract a shared helper on the third duplicate, not the first.` → **`Duplicate structure freely; never duplicate a business rule or constant — single-source it at the first reuse.`** *Why:* drift; measured 3→1 inline literals. *Cost:* 0.
- **T6 — soften the pipeline rule.** `Prefer declarative pipelines (map/filter/reduce) over hand loops…` → **`Use the plainest construct: map/filter for simple transforms; an explicit loop with a named accumulator for early exit, accumulation, or index logic. No reduce-as-control-flow, no find()??0 tricks.`** *Why:* the pipeline rule correlated with clever idioms (0.5–1.5 per module) while explicit loops had 0 at the lowest token cost and identical correctness. This is the one existing rule the experiment argues *against* as written.

### ADD
- **A1 — types (lean).** **`Make illegal states unrepresentable: model alternatives as a discriminated union with a `kind` field, never parallel optional/boolean flags; every switch over a union is exhaustive with a `never` default; no `any`; parse raw input once at the boundary into a typed value, then trust the type.`** *Why:* only TYPES variants produced exhaustive checks; compiler leverage for the next agent; counters the "wrong input type" bug class. *Cost:* ~+150–180 tok/module. Deliberately **omits "branded types"** — that clause pushed bigint over-engineering.
- **A2 — no dead code, explicit.** **`No dead code: no unreachable branches, unused parameters or variables, or commented-out code — it is the single most disruptive thing for a reading agent.`** *Cost:* 0.
- **A3 — no invented APIs.** **`Only call APIs you can see in the types, repo, or docs; never guess a parameter or method — verify it exists.`** *Why:* hallucinated-API bug class. *Cost:* ~0.
- **A4 — edge-case enumeration (lean).** Fold into the existing check rule: **`Before coding, list the edge cases (empty, boundary, invalid, duplicate, missing) and handle each explicitly; pin them in the one runnable check.`** *Why:* "missing corner case" is a top bug class. *Cost:* ~0 — and it replaces the EDGE add-on's "write a test file for every case," which produced 87–153-line test artifacts.
- **A5 — explicit over magic.** **`No metaprogramming, decorators, registries, or config-driven dispatch that hides control flow; all behavior for a feature reads top-to-bottom in one place.`** *Why:* agents reconstruct scattered control flow by guessing. *Cost:* 0.

### DROP / DO NOT ADOPT
- The full **agent bundle** as-is: 2.2× tokens, over-builds beyond the spec.
- **Branded types** clause (over-engineering trigger).
- **Mandatory big test files** (EDGE add-on form) — keep the one runnable check.
- Any claim that engage makes code "bug-free": the data does not support it; say "lean, consistent, agent-readable" instead.

### Estimated footprint impact
Style body: roughly +150 tok (A1) +40 (T2/T3/A2/A3/A5) −0 elsewhere ≈ **+190 tok** on the ~1158-tok `engage-terse`. Generated-code cost: ≈ +150–250 tok/module on average (contracts + types), still ~40–50% below the bundle.

## 5. Limitations (read these before acting)
- **Ceiling effect:** the model class used for generation (Fable/Opus-tier subagents) did not produce a single bug on any task, so this study *cannot* rank rule-sets by correctness. It can only say "no measurable difference at this scale."
- **Scale:** single-module tasks. The research-backed harms (dead code, stale comments, drift, magic, position effects) operate on real codebases over long sessions. A follow-up should be a multi-file repo task with a multi-step change and a *weaker* reader model.
- **n:** 1 sample on round-1 tasks, 2 on hard tasks; t5 lost 2 samples to API overload. Structural means are directional.
- **Judge:** the qualitative ranking is one model's (mine) reading of ~5 files; the structural metrics are regex proxies.

## 6. Reproduce
Rig: `/tmp/exp` (agent-visible: `tasks/`, `mods/`) and `/tmp/exp-hidden` (`tests/`, `modtests/`, `ref/`, `variants/`, `run.sh gen|mod`, `structure.json`, `tsc.out`).
