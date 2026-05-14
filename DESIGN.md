# Design

> Seed version — generated pre-implementation. Re-run `/impeccable document` after
> the first working prototype to capture real tokens from code.

## Theme

**Mode**: Light
**Scene**: A well-lit molecular biology lab at mid-morning. Warm natural light through
large windows. Lab notebooks open on benches. Clean, purposeful, a little exciting.
Not sterile — lived-in science.

**Strategy**: Committed warm neutrals + muted teal as the single carrying color.
Teal carries 40-50% of interactive surface area. Warm off-white is the canvas ground.
Block colors are distinct by category but muted — biological specimen jars, not neon.

## Colors

All OKLCH. Neutrals tinted warm (slight amber/yellow hue axis ~85).

```css
/* Canvas & surfaces */
--color-canvas:       oklch(96% 0.010 85);   /* warm off-white — main builder bg */
--color-surface:      oklch(99% 0.005 85);   /* near-white panel bg */
--color-surface-2:    oklch(93% 0.012 85);   /* slightly deeper — sidebar, inspector */
--color-border:       oklch(88% 0.015 85);   /* warm divider lines */
--color-border-strong: oklch(78% 0.020 85);  /* visible block outlines */

/* Text */
--color-text-primary:   oklch(24% 0.018 260); /* near-black, slight cool offset */
--color-text-secondary: oklch(52% 0.020 260); /* secondary labels */
--color-text-muted:     oklch(68% 0.015 260); /* placeholder, disabled */

/* Brand teal — primary interactive */
--color-teal-50:   oklch(95% 0.030 195);
--color-teal-100:  oklch(90% 0.055 195);
--color-teal-400:  oklch(72% 0.130 195);
--color-teal-500:  oklch(60% 0.145 195);   /* primary action */
--color-teal-600:  oklch(50% 0.140 195);   /* hover state */
--color-teal-700:  oklch(40% 0.120 195);   /* pressed / active */

/* Status */
--color-success:  oklch(58% 0.160 150);   /* pass — forest green */
--color-warning:  oklch(68% 0.150  75);   /* warn — warm amber */
--color-error:    oklch(55% 0.170  20);   /* fail — soft terracotta */
--color-info:     oklch(60% 0.130 250);   /* info — periwinkle */

/* Block category colors — all at ≤52% lightness for WCAG AA white text contrast (≥4.5:1) */
--block-start:    oklch(48% 0.130 145);   /* deep sage green */
--block-data:     oklch(46% 0.140 250);   /* deep periwinkle */
--block-analysis: oklch(44% 0.150 270);   /* deep lavender */
--block-process:  oklch(50% 0.130  75);   /* deep amber */
--block-report:   oklch(46% 0.145 195);   /* deep teal-cyan */
--block-output:   oklch(46% 0.140 155);   /* deep sage */

/* Block label text: always white — contrast verified ≥4.5:1 against all fills above */
--block-text:     oklch(99% 0.005 85);

/* Mission / gamification */
--color-mission-active:    oklch(68% 0.140 195);
--color-mission-complete:  oklch(62% 0.155 150);
--color-mission-locked:    oklch(75% 0.015 260);
```

## Typography

**Scale strategy**: One family, five sizes, three weights. Hierarchy through scale + weight
contrast (≥1.25 ratio between adjacent steps). Inter carries everything — no display/body split.

```css
/* Single font family — loaded via next/font/google (self-hosted at build time, no FOUT) */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;   /* JSON preview only */

/* 5-step scale — fixed rem, not fluid */
--text-xs:   0.75rem  / 1.4;   /* 12px — badge labels, port labels, step numbers */
--text-sm:   0.875rem / 1.5;   /* 14px — secondary UI, technical concept lines */
--text-base: 1rem     / 1.6;   /* 16px — body, beginner explanations (max 65ch) */
--text-xl:   1.25rem  / 1.4;   /* 20px — inspector block name, panel headings */
--text-2xl:  1.5rem   / 1.3;   /* 24px — mission title */

/* 3-weight palette */
--weight-normal:   400;
--weight-semibold: 600;
--weight-bold:     700;
```

*Removed*: `--font-display` (Plus Jakarta Sans — second family added inconsistency with no payoff
in a product UI), `--text-lg` (collapsed into xl), `--text-3xl` (no hero context in the builder),
`--weight-medium` (semibold covers the gap adequately at this scale).

## Spacing & Layout

### Desktop (≥1280px)

3-region builder layout:
1. Block Library — left, 200px fixed
2. Canvas — flex-1, fills remaining width; mission progress strip pinned to top (48px)
3. Inspector slide-over — 0px when nothing selected; slides in at 300px when a block is clicked

Bottom: Run Panel — full width, 240px collapsed / 380px expanded

The Inspector is NOT a permanent column. It occupies 0 canvas space when idle. Canvas fills
to the right edge. Clicking any block triggers the slide-in.

The Mission Panel is NOT a separate panel. It lives as a 48px strip at the top of the canvas
with: step counter pill + current instruction text + expand chevron. Clicking it opens a
floating card (300px wide, top-left anchored) that shows all steps. Closes on outside click.

### Tablet (768px–1279px)

- Block Library: collapses to a 48px icon rail; tap to open a floating drawer overlay
- Canvas: fills all remaining width between icon rail and right edge
- Inspector: bottom sheet (max 320px tall), triggered by tapping a block; dismissed by tapping elsewhere
- Mission strip: stays at canvas top, 48px, same behavior
- Run Panel: full width at bottom, 200px collapsed / 320px expanded

Touch targets: all interactive controls minimum 44×44px on tablet.

### Breakpoint tokens

```css
--bp-tablet:  768px;
--bp-desktop: 1280px;
```

```css
color-scheme: light;   /* prevent browser dark-mode inversion */

--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-12: 3rem;      /* 48px */

--radius-sm:  0.375rem;  /* 6px — buttons, inputs */
--radius-md:  0.625rem;  /* 10px — cards, panels */
--radius-lg:  0.875rem;  /* 14px — blocks on canvas */
--radius-xl:  1.25rem;   /* 20px — mission panel, run panel */

/* Focus ring — consistent across all interactive elements */
--color-focus-ring:  oklch(60% 0.145 195);   /* teal-500 */
--focus-ring-style:  0 0 0 3px var(--color-focus-ring);
/* Tailwind usage: focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-focus-ring] */
```

## Block Visual Design

Blocks are the primary UI object. They must feel substantial and categorically distinct.

Each block:
- Rounded rectangle (radius-lg)
- Solid fill using block category color (muted, not bright)
- White/near-white block title text
- Category-colored port dots (input left, output right)
- Subtle drop shadow: `0 2px 8px oklch(0% 0 0 / 0.10)`
- Selected state: `ring-2` in teal-500
- Error state: terracotta border + warning icon
- Hover: slight scale-up (1.02) + shadow deepens

Block size on canvas: min 160×72px.

Port dots: 12px visual diameter. Touch/click hit area: 32×32px invisible overlay
(React Flow handle wrapper padded to meet WCAG 2.2 AA 24px minimum; 44×44px on tablet).

## Motion

Minimal. Only purposeful transitions.
- Block drop onto canvas: `scale(0.9) → scale(1)`, 200ms, ease-out-quart
- Simulation trace items: stagger-in, 60ms between items, 180ms each, ease-out-quint
- Inspector panel: 180ms slide-in from right, ease-out-quart
- Run panel expand: 200ms height transition, ease-out-quart
- All transitions disabled under `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  Tailwind equivalent: use `motion-safe:` prefix on all animation/transition utilities.

No bounce. No elastic. No decorative particle effects.

## Component Patterns

### Block Library Card (draggable)
- Full width, 48px tall
- 6px color chip on left edge (block category color)
- Block display name: text-sm, weight-semibold
- No category tag — cards are already grouped under category section headings

*Removed*: redundant category tag. The section heading already provides that context.

### Canvas Block Node (React Flow custom node)
- See Block Visual Design above
- Port handles: circle, 12px visual / 32px hit area (44px on tablet)
- Block name: text-sm, white, weight-semibold
- Block icon: emoji or lucide icon, 18px

### Inspector Slide-over
- Appears at 300px wide from the right edge; canvas shrinks to accommodate
- Block name: text-xl, weight-bold, teal-500
- Technical concept: text-sm, text-muted, shown always (no toggle)
  Format: `nf-core concept: [concept name]` — one quiet line below the name
- Beginner explanation: text-base, normal weight, max 65ch
- Common mistake: text-sm, warning-color background at 8% opacity, no left stripe
- Dismiss: click outside or press Escape; canvas expands back to full width

*Removed*: technical toggle interaction. Both the beginner explanation and technical concept
are always visible — the concept line is visually quiet (muted, small) so it doesn't
overwhelm beginner mode, but it's always present for curious learners.

### Run Panel — Two States

**Idle state** (before simulate): Single prominent "Simulate" button in the panel center.
No tabs, no empty state copy, no structure. Just the action.

**Active state** (after simulate): Trace entries appear in a scrollable list. Report Card
appears inline at the top of the trace if simulation completed. JSON toggle at the bottom
of the panel (text-sm link: "View workflow JSON ↓") expands an inline JSON block — not a tab.

No tab bar. The learner never navigates between views during the learning moment.

*Removed*: 3-tab structure (Trace / Report / JSON). Report Card is inline in the trace.
JSON is a toggle, not a tab. One fewer navigation decision at the most critical moment.

### Trace Entry
- Step number: text-xs, muted, monospace, right-aligned in a 24px column
- Message: text-sm, weight-semibold, then text-base normal for detail if present
- Status indicator: filled circle (12px) in success/warning/error color + icon (no color-only)
- Stagger-in animation: 60ms between items, 180ms each, ease-out-quint

### Mission Strip (canvas top, 48px)
- Full canvas width, surface-2 background, 1px bottom border
- Left: teal step pill (e.g. "Step 2 of 6") + instruction text (text-sm, truncated)
- Right: expand chevron button (44×44px touch target)
- Expands to a floating card (300px wide, anchored top-left of canvas), dismissed on outside click

### Report Card (inline in trace)
- Appears above trace entries after successful simulation
- 4px top border in success/warn/fail color (no left stripe)
- Status badge: solid fill, white text, text-xs
- Summary: text-base, one sentence
- Sample rows: text-sm, alternating surface rows, no card wrapper
