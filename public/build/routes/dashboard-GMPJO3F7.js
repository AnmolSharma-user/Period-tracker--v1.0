import{a as we,b as Ee}from"/build/_shared/chunk-SOZJRLH2.js";import{a as ke}from"/build/_shared/chunk-V7A4TTYH.js";import"/build/_shared/chunk-BRSLZYGM.js";import{a as F,b as Ie,c as _e,d as Ne,e as j}from"/build/_shared/chunk-EKVI7LUR.js";import{a as Fe}from"/build/_shared/chunk-TLKRROZH.js";import{a as ne,b as ie,c as ce,d as de,e as ue,f as Ae,g as De,k as le}from"/build/_shared/chunk-PLAFFANM.js";import{b as q}from"/build/_shared/chunk-6NL3JN34.js";import{a as G}from"/build/_shared/chunk-YE2UENJQ.js";import{a as Se}from"/build/_shared/chunk-KTYYHXXO.js";import{a as nt,b as Pe,e as B,f as K,g as se,h as H}from"/build/_shared/chunk-57Q5BGZR.js";import"/build/_shared/chunk-HB276KJY.js";import{a as L,j as xe,n as I}from"/build/_shared/chunk-JP2RFOQ7.js";import{d as b}from"/build/_shared/chunk-G5WX4PPA.js";var wt=b(nt(),1);var _=b(L(),1);var Le=b(L(),1);var Ge=b(I(),1),me=Le.forwardRef(({className:e,...t},r)=>(0,Ge.jsx)("textarea",{className:B("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",e),ref:r,...t}));me.displayName="Textarea";var Z=b(L(),1);var k=b(L(),1);var R=b(L(),1);var A=b(L(),1),Me=b(I(),1);function Oe(e,t=[]){let r=[];function a(d,i){let v=A.createContext(i),g=r.length;r=[...r,i];function c(m){let{scope:y,children:P,...f}=m,h=y?.[e][g]||v,x=A.useMemo(()=>f,Object.values(f));return(0,Me.jsx)(h.Provider,{value:x,children:P})}function u(m,y){let P=y?.[e][g]||v,f=A.useContext(P);if(f)return f;if(i!==void 0)return i;throw new Error(`\`${m}\` must be used within \`${d}\``)}return c.displayName=d+"Provider",[c,u]}let l=()=>{let d=r.map(i=>A.createContext(i));return function(v){let g=v?.[e]||d;return A.useMemo(()=>({[`__scope${e}`]:{...v,[e]:g}}),[v,g])}};return l.scopeName=e,[a,it(l,...t)]}function it(...e){let t=e[0];if(e.length===1)return t;let r=()=>{let a=e.map(l=>({useScope:l(),scopeName:l.scopeName}));return function(d){let i=a.reduce((v,{useScope:g,scopeName:c})=>{let m=g(d)[`__scope${c}`];return{...v,...m}},{});return A.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return r.scopeName=t.scopeName,r}var fe=b(L(),1);var ct=fe["useId".toString()]||(()=>{}),dt=0;function z(e){let[t,r]=fe.useState(ct());return Ne(()=>{e||r(a=>a??String(dt++))},[e]),e||(t?`radix-${t}`:"")}var J=b(L(),1),ut=b(I(),1),lt=J.createContext(void 0);function Q(e){let t=J.useContext(lt);return e||t||"ltr"}var M=b(I(),1),pe="rovingFocusGroup.onEntryFocus",mt={bubbles:!1,cancelable:!0},X="RovingFocusGroup",[ve,Ue,ft]=we(X),[pt,ge]=Oe(X,[ft]),[vt,gt]=pt(X),Be=R.forwardRef((e,t)=>(0,M.jsx)(ve.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,M.jsx)(ve.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,M.jsx)(bt,{...e,ref:t})})}));Be.displayName=X;var bt=R.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:r,orientation:a,loop:l=!1,dir:d,currentTabStopId:i,defaultCurrentTabStopId:v,onCurrentTabStopIdChange:g,onEntryFocus:c,preventScrollOnEntryFocus:u=!1,...m}=e,y=R.useRef(null),P=Pe(t,y),f=Q(d),[h=null,x]=j({prop:i,defaultProp:v,onChange:g}),[w,N]=R.useState(!1),$=_e(c),V=Ue(r),W=R.useRef(!1),[re,Y]=R.useState(0);return R.useEffect(()=>{let C=y.current;if(C)return C.addEventListener(pe,$),()=>C.removeEventListener(pe,$)},[$]),(0,M.jsx)(vt,{scope:r,orientation:a,dir:f,loop:l,currentTabStopId:h,onItemFocus:R.useCallback(C=>x(C),[x]),onItemShiftTab:R.useCallback(()=>N(!0),[]),onFocusableItemAdd:R.useCallback(()=>Y(C=>C+1),[]),onFocusableItemRemove:R.useCallback(()=>Y(C=>C-1),[]),children:(0,M.jsx)(G.div,{tabIndex:w||re===0?-1:0,"data-orientation":a,...m,ref:P,style:{outline:"none",...e.style},onMouseDown:F(e.onMouseDown,()=>{W.current=!0}),onFocus:F(e.onFocus,C=>{let ae=!W.current;if(C.target===C.currentTarget&&ae&&!w){let s=new CustomEvent(pe,mt);if(C.currentTarget.dispatchEvent(s),!s.defaultPrevented){let o=V().filter(E=>E.focusable),T=o.find(E=>E.active),p=o.find(E=>E.id===h),U=[T,p,...o].filter(Boolean).map(E=>E.ref.current);Ve(U,u)}}W.current=!1}),onBlur:F(e.onBlur,()=>N(!1))})})}),Ke="RovingFocusGroupItem",$e=R.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:r,focusable:a=!0,active:l=!1,tabStopId:d,...i}=e,v=z(),g=d||v,c=gt(Ke,r),u=c.currentTabStopId===g,m=Ue(r),{onFocusableItemAdd:y,onFocusableItemRemove:P}=c;return R.useEffect(()=>{if(a)return y(),()=>P()},[a,y,P]),(0,M.jsx)(ve.ItemSlot,{scope:r,id:g,focusable:a,active:l,children:(0,M.jsx)(G.span,{tabIndex:u?0:-1,"data-orientation":c.orientation,...i,ref:t,onMouseDown:F(e.onMouseDown,f=>{a?c.onItemFocus(g):f.preventDefault()}),onFocus:F(e.onFocus,()=>c.onItemFocus(g)),onKeyDown:F(e.onKeyDown,f=>{if(f.key==="Tab"&&f.shiftKey){c.onItemShiftTab();return}if(f.target!==f.currentTarget)return;let h=Rt(f,c.orientation,c.dir);if(h!==void 0){if(f.metaKey||f.ctrlKey||f.altKey||f.shiftKey)return;f.preventDefault();let w=m().filter(N=>N.focusable).map(N=>N.ref.current);if(h==="last")w.reverse();else if(h==="prev"||h==="next"){h==="prev"&&w.reverse();let N=w.indexOf(f.currentTarget);w=c.loop?Ct(w,N+1):w.slice(N+1)}setTimeout(()=>Ve(w))}})})})});$e.displayName=Ke;var yt={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Tt(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function Rt(e,t,r){let a=Tt(e.key,r);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(a))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(a)))return yt[a]}function Ve(e,t=!1){let r=document.activeElement;for(let a of e)if(a===r||(a.focus({preventScroll:t}),document.activeElement!==r))return}function Ct(e,t){return e.map((r,a)=>e[(t+a)%e.length])}var We=Be,He=$e;var D=b(I(),1),be="Tabs",[xt,Jt]=Ie(be,[ge]),qe=ge(),[St,ye]=xt(be),Ye=k.forwardRef((e,t)=>{let{__scopeTabs:r,value:a,onValueChange:l,defaultValue:d,orientation:i="horizontal",dir:v,activationMode:g="automatic",...c}=e,u=Q(v),[m,y]=j({prop:a,onChange:l,defaultProp:d});return(0,D.jsx)(St,{scope:r,baseId:z(),value:m,onValueChange:y,orientation:i,dir:u,activationMode:g,children:(0,D.jsx)(G.div,{dir:u,"data-orientation":i,...c,ref:t})})});Ye.displayName=be;var je="TabsList",ze=k.forwardRef((e,t)=>{let{__scopeTabs:r,loop:a=!0,...l}=e,d=ye(je,r),i=qe(r);return(0,D.jsx)(We,{asChild:!0,...i,orientation:d.orientation,dir:d.dir,loop:a,children:(0,D.jsx)(G.div,{role:"tablist","aria-orientation":d.orientation,...l,ref:t})})});ze.displayName=je;var Je="TabsTrigger",Qe=k.forwardRef((e,t)=>{let{__scopeTabs:r,value:a,disabled:l=!1,...d}=e,i=ye(Je,r),v=qe(r),g=et(i.baseId,a),c=tt(i.baseId,a),u=a===i.value;return(0,D.jsx)(He,{asChild:!0,...v,focusable:!l,active:u,children:(0,D.jsx)(G.button,{type:"button",role:"tab","aria-selected":u,"aria-controls":c,"data-state":u?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:g,...d,ref:t,onMouseDown:F(e.onMouseDown,m=>{!l&&m.button===0&&m.ctrlKey===!1?i.onValueChange(a):m.preventDefault()}),onKeyDown:F(e.onKeyDown,m=>{[" ","Enter"].includes(m.key)&&i.onValueChange(a)}),onFocus:F(e.onFocus,()=>{let m=i.activationMode!=="manual";!u&&!l&&m&&i.onValueChange(a)})})})});Qe.displayName=Je;var Xe="TabsContent",Ze=k.forwardRef((e,t)=>{let{__scopeTabs:r,value:a,forceMount:l,children:d,...i}=e,v=ye(Xe,r),g=et(v.baseId,a),c=tt(v.baseId,a),u=a===v.value,m=k.useRef(u);return k.useEffect(()=>{let y=requestAnimationFrame(()=>m.current=!1);return()=>cancelAnimationFrame(y)},[]),(0,D.jsx)(Ee,{present:l||u,children:({present:y})=>(0,D.jsx)(G.div,{"data-state":u?"active":"inactive","data-orientation":v.orientation,role:"tabpanel","aria-labelledby":g,hidden:!y,id:c,tabIndex:0,...i,ref:t,style:{...e.style,animationDuration:m.current?"0s":void 0},children:y&&d})})});Ze.displayName=Xe;function et(e,t){return`${e}-trigger-${t}`}function tt(e,t){return`${e}-content-${t}`}var ot=Ye,Te=ze,Re=Qe,Ce=Ze;var oe=b(I(),1),rt=ot,he=Z.forwardRef(({className:e,...t},r)=>(0,oe.jsx)(Te,{ref:r,className:B("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",e),...t}));he.displayName=Te.displayName;var ee=Z.forwardRef(({className:e,...t},r)=>(0,oe.jsx)(Re,{ref:r,className:B("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",e),...t}));ee.displayName=Re.displayName;var te=Z.forwardRef(({className:e,...t},r)=>(0,oe.jsx)(Ce,{ref:r,className:B("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...t}));te.displayName=Ce.displayName;var n=b(I(),1);function at({userId:e}){let{toast:t}=Se(),[r,a]=(0,_.useState)(!1),[l,d]=(0,_.useState)(null),[i,v]=(0,_.useState)([]),[g,c]=(0,_.useState)([]),[u,m]=(0,_.useState)(new Date),[y,P]=(0,_.useState)([]),[f,h]=(0,_.useState)(""),[x,w]=(0,_.useState)(null),[N,$]=(0,_.useState)("calendar");(0,_.useEffect)(()=>{V(),W()},[]);let V=async()=>{try{a(!0);let{data:s,error:o}=await K.from("periods").select("*").eq("user_id",e).order("start_date",{ascending:!1});if(o)throw o;v(s||[])}catch(s){let o=s instanceof Error?s.message:"Failed to load periods";d(o),t({variant:"destructive",title:"Error",description:o})}finally{a(!1)}},W=async()=>{try{let{data:s,error:o}=await K.from("symptom_types").select("*").order("symptom_category",{ascending:!0}).order("symptom_name",{ascending:!0});if(o)throw o;let T=s?.reduce((p,S)=>{let U=p.find(E=>E.category===S.symptom_category);return U?U.symptoms.push({...S,isSelected:!1}):p.push({category:S.symptom_category,symptoms:[{...S,isSelected:!1}]}),p},[])||[];c(T)}catch(s){console.error("Failed to load symptom types:",s)}},re=s=>{if(m(s),s){let o=i.find(T=>{let p=H(T.start_date),S=T.end_date?H(T.end_date):null;return s>=p&&(!S||s<=S)});if(w(o||null),o){let T=o.symptoms;P(T),h(o.notes||""),c(p=>p.map(S=>({...S,symptoms:S.symptoms.map(U=>({...U,isSelected:T.some(E=>E.id===U.id)}))})))}else P([]),h(""),c(T=>T.map(p=>({...p,symptoms:p.symptoms.map(S=>({...S,isSelected:!1}))})))}},Y=s=>{c(o=>o.map(T=>({...T,symptoms:T.symptoms.map(p=>p.id===s.id?{...p,isSelected:!p.isSelected}:p)}))),P(o=>o.some(p=>p.id===s.id)?o.filter(p=>p.id!==s.id):[...o,{...s,isSelected:!0}])},C=async()=>{if(u)try{a(!0),d(null);let s={user_id:e,start_date:se(u),symptoms:y.map(o=>({id:o.id,symptom_name:o.symptom_name,symptom_category:o.symptom_category,symptom_icon:o.symptom_icon,logged_at:new Date().toISOString()})),notes:f.trim()||null};if(x){let{error:o}=await K.from("periods").update(s).eq("id",x.id);if(o)throw o;t({title:"Period updated",description:"Your period has been updated successfully."})}else{let{error:o}=await K.from("periods").insert([s]);if(o)throw o;t({title:"Period logged",description:"Your period has been logged successfully."})}await V()}catch(s){let o=s instanceof Error?s.message:"Failed to save period";d(o),t({variant:"destructive",title:"Error",description:o})}finally{a(!1)}},ae=async()=>{if(!(!x||!u))try{a(!0),d(null);let{error:s}=await K.from("periods").update({end_date:se(u)}).eq("id",x.id);if(s)throw s;t({title:"Period ended",description:"Your period has been marked as ended."}),await V()}catch(s){let o=s instanceof Error?s.message:"Failed to end period";d(o),t({variant:"destructive",title:"Error",description:o})}finally{a(!1)}};return(0,n.jsx)("div",{className:"space-y-6",children:(0,n.jsxs)(rt,{defaultValue:"calendar",value:N,onValueChange:$,children:[(0,n.jsxs)(he,{className:"grid w-full grid-cols-2",children:[(0,n.jsx)(ee,{value:"calendar",children:"Calendar"}),(0,n.jsx)(ee,{value:"symptoms",children:"Symptoms"})]}),(0,n.jsx)(te,{value:"calendar",children:(0,n.jsxs)(ne,{children:[(0,n.jsxs)(ie,{children:[(0,n.jsx)(ce,{children:"Period Calendar"}),(0,n.jsx)(de,{children:"Track your periods and view your cycle"})]}),(0,n.jsx)(ue,{children:(0,n.jsxs)("div",{className:"flex flex-col md:flex-row gap-6",children:[(0,n.jsx)("div",{className:"flex-1",children:(0,n.jsx)(ke,{mode:"single",selected:u,onSelect:re,className:"rounded-md border",modifiers:{period:s=>i.some(o=>{let T=H(o.start_date),p=o.end_date?H(o.end_date):null;return s>=T&&(!p||s<=p)})},modifiersClassNames:{period:"bg-red-100 text-red-900 hover:bg-red-200"}})}),(0,n.jsxs)("div",{className:"flex-1 space-y-4",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)(Fe,{children:"Notes"}),(0,n.jsx)(me,{value:f,onChange:s=>h(s.target.value),placeholder:"Add any notes about your period...",className:"mt-2",disabled:r})]}),l&&(0,n.jsx)(Ae,{variant:"destructive",children:(0,n.jsx)(De,{children:l})}),(0,n.jsxs)("div",{className:"flex gap-2",children:[(0,n.jsxs)(q,{onClick:C,disabled:r||!u,className:"flex-1",children:[r&&(0,n.jsx)(le,{className:"mr-2 h-4 w-4 animate-spin"}),x?"Update Period":"Start Period"]}),x&&!x.end_date&&(0,n.jsx)(q,{onClick:ae,disabled:r,variant:"outline",children:"End Period"})]})]})]})})]})}),(0,n.jsx)(te,{value:"symptoms",children:(0,n.jsxs)(ne,{children:[(0,n.jsxs)(ie,{children:[(0,n.jsx)(ce,{children:"Track Symptoms"}),(0,n.jsx)(de,{children:"Log your symptoms and track patterns"})]}),(0,n.jsx)(ue,{children:(0,n.jsxs)("div",{className:"space-y-6",children:[g.map(s=>(0,n.jsxs)("div",{className:"space-y-4",children:[(0,n.jsx)("h3",{className:"font-semibold",children:s.category}),(0,n.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2",children:s.symptoms.map(o=>(0,n.jsxs)(q,{variant:o.isSelected?"default":"outline",onClick:()=>Y(o),className:"justify-start",disabled:r,children:[o.symptom_icon&&(0,n.jsx)("span",{className:"mr-2",children:o.symptom_icon}),o.symptom_name]},o.id))})]},s.category)),(0,n.jsxs)(q,{onClick:C,disabled:r||!u,className:"w-full",children:[r&&(0,n.jsx)(le,{className:"mr-2 h-4 w-4 animate-spin"}),"Save Symptoms"]})]})})]})})]})})}var O=b(I(),1);function st(){let{userId:e}=xe();return(0,O.jsx)("main",{className:"min-h-screen p-4 md:p-8 bg-background",children:(0,O.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,O.jsxs)("div",{className:"mb-8",children:[(0,O.jsx)("h1",{className:"text-4xl font-bold tracking-tight",children:"Period Tracker"}),(0,O.jsx)("p",{className:"text-muted-foreground mt-2",children:"Track your periods and symptoms"})]}),(0,O.jsx)(at,{userId:e})]})})}export{st as default};
