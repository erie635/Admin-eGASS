(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let i=e.r(90809)._(e.r(98183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:r}=e,a=e.protocol||"",n=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||s.test(a))&&!1!==c?(c="//"+(c||""),n&&"/"!==n[0]&&(n="/"+n)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),n=n.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${a}${c}${n}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return n}});let a=e.r(71645);function n(e,t){let r=(0,a.useRef)(null),n=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=n.current;t&&(n.current=null,t())}else e&&(r.current=i(e,a)),t&&(n.current=i(t,a))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let a=e.r(18967),n=e.r(52817);function i(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,n.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return x},useLinkStatus:function(){return b}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let i=e.r(90809),s=e.r(43476),o=i._(e.r(71645)),l=e.r(95057),c=e.r(8372),d=e.r(18581),u=e.r(18967),p=e.r(5550);e.r(33525);let f=e.r(88540),m=e.r(91949),h=e.r(73668),g=e.r(9396);function x(t){var r,a;let n,i,x,[b,v]=(0,o.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,o.useRef)(null),{href:j,as:S,children:N,prefetch:$=null,passHref:k,replace:T,shallow:D,scroll:O,onClick:P,onMouseEnter:_,onTouchStart:E,legacyBehavior:C=!1,onNavigate:A,transitionTypes:L,ref:M,unstable_dynamicOnHover:F,...I}=t;n=N,C&&("string"==typeof n||"number"==typeof n)&&(n=(0,s.jsx)("a",{children:n}));let R=o.default.useContext(c.AppRouterContext),U=!1!==$,K=!1!==$?null===(a=$)||"auto"===a?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,z="string"==typeof(r=S||j)?r:(0,l.formatUrl)(r);if(C){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(n)}let B=C?i&&"object"==typeof i&&i.ref:M,V=o.default.useCallback(e=>(null!==R&&(w.current=(0,m.mountLinkInstance)(e,z,R,K,U,v)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,z,R,K,v]),H={ref:(0,d.useMergedRef)(V,B),onClick(t){C||"function"!=typeof P||P(t),C&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!R||t.defaultPrevented||function(t,r,a,n,i,s,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){n&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(99781);o.default.startTransition(()=>{u(r,n?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,a.current,l)})}}(t,z,w,T,O,A,L)},onMouseEnter(e){C||"function"!=typeof _||_(e),C&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),R&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===F)},onTouchStart:function(e){C||"function"!=typeof E||E(e),C&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),R&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===F)}};return(0,u.isAbsoluteUrl)(z)?H.href=z:C&&!k&&("a"!==i.type||"href"in i.props)||(H.href=(0,p.addBasePath)(z)),x=C?o.default.cloneElement(i,H):(0,s.jsx)("a",{...I,...H,children:n}),(0,s.jsx)(y.Provider,{value:b,children:x})}e.r(84508);let y=(0,o.createContext)(m.IDLE_LINK_STATUS),b=()=>(0,o.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},5766,e=>{"use strict";let t,r;var a,n=e.i(71645);let i={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",a="",n="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+s+";":a+="f"==i[1]?c(s,i):i+"{"+c(s,"k"==i[1]?"":t)+"}":"object"==typeof s?a+=c(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=c.p?c.p(i,s):i+":"+s+";")}return r+(t&&n?t+"{"+n+"}":n)+a},d={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},n=e.call?e(a.p):e;return((e,t,r,a,n)=>{var i;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=s.exec(e.replace(o,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[f]=c(n?{["@keyframes "+f]:t}:t,r?"":"."+f)}let m=r&&d.g;return r&&(d.g=d[f]),i=d[f],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),f})(n.unshift?n.raw?(t=[].slice.call(arguments,1),r=a.p,n.reduce((e,a,n)=>{let i=t[n];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):n.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):n,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}p.bind({g:1});let f,m,h,g=p.bind({k:1});function x(e,t){let r=this||{};return function(){let a=arguments;function n(i,s){let o=Object.assign({},i),l=o.className||n.className;r.p=Object.assign({theme:m&&m()},o),r.o=/go\d/.test(l),o.className=p.apply(r,a)+(l?" "+l:""),t&&(o.ref=s);let c=e;return e[0]&&(c=o.as||e,delete o.as),h&&c[0]&&h(o),f(c,o)}return t?t(n):n}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(e=>e.id===n||void 0===n?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],S={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},N={},$=(e,t=v)=>{N[t]=w(N[t]||S,e),j.forEach(([e,r])=>{e===t&&r(N[t])})},k=e=>Object.keys(N).forEach(t=>$(e,t)),T=(e=v)=>t=>{$(t,e)},D=e=>(t,r)=>{let a,n=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return T(n.toasterId||(a=n.id,Object.keys(N).find(e=>N[e].toasts.some(e=>e.id===a))))({type:2,toast:n}),n.id},O=(e,t)=>D("blank")(e,t);O.error=D("error"),O.success=D("success"),O.loading=D("loading"),O.custom=D("custom"),O.dismiss=(e,t)=>{let r={type:3,toastId:e};t?T(t)(r):k(r)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let r={type:4,toastId:e};t?T(t)(r):k(r)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,r)=>{let a=O.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let n=t.success?y(t.success,e):void 0;return n?O.success(n,{id:a,...r,...null==r?void 0:r.success}):O.dismiss(a),e}).catch(e=>{let n=t.error?y(t.error,e):void 0;n?O.error(n,{id:a,...r,...null==r?void 0:r.error}):O.dismiss(a)}),e};var P=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,_=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,E=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,C=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${_} 0.15s ease-out forwards;
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
    animation: ${E} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,A=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${A} 1s linear infinite;
`,M=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=g`
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
}`,I=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
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
`,R=x("div")`
  position: absolute;
`,U=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,K=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${K} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,B=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?n.createElement(z,null,t):t:"blank"===r?null:n.createElement(U,null,n.createElement(L,{...a}),"loading"!==r&&n.createElement(R,null,"error"===r?n.createElement(C,{...a}):n.createElement(I,{...a})))},V=x("div")`
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
`,H=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;n.memo(({toast:e,position:t,style:a,children:i})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[n,i]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=n.createElement(B,{toast:e}),l=n.createElement(H,{...e.ariaProps},y(e.message,e));return n.createElement(V,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof i?i({icon:o,message:l}):n.createElement(n.Fragment,null,o,l))}),a=n.createElement,c.p=void 0,f=a,m=void 0,h=void 0,p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,O],5766)},28719,e=>{"use strict";var t=e.i(35506);e.s(["collection",()=>t.aR])},21241,e=>{"use strict";var t=e.i(35506);e.s(["serverTimestamp",()=>t.b4])},51243,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(91557);e.i(36180);var n=e.i(28719),i=e.i(63802),s=e.i(17689),o=e.i(21241),l=e.i(22016),c=e.i(5766);e.s(["default",0,function(){let[e,d]=(0,r.useState)([]),[u,p]=(0,r.useState)(!0),[f,m]=(0,r.useState)(""),[h,g]=(0,r.useState)(!1),[x,y]=(0,r.useState)("white");(0,r.useEffect)(()=>{(async()=>{let e=a.auth.currentUser;if(e)try{let t=await (0,i.getDoc)((0,s.doc)(a.db,"users",e.uid));if(t.exists()){let e=t.data();e.background&&y(e.background)}}catch(e){console.error("Error fetching user background:",e)}})()},[]);let b=()=>{switch(x){case"dark":return"bg-gray-900 text-white";case"skyblue":return"bg-gradient-to-br from-blue-100 to-blue-300";case"gray":return"bg-gray-200";default:return"bg-gray-100"}},v=e=>null==e||0===e?"0L":`${e.toFixed(2)}L`,w=async e=>{try{let t=new Date().toISOString().split("T")[0],r=`${e.id}_${t}`,n=(0,s.doc)(a.db,"driverDailyActivity",r),l=e.isOnline??!1,c={driverId:e.id,driverName:e.name||"Unknown",numberPlate:e.numberPlate||"",date:t,lastUpdated:(0,o.serverTimestamp)(),isOnline:l,status:e.status||"unknown"};if(l)e.onlineSince||(c.onlineStart=(0,o.serverTimestamp)(),c.totalMinutes=0,c.totalHours=0),c.lastOnlineTime=(0,o.serverTimestamp)(),c.offlineStart=null,c.lastOfflineTime=null;else if(e.offlineSince||(c.offlineStart=(0,o.serverTimestamp)()),c.lastOfflineTime=(0,o.serverTimestamp)(),c.onlineStart=null,c.lastOnlineTime=null,e.onlineSince){let t=e.onlineSince instanceof Date?e.onlineSince:new Date(e.onlineSince),r=new Date().getTime()-t.getTime(),a=Math.floor(r/6e4),n=Math.floor(a/60),i=a%60;c.totalMinutes=a,c.totalHours=n,c.totalMinutesDisplay=i,c.lastOnlineTime=(0,o.serverTimestamp)()}await (0,i.setDoc)(n,c,{merge:!0});let d=(0,s.doc)(a.db,"drivers",e.id);await (0,i.updateDoc)(d,{dailyActivityId:r,todayStartTime:l?(0,o.serverTimestamp)():null,lastStatusChange:(0,o.serverTimestamp)()})}catch(e){console.error("Error updating daily activity:",e)}};(0,r.useEffect)(()=>{let e=(0,i.onSnapshot)((0,n.collection)(a.db,"drivers"),async e=>{try{let t=e.docs.map(e=>{let t=e.data();return{id:e.id,...t,lastSeen:t.lastSeen?.toDate?.()||t.lastSeen||null,onlineSince:t.onlineSince?.toDate?.()||t.onlineSince||null,offlineSince:t.offlineSince?.toDate?.()||t.offlineSince||null,lastStatusChange:t.lastStatusChange?.toDate?.()||t.lastStatusChange||null,todayStartTime:t.todayStartTime?.toDate?.()||t.todayStartTime||null,isOnline:t.isOnline??!1,remainingFuel:t.remainingFuel||{}}}),r=t.map(e=>{let{duration:t,statusTime:r,todayHours:a}=(e=>{let t=new Date,r="",a="",n="";if(e.onlineSince){let r=e.onlineSince instanceof Date?e.onlineSince:new Date(e.onlineSince),a=t.getTime()-r.getTime(),i=Math.floor(a/36e5),s=Math.floor(a%36e5/6e4);n=`${i}h ${s}m`}else n=void 0!==e.todayTotalHours?`${e.todayTotalHours}h ${e.todayTotalMinutes||0}m`:"0h 0m";if(e.isOnline&&e.onlineSince){let n=e.onlineSince instanceof Date?e.onlineSince:new Date(e.onlineSince),i=t.getTime()-n.getTime(),s=Math.floor(i/36e5),o=Math.floor(i%36e5/6e4);r=`${s>0?s+"h ":""}${o}m online`,a=`Since ${n.toLocaleTimeString()}`}else if(!e.isOnline&&e.offlineSince){let n=e.offlineSince instanceof Date?e.offlineSince:new Date(e.offlineSince),i=t.getTime()-n.getTime(),s=Math.floor(i/36e5),o=Math.floor(i%36e5/6e4);r=`${s>0?s+"h ":""}${o}m offline`,a=`Since ${n.toLocaleTimeString()}`}else if(e.lastSeen){let n=e.lastSeen instanceof Date?e.lastSeen:new Date(e.lastSeen),i=Math.floor((t.getTime()-n.getTime())/6e4);r=`Last seen ${i}m ago`,a=`At ${n.toLocaleTimeString()}`}else r="Status unknown",a="No timestamp";return{duration:r,statusTime:a,todayHours:n}})(e);return{...e,duration:t,statusTime:r,todayHours:a}});d(r),p(!1),g(!0),t.length>0&&Promise.all(t.map(e=>w(e))).catch(e=>console.error("Error updating daily activities:",e))}catch(e){console.error("Error processing drivers:",e),c.default.error("Failed to load drivers"),p(!1)}},e=>{console.error("Error fetching drivers:",e),c.default.error("Failed to load drivers"),p(!1)});return()=>e()},[]);let j=async(e,t)=>{if(confirm(`Are you sure you want to delete "${t}"?`))try{await (0,i.deleteDoc)((0,s.doc)(a.db,"drivers",e)),c.default.success("Driver deleted successfully")}catch(e){console.error("Error deleting driver:",e),c.default.error("Failed to delete driver")}},S=e.filter(e=>e.name?.toLowerCase().includes(f.toLowerCase())||e.email?.toLowerCase().includes(f.toLowerCase())||e.phone?.includes(f)||e.numberPlate?.toLowerCase().includes(f.toLowerCase()));return u?(0,t.jsx)("div",{className:`min-h-screen flex items-center justify-center ${b()}`,children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"})}):(0,t.jsx)("div",{className:`min-h-screen p-4 md:p-6 transition-colors duration-300 ${b()}`,children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Drivers"}),(0,t.jsx)("p",{className:`text-sm mt-1 ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:"Manage all drivers in the system"})]}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:(0,t.jsxs)(l.default,{href:"/drivers/add",className:"bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2",children:[(0,t.jsx)("span",{children:"+"}),(0,t.jsx)("span",{children:"Add Driver"})]})})]}),(0,t.jsx)("div",{className:"rounded-xl shadow-sm p-4 border bg-cyan-700 border-gray-200",children:(0,t.jsx)("input",{type:"text",placeholder:"Search drivers by name, email, phone or plate number...",value:f,onChange:e=>m(e.target.value),className:"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-200 border-gray-300"})}),(0,t.jsxs)("div",{className:`rounded-xl shadow-sm border ${"dark"===x?"border-gray-700":"border-gray-100"} ${(()=>{switch(x){case"dark":return"bg-gray-800/95 border-gray-700";case"skyblue":return"bg-white/90 backdrop-blur-sm shadow-lg";default:return"bg-white shadow-lg"}})()}`,children:[(0,t.jsxs)("div",{className:`p-6 border-b ${"dark"===x?"border-gray-700":"border-gray-200"} flex justify-between items-center`,children:[(0,t.jsx)("h2",{className:`text-lg font-semibold ${"dark"===x?"text-white":"text-gray-900"}`,children:"All Drivers"}),(0,t.jsxs)("span",{className:`text-sm ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:[S.length," drivers"]})]}),(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full",children:[(0,t.jsx)("thead",{className:"bg-red-900",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Name"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Email"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Phone"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Vehicle"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Fuel"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Status"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Actions"})]})}),(0,t.jsx)("tbody",{className:`divide-y ${"dark"===x?"divide-gray-700":"divide-gray-200"}`,children:0===S.length?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:7,className:`px-6 py-8 text-center ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:f?"No drivers match your search":'No drivers found. Click "Add Driver" to create one.'})}):S.map(e=>(0,t.jsxs)("tr",{className:"dark"===x?"hover:bg-gray-800/50":"hover:bg-gray-50",children:[(0,t.jsx)("td",{className:"px-6 py-4 whitespace-nowrap",children:(0,t.jsxs)("div",{className:"flex items-center",children:[(0,t.jsx)("div",{className:"w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm",children:e.name?.charAt(0)||"?"}),(0,t.jsxs)("div",{className:"ml-3",children:[(0,t.jsx)("div",{className:`text-sm font-medium ${"dark"===x?"text-white":"text-gray-900"}`,children:e.name||"N/A"}),(0,t.jsx)("div",{className:`text-xs ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:e.numberPlate||"No plate"})]})]})}),(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-gray-300":"text-gray-500"}`,children:e.email||"N/A"}),(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-gray-300":"text-gray-500"}`,children:e.phone||"N/A"}),(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-gray-300":"text-gray-500"}`,children:e.vehicleType||"N/A"}),(0,t.jsx)("td",{className:"px-6 py-4 whitespace-nowrap",children:(0,t.jsxs)("div",{className:"flex flex-col space-y-0.5",children:[e.remainingFuel?.Petrol!==void 0&&(0,t.jsxs)("span",{className:"text-xs font-medium text-blue-600",children:["⛽"," ",v(e.remainingFuel.Petrol)," ","Petrol"]}),e.remainingFuel?.Diesel!==void 0&&(0,t.jsxs)("span",{className:"text-xs font-medium text-green-600",children:["⛽"," ",v(e.remainingFuel.Diesel)," ","Diesel"]}),e.remainingFuel?.["V-Power"]!==void 0&&(0,t.jsxs)("span",{className:"text-xs font-medium text-purple-600",children:["⛽"," ",v(e.remainingFuel["V-Power"])," ","V-Power"]}),e.remainingFuel?.Kerosene!==void 0&&(0,t.jsxs)("span",{className:"text-xs font-medium text-orange-600",children:["⛽"," ",v(e.remainingFuel.Kerosene)," ","Kerosene"]}),!e.remainingFuel?.Petrol&&!e.remainingFuel?.Diesel&&!e.remainingFuel?.["V-Power"]&&!e.remainingFuel?.Kerosene&&(0,t.jsx)("span",{className:"text-xs text-gray-400",children:"No fuel data"})]})}),(0,t.jsxs)("td",{className:"px-6 py-4 whitespace-nowrap",children:[(0,t.jsx)("span",{className:`px-2 py-1 text-xs font-semibold rounded-full ${e.isOnline?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}`,children:e.isOnline?"🟢 Active":"⚪ Inactive"}),e.status&&(0,t.jsx)("span",{className:`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${"available"===e.status?"bg-blue-100 text-blue-800":"busy"===e.status?"bg-red-100 text-red-800":"on_break"===e.status?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"}`,children:e.status.replace("_"," ")})]}),(0,t.jsxs)("td",{className:"px-6 py-4 whitespace-nowrap text-sm",children:[(0,t.jsx)(l.default,{href:`/drivers/edit/${e.id}`,className:"text-blue-600 hover:text-blue-800 mr-3 font-medium",children:"Edit"}),(0,t.jsx)("button",{onClick:()=>j(e.id,e.name||"Driver"),className:"text-red-600 hover:text-red-800 font-medium",children:"Delete"})]})]},e.id))})]})})]})]})})}])}]);