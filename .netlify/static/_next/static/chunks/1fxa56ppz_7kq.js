(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5766,e=>{"use strict";let t,r;var a,s=e.i(71645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,n=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?n(i,o):o+"{"+n(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=n(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o="-"==o[1]?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=n.p?n.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function m(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var o;let m=u(e),g=c[m]||(c[m]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(m));if(!c[g]){let t=m!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[g]=n(s?{["@keyframes "+g]:t}:t,r?"":"."+g)}let b=r&&c.g;return r&&(c.g=c[g]),o=c[g],b?t.data=t.data.replace(b,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),g})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":n(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(a.target),a.g,a.o,a.k)}m.bind({g:1});let g,b,p,x=m.bind({k:1});function h(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let d=Object.assign({},o),l=d.className||s.className;r.p=Object.assign({theme:b&&b()},d),r.o=/go\d/.test(l),d.className=m.apply(r,a)+(l?" "+l:""),t&&(d.ref=i);let n=e;return e[0]&&(n=d.as||e,delete d.as),p&&n[0]&&p(d),g(n,d)}return t?t(s):s}}var f=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),w="default",v=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return v(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},j=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},N={},$=(e,t=w)=>{N[t]=v(N[t]||k,e),j.forEach(([e,r])=>{e===t&&r(N[t])})},C=e=>Object.keys(N).forEach(t=>$(e,t)),S=(e=w)=>t=>{$(t,e)},E=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||y()}))(t,e,r);return S(s.toasterId||(a=s.id,Object.keys(N).find(e=>N[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},P=(e,t)=>E("blank")(e,t);P.error=E("error"),P.success=E("success"),P.loading=E("loading"),P.custom=E("custom"),P.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):C(r)},P.dismissAll=e=>P.dismiss(void 0,e),P.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):C(r)},P.removeAll=e=>P.remove(void 0,e),P.promise=(e,t,r)=>{let a=P.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?f(t.success,e):void 0;return s?P.success(s,{id:a,...r,...null==r?void 0:r.success}):P.dismiss(a),e}).catch(e=>{let s=t.error?f(t.error,e):void 0;s?P.error(s,{id:a,...r,...null==r?void 0:r.error}):P.dismiss(a)}),e};var D=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,A=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,U=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${U} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,O=h("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,F=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,T=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,z=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${T} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,M=h("div")`
  position: absolute;
`,B=h("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,_=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=h("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${_} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,W=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(q,null,t):t:"blank"===r?null:s.createElement(B,null,s.createElement(O,{...a}),"loading"!==r&&s.createElement(M,null,"error"===r?s.createElement(I,{...a}):s.createElement(z,{...a})))},R=h("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Y=h("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;s.memo(({toast:e,position:t,style:a,children:o})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,o]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},d=s.createElement(W,{toast:e}),l=s.createElement(Y,{...e.ariaProps},f(e.message,e));return s.createElement(R,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof o?o({icon:d,message:l}):s.createElement(s.Fragment,null,d,l))}),a=s.createElement,n.p=void 0,g=a,b=void 0,p=void 0,m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,P],5766)},18566,(e,t,r)=>{t.exports=e.r(76562)},76849,e=>{"use strict";var t=e.i(54716);e.s(["updatePassword",()=>t.an])},32545,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(91557);e.i(51718);var s=e.i(76849),o=e.i(54716),o=o,i=o,d=o;e.i(36180);var l=e.i(17689),n=e.i(63802),c=e.i(18566),u=e.i(5766);let m=e=>{let t=e.substring(0,3).toUpperCase(),r="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",a="";for(let e=0;e<6;e++)a+=r.charAt(Math.floor(Math.random()*r.length));let s=Date.now().toString().slice(-3);return`${t}${a}${s}`};e.s(["default",0,function(){let[e,g]=(0,r.useState)(null),[b,p]=(0,r.useState)(!0),[x,h]=(0,r.useState)(!1),[f,y]=(0,r.useState)(""),[w,v]=(0,r.useState)(""),[j,k]=(0,r.useState)(""),[N,$]=(0,r.useState)(""),[C,S]=(0,r.useState)(""),[E,P]=(0,r.useState)("white"),[D,A]=(0,r.useState)(!1),[U,I]=(0,r.useState)(""),[L,O]=(0,r.useState)(!1),[F,T]=(0,r.useState)(!1),[z,M]=(0,r.useState)(!1),B=(0,c.useRouter)(),_=e=>{switch(e){case"dark":return"#111827";case"skyblue":return"#93c5fd";case"gray":return"#e5e7eb";default:return"#f3f4f6"}};(0,r.useEffect)(()=>{let e=a.auth.currentUser;if(!e)return;let t=(0,l.doc)(a.db,"users",e.uid),r=(0,n.onSnapshot)(t,e=>{if(e.exists()){let t=e.data();t.background&&(P(t.background),document.documentElement.style.backgroundColor=_(t.background)),M(!0)}},e=>{console.error("Error listening to background changes:",e),M(!0)});return()=>r()},[]),(0,r.useEffect)(()=>{(async()=>{let e=a.auth.currentUser;if(!e)return B.push("/login");try{let t=await (0,n.getDoc)((0,l.doc)(a.db,"users",e.uid));if(t.exists()){let r=t.data(),s=r.userId;s||(s=m(e.email||"user"),await (0,n.setDoc)((0,l.doc)(a.db,"users",e.uid),{userId:s,updatedAt:new Date().toISOString()},{merge:!0})),g({uid:e.uid,email:e.email,name:r.name||"User",role:r.role||"user",userId:s}),I(s),r.background&&(P(r.background),document.documentElement.style.backgroundColor=_(r.background)),M(!0)}else{let t=m(e.email||"user");g({uid:e.uid,email:e.email,name:e.displayName||"User",role:"user",userId:t}),I(t),M(!0)}}catch(e){console.error("Error fetching user data:",e),u.default.error("Failed to load user data"),M(!0)}finally{p(!1)}})()},[B]);let q=async e=>{e.preventDefault(),$(""),S(""),h(!0);let t=a.auth.currentUser;if(!t){$("No user logged in"),h(!1);return}if(!f||!w||!j){$("Please fill in all password fields"),h(!1);return}if(w.length<6){$("New password must be at least 6 characters"),h(!1);return}if(w!==j){$("New passwords do not match"),h(!1);return}if(f===w){$("New password must be different from current password"),h(!1);return}try{let e=o.W.credential(t.email,f);await (0,i.a4)(t,e),await (0,s.updatePassword)(t,w);let r=(0,l.doc)(a.db,"users",t.uid);await (0,n.setDoc)(r,{passwordUpdatedAt:new Date().toISOString(),hasPasswordSet:!0,updatedAt:new Date().toISOString()},{merge:!0}),S("Password updated successfully!"),u.default.success("✅ Password changed successfully!"),y(""),v(""),k("")}catch(e){switch(console.error("Password update error:",e),e.code){case"auth/wrong-password":$("Current password is incorrect"),u.default.error("❌ Wrong password");break;case"auth/too-many-requests":$("Too many attempts. Please try again later."),u.default.error("⛔ Too many attempts");break;case"auth/requires-recent-login":$("Please log in again before changing your password"),u.default.error("⚠️ Please re-login");break;case"auth/weak-password":$("Password is too weak. Please use at least 6 characters with a mix of letters and numbers."),u.default.error("❌ Weak password");break;default:$("Failed to update password. Please try again."),u.default.error("❌ Password update failed")}}finally{h(!1)}},W=async e=>{if(e===E)return;P(e),document.documentElement.style.backgroundColor=_(e);let t=a.auth.currentUser;if(t)try{await (0,n.setDoc)((0,l.doc)(a.db,"users",t.uid),{background:e,updatedAt:new Date().toISOString()},{merge:!0}),u.default.success("Background updated successfully! It will apply to all pages.")}catch(r){console.error("Error updating background:",r),u.default.error("Failed to update background");let e=await (0,n.getDoc)((0,l.doc)(a.db,"users",t.uid));if(e.exists()){let t=e.data();t.background&&(P(t.background),document.documentElement.style.backgroundColor=_(t.background))}}},R=async()=>{T(!0);try{await (0,d.D)(a.auth),u.default.success("Logged out successfully"),B.push("/login")}catch(e){console.error("Logout error:",e),u.default.error("Failed to logout. Please try again.")}finally{T(!1),O(!1)}},Y=()=>{switch(E){case"dark":return"bg-gray-900 text-white";case"skyblue":return"bg-gradient-to-br from-blue-100 to-blue-300";case"gray":return"bg-gray-200";default:return"bg-gray-100"}},H=()=>{switch(E){case"dark":return"bg-gray-700 text-white border-gray-600 focus:ring-blue-400";case"skyblue":return"bg-white/90 border-blue-200 focus:ring-blue-500";case"gray":return"bg-white border-gray-300 focus:ring-gray-500";default:return"border-gray-300 focus:ring-green-500"}};return b||!z?(0,t.jsx)("div",{className:`min-h-screen flex items-center justify-center ${Y()}`,children:(0,t.jsx)("div",{className:"text-lg",children:"Loading..."})}):(0,t.jsxs)("div",{className:`min-h-screen py-8 px-4 transition-colors duration-300 ${Y()}`,children:[(0,t.jsx)("div",{className:"max-w-3xl mx-auto",children:(0,t.jsxs)("div",{className:`rounded-lg p-8 transition-colors duration-300 ${(()=>{switch(E){case"dark":return"bg-gray-800 text-white border-gray-700";case"skyblue":return"bg-white/80 backdrop-blur-sm";default:return"bg-white shadow-lg"}})()}`,children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-8",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold",children:"Settings"}),(0,t.jsx)("p",{className:`text-sm mt-1 ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"Manage your account settings and preferences"})]}),(0,t.jsx)("div",{className:`w-12 h-12 rounded-full flex items-center justify-center ${"dark"===E?"bg-gray-700":"bg-green-100"}`,children:(0,t.jsx)("span",{className:`text-xl font-semibold ${"dark"===E?"text-white":"text-green-600"}`,children:e?.name?.charAt(0).toUpperCase()||"U"})})]}),(0,t.jsx)("div",{className:`mb-8 p-4 rounded-lg ${"dark"===E?"bg-gray-700":"bg-gray-50"}`,children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`text-sm font-medium ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"Full Name"}),(0,t.jsx)("p",{className:`text-lg font-semibold ${"dark"===E?"text-white":"text-gray-800"}`,children:e?.name||"User"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`text-sm font-medium ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"Email Address"}),(0,t.jsx)("p",{className:`text-lg font-semibold ${"dark"===E?"text-white":"text-gray-800"}`,children:e?.email||"No email"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`text-sm font-medium ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"Role"}),(0,t.jsx)("p",{className:`text-lg font-semibold ${"dark"===E?"text-white":"text-gray-800"}`,children:e?.role||"User"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`text-sm font-medium ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"User ID"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-1",children:[(0,t.jsx)("p",{className:`text-lg font-bold ${"dark"===E?"text-blue-400":"text-blue-600"}`,children:U||"Not set"}),(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(U).then(()=>{A(!0),u.default.success("User ID copied to clipboard"),setTimeout(()=>A(!1),3e3)}).catch(()=>{u.default.error("Failed to copy")})},className:`px-3 py-1 rounded transition text-sm flex-shrink-0 ${D?"bg-green-500 text-white":"dark"===E?"bg-gray-600 hover:bg-gray-500 text-white":"bg-blue-500 hover:bg-blue-600 text-white"}`,title:"Copy User ID",children:D?"✓":"📋"})]})]})]})}),(0,t.jsxs)("div",{className:`mb-8 p-6 rounded-lg ${"dark"===E?"bg-gray-700":"bg-gray-50"}`,children:[(0,t.jsx)("h2",{className:`text-xl font-bold mb-4 ${"dark"===E?"text-white":"text-gray-800"}`,children:"Change Password"}),(0,t.jsxs)("div",{className:`mb-4 p-3 rounded-md text-sm ${"dark"===E?"bg-blue-900/30 border border-blue-700 text-blue-200":"bg-blue-50 border border-blue-200 text-blue-700"}`,children:[(0,t.jsx)("strong",{children:"ℹ️ Note:"})," Your password is securely stored in Db Authentication. After changing it, you can use the new password to login on both web and Flutter."]}),N&&(0,t.jsxs)("div",{className:`mb-4 p-3 rounded-md text-sm ${"dark"===E?"bg-red-900/50 border-red-700 text-red-200":"bg-red-50 border border-red-400 text-red-700"}`,children:[(0,t.jsx)("strong",{children:"Error:"})," ",N]}),C&&(0,t.jsxs)("div",{className:`mb-4 p-3 rounded-md text-sm ${"dark"===E?"bg-green-900/50 border-green-700 text-green-200":"bg-green-50 border border-green-400 text-green-700"}`,children:[(0,t.jsx)("strong",{children:"✅ Success:"})," ",C]}),(0,t.jsx)("form",{onSubmit:q,children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-2 ${"dark"===E?"text-gray-300":"text-gray-700"}`,children:"Current Password"}),(0,t.jsx)("input",{type:"password",value:f,onChange:e=>y(e.target.value),placeholder:"Enter your current password",className:`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${H()}`,required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-2 ${"dark"===E?"text-gray-300":"text-gray-700"}`,children:"New Password"}),(0,t.jsx)("input",{type:"password",value:w,onChange:e=>v(e.target.value),placeholder:"Enter new password (min 6 characters)",className:`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${H()}`,required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium mb-2 ${"dark"===E?"text-gray-300":"text-gray-700"}`,children:"Confirm New Password"}),(0,t.jsx)("input",{type:"password",value:j,onChange:e=>k(e.target.value),placeholder:"Confirm your new password",className:`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${H()}`,required:!0})]}),(0,t.jsx)("button",{type:"submit",disabled:x,className:"w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed",children:x?"🔄 Updating Password...":"🔐 Update Password"})]})})]}),(0,t.jsxs)("div",{className:`p-6 rounded-lg ${"dark"===E?"bg-gray-700":"bg-gray-50"}`,children:[(0,t.jsx)("h2",{className:`text-xl font-bold mb-4 ${"dark"===E?"text-white":"text-gray-800"}`,children:"Theme Preferences"}),(0,t.jsx)("p",{className:`text-sm mb-4 ${"dark"===E?"text-gray-400":"text-gray-500"}`,children:"Choose your preferred background color. This will apply to all pages."}),(0,t.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,t.jsxs)("button",{onClick:()=>W("white"),className:`p-4 rounded-lg border-2 transition-all ${"white"===E?"border-blue-500 shadow-lg scale-105":"border-gray-200 hover:border-gray-300"} bg-white`,children:[(0,t.jsx)("div",{className:"w-full h-12 bg-gray-100 rounded-md mb-2"}),(0,t.jsx)("p",{className:"text-sm font-medium text-gray-700",children:"Light"})]}),(0,t.jsxs)("button",{onClick:()=>W("gray"),className:`p-4 rounded-lg border-2 transition-all ${"gray"===E?"border-blue-500 shadow-lg scale-105":"border-gray-200 hover:border-gray-300"} bg-gray-200`,children:[(0,t.jsx)("div",{className:"w-full h-12 bg-gray-300 rounded-md mb-2"}),(0,t.jsx)("p",{className:"text-sm font-medium text-gray-700",children:"Gray"})]}),(0,t.jsxs)("button",{onClick:()=>W("skyblue"),className:`p-4 rounded-lg border-2 transition-all ${"skyblue"===E?"border-blue-500 shadow-lg scale-105":"border-gray-200 hover:border-gray-300"} bg-gradient-to-br from-blue-100 to-blue-300`,children:[(0,t.jsx)("div",{className:"w-full h-12 bg-gradient-to-br from-blue-200 to-blue-400 rounded-md mb-2"}),(0,t.jsx)("p",{className:"text-sm font-medium text-gray-700",children:"Sky Blue"})]}),(0,t.jsxs)("button",{onClick:()=>W("dark"),className:`p-4 rounded-lg border-2 transition-all ${"dark"===E?"border-blue-500 shadow-lg scale-105":"border-gray-200 hover:border-gray-300"} bg-gray-900`,children:[(0,t.jsx)("div",{className:"w-full h-12 bg-gray-800 rounded-md mb-2"}),(0,t.jsx)("p",{className:"text-sm font-medium text-white",children:"Dark"})]})]}),(0,t.jsx)("div",{className:"mt-4 p-3 rounded-md bg-blue-50 border border-blue-200",children:(0,t.jsx)("p",{className:"text-xs text-blue-700",children:"💡 Your theme preference is saved in the database and will be applied to all pages automatically."})})]}),(0,t.jsx)("div",{className:"mt-8 pt-6 border-t border-gray-200",children:(0,t.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,t.jsx)("button",{onClick:()=>B.push("/dashboard"),className:"text-green-600 hover:text-green-800 font-medium transition",children:"← Back to Dashboard"}),(0,t.jsxs)("button",{onClick:()=>O(!0),className:"px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center gap-2",children:[(0,t.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})}),"Logout"]})]})})]})}),L&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Confirm Logout"}),(0,t.jsx)("button",{onClick:()=>O(!1),className:"text-gray-400 hover:text-gray-600",children:(0,t.jsx)("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]}),(0,t.jsx)("div",{className:"mb-6",children:(0,t.jsx)("p",{className:"text-gray-600",children:"Are you sure you want to logout? You will be redirected to the login page."})}),(0,t.jsxs)("div",{className:"flex justify-end space-x-3",children:[(0,t.jsx)("button",{onClick:()=>O(!1),className:"px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition",children:"Cancel"}),(0,t.jsx)("button",{onClick:R,disabled:F,className:"px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50",children:F?"Logging out...":"Yes, Logout"})]})]})})]})}],32545)}]);