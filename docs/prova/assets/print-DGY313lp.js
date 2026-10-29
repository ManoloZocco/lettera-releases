const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-BcqjhCNn.js","./vendor-react-Hz_8Ol3n.js","./vendor-tiptap-CLfcdF-F.js","./index-CcEH84_K.css","./export-docx-CPOwqgm7.js","./export-document-BRPcXvfT.js","./export-odt-NCYo-2aA.js","./jszip.min-BRH_WIY7.js"])))=>i.map(i=>d[i]);
import{aI as E,_ as s,aJ as A,u as g,a5 as k,aK as I}from"./index-BcqjhCNn.js";const N={png:"image/png",jpg:"image/jpeg",gif:"image/gif",bmp:"image/bmp"};function h(t,e){var a;if(t.type==="image"){const o=(a=t.attrs)==null?void 0:a.src;typeof o=="string"&&o&&e.add(o)}for(const o of t.content??[])h(o,e)}async function b(t){const e=new Set;h(t,e);const a=new Map;return await Promise.all([...e].map(async o=>{a.set(o,await O(o).catch(()=>null))})),a}async function O(t){const e=await M(t);if(!e)return null;const a=D(e);return a?{data:e,...a}:C(e)}async function M(t){if(t.startsWith("data:"))return f(t);const e=E(t);if(e){const{readImageBase64:a}=await s(async()=>{const{readImageBase64:o}=await import("./index-BcqjhCNn.js").then(n=>n.d9);return{readImageBase64:o}},__vite__mapDeps([0,1,2,3]),import.meta.url);return f(await a(e))}if(/^https?:\/\//i.test(t)){const a=await fetch(t);return a.ok?new Uint8Array(await a.arrayBuffer()):null}return null}function f(t){const e=t.indexOf(",");if(e===-1)return null;const a=t.slice(0,e),o=t.slice(e+1);if(a.endsWith(";base64")){const n=atob(o),r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}return new TextEncoder().encode(decodeURIComponent(o))}function D(t){const e=r=>t[r]<<8|t[r+1],a=r=>t[r]|t[r+1]<<8,o=r=>(t[r]<<24>>>0)+(t[r+1]<<16)+(t[r+2]<<8)+t[r+3],n=r=>t[r]|t[r+1]<<8|t[r+2]<<16|t[r+3]<<24;if(t.length>=24&&t[0]===137&&t[1]===80&&t[2]===78&&t[3]===71)return{type:"png",width:o(16),height:o(20)};if(t.length>=10&&t[0]===71&&t[1]===73&&t[2]===70)return{type:"gif",width:a(6),height:a(8)};if(t.length>=26&&t[0]===66&&t[1]===77)return{type:"bmp",width:Math.abs(n(18)),height:Math.abs(n(22))};if(t.length>=4&&t[0]===255&&t[1]===216){let r=2;for(;r+9<t.length;){if(t[r]!==255)return null;const i=t[r+1];if(i===216||i===1||i>=208&&i<=215){r+=2;continue}if(i>=192&&i<=207&&i!==196&&i!==200&&i!==204)return{type:"jpg",width:e(r+7),height:e(r+5)};r+=2+e(r+2)}return null}return null}async function C(t){if(typeof document>"u"||typeof URL.createObjectURL!="function")return null;const e=/^\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(new TextDecoder().decode(t.subarray(0,512))),a=new Blob([t],e?{type:"image/svg+xml"}:{}),o=URL.createObjectURL(a);try{const n=await new Promise(c=>{const d=new Image,m=setTimeout(()=>c(null),5e3);d.onload=()=>{clearTimeout(m),c(d)},d.onerror=()=>{clearTimeout(m),c(null)},d.src=o});if(!n||!n.naturalWidth||!n.naturalHeight)return null;const r=document.createElement("canvas");r.width=n.naturalWidth,r.height=n.naturalHeight;const i=r.getContext("2d");if(!i)return null;i.drawImage(n,0,0);const l=await new Promise(c=>r.toBlob(c,"image/png"));return l?{data:new Uint8Array(await l.arrayBuffer()),type:"png",width:n.naturalWidth,height:n.naturalHeight}:null}finally{URL.revokeObjectURL(o)}}function R(t){switch(t){case"narrow":return"0.7in";case"wide":return"1.3in";case"normal":default:return"1in"}}function z(t){switch(t){case"single":return 1;case"double":return 2;case"onePointFive":default:return 1.5}}function y(t=""){const e=t?`${t} `:"";return`
    ${e}h1 { font-size: 2rem; font-weight: 700; margin-top: 2.5rem; }
    ${e}h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; }
    ${e}h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; }
    ${e}blockquote { border-left: 3px solid #e5e7eb; padding-left: 1rem; color: #6b7280; font-style: italic; }
    ${e}code { background: #f5f5f5; padding: 0.15em 0.35em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; }
    ${e}pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    ${e}pre code { background: none; padding: 0; }
    ${e}table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
    ${e}td, ${e}th {
      border: var(--table-border-width, 1px) solid var(--table-border-color, #e5e7eb);
      padding: var(--table-padding, 0.5rem);
      text-align: var(--table-align, left);
      vertical-align: var(--table-valign, top);
    }
    ${e}th { background: #f5f5f5; font-weight: 600; }
    ${e}td > *, ${e}th > * { margin: 0; line-height: var(--table-line-height, 1.4); }
    ${e}table[data-border-style="horizontal"] td, ${e}table[data-border-style="horizontal"] th { border-left: none; border-right: none; }
    ${e}table[data-border-style="none"] td, ${e}table[data-border-style="none"] th { border: none; }
    ${e}img { max-width: 100%; height: auto; border-radius: 6px; }
    ${e}mark { background-color: rgba(255, 213, 79, 0.4); border-radius: 2px; padding: 0.05em 0.1em; }
    ${e}hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
    ${e}a { color: #3b82f6; }
  `}function W(t,e){const a=t.getHTML();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${A(e)}</title>
  <style>
    body {
      font-family: 'Literata', Georgia, serif;
      max-width: 65ch;
      margin: 2rem auto;
      padding: 0 1rem;
      line-height: 1.7;
      color: #1a1a1a;
    }
    ${y()}
  </style>
</head>
<body>
${a}
</body>
</html>`}function w(t,e){var o,n;const a=g.getState();return{title:t,style:e,language:a.settings.spellcheckLanguage,variables:((n=(o=a.projectManifest)==null?void 0:o.compileConfig)==null?void 0:n.variables)??{}}}async function V(t,e,a="classic"){const o=t.getJSON(),{buildDocx:n}=await s(async()=>{const{buildDocx:i}=await import("./export-docx-CPOwqgm7.js");return{buildDocx:i}},__vite__mapDeps([4,5]),import.meta.url),r=await b(o);return n(o,{...w(e,a),images:r})}async function J(t,e,a="classic"){const o=t.getJSON(),{buildOdt:n}=await s(async()=>{const{buildOdt:i}=await import("./export-odt-NCYo-2aA.js");return{buildOdt:i}},__vite__mapDeps([6,7,1,5,0,2,3]),import.meta.url),r=await b(o);return n(o,{...w(e,a),images:r})}const $="lettera-print-root",H="lettera-print-style",u="lettera-print-fit";function _(t){const e=/^(\d*\.?\d+)(in|cm|mm|pt|px)$/.exec(t.trim());if(!e)return 0;const a={in:72,cm:72/2.54,mm:72/25.4,pt:1,px:.75};return Number(e[1])*a[e[2]]}function x(t){return{margin:R(t.margins),fontFamily:"'Literata', Georgia, serif",fontSizePt:t.fontSizePt,lineHeight:z(t.lineSpacing)}}function v(t,e=!0){const a=`#${$}`;return`
    ${a} {
      position: fixed;
      top: 0;
      left: -10000px;
      /* The width of the text on an A4 page, so the copy wraps on screen as on paper. */
      width: calc(8.27in - 2 * ${t.margin});
      visibility: hidden;
      pointer-events: none;
      font-family: ${t.fontFamily};
      font-size: ${t.fontSizePt}pt;
      line-height: ${t.lineHeight};
      color: #1a1a1a;
      background: #fff;
    }
    ${a} { overflow-wrap: break-word; }
    ${a} p { margin: 0 0 0.8em; }
    ${a} ul { list-style: disc; padding-left: 1.5em; margin: 0 0 0.8em; }
    ${a} ol { list-style: decimal; padding-left: 1.5em; margin: 0 0 0.8em; }
    ${a} li > p { margin: 0; }
    ${a} ul[data-type="taskList"] { list-style: none; padding-left: 0; }
    ${a} ul[data-type="taskList"] li { display: flex; gap: 0.5em; align-items: baseline; }
    ${a} ul[data-type="taskList"] li > div { flex: 1; }
    ${a} .lettera-callout {
      margin: 0 0 0.8em;
      padding: 0.5em 0.9em;
      border-left: 3px solid #9ca3af;
      border-radius: 4px;
      background: #f6f6f6;
    }
    ${a} .lettera-callout > :last-child { margin-bottom: 0; }
    ${a} .lettera-callout[data-callout-type="info"] { border-left-color: #3b82f6; }
    ${a} .lettera-callout[data-callout-type="tip"],
    ${a} .lettera-callout[data-callout-type="success"] { border-left-color: #22c55e; }
    ${a} .lettera-callout[data-callout-type="warning"],
    ${a} .lettera-callout[data-callout-type="caution"] { border-left-color: #f59e0b; }
    ${a} .lettera-callout[data-callout-type="error"] { border-left-color: #ef4444; }
    ${a} .lettera-callout[data-callout-type="important"] { border-left-color: #8b5cf6; }
    ${a} .lettera-math-block,
    ${a} .lettera-mermaid-diagram { display: block; margin: 1em 0; text-align: center; }
    ${a} .lettera-mermaid-diagram svg { max-width: 100%; height: auto; }
    ${a} :not(.lettera-footnote-content) + .lettera-footnote-content {
      margin-top: 1.5em;
      padding-top: 0.6em;
      border-top: 1px solid #e5e7eb;
    }
    ${a} .lettera-footnote-content { font-size: 0.85em; }
    ${y(a)}
    ${a} > :first-child { margin-top: 0; }
    ${a} pre { white-space: pre-wrap; overflow: visible; }
    ${a} table { width: 100%; table-layout: auto; }
    ${a} col { width: auto !important; }
    ${a} table.${u} { table-layout: fixed; }
    ${a} table.${u} :is(td, th) { overflow-wrap: anywhere; }
    @media print {
      @page { margin: ${e?t.margin:"0"}; }
      html, body {
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        background: #fff !important;
      }
      body > *:not(${a}) { display: none !important; }
      ${a} { position: static; width: auto; visibility: visible; }
    }
  `}function p(t,e,a){const o=document.getElementById(e);if(o)return o;const n=document.createElement(t);return n.id=e,a.appendChild(n),n}const U=/^(localfile:|asset:|https?:|data:image\/)/i;function F(t,e){const a=document.createElement("template");a.innerHTML=e;const o=a.content.querySelectorAll("img");t.querySelectorAll("img").forEach((r,i)=>{var c;const l=(c=o[i])==null?void 0:c.getAttribute("src");l&&U.test(l)&&r.setAttribute("src",l)});const n=a.content.querySelectorAll("ol");t.querySelectorAll("ol").forEach((r,i)=>{var c;const l=(c=n[i])==null?void 0:c.getAttribute("start");l&&Number.isInteger(Number(l))&&(r.start=Number(l))})}async function S(t,e="html"){const a=[...t.querySelectorAll('[data-type="math-inline"], [data-type="math-block"]')];if(a.length===0)return;const o=(await s(async()=>{const{default:n}=await import("./katex-f0vruDP5.js");return{default:n}},[],import.meta.url)).default;for(const n of a){const r=n.textContent??"";if(r.trim())try{n.innerHTML=o.renderToString(r,{displayMode:n.dataset.type==="math-block",output:e,throwOnError:!0,strict:!1})}catch{}}}async function L(t){const e=[...t.querySelectorAll('[data-type="mermaid-diagram"]')];if(e.length===0)return;const{renderMermaidForPrint:a}=await s(async()=>{const{renderMermaidForPrint:o}=await import("./index-BcqjhCNn.js").then(n=>n.de);return{renderMermaidForPrint:o}},__vite__mapDeps([0,1,2,3]),import.meta.url);for(const o of e){const n=o.textContent??"";if(n.trim())try{o.innerHTML=await a(n)}catch{}}}function j(t){t.querySelectorAll("table").forEach(e=>{e.scrollWidth>t.clientWidth+1&&e.classList.add(u)})}async function P(t,e,a={}){var i;const o=await k()==="macos";p("style",H,document.head).textContent=v(e,!o);const n=p("div",$,document.body);n.setAttribute("aria-hidden","true"),n.innerHTML=I(t),F(n,t),await S(n),await L(n),await Promise.all([(i=document.fonts)==null?void 0:i.ready,...[...n.querySelectorAll("img")].map(l=>Promise.resolve().then(()=>l.decode()).catch(()=>{}))]),j(n);const{invoke:r}=await s(async()=>{const{invoke:l}=await import("./index-BcqjhCNn.js").then(c=>c.d6);return{invoke:l}},__vite__mapDeps([0,1,2,3]),import.meta.url);await r("print_page",{title:a.title??document.title,marginPt:o?_(e.margin):0})}function T(t,e,a){return P(t.getHTML(),x(e),{title:a})}function B(t){const{settings:e,documentTitle:a}=g.getState();return T(t,{margins:e.exportPdfMargins,fontSizePt:e.exportPdfFontSizePt,lineSpacing:e.exportPdfLineSpacing},a)}const Y=Object.freeze(Object.defineProperty({__proto__:null,cssLengthToPt:_,documentPrintLayout:x,drawDiagrams:L,drawFormulas:S,printCss:v,printCurrentDocument:B,printDocument:T,printHtml:P},Symbol.toStringTag,{value:"Module"}));export{N as M,P as a,J as b,V as c,Y as d,W as e,b as l,B as p};
