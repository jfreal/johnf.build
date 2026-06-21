# Product

## Register

brand

## Users

People deciding whether to talk to John: engineering leaders, founders, and
hiring managers sizing him up for an agentic-operations or engineering-leadership
role. They arrive from LinkedIn, a résumé link, or a referral, usually skimming
on a laptop between other tabs. The job they're doing: figure out in ~30 seconds
whether John is the real thing (genuinely AI-fluent, has shipped, can lead
humans) and whether he's worth a conversation.

## Product Purpose

John Farrell's personal site. It exists to land an **agentic-operations** role:
someone who helps a team actually succeed with generative AI (setting up
harnesses, tightening feedback loops, pulling the org up the curve). Success = a
qualified reader hits the "What I'm looking for" card, believes the AI-fluency
claim *because the operations behind it are concrete*, and reaches out. It's a
calling card with one sharp conversion, not a general résumé dump.

## Brand Personality

Candid and friendly. Snarky but optimistic. The voice of a smart friend at a bar
who builds things, not a LinkedIn post.

- **Candid:** lead with the real thing, don't bury the verb, don't over-qualify.
- **Friendly:** warm, second-person where it fits, low-jargon, likes the reader.
- **Snarky:** one earned wink per section, used sparingly so it lands.
- **Optimistic:** close on the upbeat; never cynical about the work, the tools,
  or other people.

Three-word version: candid, snarky, optimistic.

## Anti-references

- **Generic AI landing page** (the explicit no): warm cream bg + tiny tracked
  uppercase eyebrows over every section + identical icon-heading-text cards +
  gradient text. The 2026 slop default.
- **The LinkedIn / corporate template:** stock-photo headers, buzzword cards,
  "synergy / leverage / robust solutions," "results-driven," "passionate about."
- **Specifics-free listicles** ("Communication. Empathy. Leadership.") and
  marketing hedges ("I'd argue," "arguably," "kind of," "sort of").
- **AI hype with no operation behind it**, and a wink on a sentence that's
  already bragging.
- Mechanical: no em dashes (John bans them).

## Design Principles

- **The voice is the product.** Every line passes the smart-friend-at-a-bar
  test. If it sounds like a LinkedIn post, it's wrong. Craft serves the voice,
  never sands it down.
- **Specific beats vague, always.** Named projects (Pheidi, ktcalc, Ordo),
  checkable numbers (~100 commits/mo on a hot side project), concrete tools
  (Claude Code, sub-agents, MCP, evals). Categories and adjectives are the enemy.
- **Earn the wink.** Snark only lands on a claim that's already true. Don't
  oversell; don't put a wink on a brag. The underlying fact carries it.
- **Show the operation, not the hype.** AI fluency is proven by the operations
  around the prompts (where to put a harness, how to design feedback, when to run
  parallel work, when to demand a human review), never by hype words.
- **Close on the upbeat.** Software is easy; humans are the hard and fun part.
  Optimism and servant-leadership are the resting stance; cynicism never closes a
  section.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1, large text ≥3:1 (watch `--ink-soft`
#5a4f53 and muted captions on cream: verify, don't assume). Keep the skip-link,
visible `:focus-visible` states, and full keyboard reachability. Honor
`prefers-reduced-motion` for the scroll-reveal and any future motion, and make
sure content is readable without the JS-added `is-visible` class. Never rely on
color alone to carry meaning.
