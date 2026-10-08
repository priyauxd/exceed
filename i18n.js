/* English ↔ Arabic UI switch.
 * Strings live in i18n-ar.js (window.I18N_AR). The page's own markup and render
 * functions stay in English; this layer translates text nodes and UI attributes
 * as they enter the DOM, so switching language never re-renders or resets state.
 * Record data (names, notes, emails, phones, IDs) is not in the dictionary and
 * passes through untouched, as it would in Dynamics 365. */
(function () {
  var KEY = 'exeed-lang';
  var ATTRS = ['placeholder', 'title', 'aria-label', 'data-title', 'data-tip'];
  var SKIP = 'script,style,textarea,code,.material-symbols-outlined,.material-icons,[contenteditable="true"],[data-i18n-skip]';
  var LRI = '\u2066', PDI = '\u2069';
  // Directional glyphs mirror in RTL (Fluent/Material bidi guidance); objects, clocks,
  // media, phones, search, charts and checkmarks keep their orientation.
  var FLIP = /^(arrow_back|arrow_forward|arrow_right_alt|chevron_left|chevron_right|navigate_next|navigate_before|keyboard_arrow_left|keyboard_arrow_right|first_page|last_page|send|reply|forward_to_inbox|undo|redo|sort|list_alt|checklist|edit_note|open_in_new|splitscreen_right|view_sidebar|menu_open|login|logout|phone_forwarded)$/;
  var ICON = '.material-symbols-outlined,.material-icons';
  function markIcon(el) { el.classList.toggle('i18n-flip', FLIP.test((el.textContent || '').trim())); }
  // Runs that must read left-to-right: percentages (after Arabic letters digits turn into
  // Arabic numbers and the % would jump to the left), phone numbers, date+time stamps, emails, URLs.
  // Inside an RTL paragraph the spaces between digit groups resolve RTL and reorder
  // the groups ("+971 50 123 4567" → "4567 123 50 +971"), so each run gets an LTR isolate.
  var LTR_RUN = /([−+-]?\d+(?:[.,]\d+)?%|\+?\d[\d.,:\/-]*(?:[ \u00a0]+\+?\d[\d.,:\/-]*)+(?:[ \u00a0]?[AaPp][Mm]\b)?|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|https?:\/\/\S+)/g;
  var LTR_VALUE = /^\s*(\+\d[\d ()\u00a0-]*|\d[\d ()\u00a0-]{6,}|[\w.+-]+@[\w-]+(\.[\w-]+)+|https?:\/\/\S+)\s*$/;

  var lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en'; } catch (e) {}

  var dict = null, patterns = [], contexts = [], post = null;
  function load() {
    if (dict) return;
    var src = window.I18N_AR || { strings: {}, patterns: [] };
    contexts = src.contexts || [];
    post = src.post || null;
    dict = Object.create(null);
    Object.keys(src.strings).forEach(function (k) { dict[norm(k)] = src.strings[k]; });
    patterns = src.patterns || [];
  }
  function norm(s) { return s.replace(/[\s\u00a0]+/g, ' ').trim(); }

  function lookup(key) {
    if (dict[key] != null) return dict[key];
    for (var i = 0; i < patterns.length; i++) {
      var m = key.match(patterns[i][0]);
      if (m) {
        var to = patterns[i][1];
        // In string replacements, captured text is translated too ("Abu Dhabi · 7 deals").
        var r = typeof to === 'function' ? to.apply(null, m.concat([tr])) : to.replace(/\$(\d)/g, function (_, g) {
          var v = m[+g] || ''; if (v === key || !/[A-Za-z]/.test(v)) return v; var t = tr(v); return t == null ? v : t;
        });
        if (r != null) return r;
      }
    }
    return null;
  }
  // Exact match, then pattern, then without leading/trailing marks, then a
  // " · "-separated list translated segment by segment.
  function tr(text) {
    var key = norm(text);
    if (!key || !/[A-Za-z]/.test(key)) return null;
    var hit = lookup(key);
    if (hit != null) return hit;
    var lead = key.match(/^([·•—–|✓✗]\s*)(.+)$/), tail = key.match(/^(.+?)(\s*[›→…:·.—]+)$/);
    if (lead) { var t1 = tr(lead[2]); if (t1 != null) return lead[1] + t1; }
    // ‹ › are Bidi_Mirrored and flip on their own in RTL; → is not.
    if (tail) { var t2 = tr(tail[1]); if (t2 != null) return t2 + tail[2].replace('→', '←'); }
    var seps = [' · ', ' — ', ' – ', ' | '];
    for (var s = 0; s < seps.length; s++) {
      if (key.indexOf(seps[s]) < 0) continue;
      var any = false, parts = key.split(seps[s]).map(function (p) {
        var t = tr(p); if (t != null) { any = true; return t; } return p;
      });
      if (any) return parts.join(seps[s]);
    }
    return null;
  }
  // Untranslated Latin-only text (names, models) is isolated whole, so trailing
  // punctuation stays with it ("Mariam K." not ".Mariam K"); list separators (·, —, |)
  // stay outside the isolate so they keep their place in the RTL reading order.
  function isolate(s) {
    if (/[A-Za-z]/.test(s) && !/[\u0600-\u06ff]/.test(s)) {
      var m = s.match(/^(\s*(?:[·•—–|]\s*)?)([\s\S]*?)((?:\s*[·•—–|])?\s*)$/);
      return m[2] ? m[1] + LRI + m[2] + PDI + m[3] : s;
    }
    return s.replace(LTR_RUN, function (m) { return LRI + m + PDI; });
  }

  function skipped(el) { return !el || (el.closest && el.closest(SKIP)); }

  function doText(n) {
    var p = n.parentNode;
    if (!p || p.nodeType !== 1 || skipped(p)) return;
    // "ours" = still holding our translation; otherwise the page wrote fresh English.
    var ours = n.__ar != null && n.data === n.__ar;
    var src = ours ? n.__en : n.data;
    if (!ours) n.__en = n.__ar = null;
    if (lang !== 'ar') { if (ours) { n.__ar = null; n.data = src; n.__en = null; } return; }
    if (ours) return;
    var t = null, out;
    for (var c = 0; c < contexts.length; c++) if (norm(src) === contexts[c][1] && p.closest(contexts[c][0])) { t = contexts[c][2]; break; }
    if (t == null) t = tr(src);
    if (t != null) {
      var m = src.match(/^(\s*)[\s\S]*?(\s*)$/);
      out = m[1] + t + m[2];
    } else out = src;
    if (post) out = post(out);
    out = isolate(out);
    if (out === src) return;
    n.__en = src; n.__ar = out; n.data = out;
    if (p.tagName === 'OPTION' && !p.hasAttribute('value')) p.setAttribute('value', norm(src));
  }
  function doAttrs(el) {
    if (el.closest('[data-i18n-skip]')) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i]; if (!el.hasAttribute(a)) continue;
      var en = '__en_' + a, ar = '__ar_' + a, cur = el.getAttribute(a);
      var ours = el[ar] != null && el[ar] === cur, src = ours ? el[en] : cur;
      if (lang !== 'ar') { if (ours) { el[ar] = null; el.setAttribute(a, src); } continue; }
      if (ours) continue;
      var t = tr(src);
      if (t != null) { el[en] = src; el[ar] = t; el.setAttribute(a, t); }
    }
    if (el.tagName === 'INPUT') ltrInput(el);
  }

  function ltrInput(el) {
    var on = lang === 'ar' && (/^(tel|email|url|number)$/.test(el.type) || LTR_VALUE.test(el.value || el.placeholder || ''));
    if (on && !el.hasAttribute('dir')) { el.setAttribute('dir', 'ltr'); el.__ltr = true; }
    else if (!on && el.__ltr) { el.removeAttribute('dir'); el.__ltr = false; }
  }

  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (root.matches(ICON)) { markIcon(root); doAttrs(root); return; }
      if (skipped(root)) { if (!root.closest('[data-i18n-skip]')) doAttrs(root); return; }
      doAttrs(root);
    }
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType !== 1 || !n.matches(SKIP)) return NodeFilter.FILTER_ACCEPT;
        if (n.matches(ICON)) markIcon(n);
        if (!n.matches('script,style,[data-i18n-skip]')) doAttrs(n);
        return NodeFilter.FILTER_REJECT;
      }
    });
    var n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }

  var busy = false;
  var mo = new MutationObserver(function (list) {
    if (busy) return;
    busy = true;
    try {
      for (var i = 0; i < list.length; i++) {
        var r = list[i];
        var el = r.target.nodeType === 1 ? r.target : r.target.parentNode;
        if (el && el.nodeType === 1 && el.matches(ICON)) { markIcon(el); continue; }   // ligature changed
        if (r.type === 'childList') { for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]); }
        else if (r.type === 'characterData') doText(r.target);
        else doAttrs(r.target);
      }
    } finally { mo.takeRecords(); busy = false; }
  });

  function applyRoot() {
    var html = document.documentElement;
    html.setAttribute('lang', lang === 'ar' ? 'ar-AE' : 'en');
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    var sw = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < sw.length; i++) sw[i].setAttribute('aria-pressed', sw[i].getAttribute('data-lang') === lang ? 'true' : 'false');
  }

  function set(next) {
    next = next === 'ar' ? 'ar' : 'en';
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    load(); applyRoot();
    busy = true;
    try { walk(document.body); } finally { mo.takeRecords(); busy = false; }
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
  }

  // English source text of an element, for page code that reads labels back from the DOM.
  function text(el) {
    if (!el) return '';
    var out = '', w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) out += n.__en != null ? n.__en : n.data;
    return out.replace(/[\u2066-\u2069]/g, '');
  }

  function injectSwitch() {
    if (document.querySelector('.lang-switch')) return;
    var host = document.querySelector('.topbar .actions') || document.querySelector('.topbar') || document.querySelector('.page-header');
    if (!host) return;
    var box = document.createElement('div');
    box.className = 'lang-switch'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Language / اللغة');
    box.setAttribute('data-i18n-skip', '');
    box.innerHTML = '<button type="button" data-lang="en" lang="en" dir="ltr">English</button><span aria-hidden="true">|</span><button type="button" data-lang="ar" lang="ar" dir="rtl">العربية</button>';
    box.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(b.getAttribute('data-lang')); });
    host.insertBefore(box, host.firstChild);
    applyRoot();
  }

  window.I18N = {
    get lang() { return lang; }, set: set, text: text,
    t: function (s) { if (lang !== 'ar') return s; load(); var r = tr(s); return r == null ? s : r; }
  };

  applyRoot();
  if (lang === 'ar') load();
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  function ready() { load(); injectSwitch(); busy = true; try { walk(document.body); } finally { mo.takeRecords(); busy = false; } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  // A page restored from the back/forward cache (or open in another tab) keeps the language it
  // was left in; re-read the saved choice whenever it is shown again.
  function sync() { var saved = 'en'; try { saved = localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en'; } catch (e) {} if (saved !== lang) set(saved); }
  window.addEventListener('pageshow', function (e) { if (e.persisted) sync(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) sync(); });
})();
