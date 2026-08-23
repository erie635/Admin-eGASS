(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return n},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let o=e.r(90809)._(e.r(98183)),i=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:r}=e,a=e.protocol||"",s=e.pathname||"",n=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:r&&(d=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||i.test(a))&&!1!==d?(d="//"+(d||""),s&&"/"!==s[0]&&(s="/"+s)):d||(d=""),n&&"#"!==n[0]&&(n="#"+n),c&&"?"!==c[0]&&(c="?"+c),s=s.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${a}${d}${s}${c}${n}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return n(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return s}});let a=e.r(71645);function s(e,t){let r=(0,a.useRef)(null),s=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(r.current=o(e,a)),t&&(s.current=o(t,a))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let a=e.r(18967),s=e.r(52817);function o(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,s.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return x},useLinkStatus:function(){return b}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let o=e.r(90809),i=e.r(43476),n=o._(e.r(71645)),l=e.r(95057),d=e.r(8372),c=e.r(18581),u=e.r(18967),p=e.r(5550);e.r(33525);let f=e.r(88540),m=e.r(91949),g=e.r(73668),h=e.r(9396);function x(t){var r,a;let s,o,x,[b,v]=(0,n.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,n.useRef)(null),{href:k,as:j,children:N,prefetch:$=null,passHref:S,replace:T,shallow:E,scroll:_,onClick:O,onMouseEnter:L,onTouchStart:C,legacyBehavior:A=!1,onNavigate:P,transitionTypes:D,ref:R,unstable_dynamicOnHover:F,...I}=t;s=N,A&&("string"==typeof s||"number"==typeof s)&&(s=(0,i.jsx)("a",{children:s}));let M=n.default.useContext(d.AppRouterContext),U=!1!==$,K=!1!==$?null===(a=$)||"auto"===a?h.FetchStrategy.PPR:h.FetchStrategy.Full:h.FetchStrategy.PPR,z="string"==typeof(r=j||k)?r:(0,l.formatUrl)(r);if(A){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=n.default.Children.only(s)}let B=A?o&&"object"==typeof o&&o.ref:R,H=n.default.useCallback(e=>(null!==M&&(w.current=(0,m.mountLinkInstance)(e,z,M,K,U,v)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,z,M,K,v]),q={ref:(0,c.useMergedRef)(H,B),onClick(t){A||"function"!=typeof O||O(t),A&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!M||t.defaultPrevented||function(t,r,a,s,o,i,l){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(r)){s&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(99781);n.default.startTransition(()=>{u(r,s?"replace":"push",!1===o?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,a.current,l)})}}(t,z,w,T,_,P,D)},onMouseEnter(e){A||"function"!=typeof L||L(e),A&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),M&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===F)},onTouchStart:function(e){A||"function"!=typeof C||C(e),A&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),M&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===F)}};return(0,u.isAbsoluteUrl)(z)?q.href=z:A&&!S&&("a"!==o.type||"href"in o.props)||(q.href=(0,p.addBasePath)(z)),x=A?n.default.cloneElement(o,q):(0,i.jsx)("a",{...I,...q,children:s}),(0,i.jsx)(y.Provider,{value:b,children:x})}e.r(84508);let y=(0,n.createContext)(m.IDLE_LINK_STATUS),b=()=>(0,n.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},5766,e=>{"use strict";let t,r;var a,s=e.i(71645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o="-"==o[1]?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var o;let p=u(e),f=c[p]||(c[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!c[f]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[f]=d(s?{["@keyframes "+f]:t}:t,r?"":"."+f)}let m=r&&c.g;return r&&(c.g=c[f]),o=c[f],m?t.data=t.data.replace(m,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(a.target),a.g,a.o,a.k)}p.bind({g:1});let f,m,g,h=p.bind({k:1});function x(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;r.p=Object.assign({theme:m&&m()},n),r.o=/go\d/.test(l),n.className=p.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),g&&d[0]&&g(n),f(d,n)}return t?t(s):s}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},k=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},N={},$=(e,t=v)=>{N[t]=w(N[t]||j,e),k.forEach(([e,r])=>{e===t&&r(N[t])})},S=e=>Object.keys(N).forEach(t=>$(e,t)),T=(e=v)=>t=>{$(t,e)},E=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return T(s.toasterId||(a=s.id,Object.keys(N).find(e=>N[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},_=(e,t)=>E("blank")(e,t);_.error=E("error"),_.success=E("success"),_.loading=E("loading"),_.custom=E("custom"),_.dismiss=(e,t)=>{let r={type:3,toastId:e};t?T(t)(r):S(r)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let r={type:4,toastId:e};t?T(t)(r):S(r)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,r)=>{let a=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?y(t.success,e):void 0;return s?_.success(s,{id:a,...r,...null==r?void 0:r.success}):_.dismiss(a),e}).catch(e=>{let s=t.error?y(t.error,e):void 0;s?_.error(s,{id:a,...r,...null==r?void 0:r.error}):_.dismiss(a)}),e};var O=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,C=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,A=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${L} 0.15s ease-out forwards;
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
    animation: ${C} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,P=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,D=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${P} 1s linear infinite;
`,R=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=h`
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

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,M=x("div")`
  position: absolute;
`,U=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,K=h`
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
`,B=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(z,null,t):t:"blank"===r?null:s.createElement(U,null,s.createElement(D,{...a}),"loading"!==r&&s.createElement(M,null,"error"===r?s.createElement(A,{...a}):s.createElement(I,{...a})))},H=x("div")`
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
`,q=x("div")`
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
`];return{animation:t?`${h(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=s.createElement(B,{toast:e}),l=s.createElement(q,{...e.ariaProps},y(e.message,e));return s.createElement(H,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof o?o({icon:n,message:l}):s.createElement(s.Fragment,null,n,l))}),a=s.createElement,d.p=void 0,f=a,m=void 0,g=void 0,p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,_],5766)},28719,e=>{"use strict";var t=e.i(35506);e.s(["collection",()=>t.aR])},47206,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(91557);e.i(36180);var s=e.i(28719),o=e.i(17689),i=e.i(63802),n=e.i(5766),l=e.i(22016);let d=e=>{if(!e)return null;try{if("function"==typeof e?.toDate){let t=e.toDate();return t instanceof Date&&!isNaN(t.getTime())?t:null}if(e instanceof Date)return isNaN(e.getTime())?null:e;let t=new Date(e);if(isNaN(t.getTime()))return null;return t}catch(e){return console.error("Error converting date:",e),null}},c=e=>{if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e){let t=Number(e.replace(/,/g,"").trim());return Number.isFinite(t)?t:0}return 0};e.s(["default",0,function(){let e,[u,p]=(0,r.useState)([]),[f,m]=(0,r.useState)(!0),[g,h]=(0,r.useState)({totalRevenue:0,totalLitres:0,totalOrders:0}),[x,y]=(0,r.useState)("white"),[b,v]=(0,r.useState)(!1),[w,k]=(0,r.useState)([]),[j,N]=(0,r.useState)(""),[$,S]=(0,r.useState)(""),[T,E]=(0,r.useState)(!1),_=(0,r.useRef)(null);(0,r.useEffect)(()=>{(async()=>{let e=a.auth.currentUser;if(e)try{let t=await (0,i.getDoc)((0,o.doc)(a.db,"users",e.uid));if(t.exists()){let e=t.data();e.background&&y(e.background)}}catch(e){console.error("Error fetching user background:",e)}})()},[]),(0,r.useEffect)(()=>{m(!0);let e=(0,s.collection)(a.db,"drivers");return _.current=(0,i.onSnapshot)(e,e=>{let t=[];e.docs.forEach(e=>{let r=e.data();Array.isArray(r.salesHistory)&&r.salesHistory.length>0&&r.salesHistory.forEach(a=>{t.push({...a,driverId:e.id,driverName:r.name||a.driverName||"Unknown Driver"})})});let r=t.sort((e,t)=>{let r=d(e.date),a=d(t.date),s=r?r.getTime():0;return(a?a.getTime():0)-s}),a=r.reduce((e,t)=>e+c(t.totalAmount),0);h({totalRevenue:a,totalLitres:r.reduce((e,t)=>e+c(t.litresSold),0),totalOrders:r.length}),p(r),k(r),m(!1)},e=>{console.error("Error in real-time sales data listener:",e),n.default.error("Failed to load sales data"),m(!1)}),()=>{_.current&&(_.current(),_.current=null)}},[]);let O=()=>{E(!0);try{let e=[...u];if(j){let t=new Date(`${j}T00:00:00`);e=e.filter(e=>{let r=d(e.date);return!!r&&r.getTime()>=t.getTime()})}if($){let t=new Date(`${$}T23:59:59.999`);e=e.filter(e=>{let r=d(e.date);return!!r&&r.getTime()<=t.getTime()})}e.sort((e,t)=>{let r=d(e.date),a=d(t.date),s=r?r.getTime():0;return(a?a.getTime():0)-s}),k(e),0===e.length?(0,n.default)("No sales found for the selected date range"):n.default.success(`Found ${e.length} sales transactions`)}catch(e){console.error("Error filtering sales:",e),n.default.error("Failed to filter sales")}finally{E(!1)}},L=(e=b?w:u,b?e:e.slice(0,10)),C=u.length>10,A=()=>{switch(x){case"dark":return"bg-gray-900 text-white";case"skyblue":return"bg-gradient-to-br from-blue-100 to-blue-300";case"gray":return"bg-gray-200";default:return"bg-gray-100"}},P=()=>{switch(x){case"dark":return"bg-gray-800/95 border-gray-700";case"skyblue":return"bg-white/90 backdrop-blur-sm shadow-lg";default:return"bg-white shadow-lg"}};return f?(0,t.jsx)("div",{className:`min-h-screen flex items-center justify-center ${A()}`,children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"})}):(0,t.jsx)("div",{className:`min-h-screen p-4 md:p-6 transition-colors duration-300 ${A()}`,children:(0,t.jsx)("div",{className:"max-w-7xl mx-auto",children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Sales Report"}),(0,t.jsx)("p",{className:`text-sm mt-1 ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:"View all sales transactions"})]}),(0,t.jsxs)(l.default,{href:"/reports",className:`text-sm ${"dark"===x?"text-gray-400 hover:text-gray-200":"text-gray-500 hover:text-gray-700"} flex items-center space-x-1`,children:[(0,t.jsx)("span",{children:"←"}),(0,t.jsx)("span",{children:"Back to Reports"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:`rounded-xl shadow-lg p-6 border ${"dark"===x?"border-emerald-800":"border-emerald-200"} ${P()} bg-emerald-500 dark:bg-emerald-900 hover:bg-emerald-600 dark:hover:bg-emerald-800 transition-all duration-300`,children:[(0,t.jsx)("p",{className:"text-sm font-semibold uppercase tracking-wider text-emerald-100 dark:text-emerald-300",children:"Total Revenue"}),(0,t.jsxs)("p",{className:"text-3xl font-bold text-white dark:text-emerald-100 mt-1",children:["KES ",g.totalRevenue.toLocaleString()]})]}),(0,t.jsxs)("div",{className:`rounded-xl shadow-lg p-6 border ${"dark"===x?"border-sky-800":"border-sky-200"} ${P()} bg-sky-500 dark:bg-sky-900 hover:bg-sky-600 dark:hover:bg-sky-800 transition-all duration-300`,children:[(0,t.jsx)("p",{className:"text-sm font-semibold uppercase tracking-wider text-sky-100 dark:text-sky-300",children:"Total Litres Sold"}),(0,t.jsxs)("p",{className:"text-3xl font-bold text-white dark:text-sky-100 mt-1",children:[g.totalLitres.toLocaleString(),"L"]})]}),(0,t.jsxs)("div",{className:`rounded-xl shadow-lg p-6 border ${"dark"===x?"border-violet-800":"border-violet-200"} ${P()} bg-violet-500 dark:bg-violet-900 hover:bg-violet-600 dark:hover:bg-violet-800 transition-all duration-300`,children:[(0,t.jsx)("p",{className:"text-sm font-semibold uppercase tracking-wider text-violet-100 dark:text-violet-300",children:"Total Orders"}),(0,t.jsx)("p",{className:"text-3xl font-bold text-white dark:text-violet-100 mt-1",children:g.totalOrders})]})]}),(0,t.jsxs)("div",{className:`rounded-xl shadow-sm border ${"dark"===x?"border-gray-700":"border-gray-200"} ${P()}`,children:[(0,t.jsx)("div",{className:`p-6 border-b ${"dark"===x?"border-gray-700":"border-gray-200"}`,children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("h2",{className:`text-lg font-semibold ${"dark"===x?"text-white":"text-gray-900"}`,children:["Sales History",(0,t.jsxs)("span",{className:`text-sm font-normal ml-2 ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:["(",b?w.length:Math.min(10,u.length)," ","of"," ",u.length," ","transactions)"]})]}),C&&(0,t.jsx)("button",{onClick:()=>{let e=!b;v(e),e&&(j||$?O():k(u))},className:"text-sm text-blue-600 hover:text-blue-800 font-medium transition",children:b?"Show Less":"See All Transactions"})]})}),b&&(0,t.jsx)("div",{className:`p-4 border-b ${"dark"===x?"border-gray-700 bg-gray-800/50":"border-gray-200 bg-gray-50"}`,children:(0,t.jsxs)("div",{className:"flex flex-wrap items-end gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-xs font-medium ${"dark"===x?"text-gray-400":"text-gray-700"} mb-1`,children:"Date From"}),(0,t.jsx)("input",{type:"date",value:j,onChange:e=>N(e.target.value),className:`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${"dark"===x?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-xs font-medium ${"dark"===x?"text-gray-400":"text-gray-700"} mb-1`,children:"Date To"}),(0,t.jsx)("input",{type:"date",value:$,onChange:e=>S(e.target.value),className:`px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${"dark"===x?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`})]}),(0,t.jsx)("button",{onClick:O,disabled:T||!j&&!$,className:`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition ${T||!j&&!$?"bg-gray-400 cursor-not-allowed":"bg-blue-500 hover:bg-blue-600"}`,children:T?"Filtering...":"Filter"}),(j||$)&&(0,t.jsx)("button",{onClick:()=>{N(""),S(""),k(u),(0,n.default)("Date filter cleared")},className:`px-4 py-1.5 text-sm font-medium rounded-lg transition ${"dark"===x?"text-gray-300 bg-gray-700 hover:bg-gray-600":"text-gray-700 bg-gray-200 hover:bg-gray-300"}`,children:"Clear"})]})}),(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full",children:[(0,t.jsx)("thead",{className:"bg-red-900",children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Date"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Driver"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Fuel"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Litres"}),(0,t.jsx)("th",{className:`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${"dark"===x?"text-gray-400":"text-gray-200"}`,children:"Amount"})]})}),(0,t.jsx)("tbody",{className:`divide-y ${"dark"===x?"divide-gray-700":"divide-gray-200"}`,children:0===L.length?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:5,className:`px-6 py-8 text-center ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:b&&(j||$)?"No sales found for the selected date range":"No sales data found"})}):L.map((e,r)=>{let a=d(e.date),s=c(e.litresSold),o=c(e.totalAmount);return(0,t.jsxs)("tr",{className:"dark"===x?"hover:bg-gray-800/50":"hover:bg-gray-50",children:[(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-gray-400":"text-gray-500"}`,children:a?a.toLocaleDateString():"N/A"}),(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-white":"text-gray-900"}`,children:e.driverName||"N/A"}),(0,t.jsx)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-white":"text-gray-900"}`,children:e.fuelType||"N/A"}),(0,t.jsxs)("td",{className:`px-6 py-4 whitespace-nowrap text-sm ${"dark"===x?"text-white":"text-gray-900"}`,children:[s.toLocaleString(),"L"]}),(0,t.jsxs)("td",{className:`px-6 py-4 whitespace-nowrap text-sm font-medium ${"dark"===x?"text-white":"text-gray-900"}`,children:["KES ",o.toLocaleString()]})]},`${e.driverId||"driver"}-${e.date||r}-${r}`)})})]})})]})]})})})}])}]);