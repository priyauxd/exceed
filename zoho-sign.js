/* Zoho Sign — send for signature from the lead, including the in-person signing session.
 * Mirrors the Zoho Sign flow inside the CRM:
 *   1 Recipients & settings → 2 Place fields → Confirm details → (in person) Pass control to signer
 *   → consent → sign → Finish → Pass control to host → Finish session → Completed (download / email / print).
 * Remote recipients ("Needs to sign") get the document by Email / SMS / WhatsApp and the flow ends at "Sent".
 * API: ZohoSign.open({ docs:[names], doc:name, lead:{name,email,phone,id}, prop:{id,model,vin,price,down},
 *                       host:{name,email}, onDone:function(res){} })
 *      res = { doc, mode:'inperson'|'remote', via, signer, signedAt, copyTo, file }
 */
(function () {
  var css = `
  .zsf-ov.page { padding:0; background:#f6f7f9; } .zsf-ov.page .zsf { width:100%; height:100%; border-radius:0; box-shadow:none; }
  .zsf-ov { position:fixed; inset:0; z-index:9000; background:rgba(15,23,42,.45); display:flex; align-items:center; justify-content:center; padding:24px; }
  .zsf { width:min(1180px,100%); height:min(860px,100%); background:#fff; border-radius:12px; box-shadow:0 24px 64px rgba(15,23,42,.3); display:flex; flex-direction:column; overflow:hidden; font-size:13px; color:#1f2937; }
  .zsf-h { display:flex; align-items:center; gap:12px; padding:12px 18px; border-bottom:1px solid #e6e8ec; }
  .zsf-logo { width:30px; height:30px; border-radius:8px; background:#e8f3ee; color:#1f7a55; display:inline-flex; align-items:center; justify-content:center; }
  .zsf-logo .material-symbols-outlined { font-size:19px; }
  .zsf-ttl { font-weight:650; font-size:15px; } .zsf-ttl small { display:block; font-weight:400; font-size:11.5px; color:#667085; }
  .zsf-steps { display:flex; align-items:center; gap:6px; margin-inline-start:auto; font-size:12px; color:#667085; }
  .zsf-steps span.s { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; }
  .zsf-steps span.s i { font-style:normal; width:18px; height:18px; border-radius:50%; background:#eef0f3; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; }
  .zsf-steps span.s.on { color:#0b1220; font-weight:600; background:#f2f4f7; } .zsf-steps span.s.on i { background:#1f7a55; color:#fff; }
  .zsf-steps span.s.done i { background:#d1fadf; color:#0e7a3e; }
  .zsf-steps .sep { width:14px; height:1px; background:#d0d5dd; }
  .zsf-x { border:0; background:none; cursor:pointer; color:#475467; padding:4px; border-radius:6px; margin-inline-start:8px; } .zsf-x:hover { background:#f2f4f7; }
  .zsf-b { flex:1; overflow:auto; }
  .zsf-f { display:flex; align-items:center; gap:8px; padding:12px 18px; border-top:1px solid #e6e8ec; background:#fafbfc; }
  .zsf-f .grow { flex:1; }
  .zsf-btn { display:inline-flex; align-items:center; gap:6px; border:1px solid #d0d5dd; background:#fff; color:#1f2937; border-radius:6px; padding:7px 14px; font:600 13px inherit; cursor:pointer; }
  .zsf-btn:hover { background:#f9fafb; } .zsf-btn .material-symbols-outlined { font-size:17px; }
  .zsf-btn.pri { background:#1f7a55; border-color:#1f7a55; color:#fff; } .zsf-btn.pri:hover { background:#196847; }
  .zsf-btn:disabled { opacity:.45; cursor:default; }
  .zsf-pad { padding:20px 24px; max-width:1040px; }
  .zsf-sec { margin-bottom:22px; } .zsf-sec > h4 { margin:0 0 10px; font-size:13.5px; font-weight:650; }
  .zsf-docs { display:flex; gap:10px; flex-wrap:wrap; }
  .zsf-doc { width:150px; border:1.5px solid #e6e8ec; border-radius:10px; padding:10px; cursor:pointer; background:#fff; text-align:start; font:inherit; display:flex; flex-direction:column; gap:8px; }
  .zsf-doc.on { border-color:#1f7a55; box-shadow:0 0 0 3px #e8f3ee; }
  .zsf-doc .pg { height:96px; border-radius:6px; background:#f6f7f9 repeating-linear-gradient(180deg, transparent 0 9px, #e4e7ec 9px 10px); background-clip:content-box; padding:12px 14px; border:1px solid #eef0f3; }
  .zsf-doc b { font-size:12px; } .zsf-doc span { font-size:11px; color:#667085; }
  .zsf-doc.up { align-items:center; justify-content:center; border-style:dashed; color:#475467; min-height:150px; }
  .zsf-doc.up .material-symbols-outlined { font-size:26px; color:#1f7a55; }
  .zsf-row { display:grid; grid-template-columns:150px minmax(0,1fr); align-items:center; gap:12px; margin-bottom:10px; }
  .zsf-row > label { color:#475467; font-size:12.5px; }
  .zsf-in, .zsf-sel, .zsf-ta { width:100%; border:1px solid #d0d5dd; border-radius:6px; padding:7px 10px; font:inherit; background:#fff; color:#1f2937; }
  .zsf-in:focus, .zsf-sel:focus, .zsf-ta:focus { outline:2px solid #1f7a5533; border-color:#1f7a55; }
  .zsf-in[readonly] { background:#f6f7f9; }
  .zsf-ta { min-height:64px; resize:vertical; }
  .zsf-tools { display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
  .zsf-chk { display:inline-flex; align-items:center; gap:6px; border:1px solid #e6e8ec; border-radius:6px; padding:5px 10px; font-size:12.5px; cursor:pointer; background:#fff; }
  .zsf-chk input { accent-color:#1f7a55; margin:0; }
  .zsf-rc { border:1px solid #e6e8ec; border-inline-start:3px solid #1f7a55; border-radius:8px; padding:10px 12px; margin-bottom:10px; display:grid; grid-template-columns:28px minmax(0,1.2fr) minmax(0,1fr) 170px 150px 28px; gap:8px; align-items:center; }
  .zsf-rc .n { width:26px; height:26px; border:1px solid #d0d5dd; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; }
  .zsf-rc .lbl { font-size:11px; color:#667085; font-weight:600; text-transform:uppercase; letter-spacing:.02em; }
  .zsf-rc .host { grid-column:2 / -1; display:grid; grid-template-columns:62px minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr); gap:8px; align-items:center; padding-top:8px; border-top:1px dashed #e6e8ec; }
  .zsf-rc .del { border:0; background:none; cursor:pointer; color:#98a2b3; } .zsf-rc .del:hover { color:#b42318; }
  .zsf-more { border:0; background:none; font:600 13.5px inherit; cursor:pointer; display:inline-flex; align-items:center; gap:4px; padding:0; color:#1f2937; }
  .zsf-hint { font-size:11.5px; color:#667085; margin:-4px 0 10px 162px; }
  .zsf-inline { display:flex; align-items:center; gap:8px; } .zsf-inline .zsf-in { width:70px; }
  /* place fields / signing */
  .zsf-ws { display:grid; grid-template-columns:150px minmax(0,1fr) 260px; height:100%; }
  .zsf-ws.sign { grid-template-columns:150px minmax(0,1fr); }
  .zsf-thumbs { border-inline-end:1px solid #e6e8ec; padding:12px; overflow:auto; background:#fafbfc; }
  .zsf-thumbs h5 { margin:0 0 4px; font-size:12.5px; } .zsf-thumbs small { color:#667085; font-size:11px; }
  .zsf-th { margin-top:10px; border:1.5px solid #e6e8ec; border-radius:6px; height:120px; background:#fff repeating-linear-gradient(180deg, transparent 0 7px, #eef0f3 7px 8px); background-clip:content-box; padding:10px 12px; position:relative; cursor:pointer; }
  .zsf-th.on { border-color:#1f7a55; } .zsf-th em { position:absolute; bottom:4px; inset-inline-start:6px; font-style:normal; font-size:11px; color:#475467; background:#fff; padding:0 3px; }
  .zsf-canvas { background:#e9ecf1; overflow:auto; padding:22px; }
  .zsf-page { width:min(760px,100%); margin:0 auto 18px; background:#fff; box-shadow:0 2px 10px rgba(15,23,42,.12); padding:28px 34px; font-family:Georgia, 'Times New Roman', serif; font-size:12px; color:#1f2937; position:relative; }
  .zsf-page .docid { font:11px ui-monospace, Menlo, monospace; color:#475467; margin-bottom:10px; }
  .zsf-page .top { display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #e4e7ec; padding-bottom:10px; margin-bottom:12px; }
  .zsf-page .brand { font:800 22px/1 'Segoe UI', system-ui, sans-serif; letter-spacing:.18em; }
  .zsf-page .doc-t { text-align:center; font:700 15px 'Segoe UI', system-ui, sans-serif; } .zsf-page .doc-t span { display:block; font-weight:600; font-size:14px; direction:rtl; }
  .zsf-page .demo { font:10.5px 'Segoe UI', system-ui, sans-serif; color:#b42318; text-align:end; }
  .zsf-page table { width:100%; border-collapse:collapse; margin:8px 0; font-size:11px; } .zsf-page td, .zsf-page th { border:1px solid #d0d5dd; padding:4px 6px; text-align:start; }
  .zsf-page .kv { display:grid; grid-template-columns:160px 1fr; gap:3px 12px; margin-bottom:10px; } .zsf-page .kv span:nth-child(odd) { color:#475467; }
  .zsf-page .two { display:grid; grid-template-columns:1fr 1fr; gap:14px; } .zsf-page .ar { direction:rtl; text-align:right; }
  .zsf-page h6 { font:700 12px 'Segoe UI', system-ui, sans-serif; margin:12px 0 6px; }
  .zsf-page p { margin:0 0 6px; line-height:1.45; }
  .zsf-page .lines { height:180px; background:repeating-linear-gradient(180deg, transparent 0 13px, #eef0f3 13px 14px); }
  .zsf-sigline { display:flex; align-items:center; gap:6px; margin:6px 0 10px; }
  .zsf-fld { min-width:170px; height:34px; border:1.5px dashed #1f7a55; background:#e8f3ee; border-radius:4px; display:inline-flex; align-items:center; gap:6px; padding:0 8px; font:600 12px 'Segoe UI', system-ui, sans-serif; color:#1f7a55; position:relative; }
  .zsf-fld small { font-weight:500; color:#4b8f72; }
  .zsf-fld .rm { border:0; background:none; cursor:pointer; color:#4b8f72; padding:0; margin-inline-start:auto; display:inline-flex; } .zsf-fld .rm .material-symbols-outlined { font-size:15px; }
  .zsf-fld.todo { border-color:#f79009; background:#fffaeb; color:#b54708; cursor:pointer; animation:zsfPulse 1.6s infinite; }
  .zsf-fld.lock { opacity:.6; cursor:not-allowed; animation:none; }
  .zsf-fld.done { border:1px solid #1f7a55; background:#fff; padding:0 10px; }
  .zsf-fld.done .sig { font:26px/1 'Snell Roundhand','Apple Chancery','Brush Script MT','Segoe Script',cursive; color:#0b1220; }
  .zsf-fld.done img { height:30px; }
  @keyframes zsfPulse { 0%,100% { box-shadow:0 0 0 0 #f7900955; } 50% { box-shadow:0 0 0 5px #f7900911; } }
  .zsf-side { border-inline-start:1px solid #e6e8ec; display:flex; flex-direction:column; overflow:auto; }
  .zsf-fld.free { position:absolute; z-index:3; cursor:move; margin:0; }
  .zsf-fld.free.todo, .zsf-fld.free.done { cursor:pointer; }
  .zsf-fld.auto { border:0; background:transparent; min-width:0; padding:0 4px; font:500 12px 'Segoe UI', system-ui, sans-serif; color:#0b1220; }
  .zsf-fld.auto.free { cursor:default; }
  .zsf-page.drop { outline:2px dashed #1f7a55; outline-offset:4px; }
  .zsf-pal button { cursor:grab; } .zsf-pal button:active { cursor:grabbing; } .zsf-pal .grip { margin-inline-end:auto; display:inline-flex; } .zsf-pal .grip .material-symbols-outlined { color:#98a2b3; font-size:15px; }
  .zsf-pal button { justify-content:flex-start; gap:4px; white-space:nowrap; padding:6px 6px; } .zsf-pal button > .material-symbols-outlined:last-child { margin-inline-start:auto; }
  .zsf-sh { padding:10px 18px; } .zsf-sh .zsf-ttl { font-size:18px; font-weight:500; }
  .zsf-consent { padding:12px 16px; } .zsf-consent > .material-symbols-outlined { color:#475467; }
  .zsf-consent a { text-decoration:underline; text-underline-offset:3px; }
  .zsf-big { line-height:1.15; padding:8px 26px; font-size:14px; }
  .zsf-tb { background:#fff; gap:6px; } .zsf-tb p { flex:0 1 auto; color:#475467; }
  .zsf-ib { border:0; background:none; cursor:pointer; color:#475467; padding:6px; border-radius:6px; display:inline-flex; } .zsf-ib:hover { background:#f2f4f7; }
  .zsf-fin { padding:8px 34px; }
  .zsf-ma { position:relative; } .zsf-ma summary { list-style:none; } .zsf-ma summary::-webkit-details-marker { display:none; }
  .zsf-menu2 { position:absolute; inset-inline-end:0; top:calc(100% + 4px); z-index:10; background:#fff; border:1px solid #e6e8ec; border-radius:8px; box-shadow:0 8px 24px rgba(16,24,40,.14); padding:4px; min-width:190px; display:flex; flex-direction:column; }
  .zsf-menu2 button { display:flex; align-items:center; gap:8px; border:0; background:none; padding:8px; border-radius:6px; font:500 12.5px inherit; cursor:pointer; text-align:start; } .zsf-menu2 button:hover { background:#f2f4f7; } .zsf-menu2 .material-symbols-outlined { font-size:17px; color:#475467; }
  .zsf-fld .req { position:absolute; bottom:100%; inset-inline-end:-2px; margin-bottom:2px; font:500 10.5px 'Segoe UI', system-ui, sans-serif; color:#475467; background:#eef0f3; border:1px solid #d0d5dd; padding:1px 6px; white-space:nowrap; }
  .zsf-fld.todo { border:1.5px solid #1f7a55; background:#e8f3ee; color:#1f7a55; animation:none; }
  .zsf-fld.todo.cur { box-shadow:0 0 0 3px #1f7a5533; }
  .zsf-tip, .zsf-fld .req { direction:ltr; }
  .zsf-tip { position:absolute; bottom:calc(100% + 26px); inset-inline-start:50%; transform:translateX(-50%); z-index:6; width:300px; background:#e8f6f1; border:1px solid #9fd3bf; box-shadow:0 8px 20px rgba(15,23,42,.18); padding:14px 16px 10px; font:400 14px 'Segoe UI', system-ui, sans-serif; color:#1f2937; cursor:default; text-align:start; }
  .zsf-tip .nav { display:flex; justify-content:flex-end; gap:22px; margin-top:16px; } .zsf-tip .nav a { text-decoration:underline; cursor:pointer; color:#344054; font-size:13.5px; }
  .zsf-tip .tx { position:absolute; top:-11px; inset-inline-end:-11px; width:22px; height:22px; border:0; background:#1f7a55; color:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; } .zsf-tip .tx .material-symbols-outlined { font-size:16px; }
  .zsf-dlg.notitle .zsf-dlg-h { display:none; } .zsf-dlg.notitle .zsf-sg-tabs { margin-top:-16px; background:#f6f7f9; }
  .zsf-sg-tabs button .material-symbols-outlined { font-size:22px; }
  .zsf-plain { display:inline-flex; align-items:center; gap:8px; font-size:13px; color:#344054; margin-top:4px; } .zsf-plain input { accent-color:#1f7a55; width:15px; height:15px; }
  .zsf-side h5 { margin:0; padding:12px 14px 8px; font-size:13px; }
  .zsf-rl { padding:0 8px 10px; border-bottom:1px solid #e6e8ec; }
  .zsf-rp { display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer; }
  .zsf-rp.on { background:#e8f3ee; box-shadow:inset 3px 0 0 #1f7a55; }
  .zsf-rp i { font-style:normal; width:30px; height:30px; border-radius:50%; background:#d1fadf; color:#0e7a3e; display:inline-flex; align-items:center; justify-content:center; font-weight:700; }
  .zsf-rp.p i { background:#eef0f3; color:#475467; }
  .zsf-rp b { display:block; font-size:12.5px; } .zsf-rp span { font-size:11.5px; color:#667085; }
  .zsf-pal { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:12px; }
  .zsf-pal button { display:flex; align-items:center; justify-content:space-between; border:1px solid #d0d5dd; border-radius:6px; background:#fff; padding:6px 8px; font:500 12px inherit; cursor:pointer; color:#1f2937; }
  .zsf-pal button:hover { border-color:#1f7a55; } .zsf-pal button .material-symbols-outlined { font-size:16px; color:#1f7a55; }
  .zsf-tabs { display:flex; gap:2px; padding:0 12px; border-bottom:1px solid #e6e8ec; } .zsf-tabs span { padding:8px 10px; font-size:12.5px; font-weight:600; border-bottom:2px solid #1f7a55; }
  .zsf-banner { display:flex; align-items:center; gap:14px; padding:10px 16px; background:#f6faf8; border-bottom:1px solid #e6e8ec; }
  .zsf-banner p { margin:0; flex:1; } .zsf-banner a { color:#0b1220; font-weight:600; text-decoration:underline; cursor:pointer; }
  .zsf-banner.ok { background:#ecfdf3; }
  .zsf-signwrap { display:flex; flex-direction:column; height:100%; } .zsf-signwrap > .zsf-ws { flex:1; min-height:0; }
  .zsf-who { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#1f7a55; background:#e8f3ee; padding:3px 10px; border-radius:999px; }
  /* dialogs */
  .zsf-dlg-ov { position:fixed; inset:0; z-index:9100; background:rgba(15,23,42,.35); display:flex; align-items:center; justify-content:center; padding:20px; }
  .zsf-dlg { width:min(560px,100%); background:#fff; border-radius:10px; box-shadow:0 18px 48px rgba(15,23,42,.3); overflow:hidden; }
  .zsf-dlg.wide { width:min(780px,100%); }
  .zsf-dlg-h { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #e6e8ec; font-weight:650; font-size:15px; }
  .zsf-dlg-b { padding:16px 18px; } .zsf-dlg-b ul { margin:8px 0 0; padding-inline-start:18px; line-height:1.7; }
  .zsf-dlg-f { display:flex; justify-content:flex-end; gap:8px; padding:12px 18px; border-top:1px solid #e6e8ec; }
  .zsf-tbl { width:100%; border-collapse:collapse; margin:10px 0 14px; } .zsf-tbl th { background:#f2f4f7; text-align:start; padding:8px 10px; font-size:12px; } .zsf-tbl td { padding:8px 10px; border-bottom:1px solid #eef0f3; } .zsf-tbl .r { text-align:end; }
  .zsf-sg-tabs { display:flex; gap:4px; border-bottom:1px solid #e6e8ec; margin:-16px -18px 14px; padding:0 18px; }
  .zsf-sg-tabs button { border:0; background:none; padding:10px 12px; font:600 12.5px inherit; color:#667085; cursor:pointer; display:inline-flex; flex-direction:column; align-items:center; gap:2px; border-bottom:2px solid transparent; }
  .zsf-sg-tabs button.on { color:#1f7a55; border-color:#1f7a55; }
  .zsf-sg-grid { display:grid; grid-template-columns:1fr 160px; gap:12px; margin-bottom:10px; } .zsf-sg-grid label { font-size:12px; color:#475467; display:block; margin-bottom:4px; }
  .zsf-styles { border:1px solid #eef0f3; border-radius:8px; overflow:hidden; margin-bottom:10px; }
  .zsf-style { display:grid; grid-template-columns:24px 1fr 90px; align-items:center; padding:8px 12px; cursor:pointer; border-top:1px solid #eef0f3; }
  .zsf-style:first-child { border-top:0; } .zsf-style.on { background:#ecfdf3; } .zsf-style .ck { color:#1f7a55; visibility:hidden; } .zsf-style.on .ck { visibility:visible; }
  .zsf-style .s1, .zsf-style .s2, .zsf-style .s3 { font-size:24px; line-height:1.2; }
  .s1 { font-family:'Snell Roundhand','Apple Chancery','Segoe Script',cursive; } .s2 { font-family:'Brush Script MT','Bradley Hand','Segoe Script',cursive; } .s3 { font-family:'Bradley Hand','Chalkboard SE','Comic Sans MS',cursive; }
  .zsf-draw { border:1px dashed #98a2b3; border-radius:8px; background:#fcfcfd; width:100%; height:170px; touch-action:none; cursor:crosshair; display:block; }
  .zsf-done { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px; padding:30px; text-align:center; }
  .zsf-done .ic { width:64px; height:64px; border-radius:50%; background:#d1fadf; color:#0e7a3e; display:inline-flex; align-items:center; justify-content:center; } .zsf-done .ic .material-symbols-outlined { font-size:36px; }
  .zsf-done h3 { margin:0; font-size:20px; } .zsf-done p { margin:0; color:#475467; }
  .zsf-valid { display:inline-flex; align-items:center; gap:6px; background:#ecfdf3; color:#0e7a3e; border:1px solid #abefc6; border-radius:999px; padding:4px 12px; font-weight:600; font-size:12.5px; }
  .zsf-dl { display:flex; gap:8px; margin-top:6px; }
  .zsf-audit { margin-top:10px; width:min(520px,100%); text-align:start; border:1px solid #e6e8ec; border-radius:8px; padding:10px 14px; font-size:12px; color:#475467; }
  .zsf-audit div { display:flex; justify-content:space-between; gap:12px; padding:3px 0; } .zsf-audit b { color:#1f2937; font-weight:600; }
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ic = function (n) { return '<span class="material-symbols-outlined">' + n + '</span>'; };
  var today = function () { return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };
  var ROLES = ['Needs to sign', 'In-person signer', 'Signs with witness', 'Manages recipients', 'Approver', 'Receives a copy'];
  var VIA = ['Email', 'SMS', 'WhatsApp', 'Email + SMS'];
  var S = null; // state of the open flow
  var PAGE = false; // true when running in its own browser window (zoho-sign.html)

  function open(o) {
    var docs = o.docs || ['Sales Quotation', 'Purchase Agreement', 'Duty of care'];
    S = {
      o: o, step: 1, docs: docs, doc: o.doc || docs[0], upload: null, name: o.name || o.doc || docs[0],
      inOrder: true, more: true,
      rc: [{ email: o.lead.email || '', name: o.lead.name || '', role: 'In-person signer', via: 'Email', hostEmail: o.host.email, hostName: o.host.name }],
      set: { days: 15, valid: 'Forever', type: 'Sales', folder: 'Lead · ' + (o.lead.id || ''), desc: '', comments: false, remind: true, every: 5, note: '' },
      fields: [], sel: 0, page: 2, _fid: 0, docId: docId(), agreed: false, sig: null, copyTo: ''
    };
    S.fields = [{ r: 0, kind: 'Signature', at: 'buyer' }, { r: 0, kind: 'Signature', at: 'buyerDate' }];
    PAGE = !!o.page;
    var ov = document.createElement('div'); ov.className = 'zsf-ov' + (PAGE ? ' page' : ''); ov.id = 'zsfOv';
    ov.innerHTML = '<div class="zsf" role="dialog" aria-modal="true" aria-labelledby="zsfTtl"></div>';
    document.body.appendChild(ov);
    if (o.direct) { S.step = 2; paint(); passToSigner(); return; }   // already set up — go straight to the in-person session
    paint();
  }
  function close() {
    var o = document.getElementById('zsfOv'); if (o) o.remove(); closeDlg(); S = null;
    if (PAGE) {
      window.close();   // works because the lead opened this window
      setTimeout(function () { document.body.insertAdjacentHTML('beforeend', '<div class="zs-empty"><span class="material-symbols-outlined">check_circle</span><h1>All done</h1><p>You can close this window and return to the lead.</p></div>'); }, 150);
    }
  }
  function docId() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789', s = ''; for (var i = 0; i < 40; i++) s += a[Math.floor(Math.random() * a.length)] + (i === 7 || i === 19 ? '-' : ''); return s; }
  function inPerson() { return S.rc.some(function (r) { return r.role === 'In-person signer'; }); }
  function signer() { return S.rc.filter(function (r) { return /sign/i.test(r.role); })[0] || S.rc[0]; }

  function head() {
    if (S.step === 3) return '<div class="zsf-h zsf-sh"><span class="zsf-logo">' + ic('draw') + '</span><span class="zsf-ttl">Sign</span><span class="grow" style="flex:1"></span>' +
      '<select class="zsf-sel" style="width:150px" aria-label="Language" onchange="ZohoSign._toast(\'Signing page language: \' + this.value)"><option>English</option><option>العربية</option></select></div>';
    var steps = [['Recipients & settings', 1], ['Place fields', 2], ['Sign', 3]];
    return '<div class="zsf-h"><span class="zsf-logo">' + ic('draw') + '</span><div class="zsf-ttl" id="zsfTtl">' + (S.step === 1 ? 'Send for signatures' : esc(S.name)) + '<small>Zoho Sign · ' + esc(S.o.lead.name) + (S.o.lead.id ? ' · ' + esc(S.o.lead.id) : '') + '</small></div>' +
      '<div class="zsf-steps">' + steps.map(function (s, i) { return (i ? '<span class="sep"></span>' : '') + '<span class="s' + (S.step === s[1] ? ' on' : S.step > s[1] ? ' done' : '') + '"><i>' + (S.step > s[1] ? '✓' : s[1]) + '</i>' + s[0] + '</span>'; }).join('') + '</div>' +
      '<button class="zsf-x" aria-label="Close" onclick="ZohoSign._close()">' + ic('close') + '</button></div>';
  }
  function paint() {
    var box = document.querySelector('#zsfOv .zsf'); if (!box) return;
    var body = S.step === 1 ? step1() : S.step === 2 ? step2() : S.step === 3 ? step3() : stepDone();
    var cv = document.getElementById('zsfCanvas'), keep = cv && S._lastStep === S.step ? cv.scrollTop : null;
    box.innerHTML = head() + body;
    S._lastStep = S.step;
    cv = document.getElementById('zsfCanvas');
    if (cv) cv.scrollTop = keep != null ? keep : (S.step >= 2 ? (document.getElementById('zsfPg2') || {}).offsetTop - 12 || 0 : 0);
  }

  /* ── Step 1 · recipients & settings ── */
  function step1() {
    var docCards = S.docs.map(function (d) {
      return '<button type="button" class="zsf-doc' + (S.doc === d && !S.upload ? ' on' : '') + '" onclick="ZohoSign._doc(\'' + esc(d) + '\')"><div class="pg"></div><b>' + esc(d) + '</b><span>' + (d === 'Duty of care' ? '1 page' : '3 pages') + ' · from CRM</span></button>';
    }).join('') + (S.upload ? '<button type="button" class="zsf-doc on"><div class="pg"></div><b>' + esc(S.upload) + '</b><span>Uploaded</span></button>' : '') +
      '<label class="zsf-doc up">' + ic('upload_file') + '<b>Add document</b><span>Drag files here or browse</span><input type="file" accept=".pdf,.doc,.docx,image/*" hidden onchange="ZohoSign._upload(this)"></label>';
    var rcs = S.rc.map(function (r, i) {
      var isIP = r.role === 'In-person signer';
      return '<div class="zsf-rc"><span class="n">' + (i + 1) + '</span>' +
        '<input class="zsf-in" type="email" placeholder="Email" value="' + esc(r.email) + '" oninput="ZohoSign._rc(' + i + ',\'email\',this.value)">' +
        '<input class="zsf-in" placeholder="Name" value="' + esc(r.name) + '" oninput="ZohoSign._rc(' + i + ',\'name\',this.value)">' +
        '<select class="zsf-sel" onchange="ZohoSign._rc(' + i + ',\'role\',this.value,true)">' + ROLES.map(function (x) { return '<option' + (x === r.role ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>' +
        (isIP ? '<span class="lbl" title="The signer signs on your device, in the showroom">On this device</span>'
              : '<select class="zsf-sel" aria-label="Delivery" onchange="ZohoSign._rc(' + i + ',\'via\',this.value)">' + VIA.map(function (x) { return '<option' + (x === r.via ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select>') +
        (S.rc.length > 1 ? '<button class="del" aria-label="Remove recipient" onclick="ZohoSign._rmRc(' + i + ')">' + ic('remove') + '</button>' : '<span></span>') +
        (isIP ? '<div class="host"><span class="lbl">Host</span><input class="zsf-in" value="' + esc(r.hostEmail) + '" oninput="ZohoSign._rc(' + i + ',\'hostEmail\',this.value)" aria-label="Host email"><input class="zsf-in" value="' + esc(r.hostName) + '" oninput="ZohoSign._rc(' + i + ',\'hostName\',this.value)" aria-label="Host name"><span style="font-size:11.5px;color:#667085">You hand your device to the signer, then take control back.</span></div>' : '') +
      '</div>';
    }).join('');
    var s = S.set;
    var more = '<div class="zsf-row"><label>Days to complete</label><input class="zsf-in" type="number" min="1" value="' + s.days + '" oninput="ZohoSign._set(\'days\',this.value)" style="max-width:420px"></div>' +
      '<div class="zsf-row"><label>Agreement valid until</label><select class="zsf-sel" style="max-width:420px" onchange="ZohoSign._set(\'valid\',this.value)">' + ['Forever', '30 days', '90 days', '1 year', 'Custom date'].map(function (x) { return '<option' + (x === s.valid ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div>' +
      '<div class="zsf-row"><label>Document type</label><select class="zsf-sel" style="max-width:420px" onchange="ZohoSign._set(\'type\',this.value)">' + ['Sales', 'Finance', 'Delivery', 'Others'].map(function (x) { return '<option' + (x === s.type ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div>' +
      '<div class="zsf-row"><label>Folder</label><select class="zsf-sel" style="max-width:420px" onchange="ZohoSign._set(\'folder\',this.value)">' + [s.folder, 'None', 'Sales quotations', 'Purchase agreements'].map(function (x) { return '<option' + (x === s.folder ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="zsf-row"><label>Description</label><textarea class="zsf-ta" style="max-width:420px" placeholder="Add description" oninput="ZohoSign._set(\'desc\',this.value)">' + esc(s.desc) + '</textarea></div>' +
      '<div class="zsf-row"><label></label><label class="zsf-chk" style="justify-self:start"><input type="checkbox"' + (s.comments ? ' checked' : '') + ' onchange="ZohoSign._set(\'comments\',this.checked)">Allow recipient comments</label></div>' +
      '<div class="zsf-row"><label></label><label class="zsf-chk" style="justify-self:start"><input type="checkbox"' + (s.remind ? ' checked' : '') + ' onchange="ZohoSign._set(\'remind\',this.checked,true)">Automatic reminders</label></div>' +
      (s.remind ? '<p class="zsf-hint">Automatic reminders are delivered by email, even when the delivery mode is Email + SMS.</p><div class="zsf-row"><label>Send a reminder every</label><span class="zsf-inline"><input class="zsf-in" type="number" min="1" value="' + s.every + '" oninput="ZohoSign._set(\'every\',this.value)"> day(s)</span></div>' : '');
    return '<div class="zsf-b"><div class="zsf-pad">' +
      '<div class="zsf-sec"><h4>Add documents</h4><div class="zsf-docs">' + docCards + '</div></div>' +
      '<div class="zsf-sec"><div class="zsf-row"><label for="zsfName">Document name</label><input id="zsfName" class="zsf-in" style="max-width:420px" value="' + esc(S.name) + '" oninput="ZohoSign._name(this.value)"></div></div>' +
      '<div class="zsf-sec"><h4>Add recipients</h4><div class="zsf-tools">' +
        '<label class="zsf-chk"><input type="checkbox"' + (S.inOrder ? ' checked' : '') + ' onchange="ZohoSign._inOrder(this.checked)">Send in order</label>' +
        '<button class="zsf-chk" onclick="ZohoSign._addMe()">' + ic('person_add') + 'Add me</button>' +
        '<button class="zsf-chk" onclick="ZohoSign._toast(\'Bulk recipients come from a CSV file in Zoho Sign\')">' + ic('group_add') + 'Add bulk recipients</button></div>' +
        rcs + '<button class="zsf-btn" onclick="ZohoSign._addRc()">' + ic('add') + 'Add recipient</button></div>' +
      '<div class="zsf-sec"><button class="zsf-more" aria-expanded="' + S.more + '" onclick="ZohoSign._more()">More settings ' + ic(S.more ? 'expand_less' : 'expand_more') + '</button>' + (S.more ? '<div style="margin-top:12px">' + more + '</div>' : '') + '</div>' +
      '<div class="zsf-sec"><h4>Note to all recipients</h4><textarea class="zsf-ta" style="max-width:600px" placeholder="Add a note" oninput="ZohoSign._set(\'note\',this.value)">' + esc(s.note) + '</textarea></div>' +
    '</div></div>' +
    '<div class="zsf-f"><button class="zsf-btn" onclick="ZohoSign._saveClose()">Save &amp; close</button><span class="grow"></span><button class="zsf-btn pri" onclick="ZohoSign._go(2)">Continue' + ic('arrow_forward') + '</button></div>';
  }

  /* ── The document itself (sales quotation layout, bilingual) ── */
  /* Fields: Signature and Initial need the signer's tap; the others fill themselves in when signing. */
  var FICON = { Signature: 'draw', Initial: 'signature', Stamp: 'approval', Image: 'image', Company: 'apartment', 'Full name': 'badge', Email: 'mail', 'Sign date': 'event', Date: 'calendar_month', Text: 'text_fields' };
  function act(f) { return f.kind === 'Signature' || f.kind === 'Initial'; }
  function autoVal(f) {
    var r = S.rc[f.r] || {};
    return { 'Full name': r.name, Email: r.email, 'Sign date': today(), Date: today(), Company: (S.o.lead.company || '—'), Stamp: 'AGM Sales · stamped', Image: '[image]', Text: f.text || '' }[f.kind] || '';
  }
  function fieldHtml(f, mode, style) {
    var r = S.rc[f.r] || {}, free = style ? ' free' : '', st = style ? ' style="' + style + '"' : '';
    if (mode === 'place') return '<span class="zsf-fld' + free + '"' + st + (style ? ' draggable="true" ondragstart="ZohoSign._dragField(event,\'' + f.at + '\')" title="Drag to move"' : '') + '>' + ic(FICON[f.kind] || 'draw') + f.kind + ' <small>· ' + esc(r.name || 'Signer') + '</small><button class="rm" aria-label="Remove field" onclick="ZohoSign._rmField(\'' + f.at + '\')">' + ic('close') + '</button></span>';
    if (!act(f)) return '<span class="zsf-fld done auto' + free + '"' + st + '>' + esc(autoVal(f)) + '</span>';
    if (S.sig && f.signed) return '<span class="zsf-fld done' + free + '"' + st + '>' + (S.sig.img && f.kind === 'Signature' ? '<img src="' + S.sig.img + '" alt="Signature">' : '<span class="sig ' + (S.sig.cls || 's1') + '">' + esc(f.kind === 'Initial' ? (S.sig.ini || S.sig.text) : S.sig.text) + '</span>') + '</span>';
    var cur = S.agreed && S.cur === f.at;
    return '<span class="zsf-fld todo' + (S.agreed ? '' : ' lock') + (cur ? ' cur' : '') + free + '"' + st + ' id="zsfF-' + f.at + '" role="button" tabindex="0" onclick="ZohoSign._signAt(\'' + f.at + '\')">' +
      '<span class="req">Required - ' + f.kind + '</span>' + ic(FICON[f.kind]) + (f.kind === 'Initial' ? 'Initial' : 'Signature') +
      (cur ? '<span class="zsf-tip" onclick="event.stopPropagation()"><button class="tx" aria-label="Close" onclick="ZohoSign._tipOff()">' + ic('close') + '</button>Enter your ' + (f.kind === 'Initial' ? 'initials' : 'signature') + '.<span class="nav"><a onclick="ZohoSign._step(-1)">Previous</a><a onclick="ZohoSign._step(1)">Next</a></span></span>' : '') + '</span>';
  }
  function freeFields(n, mode) {
    return S.fields.filter(function (f) { return f.page === n; }).map(function (f) { return fieldHtml(f, mode, 'left:' + f.x + '%;top:' + f.y + '%'); }).join('');
  }
  function page(n, mode) { return pageBody(n, mode).replace(/<\/div>$/, freeFields(n, mode) + '</div>'); }
  function pageBody(n, mode) {
    var o = S.o, p = o.prop || {}, l = o.lead, sigFor = function (at) {
      var f = S.fields.filter(function (x) { return x.at === at; })[0]; if (!f) return '<span style="display:inline-block;width:170px;border-bottom:1px solid #98a2b3"></span>';
      return fieldHtml(f, mode);
    };
    var hdr = '<div class="docid">Zoho Sign Document ID: ' + S.docId + '</div><div class="top"><span class="brand">EXEED</span><div class="doc-t">' + esc(S.upload || S.doc) + (S.doc === 'Sales Quotation' ? '<span>عرض أسعار</span>' : S.doc === 'Purchase Agreement' ? '<span>اتفاقية الشراء</span>' : '<span>واجب الرعاية</span>') + '</div><div class="demo">AGM Sales<br>Sent with Zoho Sign</div></div>';
    if (n === 1) return '<div class="zsf-page">' + hdr +
      '<div class="kv"><span>Date / التاريخ</span><span>' + today() + '</span><span>Quotation No. / رقم العرض</span><span>' + esc(p.id || '—') + '</span><span>Customer / العميل</span><span>' + esc(l.name) + '</span><span>Tel. / الهاتف</span><span>' + esc(l.phone || '—') + '</span><span>Email / البريد الإلكتروني</span><span>' + esc(l.email || '—') + '</span><span>Payment mode / طريقة الدفع</span><span>' + esc(p.pay || 'Cash') + '</span></div>' +
      '<table><thead><tr><th>#</th><th>Model</th><th>VIN</th><th>Colour</th><th>Net price (AED)</th></tr></thead><tbody><tr><td>1</td><td>' + esc(p.model || 'EXEED') + '</td><td>' + esc(p.vin || '—') + '</td><td>' + esc(p.color || '—') + '</td><td>' + esc(p.price || '—') + '</td></tr>' +
      (p.addOns || []).map(function (a, i) { return '<tr><td>' + (i + 2) + '</td><td>' + esc(a) + '</td><td></td><td></td><td>0.00</td></tr>'; }).join('') + '</tbody></table>' +
      '<div class="kv"><span>Down payment</span><span>' + esc(p.down || '—') + '</span><span>Sales executive</span><span>' + esc(o.host.name) + '</span></div><div class="lines"></div></div>';
    if (n === 2) return '<div class="zsf-page">' + hdr +
      '<div class="two"><div><h6>T&amp;C apply</h6><h6>Purchaser’s Declaration</h6><p>I agree to purchase from you the vehicle of the type described above at the prices shown and on the conditions of sale overleaf.</p>' +
        '<div class="zsf-sigline">Signature: ' + sigFor('buyer') + '</div><h6>Company’s Acceptance</h6><p>We accept the sale of this vehicle on the above terms.</p><div class="zsf-sigline">Signature: <span style="display:inline-block;width:170px;border-bottom:1px solid #98a2b3"></span></div></div>' +
      '<div class="ar"><h6>تطبق الشروط والأحكام</h6><h6>إقرار المشتري</h6><p>أوافق على شراء المركبة من النوع الموصوف أعلاه بالأسعار الموضحة ووفقًا لشروط البيع الموضحة في الصفحة المقابلة.</p>' +
        '<div class="zsf-sigline">التاريخ: ' + sigFor('buyerDate') + '</div><h6>قبول الشركة</h6><p>نحن نقبل بيع هذه السيارة وفقًا للشروط المذكورة أعلاه.</p></div></div>' +
      '<h6>CONDITIONS OF SALE</h6><p>1. Acceptance of this order is subject to confirmation in writing by the Company. Once such acceptance has been given, the Purchaser shall be legally bound to buy the Goods in accordance with the price and terms indicated.</p><p>2. In the event that the Company has agreed to accept a trade-in vehicle as part payment, it shall be under no obligation to buy the trade-in vehicle if, for any reason, the contract to purchase the new vehicle is terminated.</p><div class="lines"></div></div>';
    return '<div class="zsf-page">' + hdr + '<h6>CONDITIONS OF SALE (continued)</h6><div class="lines" style="height:420px"></div></div>';
  }
  function thumbs() {
    return '<div class="zsf-thumbs"><h5>Documents</h5><small>' + esc(S.name) + ' · 3 pages</small>' + [1, 2, 3].map(function (n) {
      return '<div class="zsf-th' + (S.page === n ? ' on' : '') + '" onclick="ZohoSign._page(' + n + ')"><em>' + n + '</em></div>';
    }).join('') + '</div>';
  }
  function pages(mode) { return '<div class="zsf-canvas" id="zsfCanvas">' + [1, 2, 3].map(function (n) { return '<div id="zsfPg' + n + '"' + (mode === 'place' ? ' ondragover="ZohoSign._over(event)" ondragleave="ZohoSign._leave(event)" ondrop="ZohoSign._drop(event,' + n + ')"' : '') + '>' + page(n, mode) + '</div>'; }).join('') + '</div>'; }

  /* ── Step 2 · place fields ── */
  function step2() {
    var rl = '<div class="zsf-rp p"><i>P</i><div><b>Prefill by you</b><span>Fields you fill before sending</span></div></div>' + S.rc.map(function (r, i) {
      return '<div class="zsf-rp' + (S.sel === i ? ' on' : '') + '" onclick="ZohoSign._selRc(' + i + ')"><i>' + esc((r.name || '?').charAt(0).toUpperCase()) + '</i><div><b>' + esc(r.name || 'Recipient ' + (i + 1)) + '</b><span>' + esc(r.role) + ' · ' + S.fields.filter(function (f) { return f.r === i; }).length + ' fields</span></div></div>';
    }).join('');
    var pal = [['Signature', 'draw'], ['Initial', 'signature'], ['Stamp', 'approval'], ['Image', 'image'], ['Company', 'apartment'], ['Full name', 'badge'], ['Email', 'mail'], ['Sign date', 'event'], ['Date', 'calendar_month'], ['Text', 'text_fields']];
    return '<div class="zsf-b" style="overflow:hidden"><div class="zsf-ws">' + thumbs() + pages('place') +
      '<div class="zsf-side"><h5>Recipients</h5><div class="zsf-rl">' + rl + '</div><div class="zsf-tabs"><span>Standard fields</span></div>' +
      '<div class="zsf-pal">' + pal.map(function (x) { return '<button draggable="true" ondragstart="ZohoSign._dragNew(event,\'' + x[0] + '\')" onclick="ZohoSign._addField(\'' + x[0] + '\')" title="Drag onto the document, or click to add"><span class="grip">' + ic('drag_indicator') + '</span>' + x[0] + ic(x[1]) + '</button>'; }).join('') + '</div>' +
      '<p style="padding:0 14px;font-size:11.5px;color:#667085">Drag a field onto the document for the selected recipient — or click it to drop it on the current page. Drag placed fields to move them. Signature fields start on the purchaser’s declaration. Pick a field to add more for the selected recipient.</p></div></div></div>' +
      '<div class="zsf-f"><button class="zsf-btn" onclick="ZohoSign._go(1)">' + ic('arrow_back') + 'Back</button><button class="zsf-btn" onclick="ZohoSign._toast(\'Fields detected on the purchaser’s declaration\')">' + ic('auto_awesome') + 'Detect fields</button><span class="grow"></span><button class="zsf-btn pri" onclick="ZohoSign._confirm()">' + ic('send') + 'Send</button></div>';
  }

  /* ── Step 3 · in-person signing session ── */
  function step3() {
    var all = allSigned(), left = S.fields.filter(function (f) { return act(f) && !f.signed; }).length;
    var more = '<details class="zsf-ma"><summary class="zsf-btn">More actions' + ic('arrow_drop_down') + '</summary><div class="zsf-menu2">' +
      '<button onclick="ZohoSign._disclosure()">' + ic('description') + 'Read disclosure</button><button onclick="ZohoSign._print()">' + ic('print') + 'Print</button><button onclick="ZohoSign._decline()">' + ic('block') + 'Decline to sign</button></div></details>';
    var bar = !S.agreed
      ? '<div class="zsf-banner zsf-consent">' + ic('pan_tool_alt') + '<p>I confirm that I have read and understood the <a onclick="ZohoSign._disclosure()">"Electronic Record and Signature Disclosure"</a> and consent to use electronic records and signatures.</p><button class="zsf-btn pri zsf-big" onclick="ZohoSign._agree()">Agree &amp;<br>Continue</button>' + more + '</div>'
      : '<div class="zsf-banner zsf-tb"><p>' + (all ? 'You’ve successfully filled all fields. Click Finish to complete signing.' : 'Fill in the required fields · ' + left + ' left') + '</p>' +
        '<button class="zsf-ib" aria-label="Zoom in" onclick="ZohoSign._zoom(.1)">' + ic('zoom_in') + '</button><button class="zsf-ib" aria-label="Zoom out" onclick="ZohoSign._zoom(-.1)">' + ic('zoom_out') + '</button>' +
        '<button class="zsf-ib" aria-label="Download" onclick="ZohoSign._toast(\'The copy downloads once signing is finished\')">' + ic('download') + '</button><button class="zsf-ib" aria-label="Print" onclick="ZohoSign._print()">' + ic('print') + '</button>' +
        '<span class="grow" style="flex:1"></span><button class="zsf-btn pri zsf-fin"' + (all ? '' : ' disabled') + ' onclick="ZohoSign._finish()">Finish</button>' + more + '</div>';
    return '<div class="zsf-b" style="overflow:hidden"><div class="zsf-signwrap">' + bar + '<div class="zsf-ws sign">' + thumbs() + pages('sign') + '</div></div></div>';
  }
  function addFree(k, n, x, y) { S._fid = (S._fid || 0) + 1; S.fields.push({ r: S.sel, kind: k, at: 'f' + S._fid, page: n, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }); }
  function focusCur() {
    setTimeout(function () { var el = S && S.cur && document.getElementById('zsfF-' + S.cur); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); var c = document.getElementById('zsfCanvas'); if (c && S.zoom) c.style.zoom = S.zoom; }, 30);
  }
  function allSigned() { return S.fields.filter(act).every(function (f) { return f.signed; }); }

  function stepDone() {
    var sg = signer(), r = S.result;
    return '<div class="zsf-b"><div class="zsf-done"><span class="ic">' + ic('task_alt') + '</span><h3>You have hosted this document.</h3>' +
      '<span class="zsf-valid">' + ic('verified') + 'Signed and all signatures are valid</span>' +
      '<p>' + esc(S.name) + ' was signed in person by ' + esc(sg.name) + '. A signed copy goes to ' + esc(r.copyTo || sg.email) + '.</p>' +
      '<div class="zsf-dl"><button class="zsf-btn" onclick="ZohoSign._email()">' + ic('mail') + 'Email to me</button><button class="zsf-btn" onclick="ZohoSign._print()">' + ic('print') + 'Print</button><button class="zsf-btn pri" onclick="ZohoSign._download()">' + ic('download') + 'Download</button></div>' +
      '<div class="zsf-audit"><div><span>Document ID</span><b style="font:11px ui-monospace,Menlo,monospace">' + S.docId + '</b></div><div><span>Signer</span><b>' + esc(sg.name) + ' · in person</b></div><div><span>Host</span><b>' + esc(sg.hostName || S.o.host.name) + '</b></div><div><span>Completed</span><b>' + esc(r.signedAt) + '</b></div><div><span>F&amp;O</span><b>Sync queued</b></div></div>' +
    '</div></div><div class="zsf-f"><span class="grow"></span><button class="zsf-btn pri" onclick="ZohoSign._close()">' + (PAGE ? ic('close') + 'Close window' : 'Back to lead') + '</button></div>';
  }

  /* ── dialogs ── */
  function dlg(title, body, foot, wide) {
    closeDlg();
    var d = document.createElement('div'); d.className = 'zsf-dlg-ov'; d.id = 'zsfDlg';
    d.innerHTML = '<div class="zsf-dlg' + (wide ? ' wide' : '') + (title ? '' : ' notitle') + '" role="dialog" aria-modal="true"><div class="zsf-dlg-h">' + title + '<button class="zsf-x" aria-label="Close" onclick="ZohoSign._closeDlg()">' + ic('close') + '</button></div><div class="zsf-dlg-b">' + body + '</div>' + (foot ? '<div class="zsf-dlg-f">' + foot + '</div>' : '') + '</div>';
    document.body.appendChild(d);
  }
  function closeDlg() { var d = document.getElementById('zsfDlg'); if (d) d.remove(); }

  function confirmDlg() {
    var ip = inPerson();
    dlg('Confirm details', '<p style="margin:0">Please verify the number of fields added for each recipient and confirm.</p>' +
      '<table class="zsf-tbl"><thead><tr><th>Recipient</th><th class="r">Fields</th></tr></thead><tbody>' + S.rc.map(function (r, i) {
        return '<tr><td>' + esc(r.name || r.email) + ' (' + esc(r.role) + ')</td><td class="r">' + S.fields.filter(function (f) { return f.r === i; }).length + '</td></tr>';
      }).join('') + '</tbody></table>' +
      (ip ? '<label class="zsf-chk"><input type="checkbox" id="zsfSignNow" checked>Sign the document right after sending</label>' : ''),
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Cancel</button><button class="zsf-btn pri" onclick="ZohoSign._send()">' + (ip ? 'Save &amp; sign' : 'Send') + '</button>');
  }
  function passToSigner() {
    var sg = signer();
    dlg('Pass control to signer', '<p style="margin:0">Please go through the instructions and then pass the control over to \'' + esc(sg.name) + '\' to begin the in-person signing session.</p>' +
      '<h3 style="margin:16px 0 0;font-weight:500;font-size:19px">Instructions</h3><ul><li>Once you pass the control, guide the signer through the signing process.</li><li>Inform the signer to enter the authentication code if required.</li><li>Take the control back once the signer completes signing of document.</li><li>Repeat the same process for more than one signers.</li></ul>',
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Close</button><button class="zsf-btn pri" onclick="ZohoSign._pass()">Pass control</button>');
  }
  function sigDlg(at) {
    var sg = signer(); S._at = at; S._tab = S._tab || 'type'; S._style = S._style || 's1';
    var initials = (sg.name || '').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 3).toUpperCase();
    S._text = S._text || sg.name; S._ini = S._ini || initials;
    var tabs = [['type', 'Type', 'match_case'], ['draw', 'Draw', 'stylus'], ['upload', 'Upload', 'image']].map(function (t) {
      return '<button class="' + (S._tab === t[0] ? 'on' : '') + '" onclick="ZohoSign._tabTo(\'' + t[0] + '\')">' + ic(t[2]) + t[1] + '</button>';
    }).join('');
    var body = S._tab === 'type'
      ? '<div class="zsf-sg-grid"><div><label for="zsfSigT">Signature</label><input id="zsfSigT" class="zsf-in" value="' + esc(S._text) + '" oninput="ZohoSign._sigText(this.value)"></div><div><label for="zsfSigI">Initial</label><input id="zsfSigI" class="zsf-in" value="' + esc(S._ini) + '" oninput="ZohoSign._sigIni(this.value)"></div></div>' +
        '<div class="zsf-styles" id="zsfStyles">' + styles() + '</div>'
      : S._tab === 'draw'
      ? '<canvas class="zsf-draw" id="zsfDraw" width="700" height="170" aria-label="Draw your signature"></canvas><div style="display:flex;justify-content:flex-end;margin-top:6px"><button class="zsf-btn" onclick="ZohoSign._clearDraw()">' + ic('ink_eraser') + 'Clear</button></div>'
      : '<label class="zsf-doc up" style="width:auto;min-height:150px">' + ic('upload') + '<b>' + (S._img ? 'Image selected — Ok to apply' : 'Upload an image of your signature') + '</b><span>PNG or JPG</span><input type="file" accept="image/*" hidden onchange="ZohoSign._sigImg(this)"></label>';
    dlg('', '<div class="zsf-sg-tabs">' + tabs + '</div>' + body +
      '<label class="zsf-plain"><input type="checkbox" id="zsfAll">fills the signature in all places</label>',
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Cancel</button><button class="zsf-btn pri" onclick="ZohoSign._applySig()">Ok</button>', true);
    if (S._tab === 'draw') initDraw();
  }
  function styles() {
    return ['s1', 's2', 's3'].map(function (c) {
      return '<div class="zsf-style' + (S._style === c ? ' on' : '') + '" onclick="ZohoSign._styleTo(\'' + c + '\')"><span class="ck">' + ic('check') + '</span><span class="' + c + '">' + esc(S._text) + '</span><span class="' + c + '" style="text-align:end">' + esc(S._ini) + '</span></div>';
    }).join('');
  }
  function initDraw() {
    var c = document.getElementById('zsfDraw'); if (!c) return;
    var x = c.getContext('2d'), down = false; x.lineWidth = 2.4; x.lineCap = 'round'; x.strokeStyle = '#0b1220'; S._drawn = false;
    var pt = function (e) { var r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
    c.onpointerdown = function (e) { down = true; var p = pt(e); x.beginPath(); x.moveTo(p[0], p[1]); c.setPointerCapture(e.pointerId); };
    c.onpointermove = function (e) { if (!down) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); S._drawn = true; };
    c.onpointerup = function () { down = false; };
  }
  function passToHost() {
    var sg = signer();
    dlg('Pass control to host', '<p style="margin:0 0 12px">' + esc(sg.name) + ', you’ve signed the document. You can now pass control back to <b>' + esc(sg.hostName || S.o.host.name) + '</b>.</p>' +
      '<label for="zsfCopy" style="font-size:12px;color:#475467;font-style:italic;display:block;margin-bottom:6px">Email address to receive a copy of the signed document on completion</label><input id="zsfCopy" class="zsf-in" type="email" value="' + esc(sg.email) + '">',
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Cancel</button><button class="zsf-btn pri" onclick="ZohoSign._toHost()">Pass control</button>');
  }
  function finishSession() {
    dlg('Finish session', '<p style="margin:0">Control is back with you. Click Finish to complete the session.</p>',
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Close</button><button class="zsf-btn pri" onclick="ZohoSign._complete()">Finish</button>');
  }

  /* ── signed PDF (simple, text-based) ── */
  function pdf(lines) {
    var y = 790, ops = [];
    var enc = function (t) { return String(t).replace(/[^\x20-\x7e]/g, function (c) { return c === '·' ? '-' : c === '—' || c === '–' ? '-' : c === '’' ? "'" : '?'; }).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); };
    lines.forEach(function (l) { var f = l.f || 'F1', sz = l.s || 11; ops.push('BT /' + f + ' ' + sz + ' Tf 56 ' + y + ' Td (' + enc(l.t) + ') Tj ET'); y -= (l.gap || sz + 7); });
    var stream = ops.join('\n');
    var objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>',
      '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>'];
    var out = '%PDF-1.4\n', offs = [];
    objs.forEach(function (o, i) { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    var x = out.length;
    out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map(function (o) { return ('0000000000' + o).slice(-10) + ' 00000 n \n'; }).join('');
    out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF\n';
    return new Blob([out], { type: 'application/pdf' });
  }
  function signedPdf() {
    var o = S.o, p = o.prop || {}, sg = signer();
    return pdf([
      { t: 'Zoho Sign Document ID: ' + S.docId, s: 8 },
      { t: 'EXEED  |  AGM Sales', f: 'F2', s: 16, gap: 26 },
      { t: S.name + ' (signed)', f: 'F2', s: 14, gap: 24 },
      { t: 'Date: ' + S.result.signedAt }, { t: 'Quotation No.: ' + (p.id || '-') }, { t: 'Customer: ' + o.lead.name },
      { t: 'Tel.: ' + (o.lead.phone || '-') + '    Email: ' + (o.lead.email || '-') },
      { t: 'Model: ' + (p.model || '-') + '    VIN: ' + (p.vin || '-') }, { t: 'Net price: ' + (p.price || '-') + '    Down payment: ' + (p.down || '-'), gap: 28 },
      { t: "Purchaser's Declaration", f: 'F2' },
      { t: 'I agree to purchase from you the vehicle of the type described above at the prices shown' },
      { t: 'and on the conditions of sale overleaf.', gap: 26 },
      { t: 'Signature:', f: 'F2' }, { t: S.sig.img ? sg.name + ' (drawn signature)' : S.sig.text, f: 'F3', s: 24, gap: 34 },
      { t: 'Signed in person by ' + sg.name + ' - hosted by ' + (sg.hostName || o.host.name), s: 9 },
      { t: 'Completed ' + S.result.signedAt + ' - signed and all signatures are valid', s: 9 }
    ]);
  }

  /* ── handlers ── */
  var toast = function (m) { if (window.showToast) window.showToast(m); };
  window.ZohoSign = {
    open: open,
    _close: function () {
      if (S && S.step === 3 && !S.result) { if (!confirm('Leave the signing session? The document stays unsigned.')) return; }
      close();
    },
    _closeDlg: closeDlg, _toast: toast,
    _doc: function (d) { S.doc = d; S.upload = null; S.name = d; paint(); },
    _upload: function (inp) { var f = inp.files && inp.files[0]; if (!f) return; S.upload = f.name; S.name = f.name.replace(/\.[^.]+$/, ''); paint(); },
    _name: function (v) { S.name = v; },
    _inOrder: function (v) { S.inOrder = v; },
    _rc: function (i, k, v, re) { S.rc[i][k] = v; if (re) paint(); },
    _addRc: function () { S.rc.push({ email: '', name: '', role: 'Needs to sign', via: 'Email', hostEmail: S.o.host.email, hostName: S.o.host.name }); paint(); },
    _addMe: function () { S.rc.push({ email: S.o.host.email, name: S.o.host.name, role: 'Approver', via: 'Email', hostEmail: S.o.host.email, hostName: S.o.host.name }); paint(); },
    _rmRc: function (i) { S.rc.splice(i, 1); S.fields = S.fields.filter(function (f) { return f.r !== i; }).map(function (f) { if (f.r > i) f.r--; return f; }); paint(); },
    _more: function () { S.more = !S.more; paint(); },
    _set: function (k, v, re) { S.set[k] = v; if (re) paint(); },
    _saveClose: function () { var o = S.o; toast('Saved as a draft in Zoho Sign'); if (o.onDraft) o.onDraft(); close(); },
    _go: function (n) {
      if (n === 2) {
        var bad = S.rc.filter(function (r) { return !r.name || !/@/.test(r.email); });
        if (bad.length) { toast('Add a name and email for every recipient'); return; }
        if (!S.name.trim()) { toast('Add a document name'); return; }
      }
      S.step = n; paint();
    },
    _page: function (n) { S.page = n; var el = document.getElementById('zsfPg' + n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); var t = document.querySelectorAll('.zsf-th'); t.forEach(function (x, i) { x.classList.toggle('on', i === n - 1); }); },
    _selRc: function (i) { S.sel = i; paint(); },
    _addField: function (k) {
      var free = k === 'Signature' ? ['buyer', 'buyerDate'].filter(function (a) { return !S.fields.some(function (f) { return f.at === a; }); })[0] : null;
      if (free) S.fields.push({ r: S.sel, kind: k, at: free });
      else { var c = S.fields.filter(function (f) { return f.page === S.page; }).length; addFree(k, S.page, 12 + (c % 3) * 26, 70 + Math.floor(c / 3) * 6); }
      paint();
    },
    _dragNew: function (e, k) { e.dataTransfer.setData('text/plain', 'new:' + k); e.dataTransfer.effectAllowed = 'copy'; },
    _dragField: function (e, at) {
      var r = e.currentTarget.getBoundingClientRect();
      e.dataTransfer.setData('text/plain', 'move:' + at + ':' + (e.clientX - r.left) + ':' + (e.clientY - r.top)); e.dataTransfer.effectAllowed = 'move';
    },
    _over: function (e) { e.preventDefault(); var pg = e.currentTarget.querySelector('.zsf-page'); if (pg) pg.classList.add('drop'); },
    _leave: function (e) { if (e.currentTarget.contains(e.relatedTarget)) return; var pg = e.currentTarget.querySelector('.zsf-page'); if (pg) pg.classList.remove('drop'); },
    _drop: function (e, n) {
      e.preventDefault();
      var pg = e.currentTarget.querySelector('.zsf-page'); if (!pg) return; pg.classList.remove('drop');
      var d = (e.dataTransfer.getData('text/plain') || '').split(':'), r = pg.getBoundingClientRect();
      var offX = d[0] === 'move' ? +d[2] || 0 : 20, offY = d[0] === 'move' ? +d[3] || 0 : 17;
      var x = Math.max(0, Math.min(80, (e.clientX - offX - r.left) / r.width * 100)), y = Math.max(0, Math.min(96, (e.clientY - offY - r.top) / r.height * 100));
      if (d[0] === 'new' && d[1]) addFree(d[1], n, x, y);
      else if (d[0] === 'move') { var f = S.fields.filter(function (z) { return z.at === d[1]; })[0]; if (!f) return; if (!f.page) { f.at = 'f' + (++S._fid); } f.page = n; f.x = x; f.y = y; }
      S.page = n; paint();
    },
    _rmField: function (at) { S.fields = S.fields.filter(function (f) { return f.at !== at; }); paint(); },
    _confirm: function () {
      var signers = S.rc.filter(function (r, i) { return /sign/i.test(r.role) && !S.fields.some(function (f) { return f.r === i; }); });
      if (!S.fields.length || signers.length) { toast('Add at least one signature field for each signer'); return; }
      confirmDlg();
    },
    _send: function () {
      var now = document.getElementById('zsfSignNow');
      if (inPerson() && (!now || now.checked)) { passToSigner(); return; }
      var r = S.rc.filter(function (x) { return x.role !== 'In-person signer'; })[0] || S.rc[0], o = S.o, name = S.name;
      var via = r.role === 'In-person signer' ? 'Email' : r.via, mode = inPerson() ? 'inperson-later' : 'remote';
      toast(name + (mode === 'remote' ? ' sent to ' + (r.name || r.email) + ' by ' + via + ' via Zoho Sign' : ' saved — sign in person later'));
      if (o.onDone) o.onDone({ doc: name, mode: mode, via: via });
      close();
    },
    _pass: function () { closeDlg(); S.step = 3; paint(); },
    _disclosure: function () { dlg('Electronic Record and Signature Disclosure', '<p style="margin:0">By continuing you agree to receive and sign documents electronically. Electronic signatures carry the same weight as handwritten ones. You can ask for a paper copy from the showroom at any time.</p>', '<button class="zsf-btn pri" onclick="ZohoSign._closeDlg()">Close</button>'); },
    _agree: function () { S.agreed = true; var f = S.fields.filter(function (x) { return act(x) && !x.signed; })[0]; S.cur = f ? f.at : null; paint(); focusCur(); },
    _tipOff: function () { S.cur = null; paint(); },
    _step: function (d) {
      var list = S.fields.filter(act), i = Math.max(0, list.map(function (f) { return f.at; }).indexOf(S.cur));
      var n = list[(i + d + list.length) % list.length]; S.cur = n ? n.at : null; paint(); focusCur();
    },
    _zoom: function (d) { S.zoom = Math.max(.6, Math.min(1.6, (S.zoom || 1) + d)); var c = document.getElementById('zsfCanvas'); if (c) c.style.zoom = S.zoom; },

    _signAt: function (at) { if (!S.agreed) { toast('Agree to the disclosure first'); return; } S.cur = at; sigDlg(at); },
    _tabTo: function (t) { S._tab = t; sigDlg(S._at); },
    _styleTo: function (c) { S._style = c; document.getElementById('zsfStyles').innerHTML = styles(); },
    _sigText: function (v) { S._text = v; document.getElementById('zsfStyles').innerHTML = styles(); },
    _sigIni: function (v) { S._ini = v; document.getElementById('zsfStyles').innerHTML = styles(); },
    _clearDraw: function () { var c = document.getElementById('zsfDraw'); if (c) { c.getContext('2d').clearRect(0, 0, c.width, c.height); S._drawn = false; } },
    _sigImg: function (inp) { var f = inp.files && inp.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { S._img = r.result; sigDlg(S._at); }; r.readAsDataURL(f); },
    _applySig: function () {
      if (S._tab === 'type') { if (!String(S._text || '').trim()) { toast('Type your signature'); return; } S.sig = { text: S._text, cls: S._style }; }
      else if (S._tab === 'draw') { if (!S._drawn) { toast('Draw your signature first'); return; } S.sig = { img: document.getElementById('zsfDraw').toDataURL('image/png'), text: signer().name }; }
      else { if (!S._img) { toast('Upload an image of your signature'); return; } S.sig = { img: S._img, text: signer().name }; }
      var all = document.getElementById('zsfAll'), every = !all || all.checked;
      S.sig.ini = S._ini;
      S.fields.forEach(function (f) { if (act(f) && (every || f.at === S._at)) f.signed = true; });
      var nx = S.fields.filter(function (x) { return act(x) && !x.signed; })[0]; S.cur = nx ? nx.at : null;
      closeDlg(); paint(); focusCur();
    },
    _finish: function () { if (!allSigned()) return; passToHost(); },
    _toHost: function () { var v = document.getElementById('zsfCopy').value.trim(); S.copyTo = v; finishSession(); },
    _complete: function () {
      closeDlg(); var sg = signer();
      S.result = { doc: S.name, mode: 'inperson', via: 'In person', signer: sg.name, signedAt: today(), copyTo: S.copyTo || sg.email };
      S.step = 4; paint();
      toast(S.name + ' signed in person by ' + sg.name);
      if (S.o.onDone) S.o.onDone(S.result);
    },
    _decline: function () {
      if (!confirm('Decline to sign this document?')) return;
      var o = S.o, name = S.name; toast(name + ' declined by the signer');
      if (o.onDone) o.onDone({ doc: name, mode: 'declined', via: 'In person' });
      close();
    },
    _download: function () {
      var a = document.createElement('a'); a.href = URL.createObjectURL(signedPdf()); a.download = S.name.replace(/[^\w\- ]+/g, '') + ' - signed.pdf';
      document.body.appendChild(a); a.click(); a.remove(); toast('Signed document downloaded');
    },
    _email: function () { toast('Signed copy emailed to ' + (S.o.host.email || 'you')); },
    _print: function () { var w = window.open(URL.createObjectURL(signedPdf())); if (!w) toast('Allow pop-ups to print'); }
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.getElementById('zsfDlg')) closeDlg(); });
})();
