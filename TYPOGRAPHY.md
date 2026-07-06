# EXEED — AGM Sales CRM · Typography

Text styles extracted from the CRM UI. Primary typeface **Inter**; record IDs use **SF Mono**.

**Add to Figma:**
- **Tokens Studio plugin** → *Import* `exeed-typography.tokens.json` → *Create text styles from tokens*. Names map to Figma style groups (e.g. `heading/h1` → **Heading / H1**).
- Or create them manually from the table below.

> Load the **Inter** font family in Figma first (weights: Regular 400, Medium 500, Semi Bold 600, Bold 700). `mono/id` needs a monospace face — SF Mono, or substitute *Roboto Mono* / *JetBrains Mono*.

---

## Text styles

| Style | Font | Weight | Size | Line height | Letter spacing | Usage |
|---|---|---|---|---|---|---|
| `display` | Inter | Bold (700) | 28px | 34px | -0.02em | Landing/page title (“Choose your view”) |
| `heading/h1` | Inter | Bold (700) | 24px | 30px | -0.02em | Dashboard greeting, “My Active Leads” |
| `heading/h2` | Inter | Bold (700) | 20px | 26px | -0.02em | Section headers |
| `heading/h3` | Inter | Bold (700) | 18px | 24px | -0.02em | Journey step title |
| `title/card` | Inter | Bold (700) | 15px | 20px | 0 | Modal / role-card titles |
| `title/section` | Inter | Bold (700) | 14px | 20px | 0 | Panel section titles |
| `kpi/value` | Inter | Bold (700) | 24px | 26px | -0.01em | KPI / metric numbers |
| `body/regular` | Inter | Regular (400) | 13px | 20px | 0 | Default body copy |
| `body/medium` | Inter | Medium (500) | 13px | 20px | 0 | Emphasised body |
| `body/semibold` | Inter | Semi Bold (600) | 13px | 20px | 0 | Names, active nav, links |
| `body/small` | Inter | Regular (400) | 12.5px | 18px | 0 | Table cells, secondary text |
| `body/small-semibold` | Inter | Semi Bold (600) | 12.5px | 18px | 0 | Lead name in table row |
| `label/default` | Inter | Medium (500) | 11.5px | 16px | 0 | Buttons, chips, filters |
| `label/strong` | Inter | Semi Bold (600) | 11px | 16px | 0 | Badges, meta labels |
| `eyebrow` | Inter | Semi Bold (600) | 10px | 14px | 0.06em | UPPERCASE — KPI labels, nav groups, “STEP 5 OF 8” |
| `caption` | Inter | Semi Bold (600) | 9.5px | 12px | 0 | Journey step names, KPI sublabels |
| `micro` | Inter | Bold (700) | 8px | 10px | 0.04em | UPPERCASE — tiny status tags |
| `mono/id` | SF Mono | Regular (400) | 10.5px | 14px | 0 | Record IDs (L-2026-04832) |

---

## Notes
- **Uppercase styles** (`eyebrow`, `micro`) apply `text-transform: uppercase` in CSS. Figma text styles don't store case — set the layer text in caps, or apply *Uppercase* via the type panel.
- **Letter spacing** is in `em` (relative). In Figma enter it as a percentage: `-0.02em` → **-2%**, `0.06em` → **6%**, `0.04em` → **4%**.
- Sizes with decimals (12.5, 11.5, 10.5, 9.5) come straight from the build. Round to whole px if your Figma setup prefers integers — the visual difference is negligible.
- Base body is `body/regular` (13/20). The app's CSS line-height is `1.55` → ~20px at 13px.
