# AGM Sales · EXEED CRM — Design System

A **Fluent UI v9** token system themed with the **EXEED brand ramp** (navy · azure · signature cyan), applied as an accented-light theme over a Dynamics 365 workspace. Single source in code: `fluent-tokens.css`.

Use this document to rebuild the system in Figma — one **collection** per section (Color, Spacing, Radius, Elevation, Type), one **variable/style** per row. Font: **Segoe UI** (fallback Inter). Neutrals are true-neutral gray (not blue-tinted).

---

## 1 · Color

### Neutral — backgrounds
| Token | Hex | Use |
|---|---|---|
| `neutral.background.1` | `#FFFFFF` | Surfaces, cards |
| `neutral.background.1Hover` | `#F5F5F5` | Hover |
| `neutral.background.1Pressed` | `#E0E0E0` | Pressed |
| `neutral.background.1Selected` | `#EBEBEB` | Selected |
| `neutral.background.2` | `#FAFAFA` | Subtle raised |
| `neutral.background.3` | `#F5F5F5` | Page canvas, filled inputs |
| `neutral.background.4` | `#F0F0F0` | Insets, input hover |
| `neutral.background.5` | `#EBEBEB` | Disabled fill |
| `neutral.background.6` | `#E6E6E6` | Deepest neutral fill |

### Neutral — foreground (text)
| Token | Hex | Use |
|---|---|---|
| `neutral.foreground.1` | `#242424` | Primary text |
| `neutral.foreground.2` | `#424242` | Secondary text |
| `neutral.foreground.3` | `#616161` | Muted text / labels |
| `neutral.foreground.4` | `#707070` | Faint |
| `neutral.foreground.disabled` | `#BDBDBD` | Disabled |
| `neutral.foreground.onBrand` | `#FFFFFF` | Text on brand fill |

### Neutral — stroke (borders)
| Token | Hex | Use |
|---|---|---|
| `neutral.stroke.1` | `#D1D1D1` | Control border |
| `neutral.stroke.2` | `#E0E0E0` | Default border |
| `neutral.stroke.3` | `#F0F0F0` | Soft divider |
| `neutral.stroke.accessible` | `#616161` | Input bottom accent |

### Brand — EXEED ramp
| Token | Hex | Use |
|---|---|---|
| `brand.background` | `#17293D` | Primary button, active nav, links |
| `brand.backgroundHover` | `#0F1D2C` | Hover / pressed |
| `brand.backgroundPressed` | `#0A141F` | Pressed |
| `brand.backgroundSelected` | `#1E3B52` | Selected |
| `brand.background2` | `#EAEEF3` | Subtle brand tint (active-nav, chips) |
| `brand.background2Hover` | `#DDE5EC` | Tint hover |
| `brand.foreground1` | `#17293D` | Brand text / links |
| `brand.foreground2` | `#0F1D2C` | Stronger brand text |
| `brand.stroke1` | `#17293D` | Brand border |
| `brand.stroke2` | `#98A6B6` | Muted brand border |
| `brand.compound` | `#2A6797` | Input focus underline |
| `brand.navy` | `#00203F` | EXEED deepest navy |
| `brand.azure` | `#2A6797` | EXEED azure |
| `brand.accentCyan` | `#00B7BB` | **Signature cyan** — glows, rings only (fails as white-text fill) |

### Status (semantic — do not rebrand)
| Token | Hex | Meaning |
|---|---|---|
| `status.redForeground` | `#B10E1C` | Text on red-soft |
| `status.redBackground` | `#D13438` | Breached / error |
| `status.redSoft` | `#FDF3F4` | Red fill |
| `status.yellowForeground` | `#8A6420` | Text on yellow-soft |
| `status.yellowBackground` | `#F2B100` | Warning / due soon |
| `status.yellowSoft` | `#FFF9E5` | Amber fill |
| `status.greenForeground` | `#0E700E` | Text on green-soft |
| `status.greenBackground` | `#107C10` | On-track / met / done |
| `status.greenSoft` | `#F1FAF1` | Green fill |
| `status.purpleForeground` | `#5C2E91` | AI / Copilot text |
| `status.purpleSoft` | `#F2EAF8` | Copilot fill |

### Chrome (top bar)
| Token | Hex | Use |
|---|---|---|
| `chrome.start` | `#0A0E14` | Top-bar gradient start |
| `chrome.end` | `#16293C` | Top-bar gradient end |

> Top nav = `linear-gradient(135deg, chrome.start, chrome.end)`.

---

## 2 · Spacing

Horizontal + vertical share the same scale.

| Token | px |
|---|---|
| `spacing.XXS` | 2 |
| `spacing.XS` | 4 |
| `spacing.SNudge` | 6 |
| `spacing.S` | 8 |
| `spacing.MNudge` | 10 |
| `spacing.M` | 12 |
| `spacing.L` | 16 |
| `spacing.XL` | 20 |
| `spacing.XXL` | 24 |
| `spacing.XXXL` | 32 |

---

## 3 · Corner radius

| Token | px | Use |
|---|---|---|
| `radius.none` | 0 | — |
| `radius.small` | 2 | Tiny chips |
| `radius.medium` | 4 | Controls, buttons, inputs, badges |
| `radius.large` | 6 | — |
| `radius.xlarge` | 8 | Cards |
| `radius.circular` | 10000 | Pills, avatars |

---

## 4 · Elevation (shadows)

Light, low-opacity shadows — soft depth, never heavy.

| Token | Value |
|---|---|
| `shadow.2` | `0 1px 2px rgba(0,0,0,.05)` |
| `shadow.4` | `0 2px 4px rgba(0,0,0,.05)` |
| `shadow.8` | `0 4px 8px rgba(0,0,0,.06)` |
| `shadow.16` | `0 8px 16px rgba(0,0,0,.07)` |
| `shadow.28` | `0 14px 28px rgba(0,0,0,.09)` |
| `shadow.64` | `0 24px 48px rgba(0,0,0,.10)` |

Card default = `shadow.2`. Drawers / modals = `shadow.16`.

---

## 5 · Typography

- **Family:** Segoe UI · fallback Inter, system-ui
- **Mono:** Cascadia Code · fallback SF Mono, Consolas (record IDs, phone, VIN)
- **Weights:** Regular 400 · Medium 500 · Semibold 600 · Bold 700

### Type ramp (primitives)
| Size token | px | Line-height token | px |
|---|---|---|---|
| `fontSize.base100` | 10 | `lineHeight.base100` | 14 |
| `fontSize.base200` | 12 | `lineHeight.base200` | 16 |
| `fontSize.base300` | 14 | `lineHeight.base300` | 20 |
| `fontSize.base400` | 16 | `lineHeight.base400` | 22 |
| `fontSize.base500` | 20 | `lineHeight.base500` | 26 |
| `fontSize.base600` | 24 | `lineHeight.base600` | 32 |

### Text styles (composite — create as Figma text styles)
| Style | Font | Weight | Size / LH | Letter-spacing | Usage |
|---|---|---|---|---|---|
| `textStyle.title3` | Segoe UI | 700 | 24 / 32 | -2% | Page / card titles |
| `textStyle.subtitle1` | Segoe UI | 600 | 20 / 26 | -1% | Section headers |
| `textStyle.subtitle2` | Segoe UI | 600 | 16 / 22 | 0 | Card titles |
| `textStyle.bodyStrong` | Segoe UI | 600 | 14 / 20 | 0 | Names, active nav, links |
| `textStyle.body` | Segoe UI | 400 | 14 / 20 | 0 | Default body |
| `textStyle.caption1` | Segoe UI | 400 | 12 / 16 | 0 | Table cells, secondary |
| `textStyle.caption2` | Segoe UI | 600 | 10 / 14 | 4% | UPPERCASE labels, eyebrows |
| `textStyle.monoId` | Cascadia Code | 400 | 12 / 16 | 0 | Record IDs, phone, VIN |

> Letter-spacing in Figma is a percentage: `-0.02em → -2%`, `0.04em → 4%`.

---

## 6 · Component conventions

Recipes that reference the tokens above — build as Figma components with variants.

### Buttons
| Variant | Fill | Text | Border | Radius | Padding |
|---|---|---|---|---|---|
| Primary | `brand.background` (hover `brand.backgroundHover`) | `onBrand` | same as fill | `radius.medium` | 5×12 |
| Subtle | transparent (hover `neutral.background.1Hover`) | `neutral.foreground.2` | none | `radius.medium` | 5×12 |
| Outline | `neutral.background.1` | `neutral.foreground.1` | `neutral.stroke.1` | `radius.medium` | 6×16 |
- Font: `bodyStrong` (14 / 600). No lift on hover, flat fills. Icon-only = 30×30 square.

### Inputs (Fluent "filled")
- Fill `neutral.background.3`; hover `neutral.background.4`; border transparent + bottom `neutral.stroke.accessible`.
- Focus: fill `#FFFFFF`, bottom `2px brand.compound`. Radius `radius.medium`.
- Label above input, muted (`neutral.foreground.2`, 11.5px). Required = red asterisk.
- Lookup fields carry a trailing search icon; date fields a calendar icon.

### Cards
- Fill `neutral.background.1`, border `1px neutral.stroke.3`, radius `radius.xlarge` (8), shadow `shadow.2`.

### Badges / pills
- Radius `radius.medium` (status badges) or `radius.circular` (counts).
- Pairs: green-soft + greenForeground, amber-soft + yellowForeground, red-soft + redBackground, brand.background2 + brand.foreground1.

### Tabs
- Underline style: active = `brand.foreground1` text + 2px bottom border; inactive = `neutral.foreground.2`.

### Avatars
- `radius.circular`, initials in 600 weight, colored gradient fill; optional green presence dot.

---

## 7 · Layout

| Token | px |
|---|---|
| Sidebar (expanded) | 228 |
| Sidebar (icon rail) | 60 |
| Top bar height | 42 |
| Command bar height | 34 |

Dense, space-optimized enterprise grids. Form sections stack full-width; fields flow in a 2-column grid; label on top of input.

---

## 8 · Accessibility notes

- White text on `brand.background` (#17293D) ≈ **11:1** — passes WCAG AAA.
- `brand.accentCyan` (#00B7BB) fails as a white-text fill — use only for glows, rings, borders, small indicators, or behind dark text.
- Keep `status.*` colors tied to meaning (SLA, temperature), never decoration.
- Minimum text size 11px; icon-only controls need an accessible label.

---

### Adding to Figma
1. **Variables:** create collections `Color`, `Spacing`, `Radius`, `Elevation`, `Type` and add one variable per row above (Color as color, Spacing/Radius/Size as number).
2. **Text styles:** create the 8 styles in §5 (load Segoe UI + a mono face first).
3. **Effect styles:** create the 6 shadows in §4.
4. **Components:** build Buttons, Inputs, Cards, Badges, Tabs, Avatar per §6, binding fills/strokes/radii to the variables.

Fastest route: the **Tokens Studio** plugin can import a token file to auto-create variables + text/effect styles.
