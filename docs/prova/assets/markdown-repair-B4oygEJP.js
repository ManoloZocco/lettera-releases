import{U as g}from"./index-D4R2D8rm.js";import"./vendor-react-Hz_8Ol3n.js";import"./vendor-tiptap-CLfcdF-F.js";const $=/```[\s\S]*?```|~~~[\s\S]*?~~~|\$\$[\s\S]*?\$\$|`[^`\n]*`|\$[^$\n]*\\[^$\n]*\$/g;function h(e,n){let r="",t=0;for(const o of e.matchAll($))r+=n(e.slice(t,o.index)),r+=o[0],t=o.index+o[0].length;return r+n(e.slice(t))}const k=new Set(["heading","strong","em","del","link","image","table","list","blockquote","hr","code","codespan"]);function l(e){let n=0;for(const r of e){k.has(r.type)&&n++;const t=r;t.tokens&&(n+=l(t.tokens)),t.items&&(n+=l(t.items));for(const o of t.header??[])n+=l(o.tokens);for(const o of t.rows??[])for(const a of o)n+=l(a.tokens)}return n}function R(e){if((e.replace($,"").match(/\\[#*[\]_`|~]/g)??[]).length<5)return!1;const t=l(g.lex(e,{gfm:!0}));return l(g.lex(b(e),{gfm:!0}))-t>=2}const x=/^\s*:?-+:?\s*$/;function E(e){var m;const n=e.indexOf("|"),r=e.lastIndexOf("|");if(n===-1||r<=n)return e;const t=e.slice(0,n),o=e.slice(n,r+1),a=e.slice(r+1),i=o.slice(1,-1).split("|");let s=0,f=0;for(const c of i)f=x.test(c)?f+1:0,f>s&&(s=f);if(s===0||(i.length+1)%(s+1)!==0)return e;const p=(i.length+1)/(s+1);if(p<1)return e;const d=[];for(let c=0;c<p;c++){const u=c*(s+1);if(c>0&&((m=i[u-1])==null?void 0:m.trim())!=="")return e;d.push(`|${i.slice(u,u+s).join("|")}|`)}return(t.trim()===""?t:`${t.trimEnd()}

`)+d.join(`
`)+a}function b(e){return h(e,r=>{let t=r.replace(/\\(?=[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g,"");return t=t.replace(/ \*{3} /g,`

---

`),t=t.replace(/([^\n]) +(#{1,6} )/g,`$1

$2`),t=t.replace(/([^\n]) +(\[\^[^\]\s]+\]:)/g,`$1
$2`),t=t.split(`
`).map(E).join(`
`),t.replace(/\n{3,}/g,`

`)}).trim()}export{R as detectEscapedMarkdown,b as repairMarkdown};
