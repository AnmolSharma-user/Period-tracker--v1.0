import{a as E}from"/build/_shared/chunk-6KU7KB65.js";import{a as F}from"/build/_shared/chunk-TLKRROZH.js";import{a as h,b as N,c as k,d as C,e as x,f as P,g as B,k as A}from"/build/_shared/chunk-PLAFFANM.js";import{b as s}from"/build/_shared/chunk-6NL3JN34.js";import"/build/_shared/chunk-YE2UENJQ.js";import{a as y}from"/build/_shared/chunk-KTYYHXXO.js";import{a as H,f as b}from"/build/_shared/chunk-57Q5BGZR.js";import"/build/_shared/chunk-HB276KJY.js";import{a as R,c as w,n}from"/build/_shared/chunk-JP2RFOQ7.js";import{d as r}from"/build/_shared/chunk-G5WX4PPA.js";var W=r(H(),1);var i=r(R(),1);var e=r(n(),1);function L(){let m=w(),{toast:c}=y(),[l,D]=(0,i.useState)(""),[u,p]=(0,i.useState)(null),[a,f]=(0,i.useState)(!1),[T,g]=(0,i.useState)(!1),q=async d=>{if(d.preventDefault(),!a)try{f(!0),p(null);let{error:o}=await b.auth.resetPasswordForEmail(l,{redirectTo:`${window.location.origin}/reset-password`});if(o)throw o;g(!0),c({title:"Reset link sent",description:"Please check your email for the password reset link."})}catch(o){let v=o instanceof Error?o.message:"Failed to send reset link";p(v),c({variant:"destructive",title:"Error",description:v})}finally{f(!1)}};return T?(0,e.jsxs)("div",{className:"text-center space-y-4",children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold tracking-tight",children:"Check your email"}),(0,e.jsxs)("p",{className:"text-muted-foreground",children:["We've sent a password reset link to ",l]}),(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsx)(s,{variant:"outline",className:"w-full",onClick:()=>g(!1),children:"Try another email"}),(0,e.jsx)(s,{variant:"outline",className:"w-full",onClick:()=>m("/login"),children:"Back to login"})]})]}):(0,e.jsxs)("form",{onSubmit:q,className:"space-y-4",children:[(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsx)(F,{htmlFor:"email",children:"Email"}),(0,e.jsx)(E,{id:"email",type:"email",placeholder:"Enter your email",value:l,onChange:d=>D(d.target.value),required:!0,disabled:a,className:"bg-background"}),(0,e.jsx)("p",{className:"text-sm text-muted-foreground",children:"Enter the email address you used to create your account and we'll send you a link to reset your password."})]}),u&&(0,e.jsx)(P,{variant:"destructive",children:(0,e.jsx)(B,{children:u})}),(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsxs)(s,{type:"submit",className:"w-full",disabled:a,children:[a&&(0,e.jsx)(A,{className:"mr-2 h-4 w-4 animate-spin"}),"Send reset link"]}),(0,e.jsx)(s,{type:"button",variant:"outline",className:"w-full",onClick:()=>m("/login"),disabled:a,children:"Back to login"})]})]})}var t=r(n(),1);function S(){return(0,t.jsx)("main",{className:"min-h-screen flex items-center justify-center p-4 bg-background",children:(0,t.jsxs)("div",{className:"w-full max-w-md",children:[(0,t.jsxs)("div",{className:"text-center mb-8",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold tracking-tight",children:"Reset Password"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-2",children:"Enter your email to reset your password"})]}),(0,t.jsxs)(h,{children:[(0,t.jsxs)(N,{children:[(0,t.jsx)(k,{children:"Forgot Password"}),(0,t.jsx)(C,{children:"We'll send you a link to reset your password"})]}),(0,t.jsx)(x,{children:(0,t.jsx)(L,{})})]})]})})}export{S as default};
