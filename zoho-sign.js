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
  .zsf-logo { width:30px; height:30px; border-radius:8px; background:#eaeef3; color:#17293d; display:inline-flex; align-items:center; justify-content:center; }
  .zsf-logo .material-symbols-outlined { font-size:19px; }
  .zsf-ttl { font-weight:650; font-size:15px; } .zsf-ttl small { display:block; font-weight:400; font-size:11.5px; color:#667085; }
  .zsf-steps { display:flex; align-items:center; gap:6px; margin-inline-start:auto; font-size:12px; color:#667085; }
  .zsf-steps span.s { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; }
  .zsf-steps span.s i { font-style:normal; width:18px; height:18px; border-radius:50%; background:#eef0f3; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; }
  .zsf-steps span.s.on { color:#0b1220; font-weight:600; background:#f2f4f7; } .zsf-steps span.s.on i { background:#17293d; color:#fff; }
  .zsf-steps span.s.done i { background:#d1fadf; color:#0e7a3e; }
  .zsf-steps .sep { width:14px; height:1px; background:#d0d5dd; }
  .zsf-x { border:0; background:none; cursor:pointer; color:#475467; padding:4px; border-radius:6px; margin-inline-start:8px; } .zsf-x:hover { background:#f2f4f7; }
  .zsf-b { flex:1; overflow:auto; }
  .zsf-f { display:flex; align-items:center; gap:8px; padding:12px 18px; border-top:1px solid #e6e8ec; background:#fafbfc; }
  .zsf-f .grow { flex:1; }
  .zsf-btn { display:inline-flex; align-items:center; gap:6px; border:1px solid #d0d5dd; background:#fff; color:#1f2937; border-radius:6px; padding:7px 14px; font:600 13px inherit; cursor:pointer; }
  .zsf-btn:hover { background:#f9fafb; } .zsf-btn .material-symbols-outlined { font-size:17px; }
  .zsf-btn.pri { background:#17293d; border-color:#17293d; color:#fff; } .zsf-btn.pri:hover { background:#0f1d2c; }
  .zsf-btn:disabled { opacity:.45; cursor:default; }
  .zsf-pad { padding:20px 24px; max-width:1040px; }
  .zsf-sec { margin-bottom:22px; } .zsf-sec > h4 { margin:0 0 10px; font-size:13.5px; font-weight:650; }
  .zsf-docs { display:flex; gap:10px; flex-wrap:wrap; }
  .zsf-doc { width:150px; border:1.5px solid #e6e8ec; border-radius:10px; padding:10px; cursor:pointer; background:#fff; text-align:start; font:inherit; display:flex; flex-direction:column; gap:8px; }
  .zsf-doc.on { border-color:#17293d; box-shadow:0 0 0 3px #eaeef3; }
  .zsf-doc .pg { height:96px; border-radius:6px; background:#f6f7f9 repeating-linear-gradient(180deg, transparent 0 9px, #e4e7ec 9px 10px); background-clip:content-box; padding:12px 14px; border:1px solid #eef0f3; }
  .zsf-doc b { font-size:12px; } .zsf-doc span { font-size:11px; color:#667085; }
  .zsf-doc.up { align-items:center; justify-content:center; border-style:dashed; color:#475467; min-height:150px; }
  .zsf-doc.up .material-symbols-outlined { font-size:26px; color:#17293d; }
  .zsf-row { display:grid; grid-template-columns:150px minmax(0,1fr); align-items:center; gap:12px; margin-bottom:10px; }
  .zsf-row > label { color:#475467; font-size:12.5px; }
  .zsf-in, .zsf-sel, .zsf-ta { width:100%; border:1px solid #d0d5dd; border-radius:6px; padding:7px 10px; font:inherit; background:#fff; color:#1f2937; }
  .zsf-in:focus, .zsf-sel:focus, .zsf-ta:focus { outline:2px solid #17293d26; border-color:#17293d; }
  .zsf-in[readonly] { background:#f6f7f9; }
  .zsf-ta { min-height:64px; resize:vertical; }
  .zsf-tools { display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
  .zsf-chk { display:inline-flex; align-items:center; gap:6px; border:1px solid #e6e8ec; border-radius:6px; padding:5px 10px; font-size:12.5px; cursor:pointer; background:#fff; }
  .zsf-chk input { accent-color:#17293d; margin:0; }
  .zsf-rc { border:1px solid #e6e8ec; border-inline-start:3px solid #17293d; border-radius:8px; padding:10px 12px; margin-bottom:10px; display:grid; grid-template-columns:28px minmax(0,1.2fr) minmax(0,1fr) 170px 150px 28px; gap:8px; align-items:center; }
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
  .zsf-th.on { border-color:#17293d; } .zsf-th em { position:absolute; bottom:4px; inset-inline-start:6px; font-style:normal; font-size:11px; color:#475467; background:#fff; padding:0 3px; }
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
  .zsf-fld { min-width:170px; height:34px; border:1.5px dashed #17293d; background:#eaeef3; border-radius:4px; display:inline-flex; align-items:center; gap:6px; padding:0 8px; font:600 12px 'Segoe UI', system-ui, sans-serif; color:#17293d; position:relative; }
  .zsf-fld small { font-weight:500; color:#5b6b7d; }
  .zsf-fld .rm { border:0; background:none; cursor:pointer; color:#5b6b7d; padding:0; margin-inline-start:auto; display:inline-flex; } .zsf-fld .rm .material-symbols-outlined { font-size:15px; }
  .zsf-fld.todo { border-color:#f79009; background:#fffaeb; color:#b54708; cursor:pointer; animation:zsfPulse 1.6s infinite; }
  .zsf-fld.lock { opacity:.6; cursor:not-allowed; animation:none; }
  .zsf-fld.done { border:1px solid #17293d; background:#fff; padding:0 10px; }
  .zsf-fld.done .sig { font:26px/1 'Snell Roundhand','Apple Chancery','Brush Script MT','Segoe Script',cursive; color:#0b1220; }
  .zsf-fld.done img { height:30px; }
  @keyframes zsfPulse { 0%,100% { box-shadow:0 0 0 0 #f7900955; } 50% { box-shadow:0 0 0 5px #f7900911; } }
  .zsf-side { border-inline-start:1px solid #e6e8ec; display:flex; flex-direction:column; overflow:auto; }
  .zsf-fld.free { position:absolute; z-index:3; cursor:move; margin:0; }
  .zsf-fld.free.todo, .zsf-fld.free.done { cursor:pointer; }
  .zsf-fld.auto { border:0; background:transparent; min-width:0; padding:0 4px; font:500 12px 'Segoe UI', system-ui, sans-serif; color:#0b1220; }
  .zsf-fld.auto.free { cursor:default; }
  .zsf-page.drop { outline:2px dashed #17293d; outline-offset:4px; }
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
  .zsf-fld.todo { border:1.5px solid #17293d; background:#eaeef3; color:#17293d; animation:none; }
  .zsf-fld.todo.cur { box-shadow:0 0 0 3px #17293d26; }
  .zsf-tip, .zsf-fld .req { direction:ltr; }
  .zsf-tip { position:absolute; bottom:calc(100% + 26px); inset-inline-start:50%; transform:translateX(-50%); z-index:6; width:300px; background:#e8f6f1; border:1px solid #9fd3bf; box-shadow:0 8px 20px rgba(15,23,42,.18); padding:14px 16px 10px; font:400 14px 'Segoe UI', system-ui, sans-serif; color:#1f2937; cursor:default; text-align:start; }
  .zsf-tip .nav { display:flex; justify-content:flex-end; gap:22px; margin-top:16px; } .zsf-tip .nav a { text-decoration:underline; cursor:pointer; color:#344054; font-size:13.5px; }
  .zsf-tip .tx { position:absolute; top:-11px; inset-inline-end:-11px; width:22px; height:22px; border:0; background:#17293d; color:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; } .zsf-tip .tx .material-symbols-outlined { font-size:16px; }
  .zsf-dlg.notitle .zsf-dlg-h { display:none; } .zsf-dlg.notitle .zsf-sg-tabs { margin-top:-16px; background:#f6f7f9; }
  .zsf-sg-tabs button .material-symbols-outlined { font-size:22px; }
  .zsf-plain { display:inline-flex; align-items:center; gap:8px; font-size:13px; color:#344054; margin-top:4px; } .zsf-plain input { accent-color:#17293d; width:15px; height:15px; }
  .zsf-side h5 { margin:0; padding:12px 14px 8px; font-size:13px; }
  .zsf-rl { padding:0 8px 10px; border-bottom:1px solid #e6e8ec; }
  .zsf-rp { display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer; }
  .zsf-rp.on { background:#eaeef3; box-shadow:inset 3px 0 0 #17293d; }
  .zsf-rp i { font-style:normal; width:30px; height:30px; border-radius:50%; background:#d1fadf; color:#0e7a3e; display:inline-flex; align-items:center; justify-content:center; font-weight:700; }
  .zsf-rp.p i { background:#eef0f3; color:#475467; }
  .zsf-rp b { display:block; font-size:12.5px; } .zsf-rp span { font-size:11.5px; color:#667085; }
  .zsf-pal { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:12px; }
  .zsf-pal button { display:flex; align-items:center; justify-content:space-between; border:1px solid #d0d5dd; border-radius:6px; background:#fff; padding:6px 8px; font:500 12px inherit; cursor:pointer; color:#1f2937; }
  .zsf-pal button:hover { border-color:#17293d; } .zsf-pal button .material-symbols-outlined { font-size:16px; color:#17293d; }
  .zsf-tabs { display:flex; gap:2px; padding:0 12px; border-bottom:1px solid #e6e8ec; } .zsf-tabs span { padding:8px 10px; font-size:12.5px; font-weight:600; border-bottom:2px solid #17293d; }
  .zsf-banner { display:flex; align-items:center; gap:14px; padding:10px 16px; background:#f6faf8; border-bottom:1px solid #e6e8ec; }
  .zsf-banner p { margin:0; flex:1; } .zsf-banner a { color:#0b1220; font-weight:600; text-decoration:underline; cursor:pointer; }
  .zsf-banner.ok { background:#ecfdf3; }
  .zsf-signwrap { display:flex; flex-direction:column; height:100%; } .zsf-signwrap > .zsf-ws { flex:1; min-height:0; }
  .zsf-sqs { display:inline-flex; align-items:center; } .zsf-sq { width:22px; height:22px; border-radius:50%; border:1.5px solid #d0d5dd; background:#fff; color:#667085; font-size:11px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; }
  .zsf-sq.ok { background:#17293d; border-color:#17293d; color:#fff; } .zsf-sq.ok .material-symbols-outlined { font-size:14px; } .zsf-sq.on { border-color:#17293d; color:#17293d; }
  .zsf-sql { width:12px; height:2px; background:#d0d5dd; display:inline-block; }
  .zsf-who { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#17293d; background:#eaeef3; padding:3px 10px; border-radius:999px; }
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
  .zsf-sg-tabs button.on { color:#17293d; border-color:#17293d; }
  .zsf-sg-grid { display:grid; grid-template-columns:1fr 160px; gap:12px; margin-bottom:10px; } .zsf-sg-grid label { font-size:12px; color:#475467; display:block; margin-bottom:4px; }
  .zsf-styles { border:1px solid #eef0f3; border-radius:8px; overflow:hidden; margin-bottom:10px; }
  .zsf-style { display:grid; grid-template-columns:24px 1fr 90px; align-items:center; padding:8px 12px; cursor:pointer; border-top:1px solid #eef0f3; }
  .zsf-style:first-child { border-top:0; } .zsf-style.on { background:#eaeef3; } .zsf-style .ck { color:#17293d; visibility:hidden; } .zsf-style.on .ck { visibility:visible; }
  .zsf-style .s1, .zsf-style .s2, .zsf-style .s3 { font-size:24px; line-height:1.2; }
  .s1 { font-family:'Snell Roundhand','Apple Chancery','Segoe Script',cursive; } .s2 { font-family:'Brush Script MT','Bradley Hand','Segoe Script',cursive; } .s3 { font-family:'Bradley Hand','Chalkboard SE','Comic Sans MS',cursive; }
  .zsf-draw { border:1px dashed #98a2b3; border-radius:8px; background:#fcfcfd; width:100%; height:170px; touch-action:none; cursor:crosshair; display:block; }
  .zsf-done { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px; padding:30px; text-align:center; }
  .zsf-done .ic { width:64px; height:64px; border-radius:50%; background:#d1fadf; color:#0e7a3e; display:inline-flex; align-items:center; justify-content:center; } .zsf-done .ic .material-symbols-outlined { font-size:36px; }
  .zsf-done h3 { margin:0; font-size:20px; } .zsf-done p { margin:0; color:#475467; }
  .zsf-valid { display:inline-flex; align-items:center; gap:6px; background:#ecfdf3; color:#0e7a3e; border:1px solid #abefc6; border-radius:999px; padding:4px 12px; font-weight:600; font-size:12.5px; }
  .zsf-dl { display:flex; gap:8px; margin-top:6px; }
  .zsf-audit { margin-top:10px; width:min(520px,100%); text-align:start; border:1px solid #e6e8ec; border-radius:8px; padding:10px 14px; font-size:12px; color:#475467; }
  .zsf-cp { display:flex; gap:6px; align-items:flex-start; font-size:11.5px; color:#667085; margin:8px 0 0; } .zsf-cp .material-symbols-outlined { font-size:15px; }
  .zsf-res { display:flex; gap:8px; align-items:flex-start; background:#fffaeb; border:1px solid #fedf89; color:#7a2e0e; border-radius:8px; padding:8px 10px; font-size:12.5px; margin:0 0 12px; } .zsf-res .material-symbols-outlined { font-size:18px; color:#b54708; }
  .zsf-hl { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; font-size:13px; }
  .zsf-hl li { display:flex; align-items:center; gap:8px; color:#667085; } .zsf-hl li .material-symbols-outlined { font-size:18px; color:#98a2b3; }
  .zsf-hl li.ok .material-symbols-outlined { color:#17293d; } .zsf-hl li.now { color:#1f2937; } .zsf-hl li.now .material-symbols-outlined { color:#17293d; }
  .zsf-audit .zsf-ah { font-weight:600; color:#1f2937; border-bottom:1px solid #eef0f3; margin-bottom:4px; } .zsf-audit small { color:#98a2b3; }
  .zsf-chg { font-style:normal; font-size:10.5px; background:#fef0c7; color:#93370d; border-radius:4px; padding:1px 5px; margin-inline-start:4px; }
  .zsf-audit div { display:flex; justify-content:space-between; gap:12px; padding:3px 0; } .zsf-audit b { color:#1f2937; font-weight:600; }

  .zsf-chev { font-size:18px !important; color:#475467; transition:transform .15s; } .zsf-ma[open] .zsf-chev { transform:rotate(180deg); }
  .zsf-sel { appearance:none; -webkit-appearance:none; padding-inline-end:32px; cursor:pointer; font-weight:500;
    background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%23475467' d='M12 15.4 6 9.4 7.4 8l4.6 4.6L16.6 8 18 9.4z'/%3E%3C/svg%3E") no-repeat right 8px center / 18px; }
  [dir=rtl] .zsf-sel { background-position:left 8px center; }
  .zsf-sel:hover { border-color:#98a6b6; }
  input[type=date]::-webkit-calendar-picker-indicator { cursor:pointer; opacity:.6; }
  .pe-wel h4 { margin:0 0 4px; font-size:17px; color:#17293d; } .pe-wel p { margin:0; font-size:13px; color:#475467; line-height:1.45; }
  .pe-steps { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
  .pe-steps li { display:flex; align-items:center; gap:10px; font-size:13px; color:#475467; }
  .pe-steps li i { font-style:normal; width:22px; height:22px; border-radius:50%; border:1.5px solid #d0d5dd; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#667085; flex-shrink:0; }
  .pe-steps li.on { color:#17293d; font-weight:600; } .pe-steps li.on i { border-color:#17293d; background:#17293d; color:#fff; }
  .pe-sum { border:1px solid #e6e8ec; border-radius:10px; overflow:hidden; }
  .pe-sum h6 { margin:0; padding:9px 12px; background:#f6f7f9; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:#667085; }
  .pe-sum dl { margin:0; padding:8px 12px 10px; display:grid; grid-template-columns:auto 1fr; gap:6px 12px; font-size:12.5px; }
  .pe-sum dt { color:#667085; } .pe-sum dd { margin:0; text-align:end; font-weight:600; color:#1f2937; overflow-wrap:anywhere; }
  .pe-sum dd.big { font-size:14px; color:#17293d; }
  .pe-mini-prog { display:flex; align-items:center; gap:8px; font-size:12px; color:#667085; white-space:nowrap; } .pe-mini-prog .pe-prog { flex:1; }
  .pe-help { display:flex; gap:8px; align-items:center; font-size:12px; color:#667085; } .pe-help .material-symbols-outlined { font-size:18px; color:#98a2b3; }
  .zsf-thx { display:flex; gap:12px; align-items:center; margin:0 0 14px; } .zsf-thx > .material-symbols-outlined { font-size:34px; color:#0e7a3e; }
  .zsf-thx b { display:block; font-size:16px; color:#1f2937; } .zsf-thx span { font-size:13px; color:#475467; }
  .zsf-sgh + .zsf-sg-tabs { margin-top:0 !important; background:none !important; } .zsf-sgh { margin:0 0 4px; font-size:16px; color:#17293d; } .zsf-sgh small { display:block; font-size:12.5px; font-weight:400; color:#667085; margin-top:2px; }
  /* PDF-editor signing */
  .pe { display:flex; flex-direction:column; height:100%; }
  .pe-bar { display:flex; align-items:center; gap:10px; padding:8px 14px; background:#fff; color:#1f2937; border-bottom:1px solid #e6e8ec; }
  .pe-doc { display:inline-flex; align-items:center; gap:8px; min-width:0; margin-inline-end:12px; } .pe-doc > .material-symbols-outlined { color:#b10e1c; font-size:22px; }
  .pe-doc b { display:block; font-size:13px; color:#1f2937; font-weight:600; white-space:nowrap; } .pe-doc small { font-size:11px; color:#667085; }
  .pe-grp { display:inline-flex; align-items:center; gap:2px; background:#f2f4f7; border-radius:8px; padding:2px; }
  .pe-pg { font-size:12px; min-width:52px; text-align:center; color:#1f2937; font-variant-numeric:tabular-nums; }
  .pe-ib { border:0; background:none; color:#475467; width:30px; height:30px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; } .pe-ib:hover { background:#eaeef3; color:#17293d; } .pe-ib .material-symbols-outlined { font-size:19px; }
  .pe-mbtn { display:inline-flex; align-items:center; gap:4px; border:1px solid #d0d5dd; background:#fff; color:#1f2937; border-radius:6px; padding:6px 8px 6px 12px; font:600 12.5px inherit; cursor:pointer; } .pe-mbtn:hover { background:#f6f7f9; }
  .pe .zsf-ma summary { list-style:none; }
  .pe-fin { display:inline-flex; align-items:center; gap:6px; border:0; background:#17293d; color:#fff; border-radius:6px; padding:7px 16px; font:700 13px inherit; cursor:pointer; } .pe-fin .material-symbols-outlined { font-size:18px; }
  .pe-fin:hover:not(:disabled) { background:#0f1d2c; } .pe-fin:disabled { background:#eef0f3; color:#98a2b3; cursor:default; }
  .pe-body { flex:1; min-height:0; display:grid; grid-template-columns:132px minmax(0,1fr) 280px; }
  .pe-thumbs { background:#f6f7f9; border-inline-end:1px solid #e6e8ec; overflow:auto; padding:12px 14px; display:flex; flex-direction:column; gap:12px; }
  .pe-th { border:0; background:none; padding:0; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:5px; }
  .pe-mini { display:block; width:100px; height:132px; overflow:hidden; background:#fff; border-radius:2px; box-shadow:0 1px 3px rgba(16,24,40,.12); outline:2px solid transparent; outline-offset:2px; position:relative; }
  .pe-mini > .zsf-page { transform:scale(.13); transform-origin:0 0; width:760px; margin:0; box-shadow:none; pointer-events:none; }
  .pe-th.on .pe-mini { outline-color:#17293d; }
  .pe-th em { font-style:normal; font-size:11px; color:#475467; display:inline-flex; align-items:center; gap:3px; } .pe-th em .material-symbols-outlined { font-size:13px; color:#fbbf24; }
  .pe .zsf-canvas { background:#e9ecf1; padding:26px; }
  .pe .zsf-page { box-shadow:0 2px 12px rgba(16,24,40,.14); border-radius:1px; }
  .pe-f { --c:#2563eb; display:inline-flex; align-items:center; gap:8px; min-width:210px; height:44px; padding:0 10px; border-radius:4px; vertical-align:middle; position:relative; font:500 12px 'Segoe UI', system-ui, sans-serif; }
  .pe-f.now { border:2px solid var(--c); background:color-mix(in srgb, var(--c) 10%, #fff); color:var(--c); cursor:pointer; box-shadow:0 0 0 4px color-mix(in srgb, var(--c) 16%, transparent); }
  .pe-f.now:hover { background:color-mix(in srgb, var(--c) 18%, #fff); }
  .pe-f.now > .material-symbols-outlined { font-size:20px; }
  .pe-ft { display:flex; flex-direction:column; line-height:1.15; } .pe-ft b { font-weight:700; font-size:12.5px; } .pe-ft small { font-size:10.5px; opacity:.8; }
  .pe-flag { position:absolute; inset-inline-start:calc(100% + 10px); top:50%; transform:translateY(-50%); display:inline-flex; align-items:center; background:#facc15; color:#1f2937; font:700 11px 'Segoe UI', system-ui, sans-serif; padding:5px 10px 5px 16px; white-space:nowrap; clip-path:polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%); border-radius:0 4px 4px 0; animation:peNudge 1.4s ease-in-out infinite; } .pe-flag .material-symbols-outlined { display:none; }
  @keyframes peNudge { 0%,100% { transform:translate(0,-50%); } 50% { transform:translate(4px,-50%); } }
  .pe-f.wait { border:1.5px dashed color-mix(in srgb, var(--c) 55%, #fff); background:color-mix(in srgb, var(--c) 5%, #fff); color:color-mix(in srgb, var(--c) 70%, #475467); }
  .pe-f.wait > .material-symbols-outlined { font-size:17px; }
  .pe-f.done { border:0; border-bottom:1.5px solid #94a3b8; border-radius:0; flex-direction:column; align-items:flex-start; justify-content:flex-end; height:auto; min-height:44px; padding:0 4px 2px; gap:0; }
  .pe-f.done .sig { font:26px/1.1 'Snell Roundhand','Apple Chancery','Brush Script MT','Segoe Script',cursive; color:#0b1f4d; } .pe-f.done img { height:34px; }
  .pe-f.done small { display:inline-flex; align-items:center; gap:3px; font-size:9.5px; color:#475467; } .pe-f.done small .material-symbols-outlined { font-size:12px; color:var(--c); }
  .pe-f.mini { min-width:210px; height:44px; padding:0; border:3px solid var(--c); background:color-mix(in srgb, var(--c) 20%, #fff); } .pe-f.mini.done { border:0; background:none; border-bottom:4px solid #94a3b8; }
  .pe-f.free { position:absolute; z-index:3; }
  .pe-side { border-inline-start:1px solid #e6e8ec; background:#fff; padding:16px; overflow:auto; display:flex; flex-direction:column; gap:12px; }
  .pe-side h5 { margin:0; font-size:13px; }
  .pe-prog { height:6px; border-radius:99px; background:#eef0f3; overflow:hidden; } .pe-prog span { display:block; height:100%; background:#22c55e; border-radius:99px; transition:width .3s; }
  .pe-pt { margin:-6px 0 0; font-size:11.5px; color:#667085; }
  .pe-sl { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; }
  .pe-sl li { display:flex; align-items:center; gap:10px; padding:8px; border:1px solid #eef0f3; border-radius:10px; }
  .pe-sl li.now { border-color:#98a6b6; background:#eaeef3; }
  .pe-av { --c:#2563eb; width:32px; height:32px; border-radius:50%; background:var(--c); color:#fff; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
  .pe-sn { display:flex; flex-direction:column; min-width:0; flex:1; } .pe-sn b { font-size:12.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .pe-sn small { font-size:11px; color:#667085; }
  .pe-st { display:inline-flex; align-items:center; gap:3px; font-size:10.5px; font-weight:600; white-space:nowrap; } .pe-st .material-symbols-outlined { font-size:14px; }
  .pe-st.ok { color:#15803d; } .pe-st.now { color:#17293d; } .pe-st.wait { color:#98a2b3; }
  .pe-call { display:flex; gap:8px; align-items:flex-start; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:10px; font-size:12.5px; color:#78350f; } .pe-call .material-symbols-outlined { font-size:18px; }
  .pe-call.host { background:#eef2f7; border-color:#c7d2e0; color:#17293d; }
  .pe-call.ok { background:#f0fdf4; border-color:#bbf7d0; color:#14532d; }
  .pe-go { display:flex; align-items:center; justify-content:center; gap:8px; border:0; background:#17293d; color:#fff; border-radius:8px; min-height:48px; padding:12px; font:600 14.5px inherit; cursor:pointer; } .pe-go:hover { background:#0f1d2c; } .pe-go .material-symbols-outlined { font-size:18px; }
  .pe-link { display:flex; align-items:center; justify-content:center; gap:5px; border:0; background:none; color:#2a6797; font:600 12.5px inherit; cursor:pointer; padding:6px; border-radius:6px; } .pe-link:hover { background:#eaeef3; } .pe-link .material-symbols-outlined { font-size:16px; }
  .pe-legal { margin:auto 0 0; display:flex; gap:6px; font-size:11px; color:#667085; line-height:1.4; } .pe-legal .material-symbols-outlined { font-size:14px; }
  /* PandaDoc-style signing page */
  .pe-see { font:italic 11.5px 'Segoe UI', system-ui, sans-serif; color:#667085; }
  .pe-sigpage { margin-top:18px; border-top:2px solid #1f2937; padding-top:14px; font-family:'Segoe UI', system-ui, sans-serif; }
  .pe-sph { display:flex; align-items:baseline; justify-content:space-between; } .pe-sph b { font-size:16px; letter-spacing:.02em; } .pe-sph span { font-size:15px; font-weight:600; direction:rtl; }
  .pe-spi { font-size:11.5px; color:#475467; margin:4px 0 16px !important; }
  .pe-cards { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:26px 22px; }
  .pe-card { --c:#2563eb; display:flex; flex-direction:column; gap:10px; }
  .pe-ch { display:flex; align-items:center; gap:7px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#475467; }
  .pe-cn { width:18px; height:18px; border-radius:50%; background:var(--c); color:#fff; font-size:10px; display:inline-flex; align-items:center; justify-content:center; }
  .pe-meta { display:grid; grid-template-columns:1.4fr 1fr; gap:10px; } .pe-meta div { display:flex; flex-direction:column; gap:2px; border-bottom:1px solid #d0d5dd; padding-bottom:4px; }
  .pe-meta span { font-size:9.5px; text-transform:uppercase; letter-spacing:.05em; color:#98a2b3; font-weight:600; } .pe-meta b { font-size:12px; font-weight:600; color:#1f2937; }
  .pe-spf { margin:22px 0 0 !important; font-size:10px; color:#98a2b3; text-align:center; }
  .pe-card .pe-f { width:100%; min-width:0; height:64px; border-radius:6px; margin-top:8px; }
  .pe-tag { position:absolute; top:-9px; inset-inline-start:10px; display:inline-flex; align-items:center; gap:3px; background:var(--c); color:#fff; font:700 10px 'Segoe UI', system-ui, sans-serif; padding:2px 7px; border-radius:4px; white-space:nowrap; } .pe-tag .material-symbols-outlined { font-size:12px; }
  .pe-tag.ok { background:#16a34a; }
  .pe-f.wait .pe-tag { background:color-mix(in srgb, var(--c) 45%, #fff); }
  .pe-ft i { color:#dc2626; font-style:normal; margin-inline-start:2px; }
  .pe-card .pe-f.now { background:color-mix(in srgb, var(--c) 9%, #fff); border:2px solid var(--c); }
  .pe-card .pe-f.wait { background:color-mix(in srgb, var(--c) 4%, #fff); border:1.5px dashed color-mix(in srgb, var(--c) 45%, #fff); }
  .pe-card .pe-f.done { height:64px; border:1px solid #e4e7ec; border-bottom:2px solid #1f2937; border-radius:6px 6px 0 0; background:#fcfcfd; padding:14px 10px 4px; justify-content:center; }
  .pe-card .pe-flag { inset-inline-start:auto; inset-inline-end:10px; top:auto; bottom:-11px; transform:none; animation:none; clip-path:none; border-radius:4px; padding:3px 8px; font-size:10px; }

  .pe-mf { display:flex; flex-direction:column; gap:3px; } .pe-mf > span { font-size:9.5px; text-transform:uppercase; letter-spacing:.05em; color:#98a2b3; font-weight:600; } .pe-mf > span i { color:#dc2626; font-style:normal; margin-inline-start:2px; }
  .pe-mf input { font:600 12px 'Segoe UI', system-ui, sans-serif; color:#1f2937; border:1px solid transparent; border-bottom:1px solid #d0d5dd; background:transparent; padding:4px 2px; border-radius:4px 4px 0 0; width:100%; min-width:0; }
  .pe-mf input:disabled { color:#667085; -webkit-text-fill-color:#667085; opacity:1; }
  .pe-meta.on .pe-mf input { background:color-mix(in srgb, var(--c) 7%, #fff); border-color:color-mix(in srgb, var(--c) 35%, #fff); border-bottom:2px solid var(--c); padding:5px 7px; }
  .pe-meta.on .pe-mf input:focus { outline:none; box-shadow:0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent); }
  .pe-mf.ro b { font-size:12px; font-weight:600; color:#1f2937; border-bottom:1px solid #1f2937; padding:4px 2px; }
  .pe-meta .pe-mf { border:0 !important; padding:0 !important; }
  .pe-meta.wait .pe-mf.ro b { color:#98a2b3; font-weight:500; border-bottom-color:#d0d5dd; }

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
    if (o.seq) {
      // CRM flow: template and fields come from Zoho Sign — open straight on the signing page.
      // Signers sign in a fixed order on this device: Sales executive → Sales manager → Customer.
      S.seq = true; S.si = o.done || 0; S.signedNow = []; S.agreed = true;
      S.rc = o.seq.map(function (r) { return { name: r.name, email: r.email, role: r.role }; });
      S.fields = S.rc.map(function (r, i) { return { r: i, kind: 'Signature', at: 'g' + i, signed: i < S.si }; });
      S.cur = 'g' + S.si; S.step = 3; S.page = 3; paint(); focusCur();
      // Control always starts with the host: on a resumed session (or when the next signer is not the host)
      // the host sees the control screen and hands the device over again.
      if (o.paused || (S.si < S.rc.length && !(o.host && S.rc[S.si].email === o.host.email))) { S.resumed = !!o.paused; if (o.paused) S.resumedAt = today() + ' ' + new Date().toTimeString().slice(0, 5); hostCtl(); }
      return;
    }
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
  function gk(role) { if (!S.seq) return null; for (var i = 0; i < S.rc.length; i++) if (S.rc[i].role === role) return 'g' + i; return null; }
  function sgNow() { return S.seq ? S.rc[Math.min(S.si, S.rc.length - 1)] : signer(); }
  function signer() { if (S.seq) return S.rc[S.rc.length - 1]; return S.rc.filter(function (r) { return /sign/i.test(r.role); })[0] || S.rc[0]; }

  function head() {
    if (S.step === 3 || S.seq) return '<div class="zsf-h zsf-sh"><span class="zsf-logo">' + ic('draw') + '</span><span class="zsf-ttl">Sign' + (S.seq ? '<small>' + esc(S.name) + ' · ' + esc(S.o.lead.name) + '</small>' : '') + '</span><span class="grow" style="flex:1"></span>' +
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
    if (cv) cv.scrollTop = keep != null ? keep : (S.step >= 2 ? (document.getElementById(S.seq ? 'zsfPg3' : 'zsfPg2') || {}).offsetTop - 12 || 0 : 0);
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
    if (S.seq && act(f)) return peField(f, mode, style);
    var r = S.rc[f.r] || {}, free = style ? ' free' : '', st = style ? ' style="' + style + '"' : '';
    if (mode === 'place') return '<span class="zsf-fld' + free + '"' + st + (style ? ' draggable="true" ondragstart="ZohoSign._dragField(event,\'' + f.at + '\')" title="Drag to move"' : '') + '>' + ic(FICON[f.kind] || 'draw') + f.kind + ' <small>· ' + esc(r.name || 'Signer') + '</small><button class="rm" aria-label="Remove field" onclick="ZohoSign._rmField(\'' + f.at + '\')">' + ic('close') + '</button></span>';
    if (!act(f)) return '<span class="zsf-fld done auto' + free + '"' + st + '>' + esc(autoVal(f)) + '</span>';
    var sg = f.sig || (S.seq ? null : S.sig);
    if (f.signed && sg) return '<span class="zsf-fld done' + free + '"' + st + '>' + (sg.img && f.kind === 'Signature' ? '<img src="' + sg.img + '" alt="Signature">' : '<span class="sig ' + (sg.cls || 's1') + '">' + esc(f.kind === 'Initial' ? (sg.ini || sg.text) : sg.text) + '</span>') + '</span>';
    if (f.signed) return '<span class="zsf-fld done' + free + '"' + st + ' title="Signed earlier"><span class="sig s1">' + esc(r.name) + '</span></span>';
    var wait = S.seq && f.r !== S.si, cur = S.agreed && !wait && S.cur === f.at;
    return '<span class="zsf-fld todo' + (S.agreed && !wait ? '' : ' lock') + (cur ? ' cur' : '') + free + '"' + st + ' id="zsfF-' + f.at + '" role="button" tabindex="0" onclick="ZohoSign._signAt(\'' + f.at + '\')">' +
      '<span class="req">' + (S.seq ? 'Signer ' + (f.r + 1) + ' - ' + esc(r.role) : 'Required - ' + f.kind) + '</span>' + ic(FICON[f.kind]) + (f.kind === 'Initial' ? 'Initial' : 'Signature') +
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
        (S.seq ? '' : '<div class="zsf-sigline">Signature: ' + sigFor('buyer') + '</div>') + '<h6>Company’s Acceptance</h6><p>We accept the sale of this vehicle on the above terms.</p>' +
        (S.seq ? '<p class="pe-see">Signatures: see page 3</p></div>'
               : '<div class="zsf-sigline">Signature: <span style="display:inline-block;width:170px;border-bottom:1px solid #98a2b3"></span></div></div>') +
      '<div class="ar"><h6>تطبق الشروط والأحكام</h6><h6>إقرار المشتري</h6><p>أوافق على شراء المركبة من النوع الموصوف أعلاه بالأسعار الموضحة ووفقًا لشروط البيع الموضحة في الصفحة المقابلة.</p>' +
        '<div class="zsf-sigline">التاريخ: ' + (S.seq ? today() : sigFor('buyerDate')) + '</div><h6>قبول الشركة</h6><p>نحن نقبل بيع هذه السيارة وفقًا للشروط المذكورة أعلاه.</p></div></div>' +
      '<h6>CONDITIONS OF SALE</h6><p>1. Acceptance of this order is subject to confirmation in writing by the Company. Once such acceptance has been given, the Purchaser shall be legally bound to buy the Goods in accordance with the price and terms indicated.</p><p>2. In the event that the Company has agreed to accept a trade-in vehicle as part payment, it shall be under no obligation to buy the trade-in vehicle if, for any reason, the contract to purchase the new vehicle is terminated.</p><div class="lines"></div></div>';
    if (S.seq) return '<div class="zsf-page">' + hdr + '<h6>CONDITIONS OF SALE (continued)</h6><div class="lines" style="height:120px"></div>' +
      '<div class="pe-sigpage"><div class="pe-sph"><b>Signatures</b><span>التوقيعات</span></div>' +
      '<p class="pe-spi">By signing below, each party confirms they have read and agree to this document. Signatures are collected in the order shown.</p>' +
      '<div class="pe-cards">' + S.rc.map(function (r, i) {
        var f = S.fields.filter(function (x) { return x.r === i; })[0] || {};
        return '<div class="pe-card" style="--c:' + peColor(i) + '"><div class="pe-ch"><span class="pe-cn">' + (i + 1) + '</span><span>' + esc(r.role) + '</span></div>' +
          sigFor('g' + i) +
          peMeta(i, r, f) + '</div>';
      }).join('') + '</div>' +
      '<p class="pe-spf">Signed electronically with Zoho Sign · Document ID ' + S.docId.slice(0, 18) + '…</p></div></div>';
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
    var more = '<details class="zsf-ma"><summary class="zsf-btn">More actions<span class="material-symbols-outlined zsf-chev">expand_more</span></summary><div class="zsf-menu2">' +
      '<button onclick="ZohoSign._disclosure()">' + ic('description') + 'Read disclosure</button><button onclick="ZohoSign._print()">' + ic('print') + 'Print</button><button onclick="ZohoSign._decline()">' + ic('block') + 'Decline to sign</button></div></details>';
    if (S.seq) return peLayout(all, more);
    var bar = !S.agreed
      ? '<div class="zsf-banner zsf-consent">' + ic('pan_tool_alt') + '<p>I confirm that I have read and understood the <a onclick="ZohoSign._disclosure()">"Electronic Record and Signature Disclosure"</a> and consent to use electronic records and signatures.</p><button class="zsf-btn pri zsf-big" onclick="ZohoSign._agree()">Agree &amp;<br>Continue</button>' + more + '</div>'
      : '<div class="zsf-banner zsf-tb"><p>' + (all ? 'You’ve successfully filled all fields. Click Finish to complete signing.' : 'Fill in the required fields · ' + left + ' left') + '</p>' +
        '<button class="zsf-ib" aria-label="Zoom in" onclick="ZohoSign._zoom(.1)">' + ic('zoom_in') + '</button><button class="zsf-ib" aria-label="Zoom out" onclick="ZohoSign._zoom(-.1)">' + ic('zoom_out') + '</button>' +
        '<button class="zsf-ib" aria-label="Download" onclick="ZohoSign._toast(\'The copy downloads once signing is finished\')">' + ic('download') + '</button><button class="zsf-ib" aria-label="Print" onclick="ZohoSign._print()">' + ic('print') + '</button>' +
        '<span class="grow" style="flex:1"></span><button class="zsf-btn pri zsf-fin"' + (all ? '' : ' disabled') + ' onclick="ZohoSign._finish()">Finish</button>' + more + '</div>';
    return '<div class="zsf-b" style="overflow:hidden"><div class="zsf-signwrap">' + bar + '<div class="zsf-ws sign">' + thumbs() + pages('sign') + '</div></div></div>';
  }

  /* ── PDF-editor style signing (CRM flow) ── */
  var PE_C = ['#2a6797', '#5c2e91', '#00838a', '#8a6420'];
  function peColor(i) { return PE_C[i % PE_C.length]; }
  function peField(f, mode, style) {
    var r = S.rc[f.r] || {}, c = peColor(f.r), st = ' style="--c:' + c + (style ? ';' + style : '') + '"';
    var tag = '<span class="pe-tag">' + esc(r.name) + '</span>';
    if (mode === 'thumb') return '<span class="pe-f mini' + (f.signed ? ' done' : '') + '"' + st + '></span>';
    if (f.signed) {
      var sg = f.sig;
      var mark = sg && sg.img ? '<img src="' + sg.img + '" alt="Signature">' : '<span class="sig ' + ((sg && sg.cls) || 's1') + '">' + esc(sg ? sg.text : r.name) + '</span>';
      return '<span class="pe-f done"' + st + '><span class="pe-tag ok">' + ic('check') + 'Signed</span>' + mark + '<small>' + ic('verified') + 'Zoho Sign · ' + esc(f.when || today()) + '</small></span>';
    }
    if (f.r === S.si) return '<span class="pe-f now"' + st + ' id="zsfF-' + f.at + '" role="button" tabindex="0" onclick="ZohoSign._signAt(\'' + f.at + '\')" onkeydown="if(event.key===\'Enter\')ZohoSign._signAt(\'' + f.at + '\')">' + tag +
      '<span class="pe-flag">Sign here</span>' + ic('draw') + '<span class="pe-ft"><b>Signature<i>*</i></b><small>Click to sign</small></span></span>';
    return '<span class="pe-f wait"' + st + ' title="Signs after the current signer">' + tag + ic('draw') + '<span class="pe-ft"><b>Signature</b><small>Waiting · signer ' + (f.r + 1) + '</small></span></span>';
  }

  // Name + date under each signature (PandaDoc-style fields): editable for the current signer, locked otherwise.
  function isoToday() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fmtIso(v) { if (!v) return ''; var d = new Date(v + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function peMeta(i, r, f) {
    S.meta = S.meta || {}; var m = S.meta[i] || (S.meta[i] = { n: r.name, d: isoToday() });
    if (f.signed) return '<div class="pe-meta"><div class="pe-mf ro"><span>Name</span><b>' + esc(m.n) + '</b></div><div class="pe-mf ro"><span>Date</span><b>' + esc(fmtIso(m.d) || (f.when || '').split(' ').slice(0, 3).join(' ')) + '</b></div></div>';
    var on = i === S.si, dis = on ? '' : ' disabled';
    if (!on) return '<div class="pe-meta wait"><div class="pe-mf ro"><span>Name</span><b>' + esc(m.n) + '</b></div><div class="pe-mf ro"><span>Date</span><b>—</b></div></div>';
    return '<div class="pe-meta' + (on ? ' on' : '') + '">' +
      '<label class="pe-mf"><span>Name' + (on ? '<i>*</i>' : '') + '</span><input type="text" value="' + esc(m.n) + '"' + dis + ' aria-label="Name of signer ' + (i + 1) + '" oninput="ZohoSign._meta(' + i + ',\'n\',this.value)"></label>' +
      '<label class="pe-mf"><span>Date' + (on ? '<i>*</i>' : '') + '</span><input type="date" value="' + esc(m.d) + '"' + dis + ' aria-label="Signing date for signer ' + (i + 1) + '" oninput="ZohoSign._meta(' + i + ',\'d\',this.value)"></label></div>';
  }
  function peLayout(all, more) {
    var cs = S.rc[S.si], z = Math.round((S.zoom || 1) * 100), n = S.page || 2, signedN = S.fields.filter(function (f) { return f.signed; }).length;
    var bar = '<div class="pe-bar">' +
      '<span class="pe-doc">' + ic('picture_as_pdf') + '<span><b>' + esc(S.name) + '</b><small>' + esc(S.o.lead.name) + ' · Zoho Sign</small></span></span>' +
      '<span class="pe-grp"><button class="pe-ib" aria-label="Previous page" onclick="ZohoSign._page(' + Math.max(1, n - 1) + ')">' + ic('chevron_left') + '</button><span class="pe-pg">' + n + ' / 3</span><button class="pe-ib" aria-label="Next page" onclick="ZohoSign._page(' + Math.min(3, n + 1) + ')">' + ic('chevron_right') + '</button></span>' +
      '<span class="pe-grp"><button class="pe-ib" aria-label="Zoom out" onclick="ZohoSign._zoom(-.1)">' + ic('remove') + '</button><span class="pe-pg" id="peZoom">' + z + '%</span><button class="pe-ib" aria-label="Zoom in" onclick="ZohoSign._zoom(.1)">' + ic('add') + '</button></span>' +
      '<span class="grow" style="flex:1"></span>' +
      '<button class="pe-ib" aria-label="Print" onclick="ZohoSign._print()">' + ic('print') + '</button>' +
      '<button class="pe-ib" aria-label="Download" onclick="ZohoSign._toast(\'The copy downloads once signing is finished\')">' + ic('download') + '</button>' +
      more.replace('class="zsf-btn"', 'class="pe-mbtn"') +
      '<button class="pe-fin"' + (all ? '' : ' disabled') + ' onclick="ZohoSign._finish()">' + ic('task_alt') + 'Finish</button></div>';
    var th = '<div class="pe-thumbs">' + [1, 2, 3].map(function (k) {
      var has = k === 3;
      return '<button class="pe-th' + (n === k ? ' on' : '') + '" onclick="ZohoSign._page(' + k + ')" aria-label="Page ' + k + '"><span class="pe-mini">' + page(k, 'thumb') + '</span><em>' + k + (has ? ' ' + ic('draw') : '') + '</em></button>';
    }).join('') + '</div>';
    var list = S.rc.map(function (r, i) {
      var stt = i < S.si ? ['ok', 'Signed', 'check_circle'] : i === S.si && !all ? (S.withHost ? ['now', 'Next', 'front_hand'] : ['now', 'Signing now', 'edit']) : ['wait', 'Waiting', 'schedule'];
      return '<li class="' + stt[0] + '"><span class="pe-av" style="--c:' + peColor(i) + '">' + esc((r.name || '?').split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase()) + '</span>' +
        '<span class="pe-sn"><b>' + esc(r.name) + '</b><small>' + (i + 1) + ' · ' + esc(r.role) + '</small></span><span class="pe-st ' + stt[0] + '">' + ic(stt[2]) + stt[1] + '</span></li>';
    }).join('');
    var signerHas = !all && !S.withHost && !(S.o.host && cs.email === S.o.host.email);
    if (signerHas) {
      var p = S.o.prop || {}, first = esc(cs.name.split(' ')[0]);
      var rows = [['Document', esc(S.name.split(' · ')[0])], ['Vehicle', esc(p.model || '')], ['Colour', esc(p.color || '')], ['VIN', esc(p.vin || '')], ['Payment', esc(p.pay || '')], ['Down payment', esc(p.down || '')], ['Net price', esc(p.price || ''), 'big']]
        .filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + r[0] + '</dt><dd' + (r[2] ? ' class="big"' : '') + '>' + r[1] + '</dd>'; }).join('');
      var m = (S.meta || {})[S.si] || {}, metaOk = String(m.n || '').trim() && m.d;
      var before = S.rc.slice(0, S.si).map(function (r) { return esc(r.name.split(' ')[0]); });
      var sideC = '<aside class="pe-side pe-cust">' +
        '<div class="pe-wel"><h4>Welcome, ' + first + '</h4><p>Please review your ' + esc(S.name.split(' · ')[0].toLowerCase()) + ' and sign. It takes about a minute.</p></div>' +
        '<ol class="pe-steps"><li class="' + (S.reviewed ? '' : 'on') + '"><i>' + (S.reviewed ? '✓' : '1') + '</i>Review the details</li><li class="' + (S.reviewed && !metaOk ? 'on' : '') + '"><i>' + (metaOk && S.reviewed ? '✓' : '2') + '</i>Check your name and date</li><li class="' + (S.reviewed && metaOk ? 'on' : '') + '"><i>3</i>Add your signature</li></ol>' +
        (rows ? '<div class="pe-sum"><h6>What you are signing</h6><dl>' + rows + '</dl></div>' : '') +
        '<button class="pe-go" onclick="ZohoSign._custSign()">' + ic('draw') + 'Sign now</button>' +
        '<button class="pe-link" onclick="ZohoSign._reviewed();ZohoSign._page(1)">' + ic('description') + 'Read the full document</button>' +
        '<div class="pe-mini-prog"><div class="pe-prog"><span style="width:' + Math.round(signedN / S.rc.length * 100) + '%"></span></div>' + signedN + ' of ' + S.rc.length + ' signed</div>' +
        (before.length ? '<p class="pe-pt" style="margin:0">' + before.join(' and ') + ' signed already.' + (S.si === S.rc.length - 1 ? ' You are the last to sign.' : '') + '</p>' : '') +
        '<div class="pe-help">' + ic('support_agent') + '<span>Questions? Ask ' + esc(hostName()) + ', your sales executive.</span></div>' +
        '<p class="pe-legal">' + ic('lock') + 'Your signature is legally binding and protected by Zoho Sign.</p></aside>';
      return '<div class="zsf-b" style="overflow:hidden"><div class="pe">' + bar + '<div class="pe-body">' + th + pages('sign') + sideC + '</div></div></div>';
    }
    var side = '<aside class="pe-side"><h5>Signers</h5>' +
      '<div class="pe-prog"><span style="width:' + Math.round(signedN / S.rc.length * 100) + '%"></span></div><p class="pe-pt">' + signedN + ' of ' + S.rc.length + ' signed</p>' +
      '<ol class="pe-sl">' + list + '</ol>' +
      (all ? '<div class="pe-call ok">' + ic('task_alt') + '<span>Everyone has signed. ' + esc(hostName()) + ', click <b>Finish</b> to complete the session.</span></div>'
           : S.withHost
           ? '<div class="pe-call host">' + ic('admin_panel_settings') + '<span>Control is with the host, <b>' + esc(hostName()) + '</b>. Hand the device to <b>' + esc(cs.name) + '</b> to continue.</span></div>' +
             '<button class="pe-go" onclick="ZohoSign._handNext()">' + ic('front_hand') + 'Hand device to ' + esc(cs.name.split(' ')[0]) + '</button>' +
             '<button class="pe-link" onclick="ZohoSign._pause()">' + ic('pause') + 'Pause session</button>' +
             '<button class="pe-link" onclick="ZohoSign._handoff()">' + ic('forward_to_inbox') + esc(cs.name.split(' ')[0]) + ' not here? Send the link</button>'
           : '<div class="pe-call">' + ic('front_hand') + '<span><b>' + esc(cs.name) + '</b> is signing. After signing, control passes back to <b>' + esc(hostName()) + '</b>.</span></div>' +
             '<button class="pe-go" onclick="ZohoSign._signAt(\'g' + S.si + '\')">' + ic('draw') + 'Sign as ' + esc(cs.name.split(' ')[0]) + '</button>' +
             '<button class="pe-link" onclick="ZohoSign._handoff()">' + ic('forward_to_inbox') + esc(cs.name.split(' ')[0]) + ' not here? Send the link</button>') +
      '<p class="pe-legal">' + ic('lock') + 'Electronic signatures are legally binding and recorded in the Zoho Sign audit trail.</p></aside>';
    return '<div class="zsf-b" style="overflow:hidden"><div class="pe">' + bar + '<div class="pe-body">' + th + pages('sign') + side + '</div></div></div>';
  }
  function addFree(k, n, x, y) { S._fid = (S._fid || 0) + 1; S.fields.push({ r: S.sel, kind: k, at: 'f' + S._fid, page: n, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }); }
  function focusCur() {
    setTimeout(function () { var el = S && S.cur && document.getElementById('zsfF-' + S.cur); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); var c = document.getElementById('zsfCanvas'); if (c && S.zoom) c.style.zoom = S.zoom; }, 30);
  }
  function allSigned() { return S.fields.filter(act).every(function (f) { return f.signed; }); }

  function stepDone() {
    var sg = signer(), r = S.result;
    if (S.seq) return '<div class="zsf-b"><div class="zsf-done"><span class="ic">' + ic('task_alt') + '</span><h3>You have hosted this document.</h3>' +
      '<span class="zsf-valid">' + ic('verified') + 'Signed and all signatures are valid</span>' +
      '<p>' + esc(S.name) + ' was signed in person, hosted by ' + esc(hostName()) + '. The signed PDF is attached to the lead and goes to F&amp;O.</p>' +
      '<div class="zsf-audit"><div class="zsf-ah"><span>Signed copy sent to</span></div>' + S.rc.map(function (x, i) { var s2 = (S.signedNow.filter(function (z) { return z.i === i; })[0]) || {}; return '<div><span>' + (i + 1) + ' · ' + esc(x.name) + ' <small>' + esc(x.role) + '</small></span><b>' + esc(s2.copyTo || x.email || '—') + (s2.changed ? ' <em class="zsf-chg">changed</em>' : '') + '</b></div>'; }).join('') +
        '<div><span>Zoho request</span><b style="font:11px ui-monospace,Menlo,monospace">' + esc(S.o.reqId || S.docId) + '</b></div><div><span>Completed</span><b>' + esc(r.signedAt) + '</b></div><div><span>F&amp;O</span><b>Push queued</b></div></div>' +
    '</div></div><div class="zsf-f"><span class="grow"></span><button class="zsf-btn pri" onclick="ZohoSign._close()">' + ic('arrow_back') + 'Back to lead</button></div>';
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
    var sg = sgNow(); S._at = at; S._tab = S._tab || 'type'; S._style = S._style || 's1';
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
    dlg('', (S.seq ? '<h3 class="zsf-sgh">Add your signature, ' + esc(sg.name.split(' ')[0]) + '<small>Type, draw with your finger, or upload an image.</small></h3>' : '') + '<div class="zsf-sg-tabs">' + tabs + '</div>' + body +
      (S.seq ? '' : '<label class="zsf-plain"><input type="checkbox" id="zsfAll">fills the signature in all places</label>'),
      '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Cancel</button><button class="zsf-btn pri" onclick="ZohoSign._applySig()">' + (S.seq ? ic('draw') + 'Apply signature' : 'Ok') + '</button>', true);
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
  // Zoho hosted in-person signing: after every signer, control goes back to the host (the SE).
  function hostName() { return (S.o.host && S.o.host.name) || 'the sales executive'; }
  function passBack(i) {
    var r = S.rc[i];
    if (S.o.host && r.email && r.email === S.o.host.email) { hostCtl(); return; }
    dlg('Pass control to host', '<div class="zsf-thx">' + ic('check_circle') + '<div><b>Thank you, ' + esc(r.name.split(' ')[0]) + '!</b><span>You’ve successfully signed the document.</span></div></div><p style="margin:0 0 12px">Please pass the device back to <b>' + esc(hostName()) + '</b>.</p>' +
      '<label for="zsfCopy" style="font-size:12px;color:#475467;font-style:italic;display:block;margin-bottom:6px">Specify an email address to receive a copy of the signed document upon completion.</label>' +
      '<input id="zsfCopy" class="zsf-in" type="email" value="' + esc(r.email || '') + '">' +
      '<p class="zsf-cp">' + ic('contact_mail') + 'Prefilled from the CRM contact. If you change it, the lead is flagged to update the contact.</p>',
      '<button class="zsf-btn pri" onclick="ZohoSign._passBack()">Pass control</button>');
  }
  function hostCtl() {
    var n = S.si, tot = S.rc.length;
    if (n >= tot) { finishSession(); return; }
    if (!S.withHost) { S.withHost = true; paint(); }
    var nx = S.rc[n];
    var o = S.o, other = o.startedBy && o.startedBy !== hostName();
    var intro = S.resumed && !S.handedAny
      ? '<div class="zsf-res">' + ic('pause_circle') + '<span>Paused session' + (o.pausedAt ? ' · ' + esc(o.pausedAt) : '') + '. Started by <b>' + esc(o.startedBy) + '</b>. Signatures so far are kept.' + (other ? ' You are taking over as host — this is recorded in the audit log.' : '') + '</span></div>'
      : '';
    dlg(S.resumed && !S.handedAny ? 'Resume session' : (n ? 'Control is back with you' : 'Start in-person signing'), intro + '<p style="margin:0 0 10px">' + esc(hostName()) + ', ' + n + ' of ' + tot + ' signers have signed. Next to sign: <b>' + esc(nx.name) + '</b> (' + esc(nx.role) + ').</p>' +
      '<ol class="zsf-hl">' + S.rc.map(function (r, i) { return '<li class="' + (i < n ? 'ok' : i === n ? 'now' : '') + '">' + ic(i < n ? 'check_circle' : i === n ? 'front_hand' : 'schedule') + '<span><b>' + esc(r.name) + '</b> · ' + esc(r.role) + '</span></li>'; }).join('') + '</ol>',
      '<button class="zsf-btn" onclick="ZohoSign._handoff()">' + ic('forward_to_inbox') + 'Send link instead</button>' +
      '<button class="zsf-btn" onclick="ZohoSign._pause()">Pause</button>' +
      '<button class="zsf-btn pri" onclick="ZohoSign._handNext()">' + ic('front_hand') + 'Hand device to ' + esc(nx.name.split(' ')[0]) + '</button>');
  }
  function handTo(r) {
    dlg('Pass the device to ' + esc(r.name), '<p style="margin:0">Signer ' + (S.si) + ' has signed. Hand the device to <b>' + esc(r.name) + '</b> (' + esc(r.role) + ') to sign next.</p>',
      '<button class="zsf-btn pri" onclick="ZohoSign._nextOk()">Continue as ' + esc(r.name.split(' ')[0]) + '</button>');
  }
  function finishSession() {
    dlg('Finish session', '<p style="margin:0">Click finish to complete the session.</p>',
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
      { t: 'Signature:', f: 'F2' }, { t: (function () { var z = S.seq ? S.fields[S.fields.length - 1].sig || { text: sg.name } : S.sig; return z.img ? sg.name + ' (drawn signature)' : z.text; })(), f: 'F3', s: 24, gap: 34 },
      { t: S.seq ? 'Signed in order: ' + S.rc.map(function (x, i) { return (i + 1) + '. ' + x.name + ' (' + x.role + ')'; }).join('  ') : 'Signed in person by ' + sg.name + ' - hosted by ' + (sg.hostName || o.host.name), s: 9 },
      { t: 'Completed ' + S.result.signedAt + ' - signed and all signatures are valid', s: 9 }
    ]);
  }

  /* ── handlers ── */
  var toast = function (m) { if (window.showToast) window.showToast(m); };
  window.ZohoSign = {
    open: open,
    _close: function () {
      if (S && S.step === 3 && !S.result) {
        if (S.seq && S.signedNow.length) {
          if (!confirm('Leave the signing session? Signatures so far are kept; the next signer can sign later.')) return;
          if (S.o.onDone) S.o.onDone({ doc: S.name, mode: 'partial', signed: S.signedNow, handed: S.handed, resumedAt: S.resumedAt });
        } else if (!confirm('Leave the signing session? The document stays unsigned.')) return;
      }
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
    _page: function (n) { S.page = n; if (S.seq) { document.querySelectorAll('.pe-th').forEach(function (x, i) { x.classList.toggle('on', i === n - 1); }); var pg = document.querySelector('.pe-pg'); if (pg) pg.textContent = n + ' / 3'; } var el = document.getElementById('zsfPg' + n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); var t = document.querySelectorAll('.zsf-th'); t.forEach(function (x, i) { x.classList.toggle('on', i === n - 1); }); },
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
    _zoom: function (d) { S.zoom = Math.max(.6, Math.min(1.6, (S.zoom || 1) + d)); var c = document.getElementById('zsfCanvas'); if (c) c.style.zoom = S.zoom; var zl = document.getElementById('peZoom'); if (zl) zl.textContent = Math.round(S.zoom * 100) + '%'; },

    _signAt: function (at) { if (S.seq && S.withHost) { toast('Hand the device to the signer first'); hostCtl(); return; } if (!S.agreed) { toast('Agree to the disclosure first'); return; } if (S.seq) { var m = (S.meta || {})[S.si]; if (m && (!String(m.n || '').trim() || !m.d)) { toast('Fill in your name and date first'); return; } } S.cur = at; sigDlg(at); },
    _tabTo: function (t) { S._tab = t; sigDlg(S._at); },
    _styleTo: function (c) { S._style = c; document.getElementById('zsfStyles').innerHTML = styles(); },
    _sigText: function (v) { S._text = v; document.getElementById('zsfStyles').innerHTML = styles(); },
    _sigIni: function (v) { S._ini = v; document.getElementById('zsfStyles').innerHTML = styles(); },
    _clearDraw: function () { var c = document.getElementById('zsfDraw'); if (c) { c.getContext('2d').clearRect(0, 0, c.width, c.height); S._drawn = false; } },
    _sigImg: function (inp) { var f = inp.files && inp.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { S._img = r.result; sigDlg(S._at); }; r.readAsDataURL(f); },
    _applySig: function () {
      if (S._tab === 'type') { if (!String(S._text || '').trim()) { toast('Type your signature'); return; } S.sig = { text: S._text, cls: S._style }; }
      else if (S._tab === 'draw') { if (!S._drawn) { toast('Draw your signature first'); return; } S.sig = { img: document.getElementById('zsfDraw').toDataURL('image/png'), text: sgNow().name }; }
      else { if (!S._img) { toast('Upload an image of your signature'); return; } S.sig = { img: S._img, text: sgNow().name }; }
      S.sig.ini = S._ini;
      if (S.seq) {
        var me = S.si, at = today() + ' ' + new Date().toTimeString().slice(0, 5);
        S.fields.forEach(function (f) { if (f.r === me) { f.signed = true; f.sig = S.sig; f.when = at; } });
        S.signedNow.push({ i: me, at: at }); S.sig = null; S._text = S._ini = S._img = null; S._tab = 'type'; S._drawn = false;
        S.si = me + 1; S.cur = S.si < S.rc.length ? 'g' + S.si : null;
        closeDlg(); paint();
        passBack(me);
        return;
      }
      var all = document.getElementById('zsfAll'), every = !all || all.checked;
      S.fields.forEach(function (f) { if (act(f) && (every || f.at === S._at)) f.signed = true; });
      var nx = S.fields.filter(function (x) { return act(x) && !x.signed; })[0]; S.cur = nx ? nx.at : null;
      closeDlg(); paint(); focusCur();
    },
    _finish: function () {
      if (!allSigned()) return;
      if (S.seq) { finishSession(); return; }
      passToHost();
    },
    _handoff: function () {
      var cs = S.rc[S.si];
      dlg('Email the signing link', '<p style="margin:0">' + esc(cs.name) + ' (' + esc(cs.role) + ') gets the signing link by email at <b>' + esc(cs.email) + '</b>. Signatures so far are kept, and the next signers follow in order.</p>',
        '<button class="zsf-btn" onclick="ZohoSign._closeDlg()">Cancel</button><button class="zsf-btn pri" onclick="ZohoSign._handoffGo()">' + ic('send') + 'Send link</button>');
    },
    _handoffGo: function () {
      var cs = S.rc[S.si], o = S.o, signed = S.signedNow; toast('Signing link emailed to ' + cs.name);
      if (o.onDone) o.onDone({ doc: S.name, mode: 'handoff', rest: 'inperson', signed: signed, handed: S.handed, resumedAt: S.resumedAt });
      S.result = { handoff: true }; close();
    },
    _nextOk: function () { closeDlg(); focusCur(); },
    _reviewed: function () { if (!S.reviewed) { S.reviewed = true; paint(); } },
    _custSign: function () {
      S.reviewed = true; var m = (S.meta || {})[S.si];
      if (m && (!String(m.n || '').trim() || !m.d)) { paint(); focusCur(); toast('Check your name and date first'); return; }
      paint(); ZohoSign._signAt('g' + S.si);
    },
    _passBack: function () {
      var v = document.getElementById('zsfCopy').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { toast('Enter a valid email address'); return; }
      var last = S.signedNow[S.signedNow.length - 1], r = S.rc[last.i];
      last.copyTo = v; last.changed = v !== (r.email || ''); last.back = today() + ' ' + new Date().toTimeString().slice(0, 5);
      closeDlg(); hostCtl();
    },
    _handNext: function () {
      var r = S.rc[S.si]; S.handed = S.handed || {}; S.handed[S.si] = today() + ' ' + new Date().toTimeString().slice(0, 5); S.handedAny = true; S.withHost = false; S.reviewed = false;
      closeDlg(); paint(); focusCur(); toast('Device handed to ' + r.name);
    },
    _pause: function () {
      var o = S.o; toast('Session paused · ' + S.si + ' of ' + S.rc.length + ' signed');
      if (o.onDone) o.onDone({ doc: S.name, mode: 'partial', signed: S.signedNow, handed: S.handed, resumedAt: S.resumedAt });
      S.result = { paused: true }; close();
    },
    _meta: function (i, k, v) { S.meta = S.meta || {}; (S.meta[i] = S.meta[i] || {})[k] = v; },
    _toHost: function () { var v = document.getElementById('zsfCopy').value.trim(); S.copyTo = v; finishSession(); },
    _complete: function () {
      closeDlg(); var sg = signer();
      if (S.seq) {
        S.result = { doc: S.name, mode: 'inperson', via: 'In person', signer: sg.name, signedAt: today(), signed: S.signedNow, handed: S.handed, resumedAt: S.resumedAt, finishedAt: today() + ' ' + new Date().toTimeString().slice(0, 5) };
        S.step = 4; paint(); toast(S.name + ' signed by all signers');
        if (S.o.onDone) S.o.onDone(S.result); return;
      }
      S.result = { doc: S.name, mode: 'inperson', via: 'In person', signer: sg.name, signedAt: today(), copyTo: S.copyTo || sg.email };
      S.step = 4; paint();
      toast(S.name + ' signed in person by ' + sg.name);
      if (S.o.onDone) S.o.onDone(S.result);
    },
    _decline: function () {
      if (!confirm('Decline to sign this document?')) return;
      var o = S.o, name = S.name; toast(name + ' declined by the signer');
      if (o.onDone) o.onDone({ doc: name, mode: 'declined', via: 'In person', signed: S.signedNow || [] });
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
