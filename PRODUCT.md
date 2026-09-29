# Product

## Register

brand

## Users

People who might use, follow, or talk about John's projects: solo founders,
indie hackers, and developers curious how one person ships this much with
agents. They arrive from a Merge & Tell post, a product page's footer, Reddit,
Hacker News, or LinkedIn, usually skimming on a laptop or a phone. The job
they're doing: figure out in ~30 seconds what John is building, whether it's
real, and whether one of the projects is worth trying or following.

## Product Purpose

John Farrell's personal brand, and the marketing channel for all his projects.
It is **not** a job-search page anymore (changed 2026-09-29). The story it
tells: **every tool John built fixes a problem the last one made.** Pheidi (a
running app he needed) led to Merge & Tell (Pheidi's marketing), which led to
NightForge (the robots running every repo) and Screenery (the screenshots
every page needed). They now run each other, and this site is where it all
lands.

Success = a reader follows a line from one project to another, reads a case
study, and clicks through to a product. The hub is `/stack.html`. Every
product page links back to it through its "How it fits" box, and every case
study links to the next one. Build in public: the challenges and the broken
parts are content, not something to hide.

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
- **Specific beats vague, always.** Named projects (Pheidi, Merge & Tell, Screenery),
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
`#5a4f53` and muted captions on cream: verify, don't assume). Keep the skip-link,
visible `:focus-visible` states, and full keyboard reachability. Honor
`prefers-reduced-motion` for the scroll-reveal and any future motion, and make
sure content is readable without the JS-added `is-visible` class. Never rely on
color alone to carry meaning.
