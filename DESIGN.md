# hospitality-operations-platform — design direction

## What this is

Two surfaces from one codebase: a public site that introduces a private accommodation to a guest who has not booked yet, and an admin PMS that a homestay operator runs a property from every day.

## Direction

Quiet editorial. The public pages read like a printed property booklet: one large serif line, generous margins, a single photograph carrying the colour, and body copy that explains rather than sells. The admin follows the same voice at lower volume, because the operator works in it for an hour at a time and decoration costs attention.

The reference point is a Japanese business card: paper stock, one ink, one accent, everything deliberate about where the whitespace sits. Not a hotel booking engine, not a SaaS dashboard.

The public site carries no testimonials, no logo cloud, no statistics strip. The platform sells the operation, so the proof is the product, and a property fact appears only when the owner has verified it.

## Palette

| token | value | use |
|---|---|---|
| `--color-ivory` | `#f3efe8` | page ground, 12.33:1 against charcoal |
| `--color-paper` | `#fbfaf7` | raised panels, 13.54:1 against charcoal |
| `--color-charcoal` | `#2d2b27` | body text and inverted blocks |
| `--color-ink-soft` | `#615a51` | secondary text, 5.93:1 on ivory, 6.51:1 on paper |
| `--color-umber` | `#785b46` | eyebrow labels and kickers, 5.42:1 on ivory |
| `--color-olive` | `#66705c` | the one accent: focus rings, active state, links |
| `--color-warm-sand` | `#d9ccba` | inverse kickers only, 8.95:1 on charcoal |
| `--color-line` | `#cec2b4` | hairlines and borders, non-text, 1.68:1 on paper |

Three core colours (ivory, paper, charcoal) plus one accent (olive). Warm sand is a tint of the paper family used only on charcoal, never as type on a light ground. `--color-taupe` is 2.68:1 on ivory, so it is restricted to decorative marks that carry no text.

Every colour in the code comes from `app/globals.css`. A literal hex in a component is a bug; the few that survive are shadows and status tints, and each is named below.

## Type

- Display: Cormorant Garamond, chosen because a property introduction wants the register of a printed booklet and a high-contrast serif does that without ornament. Used for h1 and section headings, `clamp(3.75rem, 9vw, 8.2rem)` down to `text-3xl`.
- Body: Manrope, chosen for a flat, low-contrast sans that stays legible at 14px in dense admin tables where Cormorant would fall apart. Used for everything that is not a heading.
- Scale: 9px one-word dock labels (`text-[0.56rem]` under the admin dock icons), 10px uppercase admin labels, 11px kickers (`.kicker` at 0.68rem), 13px meta, 14px body in admin, 16px body on public pages, 18px lead. 9px is the floor and only for a single word centred under a 56px icon; nothing else goes below 10px.

## Dial

```
public:  ENERGY 3   RHYTHM 3   MOTION 2
admin:   ENERGY 1   RHYTHM 1   MOTION 1
welcome: ENERGY 2   RHYTHM 1   MOTION 1
```

Public ENERGY 3 because the hero is full-bleed with a 100dvh photograph and a display line at 8rem. RHYTHM 3 because the sections do not repeat a shape: full-bleed hero, then an asymmetric two-column introduction, then a stacked collection rail, then a numbered ritual list, then a contact block. MOTION 2 because there is scroll reveal and a hero entrance, both in `app/scroll-effects.css` behind `prefers-reduced-motion: no-preference`.

Admin ENERGY 1 / RHYTHM 1 / MOTION 1: a uniform grid of panels, one shape per page, hover and focus only. An operator scanning a reservation table does not want a scroll reveal between them and the row they came for.

## Motion

Public: a hero entrance (`hero-copy-intro`, 850ms) and viewport reveal (`scroll-reveal`, `scroll-media`, `scroll-list-item`, `scroll-parallax-bg`), all inside `@media (prefers-reduced-motion: no-preference)`. The sticky ritual stack also needs `no-preference`. Reduce turns every duration to 1ms rather than removing the animation, so layout does not jump.

Admin and welcome: hover, focus, and `:active` translate only. No entrance animation, no parallax, no scroll listener.

## Allowed

- A full-bleed 100dvh hero on the public home page, because the photograph is the property.
- A paper texture at 3.5% opacity over the whole page (`body::before`), because the direction is printed matter and flat screens read as screens.
- A serif display line set as large as the viewport allows, because a property name is the one thing worth that size.
- Asymmetric section rhythm on public pages: alternating full-bleed and inset, differing heights per section.
- Dense 10px uppercase labels in admin tables, because the operator scans columns and 14px labels would halve the rows per screen.

## Forbidden

- Fabricated social proof: no testimonial, logo cloud, statistic, rating or review count unless it comes from a real PMS row the owner entered.
- Property facts from anywhere but `PRIMARY_PROPERTY_*` verified values or an active PMS record. No invented address, capacity, price, travel time, or coordinate.
- A dead control on any surface. No `href="#"`, no button without a handler, no `cursor-pointer` div standing in for a link.
- Decorative gradient behind content that is not doing hierarchy work. The hero scrim is allowed: it exists to hold text contrast over the photograph.
- Em dash in shipped copy.
- Emoji in UI text or code comments.
- A theme toggle. The product ships one light theme on purpose; a half-built dark mode is worse than none.
- Marketing scroll effects on operational forms.
- Text below 9px.

## Where it lives

`app/globals.css` holds the `@theme` palette, the type utilities (`.kicker`, `.page-shell`, `.content-inset`, `.section-pad`), `.cta-solid` and `.cta-outline`, and the `:focus-visible` ring. `app/scroll-effects.css` holds public motion. `app/shell-navigation.css` holds the header, admin sidebar, and both mobile docks, with their safe-area insets. `app/presentation.css` and `app/welcome.css` hold the TV and guest surfaces. Fonts are loaded in `app/layout.tsx`.
