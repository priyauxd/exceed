# EXEED — AGM Sales CRM Theme

Design tokens for the AGM Sales / EXEED Dynamics 365 CRM. Derived from the EXEED brand palette (navy + azure + signature cyan), applied as an "accented-light" theme over the D365 workspace.

**Import to Figma:** use `exeed-theme.tokens.json` (W3C DTCG format) — via **Figma → Variables → Import**, or the **Tokens Studio** plugin (*Import → single file*). This `.md` is the human reference; the `.json` is the importable file.

---

## Brand

| Token | Hex | Use |
|---|---|---|
| `color.brand.navy` | `#00203F` | Brand chrome, deepest navy |
| `color.brand.azure` | `#2A6797` | Brand mid-blue |
| `color.brand.cyan` | `#00B7BB` | **Signature accent** — glows, rings, highlights (never as white-text fill) |
| `color.brand.azure-light` | `#BDDDF4` | Soft brand tint |

## Accent (applied theme)

| Token | Hex | Use |
|---|---|---|
| `color.accent.primary` | `#17293D` | Primary — buttons, active nav, links, KPI labels |
| `color.accent.primary-dark` | `#0F1D2C` | Hover / pressed |
| `color.accent.primary-soft` | `#E9EDF2` | Active-nav tint, hovers |
| `color.accent.primary-muted` | `#98A6B6` | Muted accent |
| `color.accent.chrome-start` | `#0A0E14` | Top-bar gradient start (near-black) |
| `color.accent.chrome-end` | `#16293C` | Top-bar gradient end |

> Top nav bar = `linear-gradient(135deg, chrome-start, chrome-end)`.

## Text

| Token | Hex |
|---|---|
| `color.text.ink` | `#2D3340` |
| `color.text.ink-secondary` | `#6B7289` |
| `color.text.ink-muted` | `#9EA3B5` |

## Surface & Border

| Token | Hex |
|---|---|
| `color.surface.bg` | `#F7F8FB` |
| `color.surface.surface` | `#FFFFFF` |
| `color.surface.border` | `#ECEEF4` |
| `color.surface.border-soft` | `#F1F2F7` |

## Neutral (grey scale)

| Token | Hex |
|---|---|
| `color.neutral.10` | `#17181A` |
| `color.neutral.20` | `#333333` |
| `color.neutral.33` | `#555555` |
| `color.neutral.46` | `#767676` |
| `color.neutral.95` | `#F3F3F3` |

## Status (semantic — do not rebrand)

| Token | Hex | Meaning |
|---|---|---|
| `color.status.red` / `red-soft` | `#E76E6E` / `#FDF0F0` | Breached, at-risk, error |
| `color.status.amber` / `amber-soft` | `#E8A84C` / `#FDF6EB` | Warning, due soon |
| `color.status.green` / `green-soft` | `#5CB97F` / `#EDF8F1` | On-track, met, done |
| `color.status.purple` / `purple-soft` | `#8B7BDF` / `#F1EFFC` | Nurture |
| `color.status.teal` / `teal-soft` | `#4FB8A8` / `#ECF8F6` | Contacted |
| `color.status.copilot` | `#5B54D6` | AI / Copilot accent |

---

## Radius

| Token | px |
|---|---|
| `radius.sm` | 8 |
| `radius.md` | 12 |
| `radius.pill` | 20 |

## Size (layout)

| Token | px |
|---|---|
| `size.sidebar` | 228 |
| `size.sidebar-rail` | 60 (collapsed icon rail) |
| `size.topbar` | 42 |

## Typography

- `font family.primary` = **Inter**
- `font family.secondary` = **SF Pro**
- `font size`: 12, 14, 16, 17, 19, 20, 24, 32, 40
- `font weight`: regular 400, medium 500, semibold 600, bold 700

---

## Accessibility notes
- White text on `accent.primary` (`#17293D`) ≈ **11:1** — passes WCAG AAA.
- `brand.cyan` (`#00B7BB`) fails contrast as a white-text fill — use it only for **glows, rings, borders, and small indicators**, or behind dark text.
- Keep `status.*` colors for meaning (SLA/temperature), not decoration.
