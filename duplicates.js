/* Lead duplication rule — MAI-4776 (prototype, mock data only)
   Rules:
   - Match on Email, Phone or EID (exact; phone compared after normalising the format). Any one is enough.
   - Same brand only; compare only against open leads (not Closed / Won / Lost / Disqualified).
   - Blank values never match.
   - Never automatic: a user reviews and chooses Mark as duplicate or Continue.
   - Original = the earliest created lead in the group.
   - Mark as duplicate → Disqualified, reason "Duplicate", linked to the original; can't be reactivated.
   - Decision (user, Mark/Continue, time) is kept on the lead. Owner and SLA don't change.
   Shared by lead-detail.html and the persona dashboards. Decisions persist in localStorage. */
(function () {
  var ME = 'Priyamvada K.';
  var LEAD_PAGE = 'lead-detail.html';
  // Lead records the rule looks at (ids that also exist on the lead page keep the same values).
  var POOL = [
    // Group 1 — Hiren Patel: 3 leads, matches on Email / Phone / EID
    { id: 'L-2026-04712', name: 'Hiren Patel', brand: 'EXEED', phone: '+971 50 482 9120', email: 'hiren.patel@email.ae', eid: '784-1985-9123847-2', source: 'WhatsApp', created: '2026-10-21T10:05', stage: 'Contact', owner: 'Nadia A.', model: 'EXEED LX' },
    { id: 'L-2026-04760', name: 'Hiren P.', brand: 'EXEED', phone: '', email: 'hiren.patel@email.ae', eid: '', source: 'Instagram', created: '2026-11-02T15:40', stage: 'New', owner: 'Karim M.', model: 'EXEED LX', sys: true },
    { id: 'L-2026-04832', name: 'Hiren Patel', brand: 'EXEED', phone: '+971 50 482 9120', email: 'hiren.patel@email.ae', eid: '784-1985-9123847-2', source: 'Website — Configurator', created: '2026-11-08T09:12', stage: 'Discovery', owner: 'Mariam Saeed', model: 'EXEED LX', sys: true },
    // Group 2 — same phone, reviewed and kept (Continue)
    { id: 'L-2026-04835', name: 'Priya Musale', brand: 'EXEED', phone: '+971 50 123 4567', email: 'priya.m@email.com', eid: '784-1992-7654321-0', source: 'Walk-in', created: '2026-11-10T09:49', stage: 'New', owner: 'Priyamvada K.', model: 'EXEED RX' },
    { id: 'L-2026-04838', name: 'Ahmed Al Mansoori', brand: 'EXEED', phone: '+971 50 123 4567', email: 'ahmed@company.ae', eid: '784-1984-3216549-7', source: 'Referral', created: '2026-11-10T11:30', stage: 'New', owner: 'Priyamvada K.', model: 'EXEED VX' },
    // Group 3 — Sara Ali: original + one already marked duplicate + one potential (Email and EID)
    { id: 'L-2026-04702', name: 'Sara Ali', brand: 'EXEED', phone: '+971 52 118 3304', email: 'sara.a@email.com', eid: '784-1990-5432167-8', source: 'Website', created: '2026-10-15T12:20', stage: 'Qualify', owner: 'Nadia A.', model: 'EXEED RX' },
    { id: 'L-2026-04779', name: 'Sara Ali', brand: 'EXEED', phone: '+971 52 118 3304', email: 'sara.a@email.com', eid: '', source: 'WhatsApp', created: '2026-11-05T08:55', stage: 'Disqualified', owner: 'Nadia A.', model: 'EXEED RX', sys: true },
    { id: 'L-2026-04826', name: 'Sara Ali', brand: 'EXEED', phone: '+971 50 456 7890', email: 'sara.a@email.com', eid: '784-1990-5432167-8', source: 'Instagram', created: '2026-11-09T14:02', stage: 'New', owner: 'Nadia A.', model: 'EXEED RX', sys: true },
    // Group 4 — Fatima: phone written differently (050… vs +971 50…)
    { id: 'L-2026-04740', name: 'Fatima Z.', brand: 'EXEED', phone: '0507890123', email: '', eid: '', source: 'WhatsApp', created: '2026-10-28T19:15', stage: 'Contact', owner: 'Mariam K.', model: 'EXEED TXL', sys: true },
    { id: 'L-2026-04810', name: 'Fatima Al Zaabi', brand: 'EXEED', phone: '+971 50 789 0123', email: 'fatima.z@email.com', eid: '784-1991-6789012-3', source: 'Website', created: '2026-11-06T10:40', stage: 'New', owner: 'Mariam K.', model: 'EXEED TXL', sys: true },
    // No alert — match only on a Closed lead
    { id: 'L-2026-04501', name: 'Maya Hassan', brand: 'EXEED', phone: '+971 50 678 9012', email: 'maya.old@email.com', eid: '', source: 'Walk-in', created: '2026-06-02T11:00', stage: 'Closed', owner: 'Nadia A.', model: 'EXEED LX' },
    { id: 'L-2026-04831', name: 'Maya Hassan', brand: 'EXEED', phone: '+971 50 678 9012', email: 'maya.h@email.com', eid: '784-1988-8765432-1', source: 'Facebook', created: '2026-11-09T16:20', stage: 'New', owner: 'Nadia A.', model: 'EXEED TXL' },
    // No alert — match only in another brand
    { id: 'L-2026-04655', name: 'Karim Saleh', brand: 'JETOUR', phone: '+971 55 900 1122', email: 'karim.s@email.com', eid: '', source: 'Website', created: '2026-09-12T09:30', stage: 'Contact', owner: 'Jetour desk', model: 'JETOUR T2' },
    { id: 'L-2026-04815', name: 'Karim Saleh', brand: 'EXEED', phone: '+971 55 345 6789', email: 'karim.s@email.com', eid: '784-1993-2345678-9', source: 'Website', created: '2026-11-07T13:05', stage: 'New', owner: 'Mariam K.', model: 'EXEED RX' },
    // No alert — match only on a Disqualified lead
    { id: 'L-2026-04612', name: 'Layla I.', brand: 'EXEED', phone: '+971 50 222 0918', email: '', eid: '784-1994-5678901-2', source: 'Call', created: '2026-08-19T15:45', stage: 'Disqualified', owner: 'Nadia A.', model: 'EXEED VX' },
    { id: 'L-2026-04800', name: 'Layla Ibrahim', brand: 'EXEED', phone: '+971 50 901 2345', email: 'layla.i@email.com', eid: '784-1994-5678901-2', source: 'Website', created: '2026-11-05T12:10', stage: 'New', owner: 'Mariam K.', model: 'EXEED VX' },
    // No alert — blank email and EID on both sides
    { id: 'L-2026-04690', name: 'Omar M.', brand: 'EXEED', phone: '+971 55 600 7001', email: '', eid: '', source: 'Call', created: '2026-10-02T10:00', stage: 'Contact', owner: 'Karim M.', model: 'EXEED RX' },
    { id: 'L-2026-04694', name: 'Omar Mansoor', brand: 'EXEED', phone: '+971 55 600 7002', email: '', eid: '', source: 'Call', created: '2026-10-03T10:00', stage: 'New', owner: 'Karim M.', model: 'EXEED RX' }
  ];
  // Decisions already taken (seed). Stored decisions override.
  var SEED = {
    'L-2026-04838': { d: 'continue', by: 'Priyamvada K.', at: '10 Nov 2026 11:31' },
    'L-2026-04779': { d: 'mark', by: 'Nadia A.', at: '05 Nov 2026 11:20', of: 'L-2026-04702' }
  };
  var KEY = 'exeedDupDecisions2';   // v2: clears decisions saved while testing earlier builds
  function stored() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function decision(id) { var s = stored(); return id in s ? s[id] : SEED[id] || null; }
  function undo(id) { var s = stored(); s[id] = null; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }   // only 'Not a duplicate' can be undone
  function setDecision(id, v) { var s = stored(); s[id] = v; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }

  var CLOSED = /^(Closed|Won|Lost|Disqualified)$/i;
  function normPhone(p) { var d = String(p || '').replace(/\D/g, ''); if (!d) return ''; if (d.indexOf('00') === 0) d = d.slice(2); if (d.charAt(0) === '0') d = '971' + d.slice(1); return d; }
  function normEmail(e) { return String(e || '').trim().toLowerCase(); }
  function normEid(e) { return String(e || '').replace(/\D/g, ''); }
  function rec(id) { for (var i = 0; i < POOL.length; i++) if (POOL[i].id === id) return POOL[i]; return null; }
  function isOpen(r) { var d = decision(r.id); return !CLOSED.test(r.stage) && !(d && d.d === 'mark'); }
  function matchOn(a, b) {
    var on = [];
    if (normEmail(a.email) && normEmail(a.email) === normEmail(b.email)) on.push('Email');
    if (normPhone(a.phone) && normPhone(a.phone) === normPhone(b.phone)) on.push('Phone');
    if (normEid(a.eid) && normEid(a.eid) === normEid(b.eid)) on.push('EID');
    return on;
  }
  function t(r) { return Date.parse(r.created) || 0; }
  // Compare one lead against the others. Returns open matches and the ones the rule ignores (and why).
  function check(r) {
    var open = [], ignored = [];
    POOL.forEach(function (o) {
      if (o.id === r.id) return;
      var on = matchOn(r, o); if (!on.length) return;
      if (o.brand !== r.brand) ignored.push({ r: o, on: on, why: 'Other brand (' + o.brand + ')' });
      else if (!isOpen(o)) ignored.push({ r: o, on: on, why: (decision(o.id) || {}).d === 'mark' ? 'Disqualified · Duplicate' : o.stage });
      else open.push({ r: o, on: on });
    });
    return { open: open, ignored: ignored };
  }
  // Group = open leads linked by any match (transitively), plus leads marked as duplicate of a member.
  function group(id) {
    var start = rec(id); if (!start) return [];
    var seen = {}, q = [start], out = [];
    if (!isOpen(start) && !(decision(id) || {}).of) return [];
    if (!isOpen(start)) { var of = rec(decision(id).of); if (of) q = [of]; }
    while (q.length) {
      var r = q.shift(); if (seen[r.id]) continue; seen[r.id] = 1; out.push(r);
      check(r).open.forEach(function (m) { if (!seen[m.r.id]) q.push(m.r); });
    }
    var ids = out.map(function (x) { return x.id; });
    POOL.forEach(function (o) { var d = decision(o.id); if (d && d.d === 'mark' && ids.indexOf(d.of) > -1 && !seen[o.id]) { seen[o.id] = 1; out.push(o); } });
    if (out.length < 2) return [];
    return out.sort(function (a, b) { return t(a) - t(b); });
  }
  function original(id) { var g = group(id).filter(isOpen); return g[0] || null; }
  // Status of a lead in its group
  function status(id) {
    var r = rec(id); if (!r) return null;
    var d = decision(id);
    if (d && d.d === 'mark') return { k: 'marked', t: 'Marked as duplicate', ic: 'block', of: d.of, d: d };
    var g = group(id); if (!g.length) return null;
    var o = original(id);
    if (o && o.id === id) return { k: 'original', t: 'Original', ic: 'verified' };
    if (d && d.d === 'continue') return { k: 'kept', t: 'Reviewed · kept', ic: 'task_alt', d: d };
    var on = []; check(r).open.forEach(function (m) { if (t(m.r) <= t(r)) m.on.forEach(function (x) { if (on.indexOf(x) < 0) on.push(x); }); });
    return { k: 'potential', t: 'Potential duplicate', ic: 'warning', on: on };
  }
  function potentials() { return POOL.filter(function (r) { var s = status(r.id); return s && s.k === 'potential'; }); }
  function fmt(iso) { var d = new Date(iso); if (isNaN(d)) return iso || '—'; return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function now() { return fmt(new Date().toISOString()); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onList(on) { return on.length === 1 ? on[0] : on.slice(0, -1).join(', ') + ' and ' + on[on.length - 1]; }
  function chip(s) { return '<span class="dup-chip ' + s.k + '"><span class="material-symbols-outlined">' + s.ic + '</span>' + s.t + '</span>'; }
  function tags(on) { return (on || []).map(function (x) { return '<span class="dup-tag">' + x + '</span>'; }).join(''); }
  function link(id) { return LEAD_PAGE + '?lead=' + encodeURIComponent(id); }

  /* ── styles (shared) ── */
  var css = `
  .dup-chip { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; border-radius:999px; padding:2px 8px; white-space:nowrap; }
  .dup-chip .material-symbols-outlined { font-size:14px; }
  .dup-chip.original { background:#eaeef3; color:#17293d; } .dup-chip.potential { background:#fff4e0; color:#a15c00; }
  .dup-chip.marked { background:#fdecec; color:#b42318; } .dup-chip.kept { background:#e7f6ec; color:#0e7a3e; } .dup-chip.me { background:#f2f4f7; color:#475467; }
  .dup-tag { display:inline-block; font-size:10.5px; font-weight:600; background:#f2f4f7; color:#344054; border-radius:4px; padding:1px 6px; margin-inline-end:3px; }
  .dup-hl { background:#fff4c2; border-radius:3px; padding:0 2px; font-weight:600; }
  .dup-ov { position:fixed; inset:0; z-index:9600; background:rgba(15,23,42,.45); display:flex; align-items:center; justify-content:center; padding:20px; }
  .dup-dlg { width:min(960px,100%); max-height:calc(100vh - 40px); background:#fff; border-radius:12px; box-shadow:0 24px 64px rgba(15,23,42,.3); display:flex; flex-direction:column; overflow:hidden; font-size:13px; color:#1f2937; }
  .dup-dh { display:flex; align-items:flex-start; gap:12px; padding:16px 20px 12px; border-bottom:1px solid #eef0f3; }
  .dup-dh .ic { width:36px; height:36px; border-radius:10px; background:#fff4e0; color:#a15c00; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
  .dup-dh h3 { margin:0; font-size:16px; } .dup-dh p { margin:3px 0 0; color:#475467; font-size:13px; }
  .dup-x { margin-inline-start:auto; border:0; background:none; cursor:pointer; color:#475467; padding:4px; border-radius:6px; } .dup-x:hover { background:#f2f4f7; }
  .dup-db { overflow:auto; padding:14px 20px; }
  .dup-tb { width:100%; border-collapse:collapse; font-size:12px; }
  .dup-tb th { text-align:start; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.03em; color:#667085; padding:8px; background:#fafbfc; border-bottom:1px solid #e6e8ec; white-space:nowrap; }
  .dup-tb td { padding:9px 8px; border-bottom:1px solid #eef0f3; vertical-align:top; }
  .dup-tb tr.me td { background:#f8fafc; } .dup-tb td b { display:block; font-weight:600; white-space:nowrap; } .dup-tb td small { display:block; color:#667085; font-size:11px; }
  .dup-tb .nw, .dup-tb td:first-child a { white-space:nowrap; } .dup-tb td .dup-tag { margin-bottom:2px; }
  .dup-tb a { color:#17293d; font-weight:600; text-decoration:none; } .dup-tb a:hover { text-decoration:underline; }
  .dup-tb tr.rowlink { cursor:pointer; } .dup-tb tr.rowlink:hover td { background:#f8fafc; }
  .dup-note { display:flex; gap:8px; align-items:flex-start; font-size:12px; color:#475467; background:#f8fafc; border:1px solid #eef0f3; border-radius:8px; padding:8px 10px; margin-top:12px; } .dup-note .material-symbols-outlined { font-size:17px; color:#667085; }
  .dup-df { display:flex; align-items:center; gap:8px; padding:12px 20px; border-top:1px solid #eef0f3; background:#fafbfc; }
  .dup-btn { display:inline-flex; align-items:center; gap:6px; border:1px solid #d0d5dd; background:#fff; color:#1f2937; border-radius:6px; padding:8px 14px; font:600 13px inherit; cursor:pointer; } .dup-btn:hover { background:#f6f7f9; }
  .dup-btn.pri { background:#17293d; border-color:#17293d; color:#fff; } .dup-btn.pri:hover { background:#0f1d2c; }
  .dup-btn.danger { background:#fff; border-color:#f1b8b3; color:#b42318; } .dup-btn.danger:hover { background:#fdecec; }
  .dup-btn .material-symbols-outlined { font-size:17px; }
  .dup-lnk { border:0; background:none; color:#2a6797; font:600 12px inherit; cursor:pointer; padding:4px; }
  `;
  function addCss() { if (document.getElementById('dupCss')) return; var st = document.createElement('style'); st.id = 'dupCss'; st.textContent = css; document.head.appendChild(st); }
  function close() { var o = document.getElementById('dupOv'); if (o) o.remove(); document.removeEventListener('keydown', escKey); }
  function escKey(e) { if (e.key === 'Escape') close(); }
  function modal(head, body, foot) {
    addCss(); close();
    var o = document.createElement('div'); o.className = 'dup-ov'; o.id = 'dupOv';
    o.innerHTML = '<div class="dup-dlg" role="dialog" aria-modal="true" aria-labelledby="dupTtl">' + head + '<div class="dup-db">' + body + '</div>' + (foot ? '<div class="dup-df">' + foot + '</div>' : '') + '</div>';
    o.addEventListener('click', function (e) { if (e.target === o) close(); });
    document.body.appendChild(o); document.addEventListener('keydown', escKey);
    var f = o.querySelector('.dup-df .pri, .dup-x'); if (f) f.focus();
  }
  function hl(v, hit) { return v ? (hit ? '<span class="dup-hl">' + esc(v) + '</span>' : esc(v)) : '<span style="color:#98a2b3">—</span>'; }

  /* ── Review popup (lead page): compare and decide ── */
  function review(id, onDone) {
    var r = rec(id); if (!r) return;
    var res = check(r), on = [];
    res.open.forEach(function (m) { m.on.forEach(function (x) { if (on.indexOf(x) < 0) on.push(x); }); });
    var orig = original(id);
    var row = function (x, me, mon) {
      var s = me ? { k: 'me', t: 'This lead', ic: 'person' } : status(x.id) || { k: 'kept', t: 'Open', ic: 'radio_button_checked' };
      return '<tr class="' + (me ? 'me' : '') + '"><td>' + (me ? '<b>' + esc(x.id) + '</b>' : '<a href="' + link(x.id) + '" target="_blank" rel="noopener">' + esc(x.id) + '</a>') + '<small>' + esc(x.name) + '</small></td>' +
        '<td>' + chip(s) + (orig && orig.id === x.id && !me ? '' : '') + '</td><td>' + (me ? tags(on) : tags(mon)) + '</td>' +
        '<td>' + hl(x.email, on.indexOf('Email') > -1 && (me || mon.indexOf('Email') > -1)) + '</td><td class="nw">' + hl(x.phone, on.indexOf('Phone') > -1 && (me || mon.indexOf('Phone') > -1)) + '</td><td class="nw">' + hl(x.eid, on.indexOf('EID') > -1 && (me || mon.indexOf('EID') > -1)) + '</td>' +
        '<td>' + esc(x.source) + '</td><td class="nw">' + fmt(x.created) + '</td><td>' + esc(x.stage) + '</td><td>' + esc(x.owner) + '</td></tr>';
    };
    var rows = row(r, true, []) + res.open.sort(function (a, b) { return t(a.r) - t(b.r); }).map(function (m) { return row(m.r, false, m.on); }).join('');
    var n = res.open.length;
    modal('<div class="dup-dh"><span class="ic"><span class="material-symbols-outlined">content_copy</span></span><div><h3 id="dupTtl">Possible duplicate lead</h3><p>This lead matches ' + n + ' open ' + esc(r.brand) + ' lead' + (n === 1 ? '' : 's') + ' on ' + onList(on) + '.' + (orig && orig.id !== id ? ' The original is <b>' + esc(orig.id) + '</b> (created first).' : '') + '</p></div><button class="dup-x" aria-label="Back to lead" onclick="DUP._close()"><span class="material-symbols-outlined">close</span></button></div>',
      '<table class="dup-tb"><thead><tr><th>Lead</th><th>Status</th><th>Matched on</th><th>Email</th><th>Phone</th><th>EID</th><th>Source</th><th>Created on</th><th>Stage</th><th>Owner</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="dup-note"><span class="material-symbols-outlined">info</span><span><b>Mark as duplicate</b> disqualifies this lead with reason “Duplicate” and links it to ' + (orig ? esc(orig.id) : 'the original') + '. It can’t be reactivated. <b>Continue</b> keeps it as a separate lead. Owner and SLA don’t change.</span></div>',
      '<button class="dup-btn" onclick="DUP._close()">Back to lead</button><span style="flex:1"></span>' +
      '<button class="dup-btn" onclick="DUP._decide(\'' + id + '\',\'continue\')"><span class="material-symbols-outlined">arrow_forward</span>Continue · keep lead</button>' +
      '<button class="dup-btn pri" onclick="DUP._decide(\'' + id + '\',\'mark\')"><span class="material-symbols-outlined">block</span>Mark as duplicate</button>');
    DUP._onDone = onDone;
  }
  function decide(id, d) {
    var o = original(id), v = { d: d, by: ME, at: now() };
    if (d === 'mark') v.of = o ? o.id : '';
    setDecision(id, v); close();
    if (DUP._onDone) DUP._onDone(v);
  }

  /* ── Dashboard tile + list ── */
  function openList() {
    var P = potentials();
    var rows = P.length ? P.map(function (r) {
      var s = status(r.id), o = original(r.id);
      return '<tr class="rowlink" tabindex="0" onclick="location.href=\'' + link(r.id) + '\'" onkeydown="if(event.key===\'Enter\')location.href=\'' + link(r.id) + '\'"><td><a href="' + link(r.id) + '">' + esc(r.id) + '</a><small>' + esc(r.name) + '</small></td>' +
        '<td>' + chip(s) + '</td><td>' + tags(s.on) + '</td><td>' + (o ? '<a href="' + link(o.id) + '" onclick="event.stopPropagation()">' + esc(o.id) + '</a><small>' + fmt(o.created) + '</small>' : '—') + '</td>' +
        '<td>' + esc(r.source) + '</td><td class="nw">' + fmt(r.created) + '</td><td>' + esc(r.stage) + '</td><td>' + esc(r.owner) + '</td><td>' + esc(r.model) + '</td></tr>';
    }).join('') : '<tr><td colspan="9" style="text-align:center;color:#667085;padding:20px">No potential duplicates to review.</td></tr>';
    modal('<div class="dup-dh"><span class="ic"><span class="material-symbols-outlined">content_copy</span></span><div><h3 id="dupTtl">Potential duplicate leads</h3><p>Open leads that match an earlier open lead of the same brand on Email, Phone or EID. Open a lead to review it.</p></div><button class="dup-x" aria-label="Close" onclick="DUP._close()"><span class="material-symbols-outlined">close</span></button></div>',
      '<table class="dup-tb"><thead><tr><th>Lead</th><th>Duplicate status</th><th>Matched on</th><th>Original lead</th><th>Source</th><th>Created on</th><th>Stage</th><th>Owner</th><th>Model</th></tr></thead><tbody>' + rows + '</tbody></table>',
      '<button class="dup-lnk" onclick="DUP.reset();DUP._close();location.reload()" title="Prototype only">Reset demo decisions</button><span style="flex:1"></span><button class="dup-btn pri" onclick="DUP._close()">Close</button>');
  }
  function mountTile() {
    var titles = document.querySelectorAll('.kpi-sec-title'), grid = null;
    ['Actions', 'My Queue', 'Volumetrics'].some(function (want) {
      for (var i = 0; i < titles.length; i++) {
        if (titles[i].textContent.trim() === want) { var sec = titles[i].closest('.kpi-section'); grid = sec && sec.querySelector('.kpi-grid'); if (grid) return true; }
      }
      return false;
    });
    if (!grid || grid.querySelector('.dup-tile')) return;
    addCss();
    var n = potentials().length, c = document.createElement('div');
    c.className = 'metric-card mdr-open dup-tile'; c.setAttribute('role', 'button'); c.tabIndex = 0;
    c.innerHTML = '<div class="mc-lbl">Potential Duplicate Leads</div><div class="mc-val' + (n ? ' txt-amber' : '') + '">' + n + '</div><div class="mc-sub">Review · mark or continue</div>';
    c.onclick = openList; c.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openList(); } };
    grid.appendChild(c);
    // Avoid a lone tile on its own row: give the grid one more column.
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    if (cols > 1 && grid.children.length % cols === 1) grid.style.gridTemplateColumns = 'repeat(' + (cols + 1) + ', minmax(0, 1fr))';
  }

  window.DUP = {
    POOL: POOL, ME: ME, rec: rec, check: check, group: group, original: original, status: status, decision: decision,
    potentials: potentials, review: review, openList: openList, mountTile: mountTile, reset: reset, undo: undo, fmt: fmt, esc: esc,
    chip: chip, tags: tags, link: link, onList: onList, addCss: addCss,
    _close: close, _decide: decide, _onDone: null
  };
  if (!/lead-detail/.test(location.pathname)) {
    var go = function () { mountTile(); setTimeout(mountTile, 400); setTimeout(mountTile, 1500); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }
})();
