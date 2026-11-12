// Unit tests for clone-lead.js. Run: node tests/clone-lead.test.js
var assert = require('assert');
var C = require('../clone-lead.js');

var src = {
  id: 'L-2026-04832', name: 'Hiren Patel', phone: '+971 50 482 9120', email: 'hiren.patel@email.ae', source: 'Website — Configurator',
  channel: 'WhatsApp', model: 'EXEED LX', owner: 'Mariam Saeed', bpfStage: 9, stage: 'Won', account: 'Al Noor', contact: 'Hiren Patel',
  sla: 'Breached', slaClass: 'brch', escalations: ['SM'], discovery: 62, tradeIn: { make: 'Nissan' }, testDrives: [1], proposals: [1], opportunity: 'OPP-1',
  activities: [{ type: 'call', text: 'old', time: '2026-06-28 10:18' }]
};
var now = new Date(2026, 10, 12, 15, 40);
var t = 0;
function test(name, fn) { fn(); t++; console.log('ok', name); }

test('persona -> stage mapping', function () {
  assert.equal(C.cloneStageFor('call-center-agent.html'), 'Contact');
  assert.equal(C.cloneStageFor('call-center-manager.html'), 'Contact');
  assert.equal(C.cloneStageFor('sales-executive.html'), 'Qualify');
  assert.equal(C.cloneStageFor('showroom-manager.html'), 'Qualify');
  assert.equal(C.cloneStageFor('head-of-sales.html'), 'Qualify');
  assert.equal(C.cloneStageFor('brand-host.html'), 'Qualify');
  assert.equal(C.cloneStageFor('sales-admin.html'), 'Qualify', 'unknown/future personas default to Qualify');
});

test('CCA clone starts at Contact with CCA fields', function () {
  var c = C.buildClone(src, { persona: 'call-center-agent.html', id: 'L-2026-04839', now: now });
  assert.equal(c.bpfStage, 2); assert.equal(c.cloneStage, 'Contact');
  assert.equal(c.ccaName, 'Nadia Al Amiri'); assert.equal(c.ccaAssignedDate, '2026-11-12 15:40'); assert.equal(c.createdOn, '2026-11-12 15:40');
});

test('SE clone starts at Qualify, assigned to the SE, attended', function () {
  var c = C.buildClone(src, { persona: 'sales-executive.html', id: 'X', now: now });
  assert.equal(c.bpfStage, 3); assert.equal(c.assignedSE, 'Mariam Saeed'); assert.equal(c.leadAttended, 'Yes');
});

test('only lead-stage data copied; source kept', function () {
  var c = C.buildClone(src, { persona: 'showroom-manager.html', id: 'X', now: now });
  assert.equal(c.source, src.source); assert.equal(c.phone, src.phone); assert.equal(c.model, src.model);
  ['tradeIn', 'testDrives', 'proposals', 'opportunity'].forEach(function (k) { assert.equal(c[k], undefined, k); });
  assert.equal(c.discovery, 0);
  assert.equal(c.activities.length, 1); assert.equal(c.activities[0].type, 'clone');
  assert.equal(src.activities.length, 1, 'source untouched');
});

test('owner is the cloner, SLA fresh', function () {
  var c = C.buildClone(src, { persona: 'showroom-manager.html', id: 'X', now: now });
  assert.equal(c.owner, 'Rashid Khan'); assert.equal(c.slaClass, 'ok'); assert.deepEqual(c.escalations, []); assert.equal(c.slaBreached, false);
});

test('same account/contact, WhatsApp linked, duplicate check skipped, link back', function () {
  var c = C.buildClone(src, { persona: 'call-center-agent.html', id: 'X', now: now });
  assert.equal(c.account, 'Al Noor'); assert.equal(c.contact, 'Hiren Patel');
  assert.equal(c.waConversationId, 'WA-L-2026-04832'); assert.equal(c.skipDuplicateCheck, true);
  assert.equal(c.clonedFromLeadId, src.id);
});

test('no WhatsApp / no account -> skipped without error', function () {
  var c = C.buildClone({ id: 'L-2026-00001', name: 'A', channel: 'Email' }, { persona: 'sales-executive.html', id: 'X', now: now });
  assert.equal(c.waConversationId, undefined); assert.equal(c.account, undefined); assert.equal(c.contact, undefined);
});

test('clone of a clone points to its direct source; clonesOf finds many', function () {
  var a = C.buildClone(src, { persona: 'sales-executive.html', id: 'L-2026-04900', now: now });
  var b = C.buildClone(a, { persona: 'sales-executive.html', id: 'L-2026-04901', now: now });
  var d = C.buildClone(src, { persona: 'sales-executive.html', id: 'L-2026-04902', now: now });
  assert.equal(b.clonedFromLeadId, 'L-2026-04900');
  assert.deepEqual(C.clonesOf([src, a, b, d], src.id).map(function (x) { return x.id; }), ['L-2026-04900', 'L-2026-04902']);
});

test('next lead id and source activity text', function () {
  assert.equal(C.nextLeadId([{ id: 'L-2026-04838' }, { id: 'L-2026-04832' }], 2026), 'L-2026-04839');
  var s = C.sourceActivity(src, { id: 'L-2026-04839' }, { name: 'Nadia Al Amiri' }, now);
  assert.equal(s.text, 'Lead cloned to L-2026-04839 by Nadia Al Amiri on 2026-11-12 15:40.');
});

console.log(t + ' tests passed');
