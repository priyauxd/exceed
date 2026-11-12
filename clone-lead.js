/* Clone Lead (Jira MAI-4768) — pure clone rules, shared by lead-detail.html and the unit tests.
   No DOM here: the page owns the dialog, navigation and toast. */
(function (root) {
  // Persona (dashboard page) -> stage the clone starts in. Add new personas here.
  var CLONE_STAGE_BY_PERSONA = {
    'call-center-agent.html':   'Contact',
    'call-center-manager.html': 'Contact',
    'sales-executive.html':     'Qualify',
    'showroom-manager.html':    'Qualify',
    'brand-host.html':          'Qualify',
    'head-of-sales.html':       'Qualify'
  };
  var CLONE_DEFAULT_STAGE = 'Qualify';
  var CE_PERSONAS = ['call-center-agent.html', 'call-center-manager.html'];

  // Who is cloning, per persona (the demo user shown on each dashboard).
  var PERSONA_USERS = {
    'call-center-agent.html':   { name: 'Nadia Al Amiri', role: 'CCA' },
    'call-center-manager.html': { name: 'Eman Al Hosani', role: 'CCM' },
    'brand-host.html':          { name: 'Layla Haddad',   role: 'Brand Host' },
    'showroom-manager.html':    { name: 'Rashid Khan',    role: 'SM' },
    'head-of-sales.html':       { name: 'Nurishma Rao',   role: 'HOS' },
    'sales-executive.html':     { name: 'Mariam Saeed',   role: 'SE' }
  };

  // Stage name -> lead record stage fields (matches Create Lead's mapping).
  var STAGE_FIELDS = {
    Contact: { stage: 'Contacted', stageNum: 'Contacted', stageClass: 'contacted', bpfStage: 2 },
    Qualify: { stage: 'Qualified', stageNum: 'Qualified', stageClass: 'qualified', bpfStage: 3 }
  };

  // Lead-stage data only: customer details and fields captured at lead stage.
  var COPY_FIELDS = ['name', 'initials', 'av', 'phone', 'email', 'emiratesId', 'nationality', 'company',
    'source', 'srcClass', 'srcIcon', 'channel', 'preferred', 'lang', 'model', 'temp', 'intent', 'intentClass',
    'showroom', 'existing', 'nps', 'bizType', 'industry', 'emirate', 'account', 'contact', 'qty', 'fleetLoc',
    'accountId', 'contactId'];

  function cloneStageFor(persona) {
    return CLONE_STAGE_BY_PERSONA[persona] || CLONE_DEFAULT_STAGE;
  }
  function userFor(persona) {
    return PERSONA_USERS[persona] || { name: 'Current user', role: 'User' };
  }
  function isCE(persona) { return CE_PERSONAS.indexOf(persona) > -1; }

  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtTime(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  // Next free lead ID after the highest L-YYYY-NNNNN in the list.
  function nextLeadId(leads, year) {
    var max = 0;
    (leads || []).forEach(function (l) { var m = /^L-\d{4}-(\d+)$/.exec(l.id || ''); if (m) max = Math.max(max, parseInt(m[1], 10)); });
    return 'L-' + year + '-' + String(max + 1).padStart(5, '0');
  }

  // Build the new lead. src is never modified here; the caller adds the source-side activity.
  function buildClone(src, opts) {
    var persona = opts.persona, user = opts.user || userFor(persona), now = opts.now || new Date();
    var t = fmtTime(now), stageName = cloneStageFor(persona), sf = STAGE_FIELDS[stageName];
    var c = {};
    COPY_FIELDS.forEach(function (k) { if (src[k] !== undefined) c[k] = src[k]; });
    c.id = opts.id;
    c.clonedFromLeadId = src.id;
    c.clonedFromName = src.name;
    for (var k in sf) c[k] = sf[k];
    c.cloneStage = stageName;
    c.owner = user.name;                       // the cloner owns the new lead
    c.createdOn = t;
    c.handover = 'Pending';
    // Fresh SLA from clone time: nothing elapsed, no breach, no escalation.
    c.sla = 'On track'; c.slaClass = 'ok'; c.slaTime = 'Started ' + t.slice(11);
    c._slaTimers = { t1: 300, t2: 300 }; c.escalations = []; c.slaBreached = false;
    if (isCE(persona)) { c.ccaAssignedDate = t; c.ccaName = user.name; }
    else { c.assignedSE = user.role === 'SE' ? user.name : (src.assignedSE || user.name); c.leadAttended = 'Yes'; }
    // Same Account / Contact: link by reference, never create new ones.
    if (src.account) c.account = src.account;
    if (src.contact) c.contact = src.contact;
    // WhatsApp conversation: link it if the source has one, otherwise skip.
    var wa = src.waConversationId || (src.channel === 'WhatsApp' || src.preferred === 'WhatsApp' ? 'WA-' + src.id : null);
    if (wa) c.waConversationId = wa;
    c.skipDuplicateCheck = true;
    // Not copied: discovery, trade-in, opportunity, test drives, proposals, activities, owner, SLA state.
    c.discovery = 0; c.profileComplete = src.profileComplete || 0; c.score = src.score || 0;
    c.convertProb = src.convertProb || 0; c.attempts = 0; c.checks = {};
    c.activities = [{ type: 'clone', cloneOf: src.id, text: 'Lead cloned from ' + src.id + ' by ' + user.name + ' on ' + t + '.', time: t }];
    return c;
  }
  function sourceActivity(src, clone, user, now) {
    var t = fmtTime(now || new Date());
    return { type: 'clone', cloneTo: clone.id, text: 'Lead cloned to ' + clone.id + ' by ' + user.name + ' on ' + t + '.', time: t };
  }
  function clonesOf(leads, id) { return (leads || []).filter(function (l) { return l.clonedFromLeadId === id; }); }

  var API = { CLONE_STAGE_BY_PERSONA: CLONE_STAGE_BY_PERSONA, CLONE_DEFAULT_STAGE: CLONE_DEFAULT_STAGE, PERSONA_USERS: PERSONA_USERS,
    COPY_FIELDS: COPY_FIELDS, cloneStageFor: cloneStageFor, userFor: userFor, isCE: isCE, nextLeadId: nextLeadId,
    buildClone: buildClone, sourceActivity: sourceActivity, clonesOf: clonesOf, fmtTime: fmtTime };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.CLONE = API;
})(this);
