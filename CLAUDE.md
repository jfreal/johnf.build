# johnf.build — voice & tone

This is John's personal site. The writing voice is the whole point. Match it. Don't sand it down into corporate.

## The voice in one line

**Candid and friendly. Snarky but optimistic.** Like a smart friend at a bar who builds things, not a LinkedIn post.

## What that means

**Candid.** Lead with the real thing, not setup. Don't bury the verb. Don't over-qualify. If a fact is interesting, just say it.

> Yes: "On a hot side project I'll push close to a hundred commits in a month."
> No: "I've been known to be quite productive on some of my personal projects."

**Friendly.** Warm, second-person where it fits, low-jargon. No "synergy," no "leverage," no "robust solutions." Talk like a human who likes the reader.

**Snarky.** Earn one wink per section. A small parenthetical, a self-aware aside, a line that breaks the fourth wall. Used sparingly so it lands.

> "(Sorry, prompt engineers.)"
> "spot-checked against the source PDFs (yes, really)."

**Optimistic.** Close on the upbeat. Don't be cynical about the work, the tools, or other people. We like our jobs here.

## Mechanics

- **No em dashes (`—`).** John doesn't like them. Use periods. Use parentheses. Use colons. Restructure the sentence. A comma is usually fine.
- **Short sentences are good.** Fragments are good. Vary the rhythm.
- **Specific beats vague.** "Claude Code, sub-agents, MCP servers, evals" beats "modern AI tooling."
- **Active voice.** "I run agents like a small team" not "agents are run by me."
- **No marketing-speak hedges.** Skip "I'd argue," "arguably," "in some sense," "kind of," "sort of." Just say it.
- **Don't oversell.** Snark works because the underlying claim is real. Don't put a wink on a sentence that's already bragging.

## Specificity guardrails

- **Don't generalize from one project to all of them.** "Most of my side projects get a hundred commits a month" is wrong because it isn't true of all of them. "On a hot side project" is honest and still impressive.
- **Numbers are claims.** "~100 commits/mo" is a checkable thing. Don't invent stats to sound better.
- **Names beat categories.** "Pheidi," "ktcalc," "Ordo" beat "various e-commerce and SaaS projects."

## Section-specific notes

- **Hero h1.** Three short lines, handwritten accents on key verbs/nouns. Keep it physical: `build`, `lead`, `ship`. AI sits in the hand font because it's the new beat.
- **"What I'm looking for" card.** This is the conversion. Stay specific about the role (agentic operations) and the work (harnesses, feedback loops, pulling the org up the curve). Don't generalize it into "any AI role."
- **About section.** Three paragraphs, max. Mechanics, then the operations point, then the humans-are-the-fun-part close. Snark goes in the middle paragraph, never the close.
- **Product cards.** 2–4 sentences. What it is, who it's for or how it came to be, one tangible detail.
- **Testimonials.** Verbatim quotes. Do not edit the voice of the person being quoted.

## Style anti-patterns to reject

- "I'm passionate about..."
- "Results-driven"
- "Synergy" / "leverage" / "robust"
- "At the end of the day"
- Listicles with no specifics ("Communication. Empathy. Leadership.")
- Long appositive clauses set off by em dashes (the dashes are banned anyway)
- Ending a section on a complaint or cynicism
- AI hype without a concrete operation behind it

## Build notes (not voice)

- Static HTML, built with Eleventy. No client-side framework: what ships is
  still plain HTML, one stylesheet, and 70 lines of vanilla JS.
- Pages live in `src/` as HTML with JSON front matter. The shared head, header,
  nav, and footer come from `src/_includes/layouts/base.njk`.
- Front matter per page: `title`, `description`, optional `ogTitle` /
  `ogDescription` / `ogType` / `ogPath`, and `nav: "home"` on the index only.
- Output keeps the flat `.html` URLs (`/prove-it-works.html`, not
  `/prove-it-works/`) via the permalink rule in `src/src.json`. Don't change it;
  the existing URLs are linked from outside.
- **Adding an article:** new file in `src/`, then add it to
  `src/_data/articles.json` so it joins the post menu.
- The post menu (`.nav-writing`) is the fenced group of article links in the
  header. It renders on every page, not just the index, so a post can reach its
  siblings. The current post shows as `.nav-current` instead of a link. Only
  real articles belong in `articles.json`; case studies and one-off pages
  (Ordo, the Kill Team alert) stay out of it and just get the back link.
- Styles in `css/site.css`. Tiny vanilla JS in `js/site.js` (year stamp, scroll reveal).
  Those, plus `img/`, `assets/`, and the favicons, pass through from the repo root.
- Fonts: Fraunces (serif), Inter (sans), Caveat (handwritten accents).
- `npm start` serves at :8765 with live reload (or use `.claude/launch.json`).
  `npm run build` writes `_site/`, which is what Netlify publishes.
