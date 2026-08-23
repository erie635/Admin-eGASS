(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return s},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(90809)._(e.r(98183)),n=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,a=e.protocol||"",o=e.pathname||"",s=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:r&&(d=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let u=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||n.test(a))&&!1!==d?(d="//"+(d||""),o&&"/"!==o[0]&&(o="/"+o)):d||(d=""),s&&"#"!==s[0]&&(s="#"+s),u&&"?"!==u[0]&&(u="?"+u),o=o.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${a}${d}${o}${u}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return s(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return o}});let a=e.r(71645);function o(e,t){let r=(0,a.useRef)(null),o=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(r.current=i(e,a)),t&&(o.current=i(t,a))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let a=e.r(18967),o=e.r(52817);function i(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,o.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return y},useLinkStatus:function(){return v}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(90809),n=e.r(43476),s=i._(e.r(71645)),l=e.r(95057),d=e.r(8372),u=e.r(18581),c=e.r(18967),f=e.r(5550);e.r(33525);let p=e.r(88540),m=e.r(91949),g=e.r(73668),h=e.r(9396);function y(t){var r,a;let o,i,y,[v,x]=(0,s.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,s.useRef)(null),{href:_,as:j,children:P,prefetch:S=null,passHref:O,replace:E,shallow:C,scroll:R,onClick:I,onMouseEnter:k,onTouchStart:N,legacyBehavior:$=!1,onNavigate:M,transitionTypes:A,ref:z,unstable_dynamicOnHover:L,...D}=t;o=P,$&&("string"==typeof o||"number"==typeof o)&&(o=(0,n.jsx)("a",{children:o}));let T=s.default.useContext(d.AppRouterContext),U=!1!==S,F=!1!==S?null===(a=S)||"auto"===a?h.FetchStrategy.PPR:h.FetchStrategy.Full:h.FetchStrategy.PPR,q="string"==typeof(r=j||_)?r:(0,l.formatUrl)(r);if($){if(o?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=s.default.Children.only(o)}let B=$?i&&"object"==typeof i&&i.ref:z,W=s.default.useCallback(e=>(null!==T&&(w.current=(0,m.mountLinkInstance)(e,q,T,F,U,x)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,q,T,F,x]),G={ref:(0,u.useMergedRef)(W,B),onClick(t){$||"function"!=typeof I||I(t),$&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!T||t.defaultPrevented||function(t,r,a,o,i,n,l){if("u">typeof window){let d,{nodeName:u}=t.currentTarget;if("A"===u.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(r)){o&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:c}=e.r(99781);s.default.startTransition(()=>{c(r,o?"replace":"push",!1===i?p.ScrollBehavior.NoScroll:p.ScrollBehavior.Default,a.current,l)})}}(t,q,w,E,R,M,A)},onMouseEnter(e){$||"function"!=typeof k||k(e),$&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),T&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===L)},onTouchStart:function(e){$||"function"!=typeof N||N(e),$&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),T&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===L)}};return(0,c.isAbsoluteUrl)(q)?G.href=q:$&&!O&&("a"!==i.type||"href"in i.props)||(G.href=(0,f.addBasePath)(q)),y=$?s.default.cloneElement(i,G):(0,n.jsx)("a",{...D,...G,children:o}),(0,n.jsx)(b.Provider,{value:v,children:y})}e.r(84508);let b=(0,s.createContext)(m.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},5766,e=>{"use strict";let t,r;var a,o=e.i(71645);let i={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let r="",a="",o="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+n+";":a+="f"==i[1]?d(n,i):i+"{"+d(n,"k"==i[1]?"":t)+"}":"object"==typeof n?a+=d(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=d.p?d.p(i,n):i+":"+n+";")}return r+(t&&o?t+"{"+o+"}":o)+a},u={},c=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+c(e[r]);return t}return e};function f(e){let t,r,a=this||{},o=e.call?e(a.p):e;return((e,t,r,a,o)=>{var i;let f=c(e),p=u[f]||(u[f]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(f));if(!u[p]){let t=f!==e?e:(e=>{let t,r,a=[{}];for(;t=n.exec(e.replace(s,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);u[p]=d(o?{["@keyframes "+p]:t}:t,r?"":"."+p)}let m=r&&u.g;return r&&(u.g=u[p]),i=u[p],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),p})(o.unshift?o.raw?(t=[].slice.call(arguments,1),r=a.p,o.reduce((e,a,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}f.bind({g:1});let p,m,g,h=f.bind({k:1});function y(e,t){let r=this||{};return function(){let a=arguments;function o(i,n){let s=Object.assign({},i),l=s.className||o.className;r.p=Object.assign({theme:m&&m()},s),r.o=/go\d/.test(l),s.className=f.apply(r,a)+(l?" "+l:""),t&&(s.ref=n);let d=e;return e[0]&&(d=s.as||e,delete s.as),g&&d[0]&&g(s),p(d,s)}return t?t(o):o}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},_=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},S=(e,t=x)=>{P[t]=w(P[t]||j,e),_.forEach(([e,r])=>{e===t&&r(P[t])})},O=e=>Object.keys(P).forEach(t=>S(e,t)),E=(e=x)=>t=>{S(t,e)},C=e=>(t,r)=>{let a,o=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(t,e,r);return E(o.toasterId||(a=o.id,Object.keys(P).find(e=>P[e].toasts.some(e=>e.id===a))))({type:2,toast:o}),o.id},R=(e,t)=>C("blank")(e,t);R.error=C("error"),R.success=C("success"),R.loading=C("loading"),R.custom=C("custom"),R.dismiss=(e,t)=>{let r={type:3,toastId:e};t?E(t)(r):O(r)},R.dismissAll=e=>R.dismiss(void 0,e),R.remove=(e,t)=>{let r={type:4,toastId:e};t?E(t)(r):O(r)},R.removeAll=e=>R.remove(void 0,e),R.promise=(e,t,r)=>{let a=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?b(t.success,e):void 0;return o?R.success(o,{id:a,...r,...null==r?void 0:r.success}):R.dismiss(a),e}).catch(e=>{let o=t.error?b(t.error,e):void 0;o?R.error(o,{id:a,...r,...null==r?void 0:r.error}):R.dismiss(a)}),e};var I=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,k=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,N=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,$=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${k} 0.15s ease-out forwards;
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
    animation: ${N} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,A=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,z=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,L=h`
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
}`,D=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${L} 0.2s ease-out forwards;
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
`,T=y("div")`
  position: absolute;
`,U=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,F=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${F} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,B=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(q,null,t):t:"blank"===r?null:o.createElement(U,null,o.createElement(A,{...a}),"loading"!==r&&o.createElement(T,null,"error"===r?o.createElement($,{...a}):o.createElement(D,{...a})))},W=y("div")`
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
`,G=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;o.memo(({toast:e,position:t,style:a,children:i})=>{let n=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[o,i]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=o.createElement(B,{toast:e}),l=o.createElement(G,{...e.ariaProps},b(e.message,e));return o.createElement(W,{className:e.className,style:{...n,...a,...e.style}},"function"==typeof i?i({icon:s,message:l}):o.createElement(o.Fragment,null,s,l))}),a=o.createElement,d.p=void 0,p=a,m=void 0,g=void 0,f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",0,R],5766)},18566,(e,t,r)=>{t.exports=e.r(76562)},54937,e=>{"use strict";var t=e.i(54716);e.s(["signInWithEmailAndPassword",()=>t.ac])},88143,(e,t,r)=>{"use strict";function a({widthInt:e,heightInt:t,blurWidth:r,blurHeight:o,blurDataURL:i,objectFit:n}){let s=r?40*r:e,l=o?40*o:t,d=s&&l?`viewBox='0 0 ${s} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===n?"xMidYMid":"cover"===n?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${i}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return a}})},87690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={VALID_LOADERS:function(){return i},imageConfigDefault:function(){return n}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},8927,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return d}}),e.r(33525);let a=e.r(43369),o=e.r(88143),i=e.r(87690),n=["-moz-initial","fill","none","scale-down",void 0];function s(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:r=!1,priority:u=!1,preload:c=!1,loading:f,className:p,quality:m,width:g,height:h,fill:y=!1,style:b,overrideSrc:v,onLoad:x,onLoadingComplete:w,placeholder:_="empty",blurDataURL:j,fetchPriority:P,decoding:S="async",layout:O,objectFit:E,objectPosition:C,lazyBoundary:R,lazyRoot:I,...k},N){var $;let M,A,z,{imgConf:L,showAltText:D,blurComplete:T,defaultLoader:U}=N,F=L||i.imageConfigDefault;if("allSizes"in F)M=F;else{let e=[...F.deviceSizes,...F.imageSizes].sort((e,t)=>e-t),t=F.deviceSizes.sort((e,t)=>e-t),r=F.qualities?.sort((e,t)=>e-t);M={...F,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===U)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let q=k.loader||U;delete k.loader,delete k.srcSet;let B="__next_img_default"in q;if(B){if("custom"===M.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=q;q=t=>{let{config:r,...a}=t;return e(a)}}if(O){"fill"===O&&(y=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[O];e&&(b={...b,...e});let r={responsive:"100vw",fill:"100vw"}[O];r&&!t&&(t=r)}let W="",G=l(g),K=l(h);if(($=e)&&"object"==typeof $&&(s($)||void 0!==$.src)){let t=s(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(A=t.blurWidth,z=t.blurHeight,j=j||t.blurDataURL,W=t.src,!y)if(G||K){if(G&&!K){let e=G/t.width;K=Math.round(t.height*e)}else if(!G&&K){let e=K/t.height;G=Math.round(t.width*e)}}else G=t.width,K=t.height}let X=!u&&!c&&("lazy"===f||void 0===f);(!(e="string"==typeof e?e:W)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,X=!1),M.unoptimized&&(r=!0),B&&!M.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let H=l(m),V=Object.assign(y?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:E,objectPosition:C}:{},D?{}:{color:"transparent"},b),J=T||"empty"===_?null:"blur"===_?`url("data:image/svg+xml;charset=utf-8,${(0,o.getImageBlurSvg)({widthInt:G,heightInt:K,blurWidth:A,blurHeight:z,blurDataURL:j||"",objectFit:V.objectFit})}")`:`url("${_}")`,Q=n.includes(V.objectFit)?"fill"===V.objectFit?"100% 100%":"cover":V.objectFit,Y=J?{backgroundSize:Q,backgroundPosition:V.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:J}:{},Z=function({config:e,src:t,unoptimized:r,width:o,quality:i,sizes:n,loader:s}){if(r){if(t.startsWith("/")&&!t.startsWith("//")){let e=(0,a.getDeploymentId)();if(e){let r=t.indexOf("?");if(-1!==r){let a=new URLSearchParams(t.slice(r+1));a.get("dpl")||(a.append("dpl",e),t=t.slice(0,r)+"?"+a.toString())}else t+=`?dpl=${e}`}}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:l,kind:d}=function({deviceSizes:e,allSizes:t},r,a){if(a){let r=/(^|\s)(1?\d?\d)vw/g,o=[];for(let e;e=r.exec(a);)o.push(parseInt(e[2]));if(o.length){let r=.01*Math.min(...o);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,o,n),u=l.length-1;return{sizes:n||"w"!==d?n:"100vw",srcSet:l.map((r,a)=>`${s({config:e,src:t,quality:i,width:r})} ${"w"===d?r:a+1}${d}`).join(", "),src:s({config:e,src:t,quality:i,width:l[u]})}}({config:M,src:e,unoptimized:r,width:G,quality:H,sizes:t,loader:q}),ee=X?"lazy":f;return{props:{...k,loading:ee,fetchPriority:P,width:G,height:K,decoding:S,className:p,style:{...V,...Y},sizes:Z.sizes,srcSet:Z.srcSet,src:v||Z.src},meta:{unoptimized:r,preload:c||u,placeholder:_,fill:y}}}},98879,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let a=e.r(71645),o="u"<typeof window,i=o?()=>{}:a.useLayoutEffect,n=o?()=>{}:a.useEffect;function s(e){let{headManager:t,reduceComponentsToState:r}=e;function s(){if(t&&t.mountedInstances){let e=a.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return o&&(t?.mountedInstances?.add(e.children),s()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=s),()=>{t&&(t._pendingUpdate=s)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},25633,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return g},defaultHead:function(){return c}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(55682),n=e.r(90809),s=e.r(43476),l=n._(e.r(71645)),d=i._(e.r(98879)),u=e.r(42732);function c(){return[(0,s.jsx)("meta",{charSet:"utf-8"},"charset"),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function f(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(33525);let p=["name","httpEquiv","charSet","itemProp"];function m(e){let t,r,a,o;return e.reduce(f,[]).reverse().concat(c().reverse()).filter((t=new Set,r=new Set,a=new Set,o={},e=>{let i=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?i=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?i=!1:r.add(e.type);break;case"meta":for(let t=0,r=p.length;t<r;t++){let r=p[t];if(e.props.hasOwnProperty(r))if("charSet"===r)a.has(r)?i=!1:a.add(r);else{let t=e.props[r],a=o[r]||new Set;("name"!==r||!n)&&a.has(t)?i=!1:(a.add(t),o[r]=a)}}}return i})).reverse().map((e,t)=>{let r=e.key||t;return l.default.cloneElement(e,{key:r})})}let g=function({children:e}){let t=(0,l.useContext)(u.HeadManagerContext);return(0,s.jsx)(d.default,{reduceComponentsToState:m,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18556,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return i}});let a=e.r(55682)._(e.r(71645)),o=e.r(87690),i=a.default.createContext(o.imageConfigDefault)},65856,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return a}});let a=e.r(55682)._(e.r(71645)).default.createContext(null)},70965,(e,t,r)=>{"use strict";function a(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,t.qualities[0]):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return a}})},1948,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return n}});let a=e.r(70965),o=e.r(43369);function i({config:e,src:t,width:r,quality:n}){let s=(0,o.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//")){let e=t.indexOf("?");if(-1!==e){let r=new URLSearchParams(t.slice(e+1)),a=r.get("dpl");if(a){s=a,r.delete("dpl");let o=r.toString();t=t.slice(0,e)+(o?"?"+o:"")}}}if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let l=(0,a.findClosestQuality)(n,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${l}${t.startsWith("/")&&s?`&dpl=${s}`:""}`}i.__next_img_default=!0;let n=i},5500,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return x}});let a=e.r(55682),o=e.r(90809),i=e.r(43476),n=o._(e.r(71645)),s=a._(e.r(74080)),l=a._(e.r(25633)),d=e.r(8927),u=e.r(87690),c=e.r(18556);e.r(33525);let f=e.r(65856),p=a._(e.r(1948)),m=e.r(18581),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,a,o,i,n){let s=e?.src;e&&e["data-loaded-src"]!==s&&(e["data-loaded-src"]=s,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&o(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let a=!1,o=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>a,isPropagationStopped:()=>o,persist:()=>{},preventDefault:()=>{a=!0,t.preventDefault()},stopPropagation:()=>{o=!0,t.stopPropagation()}})}a?.current&&a.current(e)}}))}function y(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:a,width:o,decoding:s,className:l,style:d,fetchPriority:u,placeholder:c,loading:f,unoptimized:p,fill:g,onLoadRef:b,onLoadingCompleteRef:v,setBlurComplete:x,setShowAltText:w,sizesInput:_,onLoad:j,onError:P,...S},O)=>{let E=(0,n.useCallback)(e=>{e&&(P&&(e.src=e.src),e.complete&&h(e,c,b,v,x,p,_))},[e,c,b,v,x,P,p,_]),C=(0,m.useMergedRef)(O,E);return(0,i.jsx)("img",{...S,...y(u),loading:f,width:o,height:a,decoding:s,"data-nimg":g?"fill":"1",className:l,style:d,sizes:r,srcSet:t,src:e,ref:C,onLoad:e=>{h(e.currentTarget,c,b,v,x,p,_)},onError:e=>{w(!0),"empty"!==c&&x(!0),P&&P(e)}})});function v({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...y(t.fetchPriority)};return e&&s.default.preload?(s.default.preload(t.src,r),null):(0,i.jsx)(l.default,{children:(0,i.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let x=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(f.RouterContext),a=(0,n.useContext)(c.ImageConfigContext),o=(0,n.useMemo)(()=>{let e=g||a||u.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),o=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:o,localPatterns:"u"<typeof window?a?.localPatterns:e.localPatterns}},[a]),{onLoad:s,onLoadingComplete:l}=e,m=(0,n.useRef)(s);(0,n.useEffect)(()=>{m.current=s},[s]);let h=(0,n.useRef)(l);(0,n.useEffect)(()=>{h.current=l},[l]);let[y,x]=(0,n.useState)(!1),[w,_]=(0,n.useState)(!1),{props:j,meta:P}=(0,d.getImgProps)(e,{defaultLoader:p.default,imgConf:o,blurComplete:y,showAltText:w});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(b,{...j,unoptimized:P.unoptimized,placeholder:P.placeholder,fill:P.fill,onLoadRef:m,onLoadingCompleteRef:h,setBlurComplete:x,setShowAltText:_,sizesInput:e.sizes,ref:t}),P.preload?(0,i.jsx)(v,{isAppRouter:!r,imgAttributes:j}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},94909,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return u},getImageProps:function(){return d}};for(var o in a)Object.defineProperty(r,o,{enumerable:!0,get:a[o]});let i=e.r(55682),n=e.r(8927),s=e.r(5500),l=i._(e.r(1948));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let u=s.Image},57688,(e,t,r)=>{t.exports=e.r(94909)},89954,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(91557);e.i(51718);var o=e.i(54937);e.i(36180);var i=e.i(17689),n=e.i(63802),s=e.i(18566),l=e.i(22016),d=e.i(5766),u=e.i(57688);e.s(["default",0,function(){let[e,c]=(0,r.useState)(""),[f,p]=(0,r.useState)(""),[m,g]=(0,r.useState)(!1),[h,y]=(0,r.useState)(""),b=(0,s.useRouter)(),v=async t=>{if(t.preventDefault(),m)return;g(!0),y("");let r=e.trim().toLowerCase(),s=f.trim();if(!r||!s){y("Please enter both email and password."),d.default.error("Missing credentials"),g(!1);return}try{console.clear(),console.log("========== LOGIN =========="),console.log("Project:",a.auth.app.options.projectId),console.log("Email:",r),console.log("Password Length:",s.length);let e=(await (0,o.signInWithEmailAndPassword)(a.auth,r,s)).user;console.log("Login successful:",e.uid);let t=(0,i.doc)(a.db,"users",e.uid),l=await (0,n.getDoc)(t);if(l.exists()){let e=l.data();"admin"!==e.role&&"super_admin"!==e.role&&(console.log("Updating user role to admin..."),await (0,n.setDoc)(t,{...e,role:"admin",updatedAt:new Date().toISOString()},{merge:!0}),console.log("User role updated to admin"))}else console.log("User document missing. Creating with admin role..."),await (0,n.setDoc)(t,{name:e.displayName||r.split("@")[0],email:r,role:"admin",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),console.log("User document created with admin role");d.default.success("Welcome!"),b.push("/dashboard")}catch(e){switch(console.log("================================"),console.log("Login attempt failed"),console.log("Code:",e.code),console.log("Message:",e.message),console.log("================================"),e.code){case"auth/invalid-email":y("Invalid email address. Please enter a valid email."),d.default.error("Invalid email");break;case"auth/user-not-found":y("No account found with this email. Please sign up first."),d.default.error("Account not found");break;case"auth/wrong-password":y("Incorrect password. Please try again."),d.default.error("Wrong password");break;case"auth/invalid-credential":y("Incorrect email or password. Please try again."),d.default.error("Invalid email or password");break;case"auth/user-disabled":y("This account has been disabled. Please contact support."),d.default.error("User disabled");break;case"auth/network-request-failed":y("Network error. Please check your internet connection."),d.default.error("Network error");break;case"auth/too-many-requests":y("Too many failed attempts. Please try again later."),d.default.error("Too many attempts");break;default:y("Login failed. Please try again."),d.default.error("Login failed")}}finally{g(!1)}};return(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:(0,t.jsxs)("div",{className:"bg-white p-8 rounded-lg shadow-lg w-full max-w-md",children:[(0,t.jsxs)("div",{className:"text-center mb-8",children:[(0,t.jsx)("div",{className:"w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 relative",children:(0,t.jsx)(u.default,{src:"/images/logo.png",alt:"Logo",fill:!0,sizes:"96px",className:"object-contain p-2",priority:!0})}),(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-800",children:"Admin Login"}),(0,t.jsx)("p",{className:"text-gray-500 text-sm mt-2",children:"Sign in to manage your fuel delivery system"})]}),h&&(0,t.jsx)("div",{className:"mb-4 p-3 bg-red-50 border border-red-400 text-red-700 rounded-md",children:h}),(0,t.jsxs)("form",{onSubmit:v,children:[(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Email Address"}),(0,t.jsx)("input",{type:"email",value:e,onChange:e=>c(e.target.value),placeholder:"admin@efuel.com",className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",required:!0})]}),(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Password"}),(0,t.jsx)("input",{type:"password",value:f,onChange:e=>p(e.target.value),placeholder:"Enter your password",className:"w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",required:!0})]}),(0,t.jsx)("button",{type:"submit",disabled:m,className:"w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50",children:m?"Logging in...":"Sign In"})]}),(0,t.jsxs)("div",{className:"mt-6 text-center space-y-2",children:[(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["Don't have an account?"," ",(0,t.jsx)(l.default,{href:"/signup",className:"text-green-600 hover:text-green-800 font-medium",children:"Sign Up"})]}),(0,t.jsx)("p",{className:"text-xs text-gray-400",children:"Need help? Contact your system administrator"})]})]})})}])}]);