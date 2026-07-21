# Call Center Manager Dashboard — Lovable Build Spec

A complete, self-contained specification to (re)build the **AGM Sales · EXEED CRM — Call Center Manager** dashboard in **Lovable**. Paste this whole file into a Lovable project (as the initial prompt, or add it as a Knowledge file and reference it) to generate the screen with matching content, layout, data, and interactions.

> **Stack target:** React + Vite + TypeScript + Tailwind CSS. Charts as inline SVG (no chart lib required) or Recharts if preferred. Icons: Material Symbols Outlined. Font: **Segoe UI** (fallback Inter).
> **Design language:** Microsoft Fluent UI v9 tokens themed with the EXEED brand ramp — an accented-light theme over a Dynamics 365-style workspace. Dense, professional, neutral grays (not blue-tinted).

---

## 1. How to use in Lovable

1. New Lovable project → paste **Section 12 (Build Prompt)** as your first message. It references everything below.
2. Or: add this file under **Knowledge**, then prompt: *"Build the Call Center Manager dashboard exactly per the spec in the knowledge file, including the KPI drill-down drawer."*
3. Keep all numbers/labels **verbatim** — this is a fixed mockup with dummy (non-real) data.

---

## 2. Design tokens

Centralize as CSS variables / Tailwind theme extension. Single source of truth.

### Color
| Token | Hex | Use |
|---|---|---|
| `bg` | `#f5f5f5` | App background |
| `surface` | `#ffffff` | Cards / panels |
| `surface-warm` | `#fefdfb` | Subtle warm surface |
| `ink` | `#242424` | Primary text |
| `ink-secondary` | `#424242` | Secondary text |
| `ink-muted` | `#616161` | Muted labels |
| `border` | `#e0e0e0` | Card / table borders |
| `border-soft` | `#f0f0f0` | Hairlines |
| `blue` (brand navy) | `#17293d` | Topbar, section dots, headings |
| `blue-soft` | `#e9edf2` | Active nav, hover |
| `blue-muted` | `#98a6b6` | Disabled/among navy |
| `accent-blue` | `#2f6fe0` | **Metric drawer** accents, charts, links |
| `accent-blue-grad` | `linear-gradient(135deg,#2f74e6,#2a5fc8)` | Drawer header |
| `red` / `red-soft` | `#e76e6e` / `#fdf0f0` | Breach, danger, Bottom-3 box |
| `amber` / `amber-soft` | `#e8a84c` / `#fdf6eb` | Warning, Due Soon |
| `green` / `green-soft` | `#5cb97f` / `#edf8f1` | On Track, Top-3 box |
| `purple` / `purple-soft` | `#8b7bdf` / `#f1effc` | Returned status |
| `teal` / `teal-soft` | `#4fb8a8` / `#ecf8f6` | Live/AHT accents |

### Layout / shape / type
| Token | Value |
|---|---|
| `sidebar-w` | `228px` |
| `topbar-h` | `42px` |
| `radius` | `12px` |
| `radius-sm` | `8px` |
| Font family | `'Segoe UI', 'Inter', system-ui, sans-serif` |
| Base font-size | `13px`, line-height `1.55` |
| Icon font | Material Symbols Outlined |

---

## 3. Global chrome

- **Topbar** (fixed, `topbar-h`, dark gradient `linear-gradient(135deg,#0a0e14,#16293c)`, white text): waffle menu · "AGM Sales EXEED CRM" app name · center search · right cluster: notifications bell (badge count), Copilot button, user avatar. z-index 20.
- **Sidebar** (fixed left, `sidebar-w`, collapsible to a rail via `toggleSidebar()`):
  - Brand: "A" logo tile + "AGM Sales / EXEED CRM".
  - Nav: **Home**, **Dashboard** · group **Call Center**: Call Center Dashboard, Today's Leads, Follow-ups, **Call Center Manager** *(active)* · group **Sales** (Sales Executive, etc.).
- **Notifications dropdown** (bell): list of items with dot (unread), icon (danger/warn/info/success), title, text, time + action link, dismiss ✕. "Mark all read" + "View all notifications". Bell badge updates live.
- **Copilot** overlay toggle (right-side assistant), stub is fine.

---

## 4. Page header (greeting)

- **H1:** `Good afternoon, Eman 👋` (waving-hand animates once).
- **Sub:** `30 Jun 2026 · 18 not actioned · 8 agents on shift` (18 in red, 8 in green).
- **Right controls:**
  - `Scope: Call Centre-owned leads ▾` button (tune icon).
  - `KPI definitions` soft button (menu_book icon).
  - **Date range** segmented control: `Today` *(active)* · `This Week` · `This Month` · `Custom Range`. Custom opens a From/To date picker + Apply; applying sets the tab label to the chosen range.
  - **Refresh** icon button — spins 360° on click, sets title to "Last refreshed HH:MM".

---

## 5. SLA legend + Manager Next Best Action + Stream filter

**SLA legend** (pills with colored dots): `On Track` (green) · `Due Soon` (amber) · `SLA Breached` (red) · `SLA Overdue` (red) · note: *"SLA logic pending final alignment (Chaitanya / George)."*

**Manager Next Best Action** (highlighted callout, balance icon):
- Eyebrow: `Manager Next Best Action`
- Head: `Balance Lina Osman's workload — reassign 5 leads`
- Sub: `Lina has 25 assigned, 8 not actioned, 4 SLA breaches. Farhan Aslam and Ivan Petrov are available. · SLA impact in 15 min`
- Right: link `Message Lina` + primary button `Balance workload ›`

**Stream filter** (segmented tabs, toggles which stream section shows):
- `Sales` **21** *(active)* · `Aftersales` **4**

---

## 6. KPI sections (three)

Section header pattern: colored dot + title + muted subtitle. Cards in a responsive grid. Two card types:
- **metric-card**: rounded icon (colored soft bg), label, big value, sub-line.
- **dial-card**: label, **semicircle gauge** (SVG arc, value % rendered inside/near the arc, gradient stroke), sub-line.

### 6.1 SLA Performance · *"Team-wide SLA compliance vs targets"* (dot: amber)
Grid of 5. **The four marked ⇢ are CLICKABLE → open the drill-down drawer (Section 8).**

| Card | Type | Value | Sub | Drawer id |
|---|---|---|---|---|
| Customer 1st Contact ⇢ | dial | **88%** | Target 95% | `firstContact` |
| Assigned to Showroom ⇢ | dial | **91%** | Target 95% | `assignSA` |
| Open Leads > 3 Days | metric (red) | **3** | Target <3 days · 95% | — |
| Return Rate ⇢ | dial | **8%** | Leads bounced back | `returnRate` |
| Qual Completion ⇢ | dial | **82%** | of connected calls | `qualCompletion` |

Clickable cards: `cursor:pointer`, hover elevation, `role="button"`, `tabindex=0`, open on click **and** Enter/Space.

### 6.2 Volumetrics · *"What the team owes right now"* (dot: navy blue)
Grid of 8 metric-cards:

| Icon | Label | Value | Sub |
|---|---|---|---|
| group (blue) | Leads Assigned | 21 | Call Centre-owned |
| warning (red) | Not Actioned | **18** (red) | Sorted by SLA |
| schedule (amber) | Callbacks Due | 12 | 5 overdue |
| check_circle (green) | Contact | **4** (green) | 100% qualified |
| undo (amber) | Returned by Sales | 4 | Coach & fix |
| timer (teal) | Avg Handle Time | 4m 32s | Across all agents |
| groups (blue) | Agents on Shift | 8 | 4 on track |
| person_off (blue) | Lost CC Leads | 2 | Separate view |

### 6.3 Live Calls · SE Availability · Training · *"Real-time signals for the CC floor"* (dot: teal)
Grid of 7 (6 metric-cards + 1 dial):

| Icon | Label | Value | Sub |
|---|---|---|---|
| call (green) | Live Calls Now | **1** (green) | Actively connected |
| phone_missed (amber) | Missed Inbound Calls | **1** (amber) | Today · callbacks queued |
| call_end (red) | Calls Declined | **1** (red) | Today · with reason logged |
| person_check (green) | Agents Available | **3** (green) | 3 unavailable |
| person_off (amber) | Agents Unavailable | 3 | Break · TD · Delivery · Offline |
| school (amber) | Training Overdue | **5** (amber) | Modules pending / failed |
| *(dial)* | Training Completed | **40%** | 4 / 10 modules |

---

## 7. Lead source mix + tables

### 7.1 Lead source mix (card)
Head: `Lead source mix · 21 leads in scope`. Caption about scope. Horizontal bars (label · track · value):
| Source | Bar color | Value |
|---|---|---|
| Website | blue | 1 · 5% |
| Toll-free | green | 15 · 71% |
| WhatsApp | green | 0 · 0% |
| Social | purple | 5 · 24% |
| Walk-in / Other | orange | 0 · 0% |

### 7.2 Table tabs + agents table
- Tabs: `Agents (8)` *(active)* · `Workload` · `Lead queue (21)`.
- Expandable note: *"Agent status logic — how each status is triggered — click to expand"* (info icon).
- Panel head: `Agents` · `8 on shift · sorted by SLA risk`.
- **Columns:** Agent (name + shift) · Assigned · Not Act. · Callback · Contact · Returned · SLA Brk · AHT · Quality · Status · Next Manager Action · Actions.
- **Status badges:** On Track (green) · Due Soon (amber) · Blocked (blue) · SLA Breached (red) · Returned (purple). Urgent rows tinted.

| Agent | Shift | Asg | NotAct | CB | Ct | Ret | SLA | AHT | Qual | Status | Next Manager Action | Action btn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rahul Krishnan | 08:00–17:00 | 22 | 7 | 3 | 4 | 2 | 3 | 4m 42s | 72 | SLA Breached | Reassign 3 leads + coach | Reassign + coach (red) |
| Lina Osman | 10:00–19:00 | 25 | 8 | 4 | 2 | 1 | 4 | 5m 30s | 78 | Blocked | Reassign 5 leads | Reassign 5 |
| Mohammed Zaid | 09:00–18:00 | 19 | 3 | 2 | 3 | 4 | 1 | 3m 12s | 65 | Returned | Quality review | Review quality |
| Aisha Hussein | 11:00–20:00 | 17 | 5 | 2 | 2 | 2 | 2 | 5m 55s | 70 | Due Soon | 1:1 coaching | Add coaching note (ghost) |
| Nadia Al Suwaidi | 08:00–17:00 | 18 | 1 | 2 | 6 | 0 | 0 | 4m 05s | 92 | On Track | None | View queue (ghost) |
| Priya Nair | 09:00–18:00 | 16 | 2 | 3 | 5 | 1 | 0 | 3m 58s | 88 | On Track | None | View queue (ghost) |
| Farhan Aslam | 10:00–19:00 | 14 | 1 | 1 | 5 | 0 | 0 | 4m 20s | 90 | On Track | None | View queue (ghost) |
| Ivan Petrov | 13:00–22:00 | 13 | 2 | 2 | 4 | 1 | 0 | 4m 12s | 85 | On Track | None | View queue (ghost) |

Quality color: ≥85 green, 70–84 amber, <70 red.

### 7.3 Aftersales stream (shown when Aftersales tab active)
Head: `Aftersales requests` · `Separate SLA · never counted with Sales`. Columns: Ticket · Customer · Type · Agent · Age · SLA · Next Action.

| Ticket | Customer | Type | Agent | Age | SLA | Next Action |
|---|---|---|---|---|---|---|
| AS-3001 | Ravi Kumar | Service booking | Nadia Al Suwaidi | 20m | On Track | Confirm slot › |
| AS-3002 | Marwa El Sayed | Complaint | Aisha Hussein | 240m | SLA Breached | Escalate to service manager › |
| AS-3003 | Simon Wu | Parts enquiry | Farhan Aslam | 90m | Due Soon | Send parts availability › |
| AS-3004 | Amina Yousef | Warranty | Ivan Petrov | 45m | On Track | Collect proof of purchase › |

---

## 8. KPI drill-down drawer (the interactive detail view)

Clicking a ⇢ KPI card opens a **right-side slide-in drawer** (width 600px, max 94vw) over a dim backdrop. Close via ✕, backdrop click, or **Escape**.

### Drawer anatomy (top → bottom)
1. **Header** — bright-blue gradient (`accent-blue-grad`), white text:
   - Eyebrow (uppercase): metric **kind** — `SLA METRIC` or `QUALITY METRIC` (or `CONVERSION METRIC`).
   - Title (e.g. *First Contact SLA*).
   - Subtitle (e.g. *% of interactions handled within SLA window.*).
   - Top-right KPI block: big **value %**, `Target N%` + **delta chip** (`▾ -3pp` red when worse, `▲ +2pp` green when better — delta = month-over-month change, not vs target), `Period: This Month`.
   - ✕ close button.
2. **Toolbar** — `⧩ Break down by [Branch ▾]` select (options: Branch, Agent, Source, Lead type) · right-aligned `View Full Report ↗` link.
3. **Trend** — section label + line chart: 7 points `-6w … Now`, dashed horizontal **Target** line (labeled), y-axis scaled per metric (0–100 for SLA/Quality %, 0–20 for Return Rate), gridlines, dots.
4. **Top 3 / Bottom 3** — two boxes side by side. Top 3 = green box (best performers), Bottom 3 = red box (worst first). "Best/worst" respects direction: higher-is-better for SLA/Qual, **lower-is-better for Return Rate**. With 5 branches the median appears in both.
5. **By Branch** — horizontal bar chart, sorted best→worst top-to-bottom, dashed vertical target line, x-axis per metric (0–100 or 0–20 or 0–60).
6. **Tabs** (bottom): `VALUE` *(active)* · `VS TARGET` · `VOLUME` — toggle active underline.

### Drawer data (verbatim)

```json
{
  "firstContact": {
    "kind": "SLA Metric", "title": "First Contact SLA",
    "sub": "% of interactions handled within SLA window.",
    "value": 88, "target": 95, "delta": -3, "higherIsBetter": true,
    "yTrendMax": 100, "trend": [84,80,84,81,85,82,84], "xMax": 100,
    "branches": [
      {"n":"Al Ain","v":91.6},{"n":"Abu Dhabi","v":91},{"n":"Sharjah","v":88.5},
      {"n":"Deira","v":87.1},{"n":"SZR — Sheikh Zayed Road","v":85.4}
    ]
  },
  "assignSA": {
    "kind": "SLA Metric", "title": "Assign to SA SLA",
    "sub": "% of interactions handled within SLA window.",
    "value": 92, "target": 95, "delta": 1, "higherIsBetter": true,
    "yTrendMax": 100, "trend": [91,90.6,91,93,91,90,91], "xMax": 100,
    "branches": [
      {"n":"SZR — Sheikh Zayed Road","v":93.1},{"n":"Al Ain","v":90.9},{"n":"Deira","v":90.4},
      {"n":"Sharjah","v":89.9},{"n":"Abu Dhabi","v":87.4}
    ]
  },
  "returnRate": {
    "kind": "Quality Metric", "title": "Return Rate",
    "sub": "% of qualified leads returned by Sales.",
    "value": 8, "target": 8, "delta": -0.6, "higherIsBetter": false,
    "yTrendMax": 20, "trend": [9,8,9,7,8,9,8], "xMax": 20,
    "branches": [
      {"n":"Al Ain","v":5.2},{"n":"Abu Dhabi","v":6.4},{"n":"Sharjah","v":8.1},
      {"n":"SZR — Sheikh Zayed Road","v":9.8},{"n":"Deira","v":11.2}
    ]
  },
  "qualCompletion": {
    "kind": "Quality Metric", "title": "Qual Completion",
    "sub": "% of connected calls with qualification completed.",
    "value": 82, "target": 90, "delta": 2, "higherIsBetter": true,
    "yTrendMax": 100, "trend": [80,81,83,82,84,81,82], "xMax": 100,
    "branches": [
      {"n":"Al Ain","v":86.2},{"n":"Abu Dhabi","v":84},{"n":"Sharjah","v":82.5},
      {"n":"Deira","v":80.1},{"n":"SZR — Sheikh Zayed Road","v":78.4}
    ]
  }
}
```

**Derived at render:**
- `top3` = branches sorted by "goodness" (value if higherIsBetter else -value), first 3.
- `bottom3` = same sort, last 3, reversed (worst first).
- `delta chip` = green/up if `higherIsBetter ? delta>=0 : delta<=0`, else red/down; arrow ▲/▾; hide when delta 0.
- Percent formatting: 1 decimal, drop trailing `.0` (91 → "91%", 91.6 → "91.6%").

### Optional metrics (not wired to a card in this dashboard)
Two more metrics exist in the source design but have **no KPI card** in the SLA section here — include if you also add cards for them:

```json
{
  "followUp": {
    "kind":"SLA Metric","title":"Follow-up SLA","sub":"% of interactions handled within SLA window.",
    "value":86,"target":95,"delta":0,"higherIsBetter":true,"yTrendMax":100,
    "trend":[85,86,86,87,83,85,89],"xMax":100,
    "branches":[{"n":"Sharjah","v":91},{"n":"SZR — Sheikh Zayed Road","v":87},{"n":"Deira","v":86.3},{"n":"Al Ain","v":83.2},{"n":"Abu Dhabi","v":82.9}]
  },
  "addOnPenetration": {
    "kind":"Conversion Metric","title":"Add-on Penetration","sub":"% of deals including at least one add-on.",
    "value":68,"target":55,"delta":0,"higherIsBetter":true,"yTrendMax":80,
    "trend":[63,62,61,63,62,56,56],"xMax":60,
    "branches":[{"n":"Abu Dhabi","v":58.7},{"n":"Sharjah","v":52.4},{"n":"Deira","v":51.3},{"n":"SZR — Sheikh Zayed Road","v":50.3},{"n":"Al Ain","v":50.2}]
  }
}
```

---

## 9. Interactions to preserve

- Sidebar collapse/expand (rail mode).
- Notifications: open/close dropdown + backdrop, mark all read, dismiss item (bell badge recalculates).
- Date range tabs incl. custom From/To picker → updates tab label.
- Refresh spin + "Last refreshed" tooltip.
- Stream toggle (Sales ↔ Aftersales) swaps the visible section.
- Table tabs active state.
- Expandable "agent status logic" note.
- **KPI drawer:** open on click / Enter / Space; close on ✕ / backdrop / Escape; internal Value·VsTarget·Volume tabs; breakdown dropdown; View Full Report link.

---

## 10. Accessibility

- Clickable KPI cards: `role="button"`, `tabindex=0`, keyboard-activatable, visible focus ring (`accent-blue`).
- Drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Metric detail"`; Escape closes; focus returns to trigger (nice-to-have).
- Color is never the only signal (status badges carry text labels).

---

## 11. Responsive

- KPI grids: auto-fit, min card ~150px; collapse to 2 / 1 columns on narrow widths.
- Drawer: `max-width:94vw` so it works on mobile.
- Sidebar collapses to icon rail; tables scroll horizontally on small screens.

---

## 12. Build prompt (paste this into Lovable)

> Build a **Call Center Manager dashboard** for "AGM Sales · EXEED CRM" as a single responsive page in React + TypeScript + Tailwind, using **Microsoft Fluent UI v9 design language** themed with the EXEED brand ramp. Use the exact **design tokens, layout, components, data, and interactions** specified in this document.
>
> Layout: fixed dark **topbar** + collapsible **sidebar** (228px) + main content. Main content in order: **header greeting** ("Good afternoon, Eman 👋" + stats + scope dropdown, KPI-definitions button, Today/This Week/This Month/Custom date range, refresh), **SLA legend**, **Manager Next Best Action** callout, **Sales/Aftersales stream toggle** (21 / 4), then three **KPI sections** (SLA Performance — 5 cards incl. 4 clickable dials; Volumetrics — 8 cards; Live Calls · SE Availability · Training — 7 cards), a **Lead source mix** bar card, **table tabs**, and the **Agents table** (8 rows) with an **Aftersales** table for the other stream.
>
> KPI dials render as **semicircle gauges** with the % inside the arc. The four SLA-section cards marked clickable (First Contact 88%, Assigned to Showroom 91%, Return Rate 8%, Qual Completion 82%) open a **right-side slide-in drill-down drawer** with: a bright-blue gradient header (metric kind, title, subtitle, big value, Target + month-over-month delta chip, Period), a **Break down by [Branch]** dropdown, a **View Full Report** link, a **Trend** line chart (−6w→Now with dashed Target line), **Top 3 / Bottom 3** branch boxes (green/red, direction-aware), a **By Branch** horizontal bar chart with a target line, and **Value / Vs Target / Volume** tabs. Drawer closes on ✕, backdrop, or Escape. Use the drawer JSON dataset from Section 8 verbatim.
>
> Keep all labels and numbers exactly as given. Data is dummy. Centralize tokens; make it accessible (keyboard + ARIA) and responsive.

---

*Source of truth: `call-center-manager.html` in the EXEED CRM mockup repo. Companion files: `DESIGN_SYSTEM.md`, `exeed-design-system.tokens.json` (W3C DTCG tokens for Figma/Tokens Studio import).*
