# AGM Sales · EXEED CRM — User Personas

Four primary roles the CRM serves, derived from the app's dashboards and the end-to-end lead → delivery journey. Each persona uses the same template so they can drop straight into matching Figma frames (one frame per persona, one text layer per field).

Brand context: **AGM Sales / EXEED** (Al Ghurair automotive), UAE. Telephony is handled externally by **Genesys CTI**; the CRM runs on **Dynamics 365** with an 8-stage Business Process Flow (New → Contact → Qualify → Nurture/Visit → Propose → Accepted → Ready for delivery → Close).

---

## 1 · Contact Center Agent

**Name:** Nadia Al Amiri
**Tagline / quote:** “My clock starts the second a lead lands — 30 minutes to first contact, no excuses.”

**Snapshot**
- Age: 27 · Location: Dubai (Call Center) · Experience: 3 yrs in automotive tele-sales
- Reports to: Call Center Manager · Works alongside: Sales Executives, Brand Hosts
- Tech comfort: High — lives in the CRM queue + Genesys softphone all day

**Bio**
Nadia is the first human touch for every inbound and campaign lead. She works a live queue, races the first-contact SLA, and decides whether a lead is genuine, needs nurturing, or should be handed to a Sales Executive. High volume, high tempo, judged on speed and hand-over quality.

**Goals**
- Make first contact within the 30-minute SLA on every assigned lead
- Correctly qualify intent (Interested / Needs time / Compare / Book test drive)
- Hand over “sales-ready” leads with complete, accurate info
- Keep the queue clean — zero “not actioned” leads at end of shift

**Frustrations / pain points**
- Leads arriving with missing or duplicate data
- Switching between CRM, WhatsApp, and the dialer breaks focus
- No-answer customers with no clear, automated next step
- Getting blamed for SLA breaches caused by late lead routing

**Needs from the CRM**
- A single prioritized queue with a visible SLA countdown per lead
- One-click log-activity that routes the lead to the right next stage
- Auto WhatsApp fallback when a call goes unanswered
- Click-to-dial hand-off to Genesys (no manual number copying)

**Key responsibilities**
- Work today’s lead queue by SLA urgency · Log call outcomes & disposition · Trigger approved WhatsApp templates · Book test drives / schedule call-backs · Hand qualified leads to Sales · Return incomplete leads with a reason

**Tools & channels**
Dynamics 365 lead queue · Genesys CTI softphone · WhatsApp Business · Copilot assist

**KPIs owned**
1st-contact SLA % · Avg handle time · Leads actioned vs assigned · Callbacks kept · Leads ready for hand-over

**A day in the life**
Opens the queue → sorts by SLA risk → dials the hottest breach-risk lead → logs “Interested,” lead auto-advances to Qualify → sends WhatsApp to a no-answer → books a Saturday test drive → hands three ready leads to Sales before the shift ends.

---

## 2 · Sales Executive

**Name:** Mariam Saeed
**Tagline / quote:** “A qualified lead is a promise — I turn discovery into the right car and a signed deal.”

**Snapshot**
- Age: 32 · Location: SZR Showroom, Dubai · Experience: 6 yrs automotive sales
- Reports to: Showroom / Sales Manager · Works alongside: Contact Center Agents, Brand Hosts
- Tech comfort: Medium-High — mobile-first, uses the CRM between customer conversations

**Bio**
Mariam owns the lead from qualification to close. She runs needs-discovery, matches the customer to the right EXEED model, orchestrates test drives, builds proposals/quotes, negotiates, and drives the deal through the pipeline to delivery hand-off.

**Goals**
- Convert qualified leads into orders (hit monthly targets)
- Complete discovery fast so she can propose confidently
- Book and run test drives that move the customer emotionally
- Keep every deal moving — no stalled stages, no lost momentum

**Frustrations / pain points**
- Re-entering data the call center already captured
- Discovery answers scattered across notes instead of structured fields
- Vehicle availability & test-drive slots not visible in one place
- Slow quote/approval turnaround killing hot-lead momentum

**Needs from the CRM**
- A clear “what to do next” per stage with a completion checklist
- Structured discovery + AI vehicle-fit suggestions (best-fit model, risk, question)
- A fast test-drive booking flow with calendar + slot availability
- One-tap proposal generation and status visibility

**Key responsibilities**
- Accept & own qualified leads · Run needs discovery · Recommend model/trim · Schedule & conduct test drives · Build proposals & quotes · Negotiate & close · Hand over to delivery

**Tools & channels**
Dynamics 365 lead/opportunity forms · Test-drive booking · Quotes/Proposals · Sales Copilot · WhatsApp

**KPIs owned**
Lead-to-order conversion % · Discovery completion · Test drives booked/completed · Proposal turnaround · Pipeline velocity

**A day in the life**
Reviews accepted leads → opens Copilot’s vehicle-fit card → completes discovery with the customer → books a test drive for the weekend → generates a quote → follows up on a pending proposal → advances two deals to “Accepted.”

---

## 3 · Brand Host

**Name:** Sara Khalid
**Tagline / quote:** “First impressions are everything — the showroom should feel like the brand before a word is spoken.”

**Snapshot**
- Age: 25 · Location: EXEED Showroom, Abu Dhabi · Experience: 2 yrs guest experience / hospitality
- Reports to: Showroom Manager · Works alongside: Sales Executives, Contact Center Agents
- Tech comfort: Medium — tablet on the floor, quick check-ins between guests

**Bio**
Sara owns the in-showroom experience. She greets and checks in walk-ins and appointments, prepares vehicles, manages test-drive readiness, and runs the red-carpet delivery hand-over — making sure the operational details never break the brand feeling.

**Goals**
- Greet and check in every visitor promptly and warmly
- Get customers into test drives with zero friction or delays
- Ensure the vehicle, waiver, and paperwork are ready before the customer is
- Deliver a memorable red-carpet hand-over at delivery

**Frustrations / pain points**
- Not knowing who’s arriving or which car they came to see
- Chasing waivers / licence / EID at the last minute
- Vehicles not prepped or unavailable when the customer shows up
- Being a coordination bottleneck between sales, prep, and the customer

**Needs from the CRM**
- A visitor/arrival view tied to today’s appointments and assigned SEs
- A test-drive readiness checklist (check-in, licence/EID, waiver, vehicle ready, route)
- Clear vehicle status (available / prepped / VIN) at a glance
- A delivery hand-over checklist with orientation and follow-up triggers

**Key responsibilities**
- Welcome & check in guests · Confirm test-drive readiness · Capture licence/EID & waiver · Coordinate vehicle prep · Run delivery orientation · Trigger the loyalty / follow-up loop

**Tools & channels**
Showroom / reception view · Test-drive readiness · Delivery hand-over checklist · Vehicle prep status

**KPIs owned**
Check-in time · Test-drive readiness rate · Waiver/licence completeness · Delivery experience score / NPS · Handover follow-ups scheduled

**A day in the life**
Checks the day’s appointments → greets a walk-in and links them to their SE → confirms the readiness checklist and chases a pending waiver → gets the customer into the test drive on time → in the afternoon runs a red-carpet delivery and schedules the 3/7/30-day follow-ups.

---

## 4 · Call Center Manager

**Name:** Eman Saleh
**Tagline / quote:** “I don’t manage calls — I manage risk. Show me who’s breaching and where the load is stuck.”

**Snapshot**
- Age: 38 · Location: Dubai (Call Center) · Experience: 10 yrs, 4 in team leadership
- Reports to: Head of Sales Operations · Manages: ~6 Contact Center Agents
- Tech comfort: High — dashboard-driven, exception-first

**Bio**
Eman runs the contact-center floor. She watches SLA compliance and workload in real time, spots at-risk and not-actioned leads, rebalances the queue across agents, coaches on quality, and escalates breaches — protecting both the numbers and the customer experience.

**Goals**
- Keep team-wide first-contact SLA compliance high
- Eliminate “not actioned” and SLA-overdue leads before they breach
- Balance workload fairly across agents
- Coach underperformers up; protect hand-over quality to Sales

**Frustrations / pain points**
- Finding out about breaches after they’ve already happened
- Uneven load — some agents drowning while others are idle
- No single view of who needs coaching and why
- Reactive firefighting instead of proactive prevention

**Needs from the CRM**
- A live management dashboard: assigned, actioned, not-actioned, SLA-overdue, ready-to-handover
- Per-agent performance with a clear “manager action” per row
- Proactive next-best-action alerts (e.g., “reassign 7 uncalled leads from Agent A”)
- Drill-down from a metric to the exact at-risk leads

**Key responsibilities**
- Monitor SLA & queue health · Reassign / rebalance leads · Review agent performance · Coach & set targets · Escalate exceptions · Report to leadership

**Tools & channels**
Call Center Manager dashboard · Agent performance grid · SLA & exceptions view · Copilot (grounded on team data)

**KPIs owned**
Team 1st-contact SLA % · Not-actioned count · SLA-overdue count · Leads ready for hand-over · Agent quality scores · Reassignment turnaround

**A day in the life**
Opens the dashboard → sees 24 not-actioned and 11 SLA-overdue → acts on Copilot’s prompt to reassign uncalled leads from an overloaded agent → reviews the agent grid, flags two for coaching → clears the SLA-risk queue before the afternoon peak → sends the daily numbers to leadership.

---

### Shared context (for the persona board footer)
- **Product:** AGM Sales · EXEED CRM on Dynamics 365
- **Journey:** New → Contact → Qualify → Nurture/Visit → Propose → Accepted → Ready for delivery → Close
- **Telephony:** Genesys CTI (external) · **Messaging:** WhatsApp Business · **AI:** Copilot assist
- **Design system:** Fluent UI v9 tokens (EXEED brand ramp)
