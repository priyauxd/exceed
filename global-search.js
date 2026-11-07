/* Global search for the top bar on every page.
 * Turns the existing ".topbar .search" input into a Dataverse-style search with:
 *  - intent detection (phone, Emirates ID, VIN, plate, record no., email, plain-language question)
 *  - results grouped by customer, showing where each one matched
 *  - quick actions (call, open Customer 360) right in the suggestion
 *  - recent searches + recently viewed customers, keyboard navigation, "/" to focus
 * Enter opens customer-360.html with all results; picking a customer opens their 360. */
(function () {
  function boot() {
    var input = document.querySelector('.topbar .search');
    if (!input || input.__gs) return;
    if (!window.C360) {
      var s = document.createElement('script'); s.src = 'customer-data.js?v=2'; s.onload = boot; document.head.appendChild(s); return;
    }
    input.__gs = true;
    var S = window.C360;
    input.setAttribute('placeholder', 'Search customers, mobile, Emirates ID, VIN, quote…');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', 'gsPanel');

    var css = document.createElement('style');
    css.textContent = [
      '.topbar .search{max-width:440px;transition:background .15s,box-shadow .15s}',
      '.topbar .search:focus{outline:none;background:#fff;color:var(--ink,#242424);box-shadow:0 0 0 2px rgba(0,183,187,.55)}',
      '.topbar .search:focus::placeholder{color:#707070}',
      '.gs-kbd{position:absolute;font:600 10px/1 var(--fontFamilyBase,inherit);color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.35);border-radius:4px;padding:2px 5px;pointer-events:none}',
      '.gs-panel{position:fixed;z-index:400;background:var(--surface,#fff);border:1px solid var(--border,#e0e0e0);border-radius:8px;box-shadow:0 8px 16px rgba(0,0,0,.07),0 24px 48px rgba(0,0,0,.10);max-height:min(560px,calc(100vh - 70px));overflow-y:auto;display:none;font-family:var(--fontFamilyBase,inherit);color:var(--ink,#242424)}',
      '.gs-panel.open{display:block}',
      '.gs-sec{padding:10px 0 4px}',
      '.gs-sec+.gs-sec{border-top:1px solid var(--border-soft,#f0f0f0)}',
      '.gs-h{font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-muted,#616161);padding:0 14px 6px;display:flex;align-items:center;gap:6px}',
      '.gs-intent{display:flex;align-items:center;gap:8px;margin:10px 12px 2px;padding:7px 10px;border-radius:6px;background:var(--blue-soft,#eaeef3);font-size:11.5px;color:var(--ink-secondary,#424242)}',
      '.gs-intent .material-symbols-outlined{font-size:16px;color:var(--blue,#17293d)}',
      '.gs-intent b{color:var(--ink,#242424)}',
      '.gs-intent.ai{background:var(--purple-soft,#f2eaf8);color:#5c2e91}',
      '.gs-intent.ai .material-symbols-outlined{color:#7c6dd8}',
      '.gs-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}',
      '.gs-chip{display:inline-flex;align-items:center;gap:4px;font:600 11px/1 var(--fontFamilyBase,inherit);color:var(--ink-secondary,#424242);background:var(--bg,#f5f5f5);border:1px solid var(--border,#e0e0e0);border-radius:999px;padding:5px 10px;cursor:pointer}',
      '.gs-chip:hover{background:var(--blue-soft,#eaeef3);color:var(--blue,#17293d);border-color:var(--blue-muted,#98a6b6)}',
      '.gs-chip .material-symbols-outlined{font-size:14px}',
      '.gs-chip.ai{color:#5c2e91;background:#f2eaf8;border-color:#ddd5f5}',
      '.gs-row{display:flex;align-items:center;gap:10px;padding:8px 14px;cursor:pointer;text-decoration:none;color:inherit}',
      '.gs-row:hover,.gs-row.sel{background:var(--blue-soft,#eaeef3)}',
      '.gs-av{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;color:#fff;font-size:11.5px;font-weight:700}',
      '.gs-main{flex:1;min-width:0}',
      '.gs-name{font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.gs-type{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--blue,#17293d);background:var(--blue-soft,#eaeef3);border-radius:999px;padding:2px 7px}',
      '.gs-type.co{color:#0f6c6c;background:#e8f4f4}',
      '.gs-hit{font-size:11.5px;color:var(--ink-muted,#616161);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}',
      '.gs-hit mark,.gs-name mark{background:none;color:var(--blue,#17293d);font-weight:700;text-decoration:underline;text-decoration-color:#00b7bb;text-underline-offset:2px}',
      '.gs-meta{display:flex;gap:10px;font-size:10.5px;color:var(--ink-muted,#616161);margin-top:3px;white-space:nowrap}',
      '.gs-meta span{display:inline-flex;align-items:center;gap:3px}',
      '.gs-meta .material-symbols-outlined{font-size:13px}',
      '.gs-acts{display:flex;gap:4px;flex-shrink:0;opacity:.55}',
      '.gs-row:hover .gs-acts,.gs-row.sel .gs-acts{opacity:1}',
      '.gs-act{width:28px;height:28px;border-radius:4px;border:1px solid var(--border,#e0e0e0);background:var(--surface,#fff);color:var(--blue,#17293d);display:grid;place-items:center;cursor:pointer}',
      '.gs-act:hover{background:var(--blue,#17293d);color:#fff;border-color:var(--blue,#17293d)}',
      '.gs-act .material-symbols-outlined{font-size:16px}',
      '.gs-foot{position:sticky;bottom:0;background:var(--surface,#fff);border-top:1px solid var(--border,#e0e0e0);display:flex;align-items:center;gap:6px;padding:8px 10px}',
      '.gs-all{flex:1;display:flex;align-items:center;gap:6px;font:600 12px/1 var(--fontFamilyBase,inherit);color:var(--blue,#17293d);background:none;border:none;border-radius:4px;padding:8px;cursor:pointer;text-align:start}',
      '.gs-all:hover,.gs-all.sel{background:var(--blue-soft,#eaeef3)}',
      '.gs-all .material-symbols-outlined{font-size:16px}',
      '.gs-ask{display:flex;align-items:center;gap:5px;font:600 12px/1 var(--fontFamilyBase,inherit);color:#5c2e91;background:#f2eaf8;border:1px solid #ddd5f5;border-radius:4px;padding:7px 10px;cursor:pointer;white-space:nowrap}',
      '.gs-ask .material-symbols-outlined{font-size:15px}',
      '.gs-keys{font-size:10px;color:var(--ink-muted,#616161);display:flex;gap:8px;padding-inline-end:4px;white-space:nowrap}',
      '.gs-keys kbd{font:600 9.5px/1 var(--fontFamilyBase,inherit);border:1px solid var(--border,#e0e0e0);border-radius:3px;padding:1px 4px;background:var(--bg,#f5f5f5)}',
      '.gs-empty{padding:18px 14px;font-size:12px;color:var(--ink-muted,#616161);text-align:center}'
    ].join('\n');
    document.head.appendChild(css);

    var panel = document.createElement('div');
    panel.className = 'gs-panel'; panel.id = 'gsPanel'; panel.setAttribute('role', 'listbox');
    document.body.appendChild(panel);

    var kbd = document.createElement('span'); kbd.className = 'gs-kbd'; kbd.textContent = '/';
    input.parentNode.insertBefore(kbd, input.nextSibling);

    var sel = -1, items = [];
    var go = function (url) { location.href = url; };
    var openQ = function (q) { S.addRecent(q); go('customer-360.html?q=' + encodeURIComponent(q)); };
    var openC = function (id, q) { if (q) S.addRecent(q); S.addViewed(id); go('customer-360.html?id=' + encodeURIComponent(id)); };

    function place() {
      var r = input.getBoundingClientRect(), w = Math.max(r.width, 520);
      panel.style.top = (r.bottom + 6) + 'px';
      panel.style.width = w + 'px';
      var left = r.left + r.width / 2 - w / 2;
      panel.style.left = Math.max(8, Math.min(left, window.innerWidth - w - 8)) + 'px';
      kbd.style.display = input.value || document.activeElement === input ? 'none' : '';
      kbd.style.top = (r.top + r.height / 2 - 8) + 'px';
      kbd.style.left = (document.documentElement.dir === 'rtl' ? r.left + 10 : r.right - 22) + 'px';
      kbd.style.position = 'fixed';
    }

    function custRow(res, q) {
      var c = res.c, n = S.counts(c), h = res.hits[0] || {};
      var hit = h.field === 'Name' || !h.field ? (c.city + ' · ' + c.id) : (h.field + ' · ' + S.mark(h.value, q) + (h.ctx ? ' — ' + h.ctx : ''));
      if (h.field === 'Copilot') hit = res.hits.map(function (x) { return x.value; }).join(' · ');
      return '<div class="gs-row" data-id="' + c.id + '" role="option">' +
        '<div class="gs-av" style="background:' + c.av + '">' + c.initials + '</div>' +
        '<div class="gs-main"><div class="gs-name">' + S.mark(c.name, h.field === 'Name' ? q : '') + ' <span class="gs-type' + (c.type === 'Company' ? ' co' : '') + '">' + c.type + '</span></div>' +
        '<div class="gs-hit">' + hit + '</div>' +
        '<div class="gs-meta"><span><span class="material-symbols-outlined">directions_car</span>' + n.vehicles + ' vehicle' + (n.vehicles === 1 ? '' : 's') + '</span>' +
        '<span><span class="material-symbols-outlined">trending_up</span>' + n.openSales + ' open sales</span>' +
        '<span><span class="material-symbols-outlined">build</span>' + n.nextService + '</span></div></div>' +
        '<div class="gs-acts"><button class="gs-act" data-call="' + c.mobile + '" title="Call ' + c.mobile + '" aria-label="Call"><span class="material-symbols-outlined">call</span></button>' +
        '<button class="gs-act" data-open="' + c.id + '" title="Open Customer 360" aria-label="Open Customer 360"><span class="material-symbols-outlined">open_in_new</span></button></div></div>';
    }

    function render() {
      var q = input.value.trim(), h = '';
      if (!q) {
        h += '<div class="gs-sec"><div class="gs-h"><span class="material-symbols-outlined" style="font-size:14px">history</span>Recent searches</div><div class="gs-chips">' +
          S.recent().map(function (r) { return '<button class="gs-chip" data-q="' + r.replace(/"/g, '&quot;') + '">' + r + '</button>'; }).join('') + '</div></div>';
        h += '<div class="gs-sec"><div class="gs-h"><span class="material-symbols-outlined" style="font-size:14px">visibility</span>Recently viewed customers</div>' +
          S.viewed().map(function (c) { return custRow({ c: c, hits: [] }, ''); }).join('') + '</div>';
        h += '<div class="gs-sec"><div class="gs-h">Search by anything</div><div class="gs-chips">' +
          [['call', 'Mobile', '050 123 4567'], ['badge', 'Emirates ID', '784-1985'], ['directions_car', 'VIN', 'LVX-2025'], ['pin', 'Plate', 'Dubai A 48211'], ['receipt_long', 'Quote / order no.', 'SO-2026'], ['business', 'Company', 'Al Noor']]
            .map(function (x) { return '<button class="gs-chip" data-q="' + x[2] + '"><span class="material-symbols-outlined">' + x[0] + '</span>' + x[1] + '</button>'; }).join('') +
          '<button class="gs-chip ai" data-q="Customers in Sharjah with service due"><span class="material-symbols-outlined">auto_awesome</span>Ask: customers in Sharjah with service due</button></div></div>';
      } else {
        var r = S.search(q), it = r.intent;
        if (it.key === 'nl') {
          h += '<div class="gs-intent ai"><span class="material-symbols-outlined">auto_awesome</span><span>Copilot read this as: <b>' + (r.nl.length ? r.nl.join(' · ') : 'no filters recognised — try a city, "service due", "finance", "fleet"') + '</b></span></div>';
        } else if (it.key !== 'name') {
          h += '<div class="gs-intent"><span class="material-symbols-outlined">' + it.icon + '</span><span>Looks like a <b>' + it.label.toLowerCase() + '</b> — searching across contacts, accounts, vehicles and orders</span></div>';
        }
        h += '<div class="gs-sec"><div class="gs-h">Customers · ' + r.results.length + '</div>' +
          (r.results.length ? r.results.slice(0, 5).map(function (x) { return custRow(x, q); }).join('') : '<div class="gs-empty">No customer matches “' + q.replace(/</g, '&lt;') + '”. Try a mobile number, VIN or quote number.</div>') + '</div>';
      }
      h += '<div class="gs-foot"><button class="gs-all" data-all="1"><span class="material-symbols-outlined">search</span>' + (q ? 'See all results for “' + q.replace(/</g, '&lt;') + '”' : 'Open search') + '</button>' +
        '<span class="gs-keys"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></span>' +
        (q ? '<button class="gs-ask" data-ask="1"><span class="material-symbols-outlined">auto_awesome</span>Ask Copilot</button>' : '') + '</div>';
      panel.innerHTML = h;
      items = Array.prototype.slice.call(panel.querySelectorAll('.gs-row, .gs-all'));
      sel = -1;
    }

    function show() { render(); place(); panel.classList.add('open'); input.setAttribute('aria-expanded', 'true'); }
    function hide() { panel.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); place(); }
    function move(d) {
      if (!items.length) return;
      if (sel > -1) items[sel].classList.remove('sel');
      sel = (sel + d + items.length) % items.length;
      items[sel].classList.add('sel'); items[sel].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('focus', show);
    input.addEventListener('input', show);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!panel.classList.contains('open')) show(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Escape') { hide(); input.blur(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var it = items[sel], q = input.value.trim();
        if (it && it.dataset.id) openC(it.dataset.id, q);
        else if (q) openQ(q);
      }
    });
    panel.addEventListener('mousedown', function (e) { e.preventDefault(); });   // keep focus in the input
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-call],[data-open],[data-q],[data-all],[data-ask],.gs-row');
      if (!t) return;
      var q = input.value.trim();
      if (t.dataset.call) { window.location.href = 'tel:' + t.dataset.call.replace(/\s/g, ''); return; }
      if (t.dataset.open) { openC(t.dataset.open, q); return; }
      if (t.dataset.q) { input.value = t.dataset.q; show(); input.focus(); return; }
      if (t.dataset.all) { openQ(q || ''); return; }
      if (t.dataset.ask) { if (typeof window.toggleCopilot === 'function') { hide(); window.toggleCopilot(); } else openQ(q); return; }
      if (t.dataset.id) openC(t.dataset.id, q);
    });
    document.addEventListener('click', function (e) { if (e.target !== input && !panel.contains(e.target)) hide(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '') && !(document.activeElement || {}).isContentEditable) { e.preventDefault(); input.focus(); }
    });
    window.addEventListener('resize', place);
    input.addEventListener('blur', function () { setTimeout(place, 0); });
    place();
    window.GlobalSearch = { open: function (q) { input.value = q || ''; input.focus(); show(); } };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
