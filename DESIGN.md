---
name: johnf.build
description: A hand-built personal site — cream desk, white objects, marker handwriting.
colors:
  cream: "#fffff0"
  cream-2: "#fdf6dc"
  surface: "#ffffff"
  teal: "#218da6"
  teal-deep: "#166073"
  coral: "#f56358"
  coral-deep: "#c0392b"
  peach: "#feb2ad"
  ink: "#2a2326"
  ink-soft: "#5a4f53"
  paper-line: "#e6d9b8"
typography:
  display:
    fontFamily: "Fraunces, Georgia, \"Iowan Old Style\", serif"
    fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, \"Iowan Old Style\", serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fraunces, Georgia, \"Iowan Old Style\", serif"
    fontSize: "clamp(1.2rem, 1.6vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Inter, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "clamp(1rem, 0.5vw + 0.9rem, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    letterSpacing: "0.01em"
  accent:
    fontFamily: "Caveat, \"Bradley Hand\", cursive"
    fontSize: "clamp(1.3rem, 1.8vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  photo: "3px"
  card: "14px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 3vw, 2rem)"
  rhythm: "clamp(1rem, 1.5vw, 1.5rem)"
components:
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.1rem 1.2rem 1.3rem"
  cta-link:
    textColor: "{colors.teal-deep}"
    typography: "{typography.label}"
  tech-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.85rem"
  looking-for-callout:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.4rem 1.6rem"
---

# Design System: johnf.build

## 1. Overview

**Creative North Star: "The Builder's Scrapbook"**

This is a personal site that looks like it was assembled by hand on a desk, not
generated in a browser. Everything sits on a single sheet of Legal-Pad Cream
(#fffff0). White objects (product cards, polaroids, a taped-up portrait, an
index-card callout) rest on top of that cream, each casting a soft real shadow
and tilted a degree or two off-square. The headings are set in Fraunces, the
body in Inter, and the asides are scrawled in Caveat marker. Section breaks are
dashed notebook rules. The effect is candid and warm: a smart builder's
workbench, photographed from above.

It is built to carry a specific voice (candid, friendly, snarky, optimistic) so
the craft must never sand that voice down into corporate polish. The system
explicitly rejects the **generic AI landing page**: the warm-cream-plus-tracked-
uppercase-eyebrow-plus-identical-icon-cards-plus-gradient-text template that
floods 2026. Warmth here comes from handwriting, tape, and photographs, never
from a default tinted gradient. There are no filled buttons, no eyebrow kickers,
and no em dashes anywhere.

Density is comfortable and unhurried: one idea per band, generous fluid spacing,
a 62ch measure on body copy. Motion is quiet and physical (objects straighten on
hover, sections fade up once on scroll), and it always yields to
`prefers-reduced-motion`.

**Key Characteristics:**
- Cream desk, white objects, marker handwriting.
- Three fonts, three jobs: Fraunces thinks, Inter talks, Caveat winks.
- Soft two-layer shadows plus a 1–2° tilt that straightens on hover.
- Hand-drawn coral underlines, washi tape, polaroid frames.
- Dashed notebook-paper dividers between everything.
- Text-link CTAs with directional arrows. Zero filled buttons.
- No eyebrow kickers, no gradient text, no em dashes.

## 2. Colors

A warm, low-tech palette: cream paper, two whites of ink (teal and coral), and a
soft graphite for body text. Saturation is rationed; the page stays calm so the
handwriting and photos pop.

### Primary
- **Workshop Teal** (`#218da6`) and **Deep Workshop Teal** (`#166073`): the
  considered, technical voice. Deep teal carries every link, the script eyebrow,
  the big serif stat numbers, the `jf` mark, the CTA arrows, and the signature.
  The brighter `#218da6` is the hover/edge tone (chip borders, the card's inset
  hairline). Teal is the color of the person who builds things on purpose.

### Secondary
- **Marker Coral** (`#f56358`): the wink. Used for flourishes only — the star
  badge, washi tape, the hand-drawn h2 underline, large Caveat asides, the
  `lead` accent in the h1. Rare and warm; it is never the workhorse.
- **Deep Marker Coral** (`#c0392b`): the same wink at body-text size. Whenever
  coral must appear as small text (the product card category tags), it deepens
  to this so it clears WCAG AA. See **The Two-Coral Rule**.

### Tertiary
- **Faded Peach** (`#feb2ad`): the lightest touch. The growing underline behind
  every link, and the oversized quotation mark on testimonials.

### Neutral
- **Legal-Pad Cream** (`#fffff0`): the page. The desk everything rests on.
- **Manila Cream** (`#fdf6dc`): the footer and the placeholder behind loading
  images; a half-step warmer than the page.
- **Card Stock White** (`#ffffff`): reserved for objects that sit ON the desk —
  cards, photos, chips, the callout. Never the page.
- **Pencil Ink** (`#2a2326`): body text and headings. A warm near-black, never
  pure `#000`.
- **Soft Graphite** (`#5a4f53`): muted text — ledes, captions, labels, meta.
  Holds ~7.8:1 on cream, so it stays readable; this is not decorative light gray.
- **Ruled Line** (`#e6d9b8`): the dashed notebook rule between sections and down
  the side of margin notes.

### Named Rules
**The One-Desk Rule.** The page background is always Legal-Pad Cream. Card Stock
White is reserved for objects resting on the desk. Never flip them: no white page
sections, no cream cards.

**The Two-Coral Rule.** Marker Coral `#f56358` is for flourishes and Caveat text
at ~18px and up. The moment coral becomes body-size text on white or cream, it
must deepen to `#c0392b`; bright coral fails AA below large-text size. Its rarity
is the point either way: coral is the wink, not the voice.

## 3. Typography

**Display / Heading Font:** Fraunces (with Georgia, "Iowan Old Style" fallback)
**Body Font:** Inter (with system-ui, -apple-system, "Segoe UI" fallback)
**Accent / Handwriting Font:** Caveat (with "Bradley Hand" fallback)

**Character:** A three-way pairing on a hard contrast axis: a characterful
optical serif for thinking, a neutral humanist sans for talking, and a casual
script for the margins. The contrast is the system; the three never trade jobs.

### Hierarchy
- **Display** (Fraunces 700, `clamp(2.4rem, 5.5vw, 4.5rem)`, line-height 1.15,
  letter-spacing −0.02em): the h1 only. Set in three short lines with key
  verbs/nouns (`build`, `lead`, `ship`, `AI`) swapped into Caveat accents.
- **Headline** (Fraunces 600, `clamp(1.8rem, 3.2vw, 2.6rem)`, −0.01em): section
  h2s. Each wears a hand-drawn coral underline (see the rule below).
- **Title** (Fraunces 600, `clamp(1.2rem, 1.6vw, 1.45rem)`): card/product h3s.
- **Body** (Inter 400, `clamp(1rem, 0.5vw + 0.9rem, 1.125rem)`, line-height
  1.65): paragraphs. Capped at a 62ch measure. `text-wrap: pretty` for orphans.
- **Label** (Inter 500, `0.9rem`, +0.01em): tech chips, meta, captions.
- **Accent** (Caveat 700, `clamp(1.3rem, 1.8vw, 2rem)`): eyebrows, margin notes,
  photo captions, the footer signature, the "all in" stat. Marginalia only.

### Named Rules
**The Three-Hands Rule.** Fraunces thinks, Inter talks, Caveat winks. Each font
has exactly one job. Caveat never sets body copy; Inter never sets a headline;
Fraunces never scrawls a margin note.

**The Marker-Underline Rule.** Every h2 wears a hand-drawn coral squiggle behind
it (an inline SVG `::after`, ~0.55 opacity), never a straight 1px rule. The
imperfection is deliberate.

## 4. Elevation

The system is **lifted paper**: depth is physical placement, not UI elevation.
Every white object rests on the cream desk with a two-layer shadow (a tight
near-contact shadow plus a soft ambient drop), sits at a slight rotation, and
straightens (and sometimes scales up a hair) on hover. There is no flat tonal
layering and no heavy directional shadow; the light is soft and from above. The
one piece of intentional glass is the sticky header (translucent cream +
`backdrop-filter: blur`), which carries the nav-bar honeycomb texture.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(42,35,38,0.18)`): product cards and quote cards at rest.
- **Card hover** (`box-shadow: 0 2px 4px rgba(0,0,0,0.06), 0 16px 32px -12px rgba(42,35,38,0.22)`): the same cards lifted on hover, paired with `translateY(-3px)`.
- **Callout** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 14px 30px -18px rgba(42,35,38,0.25)`): the "What I'm looking for" index card; the deepest ambient drop, because it is the conversion.
- **Polaroid** (`box-shadow: 0 1px 1px rgba(0,0,0,0.04), 0 6px 18px rgba(42,35,38,0.12)`): framed team photos.
- **Portrait** (`box-shadow: 0 1px 1px rgba(0,0,0,0.05), 0 10px 26px rgba(42,35,38,0.16)`): the taped-up hero selfie.

### Named Rules
**The Lifted-Paper Rule.** A new surface earns a two-layer soft shadow and a 1–2°
tilt that straightens on hover. Depth is always "a physical object on a desk,"
never a flat Material elevation. Keep tilt under ~2.5°; past that it reads gimmicky.

## 5. Components

Every component is **hand-placed, not engineered**: tactile, slightly rotated,
imperfect on purpose. Containers are taped frames and index cards, not rigid UI
boxes. Transitions are short (0.15–0.3s) and ease out.

### Buttons
- **Shape:** there are none. The site ships zero filled buttons.
- **CTA links:** text only, Deep Workshop Teal (`#166073`), Inter 600, with a
  directional arrow — `↗` for external, `→` for internal/forward, `←` for back.
- **Hover / Focus:** the shared link underline (a Faded Peach gradient) grows
  from a 0.18em sliver to ~80% height; text shifts toward Pencil Ink. Focus uses
  a 2px dashed teal outline, offset 3px.

### Chips (tech list)
- **Style:** Card Stock White pill (`border-radius: 999px`), 1px Ruled-Line
  border, Inter 500 at 0.9rem, Pencil Ink text.
- **State:** alternating ±1° tilt via `nth-child`; border shifts to Workshop Teal
  on hover. Filter/selected variants are not used.

### Cards / Containers
- **Corner Style:** 14px (`--radius`) on product and quote cards.
- **Background:** Card Stock White on the cream page.
- **Shadow Strategy:** Card rest → Card hover (see Elevation).
- **Border:** product cards carry a 1px inset Workshop-Teal hairline at 12%
  opacity (a `::before` overlay), never a one-sided stripe.
- **Internal Padding:** `1.1rem 1.2rem 1.3rem` on the card body.

### Navigation
- **Style:** sticky translucent-cream header with `backdrop-filter: blur(6px)`
  and a faint teal honeycomb hex texture; 1px dashed Ruled-Line bottom border.
- **Links:** Inter 500, 0.95rem, the shared peach growing underline on hover.
- **Mark:** a rotated Caveat `jf` with a coral dot, top-left.

### Quote (testimonial)
- **Style:** Card Stock White card, 14px corners, an oversized Faded-Peach
  Fraunces quotation mark bleeding off the top-left, Fraunces 500 blockquote,
  italic Soft-Graphite attribution. Alternating ±0.3° tilt.

### "What I'm Looking For" Callout (signature)
The conversion surface. A Card Stock White index card tilted −0.4°, a full 1.5px
Marker-Coral border at 40% opacity, the deepest ambient shadow, and a coral
circular **★** badge pinned to the top-left corner. A Caveat label over Pencil-Ink
body. This is the one element allowed to shout, quietly.

### Polaroid
A Card Stock White frame (`padding: 0.9rem 0.9rem 1.4rem`) around a 4:3 image,
tilted ±2°, with a Caveat caption beneath. Straightens and scales 1.015 on hover.
A `--wide` variant widens the frame for single hero shots.

## 6. Do's and Don'ts

### Do:
- **Do** keep the page on Legal-Pad Cream (`#fffff0`) and float Card Stock White
  (`#ffffff`) objects on it. (The One-Desk Rule.)
- **Do** give every new surface a two-layer soft shadow and a 1–2° tilt that
  straightens on hover.
- **Do** underline each h2 with the hand-drawn coral SVG squiggle, never a
  straight rule.
- **Do** keep fonts in their lanes: Fraunces headings, Inter body, Caveat
  marginalia. (The Three-Hands Rule.)
- **Do** separate sections and margin notes with a 1px dashed Ruled-Line
  (`#e6d9b8`).
- **Do** deepen coral to `#c0392b` for any coral text under ~18px. (The
  Two-Coral Rule.)
- **Do** write captions and alt text in John's voice — "That's me, smiling way
  too hard." is part of the design.
- **Do** honor `prefers-reduced-motion`: reveal-on-scroll and hover transforms
  must collapse to instant.

### Don't:
- **Don't** build the **generic AI landing page**: warm cream bg + tiny tracked
  uppercase eyebrows over every section + identical icon-heading-text cards +
  gradient text. This is the explicit anti-reference.
- **Don't** use **em dashes** — anywhere, in copy or as a layout device. Periods,
  parentheses, colons, or a restructured sentence instead.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent
  stripe. Use a full border, a star badge, or the dashed paper rule.
- **Don't** use gradient text (`background-clip: text`). Emphasis is weight, the
  marker underline, or coral, never a gradient.
- **Don't** put Marker Coral `#f56358` on white or cream at body size; it fails
  AA. Deepen it.
- **Don't** add a filled button. CTAs are text links with arrows. (The No-Button
  Rule.)
- **Don't** reach for glassmorphism beyond the one deliberate place it lives (the
  sticky header).
- **Don't** straighten everything to a rigid grid, and don't over-rotate past
  ~2.5°. The slight imperfection is the craft; the gimmick is the failure.
