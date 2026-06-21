import{r as S}from"./index-Qo9IVEca.js";var j={exports:{}},y={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R;function T(){if(R)return y;R=1;var s=S(),t=Symbol.for("react.element"),o=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,r=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function a(c,u,f){var n,p={},w=null,x=null;f!==void 0&&(w=""+f),u.key!==void 0&&(w=""+u.key),u.ref!==void 0&&(x=u.ref);for(n in u)i.call(u,n)&&!d.hasOwnProperty(n)&&(p[n]=u[n]);if(c&&c.defaultProps)for(n in u=c.defaultProps,u)p[n]===void 0&&(p[n]=u[n]);return{$$typeof:t,type:c,key:w,ref:x,props:p,_owner:r.current}}return y.Fragment=o,y.jsx=a,y.jsxs=a,y}var N;function M(){return N||(N=1,j.exports=T()),j.exports}var e=M();const z=`
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;function C(s){const[t,o]=React.useState(s),i=React.useCallback((r,d)=>{const a=typeof r=="object"&&r!==null?r:{[r]:d};o(c=>({...c,...a})),window.parent.postMessage({type:"__edit_mode_set_keys",edits:a},"*"),window.dispatchEvent(new CustomEvent("tweakchange",{detail:a}))},[]);return[t,i]}function D({title:s="Tweaks",children:t}){const[o,i]=React.useState(!1),r=React.useRef(null),d=React.useRef({x:16,y:16}),a=16,c=React.useCallback(()=>{const n=r.current;if(!n)return;const p=n.offsetWidth,w=n.offsetHeight,x=Math.max(a,window.innerWidth-p-a),m=Math.max(a,window.innerHeight-w-a);d.current={x:Math.min(x,Math.max(a,d.current.x)),y:Math.min(m,Math.max(a,d.current.y))},n.style.right=d.current.x+"px",n.style.bottom=d.current.y+"px"},[]);React.useEffect(()=>{if(!o)return;if(c(),typeof ResizeObserver>"u")return window.addEventListener("resize",c),()=>window.removeEventListener("resize",c);const n=new ResizeObserver(c);return n.observe(document.documentElement),()=>n.disconnect()},[o,c]),React.useEffect(()=>{const n=p=>{var x;const w=(x=p==null?void 0:p.data)==null?void 0:x.type;w==="__activate_edit_mode"?i(!0):w==="__deactivate_edit_mode"&&i(!1)};return window.addEventListener("message",n),window.parent.postMessage({type:"__edit_mode_available"},"*"),()=>window.removeEventListener("message",n)},[]);const u=()=>{i(!1),window.parent.postMessage({type:"__edit_mode_dismissed"},"*")},f=n=>{const p=r.current;if(!p)return;const w=p.getBoundingClientRect(),x=n.clientX,m=n.clientY,v=window.innerWidth-w.right,l=window.innerHeight-w.bottom,b=h=>{d.current={x:v-(h.clientX-x),y:l-(h.clientY-m)},c()},g=()=>{window.removeEventListener("mousemove",b),window.removeEventListener("mouseup",g)};window.addEventListener("mousemove",b),window.addEventListener("mouseup",g)};return o?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:z}),e.jsxs("div",{ref:r,className:"twk-panel","data-omelette-chrome":"",style:{right:d.current.x,bottom:d.current.y},children:[e.jsxs("div",{className:"twk-hd",onMouseDown:f,children:[e.jsx("b",{children:s}),e.jsx("button",{className:"twk-x","aria-label":"Close tweaks",onMouseDown:n=>n.stopPropagation(),onClick:u,children:"✕"})]}),e.jsx("div",{className:"twk-body",children:t})]})]}):null}function O({label:s,children:t}){return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"twk-sect",children:s}),t]})}function k({label:s,value:t,children:o,inline:i=!1}){return e.jsxs("div",{className:i?"twk-row twk-row-h":"twk-row",children:[e.jsxs("div",{className:"twk-lbl",children:[e.jsx("span",{children:s}),t!=null&&e.jsx("span",{className:"twk-val",children:t})]}),o]})}function P({label:s,value:t,min:o=0,max:i=100,step:r=1,unit:d="",onChange:a}){return e.jsx(k,{label:s,value:`${t}${d}`,children:e.jsx("input",{type:"range",className:"twk-slider",min:o,max:i,step:r,value:t,onChange:c=>a(Number(c.target.value))})})}function A({label:s,value:t,onChange:o}){return e.jsxs("div",{className:"twk-row twk-row-h",children:[e.jsx("div",{className:"twk-lbl",children:e.jsx("span",{children:s})}),e.jsx("button",{type:"button",className:"twk-toggle","data-on":t?"1":"0",role:"switch","aria-checked":!!t,onClick:()=>o(!t),children:e.jsx("i",{})})]})}function B({label:s,value:t,options:o,onChange:i}){const r=React.useRef(null),[d,a]=React.useState(!1),c=React.useRef(t);c.current=t;const u=l=>String(typeof l=="object"?l.label:l).length;if(!(o.reduce((l,b)=>Math.max(l,u(b)),0)<=({2:16,3:10}[o.length]??0))){const l=b=>{const g=o.find(h=>String(typeof h=="object"?h.value:h)===b);return g===void 0?b:typeof g=="object"?g.value:g};return e.jsx(E,{label:s,value:t,options:o,onChange:b=>i(l(b))})}const p=o.map(l=>typeof l=="object"?l:{value:l,label:l}),w=Math.max(0,p.findIndex(l=>l.value===t)),x=p.length,m=l=>{const b=r.current.getBoundingClientRect(),g=b.width-4,h=Math.floor((l-b.left-2)/g*x);return p[Math.max(0,Math.min(x-1,h))].value},v=l=>{a(!0);const b=m(l.clientX);b!==c.current&&i(b);const g=L=>{if(!r.current)return;const _=m(L.clientX);_!==c.current&&i(_)},h=()=>{a(!1),window.removeEventListener("pointermove",g),window.removeEventListener("pointerup",h)};window.addEventListener("pointermove",g),window.addEventListener("pointerup",h)};return e.jsx(k,{label:s,children:e.jsxs("div",{ref:r,role:"radiogroup",onPointerDown:v,className:d?"twk-seg dragging":"twk-seg",children:[e.jsx("div",{className:"twk-seg-thumb",style:{left:`calc(2px + ${w} * (100% - 4px) / ${x})`,width:`calc((100% - 4px) / ${x})`}}),p.map(l=>e.jsx("button",{type:"button",role:"radio","aria-checked":l.value===t,children:l.label},l.value))]})})}function E({label:s,value:t,options:o,onChange:i}){return e.jsx(k,{label:s,children:e.jsx("select",{className:"twk-field",value:t,onChange:r=>i(r.target.value),children:o.map(r=>{const d=typeof r=="object"?r.value:r,a=typeof r=="object"?r.label:r;return e.jsx("option",{value:d,children:a},d)})})})}function X({label:s,value:t,placeholder:o,onChange:i}){return e.jsx(k,{label:s,children:e.jsx("input",{className:"twk-field",type:"text",value:t,placeholder:o,onChange:r=>i(r.target.value)})})}function $({label:s,value:t,min:o,max:i,step:r=1,unit:d="",onChange:a}){const c=n=>o!=null&&n<o?o:i!=null&&n>i?i:n,u=React.useRef({x:0,val:0}),f=n=>{n.preventDefault(),u.current={x:n.clientX,val:t};const p=(String(r).split(".")[1]||"").length,w=m=>{const v=m.clientX-u.current.x,l=u.current.val+v*r,b=Math.round(l/r)*r;a(c(Number(b.toFixed(p))))},x=()=>{window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",x)};window.addEventListener("pointermove",w),window.addEventListener("pointerup",x)};return e.jsxs("div",{className:"twk-num",children:[e.jsx("span",{className:"twk-num-lbl",onPointerDown:f,children:s}),e.jsx("input",{type:"number",value:t,min:o,max:i,step:r,onChange:n=>a(c(Number(n.target.value)))}),d&&e.jsx("span",{className:"twk-num-unit",children:d})]})}function q(s){const t=String(s).replace("#",""),o=t.length===3?t.replace(/./g,c=>c+c):t.padEnd(6,"0"),i=parseInt(o.slice(0,6),16);if(Number.isNaN(i))return!0;const r=i>>16&255,d=i>>8&255,a=i&255;return r*299+d*587+a*114>148e3}const I=({light:s})=>e.jsx("svg",{viewBox:"0 0 14 14","aria-hidden":"true",children:e.jsx("path",{d:"M3 7.2 5.8 10 11 4.2",fill:"none",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",stroke:s?"rgba(0,0,0,.78)":"#fff"})});function J({label:s,value:t,options:o,onChange:i}){if(!o||!o.length)return e.jsxs("div",{className:"twk-row twk-row-h",children:[e.jsx("div",{className:"twk-lbl",children:e.jsx("span",{children:s})}),e.jsx("input",{type:"color",className:"twk-swatch",value:t,onChange:a=>i(a.target.value)})]});const r=a=>String(JSON.stringify(a)).toLowerCase(),d=r(t);return e.jsx(k,{label:s,children:e.jsx("div",{className:"twk-chips",role:"radiogroup",children:o.map((a,c)=>{const u=Array.isArray(a)?a:[a],[f,...n]=u,p=n.slice(0,4),w=r(a)===d;return e.jsxs("button",{type:"button",className:"twk-chip",role:"radio","aria-checked":w,"data-on":w?"1":"0","aria-label":u.join(", "),title:u.join(" · "),style:{background:f},onClick:()=>i(a),children:[p.length>0&&e.jsx("span",{children:p.map((x,m)=>e.jsx("i",{style:{background:x}},m))}),w&&e.jsx(I,{light:q(f)})]},c)})})})}function W({label:s,onClick:t,secondary:o=!1}){return e.jsx("button",{type:"button",className:o?"twk-btn secondary":"twk-btn",onClick:t,children:s})}Object.assign(window,{useTweaks:C,TweaksPanel:D,TweakSection:O,TweakRow:k,TweakSlider:P,TweakToggle:A,TweakRadio:B,TweakSelect:E,TweakText:X,TweakNumber:$,TweakColor:J,TweakButton:W});
