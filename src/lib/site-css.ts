// Estilos de las páginas públicas (webs de negocios, landing y legal)
export const SITE_CSS = `
main:has(.site){max-width:none;padding:0}
.site{--ink:#1b1f27;--soft:#5a6272;--line:#e4e7ec;--brand:#b4532a;--paper:#fffdf9;background:var(--paper);color:var(--ink);min-height:100vh;font:16px/1.6 Georgia,'Times New Roman',serif}
.site details{border:1px solid var(--line);border-radius:10px;background:#fff;padding:10px 12px;font:15px system-ui,sans-serif}
.site details summary{cursor:pointer;color:var(--soft)}
.site details .form{margin-top:10px}
.site .faq h3{font-size:17px;margin:18px 0 4px}
.site .faq p{margin:0}
.site ul.plain{margin:0;padding-left:20px}
.site ul.plain li{margin-bottom:6px}
.site .micro{font:14px system-ui,sans-serif;color:var(--soft);margin:8px 0 0}
.site .sectors{display:flex;gap:8px;flex-wrap:wrap}
.site .out{border:1px solid var(--line);border-radius:12px;background:#fff;padding:14px 16px;display:grid;gap:6px}
.site .result{display:flex;justify-content:space-between;gap:12px;margin:0;font:16px system-ui,sans-serif}
.site .result span{color:var(--soft)}
.site .link{font:14px ui-monospace,Menlo,monospace;word-break:break-all;margin:0 0 8px}
.site section,.site .hero,.site footer{max-width:760px;margin:0 auto;padding:28px 20px}
.site h1{font-size:clamp(32px,7vw,54px);line-height:1.1;margin:6px 0 10px}
.site h2{font-size:20px;margin:0 0 10px;color:var(--ink)}
.site h2 small{font-weight:400;color:var(--soft);font-size:14px}
.site .hero{padding-top:56px;padding-bottom:36px;border-bottom:1px solid var(--line)}
.site .kicker{font:600 13px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--brand);margin:0}
.site .tag{font-size:20px;color:var(--soft);margin:0 0 22px}
.site .actions{display:flex;gap:10px;flex-wrap:wrap}
.site .btn{font:600 15px system-ui,sans-serif;background:var(--brand);color:#fff;border:1px solid var(--brand);padding:11px 20px;border-radius:999px;text-decoration:none;cursor:pointer}
.site .btn.ghost{background:transparent;color:var(--brand)}
.site .btn.light{background:#fff;color:var(--ink);border-color:#fff;white-space:nowrap}
.site .chips{list-style:none;padding:0;margin:0;display:flex;gap:8px;flex-wrap:wrap}
.site .chips li{border:1px solid var(--line);border-radius:999px;padding:6px 14px;background:#fff;font:15px system-ui,sans-serif}
.site .two{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.site .two p{margin:0 0 6px}
.site a{color:var(--brand)}
.site .form{display:grid;gap:10px;max-width:460px}
.site .form input:not([type=checkbox]),.site .form textarea,.site .form select{font:16px system-ui,sans-serif;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.site .form .btn{justify-self:start}
.site .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.site .legal{font:13px system-ui,sans-serif;color:var(--soft);margin:0}
.site .demo{background:var(--ink);color:#fff;font:14px system-ui,sans-serif;padding:10px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center}
.site .flash{background:#eef7ee;color:#1d5b2c;font:600 15px system-ui,sans-serif;padding:12px 20px;text-align:center}
.site .flash.warn{background:#fdf1e7;color:#8a3b12}
.site footer{color:var(--soft);font:14px system-ui,sans-serif;border-top:1px solid var(--line)}
`;
