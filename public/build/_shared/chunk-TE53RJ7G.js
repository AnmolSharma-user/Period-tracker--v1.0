import{a as E,b as T,d as A,e as H}from"/build/_shared/chunk-EKVI7LUR.js";import{a as g}from"/build/_shared/chunk-YE2UENJQ.js";import{b as N,e as y}from"/build/_shared/chunk-57Q5BGZR.js";import{a as v,n as k}from"/build/_shared/chunk-JP2RFOQ7.js";import{d}from"/build/_shared/chunk-G5WX4PPA.js";var L=d(v(),1);var s=d(v(),1);var S=d(v(),1);function _(e){let t=S.useRef({value:e,previous:e});return S.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}var B=d(v(),1);function M(e){let[t,r]=B.useState(void 0);return A(()=>{if(e){r({width:e.offsetWidth,height:e.offsetHeight});let c=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;let u=o[0],n,i;if("borderBoxSize"in u){let a=u.borderBoxSize,p=Array.isArray(a)?a[0]:a;n=p.inlineSize,i=p.blockSize}else n=e.offsetWidth,i=e.offsetHeight;r({width:n,height:i})});return c.observe(e,{box:"border-box"}),()=>c.unobserve(e)}else r(void 0)},[e]),t}var f=d(k(),1),P="Switch",[G,ae]=T(P),[J,K]=G(P),I=s.forwardRef((e,t)=>{let{__scopeSwitch:r,name:c,checked:o,defaultChecked:u,required:n,disabled:i,value:a="on",onCheckedChange:p,form:w,...l}=e,[h,D]=s.useState(null),F=N(t,b=>D(b)),R=s.useRef(!1),z=h?w||!!h.closest("form"):!0,[m=!1,U]=H({prop:o,defaultProp:u,onChange:p});return(0,f.jsxs)(J,{scope:r,checked:m,disabled:i,children:[(0,f.jsx)(g.button,{type:"button",role:"switch","aria-checked":m,"aria-required":n,"data-state":j(m),"data-disabled":i?"":void 0,disabled:i,value:a,...l,ref:F,onClick:E(e.onClick,b=>{U(X=>!X),z&&(R.current=b.isPropagationStopped(),R.current||b.stopPropagation())})}),z&&(0,f.jsx)(Q,{control:h,bubbles:!R.current,name:c,value:a,checked:m,required:n,disabled:i,form:w,style:{transform:"translateX(-100%)"}})]})});I.displayName=P;var O="SwitchThumb",W=s.forwardRef((e,t)=>{let{__scopeSwitch:r,...c}=e,o=K(O,r);return(0,f.jsx)(g.span,{"data-state":j(o.checked),"data-disabled":o.disabled?"":void 0,...c,ref:t})});W.displayName=O;var Q=e=>{let{control:t,checked:r,bubbles:c=!0,...o}=e,u=s.useRef(null),n=_(r),i=M(t);return s.useEffect(()=>{let a=u.current,p=window.HTMLInputElement.prototype,l=Object.getOwnPropertyDescriptor(p,"checked").set;if(n!==r&&l){let h=new Event("click",{bubbles:c});l.call(a,r),a.dispatchEvent(h)}},[n,r,c]),(0,f.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:r,...o,tabIndex:-1,ref:u,style:{...e.style,...i,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function j(e){return e?"checked":"unchecked"}var C=I,q=W;var x=d(k(),1),Y=L.forwardRef(({className:e,...t},r)=>(0,x.jsx)(C,{className:y("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...t,ref:r,children:(0,x.jsx)(q,{className:y("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")})}));Y.displayName=C.displayName;export{Y as a};
