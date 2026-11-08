/* Customer 360 sample data + search engine, shared by global-search.js (top-bar
 * suggestions on every page) and customer-360.html (results page + 360 record).
 * In Dynamics 365 this maps to Dataverse search over Contact, Account, Lead,
 * Opportunity, Quote, Sales order, Device (vehicle), Service appointment,
 * Service contract and Rental contract — grouped by the customer they belong to. */
(function () {
  var C = [
    {
      id: 'C039112', type: 'Individual', name: 'Ahmed Al Mansoori', initials: 'AM', av: 'linear-gradient(135deg,#2a6797,#00203f)',
      mobile: '+971 50 123 4567', phone2: '+971 4 331 2290', email: 'ahmed.mansoori@email.ae', emiratesId: '784-1985-1234567-1',
      city: 'Dubai', nationality: 'UAE', language: 'Arabic', since: '2021', owner: 'Mariam Khalil', showroom: 'SZR Showroom — Dubai',
      ltv: 'AED 612,400', lastActivity: 'Service visit · 2 days ago', segment: 'Loyal · repeat buyer',
      vehicles: [
        { model: 'EXEED RX', variant: 'Flagship AWD', year: 2026, vin: 'LVX-2026-057841', plate: 'Dubai A 48211', reg: '14 Jul 2026', warranty: 'Jul 2031', odo: '3,240 km', lastService: '—', nextService: '12 Jan 2027 · 10,000 km', status: 'Active', color: 'Graphite Grey', img: 'assets/es/ext-matte-gray.png' },
        { model: 'EXEED TXL', variant: 'Luxury', year: 2022, vin: 'LVX-2022-011902', plate: 'Dubai K 90317', reg: '02 Mar 2022', warranty: 'Mar 2027', odo: '68,410 km', lastService: '04 Nov 2026', nextService: '04 May 2027 · 75,000 km', status: 'Active', color: 'Pearl White', img: 'assets/es/ext-white.png' }
      ],
      leads: [
        { id: 'L-2026-04801', topic: 'EXEED RX — upgrade enquiry', source: 'WhatsApp', created: '02 Jun 2026', rating: 'Hot', status: 'Qualified', owner: 'Mariam Khalil' },
        { id: 'L-2026-05530', topic: 'EXEED VX — second car for family', source: 'Website', created: '28 Oct 2026', rating: 'Warm', status: 'Contacted', owner: 'Mariam Khalil' }
      ],
      opportunities: [
        { id: 'OP-2026-1188', topic: 'EXEED RX Flagship AWD', stage: 'Won', value: 'AED 189,900', probability: '100%', close: '10 Jul 2026', owner: 'Mariam Khalil' },
        { id: 'OP-2026-1460', topic: 'EXEED VX Premium', stage: 'Propose', value: 'AED 159,900', probability: '60%', close: '30 Nov 2026', owner: 'Mariam Khalil' }
      ],
      testDrives: [
        { id: 'TD-2026-2207', model: 'EXEED RX', date: '20 Jun 2026 · 11:00', showroom: 'SZR Showroom', outcome: 'Very positive', status: 'Completed' },
        { id: 'TD-2026-3102', model: 'EXEED VX', date: '09 Nov 2026 · 16:30', showroom: 'SZR Showroom', outcome: '—', status: 'Scheduled' }
      ],
      tradeIns: [
        { id: 'TI-2026-0412', vehicle: 'Toyota Land Cruiser 2019', mileage: '96,500 km', appraisal: 'AED 112,000', offered: 'AED 108,000', status: 'Accepted', appraiser: 'Used-car desk' }
      ],
      proposals: [
        { id: 'P-2026-1001', model: 'EXEED RX Flagship AWD', color: 'Graphite Grey', price: 'AED 189,900', addOns: 'Tinting · Ceramic coating', status: 'Converted to quote', date: '22 Jun 2026' },
        { id: 'P-2026-1609', model: 'EXEED VX Premium', color: 'Passion Red', price: 'AED 159,900', addOns: 'Service pack 3 yrs', status: 'Draft', date: '01 Nov 2026' }
      ],
      quotations: [
        { id: 'Q-2026-0877', model: 'EXEED RX Flagship AWD', amount: 'AED 194,350', valid: '15 Jul 2026', status: 'Won', approved: 'Approved by manager' }
      ],
      salesOrders: [
        { id: 'SO-2026-0654', model: 'EXEED RX Flagship AWD', date: '10 Jul 2026', status: 'Delivered', amount: 'AED 194,350',
          paymentTerms: '20% advance · balance on delivery', paymentMode: 'Bank finance + card (advance)', advance: 'AED 38,870 · Card',
          finance: { amount: 'AED 155,480', bank: 'Emirates NBD Auto Loan', tenure: '60 months', rate: '2.49% flat', emi: 'AED 2,915 / month', status: 'Disbursed' },
          tradeIn: 'AED 108,000 adjusted', invoice: 'INV-2026-01544' }
      ],
      deals: [
        { id: 'DL-2026-0654', vehicle: 'EXEED RX Flagship AWD', delivered: '14 Jul 2026', addOns: 'Tinting · Ceramic coating · Floor mats', vas: 'AED 4,450', csat: '9 / 10' }
      ],
      serviceUpcoming: [
        { id: 'SA-2026-8812', date: '12 Jan 2027 · 09:30', type: '10,000 km service', vehicle: 'EXEED RX · A 48211', workshop: 'Al Quoz Service Centre', advisor: 'Rami Nasser', status: 'Booked' }
      ],
      servicePast: [
        { id: 'SA-2026-8410', date: '04 Nov 2026', type: '65,000 km service + brake pads', vehicle: 'EXEED TXL · K 90317', workshop: 'Al Quoz Service Centre', amount: 'AED 1,840', csat: '10 / 10', status: 'Closed' },
        { id: 'SA-2026-5122', date: '18 May 2026', type: '60,000 km service', vehicle: 'EXEED TXL · K 90317', workshop: 'Al Quoz Service Centre', amount: 'AED 1,120', csat: '9 / 10', status: 'Closed' }
      ],
      serviceContracts: [
        { id: 'SC-2026-0331', plan: 'EXEED Care 5 yrs / 100,000 km', vehicle: 'EXEED RX · A 48211', start: '14 Jul 2026', end: '13 Jul 2031', usage: '0 of 10 visits', status: 'Active' },
        { id: 'SC-2022-0119', plan: 'Extended warranty +2 yrs', vehicle: 'EXEED TXL · K 90317', start: '02 Mar 2025', end: '01 Mar 2027', usage: 'Claims: 1', status: 'Expiring soon' }
      ],
      rentals: [
        { id: 'RC-2026-0071', vehicle: 'EXEED LX (courtesy car)', period: '04 Nov – 06 Nov 2026', rate: 'Complimentary', reason: 'While TXL in service', status: 'Returned' }
      ],
      profile: { type: 'Individual', occupation: 'Senior Engineer, DEWA', employer: 'DEWA', income: 'AED 45k+ / month', household: 'Married · 3 children', dob: '12 Apr 1985' },
      marketing: { consentEmail: true, consentSms: true, consentWhatsapp: true, consentCalls: false, segments: ['Loyal owners', 'Family SUV', 'Service-active'], lastCampaign: 'RX Owners Weekend — opened, clicked', preferredChannel: 'WhatsApp', nps: '9 (Promoter)' },
      billing: { address: 'Villa 14, Street 21, Al Barsha 2, Dubai', trn: '—', currency: 'AED', terms: 'Pay on invoice', method: 'Card on file ···· 4421', credit: 'No outstanding' },
      timeline: [
        { icon: 'build', kind: 'service', text: 'TXL 65,000 km service closed — CSAT 10/10', time: '04 Nov 2026' },
        { icon: 'directions_car', kind: 'sales', text: 'Test drive booked — EXEED VX, 09 Nov', time: '02 Nov 2026' },
        { icon: 'request_quote', kind: 'sales', text: 'Proposal P-2026-1609 drafted — VX Premium', time: '01 Nov 2026' },
        { icon: 'chat', kind: 'sales', text: 'WhatsApp — asked about a second car for the family', time: '28 Oct 2026' },
        { icon: 'local_shipping', kind: 'sales', text: 'RX delivered — red-carpet handover', time: '14 Jul 2026' }
      ],
      nba: { title: 'Bundle the VX with a family offer', desc: 'Ahmed is a repeat buyer (NPS 9) with a VX test drive on 09 Nov. His TXL extended warranty expires in Mar 2027 — <strong>offer a TXL trade-in</strong> against the VX to keep him in the brand.', btns: ['Prepare trade-in offer', 'Open VX proposal'] }
    },
    {
      id: 'C039050', type: 'Company', name: 'Al Noor Trading LLC', initials: 'AN', av: 'linear-gradient(135deg,#0f6c6c,#0a3d3d)',
      mobile: '+971 56 147 4682', phone2: '+971 2 644 1100', email: 'fleet@alnoortrading.ae', emiratesId: '—', tradeLicence: 'CN-1048821',
      city: 'Abu Dhabi', nationality: '—', language: 'English', since: '2019', owner: 'Karim Mostafa', showroom: 'Abu Dhabi Corniche',
      ltv: 'AED 2.94M', lastActivity: 'Fleet quote sent · yesterday', segment: 'Fleet · corporate',
      primaryContact: 'Omar Bilal (Fleet Manager)',
      vehicles: [
        { model: 'EXEED LX', variant: 'Premium', year: 2025, vin: 'LVX-2025-033120', plate: 'AD 12 77104', reg: '10 Jan 2025', warranty: 'Jan 2030', odo: '41,220 km', lastService: '20 Oct 2026', nextService: '20 Apr 2027', status: 'Active', color: 'Pearl White', img: 'assets/es/ext-white.png' },
        { model: 'EXEED LX', variant: 'Premium', year: 2025, vin: 'LVX-2025-033121', plate: 'AD 12 77105', reg: '10 Jan 2025', warranty: 'Jan 2030', odo: '38,900 km', lastService: '20 Oct 2026', nextService: '20 Apr 2027', status: 'Active', color: 'Pearl White', img: 'assets/es/ext-white.png' },
        { model: 'EXEED TXL', variant: 'Luxury', year: 2023, vin: 'LVX-2023-019876', plate: 'AD 5 40021', reg: '05 Jun 2023', warranty: 'Jun 2028', odo: '92,300 km', lastService: '02 Sep 2026', nextService: 'Overdue · 95,000 km', status: 'Service due', color: 'Graphite Grey', img: 'assets/es/ext-matte-gray.png' }
      ],
      leads: [
        { id: 'L-2026-05011', topic: 'Fleet renewal — 12 × EXEED VX', source: 'Corporate sales', created: '15 Sep 2026', rating: 'Hot', status: 'Qualified', owner: 'Karim Mostafa' }
      ],
      opportunities: [
        { id: 'OP-2026-1402', topic: 'Fleet renewal — 12 × EXEED VX', stage: 'Propose', value: 'AED 1.74M', probability: '70%', close: '15 Dec 2026', owner: 'Karim Mostafa' }
      ],
      testDrives: [
        { id: 'TD-2026-2950', model: 'EXEED VX', date: '02 Oct 2026 · 10:00', showroom: 'Abu Dhabi Corniche', outcome: 'Fleet manager approved', status: 'Completed' }
      ],
      tradeIns: [
        { id: 'TI-2026-0590', vehicle: '8 × Nissan Altima 2021', mileage: 'avg 140,000 km', appraisal: 'AED 296,000', offered: 'AED 280,000', status: 'Under appraisal', appraiser: 'Used-car desk' }
      ],
      proposals: [
        { id: 'P-2026-1522', model: '12 × EXEED VX Premium', color: 'Pearl White', price: 'AED 1,738,800', addOns: 'Fleet tracking · 5-yr service', status: 'Sent to customer', date: '05 Nov 2026' }
      ],
      quotations: [
        { id: 'Q-2026-1311', model: '12 × EXEED VX Premium', amount: 'AED 1,825,740', valid: '05 Dec 2026', status: 'Pending manager approval', approved: '—' }
      ],
      salesOrders: [
        { id: 'SO-2025-0102', model: '2 × EXEED LX Premium', date: '08 Jan 2025', status: 'Invoiced', amount: 'AED 318,000',
          paymentTerms: 'Net 30 · corporate credit', paymentMode: 'Bank transfer', advance: 'AED 0 · corporate account',
          finance: { amount: '—', bank: 'No finance (cash purchase)', tenure: '—', rate: '—', emi: '—', status: 'Paid in full' },
          tradeIn: '—', invoice: 'INV-2025-00031' }
      ],
      deals: [
        { id: 'DL-2025-0102', vehicle: '2 × EXEED LX Premium', delivered: '10 Jan 2025', addOns: 'Fleet tracking', vas: 'AED 6,200', csat: '8 / 10' }
      ],
      serviceUpcoming: [
        { id: 'SA-2026-8890', date: 'To be booked', type: '95,000 km service (overdue)', vehicle: 'EXEED TXL · AD 5 40021', workshop: 'Mussafah Service Centre', advisor: 'Huda Baker', status: 'Reminder sent' }
      ],
      servicePast: [
        { id: 'SA-2026-8102', date: '20 Oct 2026', type: '40,000 km service × 2', vehicle: 'EXEED LX · AD 12 77104/5', workshop: 'Mussafah Service Centre', amount: 'AED 2,360', csat: '8 / 10', status: 'Closed' }
      ],
      serviceContracts: [
        { id: 'SC-2025-0044', plan: 'Fleet Care — 3 yrs, all vehicles', vehicle: '3 vehicles', start: '10 Jan 2025', end: '09 Jan 2028', usage: '7 of 18 visits', status: 'Active' }
      ],
      rentals: [
        { id: 'RC-2026-0240', vehicle: '2 × EXEED LX', period: '01 Oct 2026 – 31 Mar 2027', rate: 'AED 4,200 / vehicle / month', reason: 'Fleet top-up', status: 'Active' }
      ],
      profile: { type: 'Company', industry: 'Trading & distribution', tradeLicence: 'CN-1048821 · ADDED', trn: '100 3344 5566 0003', employees: '450', fleet: '38 vehicles (11 EXEED)', parent: '—' },
      marketing: { consentEmail: true, consentSms: false, consentWhatsapp: true, consentCalls: true, segments: ['Fleet', 'Corporate Abu Dhabi'], lastCampaign: 'Fleet Day 2026 — attended', preferredChannel: 'Email', nps: '8 (Passive)' },
      billing: { address: 'Office 1203, Al Noor Tower, Hamdan St, Abu Dhabi', trn: '100 3344 5566 0003', currency: 'AED', terms: 'Net 30', method: 'Bank transfer', credit: 'Limit AED 500k · used AED 168k' },
      timeline: [
        { icon: 'request_quote', kind: 'sales', text: 'Fleet proposal P-2026-1522 sent — 12 × VX', time: '05 Nov 2026' },
        { icon: 'notifications', kind: 'service', text: 'Overdue-service reminder sent — TXL AD 5 40021', time: '03 Nov 2026' },
        { icon: 'build', kind: 'service', text: '2 × LX 40,000 km service closed', time: '20 Oct 2026' },
        { icon: 'car_rental', kind: 'service', text: 'Rental RC-2026-0240 started — 2 × LX', time: '01 Oct 2026' }
      ],
      nba: { title: 'Get the fleet quote approved', desc: 'A 12-vehicle VX quote (AED 1.83M) is <strong>waiting for manager approval</strong> and expires 05 Dec. One TXL is overdue for service — book it with the fleet handover to show service strength.', btns: ['Remind approver', 'Book overdue service'] }
    },
    {
      id: 'C039207', type: 'Individual', name: 'Hiren Patel', initials: 'HP', av: 'linear-gradient(135deg,#5b8def,#2a4f9e)',
      mobile: '+971 50 482 9120', phone2: '—', email: 'hiren.patel@email.ae', emiratesId: '784-1985-9123847-2',
      city: 'Dubai', nationality: 'India', language: 'English', since: '2026', owner: 'Mariam Saeed', showroom: 'SZR Showroom — Dubai',
      ltv: 'AED 0', lastActivity: 'Discovery call · today', segment: 'New prospect',
      vehicles: [],
      leads: [{ id: 'L-2026-04832', topic: 'EXEED LX Luxury — website configurator', source: 'Website — Configurator', created: '04 Nov 2026', rating: 'Hot', status: 'Discovery', owner: 'Mariam Saeed' }],
      opportunities: [], testDrives: [{ id: 'TD-2026-3150', model: 'EXEED LX', date: '09 Nov 2026 · 12:00', showroom: 'SZR Showroom', outcome: '—', status: 'Scheduled' }],
      tradeIns: [{ id: 'TI-2026-0702', vehicle: 'Honda CR-V 2020', mileage: '71,000 km', appraisal: 'Pending', offered: '—', status: 'Photos received', appraiser: 'Used-car desk' }],
      proposals: [], quotations: [], salesOrders: [], deals: [],
      serviceUpcoming: [], servicePast: [], serviceContracts: [], rentals: [],
      profile: { type: 'Individual', occupation: 'IT Consultant', employer: '—', income: 'AED 25–35k / month', household: 'Married · 1 child', dob: '—' },
      marketing: { consentEmail: true, consentSms: true, consentWhatsapp: true, consentCalls: true, segments: ['New prospect', 'Configurator lead'], lastCampaign: 'LX launch — clicked', preferredChannel: 'Phone', nps: '—' },
      billing: { address: '—', trn: '—', currency: 'AED', terms: '—', method: '—', credit: '—' },
      timeline: [
        { icon: 'call', kind: 'sales', text: 'Discovery call — budget AED 3–4k / month', time: 'Today' },
        { icon: 'event', kind: 'sales', text: 'Customer confirmed weekend availability', time: 'Yesterday' },
        { icon: 'language', kind: 'sales', text: 'Lead created from website configurator', time: '04 Nov 2026' }
      ],
      nba: { title: 'Prepare the test drive', desc: 'Hiren is a <strong>Hot</strong> first-time buyer with a test drive on 09 Nov and a CR-V to trade in. Get the trade-in appraised before he arrives so you can quote a net monthly figure.', btns: ['Request appraisal', 'Open lead'] }
    },
    {
      id: 'C038764', type: 'Individual', name: 'Fatima Al Zaabi', initials: 'FZ', av: 'linear-gradient(135deg,#c2557a,#7a1f45)',
      mobile: '+971 50 789 0123', phone2: '—', email: 'fatima.zaabi@email.ae', emiratesId: '784-1990-5566778-3',
      city: 'Sharjah', nationality: 'UAE', language: 'Arabic', since: '2024', owner: 'Nadia Farouk', showroom: 'Sharjah Showroom',
      ltv: 'AED 151,300', lastActivity: 'Service reminder · 5 days ago', segment: 'Service-active owner',
      vehicles: [{ model: 'EXEED VX', variant: 'Premium', year: 2024, vin: 'LVX-2024-024455', plate: 'Sharjah 3 22918', reg: '20 Feb 2024', warranty: 'Feb 2029', odo: '29,870 km', lastService: '15 Aug 2026', nextService: '15 Nov 2026 · 30,000 km', status: 'Service due', color: 'Passion Red', img: 'assets/es/ext-red.png' }],
      leads: [], opportunities: [{ id: 'OP-2024-0211', topic: 'EXEED VX Premium', stage: 'Won', value: 'AED 149,900', probability: '100%', close: '15 Feb 2024', owner: 'Nadia Farouk' }],
      testDrives: [], tradeIns: [], proposals: [], quotations: [],
      salesOrders: [{ id: 'SO-2024-0188', model: 'EXEED VX Premium', date: '15 Feb 2024', status: 'Delivered', amount: 'AED 151,300',
        paymentTerms: 'Full payment before delivery', paymentMode: 'Bank finance', advance: 'AED 30,260 · Bank transfer',
        finance: { amount: 'AED 121,040', bank: 'ADCB Auto Finance', tenure: '48 months', rate: '2.75% flat', emi: 'AED 2,800 / month', status: 'Active · 14 EMIs left' },
        tradeIn: '—', invoice: 'INV-2024-00410' }],
      deals: [{ id: 'DL-2024-0188', vehicle: 'EXEED VX Premium', delivered: '20 Feb 2024', addOns: 'Tinting', vas: 'AED 1,400', csat: '9 / 10' }],
      serviceUpcoming: [{ id: 'SA-2026-8955', date: '15 Nov 2026 · 08:30', type: '30,000 km service', vehicle: 'EXEED VX · 3 22918', workshop: 'Sharjah Service Centre', advisor: 'Yara Kassem', status: 'Pending confirmation' }],
      servicePast: [{ id: 'SA-2026-6021', date: '15 Aug 2026', type: '20,000 km service', vehicle: 'EXEED VX · 3 22918', workshop: 'Sharjah Service Centre', amount: 'AED 690', csat: '9 / 10', status: 'Closed' }],
      serviceContracts: [{ id: 'SC-2024-0090', plan: 'EXEED Care 3 yrs / 60,000 km', vehicle: 'EXEED VX · 3 22918', start: '20 Feb 2024', end: '19 Feb 2027', usage: '3 of 6 visits', status: 'Active' }],
      rentals: [],
      profile: { type: 'Individual', occupation: 'Teacher', employer: 'Ministry of Education', income: '—', household: 'Single', dob: '—' },
      marketing: { consentEmail: true, consentSms: true, consentWhatsapp: true, consentCalls: false, segments: ['Service-active', 'Sharjah owners'], lastCampaign: 'Winter service offer — opened', preferredChannel: 'WhatsApp', nps: '9 (Promoter)' },
      billing: { address: 'Al Nahda, Sharjah', trn: '—', currency: 'AED', terms: 'Pay on invoice', method: 'Card', credit: 'No outstanding' },
      timeline: [
        { icon: 'notifications', kind: 'service', text: '30,000 km service reminder sent (WhatsApp)', time: '02 Nov 2026' },
        { icon: 'build', kind: 'service', text: '20,000 km service closed', time: '15 Aug 2026' },
        { icon: 'local_shipping', kind: 'sales', text: 'VX delivered', time: '20 Feb 2024' }
      ],
      nba: { title: 'Confirm the 15 Nov service', desc: 'The 30,000 km service is <strong>pending confirmation</strong>. Her finance ends in 14 months — a good moment to mention the VX upgrade programme at the visit.', btns: ['Confirm appointment', 'Send WhatsApp'] }
    },
    {
      id: 'C039301', type: 'Individual', name: 'Prakash Chandran', initials: 'PC', av: 'linear-gradient(135deg,#8a6420,#4a3410)',
      mobile: '+971 50 957 8376', phone2: '+971 6 553 0192', email: 'prakash.c@email.ae', emiratesId: '784-1979-3344556-1',
      city: 'Sharjah', nationality: 'India', language: 'English', since: '2023', owner: 'Nadia Farouk', showroom: 'Sharjah Showroom',
      ltv: 'AED 118,900', lastActivity: 'Lost lead · 3 weeks ago', segment: 'Owner · price-sensitive',
      vehicles: [{ model: 'EXEED LX', variant: 'Comfort', year: 2023, vin: 'LVX-2023-015510', plate: 'Sharjah 1 70452', reg: '11 Sep 2023', warranty: 'Sep 2028', odo: '58,100 km', lastService: '30 Jun 2026', nextService: '30 Dec 2026', status: 'Active', color: 'Pearl White', img: 'assets/es/ext-white.png' }],
      leads: [{ id: 'L-2026-04410', topic: 'EXEED TXL — upgrade', source: 'Walk-in', created: '01 Oct 2026', rating: 'Cold', status: 'Disqualified — budget', owner: 'Nadia Farouk' }],
      opportunities: [], testDrives: [], tradeIns: [], proposals: [], quotations: [],
      salesOrders: [{ id: 'SO-2023-0901', model: 'EXEED LX Comfort', date: '08 Sep 2023', status: 'Delivered', amount: 'AED 118,900',
        paymentTerms: 'Full payment before delivery', paymentMode: 'Cash + cheque', advance: 'AED 20,000 · Cash',
        finance: { amount: '—', bank: 'No finance', tenure: '—', rate: '—', emi: '—', status: 'Paid in full' }, tradeIn: '—', invoice: 'INV-2023-00877' }],
      deals: [], serviceUpcoming: [], servicePast: [{ id: 'SA-2026-4410', date: '30 Jun 2026', type: '50,000 km service', vehicle: 'EXEED LX · 1 70452', workshop: 'Sharjah Service Centre', amount: 'AED 980', csat: '7 / 10', status: 'Closed' }],
      serviceContracts: [], rentals: [],
      profile: { type: 'Individual', occupation: 'Business owner', employer: 'Self-employed', income: '—', household: 'Married · 2 children', dob: '—' },
      marketing: { consentEmail: true, consentSms: false, consentWhatsapp: true, consentCalls: true, segments: ['Sharjah owners'], lastCampaign: 'TXL test-drive weekend — no response', preferredChannel: 'Phone', nps: '7 (Passive)' },
      billing: { address: 'Muwaileh, Sharjah', trn: '—', currency: 'AED', terms: 'Pay on invoice', method: 'Cash', credit: 'No outstanding' },
      timeline: [
        { icon: 'block', kind: 'sales', text: 'TXL upgrade lead disqualified — doesn’t fit budget', time: '14 Oct 2026' },
        { icon: 'build', kind: 'service', text: '50,000 km service closed — CSAT 7/10', time: '30 Jun 2026' }
      ],
      nba: { title: 'Win back with a service-led offer', desc: 'Budget blocked the TXL upgrade. His LX is due for service on 30 Dec — <strong>offer a trade-in valuation</strong> at that visit with the year-end finance rate.', btns: ['Book service + valuation', 'Log call'] }
    },
    {
      id: 'C039355', type: 'Individual', name: 'Charlotte Hayes', initials: 'CH', av: 'linear-gradient(135deg,#5c2e91,#2e1650)',
      mobile: '+971 55 532 4402', phone2: '—', email: 'charlotte.hayes@email.com', emiratesId: '784-1992-7788990-2',
      city: 'Abu Dhabi', nationality: 'UK', language: 'English', since: '2026', owner: 'Karim Mostafa', showroom: 'Abu Dhabi Corniche',
      ltv: 'AED 0', lastActivity: 'Rental started · 1 week ago', segment: 'Rental customer',
      vehicles: [], leads: [{ id: 'L-2026-05402', topic: 'Rent-to-own enquiry — EXEED LX', source: 'Instagram', created: '20 Oct 2026', rating: 'Warm', status: 'Contacted', owner: 'Karim Mostafa' }],
      opportunities: [], testDrives: [], tradeIns: [], proposals: [], quotations: [], salesOrders: [], deals: [],
      serviceUpcoming: [], servicePast: [], serviceContracts: [],
      rentals: [{ id: 'RC-2026-0288', vehicle: 'EXEED LX Premium', period: '31 Oct 2026 – 30 Apr 2027', rate: 'AED 3,900 / month', reason: 'Rent-to-own pilot', status: 'Active' }],
      profile: { type: 'Individual', occupation: 'Consultant', employer: '—', income: '—', household: '—', dob: '—' },
      marketing: { consentEmail: true, consentSms: true, consentWhatsapp: false, consentCalls: true, segments: ['Rental', 'Expat'], lastCampaign: 'Instagram LX reel', preferredChannel: 'Email', nps: '—' },
      billing: { address: 'Al Reem Island, Abu Dhabi', trn: '—', currency: 'AED', terms: 'Monthly in advance', method: 'Card on file ···· 9012', credit: 'No outstanding' },
      timeline: [
        { icon: 'car_rental', kind: 'service', text: 'Rental RC-2026-0288 started — EXEED LX', time: '31 Oct 2026' },
        { icon: 'photo_camera', kind: 'sales', text: 'Lead from Instagram — rent-to-own', time: '20 Oct 2026' }
      ],
      nba: { title: 'Convert the rental into a sale', desc: 'Charlotte is renting an LX on the rent-to-own pilot. <strong>Show the buy-out figure</strong> at month 3 — rental paid so far counts towards the down payment.', btns: ['Prepare buy-out quote', 'Schedule call'] }
    }
  ];

  // Lighter sample accounts so search and the Accounts list have realistic volume.
  var OWN = ['Mariam Khalil', 'Karim Mostafa', 'Nadia Farouk', 'Mariam Saeed'];
  var GR = ['linear-gradient(135deg,#2a6797,#00203f)', 'linear-gradient(135deg,#0f6c6c,#0a3d3d)', 'linear-gradient(135deg,#8a6420,#4a3410)', 'linear-gradient(135deg,#5c2e91,#2e1650)', 'linear-gradient(135deg,#c2557a,#7a1f45)', 'linear-gradient(135deg,#5b8def,#2a4f9e)'];
  [['C059611', 'Ahmad Hassan Trading', 'Company', 'Dubai', '+971 4 228 9011', 'info@ahmadhassan.ae', '2022', 'EXEED VX'],
   ['C071544', 'Ahammed Faseel Hamza', 'Individual', 'Sharjah', '+971 52 310 7745', 'faseel.h@email.ae', '2025', 'EXEED LX'],
   ['C041217', 'Saad Abdulrahman Al Hadi', 'Individual', 'Abu Dhabi', '+971 50 664 2210', 'saad.alhadi@email.ae', '2023', 'EXEED TXL'],
   ['C034682', 'Soha Ahmed Edaqil', 'Individual', 'Dubai', '+971 55 801 3307', 'soha.edaqil@email.ae', '2021', null],
   ['C076825', 'Hamad Abdalla Al Ahbabi', 'Individual', 'Al Ain', '+971 50 911 4682', 'hamad.ahbabi@email.ae', '2026', 'EXEED RX'],
   ['C062001', 'Shahid Ahmed Qureshi', 'Individual', 'Dubai', '+971 56 402 9981', 'shahid.q@email.ae', '2024', 'EXEED LX'],
   ['C064410', 'Farah Al Shehhi', 'Individual', 'Ras Al Khaimah', '+971 50 233 6670', 'farah.shehhi@email.ae', '2025', null],
   ['C058802', 'Al Ahram Logistics LLC', 'Company', 'Dubai', '+971 4 887 2100', 'fleet@alahram.ae', '2020', 'EXEED TXL'],
   ['C070315', 'Mubarak Ahmed Al Ali', 'Individual', 'Sharjah', '+971 52 778 1043', 'mubarak.alali@email.ae', '2026', null],
   ['C066190', 'Abdullah Ahmed Alshehhi', 'Individual', 'Fujairah', '+971 50 345 9120', 'abdullah.a@email.ae', '2024', 'EXEED VX'],
   ['C052733', 'Kamaluddin Ahamed Basheer', 'Individual', 'Abu Dhabi', '+971 55 612 0098', 'k.basheer@email.ae', '2022', 'EXEED LX'],
   ['C073388', 'Sharaf Auto Parts LLC', 'Company', 'Sharjah', '+971 6 543 2200', 'purchasing@sharafparts.ae', '2023', null]
  ].forEach(function (r, k) {
    var co = r[2] === 'Company', ini = r[1].replace(/\b(Al|LLC)\b/g, '').trim().split(/\s+/), owner = OWN[k % OWN.length];
    var veh = r[7] ? [{ model: r[7], variant: 'Premium', year: +r[6], vin: 'LVX-' + r[6] + '-0' + (40100 + k * 37), plate: r[3] + ' ' + String.fromCharCode(65 + k) + ' ' + (21000 + k * 713), reg: '01 Mar ' + r[6], warranty: 'Mar ' + (+r[6] + 5), odo: (8000 + k * 6100).toLocaleString('en-US') + ' km', lastService: '—', nextService: 'Mar 2027', status: 'Active', color: 'Pearl White', img: 'assets/es/ext-white.png' }] : [];
    C.push({
      id: r[0], type: r[2], name: r[1], initials: (ini[0][0] + (ini[1] || ini[0])[0]).toUpperCase(), av: GR[k % GR.length],
      mobile: r[4], phone2: co ? r[4] : '—', email: r[5], emiratesId: co ? '—' : '784-19' + (70 + k) + '-' + (3300000 + k * 1111) + '-1', city: r[3], nationality: '—', language: 'English',
      since: r[6], owner: owner, showroom: r[3] === 'Abu Dhabi' || r[3] === 'Al Ain' ? 'Abu Dhabi Corniche' : r[3] === 'Sharjah' ? 'Sharjah Showroom' : 'SZR Showroom — Dubai',
      ltv: veh.length ? 'AED ' + (139 + k * 7) + ',900' : 'AED 0', lastActivity: veh.length ? 'Service reminder · this month' : 'Enquiry · this month', segment: co ? 'Corporate' : veh.length ? 'Owner' : 'Prospect',
      primaryContact: co ? 'Fleet desk' : undefined,
      vehicles: veh, leads: veh.length ? [] : [{ id: 'L-2026-0' + (6100 + k), topic: 'EXEED ' + ['LX', 'VX', 'RX'][k % 3] + ' enquiry', source: ['Website', 'Walk-in', 'WhatsApp'][k % 3], created: '0' + (1 + k % 9) + ' Oct 2026', rating: ['Hot', 'Warm', 'Cold'][k % 3], status: 'Contacted', owner: owner }],
      opportunities: [], testDrives: [], tradeIns: [], proposals: [], quotations: [], salesOrders: [], deals: [], serviceUpcoming: [], servicePast: [], serviceContracts: [], rentals: [],
      profile: co ? { type: 'Company', industry: 'Trading', employees: String(40 + k * 15), fleet: (k + 3) + ' vehicles' } : { type: 'Individual', occupation: '—', employer: '—', income: '—', household: '—', dob: '—' },
      marketing: { consentEmail: true, consentSms: k % 2 === 0, consentWhatsapp: true, consentCalls: true, segments: [co ? 'Corporate' : 'Retail'], lastCampaign: 'EXEED Autumn offers', preferredChannel: ['WhatsApp', 'Email', 'Phone'][k % 3], nps: '—' },
      billing: { address: r[3], trn: '—', currency: 'AED', terms: co ? 'Net 30' : 'Pay on invoice', method: co ? 'Bank transfer' : 'Card', credit: 'No outstanding' },
      timeline: [{ icon: veh.length ? 'notifications' : 'chat', kind: veh.length ? 'service' : 'sales', text: veh.length ? 'Service reminder sent' : 'Enquiry received', time: (10 + k) + ' Oct 2026' }],
      nba: { title: veh.length ? 'Book the next service' : 'Follow up the enquiry', desc: veh.length ? 'Service is due in March — <strong>book it early</strong> and offer the winter check.' : 'New enquiry — <strong>call within the SLA</strong> and offer a test drive.', btns: veh.length ? ['Book service', 'Send WhatsApp'] : ['Call now', 'Book test drive'] }
    });
  });

  // ── CRM account form fields (Account › Summary in D365: Account information, Address,
  //    Preferred business, Customer identifiers, Customer segmentation, Contacts, Recent cases) ──
  var CRM = {
    C039112: {
      accountNumber: 'ACC-039112', wholesaleCategory: 'Retail — Individual', fax: '—', website: '—', parentAccount: '—', ticker: '—', crNumber: '—',
      address: { street1: 'Villa 14, Street 21', street2: 'Al Barsha 2', street3: '—', city: 'Dubai', state: 'Dubai', zip: '—', country: 'United Arab Emirates', lat: 25.09, lng: 55.20 },
      preferredBusiness: [{ line: 'New vehicle sales', brand: 'EXEED', showroom: 'SZR Showroom — Dubai', since: 'Jun 2021' }, { line: 'After-sales service', brand: 'EXEED', showroom: 'Al Quoz Service Centre', since: 'Jul 2021' }],
      identifiers: [{ type: 'Emirates ID', number: '784-1985-1234567-1', issuer: 'ICP', expiry: '11 Apr 2029', verified: 'UAE Pass ✓' }, { type: 'Driving licence', number: 'DXB-2214509', issuer: 'RTA Dubai', expiry: '03 Mar 2030', verified: 'Scanned' }],
      segmentation: [{ segment: 'Loyal owners', category: 'Lifecycle', assigned: '14 Jul 2026', source: 'Rule — 2+ purchases' }, { segment: 'Family SUV', category: 'Interest', assigned: '02 Jun 2026', source: 'Discovery answers' }, { segment: 'Service-active', category: 'After-sales', assigned: '18 May 2026', source: 'Rule — visit < 6 months' }],
      contacts: [{ name: 'Ahmed Al Mansoori', role: 'Primary · self', email: 'ahmed.mansoori@email.ae', phone: '+971 50 123 4567' }, { name: 'Noura Al Mansoori', role: 'Spouse · second driver', email: 'noura.m@email.ae', phone: '+971 50 772 1180' }],
      cases: [{ id: 'CAS-2026-1120', title: 'Infotainment reboots on cold start — TXL', type: 'Technical', priority: 'Normal', status: 'Resolved', created: '06 Oct 2026' }]
    },
    C039050: {
      accountNumber: 'ACC-039050', wholesaleCategory: 'Corporate fleet', fax: '+971 2 644 1101', website: 'alnoortrading.ae', parentAccount: 'Al Noor Group Holding', ticker: '—', crNumber: 'CN-1048821',
      address: { street1: 'Office 1203, Al Noor Tower', street2: 'Hamdan Bin Mohammed St', street3: '—', city: 'Abu Dhabi', state: 'Abu Dhabi', zip: 'PO Box 44120', country: 'United Arab Emirates', lat: 24.49, lng: 54.37 },
      preferredBusiness: [{ line: 'Fleet sales', brand: 'EXEED', showroom: 'Abu Dhabi Corniche', since: 'Jan 2019' }, { line: 'Fleet service', brand: 'EXEED', showroom: 'Mussafah Service Centre', since: 'Jan 2025' }, { line: 'Rental', brand: 'EXEED', showroom: 'Abu Dhabi Corniche', since: 'Oct 2026' }],
      identifiers: [{ type: 'Trade licence', number: 'CN-1048821', issuer: 'ADDED', expiry: '30 Jun 2027', verified: 'Document ✓' }, { type: 'TRN (VAT)', number: '100 3344 5566 0003', issuer: 'FTA', expiry: '—', verified: 'FTA lookup ✓' }],
      segmentation: [{ segment: 'Fleet', category: 'Customer type', assigned: '10 Jan 2019', source: 'Manual' }, { segment: 'Corporate Abu Dhabi', category: 'Region', assigned: '10 Jan 2019', source: 'Rule — address' }],
      contacts: [{ name: 'Omar Bilal', role: 'Primary · Fleet Manager', email: 'omar.bilal@alnoortrading.ae', phone: '+971 56 147 4682' }, { name: 'Huda Barakat', role: 'Procurement', email: 'procurement@alnoortrading.ae', phone: '+971 2 644 1100' }, { name: 'Sami Doss', role: 'Finance — AP', email: 'ap@alnoortrading.ae', phone: '+971 2 644 1105' }],
      cases: [{ id: 'CAS-2026-1301', title: 'Fleet tracking unit offline — LX AD 12 77105', type: 'Technical', priority: 'High', status: 'In progress', created: '28 Oct 2026' }, { id: 'CAS-2026-0977', title: 'Invoice copy request — SO-2025-0102', type: 'Billing', priority: 'Low', status: 'Resolved', created: '12 Aug 2026' }]
    }
  };
  // Accounts as they exist in the CRM (D365 › All Accounts). Most fields are empty there too.
  [['C080101', 'ABB Inc.', '', '', '', ''], ['C080102', 'ABC', '', '', '', ''], ['C080103', 'AGI PT', '', '', '', ''],
   ['C080104', 'Al Ghurair Foods', '', '', '', ''], ['C080105', 'AL-Ghurair', '', '', 'Testify1 VM1', 'Testify1VM@gamil.com'],
   ['C080106', 'Al-Ghurair Foods', '', '', '', ''], ['C080107', 'ALGHURAIR FOODS LLC - OATS', '', '', '', ''],
   ['C080108', 'Arabian Packaging co LLC', '', '', '', ''], ['C080109', 'Bismillah Motors', '', '', '', ''],
   ['C080110', 'Bonjour Traders USA', '', '', '', ''], ['C080111', 'DCompany', '', '', '', ''], ['C080112', 'DLC company', '', '', '', ''],
   ['C080113', 'Ford Motors', '', '', '', ''], ['C080114', 'Fourth Coffee', '415-555-0102', 'San Francisco', '', '']
  ].forEach(function (r, k) {
    var w = r[1].replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/);
    C.push({
      id: r[0], type: 'Company', name: r[1], initials: (w[0][0] + (w[1] ? w[1][0] : (w[0][1] || ''))).toUpperCase(), av: ['linear-gradient(135deg,#c9a227,#8a6c10)', 'linear-gradient(135deg,#4a6fa5,#2a4f9e)', 'linear-gradient(135deg,#0f6c6c,#0a3d3d)', 'linear-gradient(135deg,#8a4fa5,#4a2a6e)'][k % 4],
      mobile: r[2], phone2: r[2] || '—', email: r[5], emiratesId: '—', city: r[3] || '—', nationality: '—', language: '—', since: '2026', owner: 'AGP InnovationCRM', showroom: '—',
      ltv: 'AED 0', lastActivity: 'Account created', segment: 'Account', primaryContact: r[4] || undefined, crmOnly: true,
      vehicles: [], leads: [], opportunities: r[1] === 'ABB Inc.' ? [{ id: 'OP-2026-0001', topic: 'ABB Inc.', stage: 'Qualify', value: '—', probability: '—', close: '—', owner: 'AGP InnovationCRM' }] : [],
      testDrives: [], tradeIns: [], proposals: [], quotations: [], salesOrders: [], deals: [], serviceUpcoming: [], servicePast: [], serviceContracts: [], rentals: [],
      profile: { type: 'Company', industry: '—', employees: '—', fleet: '—' },
      marketing: { consentEmail: true, consentSms: true, consentWhatsapp: true, consentCalls: true, segments: [], lastCampaign: '', preferredChannel: 'Any', nps: '—' },
      billing: { address: '—', trn: '—', currency: 'AED', terms: '—', method: '—', credit: '—' },
      timeline: [{ icon: 'smart_toy', kind: 'sales', text: 'Account created', time: '12 Jan 2026' }],
      nba: { title: 'Complete the account', desc: 'This account has <strong>no phone, address or contacts</strong> yet. Add a primary contact so sales and service can reach the customer.', btns: ['Add primary contact', 'Fill details with Form assist'] }
    });
  });
  // Contact as it exists in the CRM (D365 › Contacts › Tina Simona)
  C.push({
    id: 'C208676', contactId: '013685', type: 'Individual', name: 'Tina Simona', initials: 'TS', av: 'linear-gradient(135deg,#c99a7a,#8a5a3c)',
    mobile: '+971 50 827 4164', phone2: '—', email: 'Bareera080@gmail.com', emiratesId: '—', city: '—', nationality: 'UAE', language: '—', since: '2026',
    owner: '6651 Dual Write', showroom: '—', ltv: 'AED 0', lastActivity: 'Ownership transferred · 05 Nov 2026', segment: '', crmOnly: true,
    vehicles: [], leads: [], opportunities: [{ id: 'OP-2026-2214', topic: 'Tina Simona', stage: 'Qualify', value: '—', probability: '—', close: '—', owner: 'Sales SE' }],
    testDrives: [], tradeIns: [], proposals: [], quotations: [], salesOrders: [], deals: [], serviceUpcoming: [], servicePast: [], serviceContracts: [], rentals: [],
    profile: { type: 'Individual', gender: 'Female', marital: 'None', dob: '05/10/2009', occupation: '—', employer: '—', household: '—' },
    marketing: { consentEmail: true, consentSms: true, consentWhatsapp: true, consentCalls: true, segments: [], lastCampaign: '', preferredChannel: 'Any', nps: '—' },
    billing: { address: '—', trn: '—', currency: 'AED', terms: '—', method: '—', credit: '—' },
    timeline: [
      { icon: 'swap_horiz', kind: 'sales', text: 'Sales Activity Event (Closed) — Transferred ownership to Sales SE from Bareera Khan', time: '05 Nov 2026 · 07:16' },
      { icon: 'event_available', kind: 'sales', text: 'Sales Activity Event (Active) — Lead Created By SE. Customer confirmed visit for Thursday', time: '05 Nov 2026 · 07:15' },
      { icon: 'mail', kind: 'sales', text: 'Email from exeed.UAE@al-ghurair.com (Closed) — Proposal requested for Approval: Bareera Khan has submitted a proposal for approval', time: '05 Nov 2026 · 07:15' }
    ],
    nba: { title: 'Follow up the proposal approval', desc: 'A proposal for Tina was <strong>sent for approval</strong> and a showroom visit is confirmed for Thursday. Make sure the approved proposal is ready before she arrives.', btns: ['Check approval status', 'Prepare for visit'] }
  });
  CRM.C208676 = { contacts: [{ name: 'Tina Simona', role: 'Primary · self', email: 'Bareera080@gmail.com', phone: '+971 50 827 4164' }], address: { street1: '—', street2: '—', street3: '—', city: '—', state: '—', zip: '—', country: 'United Arab Emirates' } };
  CRM.C080101 = { contacts: [{ name: 'Ahmed Shabeer', role: 'Contact', email: 'New291999@gmail.com', phone: '' }, { name: 'Ahmed Shabeer', role: 'Contact', email: 'New29191@gmail.com', phone: '' }, { name: 'Ahmed Shabeer', role: 'Contact', email: 'New21@gmail.com', phone: '' }] };
  CRM.C080105 = { contacts: [{ name: 'Testify1 VM1', role: 'Primary contact', email: 'Testify1VM@gamil.com', phone: '' }] };

  // Customers without a hand-written form get sensible values from their own data.
  function crm(c) {
    var x = CRM[c.id] || {};
    var addr = (c.billing.address || '').split(',').map(function (t) { return t.trim(); });
    return {
      accountNumber: x.accountNumber || (c.crmOnly ? '' : 'ACC-' + c.id.slice(1)), wholesaleCategory: x.wholesaleCategory || (c.crmOnly ? '' : c.type === 'Company' ? 'Corporate' : 'Retail — Individual'),
      phone: c.mobile, fax: x.fax || '—', website: x.website || '—', parentAccount: x.parentAccount || '—', ticker: x.ticker || '—', crNumber: x.crNumber || '—',
      address: x.address || { street1: addr[0] || '—', street2: addr.length > 2 ? addr[1] : '—', street3: '—', city: c.city, state: c.city, zip: '—', country: 'United Arab Emirates' },
      preferredBusiness: x.preferredBusiness || (c.crmOnly ? [] : null) || [{ line: c.vehicles.length ? 'New vehicle sales' : 'Prospect — new vehicle', brand: 'EXEED', showroom: c.showroom, since: c.since }],
      identifiers: x.identifiers || (c.emiratesId && c.emiratesId !== '—' ? [{ type: 'Emirates ID', number: c.emiratesId, issuer: 'ICP', expiry: '—', verified: 'Pending' }] : []),
      segmentation: x.segmentation || (c.marketing.segments || []).map(function (sg) { return { segment: sg, category: 'Marketing', assigned: '—', source: 'Rule' }; }),
      contacts: x.contacts || (c.crmOnly ? [] : [{ name: c.name, role: 'Primary · self', email: c.email, phone: c.mobile }]),
      cases: x.cases || []
    };
  }

  // ── Search ──────────────────────────────────────────────────────────────
  var digits = function (s) { return String(s || '').replace(/\D/g, ''); };
  var low = function (s) { return String(s || '').toLowerCase(); };
  // Punctuation- and spacing-insensitive forms: "AL-Ghurair", "Al Ghurair" and "ALGHURAIR" all match.
  var nrm = function (s) { return low(s).replace(/[^a-z0-9@\u0600-\u06ff]+/g, ' ').trim(); };
  var sq = function (s) { return nrm(s).replace(/ /g, ''); };

  // What did the user type? Drives which fields are searched and the "Looks like…" hint.
  function intent(q) {
    var t = String(q || '').trim(), d = digits(t);
    if (!t) return null;
    if (/^784[\s-]?\d/.test(t) || (d.length === 15 && d.indexOf('784') === 0)) return { key: 'eid', label: 'Emirates ID', icon: 'badge' };
    if (/^(\+?971|0)?\s?5\d/.test(t.replace(/\s/g, '')) && d.length >= 5 && /^[\d\s+()-]+$/.test(t)) return { key: 'phone', label: 'Phone number', icon: 'call' };
    if (/^lvx|^[a-hj-npr-z0-9]{17}$/i.test(t.replace(/[\s-]/g, ''))) return { key: 'vin', label: 'VIN / chassis', icon: 'directions_car' };
    if (/^(dubai|sharjah|ad|abu dhabi)\s+[a-z0-9]{1,2}\s*\d{3,}/i.test(t)) return { key: 'plate', label: 'Plate number', icon: 'pin' };
    if (/^(l|op|q|so|p|sa|sc|rc|td|ti|c)-?\d/i.test(t)) return { key: 'record', label: 'Record number', icon: 'tag' };
    if (/@/.test(t)) return { key: 'email', label: 'Email', icon: 'mail' };
    if (t.split(/\s+/).length >= 3 && /\b(with|in|due|who|all|customers?|leads?|expir|overdue|finance|hot|fleet|this|month|week)\b/i.test(t)) return { key: 'nl', label: 'Question for Copilot', icon: 'auto_awesome' };
    return { key: 'name', label: 'Name or company', icon: 'person' };
  }

  // Every searchable thing a customer owns, with a label saying where it matched.
  function fields(c) {
    var f = [
      ['Name', c.name], ['Customer ID', c.id], ['Mobile', c.mobile], ['Phone', c.phone2], ['Email', c.email],
      ['Emirates ID', c.emiratesId], ['City', c.city], ['Primary contact', c.primaryContact], ['Trade licence', c.tradeLicence]
    ];
    c.vehicles.forEach(function (v) { f.push(['VIN', v.vin, v.model]); f.push(['Plate', v.plate, v.model]); });
    c.leads.forEach(function (x) { f.push(['Lead', x.id, x.topic]); });
    c.opportunities.forEach(function (x) { f.push(['Opportunity', x.id, x.topic]); });
    c.quotations.forEach(function (x) { f.push(['Quotation', x.id, x.model]); });
    c.proposals.forEach(function (x) { f.push(['Proposal', x.id, x.model]); });
    c.salesOrders.forEach(function (x) { f.push(['Sales order', x.id, x.model]); });
    c.serviceUpcoming.concat(c.servicePast).forEach(function (x) { f.push(['Service appointment', x.id, x.type]); });
    c.serviceContracts.forEach(function (x) { f.push(['Service contract', x.id, x.plan]); });
    c.rentals.forEach(function (x) { f.push(['Rental contract', x.id, x.vehicle]); });
    return f.filter(function (x) { return x[1] && x[1] !== '—'; });
  }

  // Copilot-style reading of a plain-language question into filters.
  function parseNL(q) {
    var t = low(q), f = [], test = [];
    var city = /sharjah/.test(t) ? 'Sharjah' : /abu dhabi/.test(t) ? 'Abu Dhabi' : /dubai/.test(t) ? 'Dubai' : null;
    if (city) { f.push('City = ' + city); test.push(function (c) { return c.city === city; }); }
    if (/service/.test(t) && /(due|overdue)/.test(t)) { f.push('Next service due ≤ 30 days'); test.push(function (c) { return c.vehicles.some(function (v) { return v.status === 'Service due'; }); }); }
    if (/expir/.test(t)) { f.push('Contract expiring ≤ 120 days'); test.push(function (c) { return c.serviceContracts.some(function (s) { return /Expiring/.test(s.status); }); }); }
    if (/finance/.test(t)) { f.push('Has active bank finance'); test.push(function (c) { return c.salesOrders.some(function (s) { return /Active|Disbursed/.test(s.finance.status); }); }); }
    if (/hot/.test(t)) { f.push('Lead rating = Hot'); test.push(function (c) { return c.leads.some(function (l) { return l.rating === 'Hot'; }); }); }
    if (/fleet|compan|corporate/.test(t)) { f.push('Customer type = Company'); test.push(function (c) { return c.type === 'Company'; }); }
    if (/rent/.test(t)) { f.push('Has rental contract'); test.push(function (c) { return c.rentals.length > 0; }); }
    if (/test drive/.test(t)) { f.push('Test drive scheduled'); test.push(function (c) { return c.testDrives.some(function (d) { return d.status === 'Scheduled'; }); }); }
    return { filters: f, test: function (c) { return test.length && test.every(function (fn) { return fn(c); }); } };
  }

  function search(q) {
    var t = String(q || '').trim(), it = intent(t);
    if (!it) return { intent: null, results: [] };
    if (it.key === 'nl') {
      var nl = parseNL(t);
      var r = nl.filters.length ? C.filter(nl.test).map(function (c) { return { c: c, score: 50, hits: nl.filters.map(function (f) { return { field: 'Copilot', value: f }; }) }; }) : [];
      return { intent: it, nl: nl.filters, results: r };
    }
    var lt = low(t), dt = digits(t), out = [];
    C.forEach(function (c) {
      var hits = [], score = 0;
      fields(c).forEach(function (f) {
        var v = String(f[1]), lv = low(v), hit = false, s = 0;
        if (lv === lt) { hit = true; s = 100; }
        else if (lv.indexOf(lt) === 0) { hit = true; s = 80; }
        else if (lv.split(/[\s—·-]+/).some(function (w) { return w.indexOf(lt) === 0; })) { hit = true; s = 70; }
        else if (lt.length >= 3 && lv.indexOf(lt) > -1) { hit = true; s = 50; }
        else if (lt.length >= 3 && (nrm(v).indexOf(nrm(t)) > -1 || sq(v).indexOf(sq(t)) > -1)) { hit = true; s = 60; }
        else if (dt.length >= 4 && /Mobile|Phone|Emirates ID/.test(f[0]) && digits(v).replace(/^971/, '0').indexOf(dt.replace(/^971/, '0')) > -1) { hit = true; s = 90; }
        if (hit) { hits.push({ field: f[0], value: v, ctx: f[2] }); score = Math.max(score, s + (f[0] === 'Name' ? 5 : 0)); }
      });
      if (hits.length) out.push({ c: c, score: score, hits: hits });
    });
    out.sort(function (a, b) { return b.score - a.score || a.c.name.localeCompare(b.c.name); });
    return { intent: it, results: out };
  }

  function get(id) { for (var i = 0; i < C.length; i++) if (C[i].id === id) return C[i]; return null; }

  // Bold the matched part of a value.
  function mark(text, q) {
    var s = String(text), t = String(q || '').trim();
    var esc = function (x) { return x.replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
    if (!t) return esc(s);
    var i = s.toLowerCase().indexOf(t.toLowerCase());
    if (i < 0) return esc(s);
    return esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + t.length)) + '</mark>' + esc(s.slice(i + t.length));
  }

  // Recent searches + recently viewed customers (localStorage, like D365's recent list).
  var RK = 'c360-recent', VK = 'c360-viewed';
  function readList(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function pushList(k, v, max) { var l = readList(k).filter(function (x) { return x !== v; }); l.unshift(v); try { localStorage.setItem(k, JSON.stringify(l.slice(0, max))); } catch (e) {} }

  window.C360 = {
    customers: C, search: search, intent: intent, get: get, mark: mark, crm: crm,
    recent: function () { var r = readList(RK); return r.length ? r : ['cha', '050 123 4567', 'Al Noor']; },
    addRecent: function (q) { if (String(q).trim()) pushList(RK, String(q).trim(), 6); },
    viewed: function () { var v = readList(VK).map(get).filter(Boolean); return v.length ? v : [C[0], C[1]]; },
    addViewed: function (id) { pushList(VK, id, 5); },
    counts: function (c) {
      return {
        vehicles: c.vehicles.length,
        openSales: c.leads.filter(function (l) { return !/Disqualified/.test(l.status); }).length + c.opportunities.filter(function (o) { return o.stage !== 'Won'; }).length,
        nextService: (c.serviceUpcoming[0] || {}).date || '—'
      };
    }
  };
})();
