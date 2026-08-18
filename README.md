<p align="center">
  <img src="assets/logo.svg" alt="engage" width="520">
</p>

A lean Claude Code output-style pack. One voice: terse, lazy-in-the-good-way, no fluff — with a
light Star Trek garnish. Say **"hit it"** to proceed.

engage ships as **output styles**, not hooks. The style lives in the system prompt (which is
prompt-cached), so it costs a fixed ~1,160 tokens once and **nothing per turn**, and it never
drifts mid-session.

## Styles

Switch via `/config` → **Output style** (setup in [Install](#install) below). Only one is active
at a time.

| Style | Voice | Use for |
|---|---|---|
| **engage-terse** *(default)* | Drop articles, filler, pleasantries. Fragments OK. Full technical accuracy. | Day-to-day work, max token savings |
| **engage-concise** | Plain readable English, filler cut, answer-first. Full grammar. | When terse fragments read too rough |
| **engage-docs** | Clear controlled prose: active voice, one instruction per sentence, short sentences, no phrasal verbs. | READMEs, manuals, error messages, tool descriptions |
| **engage-plain** | Normal full English, no compression, minus AI-slop. | Sharing output with others |

All four carry the same **engineering discipline** (lazy by default: YAGNI, stdlib and native
first, shortest diff *that stays readable*, reader-first — intention-revealing names (name magic
literals), guard clauses over nesting, declarative pipelines over hand loops, deep modules over
shallow wrappers, measure before optimizing (clever ≠
faster), terse *why-not-what* comments (no war stories, ticket numbers, or commented-out code),
never simplify away validation/security/error-handling) and the same
**always-rules**: artifact-first (long output → file + summary), no AI-slop, compress prose not
reasoning, ask with concrete examples, and the Trek garnish.

## Install

It's **two steps** — installing alone does nothing visible.

**1. Install** (makes the styles + `/trek` *available*):

```
/plugin marketplace add jgautheron/engage
/plugin install engage@engage
```

**2. Activate a style** (the step that actually turns engage on). Set the `outputStyle` key in
`~/.claude/settings.json` (global) or `.claude/settings.json` (project):

```json
{ "outputStyle": "engage-terse" }
```

Or pick it interactively with `/config` → **Output style**. (Some Claude Code builds also expose a
`/output-style engage-terse` command; if yours returns *"Unknown command"*, use the settings key or
`/config` above — those always work.)

Takes effect on the next session (or after `/clear`).

> **Why the second step?** Output styles are opt-in — a plugin can *ship* them but Claude Code
> won't force one on. Installing engage only puts the four styles in the picker; nothing changes
> until you pick one. That's the deliberate trade: engage lives in the cached
> system prompt with **zero per-turn cost and no drift**, in exchange for choosing it once. (Hook-
> based style plugins auto-activate on install but re-inject every turn — the cost engage avoids.)

## Switching

Change the active voice via `/config` → **Output style**, or by editing the `outputStyle` key in
settings.json (`engage-terse` · `engage-concise` · `engage-docs` · `engage-plain`). On builds that
have the command, `/output-style <name>` also works.

```
/trek [on|off]             toggle the Star Trek garnish
```

"hit it" / "engage" / "make it so" = proceed with the last proposed plan. Writing a doc? Switch to
`engage-docs`. Sharing output? `engage-plain`.

## Why output styles instead of a hook

A hook re-injects its instructions every turn — that cost compounds, and running several style
plugins at once means several injections fighting each other every message. An output style is a
single persistent system-prompt layer: set once, cached, zero per-turn cost, no drift, and native
switching (via `/config` → Output style, or `/output-style` on builds that have it) for free.
`keep-coding-instructions: true` overlays the voice while
keeping Claude Code's built-in engineering behavior.

## Footprint (measured)

engage lives in the (cached) system prompt: one style loads once, **0 per turn**. Hook-based style
plugins re-inject every session, and a terse-prose hook typically re-nags every turn. Approximate
tokens (chars/4), same basis for all:

| Delivery | one-time | per turn |
|---|--:|--:|
| **engage** (output style) | ~1160 | **0** |
| a terse-prose hook plugin | ~1180 | ~34 |
| a lazy-code hook plugin | ~1310 | 0 |
| both hook plugins together | ~2490 | ~34 |

Total tokens carried at N turns:

| turns | engage | terse hook | code hook | both hooks |
|---|--:|--:|--:|--:|
| 1 | **1158** | 1212 | 1308 | 2520 |
| 10 | **1158** | 1518 | 1308 | 2826 |
| 50 | **1158** | 2878 | 1308 | 4186 |
| 100 | **1158** | 4578 | 1308 | 5886 |
| 500 | **1158** | 18178 | 1308 | 19486 |

Flat line vs rising ones — engage is cheapest at every N, below even a single *prose-only* hook's
one-time cost, and the gap widens every turn. And engage carries prose *and* the full engineering
discipline in one style, where each hook does only half the job.

**Docs mode is free too:** switching to `engage-docs` replaces the active style (+0). Bolting a
separate technical-writing *skill* onto a hook plugin costs ~6.8k tokens the session it loads.

_Estimate (chars/4, ±15%); ratios reliable. engage's one-time cost sits in the prompt-cached system
prompt; hook injections re-run per session and the terse hook re-injects every turn._

## Layout

```
.claude-plugin/plugin.json       manifest
.claude-plugin/marketplace.json  local install entry
output-styles/engage-*.md        the four voices
commands/trek.md                 the one slash command
assets/logo.svg                  wordmark
```
