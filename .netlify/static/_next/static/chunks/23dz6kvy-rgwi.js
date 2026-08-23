(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,t,r)=>{t.exports=e.r(76562)},95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return n},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(90809)._(e.r(98183)),s=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:r}=e,a=e.protocol||"",o=e.pathname||"",n=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||s.test(a))&&!1!==c?(c="//"+(c||""),o&&"/"!==o[0]&&(o="/"+o)):c||(c=""),n&&"#"!==n[0]&&(n="#"+n),d&&"?"!==d[0]&&(d="?"+d),o=o.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${a}${c}${o}${d}${n}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return n(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return o}});let a=e.r(71645);function o(e,t){let r=(0,a.useRef)(null),o=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(r.current=i(e,a)),t&&(o.current=i(t,a))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let a=e.r(18967),o=e.r(52817);function i(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,o.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return h},useLinkStatus:function(){return x}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(90809),s=e.r(43476),n=i._(e.r(71645)),l=e.r(95057),c=e.r(8372),d=e.r(18581),u=e.r(18967),p=e.r(5550);e.r(33525);let f=e.r(88540),m=e.r(91949),g=e.r(73668),y=e.r(9396);function h(t){var r,a;let o,i,h,[x,v]=(0,n.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,n.useRef)(null),{href:j,as:$,children:k,prefetch:L=null,passHref:S,replace:P,shallow:N,scroll:T,onClick:E,onMouseEnter:C,onTouchStart:F,legacyBehavior:O=!1,onNavigate:_,transitionTypes:I,ref:D,unstable_dynamicOnHover:A,...K}=t;o=k,O&&("string"==typeof o||"number"==typeof o)&&(o=(0,s.jsx)("a",{children:o}));let R=n.default.useContext(c.AppRouterContext),M=!1!==L,U=!1!==L?null===(a=L)||"auto"===a?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,z="string"==typeof(r=$||j)?r:(0,l.formatUrl)(r);if(O){if(o?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=n.default.Children.only(o)}let B=O?i&&"object"==typeof i&&i.ref:D,q=n.default.useCallback(e=>(null!==R&&(w.current=(0,m.mountLinkInstance)(e,z,R,U,M,v)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[M,z,R,U,v]),V={ref:(0,d.useMergedRef)(q,B),onClick(t){O||"function"!=typeof E||E(t),O&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!R||t.defaultPrevented||function(t,r,a,o,i,s,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(r)){o&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(99781);n.default.startTransition(()=>{u(r,o?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,a.current,l)})}}(t,z,w,P,T,_,I)},onMouseEnter(e){O||"function"!=typeof C||C(e),O&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),R&&M&&(0,m.onNavigationIntent)(e.currentTarget,!0===A)},onTouchStart:function(e){O||"function"!=typeof F||F(e),O&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),R&&M&&(0,m.onNavigationIntent)(e.currentTarget,!0===A)}};return(0,u.isAbsoluteUrl)(z)?V.href=z:O&&!S&&("a"!==i.type||"href"in i.props)||(V.href=(0,p.addBasePath)(z)),h=O?n.default.cloneElement(i,V):(0,s.jsx)("a",{...K,...V,children:o}),(0,s.jsx)(b.Provider,{value:x,children:h})}e.r(84508);let b=(0,n.createContext)(m.IDLE_LINK_STATUS),x=()=>(0,n.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},5766,e=>{"use strict";let t,r;var a,o=e.i(71645);let i={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",a="",o="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+s+";":a+="f"==i[1]?c(s,i):i+"{"+c(s,"k"==i[1]?"":t)+"}":"object"==typeof s?a+=c(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(i,s):i+":"+s+";")}return r+(t&&o?t+"{"+o+"}":o)+a},d={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},o=e.call?e(a.p):e;return((e,t,r,a,o)=>{var i;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=s.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[f]=c(o?{["@keyframes "+f]:t}:t,r?"":"."+f)}let m=r&&d.g;return r&&(d.g=d[f]),i=d[f],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),f})(o.unshift?o.raw?(t=[].slice.call(arguments,1),r=a.p,o.reduce((e,a,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}p.bind({g:1});let f,m,g,y=p.bind({k:1});function h(e,t){let r=this||{};return function(){let a=arguments;function o(i,s){let n=Object.assign({},i),l=n.className||o.className;r.p=Object.assign({theme:m&&m()},n),r.o=/go\d/.test(l),n.className=p.apply(r,a)+(l?" "+l:""),t&&(n.ref=s);let c=e;return e[0]&&(c=n.as||e,delete n.as),g&&c[0]&&g(n),f(c,n)}return t?t(o):o}}var b=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],$={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},L=(e,t=v)=>{k[t]=w(k[t]||$,e),j.forEach(([e,r])=>{e===t&&r(k[t])})},S=e=>Object.keys(k).forEach(t=>L(e,t)),P=(e=v)=>t=>{L(t,e)},N=e=>(t,r)=>{let a,o=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||x()}))(t,e,r);return P(o.toasterId||(a=o.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===a))))({type:2,toast:o}),o.id},T=(e,t)=>N("blank")(e,t);T.error=N("error"),T.success=N("success"),T.loading=N("loading"),T.custom=N("custom"),T.dismiss=(e,t)=>{let r={type:3,toastId:e};t?P(t)(r):S(r)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let r={type:4,toastId:e};t?P(t)(r):S(r)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,r)=>{let a=T.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?b(t.success,e):void 0;return o?T.success(o,{id:a,...r,...null==r?void 0:r.success}):T.dismiss(a),e}).catch(e=>{let o=t.error?b(t.error,e):void 0;o?T.error(o,{id:a,...r,...null==r?void 0:r.error}):T.dismiss(a)}),e};var E=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,C=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,O=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${C} 0.15s ease-out forwards;
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
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,_=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=h("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${_} 1s linear infinite;
`,D=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,A=y`
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
}`,K=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${A} 0.2s ease-out forwards;
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
`,R=h("div")`
  position: absolute;
`,M=h("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,U=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=h("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,B=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(z,null,t):t:"blank"===r?null:o.createElement(M,null,o.createElement(I,{...a}),"loading"!==r&&o.createElement(R,null,"error"===r?o.createElement(O,{...a}):o.createElement(K,{...a})))},q=h("div")`
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
`,V=h("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;o.memo(({toast:e,position:t,style:a,children:i})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[o,i]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=o.createElement(B,{toast:e}),l=o.createElement(V,{...e.ariaProps},b(e.message,e));return o.createElement(q,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof i?i({icon:n,message:l}):o.createElement(o.Fragment,null,n,l))}),a=o.createElement,c.p=void 0,f=a,m=void 0,g=void 0,p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,T],5766)},28719,e=>{"use strict";var t=e.i(35506);e.s(["collection",()=>t.aR])},59362,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(18566),o=e.i(22016),i=e.i(91557);e.i(36180);var s=e.i(28719),n=e.i(17689),l=e.i(63802),c=e.i(5766);let d={Petrol:1e5,Diesel:1e5,Kerosene:1e5,"V-Power":1e5};e.s(["default",0,function(){let e=(0,a.useRouter)(),[u,p]=(0,r.useState)(!1),[f,m]=(0,r.useState)("white"),[g,y]=(0,r.useState)({supplier:"",fuelType:"Petrol",litres:"",costPerLitre:"",date:new Date().toISOString().split("T")[0]});(0,r.useEffect)(()=>{(async()=>{let e=i.auth.currentUser;if(e)try{let t=await (0,l.getDoc)((0,n.doc)(i.db,"users",e.uid));if(t.exists()){let e=t.data();e.background&&m(e.background)}}catch(e){console.error("Error fetching user background:",e)}})()},[]);let h=(0,r.useMemo)(()=>(parseFloat(g.litres)||0)*(parseFloat(g.costPerLitre)||0),[g.litres,g.costPerLitre]),b=(0,r.useCallback)(e=>{let{name:t,value:r}=e.target;y(e=>({...e,[t]:r}))},[]),x=(0,r.useCallback)(async t=>{t.preventDefault(),p(!0);try{let t=parseFloat(g.litres),r=parseFloat(g.costPerLitre);if(t<=0){c.default.error("Please enter a valid amount of litres"),p(!1);return}if(r<=0){c.default.error("Please enter a valid cost per litre"),p(!1);return}let a=(0,n.doc)(i.db,"company","fuelStock"),o=await (0,l.runTransaction)(i.db,async e=>{let o=await e.get(a),l={Petrol:0,Diesel:0,Kerosene:0,"V-Power":0},c=[];if(o.exists()){let e=o.data();l=e.stock||{Petrol:0,Diesel:0,Kerosene:0,"V-Power":0},c=e.activityLog||[]}let{currentAmount:u,newAmount:p,capacity:f}=((e,t,r)=>{let a=d[e]||0,o=r[e]||0;if(o>a)throw Error(`${e} tank contains invalid value (${o.toFixed(1)}L). Maximum allowed is ${a}L. Please fix the stock first.`);if(o>=a)throw Error(`${e} tank is FULL! Current: ${o.toFixed(1)}L out of ${a}L. Cannot import more fuel.`);let i=o+t;if(i>a){let r=a-o;throw Error(`Cannot import ${t}L! ${e} tank capacity is ${a}L. Only ${r.toFixed(1)}L space available.`)}return{currentAmount:o,newAmount:i,capacity:a,availableSpace:a-o}})(g.fuelType,t,l),m={...l,[g.fuelType]:p},y=[{fuelType:g.fuelType,amount:t,action:"add",actionType:"Fuel Import",reason:`Imported ${t}L ${g.fuelType} from ${g.supplier} at KES ${r.toFixed(2)}/L`,timestamp:new Date().toISOString(),date:new Date().toLocaleString(),previousTankAmount:u,newTankAmount:p,updatedBy:"Admin",supplier:g.supplier,costPerLitre:r,totalCost:h,importDate:g.date,priceInfo:`KES ${r.toFixed(2)}/L | Total: KES ${h.toFixed(2)}`,capacityInfo:`${p}/${f}L (${(p/f*100).toFixed(1)}%)`,pricePerLitre:r,costDisplay:`💰 KES ${r.toFixed(2)}/L | 💳 Total: KES ${h.toFixed(2)}`},...c].slice(0,100);e.update(a,{stock:m,activityLog:y,lastUpdated:new Date().toISOString()});let b=(0,n.doc)((0,s.collection)(i.db,"fuelImports"));return e.set(b,{...g,litres:t,costPerLitre:r,totalCost:h,createdAt:new Date().toISOString()}),{newAmount:p,capacity:f,currentAmount:u,parsedLitres:t}}),u=(await (0,l.getDocs)((0,s.collection)(i.db,"drivers"))).docs.map(e=>({id:e.id,...e.data()})).filter(e=>!0===e.isOnline||"available"===e.status);if(u.length>0){let e=o.parsedLitres/u.length,t=u.map(t=>{let r=(0,n.doc)(i.db,"drivers",t.id),a=t.remainingFuel||{},o=g.fuelType;return(0,l.updateDoc)(r,{[`remainingFuel.${o}`]:(a[o]||0)+e,fuelUpdatedAt:new Date().toISOString(),fuelHistory:[{type:"import",date:new Date().toISOString(),fuelType:o,litresAdded:e,supplier:g.supplier,costPerLitre:parseFloat(g.costPerLitre),totalCost:h,importDate:g.date,priceInfo:`KES ${parseFloat(g.costPerLitre).toFixed(2)}/L | Total: KES ${h.toFixed(2)}`},...t.fuelHistory||[]].slice(0,50)})});await Promise.all(t),c.default.success(`✅ ${o.parsedLitres}L of ${g.fuelType} distributed to ${u.length} active drivers!`,{duration:4e3,icon:"🚚"})}else(0,c.default)("⚠️ Fuel added to company stock but no active drivers to distribute to.",{duration:4e3,icon:"ℹ️"});let f=o.newAmount/o.capacity*100,m=f>90?"⚠️":f>80?"🟡":"✅";c.default.success(`${m} ${o.parsedLitres}L ${g.fuelType} imported successfully! Tank: ${o.newAmount.toFixed(1)}L (${f.toFixed(1)}% of capacity)`,{duration:4e3,icon:"⛽"}),c.default.success(`💰 Cost: KES ${parseFloat(g.costPerLitre).toFixed(2)}/L | Total: KES ${h.toFixed(2)}`,{duration:4e3,icon:"💳"}),e.push("/fuel")}catch(e){console.error("Error importing fuel:",e),c.default.error(e.message||"Failed to import fuel")}finally{p(!1)}},[g,h,e]);return(0,t.jsx)("div",{className:`p-4 md:p-6 transition-colors duration-300 ${(()=>{switch(f){case"dark":return"bg-gray-900 text-white min-h-screen";case"skyblue":return"bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen";case"gray":return"bg-gray-200 min-h-screen";default:return"bg-gray-100 min-h-screen"}})()}`,children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:`text-2xl font-bold ${"dark"===f?"text-white":"text-gray-900"}`,children:" Import Fuel"}),(0,t.jsx)("p",{className:`text-sm ${"dark"===f?"text-gray-400":"text-gray-500"}`,children:"Import fuel from depot to system and distribute to active drivers"})]}),(0,t.jsxs)(o.default,{href:"/fuel",className:`text-sm ${"dark"===f?"text-gray-400 hover:text-gray-200":"text-gray-500 hover:text-gray-700"} flex items-center space-x-1`,children:[(0,t.jsx)("span",{children:"←"}),(0,t.jsx)("span",{children:"Back to Fuel"})]})]}),(0,t.jsx)("div",{className:`rounded-xl shadow-sm p-6 border ${"dark"===f?"border-gray-700":"border-gray-100"} ${(()=>{switch(f){case"dark":return"bg-gray-800/95 border-gray-700 text-white";case"skyblue":return"bg-white/90 backdrop-blur-sm shadow-lg";default:return"bg-white shadow-lg"}})()}`,children:(0,t.jsxs)("form",{onSubmit:x,className:"space-y-6 max-w-2xl",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium ${"dark"===f?"text-gray-300":"text-gray-700"} mb-2`,children:"Supplier *"}),(0,t.jsx)("input",{type:"text",name:"supplier",required:!0,className:`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${"dark"===f?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`,placeholder:"Supplier name",value:g.supplier,onChange:b})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium ${"dark"===f?"text-gray-300":"text-gray-700"} mb-2`,children:"Fuel Type *"}),(0,t.jsxs)("select",{name:"fuelType",required:!0,className:`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${"dark"===f?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`,value:g.fuelType,onChange:b,children:[(0,t.jsx)("option",{value:"Petrol",children:"Petrol"}),(0,t.jsx)("option",{value:"Diesel",children:"Diesel"}),(0,t.jsx)("option",{value:"Kerosene",children:"Kerosene"}),(0,t.jsx)("option",{value:"V-Power",children:"V-Power"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium ${"dark"===f?"text-gray-300":"text-gray-700"} mb-2`,children:"Litres *"}),(0,t.jsx)("input",{type:"number",name:"litres",required:!0,className:`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${"dark"===f?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`,placeholder:"1000",step:"0.01",min:"0",value:g.litres,onChange:b})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium ${"dark"===f?"text-gray-300":"text-gray-700"} mb-2`,children:"Cost per Litre (KES) *"}),(0,t.jsx)("input",{type:"number",name:"costPerLitre",required:!0,className:`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${"dark"===f?"bg-gray-700 text-white border-gray-600":"bg-white border-gray-300"}`,placeholder:"185",step:"0.01",min:"0",value:g.costPerLitre,onChange:b})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:`block text-sm font-medium ${"dark"===f?"text-gray-300":"text-gray-700"} mb-2`,children:"Import Date"}),(0,t.jsx)("div",{className:`w-full px-4 py-2 border rounded-lg ${"dark"===f?"bg-gray-700 text-gray-400 border-gray-600":"bg-gray-100 text-gray-700 border-gray-300"}`,children:g.date}),(0,t.jsx)("p",{className:"text-xs mt-1 text-gray-400",children:"Date is automatically set to today"})]}),(0,t.jsx)("div",{className:"flex items-end",children:(0,t.jsxs)("div",{className:`p-3 rounded-lg border w-full ${"dark"===f?"bg-gray-700 border-gray-600":"bg-gray-50 border-gray-200"}`,children:[(0,t.jsx)("p",{className:`text-xs ${"dark"===f?"text-gray-400":"text-gray-500"}`,children:"Total Cost"}),(0,t.jsxs)("p",{className:"text-lg font-bold text-green-600",children:["KES ",h.toFixed(2)]})]})})]}),(0,t.jsx)("div",{className:"p-4 rounded-lg bg-cyan-700 text-white border border-blue-700",children:(0,t.jsxs)("p",{className:"text-sm",children:["• ",(0,t.jsx)("strong",{children:"Copyright © 2026 eGAS. All rights reserved."})]})}),(0,t.jsxs)("div",{className:"flex justify-end space-x-3 pt-6 border-t border-gray-200",children:[(0,t.jsx)(o.default,{href:"/fuel",className:`px-4 py-2 text-sm font-medium ${"dark"===f?"text-gray-300 bg-gray-700 hover:bg-gray-600":"text-gray-700 bg-gray-100 hover:bg-gray-200"} rounded-lg transition`,children:"Cancel"}),(0,t.jsx)("button",{type:"submit",disabled:u,className:"px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed",children:u?(0,t.jsxs)("span",{className:"flex items-center space-x-2",children:[(0,t.jsxs)("svg",{className:"animate-spin h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,t.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,t.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),(0,t.jsx)("span",{children:"Importing..."})]}):"Import Fuel"})]})]})})]})})}])}]);