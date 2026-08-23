(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var a in r)Object.defineProperty(s,a,{enumerable:!0,get:r[a]});let n=e.r(90809)._(e.r(98183)),i=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:s}=e,r=e.protocol||"",a=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:s&&(c=t+(~s.indexOf(":")?`[${s}]`:s),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||i.test(r))&&!1!==c?(c="//"+(c||""),a&&"/"!==a[0]&&(a="/"+a)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),a=a.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${a}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},18581,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"useMergedRef",{enumerable:!0,get:function(){return a}});let r=e.r(71645);function a(e,t){let s=(0,r.useRef)(null),a=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=s.current;e&&(s.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(s.current=n(e,r)),t&&(a.current=n(t,r))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let s=e(t);return"function"==typeof s?s:()=>e(null)}}("function"==typeof s.default||"object"==typeof s.default&&null!==s.default)&&void 0===s.default.__esModule&&(Object.defineProperty(s.default,"__esModule",{value:!0}),Object.assign(s.default,s),t.exports=s.default)},73668,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(18967),a=e.r(52817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),s=new URL(e,t);return s.origin===t&&(0,a.hasBasePath)(s.pathname)}catch(e){return!1}}},84508,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0}),Object.defineProperty(s,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},22016,(e,t,s)=>{"use strict";Object.defineProperty(s,"__esModule",{value:!0});var r={default:function(){return y},useLinkStatus:function(){return b}};for(var a in r)Object.defineProperty(s,a,{enumerable:!0,get:r[a]});let n=e.r(90809),i=e.r(43476),o=n._(e.r(71645)),l=e.r(95057),c=e.r(8372),d=e.r(18581),u=e.r(18967),f=e.r(5550);e.r(33525);let m=e.r(88540),p=e.r(91949),x=e.r(73668),h=e.r(9396);function y(t){var s,r;let a,n,y,[b,v]=(0,o.useOptimistic)(p.IDLE_LINK_STATUS),j=(0,o.useRef)(null),{href:N,as:w,children:O,prefetch:M=null,passHref:T,replace:_,shallow:k,scroll:E,onClick:$,onMouseEnter:S,onTouchStart:P,legacyBehavior:A=!1,onNavigate:C,transitionTypes:D,ref:L,unstable_dynamicOnHover:R,...U}=t;a=O,A&&("string"==typeof a||"number"==typeof a)&&(a=(0,i.jsx)("a",{children:a}));let I=o.default.useContext(c.AppRouterContext),F=!1!==M,z=!1!==M?null===(r=M)||"auto"===r?h.FetchStrategy.PPR:h.FetchStrategy.Full:h.FetchStrategy.PPR,B="string"==typeof(s=w||N)?s:(0,l.formatUrl)(s);if(A){if(a?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=o.default.Children.only(a)}let H=A?n&&"object"==typeof n&&n.ref:L,K=o.default.useCallback(e=>(null!==I&&(j.current=(0,p.mountLinkInstance)(e,B,I,z,F,v)),()=>{j.current&&((0,p.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,p.unmountPrefetchableInstance)(e)}),[F,B,I,z,v]),W={ref:(0,d.useMergedRef)(K,H),onClick(t){A||"function"!=typeof $||$(t),A&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!I||t.defaultPrevented||function(t,s,r,a,n,i,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,x.isLocalURL)(s)){a&&(t.preventDefault(),location.replace(s));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(99781);o.default.startTransition(()=>{u(s,a?"replace":"push",!1===n?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,r.current,l)})}}(t,B,j,_,E,C,D)},onMouseEnter(e){A||"function"!=typeof S||S(e),A&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),I&&F&&(0,p.onNavigationIntent)(e.currentTarget,!0===R)},onTouchStart:function(e){A||"function"!=typeof P||P(e),A&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),I&&F&&(0,p.onNavigationIntent)(e.currentTarget,!0===R)}};return(0,u.isAbsoluteUrl)(B)?W.href=B:A&&!T&&("a"!==n.type||"href"in n.props)||(W.href=(0,f.addBasePath)(B)),y=A?o.default.cloneElement(n,W):(0,i.jsx)("a",{...U,...W,children:a}),(0,i.jsx)(g.Provider,{value:b,children:y})}e.r(84508);let g=(0,o.createContext)(p.IDLE_LINK_STATUS),b=()=>(0,o.useContext)(g);("function"==typeof s.default||"object"==typeof s.default&&null!==s.default)&&void 0===s.default.__esModule&&(Object.defineProperty(s.default,"__esModule",{value:!0}),Object.assign(s.default,s),t.exports=s.default)},5766,e=>{"use strict";let t,s;var r,a=e.i(71645);let n={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let s="",r="",a="";for(let n in e){let i=e[n];"@"==n[0]?"i"==n[1]?s=n+" "+i+";":r+="f"==n[1]?c(i,n):n+"{"+c(i,"k"==n[1]?"":t)+"}":"object"==typeof i?r+=c(i,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=i&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(n,i):n+":"+i+";")}return s+(t&&a?t+"{"+a+"}":a)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function f(e){let t,s,r=this||{},a=e.call?e(r.p):e;return((e,t,s,r,a)=>{var n;let f=u(e),m=d[f]||(d[f]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(f));if(!d[m]){let t=f!==e?e:(e=>{let t,s,r=[{}];for(;t=i.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(s=t[3].replace(l," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);d[m]=c(a?{["@keyframes "+m]:t}:t,s?"":"."+m)}let p=s&&d.g;return s&&(d.g=d[m]),n=d[m],p?t.data=t.data.replace(p,n):-1===t.data.indexOf(n)&&(t.data=r?n+t.data:t.data+n),m})(a.unshift?a.raw?(t=[].slice.call(arguments,1),s=r.p,a.reduce((e,r,a)=>{let n=t[a];if(n&&n.call){let e=n(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==n?"":n)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}f.bind({g:1});let m,p,x,h=f.bind({k:1});function y(e,t){let s=this||{};return function(){let r=arguments;function a(n,i){let o=Object.assign({},n),l=o.className||a.className;s.p=Object.assign({theme:p&&p()},o),s.o=/go\d/.test(l),o.className=f.apply(s,r)+(l?" "+l:""),t&&(o.ref=i);let c=e;return e[0]&&(c=o.as||e,delete o.as),x&&c[0]&&x(o),m(c,o)}return t?t(a):a}}var g=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v="default",j=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},N=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},O={},M=(e,t=v)=>{O[t]=j(O[t]||w,e),N.forEach(([e,s])=>{e===t&&s(O[t])})},T=e=>Object.keys(O).forEach(t=>M(e,t)),_=(e=v)=>t=>{M(t,e)},k=e=>(t,s)=>{let r,a=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||b()}))(t,e,s);return _(a.toasterId||(r=a.id,Object.keys(O).find(e=>O[e].toasts.some(e=>e.id===r))))({type:2,toast:a}),a.id},E=(e,t)=>k("blank")(e,t);E.error=k("error"),E.success=k("success"),E.loading=k("loading"),E.custom=k("custom"),E.dismiss=(e,t)=>{let s={type:3,toastId:e};t?_(t)(s):T(s)},E.dismissAll=e=>E.dismiss(void 0,e),E.remove=(e,t)=>{let s={type:4,toastId:e};t?_(t)(s):T(s)},E.removeAll=e=>E.remove(void 0,e),E.promise=(e,t,s)=>{let r=E.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?g(t.success,e):void 0;return a?E.success(a,{id:r,...s,...null==s?void 0:s.success}):E.dismiss(r),e}).catch(e=>{let a=t.error?g(t.error,e):void 0;a?E.error(a,{id:r,...s,...null==s?void 0:s.error}):E.dismiss(r)}),e};var $=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,S=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,A=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${S} 0.15s ease-out forwards;
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
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,C=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,D=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${C} 1s linear infinite;
`,L=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,R=h`
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
}`,U=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${R} 0.2s ease-out forwards;
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
`,I=y("div")`
  position: absolute;
`,F=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,z=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,H=({toast:e})=>{let{icon:t,type:s,iconTheme:r}=e;return void 0!==t?"string"==typeof t?a.createElement(B,null,t):t:"blank"===s?null:a.createElement(F,null,a.createElement(D,{...r}),"loading"!==s&&a.createElement(I,null,"error"===s?a.createElement(A,{...r}):a.createElement(U,{...r})))},K=y("div")`
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
`,W=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;a.memo(({toast:e,position:t,style:r,children:n})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,n]=(()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=a.createElement(H,{toast:e}),l=a.createElement(W,{...e.ariaProps},g(e.message,e));return a.createElement(K,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof n?n({icon:o,message:l}):a.createElement(a.Fragment,null,o,l))}),r=a.createElement,c.p=void 0,m=r,p=void 0,x=void 0,f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,E],5766)},18566,(e,t,s)=>{t.exports=e.r(76562)},66238,e=>{"use strict";var t=e.i(43476),s=e.i(71645),r=e.i(18566),a=e.i(22016),n=e.i(91557);e.i(36180);var i=e.i(17689),o=e.i(63802),l=e.i(5766);e.s(["default",0,function({params:e}){let c=(0,r.useRouter)(),[d,u]=(0,s.useState)(!0),[f,m]=(0,s.useState)(null),[p,x]=(0,s.useState)({today:{online:0,offline:0,totalOnlineMinutes:0,totalOfflineMinutes:0},week:{online:0,offline:0,totalOnlineMinutes:0,totalOfflineMinutes:0},month:{online:0,offline:0,totalOnlineMinutes:0,totalOfflineMinutes:0}});(0,s.useEffect)(()=>{h()},[e.id]);let h=async()=>{try{let t=(0,i.doc)(n.db,"drivers",e.id),s=await (0,o.getDoc)(t);if(s.exists()){let e=s.data();m(e);let t=e.onlineHistory||[],r=e.offlineHistory||[];[...t.map(e=>({...e,status:"online"})),...r.map(e=>({...e,status:"offline"}))].sort((e,t)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime());let a=t.reduce((e,t)=>e+(t.duration||0),0),n=r.reduce((e,t)=>e+(t.duration||0),0),i={online:t.length,offline:r.length,totalOnlineMinutes:a,totalOfflineMinutes:n};x({today:i,week:{online:0,offline:0,totalOnlineMinutes:0,totalOfflineMinutes:0},month:{online:0,offline:0,totalOnlineMinutes:0,totalOfflineMinutes:0}})}else l.default.error("Driver not found"),c.push("/drivers")}catch(e){console.error("Error fetching driver activity:",e),l.default.error("Failed to load driver activity")}finally{u(!1)}},y=e=>{if(e<60)return`${e}m`;let t=Math.floor(e/60);return`${t}h ${e%60}m`};return d?(0,t.jsx)("div",{className:"flex items-center justify-center min-h-[60vh]",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"})}):(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Driver Activity"}),(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:[f?.name," - Online/Offline Activity Tracking"]})]}),(0,t.jsxs)("div",{className:"flex space-x-3",children:[(0,t.jsxs)(a.default,{href:`/drivers/edit/${e.id}`,className:"text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1",children:[(0,t.jsx)("span",{children:"✏️"}),(0,t.jsx)("span",{children:"Edit Driver"})]}),(0,t.jsxs)(a.default,{href:"/drivers",className:"text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1",children:[(0,t.jsx)("span",{children:"←"}),(0,t.jsx)("span",{children:"Back to Drivers"})]})]})]}),(0,t.jsx)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)("div",{className:`w-4 h-4 rounded-full ${f?.isOnline?"bg-green-500 animate-pulse":"bg-gray-400"}`}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-lg font-semibold",children:f?.isOnline?"🟢 Online":"⚪ Offline"}),(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["Status: ",f?.status||"Unknown"]})]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Last Update"}),(0,t.jsx)("p",{className:"text-sm font-medium",children:f?.lastUpdate?new Date(f.lastUpdate).toLocaleString():"Never"})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsx)("h3",{className:"text-sm font-medium text-gray-500 mb-4",children:"Today"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"🟢 Online"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-green-600",children:[p.today.online," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"⚪ Offline"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-red-600",children:[p.today.offline," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between border-t pt-2",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Online"}),(0,t.jsx)("span",{className:"text-sm font-bold text-green-600",children:y(p.today.totalOnlineMinutes)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Offline"}),(0,t.jsx)("span",{className:"text-sm font-bold text-red-600",children:y(p.today.totalOfflineMinutes)})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsx)("h3",{className:"text-sm font-medium text-gray-500 mb-4",children:"This Week"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"🟢 Online"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-green-600",children:[p.week.online," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"⚪ Offline"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-red-600",children:[p.week.offline," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between border-t pt-2",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Online"}),(0,t.jsx)("span",{className:"text-sm font-bold text-green-600",children:y(p.week.totalOnlineMinutes)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Offline"}),(0,t.jsx)("span",{className:"text-sm font-bold text-red-600",children:y(p.week.totalOfflineMinutes)})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,t.jsx)("h3",{className:"text-sm font-medium text-gray-500 mb-4",children:"This Month"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"🟢 Online"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-green-600",children:[p.month.online," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"⚪ Offline"}),(0,t.jsxs)("span",{className:"text-sm font-medium text-red-600",children:[p.month.offline," times"]})]}),(0,t.jsxs)("div",{className:"flex justify-between border-t pt-2",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Online"}),(0,t.jsx)("span",{className:"text-sm font-bold text-green-600",children:y(p.month.totalOnlineMinutes)})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Total Offline"}),(0,t.jsx)("span",{className:"text-sm font-bold text-red-600",children:y(p.month.totalOfflineMinutes)})]})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100",children:[(0,t.jsxs)("div",{className:"p-6 border-b border-gray-200",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold text-gray-900",children:"Detailed Activity History"}),(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"All online/offline events in chronological order"})]}),(0,t.jsx)("div",{className:"p-6",children:(0,t.jsxs)("div",{className:"max-h-96 overflow-y-auto",children:[[...f?.onlineHistory||[],...f?.offlineHistory||[]].sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime()).slice(0,50).map((e,s)=>(0,t.jsxs)("div",{className:"flex items-center justify-between py-3 border-b border-gray-100",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("span",{className:"online"===e.status?"text-green-500":"text-red-500",children:"online"===e.status?"🟢":"⚪"}),(0,t.jsx)("span",{className:"text-sm font-medium",children:"online"===e.status?"Went Online":"Went Offline"})]}),(0,t.jsxs)("div",{className:"text-sm text-gray-500",children:[e.date," at ",e.time]})]},s)),(!f?.onlineHistory||0===f.onlineHistory.length)&&(!f?.offlineHistory||0===f.offlineHistory.length)&&(0,t.jsx)("p",{className:"text-center text-gray-500 py-8",children:"No activity recorded yet"})]})})]}),(0,t.jsxs)("div",{className:"flex justify-end space-x-3",children:[(0,t.jsx)(a.default,{href:`/drivers/edit/${e.id}`,className:"px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition",children:"Edit Driver"}),(0,t.jsx)(a.default,{href:"/drivers",className:"px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition",children:"Back to List"})]})]})}])}]);