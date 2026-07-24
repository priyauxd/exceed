/* Shared Copilot side-modal + notification bell widget.
   Idempotent: injects only what a page is missing (skips if #copilotBtn / #bellBtn already present).
   Include with: <script src="copilot-widget.js" defer></script> */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var CSS = '\
  .cw-overlay{position:fixed;inset:0;background:rgba(20,24,34,.28);opacity:0;visibility:hidden;transition:opacity .25s;z-index:60;}\
  .cw-overlay.open{opacity:1;visibility:visible;}\
  .cw-bell{position:relative;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:6px;cursor:pointer;color:#fff;opacity:.85;}\
  .cw-bell:hover{background:rgba(255,255,255,.15);opacity:1;}\
  .cw-bell .material-symbols-outlined{font-size:18px;}\
  .cw-badge{position:absolute;top:-2px;right:-2px;min-width:15px;height:15px;padding:0 3px;border-radius:8px;background:#d13438;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;}\
  .cw-copilot{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.13);padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;color:#fff;}\
  .cw-copilot:hover{background:rgba(255,255,255,.22);}\
  .cw-panel{position:fixed;top:0;right:0;bottom:0;width:440px;max-width:92vw;background:#fff;border-left:1px solid #e4e6f2;box-shadow:-8px 0 32px rgba(20,24,34,.10);z-index:61;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow:hidden;}\
  .cw-panel.open{transform:translateX(0);}\
  .cw-phead{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid #eceef4;flex-shrink:0;}\
  .cw-phead .cw-t{font-size:13px;font-weight:700;color:#5b54d6;letter-spacing:.03em;display:flex;align-items:center;gap:6px;}\
  .cw-phead .cw-sub{font-size:11px;color:#9ea3b5;}\
  .cw-close{margin-left:auto;border:none;background:none;font-size:20px;line-height:1;color:#9ea3b5;cursor:pointer;padding:0 2px;}\
  .cw-close:hover{color:#242424;}\
  .cw-pbody{padding:16px;overflow-y:auto;flex:1;}\
  .cw-card{background:linear-gradient(135deg,#f3f1fe,#f9f0fd);border:1px solid #ddd5f5;border-radius:10px;padding:13px 15px;margin-bottom:14px;}\
  .cw-card .cw-tag{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7c6dd8;}\
  .cw-card p{font-size:12.5px;color:#4c3a96;line-height:1.55;margin:6px 0 0;}\
  .cw-inrow{display:flex;gap:8px;margin-bottom:12px;}\
  .cw-input{flex:1;border:1px solid #eceef4;border-radius:6px;padding:9px 12px;font-size:12.5px;font-family:inherit;color:#242424;outline:none;background:#f5f5f5;}\
  .cw-input:focus{border-color:#5b54d6;background:#fff;}\
  .cw-send{border:none;background:#17293d;color:#fff;border-radius:6px;padding:0 14px;font-size:12.5px;font-weight:600;cursor:pointer;}\
  .cw-chips{display:flex;flex-wrap:wrap;gap:7px;}\
  .cw-chip{font-size:11.5px;color:#616161;background:#fff;border:1px solid #eceef4;border-radius:16px;padding:5px 12px;cursor:pointer;}\
  .cw-chip:hover{border-color:#5b54d6;color:#5b54d6;background:#f4f3ff;}\
  .cw-ndrop{position:fixed;top:44px;right:10px;width:380px;max-width:calc(100vw - 20px);max-height:calc(100vh - 60px);overflow-y:auto;background:#fff;border:1px solid #eceef4;border-radius:10px;box-shadow:0 16px 48px rgba(20,24,34,.10);z-index:61;display:none;}\
  .cw-ndrop.open{display:block;}\
  .cw-nhead{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #eceef4;}\
  .cw-nhead b{font-size:13px;color:#242424;display:flex;align-items:center;gap:6px;}\
  .cw-nhead .material-symbols-outlined{font-size:17px;color:#17293d;}\
  .cw-nhead a{font-size:11px;color:#17293d;cursor:pointer;text-decoration:none;font-weight:600;}\
  .cw-nitem{display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid #f1f2f7;}\
  .cw-nitem:hover{background:#f5f7fd;}\
  .cw-nico{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}\
  .cw-nico .material-symbols-outlined{font-size:16px;}\
  .cw-nico.danger{background:#fdf3f4;color:#d13438;}.cw-nico.warn{background:#fff9e5;color:#8a6420;}.cw-nico.info{background:#eaeef3;color:#17293d;}.cw-nico.success{background:#f1faf1;color:#107c10;}\
  .cw-ntitle{font-size:12.5px;font-weight:600;color:#242424;}\
  .cw-ntext{font-size:11.5px;color:#616161;line-height:1.4;margin-top:2px;}\
  .cw-ntime{font-size:10.5px;color:#9ea3b5;margin-top:3px;}\
  .cw-nfoot{padding:10px 14px;text-align:center;}\
  .cw-nfoot a{font-size:11.5px;color:#17293d;font-weight:600;text-decoration:none;cursor:pointer;}\
  .cw-persona-wrap{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.13);padding:3px 6px 3px 10px;border-radius:6px;margin-right:8px;}\
  .cw-persona-wrap:hover{background:rgba(255,255,255,.22);}\
  .cw-persona-wrap>.material-symbols-outlined{font-size:16px;color:#fff;opacity:.9;}\
  .cw-persona{appearance:none;-webkit-appearance:none;background:transparent;border:none;color:#fff;font-size:11px;font-weight:600;font-family:inherit;cursor:pointer;outline:none;padding:2px 2px;max-width:180px;}\
  .cw-persona option{color:#242424;}\
  .cw-rgrp-head{display:flex;align-items:center;gap:8px;padding:8px 14px 5px;font-size:11px;font-weight:700;letter-spacing:.02em;color:#8a8f9c;cursor:pointer;user-select:none;}\
  .cw-rgrp-head .cw-rico{font-size:16px;}\
  .cw-rgrp-head .cw-rcaret{margin-left:auto;font-size:16px;transition:transform .15s;}\
  .cw-rgrp.collapsed .cw-rcaret{transform:rotate(-90deg);}\
  .cw-rgrp.collapsed .cw-rlist{display:none;}\
  .cw-rlist{max-height:186px;overflow-y:auto;}\
  .cw-rlist::-webkit-scrollbar{width:4px;}\
  .cw-rlist::-webkit-scrollbar-thumb{background:rgba(20,24,34,.18);border-radius:4px;}\
  .cw-r-av{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#8b7bdf;color:#fff;font-size:9px;font-weight:700;flex-shrink:0;letter-spacing:.02em;margin-right:2px;}\
  .cw-r-av.a1{background:linear-gradient(135deg,#8b7bdf,#a78bfa);}\
  .cw-r-av.a2{background:linear-gradient(135deg,#5b8def,#7ba5f5);}\
  .cw-r-av.a3{background:linear-gradient(135deg,#e8a84c,#d4873a);}\
  .cw-r-av.a4{background:linear-gradient(135deg,#5cb97f,#4fb8a8);}\
  .cw-r-av.a5{background:linear-gradient(135deg,#e76e6e,#d45b5b);}\
  .cw-r-av.a6{background:linear-gradient(135deg,#4fb8a8,#3da89a);}\
  .cw-r-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
  .cw-r-item .cw-r-pin{margin-left:6px;font-size:15px;color:#b9bdc9;opacity:0;cursor:pointer;flex-shrink:0;transition:opacity .12s,color .12s;}\
  .cw-r-item:hover .cw-r-pin{opacity:.7;}\
  .cw-r-item .cw-r-pin:hover{color:#5b54d6;opacity:1;}\
  .cw-r-item .cw-r-pin.on{opacity:1;color:#5b54d6;font-variation-settings:\'FILL\' 1;}';

  var NOTIFS = [
    ['danger', 'warning', 'SLA breached — Maya Hassan', 'L-2026-04831 passed the 1-hour first-contact SLA. Manager notified.', '12 min ago'],
    ['warn', 'undo', 'Lead returned by Sales Executive', 'Sara Ali (L-2026-04826) — missing preferred showroom.', '28 min ago'],
    ['info', 'person_add', '2 new leads assigned to you', 'Hiren Patel and Karim Saleh added to your queue.', '42 min ago'],
    ['success', 'check_circle', 'Handover accepted — Ahmad Rizk', 'L-2026-04810 accepted by Mariam K. Test drive booked.', '1 hr ago']
  ];
  var CHIPS = ['What should I do first?', 'Which leads are at SLA risk?', "What's ready to hand over?", 'Draft a follow-up'];

  // Persona → dashboard mapping. Selecting a persona loads that role's dashboard & flows.
  var PERSONAS = [
    ['Call Center Agent', 'call-center-agent.html'],
    ['Call Center Manager', 'call-center-manager.html'],
    ['Showroom Manager', 'showroom-manager.html'],
    ['Head of Sales', 'head-of-sales.html'],
    ['Sales Executive', 'sales-executive.html']
  ];
  var PERSONA_DEFAULT = 'call-center-agent.html';

  // Define global toggles up-front so they exist even if injection is skipped/fails.
  if (!window.toggleCopilot) {
    window.toggleCopilot = function () {
      var p = document.getElementById('cwCopilot'), o = document.getElementById('cwCopilotOv');
      if (!p) return; var open = p.classList.toggle('open'); if (o) o.classList.toggle('open', open);
    };
  }
  if (!window.toggleNotif) {
    window.toggleNotif = function () {
      var d = document.getElementById('cwNotif'), o = document.getElementById('cwNotifOv');
      if (!d) return; var open = d.classList.toggle('open'); if (o) o.classList.toggle('open', open);
    };
  }
  window.cwMarkAllRead = function () {
    var b = document.getElementById('cwBadge'); if (b) b.style.display = 'none';
    var d = document.getElementById('cwNotif'); if (d) d.querySelectorAll('.cw-nitem').forEach(function (i) { i.style.opacity = '.55'; });
  };

  ready(function () {
   try {
    // inject styles once
    if (!document.getElementById('cw-style')) {
      var st = document.createElement('style'); st.id = 'cw-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    var actions = document.querySelector('.topbar .actions') || document.querySelector('.top-actions') || document.querySelector('.actions') || document.querySelector('.topbar');
    // A page with its own full copilot panel (#copilotDD) handles itself — skip.
    var nativeCopilot = document.getElementById('copilotDD');
    var nativeNotif = document.getElementById('notifDropdown');

    // ---- Copilot ----
    if (actions && !nativeCopilot) {
      // reuse an existing trigger if the page already has a (static) Copilot button
      var trigger = document.getElementById('copilotBtn') || document.querySelector('.topbar .copilot') || document.querySelector('.copilot');
      if (!trigger) {
        trigger = document.createElement('div');
        trigger.className = 'cw-copilot';
        trigger.innerHTML = '&#10024; Copilot';
        actions.insertBefore(trigger, actions.firstChild);
      }
      trigger.id = trigger.id || 'copilotBtn';
      trigger.onclick = window.toggleCopilot;
      trigger.style.cursor = 'pointer';

      var ov = document.createElement('div'); ov.className = 'cw-overlay'; ov.id = 'cwCopilotOv'; ov.onclick = window.toggleCopilot;
      var panel = document.createElement('div'); panel.className = 'cw-panel'; panel.id = 'cwCopilot';
      panel.innerHTML =
        '<div class="cw-phead"><span class="cw-t"><span class="material-symbols-outlined">auto_awesome</span>COPILOT</span>' +
        '<span class="cw-sub">Grounded on your data</span><button class="cw-close" onclick="toggleCopilot()">&times;</button></div>' +
        '<div class="cw-pbody">' +
          '<div class="cw-card"><span class="cw-tag">Proactive</span><p><strong>Maya Hassan</strong> breached the first-contact SLA and is still not actioned — a hot lead on EXEED TXL. Contact her first.</p></div>' +
          '<div class="cw-inrow"><input class="cw-input" placeholder="Ask about your leads…"><button class="cw-send">Ask</button></div>' +
          '<div class="cw-chips">' + CHIPS.map(function (c) { return '<span class="cw-chip">' + c + '</span>'; }).join('') + '</div>' +
        '</div>';
      document.body.appendChild(ov); document.body.appendChild(panel);
    }

    // ---- Notifications ----
    if (actions && !nativeNotif && !document.getElementById('bellBtn')) {
      var bell = document.createElement('div');
      bell.className = 'cw-bell'; bell.id = 'bellBtn'; bell.onclick = window.toggleNotif;
      bell.innerHTML = '<span class="material-symbols-outlined">notifications</span><span class="cw-badge" id="cwBadge">' + NOTIFS.length + '</span>';
      // place next to the copilot button, in its own parent (topbar structures vary)
      var cop = document.getElementById('copilotBtn') || document.querySelector('.topbar .copilot') || document.querySelector('.copilot');
      if (cop && cop.parentNode) cop.parentNode.insertBefore(bell, cop.nextSibling);
      else actions.appendChild(bell);

      var nov = document.createElement('div'); nov.className = 'cw-overlay'; nov.id = 'cwNotifOv'; nov.style.background = 'transparent'; nov.onclick = window.toggleNotif;
      var drop = document.createElement('div'); drop.className = 'cw-ndrop'; drop.id = 'cwNotif';
      drop.innerHTML =
        '<div class="cw-nhead"><b><span class="material-symbols-outlined">notifications</span>Notifications</b><a onclick="cwMarkAllRead()">Mark all read</a></div>' +
        NOTIFS.map(function (n) {
          return '<div class="cw-nitem"><div class="cw-nico ' + n[0] + '"><span class="material-symbols-outlined">' + n[1] + '</span></div>' +
            '<div><div class="cw-ntitle">' + n[2] + '</div><div class="cw-ntext">' + n[3] + '</div><div class="cw-ntime">' + n[4] + '</div></div></div>';
        }).join('') +
        '<div class="cw-nfoot"><a>View all notifications</a></div>';
      document.body.appendChild(nov); document.body.appendChild(drop);
    }

    // ---- Persona switcher (sits just before the Copilot link) ----
    if (actions && !document.getElementById('cwPersona')) {
      var here = (location.pathname.split('/').pop() || '').toLowerCase();
      var stored = null; try { stored = localStorage.getItem('exceed_persona'); } catch (e) {}
      var current = '';
      PERSONAS.forEach(function (p) { if (p[1].toLowerCase() === here) current = p[1]; });
      if (!current && stored) current = stored;
      if (!current) current = PERSONA_DEFAULT;

      var pwrap = document.createElement('div'); pwrap.className = 'cw-persona-wrap';
      pwrap.innerHTML = '<span class="material-symbols-outlined">badge</span>';
      var psel = document.createElement('select'); psel.className = 'cw-persona'; psel.id = 'cwPersona';
      psel.title = 'Switch persona — loads that role’s dashboard & flows';
      PERSONAS.forEach(function (p) {
        var o = document.createElement('option'); o.value = p[1]; o.textContent = p[0];
        if (p[1] === current) o.selected = true;
        psel.appendChild(o);
      });
      psel.onchange = function () {
        var v = this.value;
        if (!v || v === '#') { this.value = current; return; }
        try { localStorage.setItem('exceed_persona', v); } catch (e) {}
        if (v.toLowerCase() !== here) location.href = v;
      };
      pwrap.appendChild(psel);
      actions.insertBefore(pwrap, actions.firstChild); // left-most → before Copilot
    }

    // ---- Recent / Pinned leads in the sidebar (persona views only, not the home chooser) ----
    (function () {
      var page = (location.pathname.split('/').pop() || '').toLowerCase();
      if (page === '' || page === 'index.html') return;
      if (document.getElementById('cwRecentGrp')) return;
      var dash = null;
      document.querySelectorAll('.sidebar a, .sb-nav a, .sidebar-nav a').forEach(function (a) {
        var ico = a.querySelector('.material-symbols-outlined');
        if (ico && ico.textContent.trim().toLowerCase() === 'dashboard') dash = a;
      });
      if (!dash || !dash.parentNode) return;
      var conv = dash.className.indexOf('nav-item') >= 0 ? 'nav-item' : 'sb-item';
      function load(key, seed) {
        var v; try { v = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
        if (!v || !v.length) { v = seed; try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
        return v;
      }
      function save(key, arr) { try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {} }
      var recents = load('exceed_recent_leads', [
        { name: 'Abbas Jaffy' }, { name: 'Maya Hassan' }, { name: 'Sara Ali' },
        { name: 'Hiren Patel' }, { name: 'Karim Saleh' }, { name: 'Ahmad Rizk' }, { name: 'Layla Noor' }
      ]);
      var pinned = load('exceed_pinned_leads', [{ name: 'Ahmad Rizk' }]);
      function isPinned(n) { return pinned.some(function (p) { return p.name === n; }); }
      function togglePin(n) {
        if (isPinned(n)) pinned = pinned.filter(function (p) { return p.name !== n; });
        else pinned = pinned.concat([{ name: n }]);
        save('exceed_pinned_leads', pinned);
        renderAll();
      }
      function initials(n) { return (n || '?').split(/\s+/).map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
      function avClass(n) { var s = 0; for (var i = 0; i < (n || '').length; i++) s += n.charCodeAt(i); return 'a' + (s % 6 + 1); }
      function item(r) {
        var a = document.createElement('a');
        a.href = 'lead-detail.html?lead=' + encodeURIComponent(r.name);
        a.className = conv + ' enabled cw-r-item';
        var on = isPinned(r.name);
        a.innerHTML = '<span class="cw-r-av ' + avClass(r.name) + '">' + initials(r.name) + '</span>' +
          '<span class="cw-r-name">' + r.name + '</span>' +
          '<span class="cw-r-pin material-symbols-outlined' + (on ? ' on' : '') + '" title="' + (on ? 'Unpin lead' : 'Pin lead') + '">push_pin</span>';
        a.querySelector('.cw-r-pin').onclick = function (e) { e.preventDefault(); e.stopPropagation(); togglePin(r.name); };
        return a;
      }
      var recList, pinList;
      function fill(el, arr) { el.innerHTML = ''; arr.forEach(function (r) { el.appendChild(item(r)); }); }
      function renderAll() { fill(recList, recents); fill(pinList, pinned); }
      function group(id, title, hicon) {
        var g = document.createElement('div'); g.className = 'cw-rgrp'; if (id) g.id = id;
        var h = document.createElement('div'); h.className = 'cw-rgrp-head';
        h.innerHTML = '<span class="material-symbols-outlined cw-rico">' + hicon + '</span><span>' + title + '</span><span class="material-symbols-outlined cw-rcaret">expand_more</span>';
        var l = document.createElement('div'); l.className = 'cw-rlist';
        h.onclick = function () { g.classList.toggle('collapsed'); };
        g.appendChild(h); g.appendChild(l);
        return { grp: g, list: l };
      }
      var rec = group('cwRecentGrp', 'Recent', 'schedule'); recList = rec.list;
      var pin = group('cwPinnedGrp', 'Pinned', 'push_pin'); pinList = pin.list;
      renderAll();
      dash.parentNode.insertBefore(rec.grp, dash.nextSibling);
      rec.grp.parentNode.insertBefore(pin.grp, rec.grp.nextSibling);
    })();
   } catch (e) { console.warn('copilot-widget injection skipped:', e); }
  });
})();
