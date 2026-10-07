# Arabic (ar-AE) localization — English | العربية

The lead-to-sale journey runs in English or Arabic from a switch in the top bar (**English | العربية**). Arabic sets `<html lang="ar-AE" dir="rtl">`, mirrors the layout and translates the UI in place. The open lead, BPF stage, tab, filters, dialogs and Copilot state are untouched when switching. The choice persists across pages (`localStorage: exeed-lang`).

**Localized pages:**
- `lead-detail.html`: lead list → lead form → Qualify … Close, activities, trade-in, test drive, proposals and quotations, Sales Co-Pilot
- `index.html`: home
- Every role dashboard: `sales-executive`, `call-center-agent`, `call-center-manager`, `brand-host`, `showroom-manager`, `head-of-sales` and `delivery-consultant`, including their drill-down drawers, notifications and modals

`lead-detail-v2.html` (the "Leads · Option 2" prototype) is the only page still English-only.

Pages restored from the browser's back/forward cache re-read the saved language. Returning from Leads to a dashboard keeps Arabic.

| File | Role |
|---|---|
| `i18n.js` | Engine. It translates text nodes and `placeholder`/`title`/`aria-label` as they enter the DOM (MutationObserver), so the page's render code stays in English. It also mirrors directional icons and isolates LTR runs. |
| `i18n-ar.js` | Dictionary of about 1,750 strings and about 200 patterns for counts, dates and dynamic messages. Text captured by a pattern is translated too. |
| `rtl.css` | Language switch, the Almarai `@font-face` and font stack, and the few RTL overrides that logical CSS can't express (slide-in panes, centred markers, label wrapping). |
| `assets/fonts/` | Almarai Arabic subset (Light/Regular/Bold/ExtraBold, woff2) and its SIL OFL licence |
| Page CSS | All `left`/`right` margins, paddings, borders, insets, radii and text-align were converted to logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start` …). LTR rendering was verified pixel-identical before and after the conversion. |

Rules for page code:
- Read labels through `I18N.text(el)` (English source), never `el.textContent`.
- Write strings in English.
- `<option>`s without a `value` get their English text as the value, so `select.value` stays English in Arabic mode.

---

## Evidence and references

Microsoft does not publish Arabic screenshots of model-driven apps. The evidence below is Microsoft's Arabic terminology database, the Arabic style guide, human-translated (HT) Arabic Dynamics 365 Learn pages (which quote the product UI strings), and Microsoft globalization/Fluent guidance.

| # | Source | What it established |
|---|---|---|
| T | **Microsoft Terminology Collection — ARABIC.tbx** ([download](https://download.microsoft.com/download/b/2/d/b2db7a7c-8d33-47f3-b2c1-ee5e6445cf45/MicrosoftTermCollection.zip), via [learn.microsoft.com/globalization/reference/microsoft-terminology](https://learn.microsoft.com/en-us/globalization/reference/microsoft-terminology)), tagged ARE/SAU | Lead = عميل متوقع; Contact = جهة اتصال; Account = حساب; Opportunity = فرصة; Rating Hot/Warm/Cold = قوي/متوسط/ضعيف; Probability = احتمال; Status Reason = سبب الحالة; Cancel = إلغاء الأمر; Assign = تعيين; Follow-up = متابعة; Quote = عرض أسعار; Copilot stays in Latin script |
| SG | **Microsoft Arabic Localization Style Guide** ([aka.ms/arabic-styleguide](https://aka.ms/arabic-styleguide)) | Western digits 0–9; percent sign before the number (`%50`); commands as verbal nouns (حفظ, not احفظ); Arabic comma ، and question mark ؟; "My X" uses the possessive suffix (عملائي); product names stay in Latin; select (حدد), not click |
| QL | [ar-sa …/qualify-lead-convert-opportunity-sales](https://learn.microsoft.com/ar-sa/dynamics365/sales/qualify-lead-convert-opportunity-sales) (HT) | Leads = العملاء المتوقعون; command bar = شريط الأوامر; **تأهيل** / **إلغاء تأهيل**; Qualified = مؤهل; Company Name = اسم الشركة; Timeline = المخطط الزمني |
| ACT | [ar-sa …/manage-activities](https://learn.microsoft.com/ar-sa/dynamics365/sales/manage-activities) (HT) | Activities = الأنشطة; Phone Call = مكالمة هاتفية; Task = مهمة; Add note = إضافة ملاحظة; Related = مرتبطة; Save & Close = حفظ وإغلاق |
| LB | [ar-sa …/user-guide-learn-basics](https://learn.microsoft.com/ar-sa/dynamics365/sales/user-guide-learn-basics) (HT) | The English "top-**right** Copilot icon" and "process bar docked **right**" become "top-**left**" and "**left** side" in Arabic. Panes and header controls mirror. |
| CL / CO / QT / MOS | ar-sa create-edit-lead, create-edit-opportunity, create-edit-quote, move-opportunity-stages | Details = تفاصيل; Owner = المالك; Est. Revenue = الإيرادات المقدرة; Purchase Timeframe = الإطار الزمني للشراء; BPF stages Qualify/Develop/Propose/Close = التأهيل/التطوير/الاقتراح/الإغلاق |
| UI | [Unified Interface](https://learn.microsoft.com/en-us/dynamics365/customerengagement/on-premises/admin/about-unified-interface?view=op-9-1) and [F&O bidirectional support](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/user-interface/bidirectional-support) | Model-driven apps support RTL; "an RTL orientation for the controls in each form" |
| MIR | [Globalization: mirroring](https://learn.microsoft.com/en-us/globalization/fonts-layout/mirroring), [Design for bidi text](https://learn.microsoft.com/en-us/windows/apps/design/globalizing/design-for-bidi-text) | Mirror the layout, controls and directional icons. Media playback, clocks and similar keep their orientation. Segoe UI is the Windows font for all bidi languages. |
| BIDI | [Text directionality](https://learn.microsoft.com/en-us/globalization/fonts-layout/text-directionality) | Unicode isolates (LRI U+2066 … PDI U+2069) for opposite-direction runs |
| FL | [Fluent UI icon metadata](https://github.com/microsoft/fluentui-system-icons) ([RTL discussion](https://github.com/microsoft/fluentui/discussions/30956)) and [Fluent 2 typography](https://fluent2.microsoft.design/typography) | Send/Undo/Redo/Reply are flagged "mirror", and arrows/chevrons ship directional variants. Search, Checkmark, Clock, Call, Filter, Mail and More are not mirrored. Arabic text is right-aligned. |
| DIG | [LOCALE_IDIGITSUBSTITUTION](https://learn.microsoft.com/en-us/windows/win32/intl/locale-idigitsubstitution), [digit shapes](https://learn.microsoft.com/en-us/windows/win32/intl/digit-shapes) | Many Arabic locales use European digits; supports SG's Western-digit rule |

## Design decisions

| Area | Decision | Basis |
|---|---|---|
| Navigation | Site map on the right. Group labels and item icons sit at the inline start; the collapse chevron points toward the edge it collapses into. | LB, MIR |
| Command bar | Starts at the right with Back (→) first; overflow (⋯) ends on the left | MIR, LB |
| BPF stage bar | New (1) at the right → Close (9) at the left; connectors run right to left | LB (process bar mirrors), MOS stage names |
| Form header and tabs | Name and Lead badge at the right; Lead ID / Location / Owner at the left. Tabs ordered right to left. | MIR |
| Forms | Labels and values right-aligned; the required `*` follows the label (to its left). Phone and email inputs get `dir="ltr"` but stay aligned to the field's start (right). | FL typography, BIDI |
| Grid | Checkbox column at the far right, columns mirror, row action ("فتح") at the left. Sort/filter menus open from the inline end. | MIR |
| Side panes | Create lead, Log activity, live call, Sales Co-Pilot and the dashboard drawer open from the **left** | LB (Copilot pane top-left in Arabic) |
| Icons | Mirrored: arrows, chevrons, send, reply, undo/redo, sort, list/checklist, edit-note, open-in-new (arrow points up-left), split-view. Not mirrored: search, phone, clock, checkmarks, charts, media, brand logos, car photos, the trade-in damage diagram. | FL, MIR |
| Arrows inside text | `→` becomes `←` in Arabic strings. `›` and `‹` are left alone because Unicode bidi mirroring already flips them. | BIDI |
| Digits | Western 0–9 everywhere; no Arabic-Indic substitution | SG §4.1.12, DIG |
| Percent | `%84` (sign first, no space) | SG §4.1.15 |
| Dates and times | Gregorian. Month names يناير…ديسمبر, weekdays الاثنين…الأحد, AM/PM → ص/م. Numeric stamps (`2026-07-08 11:20`) kept as-is inside an LTR isolate. | SG, DIG (ar-AE is Gregorian; Hijri would only apply to ar-SA by default) |
| Currency | `AED 159,900` kept in Latin as one LTR run, as the currency record would show it | No Microsoft source fixes د.إ vs AED (flagged) |
| Counts | Written as "label: N" (e.g. `العملاء المتوقعون: 13`), which avoids Arabic number–noun agreement errors with variable N | SG (0/1/2 agreement rules) |
| Mixed content | Phones, date-time stamps, emails and URLs are wrapped in LRI…PDI. Untranslated Latin-only text (names, models, VINs) is isolated whole, so trailing punctuation stays with it ("Mariam K."). | BIDI, MIR |
| Record data | Not translated: names, notes, timeline text, showroom records, product names and trims, competitor specs, Copilot drafts (which follow the customer's preferred language). Option-set values (Rating, Stage, Source, Status, discovery answers) are translated. | D365 behaviour: UI and metadata labels are localized, data is not |
| Brand names | Dynamics 365, Copilot, WhatsApp, UAE Pass, DocuSign, EXEED, F&O stay in Latin, placed after the Arabic noun (`Copilot المبيعات`, `أوامر JAFZA`) | SG §4.1.4/§4.1.8, LB |
| Typography | **Almarai** for all Arabic UI text, self-hosted and limited by `unicode-range` to Arabic script. It leads the stack (`'Almarai', 'Segoe UI', 'Inter', …`), so Arabic letters render in Almarai. Latin text, digits, IDs, phone numbers, acronyms (SLA, KPI, VIN, AED) and model names fall through to the same font English uses.<br>Weight mapping: 400–500 → Regular, 600–700 → Bold, 800–900 → ExtraBold, so there is no faux bolding.<br>Forced uppercase and letter-spacing are removed for Arabic; body line-height is 1.5.<br>Pills, badges, table headers, IDs and phones don't wrap. Long KPI captions wrap to a second line instead of truncating. | Product decision |
| Voice | Commands as verbal nouns (حفظ، تحرير، إلغاء الأمر); confirmations as second-person questions (هل تريد حذف العميل المتوقع؟); polite requests with يُرجى | SG |

## Terminology

**Confirmed against Microsoft sources (T, QL, ACT, CL, CO, QT, MOS):**
- العميل المتوقع: lead
- العملاء المتوقعون: leads
- الفرصة: opportunity
- الحساب: account
- جهة الاتصال: contact
- المالك: owner
- الحالة: status
- التصنيف: rating
  - قوي / متوسط / ضعيف: Hot / Warm / Cold
- تأهيل / إلغاء تأهيل: Qualify / Disqualify
- مؤهل: Qualified
- الأنشطة: activities
- مكالمة هاتفية: phone call
- مهمة: task
- موعد: appointment
- ملاحظات: notes
- البريد الإلكتروني: email
- الاسم الأول / الاسم الأخير: first / last name
- عرض أسعار: quote
- المخطط الزمني: timeline
- تفاصيل: details
- مرتبطة / السجلات المرتبطة: related
- لوحة المعلومات: dashboard
- الرئيسية: home
- حفظ / حفظ وإغلاق / جديد / تحرير / حذف / بحث / تصفية / فرز / تحديث / مشاركة / تعيين: Save / Save & Close / New / Edit / Delete / Search / Filter / Sort / Refresh / Share / Assign
- إلغاء الأمر: Cancel
- تحديد الكل: select all
- الإطار الزمني للشراء: purchase timeframe
- الاقتراح / الإغلاق: Propose / Close stages
- متخذ القرار: decision maker
- منافس: competitor
- تدفق المبيعات: pipeline

**Needs business validation.** There is no Microsoft Arabic string for these, or the evidence was weak:

| English | Used | Note |
|---|---|---|
| My Active Leads | عملائي المتوقعون النشطون | Follows the SG possessive rule |
| Test drive | تجربة قيادة | Microsoft's only term (إصدار تجريبي) means a software trial |
| Trade-in | الاستبدال | GCC dealers also use مقايضة |
| Walk-in | زيارة مباشرة | |
| Showroom | صالة العرض | معرض is also common in the UAE |
| Proposal (vs Quote) | مقترح (vs عرض أسعار) | Kept distinct because the journey has both |
| Lead Temperature | تصنيف العميل المتوقع | Mapped to D365 Rating, with Hot/Warm/Cold = قوي/متوسط/ضعيف |
| Close — Won / Lost | الإغلاق — مربحة / خاسرة | Microsoft prose varies (مربحة/فائزة/رابحة) |
| Discovery | الاستكشاف | |
| Sales Executive | مسؤول المبيعات | SG prefers inclusive wording over مندوب |
| Mobile | المحمول | Microsoft uses both المحمول and الجوال; UAE usage favours المحمول |
| Recent / Pinned / Back | الأخيرة / المثبتة / رجوع | |
| Created / Assigned (SLA tiles) | تاريخ الإنشاء / تاريخ التعيين | |
| SLA, CSI, NPS, VIN, F&O | kept in Latin | SG allows acronyms in Latin where space is short; spell out in help text if needed |
| AED | kept in Latin | Alternative: د.إ placed after the number |
| Sales Co-Pilot | Copilot المبيعات | Product naming decision |

## Validation (Chrome, 1440×900, automated and visual)

- **Navigation:** the site map, command bar, BPF, tabs and panes mirror as in LB.
  - The collapse control and Back arrow point the RTL way.
  - Popover menus anchor to the inline end.
- **Terminology:** every string on the three pages resolves through the glossary above.
  - A crawl of every lead × 9 BPF stages × 6 tabs, every Log-activity outcome, the booking/quotation/payment flows, the Copilot tabs and every dashboard drill-down drawer left only record/product data in Latin.
- **Forms:** labels, required markers, lookups and selects are right-aligned.
  - Phone and email values read LTR.
  - Select values stay English internally, so filters and saves keep working (tested: the Rating filter in Arabic returns the same rows as in English).
- **Tables:** column order, sort/filter menus and the row checkbox mirror. Lead IDs and phone numbers stay intact.
- **Mixed content:** demo lead **Ahmed Al Mansoori** (L-2026-04838) carries:
  - company شركة النور للتجارة
  - location دبي، الإمارات العربية المتحدة
  - email ahmed@company.ae
  - phone +971 50 123 4567
  - an Arabic timeline note

  It renders correctly in both languages, and Arabic data stays RTL inside the English UI.
- **Icons:** only the directional set is mirrored. The car photos and the trade-in damage diagram keep their physical orientation, because damage marks map to real car positions.
- **Typography:** no clipping at 1.5 line-height.
  - Two compact proposal buttons use the shorter البريد (context override) instead of wrapping البريد الإلكتروني.
- **Language switch:** with a lead open on stage 2 (Discovery tab) and a Rating filter set, English → العربية → English kept:
  - the lead
  - the stage
  - the tab
  - the filter
  - the open panel

  The page text after the round trip is identical to the original.
- **English regression:** LTR screenshots before and after the logical-property conversion are pixel-identical. The only remaining English changes are the language switch and the added demo lead.

**Still recommended before go-live:**
- A native-speaker review of the flagged terms with UAE sales users.
- Checking a live Dynamics 365 org set to Arabic (Settings → Personalization → Languages) for Close as Won/Lost, Recent/Pinned and paging labels.
