# Lead Detail Page — Figma Make Build Spec

A complete, self-contained specification to build the **AGM Sales · EXEED CRM — Lead Detail** page in **Figma Make**. This documents every screen, component, data value, and interaction built over the last two weeks. Paste **Section 15 (Build Prompt)** into Figma Make to start, and keep this doc alongside it as reference.

> **Framing:** A Microsoft **Dynamics 365** web-resource workspace for "AGM Sales / EXEED CRM". Dense, professional, enterprise CRM UI.
> **Design language:** Microsoft **Fluent UI v9** tokens themed with the **EXEED brand ramp** (navy · cyan · azure). Font **Segoe UI** (fallback Inter). Icons: **Material Symbols Outlined**. All data is dummy.
> **Scale note:** This is a large screen. Build in the order given in Section 14 — get the shell + lead list + detail panel + proposals/quotation flow working first, then layer on Call, Log Activity, Test Drive, and Trade-in.

---

## 1. Design tokens

Centralize as variables. Base = Fluent UI v9 web-light, brand ramp = EXEED.

| Token | Value | Use |
|---|---|---|
| `exeed-navy` | `#00203f` | Deepest brand |
| `blue` (brand) | `#17293d` | Links, primary CTAs, active nav |
| `blue-soft` | `#eaeef3` | Hover, active nav bg |
| `exeed-cyan` / `accent` | `#00b7bb` | Glows, focus rings, AI accents |
| `exeed-azure` | `#2a6797` | Secondary brand |
| `red` / `red-soft` | `#d13438` / tint | Danger, SLA breach, urgent rows |
| `amber` / `amber-soft` | Fluent yellow / tint | Warning, "Due soon", pending approval |
| `green` / `green-soft` | Fluent green / tint | Success, On-track, done |
| `purple` | Fluent purple | "Nurture" stage |
| `ink` / `ink-secondary` / `ink-muted` | Neutral fg ramp | Text |
| `surface` / `bg` | `#ffffff` / `#f5f5f5` | Cards / app bg |
| `border` / `border-soft` | `#e0e0e0` / `#f0f0f0` | Borders / hairlines |
| `radius` / `radius-sm` / `radius-md` | `6px` / `4px` / `8px` | Corners |
| `sidebar-w` | `228px` | |
| `topbar-h` | `42px` | |
| Mono font | `SF Mono, Consolas` | Lead IDs, VINs, SLA timers |

**Status conventions:** SLA `ok`=green, `wrn`=amber, `brch`=red (blinking dot). Stage badges: `new`=blue, `contacted`=teal, `qualified`=green, `nurture`=purple, `na`=red. Avatars: 6 gradient variants `av1`–`av6`. Source dots: web=blue, ig=#c13584, ggl=#4285f4, walk=gray, fb=#1877f2, ref=green.

---

## 2. Global chrome

**Topbar** (fixed, 42px, dark navy gradient, white): waffle menu (toggles sidebar) · "Dynamics 365" · "AGM Sales" · center search "🔍 Search…" (decorative) · right: "✨ Copilot" chip, gear, bell, help, avatar "PK".

**Sidebar** (fixed, 228px, collapsible to icon rail). Brand: "A" logo + "AGM Sales / EXEED CRM". Grouped nav (active = **Leads**):
- Home, Dashboard
- **Call Center:** Call Center Dashboard, Today's Leads, Callbacks, Call Center Manager
- **Sales:** **Leads** *(active)*, Leads · Option 2, Deals, Quotes, Test Drives
- **Customers:** Accounts, Contacts
- **Operations:** Sales Admin, Payments, Documents, JAFZA Orders, Vehicle Prep, Vendors
- **Deliveries:** Delivery Dashboard, Today's Deliveries, Readiness Blockers, Completed Deliveries
- **Management:** Showroom Dashboard, Add-on Penetration, SLA & Exceptions, Team Performance, Showroom Team

**Command bar** (under topbar): Back · New Lead · Import · **Delete (n)** (dynamic count) · Refresh · Flow · ⋯

---

## 3. Content layout — list + detail panel

Two regions side by side:

- **List view** (`My Active Leads`, count pill "12 leads"): filter chips, leads table, plus hidden Calendar and Pipeline/Kanban views.
- **Detail panel** (right slide-in). Three states: **closed** (width 0) → **open** (520px) → **expanded** (full width). Row click opens it **expanded**. Overlay dims background on narrow screens.

**URL params:** `?lead=<name-or-id>` opens that lead (exact → partial → synthetic); `?new=1` opens Create Lead.

---

## 4. Leads list

**Table columns:** checkbox (select) · Lead (avatar + name + id, id is copy-to-clipboard) · Source (colored dot + label) · Model · Stage badge · SLA tag (live) · Intent/score · Owner · Next action / Open link. Urgent leads (e.g. Sara Ali, Maya Hassan) render as **red-tinted rows**.

**Seed data — 12 leads.** Per lead: `id, name, initials, avatar, phone, email, emiratesId, source (+icon/class), model, sla (+class ok/wrn/brch), stage (+class), intent High/Med/Low, owner, score, profileComplete, convertProb, discovery, channel, lang, campaign, temp Hot/Warm/Cold, existing, showroom, handover, preferred, nps, activities[]`. Example:

```json
{
  "id": "L-2026-04832", "name": "Hiren Patel", "initials": "HP", "phone": "+971 50 482 9120",
  "email": "hiren.patel@email.ae", "emiratesId": "784-1985-9123847-2",
  "source": "Website — Configurator", "model": "EXEED LX · Luxury",
  "sla": "54 min left", "slaClass": "wrn", "stage": "Discovery", "stageClass": "new",
  "intent": "High", "owner": "Mariam Saeed", "score": 72, "profileComplete": 84,
  "convertProb": 72, "channel": "WhatsApp", "lang": "English",
  "campaign": "Ramadan EXEED LX Promo", "temp": "Hot", "existing": "Yes · NPS 9",
  "showroom": "SZR Showroom — Dubai", "handover": "Accepted by Mariam Saeed", "nps": "9",
  "activities": [ {"type":"whatsapp","text":"…","time":"…"} ]
}
```

**List interactions:** row → open detail (expanded); checkbox + select-all; copy Lead ID / mobile (tick + toast); filter chips **All / New / Contacted / Qualified / Visit** (with counts); **Search** (expandable input); **Filter** menu (Source · Rating Hot/Warm/Cold · SLA Breached/Due-soon/On-track · Clear · count badge); **Sort** menu (Lead name / Lead ID / SLA urgency / Stage / Lead score / Rating, asc↔desc, Clear); **view toggle** Table ↔ Calendar (prev/next/Today, day chips open lead); Kanban pipeline cards open detail.

---

## 5. Detail panel — identity card

Sticky header: avatar + **editable name** (inline contenteditable), "Lead" tag with badge. Right cluster: **Lead ID** (mono), **Location** (showroom), **Owner** (avatar + online dot, link-styled). Below: identity tab strip **Main | Related Records** (synced with the form tabs). The **call action** lives inline on the Mobile Number field (call button → opens the Call flow).

---

## 6. Stage stepper (journey)

Circle stepper, **9 stages**: **New · Contact · Qualify · Visit · Propose · Accepted · Prep for delivery · Ready for delivery · Close** (icons: fiber_new, forum, fact_check, storefront, request_quote, handshake, inventory_2, local_shipping, flag).

- States: **done** (green + check) for completed, **active** (dark, pulsing) for current, **pending** otherwise; the step being *viewed* gets a `.viewing` outline. Click a node → view that step (doesn't advance the record).
- **Advancement gated by a per-stage checklist.** "Save & continue →" stays locked until all checklist items are ticked; reads "Journey complete ✓" at the last step. Stage badge: Completed / In Progress / Pending.

**Propose stage checklist:** "Convert selected proposal into quotation and get manager's approval" · "F&O – Automated booking payment link sent" · "F&O – Booking payment fully received" · "F&O – Automated replication of quotation".

**Per-stage SLAs** (shown in the SLA widget), e.g. Proposal turnaround 48 hrs; Quote approval 24 hrs.

---

## 7. Details form (intake)

Rendered on the **Details / overview** tab. Toolbar = stage title + an **"Expand all / Collapse all"** toggle that **starts expanded** (folds visible by default). Field types: text, select, lookup (search icon), phone (inline call button), locked (readonly), textarea, Yes/No chips, radio chips. **AI-populated fields** get a green "✦ AI" tag + green inset.

**Groups & fields** (⌄ = inside the collapsible fold):
- **Lead Details:** First Name*, Last Name*, Mobile Number* (phone w/ call btn), Email · ⌄ WhatsApp Number, Emirates ID, Nationality (lookup, default UAE), Campaign Name (locked, "EV – Performance 2025")
- **Vehicle:** Model (lookup) · ⌄ Brand (EXEED/MHero/Lepas), Class (SUV/Sedan/Crossover/EV), Model Year (2026/2025/2024), Model Code
- **Lead Qualification:** Qualification* (chips Qualify/Not Qualify), Lead Type* (Buy New/Buy Used/Lease), Lead Source* (lookup), Channel* (lookup), Description* (AI call summary lands here)
- **Organization:** Showroom* (lookup, default "Abudhabi Corniche")

Editing a field writes back to the lead (First/Last recompute name + initials) and re-renders the list. There are richer stage-specific forms too (Qualify/Visit) with D365-style sections incl. a **Call Status** dropdown (Not Called / No Answer 1 / No Answer 2 / Call Back / Follow up / Answered) and **Trade-in Interested** (No/Yes/Not sure).

---

## 8. Call flow (Genesys softphone + AI Copilot)

Trigger: call button on Mobile field → **dialing** overlay (1.6s) → **live call**.

- **Genesys widget** (bottom-left, orange bolt logo, "View Help Guide"): controls **Call · Transfer · Mute · End call (red) · Hold · Record · Keypad** (Transfer/Mute/Hold toggle with toast; End closes). Active-call row: number, status "Dialing…"→"Connected", call-GUID, a second internal call row, footer "On Queue".
- **AI Copilot panel** (right, dark): "AI Copilot", "Live call · listening · <timer>", **TRANSCRIPT** that reveals a scripted 6-line agent/customer conversation every ~2.2s, and a **"SAY THIS NEXT"** suggestion card rotating through 4 tips.
- **On End call:** auto-enriches the lead → adds an AI-summary activity, sets a ready-to-send **WhatsApp offer** (with Sat 11 AM / Sun 4 PM slots), sets model → "EXEED RX", channel → "WhatsApp", fills Description; those fields now show "✦ AI". Toast: "Call ended · AI summary added to Description · WhatsApp message ready".

---

## 9. Activities timeline + Log Activity

**Timeline** (right sidebar, "Timeline of Activities", actions Add/Filter/Refresh): newest-first list of `{type, text, time}` (types whatsapp, call, visit, email, note, ai). AI items can embed a **"Send WhatsApp message"** button → flips to disabled "Sent to WhatsApp ✓".

**Log Activity panel** (primary authoring surface):
- Attempt counter. **"Did the customer answer? Yes / No"** (New & Contact stages).
- **No** → **Reason** radios: **Invalid number / Not reachable / Voicemail / Switched off** (Invalid → disqualify hint; others → reschedule date/time) + Notes.
- **Yes** (or sales stages) → **outcome chips** grouped *Internal* / *Customer-related*: Alerts, Return to call center, Transfer ownership, Send WhatsApp, Calls, Disqualify, Meet customer; plus Handover to showroom, Book test drive, Needs time, Not interested.
- Each outcome renders tailored fields (discovery Qs, date/time picker, transfer-agent select, return-reason select, **disqualify reason** dropdown: Out of Scope / Wrong Number / Not Interested / Submitted by Mistake / High Price / Inconvenient Location / Duplicate / **General** / Others → "Others" shows a comment box).
- Submit routes the stage: Handover / Book test drive → Qualify; Needs time → Contact; Not interested / Disqualify / Invalid number → Disqualified.

---

## 10. Test Drive tab

- **Empty state:** "Take it for a spin" — steps *Pick the car → Choose a slot → Come in* — "Book a test drive".
- **Booking wizard:** vehicle select → calendar + time slots → Book.
- **Bookings table:** Vehicle · Date & Time · Location · Status (booked / in progress / complete). Row actions: **Reschedule, Sign waiver, Cancel** (booked); **Complete, Cancel** (in progress); **Download** (complete).
- **Sign waiver:** trade-in reminder confirm → full-screen waiver, 2 steps: (1) upload 4 docs — Emirates ID front/back, Driving Licence front/back; (2) sign **customer** + **sales-exec** canvas signatures. Download PDF; "Sign & confirm" → status "In progress".
- **Complete:** odometer-reading modal.

---

## 11. Trade-in tab

- **Trade-in Interested? Yes / No** chips (reveal on Yes).
- **Trade-in Details:** Brand, Model, Year, Mileage, Colour, Transmission, Registration, VIN, Tire, Remarks.
- **Damage marker:** tap the car diagram → menu **Scratch / Dent / Major Damage / Side Image** → drops a marker + a damage card (attach photo/video, remove) + legend + damage list.
- **Vehicle Photos:** upload / capture.
- **Appraisal:** Customer Expected Price, Offer Price (locked) → **Submit for Appraisal**.

---

## 12. Proposals & Quotation flow  ★ (core of the last two weeks)

Open via the **Proposals** tab. Header: "Proposals" · "N proposals · M quotations" · buttons **Manager Support** + **New proposal**.

**Seed proposals — 3 EXEED ES cards:**
| ID | Tag | Trim | Colour | Range/Power | Price | Down | Stock |
|---|---|---|---|---|---|---|---|
| P-2026-1001 | Value | Standard Range | Pearl White | 520 km / 204 hp | AED 159,900 | 20% | 5 |
| P-2026-1002 | Best fit | Long Range | Matte Gray | 620 km / 279 hp | AED 179,900 | 20% | 2 |
| P-2026-1003 | Premium | AWD Performance | Passion Red | 580 km / 517 hp | AED 209,900 | 15% | 3 |

**Add-ons:** Insurance 4,800 · Service Contract 3,500 · Tinting 1,200 · Ceramic Coating 2,559. **EMI:** flat 2.1%/yr → `emi = round(loan × (1 + 0.021×years) / (years×12))`.

**Proposal card:** photo · "Draft 0N · <tag>" · model · trim/colour · **AED price** · availability chip (N in stock / Limited / Out of stock) · VIN · add-on chips · buttons **Edit · Download · Email**:
- **Edit** → opens the **proposal builder** in a popup: `proposal-builder.html?lead=<idx>&edit=<i>` (1280×860). **New proposal** = same without `&edit`. Built proposals return via a queue (localStorage) and get IDs `P-2026-100N`.
- **Download** → generates a plaintext quote (.txt) with price, PDI, down %, loan, add-ons, and an EMI table for 5/4/3/2 yrs with & without add-ons.
- **Email** → toast "Proposal/Quotation <id> sent via Email".

**Bulk bar** (when cards ticked): "N selected" + Clear / Email / Archive / Download. Hint when none: "Tick one or more cards to generate a quotation."

### 12.1 Create Quotation → Stock picker
Non-quote card CTA **"Create Quotation"** → `requestCreateQuotation`:
- If a quotation already exists → confirm **"Create a new quotation?"** — *"A quotation already exists (**<id>**). Creating a quotation from this proposal will **void the previous one**. Are you sure?"* (Yes, create / Cancel).
- Else → **Stock picker modal**: "Choose a vehicle from stock" · "<model> · N units available". **Shows exactly ONE unit** (identical trim/colour, only VIN differs): photo, VIN, colour dots, year, "DIP Warehouse", "Ready", **Select** → makes this the single active quotation (all others `isQuote=false`), stamps chassis/colours/location. Toast "Quotation created — <id> · <chassis>".

### 12.2 Manager approval  ★
On the quotation card, a two-line CTA group:
1. **Approval button** states:
   - **"Pending manager approval"** (orange, hourglass) → click → toast "Sent to manager for approval…" → button **"Sent for approval…"** (disabled, spinner) → after **1.6s** → **"Approved by manager"** (green, verified_user) + toast "Quotation <id> approved by manager".
2. **Send button** (gated on approval):
   - Before: **"Send to customer · needs approval"** (disabled, lock).
   - After: **"Send quotation to customer"** (active, send icon).

### 12.3 Send to customer → Confirmed
**Send quotation to customer** → confirm **"Send quotation to customer?"** — *"Send quotation **<id>** to the customer by email. This moves the deal to the **Confirmed** state."* (Send quotation / Cancel). On confirm: `propState='confirmed'`, toast "Quotation <id> sent to customer — moved to Confirmed".

### 12.4 Confirmed quotation panel
Replaces the proposals grid when `propState='confirmed'`.
- Header: "Confirmed — Accepted quotation" · "Customer accepted <id>. Complete the booking and paperwork below."
- Top-right: **Edit** + **Back to draft**.
- **Edit warning:** **"Edit accepted quotation?"** — *"Editing **<id>** will move it back to draft and the customer will need to review and approve the updated quotation again."* (Edit quotation / Cancel, neutral edit icon) → sets draft + reopens the builder popup.
- **Accepted-quotation card:** verified badge + id, photo, model, `trim · colour · VIN · chassis`. Grid: **Vehicle price**, **Downpayment amount** (price × down%), **Add-ons** (list or "None"), **Amount received from customer**.
- **CTAs** (each a modal + toast): **Send payment link** (amount default 2000 + channel Email/SMS/Both), **Generate quotation** (bank name; note "Requires manager signature before it is issued"), **Generate purchase agreement** ("shared with the customer via **DocuSign**" → "Send via DocuSign").

---

## 13. Reusable confirm modal

**`openConfirm(title, text, okLabel, cb, cancelLabel, icon, neutral)`** — one modal reused everywhere.
- `text` is set as **innerHTML** (copy can contain `<strong>` and even inline inputs, e.g. amount/bank/odometer fields).
- `neutral` truthy → OK button is **blue/primary**; falsy → **red/danger**. Optional Material `icon` glyph (default "warning").
- Overlay-click cancels; OK runs the stored callback.

**Where it's used (with copy):** Send quotation, Create-new-quotation (void previous), Edit accepted quotation, Send payment link, Generate quotation, Generate purchase agreement, Complete test drive (odometer), Trade-in reminder before waiver, Cancel test drive. Delete-lead uses a separate dedicated confirm ("Delete N leads? … cannot be undone").

---

## 14. Right sidebar (detail)

- **Lead Snapshot** (score, profile completeness, convert probability, discovery %).
- **SLA widget:** Created / Assigned timestamps, **two live countdown ring tiles** (tick every 1s), Refresh, "List of SLA", "View all SLAs" toggle, cadence expander. Colors ok/wrn/brch.
- **AI Next Best Action** card: **Handover to sales executive**, **Disqualify**, and a personalised **WhatsApp** message with Send.
- **Timeline** (as §9).

---

## 15. Recommended build order (do this in stages in Figma Make)

1. **Shell:** topbar + sidebar + command bar + tokens.
2. **Leads list:** table + filter chips + seed data + row select + copy-id + toast.
3. **Detail panel:** open/expand, identity card, stage stepper, Details intake form (with expand-all + AI tags).
4. **Proposals & Quotation flow** (Section 12) — the priority: cards, Edit/Download/Email, Create Quotation + single-car stock picker, manager approval states, Send-to-customer, Confirmed panel + its CTAs. Include the reusable confirm modal (Section 13).
5. **Right sidebar:** SLA live tiles, AI NBA, timeline.
6. **Log Activity** panel (Section 9) with outcome routing.
7. **Call flow** (Section 8): Genesys widget + AI Copilot + end-call enrichment.
8. **Test Drive** (Section 10) and **Trade-in** (Section 11) tabs.
9. **Create / Edit Lead** slide-in (source-driven conditional fields, UAE Pass prefill).

---

## 16. Build prompt (paste into Figma Make)

> Build a **Lead Detail page** for "AGM Sales · EXEED CRM", styled as a **Microsoft Dynamics 365 web resource** using **Fluent UI v9** design tokens themed with the EXEED brand ramp (navy `#17293d`, cyan `#00b7bb`). Font Segoe UI; Material Symbols Outlined icons. Dense enterprise CRM layout. All data is dummy — use the exact labels and numbers from the spec.
>
> **Shell:** fixed dark **topbar** (Dynamics 365 · AGM Sales · search · Copilot · bell · avatar), collapsible **sidebar** (228px, grouped nav with **Leads** active), and a **command bar** (Back · New Lead · Import · Delete · Refresh · Flow).
>
> **Main = leads list + slide-in detail panel.** List "My Active Leads" (12 seed leads) with columns Lead (avatar+name+id) · Source · Model · Stage badge · SLA tag · Score · Owner · Open; row click opens the **detail panel expanded**; support select/copy-id/toast, filter chips (All/New/Contacted/Qualified/Visit), Filter & Sort menus, and a Calendar view toggle.
>
> **Detail panel:** sticky identity card (editable name, Lead ID, showroom, owner) + a 9-step **journey stepper** (New→…→Close) whose "Save & continue" is gated by a per-stage checklist + a tabbed body (Details, Discovery, Trade-in, Test Drive, **Proposals**, Related). The **Details** intake form has grouped fields with a collapsible fold (WhatsApp, Emirates ID, Nationality, Campaign) that is **expanded by default**, and AI-populated fields show a green "✦ AI" tag.
>
> **Proposals tab (priority):** three EXEED ES proposal cards (Value 159,900 / Best-fit 179,900 / Premium 209,900) with **Edit / Download / Email**; **Create Quotation** opens a **stock picker that shows exactly one vehicle**; the resulting quotation card has a **manager-approval sequence** — "Pending manager approval" (orange) → "Sent for approval…" → "Approved by manager" (after ~1.6s) — and **"Send quotation to customer"** only activates after approval. Sending moves the deal to a **Confirmed panel** (accepted-quotation card with Vehicle price / Downpayment / Add-ons / Amount received, and CTAs Send payment link · Generate quotation · Generate purchase agreement via DocuSign), with an **Edit** button that warns it reverts to draft.
>
> Include one **reusable confirm modal** `openConfirm(title, text, okLabel, cb, cancelLabel, icon, neutral)` (neutral = blue OK, else red danger; text as innerHTML) used for all confirmations with the exact copy in the spec.
>
> Also implement: right sidebar (**live SLA countdown tiles**, AI Next-Best-Action with WhatsApp send, activity timeline); a **Log Activity** panel with Yes/No answer + outcome routing; a **Call flow** (Genesys softphone widget + AI Copilot live transcript, with end-call auto-enrichment); **Test Drive** (booking wizard, waiver with doc upload + signature canvas, odometer complete) and **Trade-in** (damage-marker on a car diagram, appraisal) tabs; and a **Create/Edit Lead** slide-in with source-driven conditional fields and UAE Pass prefill. Keep everything accessible (keyboard + ARIA) and responsive; centralize tokens.

---

*Source of truth: `lead-detail.html` (and identical `lead-detail-v2.html`) + `proposal-builder.html` in the EXEED CRM mockup repo. Companion: `DESIGN_SYSTEM.md`, `exeed-design-system.tokens.json`.*
