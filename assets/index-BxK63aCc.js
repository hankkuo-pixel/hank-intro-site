(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();var Mo="1.3.25";function Ol(i,e,t){return Math.max(i,Math.min(e,t))}function Yc(i,e,t){return(1-t)*i+t*e}function qc(i,e,t,r){return Yc(i,e,1-Math.exp(-t*r))}function $c(i,e){return(i%e+e)%e}var Kc=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const t=Ol(0,this.currentTime/this.duration,1);e=t>=1;const r=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*r}else this.lerp?(this.value=qc(this.value,this.to,this.lerp*60,i),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(i,e,{lerp:t,duration:r,easing:s,onStart:n,onUpdate:a}){this.from=this.value=i,this.to=e,this.lerp=t,this.duration=r,this.easing=s,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=a}};function Zc(i,e){let t;return function(...r){clearTimeout(t),t=setTimeout(()=>{t=void 0,i.apply(this,r)},e)}}var Jc=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(i,e,{autoResize:t=!0,debounce:r=250}={}){this.wrapper=i,this.content=e,t&&(this.debouncedResize=Zc(this.resize,r),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},Bl=class{events={};emit(i,...e){const t=this.events[i]||[];for(let r=0,s=t.length;r<s;r++)t[r]?.(...e)}on(i,e){return this.events[i]?this.events[i].push(e):this.events[i]=[e],()=>{this.events[i]=this.events[i]?.filter(t=>e!==t)}}off(i,e){this.events[i]=this.events[i]?.filter(t=>e!==t)}destroy(){this.events={}}};const Qc=100/6,Pn={passive:!1};function yo(i,e){return i===1?Qc:i===2?e:1}var jc=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new Bl;constructor(i,e={wheelMultiplier:1,touchMultiplier:1}){this.element=i,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,Pn),this.element.addEventListener("touchstart",this.onTouchStart,Pn),this.element.addEventListener("touchmove",this.onTouchMove,Pn),this.element.addEventListener("touchend",this.onTouchEnd,Pn)}on(i,e){return this.emitter.on(i,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,Pn),this.element.removeEventListener("touchstart",this.onTouchStart,Pn),this.element.removeEventListener("touchmove",this.onTouchMove,Pn),this.element.removeEventListener("touchend",this.onTouchEnd,Pn)}onTouchStart=i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:i})};onTouchMove=i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i,r=-(e-this.touchStart.x)*this.options.touchMultiplier,s=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:r,y:s},this.emitter.emit("scroll",{deltaX:r,deltaY:s,event:i})};onTouchEnd=i=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:i})};onWheel=i=>{let{deltaX:e,deltaY:t,deltaMode:r}=i;const s=yo(r,this.window.width),n=yo(r,this.window.height);e*=s,t*=n,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:i})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};const Eo=i=>Math.min(1,1.001-2**(-10*i));var eu=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new Kc;emitter=new Bl;dimensions;virtualScroll;constructor({wrapper:i=window,content:e=document.documentElement,eventsTarget:t=i,smoothWheel:r=!0,syncTouch:s=!1,syncTouchLerp:n=.075,touchInertiaExponent:a=1.7,duration:l,easing:c,lerp:f=.1,infinite:h=!1,orientation:m="vertical",gestureOrientation:u=m==="horizontal"?"both":"vertical",touchMultiplier:o=1,wheelMultiplier:d=1,autoResize:v=!0,prevent:p,virtualScroll:g,overscroll:E=!0,autoRaf:A=!1,anchors:M=!1,autoToggle:_=!1,allowNestedScroll:S=!1,__experimental__naiveDimensions:T=!1,naiveDimensions:x=T,stopInertiaOnNavigate:y=!1}={}){window.lenisVersion=Mo,window.lenis||(window.lenis={}),window.lenis.version=Mo,m==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!i||i===document.documentElement)&&(i=window),typeof l=="number"&&typeof c!="function"?c=Eo:typeof c=="function"&&typeof l!="number"&&(l=1),this.options={wrapper:i,content:e,eventsTarget:t,smoothWheel:r,syncTouch:s,syncTouchLerp:n,touchInertiaExponent:a,duration:l,easing:c,lerp:f,infinite:h,gestureOrientation:u,orientation:m,touchMultiplier:o,wheelMultiplier:d,autoResize:v,prevent:p,virtualScroll:g,overscroll:E,autoRaf:A,anchors:M,autoToggle:_,allowNestedScroll:S,naiveDimensions:x,stopInertiaOnNavigate:y},this.dimensions=new Jc(i,e,{autoResize:v}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new jc(t,{touchMultiplier:o,wheelMultiplier:d}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(i,e){return this.emitter.on(i,e)}off(i,e){return this.emitter.off(i,e)}onScrollEnd=i=>{i instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&i.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const i=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[i]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=i=>{i.propertyName?.includes("overflow")&&i.target===this.rootElement&&this.checkOverflow()};setScroll(i){this.isHorizontal?this.options.wrapper.scrollTo({left:i,behavior:"instant"}):this.options.wrapper.scrollTo({top:i,behavior:"instant"})}onClick=i=>{const e=i.composedPath().filter(r=>r instanceof HTMLAnchorElement&&r.href).map(r=>new URL(r.href)),t=new URL(window.location.href);if(this.options.anchors){const r=e.find(s=>t.host===s.host&&t.pathname===s.pathname&&s.hash);if(r){const s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,n=decodeURIComponent(r.hash);this.scrollTo(n,s);return}}if(this.options.stopInertiaOnNavigate&&e.some(r=>t.host===r.host&&t.pathname!==r.pathname)){this.reset();return}};onPointerDown=i=>{i.button===1&&this.reset()};isTouchOnSelectionHandle(i){const e=window.getSelection();if(!e||e.isCollapsed||e.rangeCount===0)return!1;const t=i.targetTouches[0]??i.changedTouches[0];if(!t)return!1;const r=e.getRangeAt(0).getClientRects();if(r.length===0)return!1;const s=r[0],n=r[r.length-1],a=40,l=Math.hypot(t.clientX-s.left,t.clientY-s.top)<=a,c=Math.hypot(t.clientX-n.right,t.clientY-n.bottom)<=a;return l||c}onVirtualScroll=i=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(i)===!1)return;const{deltaX:e,deltaY:t,event:r}=i;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:r}),r.ctrlKey||r.lenisStopPropagation)return;const s=r.type.includes("touch"),n=r.type.includes("wheel");if(s&&this.isIos&&(r.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(r)),this._isDraggingSelection)){r.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=r.type==="touchstart"||r.type==="touchmove";const a=e===0&&t===0;if(this.options.syncTouch&&s&&r.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}const l=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(a||l)return;let c=r.composedPath();c=c.slice(0,c.indexOf(this.rootElement));const f=this.options.prevent,h=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";if(c.find(d=>d instanceof HTMLElement&&(typeof f=="function"&&f?.(d)||d.hasAttribute?.("data-lenis-prevent")||h==="vertical"&&d.hasAttribute?.("data-lenis-prevent-vertical")||h==="horizontal"&&d.hasAttribute?.("data-lenis-prevent-horizontal")||s&&d.hasAttribute?.("data-lenis-prevent-touch")||n&&d.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(d,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){r.cancelable&&r.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&n)){this.isScrolling="native",this.animate.stop(),r.lenisStopPropagation=!0;return}let m=t;this.options.gestureOrientation==="both"?m=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(m=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(r.lenisStopPropagation=!0),r.cancelable&&r.preventDefault();const u=s&&this.options.syncTouch,o=s&&r.type==="touchend";o&&(m=Math.sign(m)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+m,{programmatic:!1,...u?{lerp:o?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const i=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-i,this.direction=Math.sign(this.animatedScroll-i),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=i=>{const e=i-(this.time||i);this.time=i,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(i,{offset:e=0,immediate:t=!1,lock:r=!1,programmatic:s=!0,lerp:n=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:l=s?this.options.easing:void 0,onStart:c,onComplete:f,force:h=!1,userData:m}={}){if((this.isStopped||this.isLocked)&&!h)return;let u=i,o=e;if(typeof u=="string"&&["top","left","start","#"].includes(u))u=0;else if(typeof u=="string"&&["bottom","right","end"].includes(u))u=this.limit;else{let d=null;if(typeof u=="string"?(d=u.startsWith("#")?document.getElementById(u.slice(1)):document.querySelector(u),d||(u==="#top"?u=0:console.warn("Lenis: Target not found",u))):u instanceof HTMLElement&&u?.nodeType&&(d=u),d){if(this.options.wrapper!==window){const M=this.rootElement.getBoundingClientRect();o-=this.isHorizontal?M.left:M.top}const v=d.getBoundingClientRect(),p=getComputedStyle(d),g=this.isHorizontal?Number.parseFloat(p.scrollMarginLeft):Number.parseFloat(p.scrollMarginTop),E=getComputedStyle(this.rootElement),A=this.isHorizontal?Number.parseFloat(E.scrollPaddingLeft):Number.parseFloat(E.scrollPaddingTop);u=(this.isHorizontal?v.left:v.top)+this.animatedScroll-(Number.isNaN(g)?0:g)-(Number.isNaN(A)?0:A)}}if(typeof u=="number"){if(u+=o,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;const d=u-this.animatedScroll;d>this.limit/2?u-=this.limit:d<-this.limit/2&&(u+=this.limit)}}else u=Ol(0,u,this.limit);if(u===this.targetScroll){c?.(this),f?.(this);return}if(this.userData=m??{},t){this.animatedScroll=this.targetScroll=u,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),f?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=u),typeof a=="number"&&typeof l!="function"?l=Eo:typeof l=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,u,{duration:a,easing:l,lerp:n,onStart:()=>{r&&(this.isLocked=!0),this.isScrolling="smooth",c?.(this)},onUpdate:(d,v)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=d-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=d,this.setScroll(this.scroll),s&&(this.targetScroll=d),v||this.emit(),v&&(this.reset(),this.emit(),f?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(i,{deltaX:e,deltaY:t}){const r=Date.now();i._lenis||(i._lenis={});const s=i._lenis;let n,a,l,c,f,h,m,u,o,d;if(r-(s.time??0)>2e3){s.time=Date.now();const S=window.getComputedStyle(i);if(s.computedStyle=S,n=["auto","overlay","scroll"].includes(S.overflowX),a=["auto","overlay","scroll"].includes(S.overflowY),f=["auto"].includes(S.overscrollBehaviorX),h=["auto"].includes(S.overscrollBehaviorY),s.hasOverflowX=n,s.hasOverflowY=a,!(n||a))return!1;m=i.scrollWidth,u=i.scrollHeight,o=i.clientWidth,d=i.clientHeight,l=m>o,c=u>d,s.isScrollableX=l,s.isScrollableY=c,s.scrollWidth=m,s.scrollHeight=u,s.clientWidth=o,s.clientHeight=d,s.hasOverscrollBehaviorX=f,s.hasOverscrollBehaviorY=h}else l=s.isScrollableX,c=s.isScrollableY,n=s.hasOverflowX,a=s.hasOverflowY,m=s.scrollWidth,u=s.scrollHeight,o=s.clientWidth,d=s.clientHeight,f=s.hasOverscrollBehaviorX,h=s.hasOverscrollBehaviorY;if(!(n&&l||a&&c))return!1;const v=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";let p,g,E,A,M,_;if(v==="horizontal")p=Math.round(i.scrollLeft),g=m-o,E=e,A=n,M=l,_=f;else if(v==="vertical")p=Math.round(i.scrollTop),g=u-d,E=t,A=a,M=c,_=h;else return!1;return!_&&(p>=g||p<=0)?!0:(E>0?p<g:p>0)&&A&&M}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const i=this.options.wrapper;return this.isHorizontal?i.scrollX??i.scrollLeft:i.scrollY??i.scrollTop}get scroll(){return this.options.infinite?$c(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(i){this._isScrolling!==i&&(this._isScrolling=i,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(i){this._isStopped!==i&&(this._isStopped=i,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(i){this._isLocked!==i&&(this._isLocked=i,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let i="lenis";return this.options.autoToggle&&(i+=" lenis-autoToggle"),this.isStopped&&(i+=" lenis-stopped"),this.isLocked&&(i+=" lenis-locked"),this.isScrolling&&(i+=" lenis-scrolling"),this.isScrolling==="smooth"&&(i+=" lenis-smooth"),i}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(i=>{this.rootElement.classList.add(i)})}cleanUpClassName(){for(const i of Array.from(this.rootElement.classList))(i==="lenis"||i.startsWith("lenis-"))&&this.rootElement.classList.remove(i)}};const za="185",tu=0,To=1,nu=2,Nr=1,iu=2,$i=3,Wn=0,It=1,_n=2,Sn=0,Li=1,bo=2,Ao=3,wo=4,zl=5,jn=100,ru=101,su=102,au=103,ou=104,lu=200,Hl=201,cu=202,uu=203,qs=204,kr=205,fu=206,hu=207,du=208,pu=209,mu=210,gu=211,vu=212,xu=213,_u=214,$s=0,Ks=1,Zs=2,Ui=3,Js=4,Qs=5,js=6,ea=7,Vl=0,Su=1,Mu=2,cn=0,Gl=1,kl=2,Wl=3,Xl=4,Yl=5,ql=6,$l=7,Kl=300,ri=301,Ni=302,os=303,ls=304,jr=306,ta=1e3,Jt=1001,na=1002,bt=1003,yu=1004,ur=1005,vt=1006,cs=1007,zn=1008,Gt=1009,Zl=1010,Jl=1011,Qi=1012,Ha=1013,hn=1014,on=1015,En=1016,Va=1017,Ga=1018,ji=1020,Ql=35902,jl=35899,ec=1021,tc=1022,kt=1023,Tn=1026,ti=1027,nc=1028,ka=1029,si=1030,Wa=1031,Xa=1033,Fr=33776,Or=33777,Br=33778,zr=33779,ia=35840,ra=35841,sa=35842,aa=35843,oa=36196,la=37492,ca=37496,ua=37488,fa=37489,Wr=37490,ha=37491,da=37808,pa=37809,ma=37810,ga=37811,va=37812,xa=37813,_a=37814,Sa=37815,Ma=37816,ya=37817,Ea=37818,Ta=37819,ba=37820,Aa=37821,wa=36492,Ra=36494,Ca=36495,Pa=36283,La=36284,Xr=36285,Da=36286,Eu=3200,Ro=0,Tu=1,Bn="",Dt="srgb",Yr="srgb-linear",qr="linear",tt="srgb",fi=7680,Co=519,bu=512,Au=513,wu=514,Ya=515,Ru=516,Cu=517,qa=518,Pu=519,Po=35044,Lo="300 es",ln=2e3,$r=2001;function Lu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function er(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Du(){const i=er("canvas");return i.style.display="block",i}const Do={};function Io(...i){const e="THREE."+i.shift();console.log(e,...i)}function ic(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ie(...i){i=ic(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ke(...i){i=ic(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Di(...i){const e=i.join(" ");e in Do||(Do[e]=!0,Ie(...i))}function Iu(i,e,t){return new Promise(function(r,s){function n(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:r()}}setTimeout(n,t)})}const Uu={[$s]:Ks,[Zs]:js,[Js]:ea,[Ui]:Qs,[Ks]:$s,[js]:Zs,[ea]:Js,[Qs]:Ui};class li{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){const r=this._listeners;if(r===void 0)return;const s=r[e];if(s!==void 0){const n=s.indexOf(t);n!==-1&&s.splice(n,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const r=t[e.type];if(r!==void 0){e.target=this;const s=r.slice(0);for(let n=0,a=s.length;n<a;n++)s[n].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],us=Math.PI/180,Ia=180/Math.PI;function rr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[r&255]+Rt[r>>8&255]+Rt[r>>16&255]+Rt[r>>24&255]).toLowerCase()}function ke(i,e,t){return Math.max(e,Math.min(t,i))}function Nu(i,e){return(i%e+e)%e}function fs(i,e,t){return(1-t)*i+t*e}function Vi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ao=class ao{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,s=e.elements;return this.x=s[0]*t+s[3]*r+s[6],this.y=s[1]*t+s[4]*r+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ke(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(ke(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),s=Math.sin(t),n=this.x-e.x,a=this.y-e.y;return this.x=n*r-a*s+e.x,this.y=n*s+a*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ao.prototype.isVector2=!0;let He=ao;class zi{constructor(e=0,t=0,r=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=s}static slerpFlat(e,t,r,s,n,a,l){let c=r[s+0],f=r[s+1],h=r[s+2],m=r[s+3],u=n[a+0],o=n[a+1],d=n[a+2],v=n[a+3];if(m!==v||c!==u||f!==o||h!==d){let p=c*u+f*o+h*d+m*v;p<0&&(u=-u,o=-o,d=-d,v=-v,p=-p);let g=1-l;if(p<.9995){const E=Math.acos(p),A=Math.sin(E);g=Math.sin(g*E)/A,l=Math.sin(l*E)/A,c=c*g+u*l,f=f*g+o*l,h=h*g+d*l,m=m*g+v*l}else{c=c*g+u*l,f=f*g+o*l,h=h*g+d*l,m=m*g+v*l;const E=1/Math.sqrt(c*c+f*f+h*h+m*m);c*=E,f*=E,h*=E,m*=E}}e[t]=c,e[t+1]=f,e[t+2]=h,e[t+3]=m}static multiplyQuaternionsFlat(e,t,r,s,n,a){const l=r[s],c=r[s+1],f=r[s+2],h=r[s+3],m=n[a],u=n[a+1],o=n[a+2],d=n[a+3];return e[t]=l*d+h*m+c*o-f*u,e[t+1]=c*d+h*u+f*m-l*o,e[t+2]=f*d+h*o+l*u-c*m,e[t+3]=h*d-l*m-c*u-f*o,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,s){return this._x=e,this._y=t,this._z=r,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,s=e._y,n=e._z,a=e._order,l=Math.cos,c=Math.sin,f=l(r/2),h=l(s/2),m=l(n/2),u=c(r/2),o=c(s/2),d=c(n/2);switch(a){case"XYZ":this._x=u*h*m+f*o*d,this._y=f*o*m-u*h*d,this._z=f*h*d+u*o*m,this._w=f*h*m-u*o*d;break;case"YXZ":this._x=u*h*m+f*o*d,this._y=f*o*m-u*h*d,this._z=f*h*d-u*o*m,this._w=f*h*m+u*o*d;break;case"ZXY":this._x=u*h*m-f*o*d,this._y=f*o*m+u*h*d,this._z=f*h*d+u*o*m,this._w=f*h*m-u*o*d;break;case"ZYX":this._x=u*h*m-f*o*d,this._y=f*o*m+u*h*d,this._z=f*h*d-u*o*m,this._w=f*h*m+u*o*d;break;case"YZX":this._x=u*h*m+f*o*d,this._y=f*o*m+u*h*d,this._z=f*h*d-u*o*m,this._w=f*h*m-u*o*d;break;case"XZY":this._x=u*h*m-f*o*d,this._y=f*o*m-u*h*d,this._z=f*h*d+u*o*m,this._w=f*h*m+u*o*d;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,s=Math.sin(r);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],s=t[4],n=t[8],a=t[1],l=t[5],c=t[9],f=t[2],h=t[6],m=t[10],u=r+l+m;if(u>0){const o=.5/Math.sqrt(u+1);this._w=.25/o,this._x=(h-c)*o,this._y=(n-f)*o,this._z=(a-s)*o}else if(r>l&&r>m){const o=2*Math.sqrt(1+r-l-m);this._w=(h-c)/o,this._x=.25*o,this._y=(s+a)/o,this._z=(n+f)/o}else if(l>m){const o=2*Math.sqrt(1+l-r-m);this._w=(n-f)/o,this._x=(s+a)/o,this._y=.25*o,this._z=(c+h)/o}else{const o=2*Math.sqrt(1+m-r-l);this._w=(a-s)/o,this._x=(n+f)/o,this._y=(c+h)/o,this._z=.25*o}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ke(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const s=Math.min(1,t/r);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,s=e._y,n=e._z,a=e._w,l=t._x,c=t._y,f=t._z,h=t._w;return this._x=r*h+a*l+s*f-n*c,this._y=s*h+a*c+n*l-r*f,this._z=n*h+a*f+r*c-s*l,this._w=a*h-r*l-s*c-n*f,this._onChangeCallback(),this}slerp(e,t){let r=e._x,s=e._y,n=e._z,a=e._w,l=this.dot(e);l<0&&(r=-r,s=-s,n=-n,a=-a,l=-l);let c=1-t;if(l<.9995){const f=Math.acos(l),h=Math.sin(f);c=Math.sin(c*f)/h,t=Math.sin(t*f)/h,this._x=this._x*c+r*t,this._y=this._y*c+s*t,this._z=this._z*c+n*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+r*t,this._y=this._y*c+s*t,this._z=this._z*c+n*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),s=Math.sqrt(1-r),n=Math.sqrt(r);return this.set(s*Math.sin(e),s*Math.cos(e),n*Math.sin(t),n*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const oo=class oo{constructor(e=0,t=0,r=0){this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,s=this.z,n=e.elements;return this.x=n[0]*t+n[3]*r+n[6]*s,this.y=n[1]*t+n[4]*r+n[7]*s,this.z=n[2]*t+n[5]*r+n[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,s=this.z,n=e.elements,a=1/(n[3]*t+n[7]*r+n[11]*s+n[15]);return this.x=(n[0]*t+n[4]*r+n[8]*s+n[12])*a,this.y=(n[1]*t+n[5]*r+n[9]*s+n[13])*a,this.z=(n[2]*t+n[6]*r+n[10]*s+n[14])*a,this}applyQuaternion(e){const t=this.x,r=this.y,s=this.z,n=e.x,a=e.y,l=e.z,c=e.w,f=2*(a*s-l*r),h=2*(l*t-n*s),m=2*(n*r-a*t);return this.x=t+c*f+a*m-l*h,this.y=r+c*h+l*f-n*m,this.z=s+c*m+n*h-a*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,s=this.z,n=e.elements;return this.x=n[0]*t+n[4]*r+n[8]*s,this.y=n[1]*t+n[5]*r+n[9]*s,this.z=n[2]*t+n[6]*r+n[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ke(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,s=e.y,n=e.z,a=t.x,l=t.y,c=t.z;return this.x=s*c-n*l,this.y=n*a-r*c,this.z=r*l-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return hs.copy(this).projectOnVector(e),this.sub(hs)}reflect(e){return this.sub(hs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(ke(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,s=this.z-e.z;return t*t+r*r+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const s=Math.sin(t)*e;return this.x=s*Math.sin(r),this.y=Math.cos(t)*e,this.z=s*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};oo.prototype.isVector3=!0;let Y=oo;const hs=new Y,Uo=new zi,lo=class lo{constructor(e,t,r,s,n,a,l,c,f){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,s,n,a,l,c,f)}set(e,t,r,s,n,a,l,c,f){const h=this.elements;return h[0]=e,h[1]=s,h[2]=l,h[3]=t,h[4]=n,h[5]=c,h[6]=r,h[7]=a,h[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,s=t.elements,n=this.elements,a=r[0],l=r[3],c=r[6],f=r[1],h=r[4],m=r[7],u=r[2],o=r[5],d=r[8],v=s[0],p=s[3],g=s[6],E=s[1],A=s[4],M=s[7],_=s[2],S=s[5],T=s[8];return n[0]=a*v+l*E+c*_,n[3]=a*p+l*A+c*S,n[6]=a*g+l*M+c*T,n[1]=f*v+h*E+m*_,n[4]=f*p+h*A+m*S,n[7]=f*g+h*M+m*T,n[2]=u*v+o*E+d*_,n[5]=u*p+o*A+d*S,n[8]=u*g+o*M+d*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],s=e[2],n=e[3],a=e[4],l=e[5],c=e[6],f=e[7],h=e[8];return t*a*h-t*l*f-r*n*h+r*l*c+s*n*f-s*a*c}invert(){const e=this.elements,t=e[0],r=e[1],s=e[2],n=e[3],a=e[4],l=e[5],c=e[6],f=e[7],h=e[8],m=h*a-l*f,u=l*c-h*n,o=f*n-a*c,d=t*m+r*u+s*o;if(d===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/d;return e[0]=m*v,e[1]=(s*f-h*r)*v,e[2]=(l*r-s*a)*v,e[3]=u*v,e[4]=(h*t-s*c)*v,e[5]=(s*n-l*t)*v,e[6]=o*v,e[7]=(r*c-f*t)*v,e[8]=(a*t-r*n)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,s,n,a,l){const c=Math.cos(n),f=Math.sin(n);return this.set(r*c,r*f,-r*(c*a+f*l)+a+e,-s*f,s*c,-s*(-f*a+c*l)+l+t,0,0,1),this}scale(e,t){return Di("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ds.makeScale(e,t)),this}rotate(e){return Di("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ds.makeRotation(-e)),this}translate(e,t){return Di("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ds.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let s=0;s<9;s++)if(t[s]!==r[s])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}};lo.prototype.isMatrix3=!0;let Ue=lo;const ds=new Ue,No=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fo=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Fu(){const i={enabled:!0,workingColorSpace:Yr,spaces:{},convert:function(s,n,a){return this.enabled===!1||n===a||!n||!a||(this.spaces[n].transfer===tt&&(s.r=Mn(s.r),s.g=Mn(s.g),s.b=Mn(s.b)),this.spaces[n].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===tt&&(s.r=Ii(s.r),s.g=Ii(s.g),s.b=Ii(s.b))),s},workingToColorSpace:function(s,n){return this.convert(s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bn?qr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,a){return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return Di("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){return Di("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,n)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],r=[.3127,.329];return i.define({[Yr]:{primaries:e,whitePoint:r,transfer:qr,toXYZ:No,fromXYZ:Fo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Dt},outputColorSpaceConfig:{drawingBufferColorSpace:Dt}},[Dt]:{primaries:e,whitePoint:r,transfer:tt,toXYZ:No,fromXYZ:Fo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Dt}}}),i}const Ge=Fu();function Mn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ii(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let hi;class Ou{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{hi===void 0&&(hi=er("canvas")),hi.width=e.width,hi.height=e.height;const s=hi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),r=hi}return r.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=er("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const s=r.getImageData(0,0,e.width,e.height),n=s.data;for(let a=0;a<n.length;a++)n[a]=Mn(n[a]/255)*255;return r.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Mn(t[r]/255)*255):t[r]=Mn(t[r]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Bu=0;class $a{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=rr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.isArray(s)){n=[];for(let a=0,l=s.length;a<l;a++)s[a].isDataTexture?n.push(ps(s[a].image)):n.push(ps(s[a]))}else n=ps(s);r.url=n}return t||(e.images[this.uuid]=r),r}}function ps(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ou.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let zu=0;const ms=new Y;class At extends li{constructor(e=At.DEFAULT_IMAGE,t=At.DEFAULT_MAPPING,r=Jt,s=Jt,n=vt,a=zn,l=kt,c=Gt,f=At.DEFAULT_ANISOTROPY,h=Bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=rr(),this.name="",this.source=new $a(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=s,this.magFilter=n,this.minFilter=a,this.anisotropy=f,this.format=l,this.internalFormat=null,this.type=c,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ms).x}get height(){return this.source.getSize(ms).y}get depth(){return this.source.getSize(ms).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const r=e[t];if(r===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&r&&s.isVector2&&r.isVector2||s&&r&&s.isVector3&&r.isVector3||s&&r&&s.isMatrix3&&r.isMatrix3?s.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ta:e.x=e.x-Math.floor(e.x);break;case Jt:e.x=e.x<0?0:1;break;case na:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ta:e.y=e.y-Math.floor(e.y);break;case Jt:e.y=e.y<0?0:1;break;case na:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}At.DEFAULT_IMAGE=null;At.DEFAULT_MAPPING=Kl;At.DEFAULT_ANISOTROPY=1;const co=class co{constructor(e=0,t=0,r=0,s=1){this.x=e,this.y=t,this.z=r,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,s){return this.x=e,this.y=t,this.z=r,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,s=this.z,n=this.w,a=e.elements;return this.x=a[0]*t+a[4]*r+a[8]*s+a[12]*n,this.y=a[1]*t+a[5]*r+a[9]*s+a[13]*n,this.z=a[2]*t+a[6]*r+a[10]*s+a[14]*n,this.w=a[3]*t+a[7]*r+a[11]*s+a[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,s,n;const c=e.elements,f=c[0],h=c[4],m=c[8],u=c[1],o=c[5],d=c[9],v=c[2],p=c[6],g=c[10];if(Math.abs(h-u)<.01&&Math.abs(m-v)<.01&&Math.abs(d-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(m+v)<.1&&Math.abs(d+p)<.1&&Math.abs(f+o+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(f+1)/2,M=(o+1)/2,_=(g+1)/2,S=(h+u)/4,T=(m+v)/4,x=(d+p)/4;return A>M&&A>_?A<.01?(r=0,s=.707106781,n=.707106781):(r=Math.sqrt(A),s=S/r,n=T/r):M>_?M<.01?(r=.707106781,s=0,n=.707106781):(s=Math.sqrt(M),r=S/s,n=x/s):_<.01?(r=.707106781,s=.707106781,n=0):(n=Math.sqrt(_),r=T/n,s=x/n),this.set(r,s,n,t),this}let E=Math.sqrt((p-d)*(p-d)+(m-v)*(m-v)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(p-d)/E,this.y=(m-v)/E,this.z=(u-h)/E,this.w=Math.acos((f+o+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this.w=ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this.w=ke(this.w,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(ke(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};co.prototype.isVector4=!0;let ft=co;class Hu extends li{constructor(e=1,t=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},r),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=r.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:r.depth},n=new At(s),a=r.count;for(let l=0;l<a;l++)this.textures[l]=n.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview,this.useArrayDepthTexture=r.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:vt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let s=0,n=this.textures.length;s<n;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=r,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,r=e.textures.length;t<r;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new $a(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qt extends Hu{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class rc extends At{constructor(e=null,t=1,r=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=Jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vu extends At{constructor(e=null,t=1,r=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=Jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Qr=class Qr{constructor(e,t,r,s,n,a,l,c,f,h,m,u,o,d,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,s,n,a,l,c,f,h,m,u,o,d,v,p)}set(e,t,r,s,n,a,l,c,f,h,m,u,o,d,v,p){const g=this.elements;return g[0]=e,g[4]=t,g[8]=r,g[12]=s,g[1]=n,g[5]=a,g[9]=l,g[13]=c,g[2]=f,g[6]=h,g[10]=m,g[14]=u,g[3]=o,g[7]=d,g[11]=v,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qr().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),r.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,r=e.elements,s=1/di.setFromMatrixColumn(e,0).length(),n=1/di.setFromMatrixColumn(e,1).length(),a=1/di.setFromMatrixColumn(e,2).length();return t[0]=r[0]*s,t[1]=r[1]*s,t[2]=r[2]*s,t[3]=0,t[4]=r[4]*n,t[5]=r[5]*n,t[6]=r[6]*n,t[7]=0,t[8]=r[8]*a,t[9]=r[9]*a,t[10]=r[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,s=e.y,n=e.z,a=Math.cos(r),l=Math.sin(r),c=Math.cos(s),f=Math.sin(s),h=Math.cos(n),m=Math.sin(n);if(e.order==="XYZ"){const u=a*h,o=a*m,d=l*h,v=l*m;t[0]=c*h,t[4]=-c*m,t[8]=f,t[1]=o+d*f,t[5]=u-v*f,t[9]=-l*c,t[2]=v-u*f,t[6]=d+o*f,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,o=c*m,d=f*h,v=f*m;t[0]=u+v*l,t[4]=d*l-o,t[8]=a*f,t[1]=a*m,t[5]=a*h,t[9]=-l,t[2]=o*l-d,t[6]=v+u*l,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,o=c*m,d=f*h,v=f*m;t[0]=u-v*l,t[4]=-a*m,t[8]=d+o*l,t[1]=o+d*l,t[5]=a*h,t[9]=v-u*l,t[2]=-a*f,t[6]=l,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,o=a*m,d=l*h,v=l*m;t[0]=c*h,t[4]=d*f-o,t[8]=u*f+v,t[1]=c*m,t[5]=v*f+u,t[9]=o*f-d,t[2]=-f,t[6]=l*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,o=a*f,d=l*c,v=l*f;t[0]=c*h,t[4]=v-u*m,t[8]=d*m+o,t[1]=m,t[5]=a*h,t[9]=-l*h,t[2]=-f*h,t[6]=o*m+d,t[10]=u-v*m}else if(e.order==="XZY"){const u=a*c,o=a*f,d=l*c,v=l*f;t[0]=c*h,t[4]=-m,t[8]=f*h,t[1]=u*m+v,t[5]=a*h,t[9]=o*m-d,t[2]=d*m-o,t[6]=l*h,t[10]=v*m+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gu,e,ku)}lookAt(e,t,r){const s=this.elements;return Nt.subVectors(e,t),Nt.lengthSq()===0&&(Nt.z=1),Nt.normalize(),Ln.crossVectors(r,Nt),Ln.lengthSq()===0&&(Math.abs(r.z)===1?Nt.x+=1e-4:Nt.z+=1e-4,Nt.normalize(),Ln.crossVectors(r,Nt)),Ln.normalize(),fr.crossVectors(Nt,Ln),s[0]=Ln.x,s[4]=fr.x,s[8]=Nt.x,s[1]=Ln.y,s[5]=fr.y,s[9]=Nt.y,s[2]=Ln.z,s[6]=fr.z,s[10]=Nt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,s=t.elements,n=this.elements,a=r[0],l=r[4],c=r[8],f=r[12],h=r[1],m=r[5],u=r[9],o=r[13],d=r[2],v=r[6],p=r[10],g=r[14],E=r[3],A=r[7],M=r[11],_=r[15],S=s[0],T=s[4],x=s[8],y=s[12],w=s[1],R=s[5],C=s[9],D=s[13],N=s[2],I=s[6],z=s[10],U=s[14],W=s[3],K=s[7],ie=s[11],se=s[15];return n[0]=a*S+l*w+c*N+f*W,n[4]=a*T+l*R+c*I+f*K,n[8]=a*x+l*C+c*z+f*ie,n[12]=a*y+l*D+c*U+f*se,n[1]=h*S+m*w+u*N+o*W,n[5]=h*T+m*R+u*I+o*K,n[9]=h*x+m*C+u*z+o*ie,n[13]=h*y+m*D+u*U+o*se,n[2]=d*S+v*w+p*N+g*W,n[6]=d*T+v*R+p*I+g*K,n[10]=d*x+v*C+p*z+g*ie,n[14]=d*y+v*D+p*U+g*se,n[3]=E*S+A*w+M*N+_*W,n[7]=E*T+A*R+M*I+_*K,n[11]=E*x+A*C+M*z+_*ie,n[15]=E*y+A*D+M*U+_*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],s=e[8],n=e[12],a=e[1],l=e[5],c=e[9],f=e[13],h=e[2],m=e[6],u=e[10],o=e[14],d=e[3],v=e[7],p=e[11],g=e[15],E=c*o-f*u,A=l*o-f*m,M=l*u-c*m,_=a*o-f*h,S=a*u-c*h,T=a*m-l*h;return t*(v*E-p*A+g*M)-r*(d*E-p*_+g*S)+s*(d*A-v*_+g*T)-n*(d*M-v*S+p*T)}determinantAffine(){const e=this.elements,t=e[0],r=e[4],s=e[8],n=e[1],a=e[5],l=e[9],c=e[2],f=e[6],h=e[10];return t*(a*h-l*f)-r*(n*h-l*c)+s*(n*f-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],s=e[2],n=e[3],a=e[4],l=e[5],c=e[6],f=e[7],h=e[8],m=e[9],u=e[10],o=e[11],d=e[12],v=e[13],p=e[14],g=e[15],E=t*l-r*a,A=t*c-s*a,M=t*f-n*a,_=r*c-s*l,S=r*f-n*l,T=s*f-n*c,x=h*v-m*d,y=h*p-u*d,w=h*g-o*d,R=m*p-u*v,C=m*g-o*v,D=u*g-o*p,N=E*D-A*C+M*R+_*w-S*y+T*x;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/N;return e[0]=(l*D-c*C+f*R)*I,e[1]=(s*C-r*D-n*R)*I,e[2]=(v*T-p*S+g*_)*I,e[3]=(u*S-m*T-o*_)*I,e[4]=(c*w-a*D-f*y)*I,e[5]=(t*D-s*w+n*y)*I,e[6]=(p*M-d*T-g*A)*I,e[7]=(h*T-u*M+o*A)*I,e[8]=(a*C-l*w+f*x)*I,e[9]=(r*w-t*C-n*x)*I,e[10]=(d*S-v*M+g*E)*I,e[11]=(m*M-h*S-o*E)*I,e[12]=(l*y-a*R-c*x)*I,e[13]=(t*R-r*y+s*x)*I,e[14]=(v*A-d*_-p*E)*I,e[15]=(h*_-m*A+u*E)*I,this}scale(e){const t=this.elements,r=e.x,s=e.y,n=e.z;return t[0]*=r,t[4]*=s,t[8]*=n,t[1]*=r,t[5]*=s,t[9]*=n,t[2]*=r,t[6]*=s,t[10]*=n,t[3]*=r,t[7]*=s,t[11]*=n,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,s))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),s=Math.sin(t),n=1-r,a=e.x,l=e.y,c=e.z,f=n*a,h=n*l;return this.set(f*a+r,f*l-s*c,f*c+s*l,0,f*l+s*c,h*l+r,h*c-s*a,0,f*c-s*l,h*c+s*a,n*c*c+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,s,n,a){return this.set(1,r,n,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,r){const s=this.elements,n=t._x,a=t._y,l=t._z,c=t._w,f=n+n,h=a+a,m=l+l,u=n*f,o=n*h,d=n*m,v=a*h,p=a*m,g=l*m,E=c*f,A=c*h,M=c*m,_=r.x,S=r.y,T=r.z;return s[0]=(1-(v+g))*_,s[1]=(o+M)*_,s[2]=(d-A)*_,s[3]=0,s[4]=(o-M)*S,s[5]=(1-(u+g))*S,s[6]=(p+E)*S,s[7]=0,s[8]=(d+A)*T,s[9]=(p-E)*T,s[10]=(1-(u+v))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,r){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const n=this.determinantAffine();if(n===0)return r.set(1,1,1),t.identity(),this;let a=di.set(s[0],s[1],s[2]).length();const l=di.set(s[4],s[5],s[6]).length(),c=di.set(s[8],s[9],s[10]).length();n<0&&(a=-a),Xt.copy(this);const f=1/a,h=1/l,m=1/c;return Xt.elements[0]*=f,Xt.elements[1]*=f,Xt.elements[2]*=f,Xt.elements[4]*=h,Xt.elements[5]*=h,Xt.elements[6]*=h,Xt.elements[8]*=m,Xt.elements[9]*=m,Xt.elements[10]*=m,t.setFromRotationMatrix(Xt),r.x=a,r.y=l,r.z=c,this}makePerspective(e,t,r,s,n,a,l=ln,c=!1){const f=this.elements,h=2*n/(t-e),m=2*n/(r-s),u=(t+e)/(t-e),o=(r+s)/(r-s);let d,v;if(c)d=n/(a-n),v=a*n/(a-n);else if(l===ln)d=-(a+n)/(a-n),v=-2*a*n/(a-n);else if(l===$r)d=-a/(a-n),v=-a*n/(a-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return f[0]=h,f[4]=0,f[8]=u,f[12]=0,f[1]=0,f[5]=m,f[9]=o,f[13]=0,f[2]=0,f[6]=0,f[10]=d,f[14]=v,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,t,r,s,n,a,l=ln,c=!1){const f=this.elements,h=2/(t-e),m=2/(r-s),u=-(t+e)/(t-e),o=-(r+s)/(r-s);let d,v;if(c)d=1/(a-n),v=a/(a-n);else if(l===ln)d=-2/(a-n),v=-(a+n)/(a-n);else if(l===$r)d=-1/(a-n),v=-n/(a-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return f[0]=h,f[4]=0,f[8]=0,f[12]=u,f[1]=0,f[5]=m,f[9]=0,f[13]=o,f[2]=0,f[6]=0,f[10]=d,f[14]=v,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let s=0;s<16;s++)if(t[s]!==r[s])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}};Qr.prototype.isMatrix4=!0;let _t=Qr;const di=new Y,Xt=new _t,Gu=new Y(0,0,0),ku=new Y(1,1,1),Ln=new Y,fr=new Y,Nt=new Y,Oo=new _t,Bo=new zi;class ai{constructor(e=0,t=0,r=0,s=ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,s=this._order){return this._x=e,this._y=t,this._z=r,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const s=e.elements,n=s[0],a=s[4],l=s[8],c=s[1],f=s[5],h=s[9],m=s[2],u=s[6],o=s[10];switch(t){case"XYZ":this._y=Math.asin(ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,o),this._z=Math.atan2(-a,n)):(this._x=Math.atan2(u,f),this._z=0);break;case"YXZ":this._x=Math.asin(-ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(l,o),this._z=Math.atan2(c,f)):(this._y=Math.atan2(-m,n),this._z=0);break;case"ZXY":this._x=Math.asin(ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-m,o),this._z=Math.atan2(-a,f)):(this._y=0,this._z=Math.atan2(c,n));break;case"ZYX":this._y=Math.asin(-ke(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(u,o),this._z=Math.atan2(c,n)):(this._x=0,this._z=Math.atan2(-a,f));break;case"YZX":this._z=Math.asin(ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,f),this._y=Math.atan2(-m,n)):(this._x=0,this._y=Math.atan2(l,o));break;case"XZY":this._z=Math.asin(-ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,f),this._y=Math.atan2(l,n)):(this._x=Math.atan2(-h,o),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Oo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Oo,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bo.setFromEuler(this),this.setFromQuaternion(Bo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ai.DEFAULT_ORDER="XYZ";class sc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Wu=0;const zo=new Y,pi=new zi,dn=new _t,hr=new Y,Gi=new Y,Xu=new Y,Yu=new zi,Ho=new Y(1,0,0),Vo=new Y(0,1,0),Go=new Y(0,0,1),ko={type:"added"},qu={type:"removed"},mi={type:"childadded",child:null},gs={type:"childremoved",child:null};class Ot extends li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new Y,t=new ai,r=new zi,s=new Y(1,1,1);function n(){r.setFromEuler(t,!1)}function a(){t.setFromQuaternion(r,void 0,!1)}t._onChange(n),r._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new Ue}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return pi.setFromAxisAngle(e,t),this.quaternion.multiply(pi),this}rotateOnWorldAxis(e,t){return pi.setFromAxisAngle(e,t),this.quaternion.premultiply(pi),this}rotateX(e){return this.rotateOnAxis(Ho,e)}rotateY(e){return this.rotateOnAxis(Vo,e)}rotateZ(e){return this.rotateOnAxis(Go,e)}translateOnAxis(e,t){return zo.copy(e).applyQuaternion(this.quaternion),this.position.add(zo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ho,e)}translateY(e){return this.translateOnAxis(Vo,e)}translateZ(e){return this.translateOnAxis(Go,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?hr.copy(e):hr.set(e,t,r);const s=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(Gi,hr,this.up):dn.lookAt(hr,Gi,this.up),this.quaternion.setFromRotationMatrix(dn),s&&(dn.extractRotation(s.matrixWorld),pi.setFromRotationMatrix(dn),this.quaternion.premultiply(pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ko),mi.child=e,this.dispatchEvent(mi),mi.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(qu),gs.child=e,this.dispatchEvent(gs),gs.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ko),mi.child=e,this.dispatchEvent(mi),mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,s=this.children.length;r<s;r++){const a=this.children[r].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const s=this.children;for(let n=0,a=s.length;n<a;n++)s[n].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,e,Xu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,Yu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,s=t.length;r<s;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,s=t.length;r<s;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,r=e.y,s=e.z,n=this.matrix.elements;n[12]+=t-n[0]*t-n[4]*r-n[8]*s,n[13]+=r-n[1]*t-n[5]*r-n[9]*s,n[14]+=s-n[2]*t-n[6]*r-n[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,s=t.length;r<s;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t,r=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||r)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,r=!0),t===!0){const n=this.children;for(let a=0,l=n.length;a<l;a++)n[a].updateWorldMatrix(!1,!0,r)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(l=>({...l})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=n(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let f=0,h=c.length;f<h;f++){const m=c[f];n(e.shapes,m)}else n(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,f=this.material.length;c<f;c++)l.push(n(e.materials,this.material[c]));s.material=l}else s.material=n(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(n(e.animations,c))}}if(t){const l=a(e.geometries),c=a(e.materials),f=a(e.textures),h=a(e.images),m=a(e.shapes),u=a(e.skeletons),o=a(e.animations),d=a(e.nodes);l.length>0&&(r.geometries=l),c.length>0&&(r.materials=c),f.length>0&&(r.textures=f),h.length>0&&(r.images=h),m.length>0&&(r.shapes=m),u.length>0&&(r.skeletons=u),o.length>0&&(r.animations=o),d.length>0&&(r.nodes=d)}return r.object=s,r;function a(l){const c=[];for(const f in l){const h=l[f];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const s=e.children[r];this.add(s.clone())}return this}}Ot.DEFAULT_UP=new Y(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class dr extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $u={type:"move"};class vs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let s=null,n=null,a=null;const l=this._targetRay,c=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,r),g=this._getHandJoint(f,v);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const h=f.joints["index-finger-tip"],m=f.joints["thumb-tip"],u=h.position.distanceTo(m.position),o=.02,d=.005;f.inputState.pinching&&u>o+d?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&u<=o-d&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,r),n!==null&&(c.matrix.fromArray(n.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,n.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(n.linearVelocity)):c.hasLinearVelocity=!1,n.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(n.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));l!==null&&(s=t.getPose(e.targetRaySpace,r),s===null&&n!==null&&(s=n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent($u)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=n!==null),f!==null&&(f.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new dr;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const ac={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},pr={h:0,s:0,l:0};function xs(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class et{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.colorSpaceToWorking(this,t),this}setRGB(e,t,r,s=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=r,Ge.colorSpaceToWorking(this,s),this}setHSL(e,t,r,s=Ge.workingColorSpace){if(e=Nu(e,1),t=ke(t,0,1),r=ke(r,0,1),t===0)this.r=this.g=this.b=r;else{const n=r<=.5?r*(1+t):r+t-r*t,a=2*r-n;this.r=xs(a,n,e+1/3),this.g=xs(a,n,e),this.b=xs(a,n,e-1/3)}return Ge.colorSpaceToWorking(this,s),this}setStyle(e,t=Dt){function r(n){n!==void 0&&parseFloat(n)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let n;const a=s[1],l=s[2];switch(a){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return r(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return r(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return r(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const n=s[1],a=n.length;if(a===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(n,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dt){const r=ac[e.toLowerCase()];return r!==void 0?this.setHex(r,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mn(e.r),this.g=Mn(e.g),this.b=Mn(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dt){return Ge.workingToColorSpace(Ct.copy(this),e),Math.round(ke(Ct.r*255,0,255))*65536+Math.round(ke(Ct.g*255,0,255))*256+Math.round(ke(Ct.b*255,0,255))}getHexString(e=Dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.workingToColorSpace(Ct.copy(this),t);const r=Ct.r,s=Ct.g,n=Ct.b,a=Math.max(r,s,n),l=Math.min(r,s,n);let c,f;const h=(l+a)/2;if(l===a)c=0,f=0;else{const m=a-l;switch(f=h<=.5?m/(a+l):m/(2-a-l),a){case r:c=(s-n)/m+(s<n?6:0);break;case s:c=(n-r)/m+2;break;case n:c=(r-s)/m+4;break}c/=6}return e.h=c,e.s=f,e.l=h,e}getRGB(e,t=Ge.workingColorSpace){return Ge.workingToColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=Dt){Ge.workingToColorSpace(Ct.copy(this),e);const t=Ct.r,r=Ct.g,s=Ct.b;return e!==Dt?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(s*255)})`}offsetHSL(e,t,r){return this.getHSL(Dn),this.setHSL(Dn.h+e,Dn.s+t,Dn.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Dn),e.getHSL(pr);const r=fs(Dn.h,pr.h,t),s=fs(Dn.s,pr.s,t),n=fs(Dn.l,pr.l,t);return this.setHSL(r,s,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,s=this.b,n=e.elements;return this.r=n[0]*t+n[3]*r+n[6]*s,this.g=n[1]*t+n[4]*r+n[7]*s,this.b=n[2]*t+n[5]*r+n[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ct=new et;et.NAMES=ac;class _s extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ai,this.environmentIntensity=1,this.environmentRotation=new ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Yt=new Y,pn=new Y,Ss=new Y,mn=new Y,gi=new Y,vi=new Y,Wo=new Y,Ms=new Y,ys=new Y,Es=new Y,Ts=new ft,bs=new ft,As=new ft;class Zt{constructor(e=new Y,t=new Y,r=new Y){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,s){s.subVectors(r,t),Yt.subVectors(e,t),s.cross(Yt);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(0,0,0)}static getBarycoord(e,t,r,s,n){Yt.subVectors(s,t),pn.subVectors(r,t),Ss.subVectors(e,t);const a=Yt.dot(Yt),l=Yt.dot(pn),c=Yt.dot(Ss),f=pn.dot(pn),h=pn.dot(Ss),m=a*f-l*l;if(m===0)return n.set(0,0,0),null;const u=1/m,o=(f*c-l*h)*u,d=(a*h-l*c)*u;return n.set(1-o-d,d,o)}static containsPoint(e,t,r,s){return this.getBarycoord(e,t,r,s,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(e,t,r,s,n,a,l,c){return this.getBarycoord(e,t,r,s,mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(n,mn.x),c.addScaledVector(a,mn.y),c.addScaledVector(l,mn.z),c)}static getInterpolatedAttribute(e,t,r,s,n,a){return Ts.setScalar(0),bs.setScalar(0),As.setScalar(0),Ts.fromBufferAttribute(e,t),bs.fromBufferAttribute(e,r),As.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ts,n.x),a.addScaledVector(bs,n.y),a.addScaledVector(As,n.z),a}static isFrontFacing(e,t,r,s){return Yt.subVectors(r,t),pn.subVectors(e,t),Yt.cross(pn).dot(s)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,s){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,r,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yt.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Yt.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Zt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,s,n){return Zt.getInterpolation(e,this.a,this.b,this.c,t,r,s,n)}containsPoint(e){return Zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,s=this.b,n=this.c;let a,l;gi.subVectors(s,r),vi.subVectors(n,r),Ms.subVectors(e,r);const c=gi.dot(Ms),f=vi.dot(Ms);if(c<=0&&f<=0)return t.copy(r);ys.subVectors(e,s);const h=gi.dot(ys),m=vi.dot(ys);if(h>=0&&m<=h)return t.copy(s);const u=c*m-h*f;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(r).addScaledVector(gi,a);Es.subVectors(e,n);const o=gi.dot(Es),d=vi.dot(Es);if(d>=0&&o<=d)return t.copy(n);const v=o*f-c*d;if(v<=0&&f>=0&&d<=0)return l=f/(f-d),t.copy(r).addScaledVector(vi,l);const p=h*d-o*m;if(p<=0&&m-h>=0&&o-d>=0)return Wo.subVectors(n,s),l=(m-h)/(m-h+(o-d)),t.copy(s).addScaledVector(Wo,l);const g=1/(p+v+u);return a=v*g,l=u*g,t.copy(r).addScaledVector(gi,a).addScaledVector(vi,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class sr{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const n=r.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let a=0,l=n.count;a<l;a++)e.isMesh===!0?e.getVertexPosition(a,qt):qt.fromBufferAttribute(n,a),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mr.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),mr.copy(r.boundingBox)),mr.applyMatrix4(e.matrixWorld),this.union(mr)}const s=e.children;for(let n=0,a=s.length;n<a;n++)this.expandByObject(s[n],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ki),gr.subVectors(this.max,ki),xi.subVectors(e.a,ki),_i.subVectors(e.b,ki),Si.subVectors(e.c,ki),In.subVectors(_i,xi),Un.subVectors(Si,_i),$n.subVectors(xi,Si);let t=[0,-In.z,In.y,0,-Un.z,Un.y,0,-$n.z,$n.y,In.z,0,-In.x,Un.z,0,-Un.x,$n.z,0,-$n.x,-In.y,In.x,0,-Un.y,Un.x,0,-$n.y,$n.x,0];return!ws(t,xi,_i,Si,gr)||(t=[1,0,0,0,1,0,0,0,1],!ws(t,xi,_i,Si,gr))?!1:(vr.crossVectors(In,Un),t=[vr.x,vr.y,vr.z],ws(t,xi,_i,Si,gr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const gn=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],qt=new Y,mr=new sr,xi=new Y,_i=new Y,Si=new Y,In=new Y,Un=new Y,$n=new Y,ki=new Y,gr=new Y,vr=new Y,Kn=new Y;function ws(i,e,t,r,s){for(let n=0,a=i.length-3;n<=a;n+=3){Kn.fromArray(i,n);const l=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),c=e.dot(Kn),f=t.dot(Kn),h=r.dot(Kn);if(Math.max(-Math.max(c,f,h),Math.min(c,f,h))>l)return!1}return!0}const xt=new Y,xr=new He;let Ku=0;class un extends li{constructor(e,t,r=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ku++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=Po,this.updateRanges=[],this.gpuType=on,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[e+s]=t.array[r+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)xr.fromBufferAttribute(this,t),xr.applyMatrix3(e),this.setXY(t,xr.x,xr.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=Vi(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Lt(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,s){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),r=Lt(r,this.array),s=Lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=s,this}setXYZW(e,t,r,s,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),r=Lt(r,this.array),s=Lt(s,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=s,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Po&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class oc extends un{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class lc extends un{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class yn extends un{constructor(e,t,r){super(new Float32Array(e),t,r)}}const Zu=new sr,Wi=new Y,Rs=new Y;class Ka{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):Zu.setFromPoints(e).getCenter(r);let s=0;for(let n=0,a=e.length;n<a;n++)s=Math.max(s,r.distanceToSquared(e[n]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wi.subVectors(e,this.center);const t=Wi.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),s=(r-this.radius)*.5;this.center.addScaledVector(Wi,s/r),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wi.copy(e.center).add(Rs)),this.expandByPoint(Wi.copy(e.center).sub(Rs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ju=0;const Ht=new _t,Cs=new Ot,Mi=new Y,Ft=new sr,Xi=new sr,Et=new Y;class An extends li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lu(e)?lc:oc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const n=new Ue().getNormalMatrix(e);r.applyNormalMatrix(n),r.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,r){return Ht.makeTranslation(e,t,r),this.applyMatrix4(Ht),this}scale(e,t,r){return Ht.makeScale(e,t,r),this.applyMatrix4(Ht),this}lookAt(e){return Cs.lookAt(e),Cs.updateMatrix(),this.applyMatrix4(Cs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let s=0,n=e.length;s<n;s++){const a=e[s];r.push(a.x,a.y,a.z||0)}this.setAttribute("position",new yn(r,3))}else{const r=Math.min(e.length,t.count);for(let s=0;s<r;s++){const n=e[s];t.setXYZ(s,n.x,n.y,n.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const n=t[r];Ft.setFromBufferAttribute(n),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ka);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const r=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let n=0,a=t.length;n<a;n++){const l=t[n];Xi.setFromBufferAttribute(l),this.morphTargetsRelative?(Et.addVectors(Ft.min,Xi.min),Ft.expandByPoint(Et),Et.addVectors(Ft.max,Xi.max),Ft.expandByPoint(Et)):(Ft.expandByPoint(Xi.min),Ft.expandByPoint(Xi.max))}Ft.getCenter(r);let s=0;for(let n=0,a=e.count;n<a;n++)Et.fromBufferAttribute(e,n),s=Math.max(s,r.distanceToSquared(Et));if(t)for(let n=0,a=t.length;n<a;n++){const l=t[n],c=this.morphTargetsRelative;for(let f=0,h=l.count;f<h;f++)Et.fromBufferAttribute(l,f),c&&(Mi.fromBufferAttribute(e,f),Et.add(Mi)),s=Math.max(s,r.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,s=t.normal,n=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==r.count)&&(a=new un(new Float32Array(4*r.count),4),this.setAttribute("tangent",a));const l=[],c=[];for(let x=0;x<r.count;x++)l[x]=new Y,c[x]=new Y;const f=new Y,h=new Y,m=new Y,u=new He,o=new He,d=new He,v=new Y,p=new Y;function g(x,y,w){f.fromBufferAttribute(r,x),h.fromBufferAttribute(r,y),m.fromBufferAttribute(r,w),u.fromBufferAttribute(n,x),o.fromBufferAttribute(n,y),d.fromBufferAttribute(n,w),h.sub(f),m.sub(f),o.sub(u),d.sub(u);const R=1/(o.x*d.y-d.x*o.y);isFinite(R)&&(v.copy(h).multiplyScalar(d.y).addScaledVector(m,-o.y).multiplyScalar(R),p.copy(m).multiplyScalar(o.x).addScaledVector(h,-d.x).multiplyScalar(R),l[x].add(v),l[y].add(v),l[w].add(v),c[x].add(p),c[y].add(p),c[w].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let x=0,y=E.length;x<y;++x){const w=E[x],R=w.start,C=w.count;for(let D=R,N=R+C;D<N;D+=3)g(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const A=new Y,M=new Y,_=new Y,S=new Y;function T(x){_.fromBufferAttribute(s,x),S.copy(_);const y=l[x];A.copy(y),A.sub(_.multiplyScalar(_.dot(y))).normalize(),M.crossVectors(S,y);const R=M.dot(c[x])<0?-1:1;a.setXYZW(x,A.x,A.y,A.z,R)}for(let x=0,y=E.length;x<y;++x){const w=E[x],R=w.start,C=w.count;for(let D=R,N=R+C;D<N;D+=3)T(e.getX(D+0)),T(e.getX(D+1)),T(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0||r.count!==t.count)r=new un(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let u=0,o=r.count;u<o;u++)r.setXYZ(u,0,0,0);const s=new Y,n=new Y,a=new Y,l=new Y,c=new Y,f=new Y,h=new Y,m=new Y;if(e)for(let u=0,o=e.count;u<o;u+=3){const d=e.getX(u+0),v=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,d),n.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,n),m.subVectors(s,n),h.cross(m),l.fromBufferAttribute(r,d),c.fromBufferAttribute(r,v),f.fromBufferAttribute(r,p),l.add(h),c.add(h),f.add(h),r.setXYZ(d,l.x,l.y,l.z),r.setXYZ(v,c.x,c.y,c.z),r.setXYZ(p,f.x,f.y,f.z)}else for(let u=0,o=t.count;u<o;u+=3)s.fromBufferAttribute(t,u+0),n.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,n),m.subVectors(s,n),h.cross(m),r.setXYZ(u+0,h.x,h.y,h.z),r.setXYZ(u+1,h.x,h.y,h.z),r.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(l,c){const f=l.array,h=l.itemSize,m=l.normalized,u=new f.constructor(c.length*h);let o=0,d=0;for(let v=0,p=c.length;v<p;v++){l.isInterleavedBufferAttribute?o=c[v]*l.data.stride+l.offset:o=c[v]*h;for(let g=0;g<h;g++)u[d++]=f[o++]}return new un(u,h,m)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new An,r=this.index.array,s=this.attributes;for(const l in s){const c=s[l],f=e(c,r);t.setAttribute(l,f)}const n=this.morphAttributes;for(const l in n){const c=[],f=n[l];for(let h=0,m=f.length;h<m;h++){const u=f[h],o=e(u,r);c.push(o)}t.morphAttributes[l]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const f=a[l];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const f in c)c[f]!==void 0&&(e[f]=c[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const c in r){const f=r[c];e.data.attributes[c]=f.toJSON(e.data)}const s={};let n=!1;for(const c in this.morphAttributes){const f=this.morphAttributes[c],h=[];for(let m=0,u=f.length;m<u;m++){const o=f[m];h.push(o.toJSON(e.data))}h.length>0&&(s[c]=h,n=!0)}n&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const s=e.attributes;for(const f in s){const h=s[f];this.setAttribute(f,h.clone(t))}const n=e.morphAttributes;for(const f in n){const h=[],m=n[f];for(let u=0,o=m.length;u<o;u++)h.push(m[u].clone(t));this.morphAttributes[f]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let f=0,h=a.length;f<h;f++){const m=a[f];this.addGroup(m.start,m.count,m.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Qu=0;class es extends li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=rr(),this.name="",this.type="Material",this.blending=Li,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qs,this.blendDst=kr,this.blendEquation=jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new et(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Co,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(r):s&&s.isVector2&&r&&r.isVector2||s&&s.isEuler&&r&&r.isEuler||s&&s.isVector3&&r&&r.isVector3?s.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(r.blending=this.blending),this.side!==Wn&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==qs&&(r.blendSrc=this.blendSrc),this.blendDst!==kr&&(r.blendDst=this.blendDst),this.blendEquation!==jn&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Co&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(r.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.allowOverride===!1&&(r.allowOverride=!1),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function s(n){const a=[];for(const l in n){const c=n[l];delete c.metadata,a.push(c)}return a}if(t){const n=s(e.textures),a=s(e.images);n.length>0&&(r.textures=n),a.length>0&&(r.images=a)}return r}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new et().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let r=e.normalScale;Array.isArray(r)===!1&&(r=[r,r]),this.normalScale=new He().fromArray(r)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new He().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const s=t.length;r=new Array(s);for(let n=0;n!==s;++n)r[n]=t[n].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const vn=new Y,Ps=new Y,_r=new Y,Nn=new Y,Ls=new Y,Sr=new Y,Ds=new Y;class ju{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,r,s){Ps.copy(e).add(t).multiplyScalar(.5),_r.copy(t).sub(e).normalize(),Nn.copy(this.origin).sub(Ps);const n=e.distanceTo(t)*.5,a=-this.direction.dot(_r),l=Nn.dot(this.direction),c=-Nn.dot(_r),f=Nn.lengthSq(),h=Math.abs(1-a*a);let m,u,o,d;if(h>0)if(m=a*c-l,u=a*l-c,d=n*h,m>=0)if(u>=-d)if(u<=d){const v=1/h;m*=v,u*=v,o=m*(m+a*u+2*l)+u*(a*m+u+2*c)+f}else u=n,m=Math.max(0,-(a*u+l)),o=-m*m+u*(u+2*c)+f;else u=-n,m=Math.max(0,-(a*u+l)),o=-m*m+u*(u+2*c)+f;else u<=-d?(m=Math.max(0,-(-a*n+l)),u=m>0?-n:Math.min(Math.max(-n,-c),n),o=-m*m+u*(u+2*c)+f):u<=d?(m=0,u=Math.min(Math.max(-n,-c),n),o=u*(u+2*c)+f):(m=Math.max(0,-(a*n+l)),u=m>0?n:Math.min(Math.max(-n,-c),n),o=-m*m+u*(u+2*c)+f);else u=a>0?-n:n,m=Math.max(0,-(a*u+l)),o=-m*m+u*(u+2*c)+f;return r&&r.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(Ps).addScaledVector(_r,u),o}intersectSphere(e,t){vn.subVectors(e.center,this.origin);const r=vn.dot(this.direction),s=vn.dot(vn)-r*r,n=e.radius*e.radius;if(s>n)return null;const a=Math.sqrt(n-s),l=r-a,c=r+a;return c<0?null:l<0?this.at(c,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,s,n,a,l,c;const f=1/this.direction.x,h=1/this.direction.y,m=1/this.direction.z,u=this.origin;return f>=0?(r=(e.min.x-u.x)*f,s=(e.max.x-u.x)*f):(r=(e.max.x-u.x)*f,s=(e.min.x-u.x)*f),h>=0?(n=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(n=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),r>a||n>s||((n>r||isNaN(r))&&(r=n),(a<s||isNaN(s))&&(s=a),m>=0?(l=(e.min.z-u.z)*m,c=(e.max.z-u.z)*m):(l=(e.max.z-u.z)*m,c=(e.min.z-u.z)*m),r>c||l>s)||((l>r||r!==r)&&(r=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(r>=0?r:s,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,r,s,n){Ls.subVectors(t,e),Sr.subVectors(r,e),Ds.crossVectors(Ls,Sr);let a=this.direction.dot(Ds),l;if(a>0){if(s)return null;l=1}else if(a<0)l=-1,a=-a;else return null;Nn.subVectors(this.origin,e);const c=l*this.direction.dot(Sr.crossVectors(Nn,Sr));if(c<0)return null;const f=l*this.direction.dot(Ls.cross(Nn));if(f<0||c+f>a)return null;const h=-l*Nn.dot(Ds);return h<0?null:this.at(h/a,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class cc extends es{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.combine=Vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Xo=new _t,Zn=new ju,Mr=new Ka,Yo=new Y,yr=new Y,Er=new Y,Tr=new Y,Is=new Y,br=new Y,qo=new Y,Ar=new Y;class Wt extends Ot{constructor(e=new An,t=new cc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const s=t[r[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,a=s.length;n<a;n++){const l=s[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=n}}}}getVertexPosition(e,t){const r=this.geometry,s=r.attributes.position,n=r.morphAttributes.position,a=r.morphTargetsRelative;t.fromBufferAttribute(s,e);const l=this.morphTargetInfluences;if(n&&l){br.set(0,0,0);for(let c=0,f=n.length;c<f;c++){const h=l[c],m=n[c];h!==0&&(Is.fromBufferAttribute(m,e),a?br.addScaledVector(Is,h):br.addScaledVector(Is.sub(t),h))}t.add(br)}return t}raycast(e,t){const r=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Mr.copy(r.boundingSphere),Mr.applyMatrix4(n),Zn.copy(e.ray).recast(e.near),!(Mr.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Mr,Yo)===null||Zn.origin.distanceToSquared(Yo)>(e.far-e.near)**2))&&(Xo.copy(n).invert(),Zn.copy(e.ray).applyMatrix4(Xo),!(r.boundingBox!==null&&Zn.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Zn)))}_computeIntersections(e,t,r){let s;const n=this.geometry,a=this.material,l=n.index,c=n.attributes.position,f=n.attributes.uv,h=n.attributes.uv1,m=n.attributes.normal,u=n.groups,o=n.drawRange;if(l!==null)if(Array.isArray(a))for(let d=0,v=u.length;d<v;d++){const p=u[d],g=a[p.materialIndex],E=Math.max(p.start,o.start),A=Math.min(l.count,Math.min(p.start+p.count,o.start+o.count));for(let M=E,_=A;M<_;M+=3){const S=l.getX(M),T=l.getX(M+1),x=l.getX(M+2);s=wr(this,g,e,r,f,h,m,S,T,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const d=Math.max(0,o.start),v=Math.min(l.count,o.start+o.count);for(let p=d,g=v;p<g;p+=3){const E=l.getX(p),A=l.getX(p+1),M=l.getX(p+2);s=wr(this,a,e,r,f,h,m,E,A,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let d=0,v=u.length;d<v;d++){const p=u[d],g=a[p.materialIndex],E=Math.max(p.start,o.start),A=Math.min(c.count,Math.min(p.start+p.count,o.start+o.count));for(let M=E,_=A;M<_;M+=3){const S=M,T=M+1,x=M+2;s=wr(this,g,e,r,f,h,m,S,T,x),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const d=Math.max(0,o.start),v=Math.min(c.count,o.start+o.count);for(let p=d,g=v;p<g;p+=3){const E=p,A=p+1,M=p+2;s=wr(this,a,e,r,f,h,m,E,A,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function ef(i,e,t,r,s,n,a,l){let c;if(e.side===It?c=r.intersectTriangle(a,n,s,!0,l):c=r.intersectTriangle(s,n,a,e.side===Wn,l),c===null)return null;Ar.copy(l),Ar.applyMatrix4(i.matrixWorld);const f=t.ray.origin.distanceTo(Ar);return f<t.near||f>t.far?null:{distance:f,point:Ar.clone(),object:i}}function wr(i,e,t,r,s,n,a,l,c,f){i.getVertexPosition(l,yr),i.getVertexPosition(c,Er),i.getVertexPosition(f,Tr);const h=ef(i,e,t,r,yr,Er,Tr,qo);if(h){const m=new Y;Zt.getBarycoord(qo,yr,Er,Tr,m),s&&(h.uv=Zt.getInterpolatedAttribute(s,l,c,f,m,new He)),n&&(h.uv1=Zt.getInterpolatedAttribute(n,l,c,f,m,new He)),a&&(h.normal=Zt.getInterpolatedAttribute(a,l,c,f,m,new Y),h.normal.dot(r.direction)>0&&h.normal.multiplyScalar(-1));const u={a:l,b:c,c:f,normal:new Y,materialIndex:0};Zt.getNormal(yr,Er,Tr,u.normal),h.face=u,h.barycoord=m}return h}class tf extends At{constructor(e=null,t=1,r=1,s,n,a,l,c,f=bt,h=bt,m,u){super(null,a,l,c,f,h,s,n,m,u),this.isDataTexture=!0,this.image={data:e,width:t,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Us=new Y,nf=new Y,rf=new Ue;class Qn{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,s){return this.normal.set(e,t,r),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const s=Us.subVectors(r,t).cross(nf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,r=!0){const s=e.delta(Us),n=this.normal.dot(s);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/n;return r===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||rf.getNormalMatrix(e),s=this.coplanarPoint(Us).applyMatrix4(e),n=this.normal.applyMatrix3(r).normalize();return this.constant=-s.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new Ka,sf=new He(.5,.5),Rr=new Y;class uc{constructor(e=new Qn,t=new Qn,r=new Qn,s=new Qn,n=new Qn,a=new Qn){this.planes=[e,t,r,s,n,a]}set(e,t,r,s,n,a){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(r),l[3].copy(s),l[4].copy(n),l[5].copy(a),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=ln,r=!1){const s=this.planes,n=e.elements,a=n[0],l=n[1],c=n[2],f=n[3],h=n[4],m=n[5],u=n[6],o=n[7],d=n[8],v=n[9],p=n[10],g=n[11],E=n[12],A=n[13],M=n[14],_=n[15];if(s[0].setComponents(f-a,o-h,g-d,_-E).normalize(),s[1].setComponents(f+a,o+h,g+d,_+E).normalize(),s[2].setComponents(f+l,o+m,g+v,_+A).normalize(),s[3].setComponents(f-l,o-m,g-v,_-A).normalize(),r)s[4].setComponents(c,u,p,M).normalize(),s[5].setComponents(f-c,o-u,g-p,_-M).normalize();else if(s[4].setComponents(f-c,o-u,g-p,_-M).normalize(),t===ln)s[5].setComponents(f+c,o+u,g+p,_+M).normalize();else if(t===$r)s[5].setComponents(c,u,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(e){Jn.center.set(0,0,0);const t=sf.distanceTo(e.center);return Jn.radius=.7071067811865476+t,Jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(e){const t=this.planes,r=e.center,s=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(r)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const s=t[r];if(Rr.x=s.normal.x>0?e.max.x:e.min.x,Rr.y=s.normal.y>0?e.max.y:e.min.y,Rr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class fc extends At{constructor(e=[],t=ri,r,s,n,a,l,c,f,h){super(e,t,r,s,n,a,l,c,f,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class af extends At{constructor(e,t,r,s,n,a,l,c,f){super(e,t,r,s,n,a,l,c,f),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Fi extends At{constructor(e,t,r=hn,s,n,a,l=bt,c=bt,f,h=Tn,m=1){if(h!==Tn&&h!==ti)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:m};super(u,s,n,a,l,c,h,r,f),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $a(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class of extends Fi{constructor(e,t=hn,r=ri,s,n,a=bt,l=bt,c,f=Tn){const h={width:e,height:e,depth:1},m=[h,h,h,h,h,h];super(e,e,t,r,s,n,a,l,c,f),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class hc extends At{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ar extends An{constructor(e=1,t=1,r=1,s=1,n=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:s,heightSegments:n,depthSegments:a};const l=this;s=Math.floor(s),n=Math.floor(n),a=Math.floor(a);const c=[],f=[],h=[],m=[];let u=0,o=0;d("z","y","x",-1,-1,r,t,e,a,n,0),d("z","y","x",1,-1,r,t,-e,a,n,1),d("x","z","y",1,1,e,r,t,s,a,2),d("x","z","y",1,-1,e,r,-t,s,a,3),d("x","y","z",1,-1,e,t,r,s,n,4),d("x","y","z",-1,-1,e,t,-r,s,n,5),this.setIndex(c),this.setAttribute("position",new yn(f,3)),this.setAttribute("normal",new yn(h,3)),this.setAttribute("uv",new yn(m,2));function d(v,p,g,E,A,M,_,S,T,x,y){const w=M/T,R=_/x,C=M/2,D=_/2,N=S/2,I=T+1,z=x+1;let U=0,W=0;const K=new Y;for(let ie=0;ie<z;ie++){const se=ie*R-D;for(let oe=0;oe<I;oe++){const De=oe*w-C;K[v]=De*E,K[p]=se*A,K[g]=N,f.push(K.x,K.y,K.z),K[v]=0,K[p]=0,K[g]=S>0?1:-1,h.push(K.x,K.y,K.z),m.push(oe/T),m.push(1-ie/x),U+=1}}for(let ie=0;ie<x;ie++)for(let se=0;se<T;se++){const oe=u+se+I*ie,De=u+se+I*(ie+1),qe=u+(se+1)+I*(ie+1),ne=u+(se+1)+I*ie;c.push(oe,De,ne),c.push(De,qe,ne),W+=6}l.addGroup(o,W,y),o+=W,u+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ar(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Oi extends An{constructor(e=1,t=1,r=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:s};const n=e/2,a=t/2,l=Math.floor(r),c=Math.floor(s),f=l+1,h=c+1,m=e/l,u=t/c,o=[],d=[],v=[],p=[];for(let g=0;g<h;g++){const E=g*u-a;for(let A=0;A<f;A++){const M=A*m-n;d.push(M,-E,0),v.push(0,0,1),p.push(A/l),p.push(1-g/c)}}for(let g=0;g<c;g++)for(let E=0;E<l;E++){const A=E+f*g,M=E+f*(g+1),_=E+1+f*(g+1),S=E+1+f*g;o.push(A,M,S),o.push(M,_,S)}this.setIndex(o),this.setAttribute("position",new yn(d,3)),this.setAttribute("normal",new yn(v,3)),this.setAttribute("uv",new yn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oi(e.width,e.height,e.widthSegments,e.heightSegments)}}function Bi(i){const e={};for(const t in i){e[t]={};for(const r in i[t]){const s=i[t][r];if($o(s))s.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=s.clone();else if(Array.isArray(s))if($o(s[0])){const n=[];for(let a=0,l=s.length;a<l;a++)n[a]=s[a].clone();e[t][r]=n}else e[t][r]=s.slice();else e[t][r]=s}}return e}function Pt(i){const e={};for(let t=0;t<i.length;t++){const r=Bi(i[t]);for(const s in r)e[s]=r[s]}return e}function $o(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function lf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function dc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const cf={clone:Bi,merge:Pt};var uf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bt extends es{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uf,this.fragmentShader=ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bi(e.uniforms),this.uniformsGroups=lf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const s in this.extensions)this.extensions[s]===!0&&(r[s]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const r in e.uniforms){const s=e.uniforms[r];switch(this.uniforms[r]={},s.type){case"t":this.uniforms[r].value=t[s.value]||null;break;case"c":this.uniforms[r].value=new et().setHex(s.value);break;case"v2":this.uniforms[r].value=new He().fromArray(s.value);break;case"v3":this.uniforms[r].value=new Y().fromArray(s.value);break;case"v4":this.uniforms[r].value=new ft().fromArray(s.value);break;case"m3":this.uniforms[r].value=new Ue().fromArray(s.value);break;case"m4":this.uniforms[r].value=new _t().fromArray(s.value);break;default:this.uniforms[r].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const r in e.extensions)this.extensions[r]=e.extensions[r];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class hf extends Bt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class df extends es{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pf extends es{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ns={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Ko(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Ko(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Ko(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class mf{constructor(e,t,r){const s=this;let n=!1,a=0,l=0,c;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=r,this._abortController=null,this.itemStart=function(h){l++,n===!1&&s.onStart!==void 0&&s.onStart(h,a,l),n=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,l),a===l&&(n=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,m){return f.push(h,m),this},this.removeHandler=function(h){const m=f.indexOf(h);return m!==-1&&f.splice(m,2),this},this.getHandler=function(h){for(let m=0,u=f.length;m<u;m+=2){const o=f[m],d=f[m+1];if(o.global&&(o.lastIndex=0),o.test(h))return d}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const gf=new mf;class Za{constructor(e){this.manager=e!==void 0?e:gf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const r=this;return new Promise(function(s,n){r.load(e,s,t,n)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Za.DEFAULT_MATERIAL_NAME="__DEFAULT";const yi=new WeakMap;class vf extends Za{constructor(e){super(e)}load(e,t,r,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const n=this,a=Ns.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)n.manager.itemStart(e),setTimeout(function(){t&&t(a),n.manager.itemEnd(e)},0);else{let m=yi.get(a);m===void 0&&(m=[],yi.set(a,m)),m.push({onLoad:t,onError:s})}return a}const l=er("img");function c(){h(),t&&t(this);const m=yi.get(this)||[];for(let u=0;u<m.length;u++){const o=m[u];o.onLoad&&o.onLoad(this)}yi.delete(this),n.manager.itemEnd(e)}function f(m){h(),s&&s(m),Ns.remove(`image:${e}`);const u=yi.get(this)||[];for(let o=0;o<u.length;o++){const d=u[o];d.onError&&d.onError(m)}yi.delete(this),n.manager.itemError(e),n.manager.itemEnd(e)}function h(){l.removeEventListener("load",c,!1),l.removeEventListener("error",f,!1)}return l.addEventListener("load",c,!1),l.addEventListener("error",f,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(l.crossOrigin=this.crossOrigin),Ns.add(`image:${e}`,l),n.manager.itemStart(e),l.src=e,l}}class xf extends Za{constructor(e){super(e)}load(e,t,r,s){const n=new At,a=new vf(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(l){n.image=l,n.needsUpdate=!0,t!==void 0&&t(n)},r,s),n}}const Cr=new Y,Pr=new zi,rn=new Y;class pc extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cr,Pr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,rn.set(1,1,1)).invert()}updateWorldMatrix(e,t,r=!1){super.updateWorldMatrix(e,t,r),this.matrixWorld.decompose(Cr,Pr,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new Y,Zo=new He,Jo=new He;class $t extends pc{constructor(e=50,t=1,r=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ia*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ia*2*Math.atan(Math.tan(us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z)}getViewSize(e,t){return this.getViewBounds(e,Zo,Jo),t.subVectors(Jo,Zo)}setViewOffset(e,t,r,s,n,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=s,this.view.width=n,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(us*.5*this.fov)/this.zoom,r=2*t,s=this.aspect*r,n=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,f=a.fullHeight;n+=a.offsetX*s/c,t-=a.offsetY*r/f,s*=a.width/c,r*=a.height/f}const l=this.filmOffset;l!==0&&(n+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+s,t,t-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ja extends pc{constructor(e=-1,t=1,r=1,s=-1,n=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=s,this.near=n,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,s,n,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=s,this.view.width=n,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let n=r-e,a=r+e,l=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=f*this.view.offsetX,a=n+f*this.view.width,l-=h*this.view.offsetY,c=l-h*this.view.height}this.projectionMatrix.makeOrthographic(n,a,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ei=-90,Ti=1;class _f extends Ot{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $t(Ei,Ti,e,t);s.layers=this.layers,this.add(s);const n=new $t(Ei,Ti,e,t);n.layers=this.layers,this.add(n);const a=new $t(Ei,Ti,e,t);a.layers=this.layers,this.add(a);const l=new $t(Ei,Ti,e,t);l.layers=this.layers,this.add(l);const c=new $t(Ei,Ti,e,t);c.layers=this.layers,this.add(c);const f=new $t(Ei,Ti,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,s,n,a,l,c]=t;for(const f of t)this.remove(f);if(e===ln)r.up.set(0,1,0),r.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===$r)r.up.set(0,-1,0),r.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[n,a,l,c,f,h]=this.children,m=e.getRenderTarget(),u=e.getActiveCubeFace(),o=e.getActiveMipmapLevel(),d=e.xr.enabled;e.xr.enabled=!1;const v=r.texture.generateMipmaps;r.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(r,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,n),e.setRenderTarget(r,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(r,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(r,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(r,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),r.texture.generateMipmaps=v,e.setRenderTarget(r,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(m,u,o),e.xr.enabled=d,r.texture.needsPMREMUpdate=!0}}class Sf extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const uo=class uo{constructor(e,t,r,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,r,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let r=0;r<4;r++)this.elements[r]=e[r+t];return this}set(e,t,r,s){const n=this.elements;return n[0]=e,n[2]=t,n[1]=r,n[3]=s,this}};uo.prototype.isMatrix2=!0;let Qo=uo;function jo(i,e,t,r){const s=Mf(r);switch(t){case ec:return i*e;case nc:return i*e/s.components*s.byteLength;case ka:return i*e/s.components*s.byteLength;case si:return i*e*2/s.components*s.byteLength;case Wa:return i*e*2/s.components*s.byteLength;case tc:return i*e*3/s.components*s.byteLength;case kt:return i*e*4/s.components*s.byteLength;case Xa:return i*e*4/s.components*s.byteLength;case Fr:case Or:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Br:case zr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ra:case aa:return Math.max(i,16)*Math.max(e,8)/4;case ia:case sa:return Math.max(i,8)*Math.max(e,8)/2;case oa:case la:case ua:case fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ca:case Wr:case ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case da:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case pa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ma:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ga:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case xa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case _a:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ba:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Aa:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wa:case Ra:case Ca:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Pa:case La:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xr:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Mf(i){switch(i){case Gt:case Zl:return{byteLength:1,components:1};case Qi:case Jl:case En:return{byteLength:2,components:1};case Va:case Ga:return{byteLength:2,components:4};case hn:case Ha:case on:return{byteLength:4,components:1};case Ql:case jl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:za}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=za);function mc(){let i=null,e=!1,t=null,r=null;function s(n,a){t(n,a),r=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(r=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){i=n}}}function yf(i){const e=new WeakMap;function t(l,c){const f=l.array,h=l.usage,m=f.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,f,h),l.onUploadCallback();let o;if(f instanceof Float32Array)o=i.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)o=i.HALF_FLOAT;else if(f instanceof Uint16Array)l.isFloat16BufferAttribute?o=i.HALF_FLOAT:o=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)o=i.SHORT;else if(f instanceof Uint32Array)o=i.UNSIGNED_INT;else if(f instanceof Int32Array)o=i.INT;else if(f instanceof Int8Array)o=i.BYTE;else if(f instanceof Uint8Array)o=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)o=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:u,type:o,bytesPerElement:f.BYTES_PER_ELEMENT,version:l.version,size:m}}function r(l,c,f){const h=c.array,m=c.updateRanges;if(i.bindBuffer(f,l),m.length===0)i.bufferSubData(f,0,h);else{m.sort((o,d)=>o.start-d.start);let u=0;for(let o=1;o<m.length;o++){const d=m[u],v=m[o];v.start<=d.start+d.count+1?d.count=Math.max(d.count,v.start+v.count-d.start):(++u,m[u]=v)}m.length=u+1;for(let o=0,d=m.length;o<d;o++){const v=m[o];i.bufferSubData(f,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function n(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(i.deleteBuffer(c.buffer),e.delete(l))}function a(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const h=e.get(l);(!h||h.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const f=e.get(l);if(f===void 0)e.set(l,t(l,c));else if(f.version<l.version){if(f.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,l,c),f.version=l.version}}return{get:s,remove:n,update:a}}var Ef=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,bf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Af=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Rf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Pf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Df=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,If=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ff=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Of=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,kf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Wf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Xf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Yf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$f=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Kf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jf="gl_FragColor = linearToOutputTexel( gl_FragColor );",eh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,th=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ih=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ah=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,oh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ch=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,uh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ph=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,mh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,gh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vh=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_h=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Mh=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yh=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Eh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Th=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bh=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Ah=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wh=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rh=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ch=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ph=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Lh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Dh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ih=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Uh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fh=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Oh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bh=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zh=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Hh=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gh=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,kh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Yh=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,qh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$h=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qh=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,jh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ed=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,td=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,id=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ad=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,od=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ld=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ud=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,fd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,dd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,md=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xd=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_d=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Md=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ed=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Td=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ad=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Pd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ld=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Dd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Id=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ud=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Fd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Od=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kd=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Wd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Xd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$d=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kd=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Qd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jd=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ep=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,np=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:Ef,alphahash_pars_fragment:Tf,alphamap_fragment:bf,alphamap_pars_fragment:Af,alphatest_fragment:wf,alphatest_pars_fragment:Rf,aomap_fragment:Cf,aomap_pars_fragment:Pf,batching_pars_vertex:Lf,batching_vertex:Df,begin_vertex:If,beginnormal_vertex:Uf,bsdfs:Nf,iridescence_fragment:Ff,bumpmap_pars_fragment:Of,clipping_planes_fragment:Bf,clipping_planes_pars_fragment:zf,clipping_planes_pars_vertex:Hf,clipping_planes_vertex:Vf,color_fragment:Gf,color_pars_fragment:kf,color_pars_vertex:Wf,color_vertex:Xf,common:Yf,cube_uv_reflection_fragment:qf,defaultnormal_vertex:$f,displacementmap_pars_vertex:Kf,displacementmap_vertex:Zf,emissivemap_fragment:Jf,emissivemap_pars_fragment:Qf,colorspace_fragment:jf,colorspace_pars_fragment:eh,envmap_fragment:th,envmap_common_pars_fragment:nh,envmap_pars_fragment:ih,envmap_pars_vertex:rh,envmap_physical_pars_fragment:mh,envmap_vertex:sh,fog_vertex:ah,fog_pars_vertex:oh,fog_fragment:lh,fog_pars_fragment:ch,gradientmap_pars_fragment:uh,lightmap_pars_fragment:fh,lights_lambert_fragment:hh,lights_lambert_pars_fragment:dh,lights_pars_begin:ph,lights_toon_fragment:gh,lights_toon_pars_fragment:vh,lights_phong_fragment:xh,lights_phong_pars_fragment:_h,lights_physical_fragment:Sh,lights_physical_pars_fragment:Mh,lights_fragment_begin:yh,lights_fragment_maps:Eh,lights_fragment_end:Th,lightprobes_pars_fragment:bh,logdepthbuf_fragment:Ah,logdepthbuf_pars_fragment:wh,logdepthbuf_pars_vertex:Rh,logdepthbuf_vertex:Ch,map_fragment:Ph,map_pars_fragment:Lh,map_particle_fragment:Dh,map_particle_pars_fragment:Ih,metalnessmap_fragment:Uh,metalnessmap_pars_fragment:Nh,morphinstance_vertex:Fh,morphcolor_vertex:Oh,morphnormal_vertex:Bh,morphtarget_pars_vertex:zh,morphtarget_vertex:Hh,normal_fragment_begin:Vh,normal_fragment_maps:Gh,normal_pars_fragment:kh,normal_pars_vertex:Wh,normal_vertex:Xh,normalmap_pars_fragment:Yh,clearcoat_normal_fragment_begin:qh,clearcoat_normal_fragment_maps:$h,clearcoat_pars_fragment:Kh,iridescence_pars_fragment:Zh,opaque_fragment:Jh,packing:Qh,premultiplied_alpha_fragment:jh,project_vertex:ed,dithering_fragment:td,dithering_pars_fragment:nd,roughnessmap_fragment:id,roughnessmap_pars_fragment:rd,shadowmap_pars_fragment:sd,shadowmap_pars_vertex:ad,shadowmap_vertex:od,shadowmask_pars_fragment:ld,skinbase_vertex:cd,skinning_pars_vertex:ud,skinning_vertex:fd,skinnormal_vertex:hd,specularmap_fragment:dd,specularmap_pars_fragment:pd,tonemapping_fragment:md,tonemapping_pars_fragment:gd,transmission_fragment:vd,transmission_pars_fragment:xd,uv_pars_fragment:_d,uv_pars_vertex:Sd,uv_vertex:Md,worldpos_vertex:yd,background_vert:Ed,background_frag:Td,backgroundCube_vert:bd,backgroundCube_frag:Ad,cube_vert:wd,cube_frag:Rd,depth_vert:Cd,depth_frag:Pd,distance_vert:Ld,distance_frag:Dd,equirect_vert:Id,equirect_frag:Ud,linedashed_vert:Nd,linedashed_frag:Fd,meshbasic_vert:Od,meshbasic_frag:Bd,meshlambert_vert:zd,meshlambert_frag:Hd,meshmatcap_vert:Vd,meshmatcap_frag:Gd,meshnormal_vert:kd,meshnormal_frag:Wd,meshphong_vert:Xd,meshphong_frag:Yd,meshphysical_vert:qd,meshphysical_frag:$d,meshtoon_vert:Kd,meshtoon_frag:Zd,points_vert:Jd,points_frag:Qd,shadow_vert:jd,shadow_frag:ep,sprite_vert:tp,sprite_frag:np},pe={common:{diffuse:{value:new et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new et(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},an={basic:{uniforms:Pt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Pt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new et(0)},envMapIntensity:{value:1}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Pt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new et(0)},specular:{value:new et(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Pt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Pt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new et(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Pt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Pt([pe.points,pe.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Pt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Pt([pe.common,pe.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Pt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Pt([pe.sprite,pe.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distance:{uniforms:Pt([pe.common,pe.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distance_vert,fragmentShader:Oe.distance_frag},shadow:{uniforms:Pt([pe.lights,pe.fog,{color:{value:new et(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};an.physical={uniforms:Pt([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new et(0)},specularColor:{value:new et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Lr={r:0,b:0,g:0},ip=new _t,gc=new Ue;gc.set(-1,0,0,0,1,0,0,0,1);function rp(i,e,t,r,s,n){const a=new et(0);let l=s===!0?0:1,c,f,h=null,m=0,u=null;function o(E){let A=E.isScene===!0?E.background:null;if(A&&A.isTexture){const M=E.backgroundBlurriness>0;A=e.get(A,M)}return A}function d(E){let A=!1;const M=o(E);M===null?p(a,l):M&&M.isColor&&(p(M,1),A=!0);const _=i.xr.getEnvironmentBlendMode();_==="additive"?t.buffers.color.setClear(0,0,0,1,n):_==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,n),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(E,A){const M=o(A);M&&(M.isCubeTexture||M.mapping===jr)?(f===void 0&&(f=new Wt(new ar(1,1,1),new Bt({name:"BackgroundCubeMaterial",uniforms:Bi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:It,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(_,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),f.material.uniforms.envMap.value=M,f.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(ip.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&f.material.uniforms.backgroundRotation.value.premultiply(gc),f.material.toneMapped=Ge.getTransfer(M.colorSpace)!==tt,(h!==M||m!==M.version||u!==i.toneMapping)&&(f.material.needsUpdate=!0,h=M,m=M.version,u=i.toneMapping),f.layers.enableAll(),E.unshift(f,f.geometry,f.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Wt(new Oi(2,2),new Bt({name:"BackgroundMaterial",uniforms:Bi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=Ge.getTransfer(M.colorSpace)!==tt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||m!==M.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,m=M.version,u=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,A){E.getRGB(Lr,dc(i)),t.buffers.color.setClear(Lr.r,Lr.g,Lr.b,A,n)}function g(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,A=1){a.set(E),l=A,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(a,l)},render:d,addToRenderList:v,dispose:g}}function sp(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),r={},s=u(null);let n=s,a=!1;function l(R,C,D,N,I){let z=!1;const U=m(R,N,D,C);n!==U&&(n=U,f(n.object)),z=o(R,N,D,I),z&&d(R,N,D,I),I!==null&&e.update(I,i.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,M(R,C,D,N),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function c(){return i.createVertexArray()}function f(R){return i.bindVertexArray(R)}function h(R){return i.deleteVertexArray(R)}function m(R,C,D,N){const I=N.wireframe===!0;let z=r[C.id];z===void 0&&(z={},r[C.id]=z);const U=R.isInstancedMesh===!0?R.id:0;let W=z[U];W===void 0&&(W={},z[U]=W);let K=W[D.id];K===void 0&&(K={},W[D.id]=K);let ie=K[I];return ie===void 0&&(ie=u(c()),K[I]=ie),ie}function u(R){const C=[],D=[],N=[];for(let I=0;I<t;I++)C[I]=0,D[I]=0,N[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:N,object:R,attributes:{},index:null}}function o(R,C,D,N){const I=n.attributes,z=C.attributes;let U=0;const W=D.getAttributes();for(const K in W)if(W[K].location>=0){const se=I[K];let oe=z[K];if(oe===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(oe=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(oe=R.instanceColor)),se===void 0||se.attribute!==oe||oe&&se.data!==oe.data)return!0;U++}return n.attributesNum!==U||n.index!==N}function d(R,C,D,N){const I={},z=C.attributes;let U=0;const W=D.getAttributes();for(const K in W)if(W[K].location>=0){let se=z[K];se===void 0&&(K==="instanceMatrix"&&R.instanceMatrix&&(se=R.instanceMatrix),K==="instanceColor"&&R.instanceColor&&(se=R.instanceColor));const oe={};oe.attribute=se,se&&se.data&&(oe.data=se.data),I[K]=oe,U++}n.attributes=I,n.attributesNum=U,n.index=N}function v(){const R=n.newAttributes;for(let C=0,D=R.length;C<D;C++)R[C]=0}function p(R){g(R,0)}function g(R,C){const D=n.newAttributes,N=n.enabledAttributes,I=n.attributeDivisors;D[R]=1,N[R]===0&&(i.enableVertexAttribArray(R),N[R]=1),I[R]!==C&&(i.vertexAttribDivisor(R,C),I[R]=C)}function E(){const R=n.newAttributes,C=n.enabledAttributes;for(let D=0,N=C.length;D<N;D++)C[D]!==R[D]&&(i.disableVertexAttribArray(D),C[D]=0)}function A(R,C,D,N,I,z,U){U===!0?i.vertexAttribIPointer(R,C,D,I,z):i.vertexAttribPointer(R,C,D,N,I,z)}function M(R,C,D,N){v();const I=N.attributes,z=D.getAttributes(),U=C.defaultAttributeValues;for(const W in z){const K=z[W];if(K.location>=0){let ie=I[W];if(ie===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(ie=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(ie=R.instanceColor)),ie!==void 0){const se=ie.normalized,oe=ie.itemSize,De=e.get(ie);if(De===void 0)continue;const qe=De.buffer,ne=De.type,H=De.bytesPerElement,ee=ne===i.INT||ne===i.UNSIGNED_INT||ie.gpuType===Ha;if(ie.isInterleavedBufferAttribute){const J=ie.data,ye=J.stride,Ee=ie.offset;if(J.isInstancedInterleavedBuffer){for(let xe=0;xe<K.locationSize;xe++)g(K.location+xe,J.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let xe=0;xe<K.locationSize;xe++)p(K.location+xe);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let xe=0;xe<K.locationSize;xe++)A(K.location+xe,oe/K.locationSize,ne,se,ye*H,(Ee+oe/K.locationSize*xe)*H,ee)}else{if(ie.isInstancedBufferAttribute){for(let J=0;J<K.locationSize;J++)g(K.location+J,ie.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let J=0;J<K.locationSize;J++)p(K.location+J);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let J=0;J<K.locationSize;J++)A(K.location+J,oe/K.locationSize,ne,se,oe*H,oe/K.locationSize*J*H,ee)}}else if(U!==void 0){const se=U[W];if(se!==void 0)switch(se.length){case 2:i.vertexAttrib2fv(K.location,se);break;case 3:i.vertexAttrib3fv(K.location,se);break;case 4:i.vertexAttrib4fv(K.location,se);break;default:i.vertexAttrib1fv(K.location,se)}}}}E()}function _(){y();for(const R in r){const C=r[R];for(const D in C){const N=C[D];for(const I in N){const z=N[I];for(const U in z)h(z[U].object),delete z[U];delete N[I]}}delete r[R]}}function S(R){if(r[R.id]===void 0)return;const C=r[R.id];for(const D in C){const N=C[D];for(const I in N){const z=N[I];for(const U in z)h(z[U].object),delete z[U];delete N[I]}}delete r[R.id]}function T(R){for(const C in r){const D=r[C];for(const N in D){const I=D[N];if(I[R.id]===void 0)continue;const z=I[R.id];for(const U in z)h(z[U].object),delete z[U];delete I[R.id]}}}function x(R){for(const C in r){const D=r[C],N=R.isInstancedMesh===!0?R.id:0,I=D[N];if(I!==void 0){for(const z in I){const U=I[z];for(const W in U)h(U[W].object),delete U[W];delete I[z]}delete D[N],Object.keys(D).length===0&&delete r[C]}}}function y(){w(),a=!0,n!==s&&(n=s,f(n.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:y,resetDefaultState:w,dispose:_,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:p,disableUnusedAttributes:E}}function ap(i,e,t){let r;function s(c){r=c}function n(c,f){i.drawArrays(r,c,f),t.update(f,r,1)}function a(c,f,h){h!==0&&(i.drawArraysInstanced(r,c,f,h),t.update(f,r,h))}function l(c,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,c,0,f,0,h);let u=0;for(let o=0;o<h;o++)u+=f[o];t.update(u,r,1)}this.setMode=s,this.render=n,this.renderInstances=a,this.renderMultiDraw=l}function op(i,e,t,r){let s;function n(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==kt&&r.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(T){const x=T===En&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Gt&&r.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==on&&!x)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const h=c(f);h!==f&&(Ie("WebGLRenderer:",f,"not supported, using",h,"instead."),f=h);const m=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const o=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:l,precision:f,logarithmicDepthBuffer:m,reversedDepthBuffer:u,maxTextures:o,maxVertexTextures:d,maxTextureSize:v,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:E,maxVaryings:A,maxFragmentUniforms:M,maxSamples:_,samples:S}}function lp(i){const e=this;let t=null,r=0,s=!1,n=!1;const a=new Qn,l=new Ue,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(m,u){const o=m.length!==0||u||r!==0||s;return s=u,r=m.length,o},this.beginShadows=function(){n=!0,h(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(m,u){t=h(m,u,0)},this.setState=function(m,u,o){const d=m.clippingPlanes,v=m.clipIntersection,p=m.clipShadows,g=i.get(m);if(!s||d===null||d.length===0||n&&!p)n?h(null):f();else{const E=n?0:r,A=E*4;let M=g.clippingState||null;c.value=M,M=h(d,u,A,o);for(let _=0;_!==A;++_)M[_]=t[_];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function f(){c.value!==t&&(c.value=t,c.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function h(m,u,o,d){const v=m!==null?m.length:0;let p=null;if(v!==0){if(p=c.value,d!==!0||p===null){const g=o+v*4,E=u.matrixWorldInverse;l.getNormalMatrix(E),(p===null||p.length<g)&&(p=new Float32Array(g));for(let A=0,M=o;A!==v;++A,M+=4)a.copy(m[A]).applyMatrix4(E,l),a.normal.toArray(p,M),p[M+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}const Hn=4,el=[.125,.215,.35,.446,.526,.582],ei=20,cp=256,Yi=new Ja,tl=new et;let Fs=null,Os=0,Bs=0,zs=!1;const up=new Y;class nl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,r=.1,s=100,n={}){const{size:a=256,position:l=up}=n;Fs=this._renderer.getRenderTarget(),Os=this._renderer.getActiveCubeFace(),Bs=this._renderer.getActiveMipmapLevel(),zs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,r,s,c,l),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Fs,Os,Bs),this._renderer.xr.enabled=zs,e.scissorTest=!1,bi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ri||e.mapping===Ni?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fs=this._renderer.getRenderTarget(),Os=this._renderer.getActiveCubeFace(),Bs=this._renderer.getActiveMipmapLevel(),zs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:vt,minFilter:vt,generateMipmaps:!1,type:En,format:kt,colorSpace:Yr,depthBuffer:!1},s=il(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=il(e,t,r);const{_lodMax:n}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=fp(n)),this._blurMaterial=dp(n,e,t),this._ggxMaterial=hp(n,e,t)}return s}_compileMaterial(e){const t=new Wt(new An,e);this._renderer.compile(t,Yi)}_sceneToCubeUV(e,t,r,s,n){const c=new $t(90,1,t,r),f=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],m=this._renderer,u=m.autoClear,o=m.toneMapping;m.getClearColor(tl),m.toneMapping=cn,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(s),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Wt(new ar,new cc({name:"PMREM.Background",side:It,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let g=!1;const E=e.background;E?E.isColor&&(p.color.copy(E),e.background=null,g=!0):(p.color.copy(tl),g=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(c.up.set(0,f[A],0),c.position.set(n.x,n.y,n.z),c.lookAt(n.x+h[A],n.y,n.z)):M===1?(c.up.set(0,0,f[A]),c.position.set(n.x,n.y,n.z),c.lookAt(n.x,n.y+h[A],n.z)):(c.up.set(0,f[A],0),c.position.set(n.x,n.y,n.z),c.lookAt(n.x,n.y,n.z+h[A]));const _=this._cubeSize;bi(s,M*_,A>2?_:0,_,_),m.setRenderTarget(s),g&&m.render(v,c),m.render(e,c)}m.toneMapping=o,m.autoClear=u,e.background=E}_textureToCubeUV(e,t){const r=this._renderer,s=e.mapping===ri||e.mapping===Ni;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rl());const n=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=n;const l=n.uniforms;l.envMap.value=e;const c=this._cubeSize;bi(t,0,0,3*c,2*c),r.setRenderTarget(t),r.render(a,Yi)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let n=1;n<s;n++)this._applyGGXFilter(e,n-1,n);t.autoClear=r}_applyGGXFilter(e,t,r){const s=this._renderer,n=this._pingPongRenderTarget,a=this._ggxMaterial,l=this._lodMeshes[r];l.material=a;const c=a.uniforms,f=r/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),m=Math.sqrt(f*f-h*h),u=0+f*1.25,o=m*u,{_lodMax:d}=this,v=this._sizeLods[r],p=3*v*(r>d-Hn?r-d+Hn:0),g=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=o,c.mipInt.value=d-t,bi(n,p,g,3*v,2*v),s.setRenderTarget(n),s.render(l,Yi),c.envMap.value=n.texture,c.roughness.value=0,c.mipInt.value=d-r,bi(e,p,g,3*v,2*v),s.setRenderTarget(e),s.render(l,Yi)}_blur(e,t,r,s,n){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,r,s,"latitudinal",n),this._halfBlur(a,e,r,r,s,"longitudinal",n)}_halfBlur(e,t,r,s,n,a,l){const c=this._renderer,f=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ke("blur direction must be either latitudinal or longitudinal!");const h=3,m=this._lodMeshes[s];m.material=f;const u=f.uniforms,o=this._sizeLods[r]-1,d=isFinite(n)?Math.PI/(2*o):2*Math.PI/(2*ei-1),v=n/d,p=isFinite(n)?1+Math.floor(h*v):ei;p>ei&&Ie(`sigmaRadians, ${n}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const g=[];let E=0;for(let T=0;T<ei;++T){const x=T/v,y=Math.exp(-x*x/2);g.push(y),T===0?E+=y:T<p&&(E+=2*y)}for(let T=0;T<g.length;T++)g[T]=g[T]/E;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=g,u.latitudinal.value=a==="latitudinal",l&&(u.poleAxis.value=l);const{_lodMax:A}=this;u.dTheta.value=d,u.mipInt.value=A-r;const M=this._sizeLods[s],_=3*M*(s>A-Hn?s-A+Hn:0),S=4*(this._cubeSize-M);bi(t,_,S,3*M,2*M),c.setRenderTarget(t),c.render(m,Yi)}}function fp(i){const e=[],t=[],r=[];let s=i;const n=i-Hn+1+el.length;for(let a=0;a<n;a++){const l=Math.pow(2,s);e.push(l);let c=1/l;a>i-Hn?c=el[a-i+Hn-1]:a===0&&(c=0),t.push(c);const f=1/(l-2),h=-f,m=1+f,u=[h,h,m,h,m,m,h,h,m,m,h,m],o=6,d=6,v=3,p=2,g=1,E=new Float32Array(v*d*o),A=new Float32Array(p*d*o),M=new Float32Array(g*d*o);for(let S=0;S<o;S++){const T=S%3*2/3-1,x=S>2?0:-1,y=[T,x,0,T+2/3,x,0,T+2/3,x+1,0,T,x,0,T+2/3,x+1,0,T,x+1,0];E.set(y,v*d*S),A.set(u,p*d*S);const w=[S,S,S,S,S,S];M.set(w,g*d*S)}const _=new An;_.setAttribute("position",new un(E,v)),_.setAttribute("uv",new un(A,p)),_.setAttribute("faceIndex",new un(M,g)),r.push(new Wt(_,null)),s>Hn&&s--}return{lodMeshes:r,sizeLods:e,sigmas:t}}function il(i,e,t){const r=new Qt(i,e,t);return r.texture.mapping=jr,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function bi(i,e,t,r,s){i.viewport.set(e,t,r,s),i.scissor.set(e,t,r,s)}function hp(i,e,t){return new Bt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:cp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ts(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function dp(i,e,t){const r=new Float32Array(ei),s=new Y(0,1,0);return new Bt({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function rl(){return new Bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function sl(){return new Bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ts(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function ts(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class vc extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},s=[r,r,r,r,r,r];this.texture=new fc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ar(5,5,5),n=new Bt({name:"CubemapFromEquirect",uniforms:Bi(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:It,blending:Sn});n.uniforms.tEquirect.value=t;const a=new Wt(s,n),l=t.minFilter;return t.minFilter===zn&&(t.minFilter=vt),new _f(1,10,this).update(e,a),t.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,r=!0,s=!0){const n=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,r,s);e.setRenderTarget(n)}}function pp(i){let e=new WeakMap,t=new WeakMap,r=null;function s(u,o=!1){return u==null?null:o?a(u):n(u)}function n(u){if(u&&u.isTexture){const o=u.mapping;if(o===os||o===ls)if(e.has(u)){const d=e.get(u).texture;return l(d,u.mapping)}else{const d=u.image;if(d&&d.height>0){const v=new vc(d.height);return v.fromEquirectangularTexture(i,u),e.set(u,v),u.addEventListener("dispose",f),l(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const o=u.mapping,d=o===os||o===ls,v=o===ri||o===Ni;if(d||v){let p=t.get(u);const g=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return r===null&&(r=new nl(i)),p=d?r.fromEquirectangular(u,p):r.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const E=u.image;return d&&E&&E.height>0||v&&E&&c(E)?(r===null&&(r=new nl(i)),p=d?r.fromEquirectangular(u):r.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function l(u,o){return o===os?u.mapping=ri:o===ls&&(u.mapping=Ni),u}function c(u){let o=0;const d=6;for(let v=0;v<d;v++)u[v]!==void 0&&o++;return o===d}function f(u){const o=u.target;o.removeEventListener("dispose",f);const d=e.get(o);d!==void 0&&(e.delete(o),d.dispose())}function h(u){const o=u.target;o.removeEventListener("dispose",h);const d=t.get(o);d!==void 0&&(t.delete(o),d.dispose())}function m(){e=new WeakMap,t=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:s,dispose:m}}function mp(i){const e={};function t(r){if(e[r]!==void 0)return e[r];const s=i.getExtension(r);return e[r]=s,s}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const s=t(r);return s===null&&Di("WebGLRenderer: "+r+" extension not supported."),s}}}function gp(i,e,t,r){const s={},n=new WeakMap;function a(m){const u=m.target;u.index!==null&&e.remove(u.index);for(const d in u.attributes)e.remove(u.attributes[d]);u.removeEventListener("dispose",a),delete s[u.id];const o=n.get(u);o&&(e.remove(o),n.delete(u)),r.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function l(m,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function c(m){const u=m.attributes;for(const o in u)e.update(u[o],i.ARRAY_BUFFER)}function f(m){const u=[],o=m.index,d=m.attributes.position;let v=0;if(d===void 0)return;if(o!==null){const E=o.array;v=o.version;for(let A=0,M=E.length;A<M;A+=3){const _=E[A+0],S=E[A+1],T=E[A+2];u.push(_,S,S,T,T,_)}}else{const E=d.array;v=d.version;for(let A=0,M=E.length/3-1;A<M;A+=3){const _=A+0,S=A+1,T=A+2;u.push(_,S,S,T,T,_)}}const p=new(d.count>=65535?lc:oc)(u,1);p.version=v;const g=n.get(m);g&&e.remove(g),n.set(m,p)}function h(m){const u=n.get(m);if(u){const o=m.index;o!==null&&u.version<o.version&&f(m)}else f(m);return n.get(m)}return{get:l,update:c,getWireframeAttribute:h}}function vp(i,e,t){let r;function s(m){r=m}let n,a;function l(m){n=m.type,a=m.bytesPerElement}function c(m,u){i.drawElements(r,u,n,m*a),t.update(u,r,1)}function f(m,u,o){o!==0&&(i.drawElementsInstanced(r,u,n,m*a,o),t.update(u,r,o))}function h(m,u,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,u,0,n,m,0,o);let v=0;for(let p=0;p<o;p++)v+=u[p];t.update(v,r,1)}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=f,this.renderMultiDraw=h}function xp(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(n,a,l){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=l*(n/3);break;case i.LINES:t.lines+=l*(n/2);break;case i.LINE_STRIP:t.lines+=l*(n-1);break;case i.LINE_LOOP:t.lines+=l*n;break;case i.POINTS:t.points+=l*n;break;default:Ke("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:r}}function _p(i,e,t){const r=new WeakMap,s=new ft;function n(a,l,c){const f=a.morphTargetInfluences,h=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,m=h!==void 0?h.length:0;let u=r.get(l);if(u===void 0||u.count!==m){let w=function(){x.dispose(),r.delete(l),l.removeEventListener("dispose",w)};var o=w;u!==void 0&&u.texture.dispose();const d=l.morphAttributes.position!==void 0,v=l.morphAttributes.normal!==void 0,p=l.morphAttributes.color!==void 0,g=l.morphAttributes.position||[],E=l.morphAttributes.normal||[],A=l.morphAttributes.color||[];let M=0;d===!0&&(M=1),v===!0&&(M=2),p===!0&&(M=3);let _=l.attributes.position.count*M,S=1;_>e.maxTextureSize&&(S=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const T=new Float32Array(_*S*4*m),x=new rc(T,_,S,m);x.type=on,x.needsUpdate=!0;const y=M*4;for(let R=0;R<m;R++){const C=g[R],D=E[R],N=A[R],I=_*S*4*R;for(let z=0;z<C.count;z++){const U=z*y;d===!0&&(s.fromBufferAttribute(C,z),T[I+U+0]=s.x,T[I+U+1]=s.y,T[I+U+2]=s.z,T[I+U+3]=0),v===!0&&(s.fromBufferAttribute(D,z),T[I+U+4]=s.x,T[I+U+5]=s.y,T[I+U+6]=s.z,T[I+U+7]=0),p===!0&&(s.fromBufferAttribute(N,z),T[I+U+8]=s.x,T[I+U+9]=s.y,T[I+U+10]=s.z,T[I+U+11]=N.itemSize===4?s.w:1)}}u={count:m,texture:x,size:new He(_,S)},r.set(l,u),l.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let p=0;p<f.length;p++)d+=f[p];const v=l.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",f)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:n}}function Sp(i,e,t,r,s){let n=new WeakMap;function a(f){const h=s.render.frame,m=f.geometry,u=e.get(f,m);if(n.get(u)!==h&&(e.update(u),n.set(u,h)),f.isInstancedMesh&&(f.hasEventListener("dispose",c)===!1&&f.addEventListener("dispose",c),n.get(f)!==h&&(t.update(f.instanceMatrix,i.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,i.ARRAY_BUFFER),n.set(f,h))),f.isSkinnedMesh){const o=f.skeleton;n.get(o)!==h&&(o.update(),n.set(o,h))}return u}function l(){n=new WeakMap}function c(f){const h=f.target;h.removeEventListener("dispose",c),r.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:l}}const Mp={[Gl]:"LINEAR_TONE_MAPPING",[kl]:"REINHARD_TONE_MAPPING",[Wl]:"CINEON_TONE_MAPPING",[Xl]:"ACES_FILMIC_TONE_MAPPING",[ql]:"AGX_TONE_MAPPING",[$l]:"NEUTRAL_TONE_MAPPING",[Yl]:"CUSTOM_TONE_MAPPING"};function yp(i,e,t,r,s,n){const a=new Qt(e,t,{type:i,depthBuffer:s,stencilBuffer:n,samples:r?4:0,depthTexture:s?new Fi(e,t):void 0}),l=new Qt(e,t,{type:En,depthBuffer:!1,stencilBuffer:!1}),c=new An;c.setAttribute("position",new yn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new yn([0,2,0,0,2,0],2));const f=new hf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Wt(c,f),m=new Ja(-1,1,1,-1,0,1);let u=null,o=null,d=!1,v,p=null,g=[],E=!1;this.setSize=function(A,M){a.setSize(A,M),l.setSize(A,M);for(let _=0;_<g.length;_++){const S=g[_];S.setSize&&S.setSize(A,M)}},this.setEffects=function(A){g=A,E=g.length>0&&g[0].isRenderPass===!0;const M=a.width,_=a.height;for(let S=0;S<g.length;S++){const T=g[S];T.setSize&&T.setSize(M,_)}},this.begin=function(A,M){if(d||A.toneMapping===cn&&g.length===0)return!1;if(p=M,M!==null){const _=M.width,S=M.height;(a.width!==_||a.height!==S)&&this.setSize(_,S)}return E===!1&&A.setRenderTarget(a),v=A.toneMapping,A.toneMapping=cn,!0},this.hasRenderPass=function(){return E},this.end=function(A,M){A.toneMapping=v,d=!0;let _=a,S=l;for(let T=0;T<g.length;T++){const x=g[T];if(x.enabled!==!1&&(x.render(A,S,_,M),x.needsSwap!==!1)){const y=_;_=S,S=y}}if(u!==A.outputColorSpace||o!==A.toneMapping){u=A.outputColorSpace,o=A.toneMapping,f.defines={},Ge.getTransfer(u)===tt&&(f.defines.SRGB_TRANSFER="");const T=Mp[o];T&&(f.defines[T]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=_.texture,A.setRenderTarget(p),A.render(h,m),p=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),l.dispose(),c.dispose(),f.dispose()}}const xc=new At,Ua=new Fi(1,1),_c=new rc,Sc=new Vu,Mc=new fc,al=[],ol=[],ll=new Float32Array(16),cl=new Float32Array(9),ul=new Float32Array(4);function Hi(i,e,t){const r=i[0];if(r<=0||r>0)return i;const s=e*t;let n=al[s];if(n===void 0&&(n=new Float32Array(s),al[s]=n),e!==0){r.toArray(n,0);for(let a=1,l=0;a!==e;++a)l+=t,i[a].toArray(n,l)}return n}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,r=i.length;t<r;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,r=e.length;t<r;t++)i[t]=e[t]}function ns(i,e){let t=ol[e];t===void 0&&(t=new Int32Array(e),ol[e]=t);for(let r=0;r!==e;++r)t[r]=i.allocateTextureUnit();return t}function Ep(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Tp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function bp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function Ap(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function wp(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,r))return;ul.set(r),i.uniformMatrix2fv(this.addr,!1,ul),yt(t,r)}}function Rp(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,r))return;cl.set(r),i.uniformMatrix3fv(this.addr,!1,cl),yt(t,r)}}function Cp(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,r))return;ll.set(r),i.uniformMatrix4fv(this.addr,!1,ll),yt(t,r)}}function Pp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Lp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function Dp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function Ip(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Up(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Np(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function Fp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function Op(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function Bp(i,e,t){const r=this.cache,s=t.allocateTextureUnit();r[0]!==s&&(i.uniform1i(this.addr,s),r[0]=s);let n;this.type===i.SAMPLER_2D_SHADOW?(Ua.compareFunction=t.isReversedDepthBuffer()?qa:Ya,n=Ua):n=xc,t.setTexture2D(e||n,s)}function zp(i,e,t){const r=this.cache,s=t.allocateTextureUnit();r[0]!==s&&(i.uniform1i(this.addr,s),r[0]=s),t.setTexture3D(e||Sc,s)}function Hp(i,e,t){const r=this.cache,s=t.allocateTextureUnit();r[0]!==s&&(i.uniform1i(this.addr,s),r[0]=s),t.setTextureCube(e||Mc,s)}function Vp(i,e,t){const r=this.cache,s=t.allocateTextureUnit();r[0]!==s&&(i.uniform1i(this.addr,s),r[0]=s),t.setTexture2DArray(e||_c,s)}function Gp(i){switch(i){case 5126:return Ep;case 35664:return Tp;case 35665:return bp;case 35666:return Ap;case 35674:return wp;case 35675:return Rp;case 35676:return Cp;case 5124:case 35670:return Pp;case 35667:case 35671:return Lp;case 35668:case 35672:return Dp;case 35669:case 35673:return Ip;case 5125:return Up;case 36294:return Np;case 36295:return Fp;case 36296:return Op;case 35678:case 36198:case 36298:case 36306:case 35682:return Bp;case 35679:case 36299:case 36307:return zp;case 35680:case 36300:case 36308:case 36293:return Hp;case 36289:case 36303:case 36311:case 36292:return Vp}}function kp(i,e){i.uniform1fv(this.addr,e)}function Wp(i,e){const t=Hi(e,this.size,2);i.uniform2fv(this.addr,t)}function Xp(i,e){const t=Hi(e,this.size,3);i.uniform3fv(this.addr,t)}function Yp(i,e){const t=Hi(e,this.size,4);i.uniform4fv(this.addr,t)}function qp(i,e){const t=Hi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function $p(i,e){const t=Hi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Kp(i,e){const t=Hi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Zp(i,e){i.uniform1iv(this.addr,e)}function Jp(i,e){i.uniform2iv(this.addr,e)}function Qp(i,e){i.uniform3iv(this.addr,e)}function jp(i,e){i.uniform4iv(this.addr,e)}function em(i,e){i.uniform1uiv(this.addr,e)}function tm(i,e){i.uniform2uiv(this.addr,e)}function nm(i,e){i.uniform3uiv(this.addr,e)}function im(i,e){i.uniform4uiv(this.addr,e)}function rm(i,e,t){const r=this.cache,s=e.length,n=ns(t,s);Mt(r,n)||(i.uniform1iv(this.addr,n),yt(r,n));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ua:a=xc;for(let l=0;l!==s;++l)t.setTexture2D(e[l]||a,n[l])}function sm(i,e,t){const r=this.cache,s=e.length,n=ns(t,s);Mt(r,n)||(i.uniform1iv(this.addr,n),yt(r,n));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Sc,n[a])}function am(i,e,t){const r=this.cache,s=e.length,n=ns(t,s);Mt(r,n)||(i.uniform1iv(this.addr,n),yt(r,n));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Mc,n[a])}function om(i,e,t){const r=this.cache,s=e.length,n=ns(t,s);Mt(r,n)||(i.uniform1iv(this.addr,n),yt(r,n));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||_c,n[a])}function lm(i){switch(i){case 5126:return kp;case 35664:return Wp;case 35665:return Xp;case 35666:return Yp;case 35674:return qp;case 35675:return $p;case 35676:return Kp;case 5124:case 35670:return Zp;case 35667:case 35671:return Jp;case 35668:case 35672:return Qp;case 35669:case 35673:return jp;case 5125:return em;case 36294:return tm;case 36295:return nm;case 36296:return im;case 35678:case 36198:case 36298:case 36306:case 35682:return rm;case 35679:case 36299:case 36307:return sm;case 35680:case 36300:case 36308:case 36293:return am;case 36289:case 36303:case 36311:case 36292:return om}}class cm{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=Gp(t.type)}}class um{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lm(t.type)}}class fm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const s=this.seq;for(let n=0,a=s.length;n!==a;++n){const l=s[n];l.setValue(e,t[l.id],r)}}}const Hs=/(\w+)(\])?(\[|\.)?/g;function fl(i,e){i.seq.push(e),i.map[e.id]=e}function hm(i,e,t){const r=i.name,s=r.length;for(Hs.lastIndex=0;;){const n=Hs.exec(r),a=Hs.lastIndex;let l=n[1];const c=n[2]==="]",f=n[3];if(c&&(l=l|0),f===void 0||f==="["&&a+2===s){fl(t,f===void 0?new cm(l,i,e):new um(l,i,e));break}else{let m=t.map[l];m===void 0&&(m=new fm(l),fl(t,m)),t=m}}}class Hr{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),c=e.getUniformLocation(t,l.name);hm(l,c,this)}const s=[],n=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):n.push(a);s.length>0&&(this.seq=s.concat(n))}setValue(e,t,r,s){const n=this.map[t];n!==void 0&&n.setValue(e,r,s)}setOptional(e,t,r){const s=t[r];s!==void 0&&this.setValue(e,r,s)}static upload(e,t,r,s){for(let n=0,a=t.length;n!==a;++n){const l=t[n],c=r[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,s)}}static seqWithValue(e,t){const r=[];for(let s=0,n=e.length;s!==n;++s){const a=e[s];a.id in t&&r.push(a)}return r}}function hl(i,e,t){const r=i.createShader(e);return i.shaderSource(r,t),i.compileShader(r),r}const dm=37297;let pm=0;function mm(i,e){const t=i.split(`
`),r=[],s=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let a=s;a<n;a++){const l=a+1;r.push(`${l===e?">":" "} ${l}: ${t[a]}`)}return r.join(`
`)}const dl=new Ue;function gm(i){Ge._getMatrix(dl,Ge.workingColorSpace,i);const e=`mat3( ${dl.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(i)){case qr:return[e,"LinearTransferOETF"];case tt:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function pl(i,e,t){const r=i.getShaderParameter(e,i.COMPILE_STATUS),n=(i.getShaderInfoLog(e)||"").trim();if(r&&n==="")return"";const a=/ERROR: 0:(\d+)/.exec(n);if(a){const l=parseInt(a[1]);return t.toUpperCase()+`

`+n+`

`+mm(i.getShaderSource(e),l)}else return n}function vm(i,e){const t=gm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const xm={[Gl]:"Linear",[kl]:"Reinhard",[Wl]:"Cineon",[Xl]:"ACESFilmic",[ql]:"AgX",[$l]:"Neutral",[Yl]:"Custom"};function _m(i,e){const t=xm[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Dr=new Y;function Sm(){Ge.getLuminanceCoefficients(Dr);const i=Dr.x.toFixed(4),e=Dr.y.toFixed(4),t=Dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Mm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ki).join(`
`)}function ym(i){const e=[];for(const t in i){const r=i[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function Em(i,e){const t={},r=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<r;s++){const n=i.getActiveAttrib(e,s),a=n.name;let l=1;n.type===i.FLOAT_MAT2&&(l=2),n.type===i.FLOAT_MAT3&&(l=3),n.type===i.FLOAT_MAT4&&(l=4),t[a]={type:n.type,location:i.getAttribLocation(e,a),locationSize:l}}return t}function Ki(i){return i!==""}function ml(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Tm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(i){return i.replace(Tm,Am)}const bm=new Map;function Am(i,e){let t=Oe[e];if(t===void 0){const r=bm.get(e);if(r!==void 0)t=Oe[r],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Na(t)}const wm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vl(i){return i.replace(wm,Rm)}function Rm(i,e,t,r){let s="";for(let n=parseInt(e);n<parseInt(t);n++)s+=r.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return s}function xl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Cm={[Nr]:"SHADOWMAP_TYPE_PCF",[$i]:"SHADOWMAP_TYPE_VSM"};function Pm(i){return Cm[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Lm={[ri]:"ENVMAP_TYPE_CUBE",[Ni]:"ENVMAP_TYPE_CUBE",[jr]:"ENVMAP_TYPE_CUBE_UV"};function Dm(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Lm[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Im={[Ni]:"ENVMAP_MODE_REFRACTION"};function Um(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Im[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Nm={[Vl]:"ENVMAP_BLENDING_MULTIPLY",[Su]:"ENVMAP_BLENDING_MIX",[Mu]:"ENVMAP_BLENDING_ADD"};function Fm(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Nm[i.combine]||"ENVMAP_BLENDING_NONE"}function Om(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function Bm(i,e,t,r){const s=i.getContext(),n=t.defines;let a=t.vertexShader,l=t.fragmentShader;const c=Pm(t),f=Dm(t),h=Um(t),m=Fm(t),u=Om(t),o=Mm(t),d=ym(n),v=s.createProgram();let p,g,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ki).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(Ki).join(`
`),g.length>0&&(g+=`
`)):(p=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ki).join(`
`),g=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+h:"",t.envMap?"#define "+m:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==cn?"#define TONE_MAPPING":"",t.toneMapping!==cn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==cn?_m("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,vm("linearToOutputTexel",t.outputColorSpace),Sm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ki).join(`
`)),a=Na(a),a=ml(a,t),a=gl(a,t),l=Na(l),l=ml(l,t),l=gl(l,t),a=vl(a),l=vl(l),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=[o,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===Lo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const A=E+p+a,M=E+g+l,_=hl(s,s.VERTEX_SHADER,A),S=hl(s,s.FRAGMENT_SHADER,M);s.attachShader(v,_),s.attachShader(v,S),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(R){if(i.debug.checkShaderErrors){const C=s.getProgramInfoLog(v)||"",D=s.getShaderInfoLog(_)||"",N=s.getShaderInfoLog(S)||"",I=C.trim(),z=D.trim(),U=N.trim();let W=!0,K=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,_,S);else{const ie=pl(s,_,"vertex"),se=pl(s,S,"fragment");Ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+ie+`
`+se)}else I!==""?Ie("WebGLProgram: Program Info Log:",I):(z===""||U==="")&&(K=!1);K&&(R.diagnostics={runnable:W,programLog:I,vertexShader:{log:z,prefix:p},fragmentShader:{log:U,prefix:g}})}s.deleteShader(_),s.deleteShader(S),x=new Hr(s,v),y=Em(s,v)}let x;this.getUniforms=function(){return x===void 0&&T(this),x};let y;this.getAttributes=function(){return y===void 0&&T(this),y};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=s.getProgramParameter(v,dm)),w},this.destroy=function(){r.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pm++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=_,this.fragmentShader=S,this}let zm=0;class Hm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,r){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new Vm(e),t.set(e,r)),r}}class Vm{constructor(e){this.id=zm++,this.code=e,this.usedTimes=0}}function Gm(i){return i===si||i===Wr||i===Xr}function km(i,e,t,r,s,n){const a=new sc,l=new Hm,c=new Set,f=[],h=new Map,m=r.logarithmicDepthBuffer;let u=r.precision;const o={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(x){return c.add(x),x===0?"uv":`uv${x}`}function v(x,y,w,R,C,D){const N=R.fog,I=C.geometry,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,U=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,W=e.get(x.envMap||z,U),K=W&&W.mapping===jr?W.image.height:null,ie=o[x.type];x.precision!==null&&(u=r.getMaxPrecision(x.precision),u!==x.precision&&Ie("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const se=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,oe=se!==void 0?se.length:0;let De=0;I.morphAttributes.position!==void 0&&(De=1),I.morphAttributes.normal!==void 0&&(De=2),I.morphAttributes.color!==void 0&&(De=3);let qe,ne,H,ee;if(ie){const Te=an[ie];qe=Te.vertexShader,ne=Te.fragmentShader}else{qe=x.vertexShader,ne=x.fragmentShader;const Te=l.getVertexShaderStage(x),ht=l.getFragmentShaderStage(x);l.update(x,Te,ht),H=Te.id,ee=ht.id}const J=i.getRenderTarget(),ye=i.state.buffers.depth.getReversed(),Ee=C.isInstancedMesh===!0,xe=C.isBatchedMesh===!0,re=!!x.map,_e=!!x.matcap,We=!!W,Ve=!!x.aoMap,Be=!!x.lightMap,ct=!!x.bumpMap&&x.wireframe===!1,ut=!!x.normalMap,je=!!x.displacementMap,Ze=!!x.emissiveMap,Xe=!!x.metalnessMap,nt=!!x.roughnessMap,O=x.anisotropy>0,St=x.clearcoat>0,Je=x.dispersion>0,L=x.iridescence>0,b=x.sheen>0,V=x.transmission>0,G=O&&!!x.anisotropyMap,$=St&&!!x.clearcoatMap,ae=St&&!!x.clearcoatNormalMap,ce=St&&!!x.clearcoatRoughnessMap,Z=L&&!!x.iridescenceMap,j=L&&!!x.iridescenceThicknessMap,ue=b&&!!x.sheenColorMap,we=b&&!!x.sheenRoughnessMap,de=!!x.specularMap,fe=!!x.specularColorMap,Pe=!!x.specularIntensityMap,Le=V&&!!x.transmissionMap,Ne=V&&!!x.thicknessMap,F=!!x.gradientMap,le=!!x.alphaMap,Q=x.alphaTest>0,he=!!x.alphaHash,ve=!!x.extensions;let te=cn;x.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(te=i.toneMapping);const Ae={shaderID:ie,shaderType:x.type,shaderName:x.name,vertexShader:qe,fragmentShader:ne,defines:x.defines,customVertexShaderID:H,customFragmentShaderID:ee,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:xe,batchingColor:xe&&C._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&C.instanceColor!==null,instancingMorph:Ee&&C.morphTexture!==null,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ge.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:re,matcap:_e,envMap:We,envMapMode:We&&W.mapping,envMapCubeUVHeight:K,aoMap:Ve,lightMap:Be,bumpMap:ct,normalMap:ut,displacementMap:je,emissiveMap:Ze,normalMapObjectSpace:ut&&x.normalMapType===Tu,normalMapTangentSpace:ut&&x.normalMapType===Ro,packedNormalMap:ut&&x.normalMapType===Ro&&Gm(x.normalMap.format),metalnessMap:Xe,roughnessMap:nt,anisotropy:O,anisotropyMap:G,clearcoat:St,clearcoatMap:$,clearcoatNormalMap:ae,clearcoatRoughnessMap:ce,dispersion:Je,iridescence:L,iridescenceMap:Z,iridescenceThicknessMap:j,sheen:b,sheenColorMap:ue,sheenRoughnessMap:we,specularMap:de,specularColorMap:fe,specularIntensityMap:Pe,transmission:V,transmissionMap:Le,thicknessMap:Ne,gradientMap:F,opaque:x.transparent===!1&&x.blending===Li&&x.alphaToCoverage===!1,alphaMap:le,alphaTest:Q,alphaHash:he,combine:x.combine,mapUv:re&&d(x.map.channel),aoMapUv:Ve&&d(x.aoMap.channel),lightMapUv:Be&&d(x.lightMap.channel),bumpMapUv:ct&&d(x.bumpMap.channel),normalMapUv:ut&&d(x.normalMap.channel),displacementMapUv:je&&d(x.displacementMap.channel),emissiveMapUv:Ze&&d(x.emissiveMap.channel),metalnessMapUv:Xe&&d(x.metalnessMap.channel),roughnessMapUv:nt&&d(x.roughnessMap.channel),anisotropyMapUv:G&&d(x.anisotropyMap.channel),clearcoatMapUv:$&&d(x.clearcoatMap.channel),clearcoatNormalMapUv:ae&&d(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&d(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&d(x.iridescenceMap.channel),iridescenceThicknessMapUv:j&&d(x.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&d(x.sheenColorMap.channel),sheenRoughnessMapUv:we&&d(x.sheenRoughnessMap.channel),specularMapUv:de&&d(x.specularMap.channel),specularColorMapUv:fe&&d(x.specularColorMap.channel),specularIntensityMapUv:Pe&&d(x.specularIntensityMap.channel),transmissionMapUv:Le&&d(x.transmissionMap.channel),thicknessMapUv:Ne&&d(x.thicknessMap.channel),alphaMapUv:le&&d(x.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(ut||O),vertexNormals:!!I.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!I.attributes.uv&&(re||le),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||I.attributes.normal===void 0&&ut===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:ye,skinning:C.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:De,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:n.numPlanes,numClipIntersection:n.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,decodeVideoTexture:re&&x.map.isVideoTexture===!0&&Ge.getTransfer(x.map.colorSpace)===tt,decodeVideoTextureEmissive:Ze&&x.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(x.emissiveMap.colorSpace)===tt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===_n,flipSided:x.side===It,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ve&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&x.extensions.multiDraw===!0||xe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ae.vertexUv1s=c.has(1),Ae.vertexUv2s=c.has(2),Ae.vertexUv3s=c.has(3),c.clear(),Ae}function p(x){const y=[];if(x.shaderID?y.push(x.shaderID):(y.push(x.customVertexShaderID),y.push(x.customFragmentShaderID)),x.defines!==void 0)for(const w in x.defines)y.push(w),y.push(x.defines[w]);return x.isRawShaderMaterial===!1&&(g(y,x),E(y,x),y.push(i.outputColorSpace)),y.push(x.customProgramCacheKey),y.join()}function g(x,y){x.push(y.precision),x.push(y.outputColorSpace),x.push(y.envMapMode),x.push(y.envMapCubeUVHeight),x.push(y.mapUv),x.push(y.alphaMapUv),x.push(y.lightMapUv),x.push(y.aoMapUv),x.push(y.bumpMapUv),x.push(y.normalMapUv),x.push(y.displacementMapUv),x.push(y.emissiveMapUv),x.push(y.metalnessMapUv),x.push(y.roughnessMapUv),x.push(y.anisotropyMapUv),x.push(y.clearcoatMapUv),x.push(y.clearcoatNormalMapUv),x.push(y.clearcoatRoughnessMapUv),x.push(y.iridescenceMapUv),x.push(y.iridescenceThicknessMapUv),x.push(y.sheenColorMapUv),x.push(y.sheenRoughnessMapUv),x.push(y.specularMapUv),x.push(y.specularColorMapUv),x.push(y.specularIntensityMapUv),x.push(y.transmissionMapUv),x.push(y.thicknessMapUv),x.push(y.combine),x.push(y.fogExp2),x.push(y.sizeAttenuation),x.push(y.morphTargetsCount),x.push(y.morphAttributeCount),x.push(y.numDirLights),x.push(y.numPointLights),x.push(y.numSpotLights),x.push(y.numSpotLightMaps),x.push(y.numHemiLights),x.push(y.numRectAreaLights),x.push(y.numDirLightShadows),x.push(y.numPointLightShadows),x.push(y.numSpotLightShadows),x.push(y.numSpotLightShadowsWithMaps),x.push(y.numLightProbes),x.push(y.shadowMapType),x.push(y.toneMapping),x.push(y.numClippingPlanes),x.push(y.numClipIntersection),x.push(y.depthPacking)}function E(x,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function A(x){const y=o[x.type];let w;if(y){const R=an[y];w=cf.clone(R.uniforms)}else w=x.uniforms;return w}function M(x,y){let w=h.get(y);return w!==void 0?++w.usedTimes:(w=new Bm(i,y,x,s),f.push(w),h.set(y,w)),w}function _(x){if(--x.usedTimes===0){const y=f.indexOf(x);f[y]=f[f.length-1],f.pop(),h.delete(x.cacheKey),x.destroy()}}function S(x){l.remove(x)}function T(){l.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:A,acquireProgram:M,releaseProgram:_,releaseShaderCache:S,programs:f,dispose:T}}function Wm(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let l=i.get(a);return l===void 0&&(l={},i.set(a,l)),l}function r(a){i.delete(a)}function s(a,l,c){i.get(a)[l]=c}function n(){i=new WeakMap}return{has:e,get:t,remove:r,update:s,dispose:n}}function Xm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function _l(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Sl(){const i=[];let e=0;const t=[],r=[],s=[];function n(){e=0,t.length=0,r.length=0,s.length=0}function a(u){let o=0;return u.isInstancedMesh&&(o+=2),u.isSkinnedMesh&&(o+=1),o}function l(u,o,d,v,p,g){let E=i[e];return E===void 0?(E={id:u.id,object:u,geometry:o,material:d,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:p,group:g},i[e]=E):(E.id=u.id,E.object=u,E.geometry=o,E.material=d,E.materialVariant=a(u),E.groupOrder=v,E.renderOrder=u.renderOrder,E.z=p,E.group=g),e++,E}function c(u,o,d,v,p,g){const E=l(u,o,d,v,p,g);d.transmission>0?r.push(E):d.transparent===!0?s.push(E):t.push(E)}function f(u,o,d,v,p,g){const E=l(u,o,d,v,p,g);d.transmission>0?r.unshift(E):d.transparent===!0?s.unshift(E):t.unshift(E)}function h(u,o,d){t.length>1&&t.sort(u||Xm),r.length>1&&r.sort(o||_l),s.length>1&&s.sort(o||_l),d&&(t.reverse(),r.reverse(),s.reverse())}function m(){for(let u=e,o=i.length;u<o;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:r,transparent:s,init:n,push:c,unshift:f,finish:m,sort:h}}function Ym(){let i=new WeakMap;function e(r,s){const n=i.get(r);let a;return n===void 0?(a=new Sl,i.set(r,[a])):s>=n.length?(a=new Sl,n.push(a)):a=n[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function qm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Y,color:new et};break;case"SpotLight":t={position:new Y,direction:new Y,color:new et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new et,groundColor:new et};break;case"RectAreaLight":t={color:new et,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return i[e.id]=t,t}}}function $m(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Km=0;function Zm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Jm(i){const e=new qm,t=$m(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)r.probe.push(new Y);const s=new Y,n=new _t,a=new _t;function l(f){let h=0,m=0,u=0;for(let y=0;y<9;y++)r.probe[y].set(0,0,0);let o=0,d=0,v=0,p=0,g=0,E=0,A=0,M=0,_=0,S=0,T=0;f.sort(Zm);for(let y=0,w=f.length;y<w;y++){const R=f[y],C=R.color,D=R.intensity,N=R.distance;let I=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===si?I=R.shadow.map.texture:I=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=C.r*D,m+=C.g*D,u+=C.b*D;else if(R.isLightProbe){for(let z=0;z<9;z++)r.probe[z].addScaledVector(R.sh.coefficients[z],D);T++}else if(R.isDirectionalLight){const z=e.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const U=R.shadow,W=t.get(R);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,r.directionalShadow[o]=W,r.directionalShadowMap[o]=I,r.directionalShadowMatrix[o]=R.shadow.matrix,E++}r.directional[o]=z,o++}else if(R.isSpotLight){const z=e.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(C).multiplyScalar(D),z.distance=N,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,r.spot[v]=z;const U=R.shadow;if(R.map&&(r.spotLightMap[_]=R.map,_++,U.updateMatrices(R),R.castShadow&&S++),r.spotLightMatrix[v]=U.matrix,R.castShadow){const W=t.get(R);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,r.spotShadow[v]=W,r.spotShadowMap[v]=I,M++}v++}else if(R.isRectAreaLight){const z=e.get(R);z.color.copy(C).multiplyScalar(D),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),r.rectArea[p]=z,p++}else if(R.isPointLight){const z=e.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const U=R.shadow,W=t.get(R);W.shadowIntensity=U.intensity,W.shadowBias=U.bias,W.shadowNormalBias=U.normalBias,W.shadowRadius=U.radius,W.shadowMapSize=U.mapSize,W.shadowCameraNear=U.camera.near,W.shadowCameraFar=U.camera.far,r.pointShadow[d]=W,r.pointShadowMap[d]=I,r.pointShadowMatrix[d]=R.shadow.matrix,A++}r.point[d]=z,d++}else if(R.isHemisphereLight){const z=e.get(R);z.skyColor.copy(R.color).multiplyScalar(D),z.groundColor.copy(R.groundColor).multiplyScalar(D),r.hemi[g]=z,g++}}p>0&&(i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=pe.LTC_FLOAT_1,r.rectAreaLTC2=pe.LTC_FLOAT_2):(r.rectAreaLTC1=pe.LTC_HALF_1,r.rectAreaLTC2=pe.LTC_HALF_2)),r.ambient[0]=h,r.ambient[1]=m,r.ambient[2]=u;const x=r.hash;(x.directionalLength!==o||x.pointLength!==d||x.spotLength!==v||x.rectAreaLength!==p||x.hemiLength!==g||x.numDirectionalShadows!==E||x.numPointShadows!==A||x.numSpotShadows!==M||x.numSpotMaps!==_||x.numLightProbes!==T)&&(r.directional.length=o,r.spot.length=v,r.rectArea.length=p,r.point.length=d,r.hemi.length=g,r.directionalShadow.length=E,r.directionalShadowMap.length=E,r.pointShadow.length=A,r.pointShadowMap.length=A,r.spotShadow.length=M,r.spotShadowMap.length=M,r.directionalShadowMatrix.length=E,r.pointShadowMatrix.length=A,r.spotLightMatrix.length=M+_-S,r.spotLightMap.length=_,r.numSpotLightShadowsWithMaps=S,r.numLightProbes=T,x.directionalLength=o,x.pointLength=d,x.spotLength=v,x.rectAreaLength=p,x.hemiLength=g,x.numDirectionalShadows=E,x.numPointShadows=A,x.numSpotShadows=M,x.numSpotMaps=_,x.numLightProbes=T,r.version=Km++)}function c(f,h){let m=0,u=0,o=0,d=0,v=0;const p=h.matrixWorldInverse;for(let g=0,E=f.length;g<E;g++){const A=f[g];if(A.isDirectionalLight){const M=r.directional[m];M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),m++}else if(A.isSpotLight){const M=r.spot[o];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),o++}else if(A.isRectAreaLight){const M=r.rectArea[d];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),a.identity(),n.copy(A.matrixWorld),n.premultiply(p),a.extractRotation(n),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),d++}else if(A.isPointLight){const M=r.point[u];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),u++}else if(A.isHemisphereLight){const M=r.hemi[v];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(p),v++}}}return{setup:l,setupView:c,state:r}}function Ml(i){const e=new Jm(i),t=[],r=[],s=[];function n(u){m.camera=u,t.length=0,r.length=0,s.length=0}function a(u){t.push(u)}function l(u){r.push(u)}function c(u){s.push(u)}function f(){e.setup(t)}function h(u){e.setupView(t,u)}const m={lightsArray:t,shadowsArray:r,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:n,state:m,setupLights:f,setupLightsView:h,pushLight:a,pushShadow:l,pushLightProbeGrid:c}}function Qm(i){let e=new WeakMap;function t(s,n=0){const a=e.get(s);let l;return a===void 0?(l=new Ml(i),e.set(s,[l])):n>=a.length?(l=new Ml(i),a.push(l)):l=a[n],l}function r(){e=new WeakMap}return{get:t,dispose:r}}const jm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,tg=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],ng=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],yl=new _t,qi=new Y,Vs=new Y;function ig(i,e,t){let r=new uc;const s=new He,n=new He,a=new ft,l=new df,c=new pf,f={},h=t.maxTextureSize,m={[Wn]:It,[It]:Wn,[_n]:_n},u=new Bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:jm,fragmentShader:eg}),o=u.clone();o.defines.HORIZONTAL_PASS=1;const d=new An;d.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Wt(d,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nr;let g=this.type;this.render=function(S,T,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===iu&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Nr);const y=i.getRenderTarget(),w=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),C=i.state;C.setBlending(Sn),C.buffers.depth.getReversed()===!0?C.buffers.color.setClear(0,0,0,0):C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const D=g!==this.type;D&&T.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(I=>I.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,I=S.length;N<I;N++){const z=S[N],U=z.shadow;if(U===void 0){Ie("WebGLShadowMap:",z,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);const W=U.getFrameExtents();s.multiply(W),n.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(n.x=Math.floor(h/W.x),s.x=n.x*W.x,U.mapSize.x=n.x),s.y>h&&(n.y=Math.floor(h/W.y),s.y=n.y*W.y,U.mapSize.y=n.y));const K=i.state.buffers.depth.getReversed();if(U.camera._reversedDepth=K,U.map===null||D===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===$i){if(z.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new Qt(s.x,s.y,{format:si,type:En,minFilter:vt,magFilter:vt,generateMipmaps:!1}),U.map.texture.name=z.name+".shadowMap",U.map.depthTexture=new Fi(s.x,s.y,on),U.map.depthTexture.name=z.name+".shadowMapDepth",U.map.depthTexture.format=Tn,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=bt,U.map.depthTexture.magFilter=bt}else z.isPointLight?(U.map=new vc(s.x),U.map.depthTexture=new of(s.x,hn)):(U.map=new Qt(s.x,s.y),U.map.depthTexture=new Fi(s.x,s.y,hn)),U.map.depthTexture.name=z.name+".shadowMap",U.map.depthTexture.format=Tn,this.type===Nr?(U.map.depthTexture.compareFunction=K?qa:Ya,U.map.depthTexture.minFilter=vt,U.map.depthTexture.magFilter=vt):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=bt,U.map.depthTexture.magFilter=bt);U.camera.updateProjectionMatrix()}const ie=U.map.isWebGLCubeRenderTarget?6:1;for(let se=0;se<ie;se++){if(U.map.isWebGLCubeRenderTarget)i.setRenderTarget(U.map,se),i.clear();else{se===0&&(i.setRenderTarget(U.map),i.clear());const oe=U.getViewport(se);a.set(n.x*oe.x,n.y*oe.y,n.x*oe.z,n.y*oe.w),C.viewport(a)}if(z.isPointLight){const oe=U.camera,De=U.matrix,qe=z.distance||oe.far;qe!==oe.far&&(oe.far=qe,oe.updateProjectionMatrix()),qi.setFromMatrixPosition(z.matrixWorld),oe.position.copy(qi),Vs.copy(oe.position),Vs.add(tg[se]),oe.up.copy(ng[se]),oe.lookAt(Vs),oe.updateMatrixWorld(),De.makeTranslation(-qi.x,-qi.y,-qi.z),yl.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),U._frustum.setFromProjectionMatrix(yl,oe.coordinateSystem,oe.reversedDepth)}else U.updateMatrices(z);r=U.getFrustum(),M(T,x,U.camera,z,this.type)}U.isPointLightShadow!==!0&&this.type===$i&&E(U,x),U.needsUpdate=!1}g=this.type,p.needsUpdate=!1,i.setRenderTarget(y,w,R)};function E(S,T){const x=e.update(v);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,o.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,o.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Qt(s.x,s.y,{format:si,type:En})),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,x,u,v,null),o.uniforms.shadow_pass.value=S.mapPass.texture,o.uniforms.resolution.value=S.mapSize,o.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,x,o,v,null)}function A(S,T,x,y){let w=null;const R=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)w=R;else if(w=x.isPointLight===!0?c:l,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const C=w.uuid,D=T.uuid;let N=f[C];N===void 0&&(N={},f[C]=N);let I=N[D];I===void 0&&(I=w.clone(),N[D]=I,T.addEventListener("dispose",_)),w=I}if(w.visible=T.visible,w.wireframe=T.wireframe,y===$i?w.side=T.shadowSide!==null?T.shadowSide:T.side:w.side=T.shadowSide!==null?T.shadowSide:m[T.side],w.alphaMap=T.alphaMap,w.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,w.map=T.map,w.clipShadows=T.clipShadows,w.clippingPlanes=T.clippingPlanes,w.clipIntersection=T.clipIntersection,w.displacementMap=T.displacementMap,w.displacementScale=T.displacementScale,w.displacementBias=T.displacementBias,w.wireframeLinewidth=T.wireframeLinewidth,w.linewidth=T.linewidth,x.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const C=i.properties.get(w);C.light=x}return w}function M(S,T,x,y,w){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===$i)&&(!S.frustumCulled||r.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);const D=e.update(S),N=S.material;if(Array.isArray(N)){const I=D.groups;for(let z=0,U=I.length;z<U;z++){const W=I[z],K=N[W.materialIndex];if(K&&K.visible){const ie=A(S,K,y,w);S.onBeforeShadow(i,S,T,x,D,ie,W),i.renderBufferDirect(x,null,D,ie,S,W),S.onAfterShadow(i,S,T,x,D,ie,W)}}}else if(N.visible){const I=A(S,N,y,w);S.onBeforeShadow(i,S,T,x,D,I,null),i.renderBufferDirect(x,null,D,I,S,null),S.onAfterShadow(i,S,T,x,D,I,null)}}const C=S.children;for(let D=0,N=C.length;D<N;D++)M(C[D],T,x,y,w)}function _(S){S.target.removeEventListener("dispose",_);for(const x in f){const y=f[x],w=S.target.uuid;w in y&&(y[w].dispose(),delete y[w])}}}function rg(i,e){function t(){let F=!1;const le=new ft;let Q=null;const he=new ft(0,0,0,0);return{setMask:function(ve){Q!==ve&&!F&&(i.colorMask(ve,ve,ve,ve),Q=ve)},setLocked:function(ve){F=ve},setClear:function(ve,te,Ae,Te,ht){ht===!0&&(ve*=Te,te*=Te,Ae*=Te),le.set(ve,te,Ae,Te),he.equals(le)===!1&&(i.clearColor(ve,te,Ae,Te),he.copy(le))},reset:function(){F=!1,Q=null,he.set(-1,0,0,0)}}}function r(){let F=!1,le=!1,Q=null,he=null,ve=null;return{setReversed:function(te){if(le!==te){const Ae=e.get("EXT_clip_control");te?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),le=te;const Te=ve;ve=null,this.setClear(Te)}},getReversed:function(){return le},setTest:function(te){te?J(i.DEPTH_TEST):ye(i.DEPTH_TEST)},setMask:function(te){Q!==te&&!F&&(i.depthMask(te),Q=te)},setFunc:function(te){if(le&&(te=Uu[te]),he!==te){switch(te){case $s:i.depthFunc(i.NEVER);break;case Ks:i.depthFunc(i.ALWAYS);break;case Zs:i.depthFunc(i.LESS);break;case Ui:i.depthFunc(i.LEQUAL);break;case Js:i.depthFunc(i.EQUAL);break;case Qs:i.depthFunc(i.GEQUAL);break;case js:i.depthFunc(i.GREATER);break;case ea:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}he=te}},setLocked:function(te){F=te},setClear:function(te){ve!==te&&(ve=te,le&&(te=1-te),i.clearDepth(te))},reset:function(){F=!1,Q=null,he=null,ve=null,le=!1}}}function s(){let F=!1,le=null,Q=null,he=null,ve=null,te=null,Ae=null,Te=null,ht=null;return{setTest:function(ot){F||(ot?J(i.STENCIL_TEST):ye(i.STENCIL_TEST))},setMask:function(ot){le!==ot&&!F&&(i.stencilMask(ot),le=ot)},setFunc:function(ot,en,tn){(Q!==ot||he!==en||ve!==tn)&&(i.stencilFunc(ot,en,tn),Q=ot,he=en,ve=tn)},setOp:function(ot,en,tn){(te!==ot||Ae!==en||Te!==tn)&&(i.stencilOp(ot,en,tn),te=ot,Ae=en,Te=tn)},setLocked:function(ot){F=ot},setClear:function(ot){ht!==ot&&(i.clearStencil(ot),ht=ot)},reset:function(){F=!1,le=null,Q=null,he=null,ve=null,te=null,Ae=null,Te=null,ht=null}}}const n=new t,a=new r,l=new s,c=new WeakMap,f=new WeakMap;let h={},m={},u={},o=new WeakMap,d=[],v=null,p=!1,g=null,E=null,A=null,M=null,_=null,S=null,T=null,x=new et(0,0,0),y=0,w=!1,R=null,C=null,D=null,N=null,I=null;const z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,W=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(K)[1]),U=W>=1):K.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),U=W>=2);let ie=null,se={};const oe=i.getParameter(i.SCISSOR_BOX),De=i.getParameter(i.VIEWPORT),qe=new ft().fromArray(oe),ne=new ft().fromArray(De);function H(F,le,Q,he){const ve=new Uint8Array(4),te=i.createTexture();i.bindTexture(F,te),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<Q;Ae++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,he,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(le+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return te}const ee={};ee[i.TEXTURE_2D]=H(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=H(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=H(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=H(i.TEXTURE_3D,i.TEXTURE_3D,1,1),n.setClear(0,0,0,1),a.setClear(1),l.setClear(0),J(i.DEPTH_TEST),a.setFunc(Ui),ct(!1),ut(To),J(i.CULL_FACE),Ve(Sn);function J(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function ye(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function Ee(F,le){return u[F]!==le?(i.bindFramebuffer(F,le),u[F]=le,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function xe(F,le){let Q=d,he=!1;if(F){Q=o.get(le),Q===void 0&&(Q=[],o.set(le,Q));const ve=F.textures;if(Q.length!==ve.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let te=0,Ae=ve.length;te<Ae;te++)Q[te]=i.COLOR_ATTACHMENT0+te;Q.length=ve.length,he=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,he=!0);he&&i.drawBuffers(Q)}function re(F){return v!==F?(i.useProgram(F),v=F,!0):!1}const _e={[jn]:i.FUNC_ADD,[ru]:i.FUNC_SUBTRACT,[su]:i.FUNC_REVERSE_SUBTRACT};_e[au]=i.MIN,_e[ou]=i.MAX;const We={[lu]:i.ZERO,[Hl]:i.ONE,[cu]:i.SRC_COLOR,[qs]:i.SRC_ALPHA,[mu]:i.SRC_ALPHA_SATURATE,[du]:i.DST_COLOR,[fu]:i.DST_ALPHA,[uu]:i.ONE_MINUS_SRC_COLOR,[kr]:i.ONE_MINUS_SRC_ALPHA,[pu]:i.ONE_MINUS_DST_COLOR,[hu]:i.ONE_MINUS_DST_ALPHA,[gu]:i.CONSTANT_COLOR,[vu]:i.ONE_MINUS_CONSTANT_COLOR,[xu]:i.CONSTANT_ALPHA,[_u]:i.ONE_MINUS_CONSTANT_ALPHA};function Ve(F,le,Q,he,ve,te,Ae,Te,ht,ot){if(F===Sn){p===!0&&(ye(i.BLEND),p=!1);return}if(p===!1&&(J(i.BLEND),p=!0),F!==zl){if(F!==g||ot!==w){if((E!==jn||_!==jn)&&(i.blendEquation(i.FUNC_ADD),E=jn,_=jn),ot)switch(F){case Li:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case bo:i.blendFunc(i.ONE,i.ONE);break;case Ao:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ke("WebGLState: Invalid blending: ",F);break}else switch(F){case Li:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case bo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ao:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wo:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",F);break}A=null,M=null,S=null,T=null,x.set(0,0,0),y=0,g=F,w=ot}return}ve=ve||le,te=te||Q,Ae=Ae||he,(le!==E||ve!==_)&&(i.blendEquationSeparate(_e[le],_e[ve]),E=le,_=ve),(Q!==A||he!==M||te!==S||Ae!==T)&&(i.blendFuncSeparate(We[Q],We[he],We[te],We[Ae]),A=Q,M=he,S=te,T=Ae),(Te.equals(x)===!1||ht!==y)&&(i.blendColor(Te.r,Te.g,Te.b,ht),x.copy(Te),y=ht),g=F,w=!1}function Be(F,le){F.side===_n?ye(i.CULL_FACE):J(i.CULL_FACE);let Q=F.side===It;le&&(Q=!Q),ct(Q),F.blending===Li&&F.transparent===!1?Ve(Sn):Ve(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),n.setMask(F.colorWrite);const he=F.stencilWrite;l.setTest(he),he&&(l.setMask(F.stencilWriteMask),l.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),l.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ze(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):ye(i.SAMPLE_ALPHA_TO_COVERAGE)}function ct(F){R!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),R=F)}function ut(F){F!==tu?(J(i.CULL_FACE),F!==C&&(F===To?i.cullFace(i.BACK):F===nu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ye(i.CULL_FACE),C=F}function je(F){F!==D&&(U&&i.lineWidth(F),D=F)}function Ze(F,le,Q){F?(J(i.POLYGON_OFFSET_FILL),(N!==le||I!==Q)&&(N=le,I=Q,a.getReversed()&&(le=-le),i.polygonOffset(le,Q))):ye(i.POLYGON_OFFSET_FILL)}function Xe(F){F?J(i.SCISSOR_TEST):ye(i.SCISSOR_TEST)}function nt(F){F===void 0&&(F=i.TEXTURE0+z-1),ie!==F&&(i.activeTexture(F),ie=F)}function O(F,le,Q){Q===void 0&&(ie===null?Q=i.TEXTURE0+z-1:Q=ie);let he=se[Q];he===void 0&&(he={type:void 0,texture:void 0},se[Q]=he),(he.type!==F||he.texture!==le)&&(ie!==Q&&(i.activeTexture(Q),ie=Q),i.bindTexture(F,le||ee[F]),he.type=F,he.texture=le)}function St(){const F=se[ie];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Je(){try{i.compressedTexImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function L(){try{i.compressedTexImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function b(){try{i.texSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function V(){try{i.texSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ae(){try{i.texStorage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ce(){try{i.texStorage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function Z(){try{i.texImage2D(...arguments)}catch(F){Ke("WebGLState:",F)}}function j(){try{i.texImage3D(...arguments)}catch(F){Ke("WebGLState:",F)}}function ue(F){return m[F]!==void 0?m[F]:i.getParameter(F)}function we(F,le){m[F]!==le&&(i.pixelStorei(F,le),m[F]=le)}function de(F){qe.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),qe.copy(F))}function fe(F){ne.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),ne.copy(F))}function Pe(F,le){let Q=f.get(le);Q===void 0&&(Q=new WeakMap,f.set(le,Q));let he=Q.get(F);he===void 0&&(he=i.getUniformBlockIndex(le,F.name),Q.set(F,he))}function Le(F,le){const he=f.get(le).get(F);c.get(le)!==he&&(i.uniformBlockBinding(le,he,F.__bindingPointIndex),c.set(le,he))}function Ne(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},m={},ie=null,se={},u={},o=new WeakMap,d=[],v=null,p=!1,g=null,E=null,A=null,M=null,_=null,S=null,T=null,x=new et(0,0,0),y=0,w=!1,R=null,C=null,D=null,N=null,I=null,qe.set(0,0,i.canvas.width,i.canvas.height),ne.set(0,0,i.canvas.width,i.canvas.height),n.reset(),a.reset(),l.reset()}return{buffers:{color:n,depth:a,stencil:l},enable:J,disable:ye,bindFramebuffer:Ee,drawBuffers:xe,useProgram:re,setBlending:Ve,setMaterial:Be,setFlipSided:ct,setCullFace:ut,setLineWidth:je,setPolygonOffset:Ze,setScissorTest:Xe,activeTexture:nt,bindTexture:O,unbindTexture:St,compressedTexImage2D:Je,compressedTexImage3D:L,texImage2D:Z,texImage3D:j,pixelStorei:we,getParameter:ue,updateUBOMapping:Pe,uniformBlockBinding:Le,texStorage2D:ae,texStorage3D:ce,texSubImage2D:b,texSubImage3D:V,compressedTexSubImage2D:G,compressedTexSubImage3D:$,scissor:de,viewport:fe,reset:Ne}}function sg(i,e,t,r,s,n,a){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new He,h=new WeakMap,m=new Set;let u;const o=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(L,b){return d?new OffscreenCanvas(L,b):er("canvas")}function p(L,b,V){let G=1;const $=Je(L);if(($.width>V||$.height>V)&&(G=V/Math.max($.width,$.height)),G<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const ae=Math.floor(G*$.width),ce=Math.floor(G*$.height);u===void 0&&(u=v(ae,ce));const Z=b?v(ae,ce):u;return Z.width=ae,Z.height=ce,Z.getContext("2d").drawImage(L,0,0,ae,ce),Ie("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ae+"x"+ce+")."),Z}else return"data"in L&&Ie("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),L;return L}function g(L){return L.generateMipmaps}function E(L){i.generateMipmap(L)}function A(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(L,b,V,G,$,ae=!1){if(L!==null){if(i[L]!==void 0)return i[L];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let ce;G&&(ce=e.get("EXT_texture_norm16"),ce||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=b;if(b===i.RED&&(V===i.FLOAT&&(Z=i.R32F),V===i.HALF_FLOAT&&(Z=i.R16F),V===i.UNSIGNED_BYTE&&(Z=i.R8),V===i.UNSIGNED_SHORT&&ce&&(Z=ce.R16_EXT),V===i.SHORT&&ce&&(Z=ce.R16_SNORM_EXT)),b===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.R8UI),V===i.UNSIGNED_SHORT&&(Z=i.R16UI),V===i.UNSIGNED_INT&&(Z=i.R32UI),V===i.BYTE&&(Z=i.R8I),V===i.SHORT&&(Z=i.R16I),V===i.INT&&(Z=i.R32I)),b===i.RG&&(V===i.FLOAT&&(Z=i.RG32F),V===i.HALF_FLOAT&&(Z=i.RG16F),V===i.UNSIGNED_BYTE&&(Z=i.RG8),V===i.UNSIGNED_SHORT&&ce&&(Z=ce.RG16_EXT),V===i.SHORT&&ce&&(Z=ce.RG16_SNORM_EXT)),b===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RG8UI),V===i.UNSIGNED_SHORT&&(Z=i.RG16UI),V===i.UNSIGNED_INT&&(Z=i.RG32UI),V===i.BYTE&&(Z=i.RG8I),V===i.SHORT&&(Z=i.RG16I),V===i.INT&&(Z=i.RG32I)),b===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),V===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),V===i.UNSIGNED_INT&&(Z=i.RGB32UI),V===i.BYTE&&(Z=i.RGB8I),V===i.SHORT&&(Z=i.RGB16I),V===i.INT&&(Z=i.RGB32I)),b===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),V===i.UNSIGNED_INT&&(Z=i.RGBA32UI),V===i.BYTE&&(Z=i.RGBA8I),V===i.SHORT&&(Z=i.RGBA16I),V===i.INT&&(Z=i.RGBA32I)),b===i.RGB&&(V===i.UNSIGNED_SHORT&&ce&&(Z=ce.RGB16_EXT),V===i.SHORT&&ce&&(Z=ce.RGB16_SNORM_EXT),V===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),b===i.RGBA){const j=ae?qr:Ge.getTransfer($);V===i.FLOAT&&(Z=i.RGBA32F),V===i.HALF_FLOAT&&(Z=i.RGBA16F),V===i.UNSIGNED_BYTE&&(Z=j===tt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT&&ce&&(Z=ce.RGBA16_EXT),V===i.SHORT&&ce&&(Z=ce.RGBA16_SNORM_EXT),V===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function _(L,b){let V;return L?b===null||b===hn||b===ji?V=i.DEPTH24_STENCIL8:b===on?V=i.DEPTH32F_STENCIL8:b===Qi&&(V=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===hn||b===ji?V=i.DEPTH_COMPONENT24:b===on?V=i.DEPTH_COMPONENT32F:b===Qi&&(V=i.DEPTH_COMPONENT16),V}function S(L,b){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==bt&&L.minFilter!==vt?Math.log2(Math.max(b.width,b.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?b.mipmaps.length:1}function T(L){const b=L.target;b.removeEventListener("dispose",T),y(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&m.delete(b)}function x(L){const b=L.target;b.removeEventListener("dispose",x),R(b)}function y(L){const b=r.get(L);if(b.__webglInit===void 0)return;const V=L.source,G=o.get(V);if(G){const $=G[b.__cacheKey];$.usedTimes--,$.usedTimes===0&&w(L),Object.keys(G).length===0&&o.delete(V)}r.remove(L)}function w(L){const b=r.get(L);i.deleteTexture(b.__webglTexture);const V=L.source,G=o.get(V);delete G[b.__cacheKey],a.memory.textures--}function R(L){const b=r.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),r.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(b.__webglFramebuffer[G]))for(let $=0;$<b.__webglFramebuffer[G].length;$++)i.deleteFramebuffer(b.__webglFramebuffer[G][$]);else i.deleteFramebuffer(b.__webglFramebuffer[G]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[G])}else{if(Array.isArray(b.__webglFramebuffer))for(let G=0;G<b.__webglFramebuffer.length;G++)i.deleteFramebuffer(b.__webglFramebuffer[G]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let G=0;G<b.__webglColorRenderbuffer.length;G++)b.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[G]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const V=L.textures;for(let G=0,$=V.length;G<$;G++){const ae=r.get(V[G]);ae.__webglTexture&&(i.deleteTexture(ae.__webglTexture),a.memory.textures--),r.remove(V[G])}r.remove(L)}let C=0;function D(){C=0}function N(){return C}function I(L){C=L}function z(){const L=C;return L>=s.maxTextures&&Ie("WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),C+=1,L}function U(L){const b=[];return b.push(L.wrapS),b.push(L.wrapT),b.push(L.wrapR||0),b.push(L.magFilter),b.push(L.minFilter),b.push(L.anisotropy),b.push(L.internalFormat),b.push(L.format),b.push(L.type),b.push(L.generateMipmaps),b.push(L.premultiplyAlpha),b.push(L.flipY),b.push(L.unpackAlignment),b.push(L.colorSpace),b.join()}function W(L,b){const V=r.get(L);if(L.isVideoTexture&&O(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&V.__version!==L.version){const G=L.image;if(G===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(V,L,b);return}}else L.isExternalTexture&&(V.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+b)}function K(L,b){const V=r.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){ye(V,L,b);return}else L.isExternalTexture&&(V.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+b)}function ie(L,b){const V=r.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){ye(V,L,b);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+b)}function se(L,b){const V=r.get(L);if(L.isCubeDepthTexture!==!0&&L.version>0&&V.__version!==L.version){Ee(V,L,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+b)}const oe={[ta]:i.REPEAT,[Jt]:i.CLAMP_TO_EDGE,[na]:i.MIRRORED_REPEAT},De={[bt]:i.NEAREST,[yu]:i.NEAREST_MIPMAP_NEAREST,[ur]:i.NEAREST_MIPMAP_LINEAR,[vt]:i.LINEAR,[cs]:i.LINEAR_MIPMAP_NEAREST,[zn]:i.LINEAR_MIPMAP_LINEAR},qe={[bu]:i.NEVER,[Pu]:i.ALWAYS,[Au]:i.LESS,[Ya]:i.LEQUAL,[wu]:i.EQUAL,[qa]:i.GEQUAL,[Ru]:i.GREATER,[Cu]:i.NOTEQUAL};function ne(L,b){if(b.type===on&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===vt||b.magFilter===cs||b.magFilter===ur||b.magFilter===zn||b.minFilter===vt||b.minFilter===cs||b.minFilter===ur||b.minFilter===zn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,oe[b.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,oe[b.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,oe[b.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,De[b.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,De[b.minFilter]),b.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,qe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===bt||b.minFilter!==ur&&b.minFilter!==zn||b.type===on&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||r.get(b).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),r.get(b).__currentAnisotropy=b.anisotropy}}}function H(L,b){let V=!1;L.__webglInit===void 0&&(L.__webglInit=!0,b.addEventListener("dispose",T));const G=b.source;let $=o.get(G);$===void 0&&($={},o.set(G,$));const ae=U(b);if(ae!==L.__cacheKey){$[ae]===void 0&&($[ae]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),$[ae].usedTimes++;const ce=$[L.__cacheKey];ce!==void 0&&($[L.__cacheKey].usedTimes--,ce.usedTimes===0&&w(b)),L.__cacheKey=ae,L.__webglTexture=$[ae].texture}return V}function ee(L,b,V){return Math.floor(Math.floor(L/V)/b)}function J(L,b,V,G){const ae=L.updateRanges;if(ae.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,V,G,b.data);else{ae.sort((we,de)=>we.start-de.start);let ce=0;for(let we=1;we<ae.length;we++){const de=ae[ce],fe=ae[we],Pe=de.start+de.count,Le=ee(fe.start,b.width,4),Ne=ee(de.start,b.width,4);fe.start<=Pe+1&&Le===Ne&&ee(fe.start+fe.count-1,b.width,4)===Le?de.count=Math.max(de.count,fe.start+fe.count-de.start):(++ce,ae[ce]=fe)}ae.length=ce+1;const Z=t.getParameter(i.UNPACK_ROW_LENGTH),j=t.getParameter(i.UNPACK_SKIP_PIXELS),ue=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let we=0,de=ae.length;we<de;we++){const fe=ae[we],Pe=Math.floor(fe.start/4),Le=Math.ceil(fe.count/4),Ne=Pe%b.width,F=Math.floor(Pe/b.width),le=Le,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,Ne,F,le,Q,V,G,b.data)}L.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,j),t.pixelStorei(i.UNPACK_SKIP_ROWS,ue)}}function ye(L,b,V){let G=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(G=i.TEXTURE_3D);const $=H(L,b),ae=b.source;t.bindTexture(G,L.__webglTexture,i.TEXTURE0+V);const ce=r.get(ae);if(ae.version!==ce.__version||$===!0){if(t.activeTexture(i.TEXTURE0+V),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const Q=Ge.getPrimaries(Ge.workingColorSpace),he=b.colorSpace===Bn?null:Ge.getPrimaries(b.colorSpace),ve=b.colorSpace===Bn||Q===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment);let j=p(b.image,!1,s.maxTextureSize);j=St(b,j);const ue=n.convert(b.format,b.colorSpace),we=n.convert(b.type);let de=M(b.internalFormat,ue,we,b.normalized,b.colorSpace,b.isVideoTexture);ne(G,b);let fe;const Pe=b.mipmaps,Le=b.isVideoTexture!==!0,Ne=ce.__version===void 0||$===!0,F=ae.dataReady,le=S(b,j);if(b.isDepthTexture)de=_(b.format===ti,b.type),Ne&&(Le?t.texStorage2D(i.TEXTURE_2D,1,de,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,de,j.width,j.height,0,ue,we,null));else if(b.isDataTexture)if(Pe.length>0){Le&&Ne&&t.texStorage2D(i.TEXTURE_2D,le,de,Pe[0].width,Pe[0].height);for(let Q=0,he=Pe.length;Q<he;Q++)fe=Pe[Q],Le?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,we,fe.data):t.texImage2D(i.TEXTURE_2D,Q,de,fe.width,fe.height,0,ue,we,fe.data);b.generateMipmaps=!1}else Le?(Ne&&t.texStorage2D(i.TEXTURE_2D,le,de,j.width,j.height),F&&J(b,j,ue,we)):t.texImage2D(i.TEXTURE_2D,0,de,j.width,j.height,0,ue,we,j.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Le&&Ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,de,Pe[0].width,Pe[0].height,j.depth);for(let Q=0,he=Pe.length;Q<he;Q++)if(fe=Pe[Q],b.format!==kt)if(ue!==null)if(Le){if(F)if(b.layerUpdates.size>0){const ve=jo(fe.width,fe.height,b.format,b.type);for(const te of b.layerUpdates){const Ae=fe.data.subarray(te*ve/fe.data.BYTES_PER_ELEMENT,(te+1)*ve/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,te,fe.width,fe.height,1,ue,Ae)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,fe.width,fe.height,j.depth,ue,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,de,fe.width,fe.height,j.depth,0,fe.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,fe.width,fe.height,j.depth,ue,we,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,de,fe.width,fe.height,j.depth,0,ue,we,fe.data)}else{Le&&Ne&&t.texStorage2D(i.TEXTURE_2D,le,de,Pe[0].width,Pe[0].height);for(let Q=0,he=Pe.length;Q<he;Q++)fe=Pe[Q],b.format!==kt?ue!==null?Le?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,de,fe.width,fe.height,0,fe.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,we,fe.data):t.texImage2D(i.TEXTURE_2D,Q,de,fe.width,fe.height,0,ue,we,fe.data)}else if(b.isDataArrayTexture)if(Le){if(Ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,de,j.width,j.height,j.depth),F)if(b.layerUpdates.size>0){const Q=jo(j.width,j.height,b.format,b.type);for(const he of b.layerUpdates){const ve=j.data.subarray(he*Q/j.data.BYTES_PER_ELEMENT,(he+1)*Q/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,j.width,j.height,1,ue,we,ve)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,we,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,de,j.width,j.height,j.depth,0,ue,we,j.data);else if(b.isData3DTexture)Le?(Ne&&t.texStorage3D(i.TEXTURE_3D,le,de,j.width,j.height,j.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,we,j.data)):t.texImage3D(i.TEXTURE_3D,0,de,j.width,j.height,j.depth,0,ue,we,j.data);else if(b.isFramebufferTexture){if(Ne)if(Le)t.texStorage2D(i.TEXTURE_2D,le,de,j.width,j.height);else{let Q=j.width,he=j.height;for(let ve=0;ve<le;ve++)t.texImage2D(i.TEXTURE_2D,ve,de,Q,he,0,ue,we,null),Q>>=1,he>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in i){const Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),m.add(b),Q.onpaint=he=>{const ve=he.changedElements;for(const te of m)ve.includes(te.image)&&(te.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,j);else{const ve=i.RGBA,te=i.RGBA,Ae=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ve,te,Ae,j)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(Le&&Ne){const Q=Je(Pe[0]);t.texStorage2D(i.TEXTURE_2D,le,de,Q.width,Q.height)}for(let Q=0,he=Pe.length;Q<he;Q++)fe=Pe[Q],Le?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ue,we,fe):t.texImage2D(i.TEXTURE_2D,Q,de,ue,we,fe);b.generateMipmaps=!1}else if(Le){if(Ne){const Q=Je(j);t.texStorage2D(i.TEXTURE_2D,le,de,Q.width,Q.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,we,j)}else t.texImage2D(i.TEXTURE_2D,0,de,ue,we,j);g(b)&&E(G),ce.__version=ae.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function Ee(L,b,V){if(b.image.length!==6)return;const G=H(L,b),$=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+V);const ae=r.get($);if($.version!==ae.__version||G===!0){t.activeTexture(i.TEXTURE0+V);const ce=Ge.getPrimaries(Ge.workingColorSpace),Z=b.colorSpace===Bn?null:Ge.getPrimaries(b.colorSpace),j=b.colorSpace===Bn||ce===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ue=b.isCompressedTexture||b.image[0].isCompressedTexture,we=b.image[0]&&b.image[0].isDataTexture,de=[];for(let te=0;te<6;te++)!ue&&!we?de[te]=p(b.image[te],!0,s.maxCubemapSize):de[te]=we?b.image[te].image:b.image[te],de[te]=St(b,de[te]);const fe=de[0],Pe=n.convert(b.format,b.colorSpace),Le=n.convert(b.type),Ne=M(b.internalFormat,Pe,Le,b.normalized,b.colorSpace),F=b.isVideoTexture!==!0,le=ae.__version===void 0||G===!0,Q=$.dataReady;let he=S(b,fe);ne(i.TEXTURE_CUBE_MAP,b);let ve;if(ue){F&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Ne,fe.width,fe.height);for(let te=0;te<6;te++){ve=de[te].mipmaps;for(let Ae=0;Ae<ve.length;Ae++){const Te=ve[Ae];b.format!==kt?Pe!==null?F?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,0,0,Te.width,Te.height,Pe,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,Ne,Te.width,Te.height,0,Te.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,0,0,Te.width,Te.height,Pe,Le,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,Ne,Te.width,Te.height,0,Pe,Le,Te.data)}}}else{if(ve=b.mipmaps,F&&le){ve.length>0&&he++;const te=Je(de[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Ne,te.width,te.height)}for(let te=0;te<6;te++)if(we){F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,de[te].width,de[te].height,Pe,Le,de[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ne,de[te].width,de[te].height,0,Pe,Le,de[te].data);for(let Ae=0;Ae<ve.length;Ae++){const ht=ve[Ae].image[te].image;F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,0,0,ht.width,ht.height,Pe,Le,ht.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,Ne,ht.width,ht.height,0,Pe,Le,ht.data)}}else{F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Pe,Le,de[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ne,Pe,Le,de[te]);for(let Ae=0;Ae<ve.length;Ae++){const Te=ve[Ae];F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,0,0,Pe,Le,Te.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,Ne,Pe,Le,Te.image[te])}}}g(b)&&E(i.TEXTURE_CUBE_MAP),ae.__version=$.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function xe(L,b,V,G,$,ae){const ce=n.convert(V.format,V.colorSpace),Z=n.convert(V.type),j=M(V.internalFormat,ce,Z,V.normalized,V.colorSpace),ue=r.get(b),we=r.get(V);if(we.__renderTarget=b,!ue.__hasExternalTextures){const de=Math.max(1,b.width>>ae),fe=Math.max(1,b.height>>ae);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,ae,j,de,fe,b.depth,0,ce,Z,null):t.texImage2D($,ae,j,de,fe,0,ce,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),nt(b)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,$,we.__webglTexture,0,Xe(b)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,$,we.__webglTexture,ae),t.bindFramebuffer(i.FRAMEBUFFER,null)}function re(L,b,V){if(i.bindRenderbuffer(i.RENDERBUFFER,L),b.depthBuffer){const G=b.depthTexture,$=G&&G.isDepthTexture?G.type:null,ae=_(b.stencilBuffer,$),ce=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;nt(b)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe(b),ae,b.width,b.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe(b),ae,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ae,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ce,i.RENDERBUFFER,L)}else{const G=b.textures;for(let $=0;$<G.length;$++){const ae=G[$],ce=n.convert(ae.format,ae.colorSpace),Z=n.convert(ae.type),j=M(ae.internalFormat,ce,Z,ae.normalized,ae.colorSpace);nt(b)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe(b),j,b.width,b.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe(b),j,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,j,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _e(L,b,V){const G=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=r.get(b.depthTexture);if($.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),G){if($.__webglInit===void 0&&($.__webglInit=!0,b.depthTexture.addEventListener("dispose",T)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ne(i.TEXTURE_CUBE_MAP,b.depthTexture);const ue=n.convert(b.depthTexture.format),we=n.convert(b.depthTexture.type);let de;b.depthTexture.format===Tn?de=i.DEPTH_COMPONENT24:b.depthTexture.format===ti&&(de=i.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,de,b.width,b.height,0,ue,we,null)}}else W(b.depthTexture,0);const ae=$.__webglTexture,ce=Xe(b),Z=G?i.TEXTURE_CUBE_MAP_POSITIVE_X+V:i.TEXTURE_2D,j=b.depthTexture.format===ti?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(b.depthTexture.format===Tn)nt(b)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Z,ae,0,ce):i.framebufferTexture2D(i.FRAMEBUFFER,j,Z,ae,0);else if(b.depthTexture.format===ti)nt(b)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Z,ae,0,ce):i.framebufferTexture2D(i.FRAMEBUFFER,j,Z,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function We(L){const b=r.get(L),V=L.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==L.depthTexture){const G=L.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),G){const $=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,G.removeEventListener("dispose",$)};G.addEventListener("dispose",$),b.__depthDisposeCallback=$}b.__boundDepthTexture=G}if(L.depthTexture&&!b.__autoAllocateDepthBuffer)if(V)for(let G=0;G<6;G++)_e(b.__webglFramebuffer[G],L,G);else{const G=L.texture.mipmaps;G&&G.length>0?_e(b.__webglFramebuffer[0],L,0):_e(b.__webglFramebuffer,L,0)}else if(V){b.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[G]),b.__webglDepthbuffer[G]===void 0)b.__webglDepthbuffer[G]=i.createRenderbuffer(),re(b.__webglDepthbuffer[G],L,!1);else{const $=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ae)}}else{const G=L.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),re(b.__webglDepthbuffer,L,!1);else{const $=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ae)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(L,b,V){const G=r.get(L);b!==void 0&&xe(G.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&We(L)}function Be(L){const b=L.texture,V=r.get(L),G=r.get(b);L.addEventListener("dispose",x);const $=L.textures,ae=L.isWebGLCubeRenderTarget===!0,ce=$.length>1;if(ce||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=b.version,a.memory.textures++),ae){V.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer[Z]=[];for(let j=0;j<b.mipmaps.length;j++)V.__webglFramebuffer[Z][j]=i.createFramebuffer()}else V.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer=[];for(let Z=0;Z<b.mipmaps.length;Z++)V.__webglFramebuffer[Z]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(ce)for(let Z=0,j=$.length;Z<j;Z++){const ue=r.get($[Z]);ue.__webglTexture===void 0&&(ue.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&nt(L)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let Z=0;Z<$.length;Z++){const j=$[Z];V.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[Z]);const ue=n.convert(j.format,j.colorSpace),we=n.convert(j.type),de=M(j.internalFormat,ue,we,j.normalized,j.colorSpace,L.isXRRenderTarget===!0),fe=Xe(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,de,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,V.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),re(V.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ae){t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),ne(i.TEXTURE_CUBE_MAP,b);for(let Z=0;Z<6;Z++)if(b.mipmaps&&b.mipmaps.length>0)for(let j=0;j<b.mipmaps.length;j++)xe(V.__webglFramebuffer[Z][j],L,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else xe(V.__webglFramebuffer[Z],L,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(b)&&E(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let Z=0,j=$.length;Z<j;Z++){const ue=$[Z],we=r.get(ue);let de=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(de=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,we.__webglTexture),ne(de,ue),xe(V.__webglFramebuffer,L,ue,i.COLOR_ATTACHMENT0+Z,de,0),g(ue)&&E(de)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Z=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,G.__webglTexture),ne(Z,b),b.mipmaps&&b.mipmaps.length>0)for(let j=0;j<b.mipmaps.length;j++)xe(V.__webglFramebuffer[j],L,b,i.COLOR_ATTACHMENT0,Z,j);else xe(V.__webglFramebuffer,L,b,i.COLOR_ATTACHMENT0,Z,0);g(b)&&E(Z),t.unbindTexture()}L.depthBuffer&&We(L)}function ct(L){const b=L.textures;for(let V=0,G=b.length;V<G;V++){const $=b[V];if(g($)){const ae=A(L),ce=r.get($).__webglTexture;t.bindTexture(ae,ce),E(ae),t.unbindTexture()}}}const ut=[],je=[];function Ze(L){if(L.samples>0){if(nt(L)===!1){const b=L.textures,V=L.width,G=L.height;let $=i.COLOR_BUFFER_BIT;const ae=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=r.get(L),Z=b.length>1;if(Z)for(let ue=0;ue<b.length;ue++)t.bindFramebuffer(i.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ce.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const j=L.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let ue=0;ue<b.length;ue++){if(L.resolveDepthBuffer&&(L.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ce.__webglColorRenderbuffer[ue]);const we=r.get(b[ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,we,0)}i.blitFramebuffer(0,0,V,G,0,0,V,G,$,i.NEAREST),c===!0&&(ut.length=0,je.length=0,ut.push(i.COLOR_ATTACHMENT0+ue),L.depthBuffer&&L.resolveDepthBuffer===!1&&(ut.push(ae),je.push(ae),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,je)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let ue=0;ue<b.length;ue++){t.bindFramebuffer(i.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,ce.__webglColorRenderbuffer[ue]);const we=r.get(b[ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ce.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,we,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const b=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function Xe(L){return Math.min(s.maxSamples,L.samples)}function nt(L){const b=r.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function O(L){const b=a.render.frame;h.get(L)!==b&&(h.set(L,b),L.update())}function St(L,b){const V=L.colorSpace,G=L.format,$=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||V!==Yr&&V!==Bn&&(Ge.getTransfer(V)===tt?(G!==kt||$!==Gt)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",V)),b}function Je(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(f.width=L.naturalWidth||L.width,f.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(f.width=L.displayWidth,f.height=L.displayHeight):(f.width=L.width,f.height=L.height),f}this.allocateTextureUnit=z,this.resetTextureUnits=D,this.getTextureUnits=N,this.setTextureUnits=I,this.setTexture2D=W,this.setTexture2DArray=K,this.setTexture3D=ie,this.setTextureCube=se,this.rebindTextures=Ve,this.setupRenderTarget=Be,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=nt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ag(i,e){function t(r,s=Bn){let n;const a=Ge.getTransfer(s);if(r===Gt)return i.UNSIGNED_BYTE;if(r===Va)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Ga)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ql)return i.UNSIGNED_INT_5_9_9_9_REV;if(r===jl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(r===Zl)return i.BYTE;if(r===Jl)return i.SHORT;if(r===Qi)return i.UNSIGNED_SHORT;if(r===Ha)return i.INT;if(r===hn)return i.UNSIGNED_INT;if(r===on)return i.FLOAT;if(r===En)return i.HALF_FLOAT;if(r===ec)return i.ALPHA;if(r===tc)return i.RGB;if(r===kt)return i.RGBA;if(r===Tn)return i.DEPTH_COMPONENT;if(r===ti)return i.DEPTH_STENCIL;if(r===nc)return i.RED;if(r===ka)return i.RED_INTEGER;if(r===si)return i.RG;if(r===Wa)return i.RG_INTEGER;if(r===Xa)return i.RGBA_INTEGER;if(r===Fr||r===Or||r===Br||r===zr)if(a===tt)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(r===Fr)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Or)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Br)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===zr)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(r===Fr)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Or)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Br)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===zr)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ia||r===ra||r===sa||r===aa)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(r===ia)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ra)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===sa)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===aa)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===oa||r===la||r===ca||r===ua||r===fa||r===Wr||r===ha)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(r===oa||r===la)return a===tt?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(r===ca)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(r===ua)return n.COMPRESSED_R11_EAC;if(r===fa)return n.COMPRESSED_SIGNED_R11_EAC;if(r===Wr)return n.COMPRESSED_RG11_EAC;if(r===ha)return n.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===da||r===pa||r===ma||r===ga||r===va||r===xa||r===_a||r===Sa||r===Ma||r===ya||r===Ea||r===Ta||r===ba||r===Aa)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(r===da)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===pa)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ma)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ga)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===va)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===xa)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===_a)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Sa)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ma)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===ya)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ea)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ta)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ba)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Aa)return a===tt?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===wa||r===Ra||r===Ca)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(r===wa)return a===tt?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ra)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ca)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Pa||r===La||r===Xr||r===Da)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(r===Pa)return n.COMPRESSED_RED_RGTC1_EXT;if(r===La)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Xr)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Da)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ji?i.UNSIGNED_INT_24_8:i[r]!==void 0?i[r]:null}return{convert:t}}const og=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class cg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const r=new hc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Bt({vertexShader:og,fragmentShader:lg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Wt(new Oi(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ug extends li{constructor(e,t){super();const r=this;let s=null,n=1,a=null,l="local-floor",c=1,f=null,h=null,m=null,u=null,o=null,d=null;const v=typeof XRWebGLBinding<"u",p=new cg,g={},E=t.getContextAttributes();let A=null,M=null;const _=[],S=[],T=new He;let x=null;const y=new $t;y.viewport=new ft;const w=new $t;w.viewport=new ft;const R=[y,w],C=new Sf;let D=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let ee=_[H];return ee===void 0&&(ee=new vs,_[H]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(H){let ee=_[H];return ee===void 0&&(ee=new vs,_[H]=ee),ee.getGripSpace()},this.getHand=function(H){let ee=_[H];return ee===void 0&&(ee=new vs,_[H]=ee),ee.getHandSpace()};function I(H){const ee=S.indexOf(H.inputSource);if(ee===-1)return;const J=_[ee];J!==void 0&&(J.update(H.inputSource,H.frame,f||a),J.dispatchEvent({type:H.type,data:H.inputSource}))}function z(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",U);for(let H=0;H<_.length;H++){const ee=S[H];ee!==null&&(S[H]=null,_[H].disconnect(ee))}D=null,N=null,p.reset();for(const H in g)delete g[H];e.setRenderTarget(A),o=null,u=null,m=null,s=null,M=null,ne.stop(),r.isPresenting=!1,e.setPixelRatio(x),e.setSize(T.width,T.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){n=H,r.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){l=H,r.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||a},this.setReferenceSpace=function(H){f=H},this.getBaseLayer=function(){return u!==null?u:o},this.getBinding=function(){return m===null&&v&&(m=new XRWebGLBinding(s,t)),m},this.getFrame=function(){return d},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",z),s.addEventListener("inputsourceschange",U),E.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let J=null,ye=null,Ee=null;E.depth&&(Ee=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=E.stencil?ti:Tn,ye=E.stencil?ji:hn);const xe={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:n};m=this.getBinding(),u=m.createProjectionLayer(xe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new Qt(u.textureWidth,u.textureHeight,{format:kt,type:Gt,depthTexture:new Fi(u.textureWidth,u.textureHeight,ye,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const J={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:n};o=new XRWebGLLayer(s,t,J),s.updateRenderState({baseLayer:o}),e.setPixelRatio(1),e.setSize(o.framebufferWidth,o.framebufferHeight,!1),M=new Qt(o.framebufferWidth,o.framebufferHeight,{format:kt,type:Gt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:o.ignoreDepthValues===!1,resolveStencilBuffer:o.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),f=null,a=await s.requestReferenceSpace(l),ne.setContext(s),ne.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function U(H){for(let ee=0;ee<H.removed.length;ee++){const J=H.removed[ee],ye=S.indexOf(J);ye>=0&&(S[ye]=null,_[ye].disconnect(J))}for(let ee=0;ee<H.added.length;ee++){const J=H.added[ee];let ye=S.indexOf(J);if(ye===-1){for(let xe=0;xe<_.length;xe++)if(xe>=S.length){S.push(J),ye=xe;break}else if(S[xe]===null){S[xe]=J,ye=xe;break}if(ye===-1)break}const Ee=_[ye];Ee&&Ee.connect(J)}}const W=new Y,K=new Y;function ie(H,ee,J){W.setFromMatrixPosition(ee.matrixWorld),K.setFromMatrixPosition(J.matrixWorld);const ye=W.distanceTo(K),Ee=ee.projectionMatrix.elements,xe=J.projectionMatrix.elements,re=Ee[14]/(Ee[10]-1),_e=Ee[14]/(Ee[10]+1),We=(Ee[9]+1)/Ee[5],Ve=(Ee[9]-1)/Ee[5],Be=(Ee[8]-1)/Ee[0],ct=(xe[8]+1)/xe[0],ut=re*Be,je=re*ct,Ze=ye/(-Be+ct),Xe=Ze*-Be;if(ee.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(Xe),H.translateZ(Ze),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),Ee[10]===-1)H.projectionMatrix.copy(ee.projectionMatrix),H.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const nt=re+Ze,O=_e+Ze,St=ut-Xe,Je=je+(ye-Xe),L=We*_e/O*nt,b=Ve*_e/O*nt;H.projectionMatrix.makePerspective(St,Je,L,b,nt,O),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function se(H,ee){ee===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(ee.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;let ee=H.near,J=H.far;p.texture!==null&&(p.depthNear>0&&(ee=p.depthNear),p.depthFar>0&&(J=p.depthFar)),C.near=w.near=y.near=ee,C.far=w.far=y.far=J,(D!==C.near||N!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),D=C.near,N=C.far),C.layers.mask=H.layers.mask|6,y.layers.mask=C.layers.mask&-5,w.layers.mask=C.layers.mask&-3;const ye=H.parent,Ee=C.cameras;se(C,ye);for(let xe=0;xe<Ee.length;xe++)se(Ee[xe],ye);Ee.length===2?ie(C,y,w):C.projectionMatrix.copy(y.projectionMatrix),oe(H,C,ye)};function oe(H,ee,J){J===null?H.matrix.copy(ee.matrixWorld):(H.matrix.copy(J.matrixWorld),H.matrix.invert(),H.matrix.multiply(ee.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(ee.projectionMatrix),H.projectionMatrixInverse.copy(ee.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Ia*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(u===null&&o===null))return c},this.setFoveation=function(H){c=H,u!==null&&(u.fixedFoveation=H),o!==null&&o.fixedFoveation!==void 0&&(o.fixedFoveation=H)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(C)},this.getCameraTexture=function(H){return g[H]};let De=null;function qe(H,ee){if(h=ee.getViewerPose(f||a),d=ee,h!==null){const J=h.views;o!==null&&(e.setRenderTargetFramebuffer(M,o.framebuffer),e.setRenderTarget(M));let ye=!1;J.length!==C.cameras.length&&(C.cameras.length=0,ye=!0);for(let _e=0;_e<J.length;_e++){const We=J[_e];let Ve=null;if(o!==null)Ve=o.getViewport(We);else{const ct=m.getViewSubImage(u,We);Ve=ct.viewport,_e===0&&(e.setRenderTargetTextures(M,ct.colorTexture,ct.depthStencilTexture),e.setRenderTarget(M))}let Be=R[_e];Be===void 0&&(Be=new $t,Be.layers.enable(_e),Be.viewport=new ft,R[_e]=Be),Be.matrix.fromArray(We.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(We.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),_e===0&&(C.matrix.copy(Be.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),ye===!0&&C.cameras.push(Be)}const Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){m=r.getBinding();const _e=m.getDepthInformation(J[0]);_e&&_e.isValid&&_e.texture&&p.init(_e,s.renderState)}if(Ee&&Ee.includes("camera-access")&&v){e.state.unbindTexture(),m=r.getBinding();for(let _e=0;_e<J.length;_e++){const We=J[_e].camera;if(We){let Ve=g[We];Ve||(Ve=new hc,g[We]=Ve);const Be=m.getCameraImage(We);Ve.sourceTexture=Be}}}}for(let J=0;J<_.length;J++){const ye=S[J],Ee=_[J];ye!==null&&Ee!==void 0&&Ee.update(ye,ee,f||a)}De&&De(H,ee),ee.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:ee}),d=null}const ne=new mc;ne.setAnimationLoop(qe),this.setAnimationLoop=function(H){De=H},this.dispose=function(){}}}const fg=new _t,yc=new Ue;yc.set(-1,0,0,0,1,0,0,0,1);function hg(i,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function r(p,g){g.color.getRGB(p.fogColor.value,dc(i)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,E,A,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?n(p,g):g.isMeshLambertMaterial?(n(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(n(p,g),m(p,g)):g.isMeshPhongMaterial?(n(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(n(p,g),u(p,g),g.isMeshPhysicalMaterial&&o(p,g,M)):g.isMeshMatcapMaterial?(n(p,g),d(p,g)):g.isMeshDepthMaterial?n(p,g):g.isMeshDistanceMaterial?(n(p,g),v(p,g)):g.isMeshNormalMaterial?n(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&l(p,g)):g.isPointsMaterial?c(p,g,E,A):g.isSpriteMaterial?f(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function n(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===It&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===It&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const E=e.get(g),A=E.envMap,M=E.envMapRotation;A&&(p.envMap.value=A,p.envMapRotation.value.setFromMatrix4(fg.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(yc),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function l(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function c(p,g,E,A){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*E,p.scale.value=A*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function f(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function m(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function u(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function o(p,g,E){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===It&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function d(p,g){g.matcap&&(p.matcap.value=g.matcap)}function v(p,g){const E=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:s}}function dg(i,e,t,r){let s={},n={},a=[];const l=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,_){const S=_.program;r.uniformBlockBinding(M,S)}function f(M,_){let S=s[M.id];S===void 0&&(p(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",E));const T=_.program;r.updateUBOMapping(M,T);const x=e.render.frame;n[M.id]!==x&&(u(M),n[M.id]=x)}function h(M){const _=m();M.__bindingPointIndex=_;const S=i.createBuffer(),T=M.__size,x=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,T,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,S),S}function m(){for(let M=0;M<l;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const _=s[M.id],S=M.uniforms,T=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let x=0,y=S.length;x<y;x++){const w=S[x];if(Array.isArray(w))for(let R=0,C=w.length;R<C;R++)o(w[R],x,R,T);else o(w,x,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function o(M,_,S,T){if(v(M,_,S,T)===!0){const x=M.__offset,y=M.value;if(Array.isArray(y)){let w=0;for(let R=0;R<y.length;R++){const C=y[R],D=g(C);d(C,M.__data,w),typeof C!="number"&&typeof C!="boolean"&&!C.isMatrix3&&!ArrayBuffer.isView(C)&&(w+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else d(y,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,M.__data)}}function d(M,_,S){typeof M=="number"||typeof M=="boolean"?_[0]=M:M.isMatrix3?(_[0]=M.elements[0],_[1]=M.elements[1],_[2]=M.elements[2],_[3]=0,_[4]=M.elements[3],_[5]=M.elements[4],_[6]=M.elements[5],_[7]=0,_[8]=M.elements[6],_[9]=M.elements[7],_[10]=M.elements[8],_[11]=0):ArrayBuffer.isView(M)?_.set(new M.constructor(M.buffer,M.byteOffset,_.length)):M.toArray(_,S)}function v(M,_,S,T){const x=M.value,y=_+"_"+S;if(T[y]===void 0)return typeof x=="number"||typeof x=="boolean"?T[y]=x:ArrayBuffer.isView(x)?T[y]=x.slice():T[y]=x.clone(),!0;{const w=T[y];if(typeof x=="number"||typeof x=="boolean"){if(w!==x)return T[y]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(w.equals(x)===!1)return w.copy(x),!0}}return!1}function p(M){const _=M.uniforms;let S=0;const T=16;for(let y=0,w=_.length;y<w;y++){const R=Array.isArray(_[y])?_[y]:[_[y]];for(let C=0,D=R.length;C<D;C++){const N=R[C],I=Array.isArray(N.value)?N.value:[N.value];for(let z=0,U=I.length;z<U;z++){const W=I[z],K=g(W),ie=S%T,se=ie%K.boundary,oe=ie+se;S+=se,oe!==0&&T-oe<K.storage&&(S+=T-oe),N.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=K.storage}}}const x=S%T;return x>0&&(S+=T-x),M.__size=S,M.__cache={},this}function g(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(_.boundary=16,_.storage=M.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",M),_}function E(M){const _=M.target;_.removeEventListener("dispose",E);const S=a.indexOf(_.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete n[_.id]}function A(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},n={}}return{bind:c,update:f,dispose:A}}const pg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let sn=null;function mg(){return sn===null&&(sn=new tf(pg,16,16,si,En),sn.name="DFG_LUT",sn.minFilter=vt,sn.magFilter=vt,sn.wrapS=Jt,sn.wrapT=Jt,sn.generateMipmaps=!1,sn.needsUpdate=!0),sn}class gg{constructor(e={}){const{canvas:t=Du(),context:r=null,depth:s=!0,stencil:n=!1,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:f=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:u=!1,outputBufferType:o=Gt}=e;this.isWebGLRenderer=!0;let d;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=r.getContextAttributes().alpha}else d=a;const v=o,p=new Set([Xa,Wa,ka]),g=new Set([Gt,hn,Qi,ji,Va,Ga]),E=new Uint32Array(4),A=new Int32Array(4),M=new Y;let _=null,S=null;const T=[],x=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=cn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let R=!1,C=null,D=null,N=null,I=null;this._outputColorSpace=Dt;let z=0,U=0,W=null,K=-1,ie=null;const se=new ft,oe=new ft;let De=null;const qe=new et(0);let ne=0,H=t.width,ee=t.height,J=1,ye=null,Ee=null;const xe=new ft(0,0,H,ee),re=new ft(0,0,H,ee);let _e=!1;const We=new uc;let Ve=!1,Be=!1;const ct=new _t,ut=new Y,je=new ft,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xe=!1;function nt(){return W===null?J:1}let O=r;function St(P,B){return t.getContext(P,B)}try{const P={alpha:!0,depth:s,stencil:n,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:f,powerPreference:h,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${za}`),t.addEventListener("webglcontextlost",ht,!1),t.addEventListener("webglcontextrestored",ot,!1),t.addEventListener("webglcontextcreationerror",en,!1),O===null){const B="webgl2";if(O=St(B,P),O===null)throw St(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(P){throw Ke("WebGLRenderer: "+P.message),P}let Je,L,b,V,G,$,ae,ce,Z,j,ue,we,de,fe,Pe,Le,Ne,F,le,Q,he,ve,te;function Ae(){Je=new mp(O),Je.init(),he=new ag(O,Je),L=new op(O,Je,e,he),b=new rg(O,Je),L.reversedDepthBuffer&&u&&b.buffers.depth.setReversed(!0),D=O.createFramebuffer(),N=O.createFramebuffer(),I=O.createFramebuffer(),V=new xp(O),G=new Wm,$=new sg(O,Je,b,G,L,he,V),ae=new pp(w),ce=new yf(O),ve=new sp(O,ce),Z=new gp(O,ce,V,ve),j=new Sp(O,Z,ce,ve,V),F=new _p(O,L,$),Pe=new lp(G),ue=new km(w,ae,Je,L,ve,Pe),we=new hg(w,G),de=new Ym,fe=new Qm(Je),Ne=new rp(w,ae,b,j,d,c),Le=new ig(w,j,L),te=new dg(O,V,L,b),le=new ap(O,Je,V),Q=new vp(O,Je,V),V.programs=ue.programs,w.capabilities=L,w.extensions=Je,w.properties=G,w.renderLists=de,w.shadowMap=Le,w.state=b,w.info=V}Ae(),v!==Gt&&(y=new yp(v,t.width,t.height,l,s,n));const Te=new ug(w,O);this.xr=Te,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const P=Je.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Je.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(P){P!==void 0&&(J=P,this.setSize(H,ee,!1))},this.getSize=function(P){return P.set(H,ee)},this.setSize=function(P,B,q=!0){if(Te.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}H=P,ee=B,t.width=Math.floor(P*J),t.height=Math.floor(B*J),q===!0&&(t.style.width=P+"px",t.style.height=B+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,P,B)},this.getDrawingBufferSize=function(P){return P.set(H*J,ee*J).floor()},this.setDrawingBufferSize=function(P,B,q){H=P,ee=B,J=q,t.width=Math.floor(P*q),t.height=Math.floor(B*q),this.setViewport(0,0,P,B)},this.setEffects=function(P){if(v===Gt){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(P){for(let B=0;B<P.length;B++)if(P[B].isOutputPass===!0){Ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(P||[])},this.getCurrentViewport=function(P){return P.copy(se)},this.getViewport=function(P){return P.copy(xe)},this.setViewport=function(P,B,q,k){P.isVector4?xe.set(P.x,P.y,P.z,P.w):xe.set(P,B,q,k),b.viewport(se.copy(xe).multiplyScalar(J).round())},this.getScissor=function(P){return P.copy(re)},this.setScissor=function(P,B,q,k){P.isVector4?re.set(P.x,P.y,P.z,P.w):re.set(P,B,q,k),b.scissor(oe.copy(re).multiplyScalar(J).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(P){b.setScissorTest(_e=P)},this.setOpaqueSort=function(P){ye=P},this.setTransparentSort=function(P){Ee=P},this.getClearColor=function(P){return P.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(P=!0,B=!0,q=!0){let k=0;if(P){let X=!1;if(W!==null){const ge=W.texture.format;X=p.has(ge)}if(X){const ge=W.texture.type,Me=g.has(ge),me=Ne.getClearColor(),be=Ne.getClearAlpha(),Re=me.r,Fe=me.g,ze=me.b;Me?(E[0]=Re,E[1]=Fe,E[2]=ze,E[3]=be,O.clearBufferuiv(O.COLOR,0,E)):(A[0]=Re,A[1]=Fe,A[2]=ze,A[3]=be,O.clearBufferiv(O.COLOR,0,A))}else k|=O.COLOR_BUFFER_BIT}B&&(k|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(k|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&O.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(P){P.setRenderer(this),C=P},this.dispose=function(){t.removeEventListener("webglcontextlost",ht,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",en,!1),Ne.dispose(),de.dispose(),fe.dispose(),G.dispose(),ae.dispose(),j.dispose(),ve.dispose(),te.dispose(),ue.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",ho),Te.removeEventListener("sessionend",po),qn.stop()};function ht(P){P.preventDefault(),Io("WebGLRenderer: Context Lost."),R=!0}function ot(){Io("WebGLRenderer: Context Restored."),R=!1;const P=V.autoReset,B=Le.enabled,q=Le.autoUpdate,k=Le.needsUpdate,X=Le.type;Ae(),V.autoReset=P,Le.enabled=B,Le.autoUpdate=q,Le.needsUpdate=k,Le.type=X}function en(P){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function tn(P){const B=P.target;B.removeEventListener("dispose",tn),zc(B)}function zc(P){Hc(P),G.remove(P)}function Hc(P){const B=G.get(P).programs;B!==void 0&&(B.forEach(function(q){ue.releaseProgram(q)}),P.isShaderMaterial&&ue.releaseShaderCache(P))}this.renderBufferDirect=function(P,B,q,k,X,ge){B===null&&(B=Ze);const Me=X.isMesh&&X.matrixWorld.determinantAffine()<0,me=kc(P,B,q,k,X);b.setMaterial(k,Me);let be=q.index,Re=1;if(k.wireframe===!0){if(be=Z.getWireframeAttribute(q),be===void 0)return;Re=2}const Fe=q.drawRange,ze=q.attributes.position;let Ce=Fe.start*Re,it=(Fe.start+Fe.count)*Re;ge!==null&&(Ce=Math.max(Ce,ge.start*Re),it=Math.min(it,(ge.start+ge.count)*Re)),be!==null?(Ce=Math.max(Ce,0),it=Math.min(it,be.count)):ze!=null&&(Ce=Math.max(Ce,0),it=Math.min(it,ze.count));const pt=it-Ce;if(pt<0||pt===1/0)return;ve.setup(X,k,me,q,be);let dt,st=le;if(be!==null&&(dt=ce.get(be),st=Q,st.setIndex(dt)),X.isMesh)k.wireframe===!0?(b.setLineWidth(k.wireframeLinewidth*nt()),st.setMode(O.LINES)):st.setMode(O.TRIANGLES);else if(X.isLine){let wt=k.linewidth;wt===void 0&&(wt=1),b.setLineWidth(wt*nt()),X.isLineSegments?st.setMode(O.LINES):X.isLineLoop?st.setMode(O.LINE_LOOP):st.setMode(O.LINE_STRIP)}else X.isPoints?st.setMode(O.POINTS):X.isSprite&&st.setMode(O.TRIANGLES);if(X.isBatchedMesh)if(Je.get("WEBGL_multi_draw"))st.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const wt=X._multiDrawStarts,Se=X._multiDrawCounts,Ut=X._multiDrawCount,$e=be?ce.get(be).bytesPerElement:1,zt=G.get(k).currentProgram.getUniforms();for(let nn=0;nn<Ut;nn++)zt.setValue(O,"_gl_DrawID",nn),st.render(wt[nn]/$e,Se[nn])}else if(X.isInstancedMesh)st.renderInstances(Ce,pt,X.count);else if(q.isInstancedBufferGeometry){const wt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Se=Math.min(q.instanceCount,wt);st.renderInstances(Ce,pt,Se)}else st.render(Ce,pt)};function fo(P,B,q){P.transparent===!0&&P.side===_n&&P.forceSinglePass===!1?(P.side=It,P.needsUpdate=!0,cr(P,B,q),P.side=Wn,P.needsUpdate=!0,cr(P,B,q),P.side=_n):cr(P,B,q)}this.compile=function(P,B,q=null){q===null&&(q=P),S=fe.get(q),S.init(B),x.push(S),q.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),P!==q&&P.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),S.setupLights();const k=new Set;return P.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const ge=X.material;if(ge)if(Array.isArray(ge))for(let Me=0;Me<ge.length;Me++){const me=ge[Me];fo(me,q,X),k.add(me)}else fo(ge,q,X),k.add(ge)}),S=x.pop(),k},this.compileAsync=function(P,B,q=null){const k=this.compile(P,B,q);return new Promise(X=>{function ge(){if(k.forEach(function(Me){G.get(Me).currentProgram.isReady()&&k.delete(Me)}),k.size===0){X(P);return}setTimeout(ge,10)}Je.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let ss=null;function Vc(P){ss&&ss(P)}function ho(){qn.stop()}function po(){qn.start()}const qn=new mc;qn.setAnimationLoop(Vc),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(P){ss=P,Te.setAnimationLoop(P),P===null?qn.stop():qn.start()},Te.addEventListener("sessionstart",ho),Te.addEventListener("sessionend",po),this.render=function(P,B){if(B!==void 0&&B.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;C!==null&&C.renderStart(P,B);const q=Te.enabled===!0&&Te.isPresenting===!0,k=y!==null&&(W===null||q)&&y.begin(w,W);if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(B),B=Te.getCamera()),P.isScene===!0&&P.onBeforeRender(w,P,B,W),S=fe.get(P,x.length),S.init(B),S.state.textureUnits=$.getTextureUnits(),x.push(S),ct.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),We.setFromProjectionMatrix(ct,ln,B.reversedDepth),Be=this.localClippingEnabled,Ve=Pe.init(this.clippingPlanes,Be),_=de.get(P,T.length),_.init(),T.push(_),Te.enabled===!0&&Te.isPresenting===!0){const Me=w.xr.getDepthSensingMesh();Me!==null&&as(Me,B,-1/0,w.sortObjects)}as(P,B,0,w.sortObjects),_.finish(),w.sortObjects===!0&&_.sort(ye,Ee,B.reversedDepth),Xe=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,Xe&&Ne.addToRenderList(_,P),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ve===!0&&Pe.beginShadows();const X=S.state.shadowsArray;if(Le.render(X,P,B),Ve===!0&&Pe.endShadows(),(k&&y.hasRenderPass())===!1){const Me=_.opaque,me=_.transmissive;if(S.setupLights(),B.isArrayCamera){const be=B.cameras;if(me.length>0)for(let Re=0,Fe=be.length;Re<Fe;Re++){const ze=be[Re];go(Me,me,P,ze)}Xe&&Ne.render(P);for(let Re=0,Fe=be.length;Re<Fe;Re++){const ze=be[Re];mo(_,P,ze,ze.viewport)}}else me.length>0&&go(Me,me,P,B),Xe&&Ne.render(P),mo(_,P,B)}W!==null&&U===0&&($.updateMultisampleRenderTarget(W),$.updateRenderTargetMipmap(W)),k&&y.end(w),P.isScene===!0&&P.onAfterRender(w,P,B),ve.resetDefaultState(),K=-1,ie=null,x.pop(),x.length>0?(S=x[x.length-1],$.setTextureUnits(S.state.textureUnits),Ve===!0&&Pe.setGlobalState(w.clippingPlanes,S.state.camera)):S=null,T.pop(),T.length>0?_=T[T.length-1]:_=null,C!==null&&C.renderEnd()};function as(P,B,q,k){if(P.visible===!1)return;if(P.layers.test(B.layers)){if(P.isGroup)q=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(B);else if(P.isLightProbeGrid)S.pushLightProbeGrid(P);else if(P.isLight)S.pushLight(P),P.castShadow&&S.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||We.intersectsSprite(P)){k&&je.setFromMatrixPosition(P.matrixWorld).applyMatrix4(ct);const Me=j.update(P),me=P.material;me.visible&&_.push(P,Me,me,q,je.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||We.intersectsObject(P))){const Me=j.update(P),me=P.material;if(k&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),je.copy(P.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),je.copy(Me.boundingSphere.center)),je.applyMatrix4(P.matrixWorld).applyMatrix4(ct)),Array.isArray(me)){const be=Me.groups;for(let Re=0,Fe=be.length;Re<Fe;Re++){const ze=be[Re],Ce=me[ze.materialIndex];Ce&&Ce.visible&&_.push(P,Me,Ce,q,je.z,ze)}}else me.visible&&_.push(P,Me,me,q,je.z,null)}}const ge=P.children;for(let Me=0,me=ge.length;Me<me;Me++)as(ge[Me],B,q,k)}function mo(P,B,q,k){const{opaque:X,transmissive:ge,transparent:Me}=P;S.setupLightsView(q),Ve===!0&&Pe.setGlobalState(w.clippingPlanes,q),k&&b.viewport(se.copy(k)),X.length>0&&lr(X,B,q),ge.length>0&&lr(ge,B,q),Me.length>0&&lr(Me,B,q),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function go(P,B,q,k){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[k.id]===void 0){const Ce=Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[k.id]=new Qt(1,1,{generateMipmaps:!0,type:Ce?En:Gt,minFilter:zn,samples:Math.max(4,L.samples),stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace})}const ge=S.state.transmissionRenderTarget[k.id],Me=k.viewport||se;ge.setSize(Me.z*w.transmissionResolutionScale,Me.w*w.transmissionResolutionScale);const me=w.getRenderTarget(),be=w.getActiveCubeFace(),Re=w.getActiveMipmapLevel();w.setRenderTarget(ge),w.getClearColor(qe),ne=w.getClearAlpha(),ne<1&&w.setClearColor(16777215,.5),w.clear(),Xe&&Ne.render(q);const Fe=w.toneMapping;w.toneMapping=cn;const ze=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),S.setupLightsView(k),Ve===!0&&Pe.setGlobalState(w.clippingPlanes,k),lr(P,q,k),$.updateMultisampleRenderTarget(ge),$.updateRenderTargetMipmap(ge),Je.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let it=0,pt=B.length;it<pt;it++){const dt=B[it],{object:st,geometry:wt,material:Se,group:Ut}=dt;if(Se.side===_n&&st.layers.test(k.layers)){const $e=Se.side;Se.side=It,Se.needsUpdate=!0,vo(st,q,k,wt,Se,Ut),Se.side=$e,Se.needsUpdate=!0,Ce=!0}}Ce===!0&&($.updateMultisampleRenderTarget(ge),$.updateRenderTargetMipmap(ge))}w.setRenderTarget(me,be,Re),w.setClearColor(qe,ne),ze!==void 0&&(k.viewport=ze),w.toneMapping=Fe}function lr(P,B,q){const k=B.isScene===!0?B.overrideMaterial:null;for(let X=0,ge=P.length;X<ge;X++){const Me=P[X],{object:me,geometry:be,group:Re}=Me;let Fe=Me.material;Fe.allowOverride===!0&&k!==null&&(Fe=k),me.layers.test(q.layers)&&vo(me,B,q,be,Fe,Re)}}function vo(P,B,q,k,X,ge){P.onBeforeRender(w,B,q,k,X,ge),P.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),X.onBeforeRender(w,B,q,k,P,ge),X.transparent===!0&&X.side===_n&&X.forceSinglePass===!1?(X.side=It,X.needsUpdate=!0,w.renderBufferDirect(q,B,k,X,P,ge),X.side=Wn,X.needsUpdate=!0,w.renderBufferDirect(q,B,k,X,P,ge),X.side=_n):w.renderBufferDirect(q,B,k,X,P,ge),P.onAfterRender(w,B,q,k,X,ge)}function cr(P,B,q){B.isScene!==!0&&(B=Ze);const k=G.get(P),X=S.state.lights,ge=S.state.shadowsArray,Me=X.state.version,me=ue.getParameters(P,X.state,ge,B,q,S.state.lightProbeGridArray),be=ue.getProgramCacheKey(me);let Re=k.programs;k.environment=P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial?B.environment:null,k.fog=B.fog;const Fe=P.isMeshStandardMaterial||P.isMeshLambertMaterial&&!P.envMap||P.isMeshPhongMaterial&&!P.envMap;k.envMap=ae.get(P.envMap||k.environment,Fe),k.envMapRotation=k.environment!==null&&P.envMap===null?B.environmentRotation:P.envMapRotation,Re===void 0&&(P.addEventListener("dispose",tn),Re=new Map,k.programs=Re);let ze=Re.get(be);if(ze!==void 0){if(k.currentProgram===ze&&k.lightsStateVersion===Me)return _o(P,me),ze}else me.uniforms=ue.getUniforms(P),C!==null&&P.isNodeMaterial&&C.build(P,q,me),P.onBeforeCompile(me,w),ze=ue.acquireProgram(me,be),Re.set(be,ze),k.uniforms=me.uniforms;const Ce=k.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Ce.clippingPlanes=Pe.uniform),_o(P,me),k.needsLights=Xc(P),k.lightsStateVersion=Me,k.needsLights&&(Ce.ambientLightColor.value=X.state.ambient,Ce.lightProbe.value=X.state.probe,Ce.directionalLights.value=X.state.directional,Ce.directionalLightShadows.value=X.state.directionalShadow,Ce.spotLights.value=X.state.spot,Ce.spotLightShadows.value=X.state.spotShadow,Ce.rectAreaLights.value=X.state.rectArea,Ce.ltc_1.value=X.state.rectAreaLTC1,Ce.ltc_2.value=X.state.rectAreaLTC2,Ce.pointLights.value=X.state.point,Ce.pointLightShadows.value=X.state.pointShadow,Ce.hemisphereLights.value=X.state.hemi,Ce.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ce.spotLightMatrix.value=X.state.spotLightMatrix,Ce.spotLightMap.value=X.state.spotLightMap,Ce.pointShadowMatrix.value=X.state.pointShadowMatrix),k.lightProbeGrid=S.state.lightProbeGridArray.length>0,k.currentProgram=ze,k.uniformsList=null,ze}function xo(P){if(P.uniformsList===null){const B=P.currentProgram.getUniforms();P.uniformsList=Hr.seqWithValue(B.seq,P.uniforms)}return P.uniformsList}function _o(P,B){const q=G.get(P);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.batchingColor=B.batchingColor,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.instancingMorph=B.instancingMorph,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function Gc(P,B){if(P.length===0)return null;if(P.length===1)return P[0].texture!==null?P[0]:null;M.setFromMatrixPosition(B.matrixWorld);for(let q=0,k=P.length;q<k;q++){const X=P[q];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function kc(P,B,q,k,X){B.isScene!==!0&&(B=Ze),$.resetTextureUnits();const ge=B.fog,Me=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?B.environment:null,me=W===null?w.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Ge.workingColorSpace,be=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Re=ae.get(k.envMap||Me,be),Fe=k.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ze=!!q.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ce=!!q.morphAttributes.position,it=!!q.morphAttributes.normal,pt=!!q.morphAttributes.color;let dt=cn;k.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(dt=w.toneMapping);const st=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,wt=st!==void 0?st.length:0,Se=G.get(k),Ut=S.state.lights;if(Ve===!0&&(Be===!0||P!==ie)){const lt=P===ie&&k.id===K;Pe.setState(k,P,lt)}let $e=!1;k.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Ut.state.version||Se.outputColorSpace!==me||X.isBatchedMesh&&Se.batching===!1||!X.isBatchedMesh&&Se.batching===!0||X.isBatchedMesh&&Se.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Se.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Se.instancing===!1||!X.isInstancedMesh&&Se.instancing===!0||X.isSkinnedMesh&&Se.skinning===!1||!X.isSkinnedMesh&&Se.skinning===!0||X.isInstancedMesh&&Se.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Se.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Se.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Se.instancingMorph===!1&&X.morphTexture!==null||Se.envMap!==Re||k.fog===!0&&Se.fog!==ge||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==Pe.numPlanes||Se.numIntersection!==Pe.numIntersection)||Se.vertexAlphas!==Fe||Se.vertexTangents!==ze||Se.morphTargets!==Ce||Se.morphNormals!==it||Se.morphColors!==pt||Se.toneMapping!==dt||Se.morphTargetsCount!==wt||!!Se.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&($e=!0):($e=!0,Se.__version=k.version);let zt=Se.currentProgram;$e===!0&&(zt=cr(k,B,X),C&&k.isNodeMaterial&&C.onUpdateProgram(k,zt,Se));let nn=!1,wn=!1,ci=!1;const at=zt.getUniforms(),mt=Se.uniforms;if(b.useProgram(zt.program)&&(nn=!0,wn=!0,ci=!0),k.id!==K&&(K=k.id,wn=!0),Se.needsLights){const lt=Gc(S.state.lightProbeGridArray,X);Se.lightProbeGrid!==lt&&(Se.lightProbeGrid=lt,wn=!0)}if(nn||ie!==P){b.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),at.setValue(O,"projectionMatrix",P.projectionMatrix),at.setValue(O,"viewMatrix",P.matrixWorldInverse);const Cn=at.map.cameraPosition;Cn!==void 0&&Cn.setValue(O,ut.setFromMatrixPosition(P.matrixWorld)),L.logarithmicDepthBuffer&&at.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&at.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),ie!==P&&(ie=P,wn=!0,ci=!0)}if(Se.needsLights&&(Ut.state.directionalShadowMap.length>0&&at.setValue(O,"directionalShadowMap",Ut.state.directionalShadowMap,$),Ut.state.spotShadowMap.length>0&&at.setValue(O,"spotShadowMap",Ut.state.spotShadowMap,$),Ut.state.pointShadowMap.length>0&&at.setValue(O,"pointShadowMap",Ut.state.pointShadowMap,$)),X.isSkinnedMesh){at.setOptional(O,X,"bindMatrix"),at.setOptional(O,X,"bindMatrixInverse");const lt=X.skeleton;lt&&(lt.boneTexture===null&&lt.computeBoneTexture(),at.setValue(O,"boneTexture",lt.boneTexture,$))}X.isBatchedMesh&&(at.setOptional(O,X,"batchingTexture"),at.setValue(O,"batchingTexture",X._matricesTexture,$),at.setOptional(O,X,"batchingIdTexture"),at.setValue(O,"batchingIdTexture",X._indirectTexture,$),at.setOptional(O,X,"batchingColorTexture"),X._colorsTexture!==null&&at.setValue(O,"batchingColorTexture",X._colorsTexture,$));const Rn=q.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&F.update(X,q,zt),(wn||Se.receiveShadow!==X.receiveShadow)&&(Se.receiveShadow=X.receiveShadow,at.setValue(O,"receiveShadow",X.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&B.environment!==null&&(mt.envMapIntensity.value=B.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=mg()),wn){if(at.setValue(O,"toneMappingExposure",w.toneMappingExposure),Se.needsLights&&Wc(mt,ci),ge&&k.fog===!0&&we.refreshFogUniforms(mt,ge),we.refreshMaterialUniforms(mt,k,J,ee,S.state.transmissionRenderTarget[P.id]),Se.needsLights&&Se.lightProbeGrid){const lt=Se.lightProbeGrid;mt.probesSH.value=lt.texture,mt.probesMin.value.copy(lt.boundingBox.min),mt.probesMax.value.copy(lt.boundingBox.max),mt.probesResolution.value.copy(lt.resolution)}Hr.upload(O,xo(Se),mt,$)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Hr.upload(O,xo(Se),mt,$),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&at.setValue(O,"center",X.center),at.setValue(O,"modelViewMatrix",X.modelViewMatrix),at.setValue(O,"normalMatrix",X.normalMatrix),at.setValue(O,"modelMatrix",X.matrixWorld),k.uniformsGroups!==void 0){const lt=k.uniformsGroups;for(let Cn=0,ui=lt.length;Cn<ui;Cn++){const So=lt[Cn];te.update(So,zt),te.bind(So,zt)}}return zt}function Wc(P,B){P.ambientLightColor.needsUpdate=B,P.lightProbe.needsUpdate=B,P.directionalLights.needsUpdate=B,P.directionalLightShadows.needsUpdate=B,P.pointLights.needsUpdate=B,P.pointLightShadows.needsUpdate=B,P.spotLights.needsUpdate=B,P.spotLightShadows.needsUpdate=B,P.rectAreaLights.needsUpdate=B,P.hemisphereLights.needsUpdate=B}function Xc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(P,B,q){const k=G.get(P);k.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),G.get(P.texture).__webglTexture=B,G.get(P.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:q,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,B){const q=G.get(P);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(P,B=0,q=0){W=P,z=B,U=q;let k=null,X=!1,ge=!1;if(P){const me=G.get(P);if(me.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(O.FRAMEBUFFER,me.__webglFramebuffer),se.copy(P.viewport),oe.copy(P.scissor),De=P.scissorTest,b.viewport(se),b.scissor(oe),b.setScissorTest(De),K=-1;return}else if(me.__webglFramebuffer===void 0)$.setupRenderTarget(P);else if(me.__hasExternalTextures)$.rebindTextures(P,G.get(P.texture).__webglTexture,G.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Fe=P.depthTexture;if(me.__boundDepthTexture!==Fe){if(Fe!==null&&G.has(Fe)&&(P.width!==Fe.image.width||P.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(P)}}const be=P.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(ge=!0);const Re=G.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Re[B])?k=Re[B][q]:k=Re[B],X=!0):P.samples>0&&$.useMultisampledRTT(P)===!1?k=G.get(P).__webglMultisampledFramebuffer:Array.isArray(Re)?k=Re[q]:k=Re,se.copy(P.viewport),oe.copy(P.scissor),De=P.scissorTest}else se.copy(xe).multiplyScalar(J).floor(),oe.copy(re).multiplyScalar(J).floor(),De=_e;if(q!==0&&(k=D),b.bindFramebuffer(O.FRAMEBUFFER,k)&&b.drawBuffers(P,k),b.viewport(se),b.scissor(oe),b.setScissorTest(De),X){const me=G.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+B,me.__webglTexture,q)}else if(ge){const me=B;for(let be=0;be<P.textures.length;be++){const Re=G.get(P.textures[be]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+be,Re.__webglTexture,q,me)}}else if(P!==null&&q!==0){const me=G.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,me.__webglTexture,q)}K=-1},this.readRenderTargetPixels=function(P,B,q,k,X,ge,Me,me=0){if(!(P&&P.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=G.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Me!==void 0&&(be=be[Me]),be){b.bindFramebuffer(O.FRAMEBUFFER,be);try{const Re=P.textures[me],Fe=Re.format,ze=Re.type;if(P.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+me),!L.textureFormatReadable(Fe)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!L.textureTypeReadable(ze)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=P.width-k&&q>=0&&q<=P.height-X&&O.readPixels(B,q,k,X,he.convert(Fe),he.convert(ze),ge)}finally{const Re=W!==null?G.get(W).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(P,B,q,k,X,ge,Me,me=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=G.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Me!==void 0&&(be=be[Me]),be)if(B>=0&&B<=P.width-k&&q>=0&&q<=P.height-X){b.bindFramebuffer(O.FRAMEBUFFER,be);const Re=P.textures[me],Fe=Re.format,ze=Re.type;if(P.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+me),!L.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!L.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ce),O.bufferData(O.PIXEL_PACK_BUFFER,ge.byteLength,O.STREAM_READ),O.readPixels(B,q,k,X,he.convert(Fe),he.convert(ze),0);const it=W!==null?G.get(W).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,it);const pt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Iu(O,pt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ce),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ge),O.deleteBuffer(Ce),O.deleteSync(pt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,B=null,q=0){const k=Math.pow(2,-q),X=Math.floor(P.image.width*k),ge=Math.floor(P.image.height*k),Me=B!==null?B.x:0,me=B!==null?B.y:0;$.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,q,0,0,Me,me,X,ge),b.unbindTexture()},this.copyTextureToTexture=function(P,B,q=null,k=null,X=0,ge=0){let Me,me,be,Re,Fe,ze,Ce,it,pt;const dt=P.isCompressedTexture?P.mipmaps[ge]:P.image;if(q!==null)Me=q.max.x-q.min.x,me=q.max.y-q.min.y,be=q.isBox3?q.max.z-q.min.z:1,Re=q.min.x,Fe=q.min.y,ze=q.isBox3?q.min.z:0;else{const mt=Math.pow(2,-X);Me=Math.floor(dt.width*mt),me=Math.floor(dt.height*mt),P.isDataArrayTexture?be=dt.depth:P.isData3DTexture?be=Math.floor(dt.depth*mt):be=1,Re=0,Fe=0,ze=0}k!==null?(Ce=k.x,it=k.y,pt=k.z):(Ce=0,it=0,pt=0);const st=he.convert(B.format),wt=he.convert(B.type);let Se;B.isData3DTexture?($.setTexture3D(B,0),Se=O.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?($.setTexture2DArray(B,0),Se=O.TEXTURE_2D_ARRAY):($.setTexture2D(B,0),Se=O.TEXTURE_2D),b.activeTexture(O.TEXTURE0),b.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,B.flipY),b.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),b.pixelStorei(O.UNPACK_ALIGNMENT,B.unpackAlignment);const Ut=b.getParameter(O.UNPACK_ROW_LENGTH),$e=b.getParameter(O.UNPACK_IMAGE_HEIGHT),zt=b.getParameter(O.UNPACK_SKIP_PIXELS),nn=b.getParameter(O.UNPACK_SKIP_ROWS),wn=b.getParameter(O.UNPACK_SKIP_IMAGES);b.pixelStorei(O.UNPACK_ROW_LENGTH,dt.width),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,dt.height),b.pixelStorei(O.UNPACK_SKIP_PIXELS,Re),b.pixelStorei(O.UNPACK_SKIP_ROWS,Fe),b.pixelStorei(O.UNPACK_SKIP_IMAGES,ze);const ci=P.isDataArrayTexture||P.isData3DTexture,at=B.isDataArrayTexture||B.isData3DTexture;if(P.isDepthTexture){const mt=G.get(P),Rn=G.get(B),lt=G.get(mt.__renderTarget),Cn=G.get(Rn.__renderTarget);b.bindFramebuffer(O.READ_FRAMEBUFFER,lt.__webglFramebuffer),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,Cn.__webglFramebuffer);for(let ui=0;ui<be;ui++)ci&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,G.get(P).__webglTexture,X,ze+ui),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,G.get(B).__webglTexture,ge,pt+ui)),O.blitFramebuffer(Re,Fe,Me,me,Ce,it,Me,me,O.DEPTH_BUFFER_BIT,O.NEAREST);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(X!==0||P.isRenderTargetTexture||G.has(P)){const mt=G.get(P),Rn=G.get(B);b.bindFramebuffer(O.READ_FRAMEBUFFER,N),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,I);for(let lt=0;lt<be;lt++)ci?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,mt.__webglTexture,X,ze+lt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,mt.__webglTexture,X),at?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Rn.__webglTexture,ge,pt+lt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Rn.__webglTexture,ge),X!==0?O.blitFramebuffer(Re,Fe,Me,me,Ce,it,Me,me,O.COLOR_BUFFER_BIT,O.NEAREST):at?O.copyTexSubImage3D(Se,ge,Ce,it,pt+lt,Re,Fe,Me,me):O.copyTexSubImage2D(Se,ge,Ce,it,Re,Fe,Me,me);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else at?P.isDataTexture||P.isData3DTexture?O.texSubImage3D(Se,ge,Ce,it,pt,Me,me,be,st,wt,dt.data):B.isCompressedArrayTexture?O.compressedTexSubImage3D(Se,ge,Ce,it,pt,Me,me,be,st,dt.data):O.texSubImage3D(Se,ge,Ce,it,pt,Me,me,be,st,wt,dt):P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,ge,Ce,it,Me,me,st,wt,dt.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,ge,Ce,it,dt.width,dt.height,st,dt.data):O.texSubImage2D(O.TEXTURE_2D,ge,Ce,it,Me,me,st,wt,dt);b.pixelStorei(O.UNPACK_ROW_LENGTH,Ut),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,$e),b.pixelStorei(O.UNPACK_SKIP_PIXELS,zt),b.pixelStorei(O.UNPACK_SKIP_ROWS,nn),b.pixelStorei(O.UNPACK_SKIP_IMAGES,wn),ge===0&&B.generateMipmaps&&O.generateMipmap(Se),b.unbindTexture()},this.initRenderTarget=function(P){G.get(P).__webglFramebuffer===void 0&&$.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?$.setTextureCube(P,0):P.isData3DTexture?$.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?$.setTexture2DArray(P,0):$.setTexture2D(P,0),b.unbindTexture()},this.resetState=function(){z=0,U=0,W=null,b.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}const Ye={gradeContrast:.86,gradeLift:.07,gradeSaturation:.8,gradeWarm:.045,placeholderMode:!0,velocityScale:.012,velocityMax:1,velocityEase:.16,bendPx:0,stretch:0,enterFade:.45,enterZoom:.93,enterEase:.055,smearTaps:5,smearPx:26,ditherAmount:1.2,ditherMinLevels:6,rgbSplitPx:2.4,hoverRadius:.34,hoverStrength:.055,baseBrightness:.86,hoverBrightness:1.06,glassBlurPx:14,glassRefract:62,glassMix:.62,glassTaps:8,rippleRadius:26,rippleStrength:.02,rippleSpeed:2.6,rippleFalloff:3.4,rippleDecay:.965,fallGhostFloor:.2},vg=`
  uniform vec2 uPlaneSize;
  uniform vec2 uVel;
  uniform float uStrength;
  uniform float uBendPx;
  uniform float uStretch;
  uniform float uTurnY; // 弧度，切頁時沿 Y 軸翻轉
  uniform float uTurnX;
  varying vec2 vUv;
  varying float vEdge;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float v = uVel.y * uStrength;
    float edge = abs(pos.x * 2.0);
    vEdge = edge;

    // 幾何預設不動（uBendPx = 0），跟參考站一樣維持矩形。
    // 真要彎的話：中央領先、兩側落後（往行進方向外凸），不是中央下沉。
    if (uBendPx > 0.0) {
      pos.y -= (v * uBendPx * (0.22 + 0.78 * edge * edge)) / max(uPlaneSize.y, 1.0);
      pos.y *= 1.0 + abs(v) * uStretch;
    }

    // 真正的 3D 翻轉：在平面自身座標系旋轉後做透視除法。
    // 只靠 CSS rotateY 沒有用——正交投影下平面只會被水平壓扁，沒有透視。
    if (abs(uTurnY) > 0.0001 || abs(uTurnX) > 0.0001) {
      vec3 q = vec3(pos.x * uPlaneSize.x, pos.y * uPlaneSize.y, 0.0);

      float cy = cos(uTurnY), sy = sin(uTurnY);
      q = vec3(q.x * cy, q.y, -q.x * sy);

      float cx = cos(uTurnX), sx = sin(uTurnX);
      q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);

      float focal = max(uPlaneSize.x, uPlaneSize.y) * 1.35;
      float persp = focal / max(focal - q.z, 1.0);
      pos.x = (q.x * persp) / max(uPlaneSize.x, 1.0);
      pos.y = (q.y * persp) / max(uPlaneSize.y, 1.0);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,Ec=`
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2 uTexSize;
  uniform vec2 uPlaneSize;
  uniform vec2 uVel;
  uniform float uStrength;
  uniform float uOpacity;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uTime;

  uniform float uSmearPx;
  uniform float uRgbSplitPx;
  uniform float uDitherAmount;
  uniform float uDitherMinLevels;
  uniform float uHoverRadius;
  uniform float uHoverStrength;
  uniform float uBaseBrightness;
  uniform vec4 uGrade; // x:對比 y:黑位 z:飽和 w:暖偏（w<0 表示不套用）
  uniform float uHoverBrightness;
  uniform float uEnter; // 0 = 剛切到這一頁，1 = 定位完成
  uniform float uEnterFade;
  uniform float uEnterZoom;
  uniform float uGray; // 1 = 全灰階
  uniform float uAlphaMul; // 整體透明度倍率

  varying vec2 vUv;
  varying float vEdge;

  // ---- 滑鼠水波（共用）----
  uniform vec2 uRes;
  uniform vec2 uMouseN; // 0~1 螢幕座標
  uniform float uRippleAmp; // 停手後衰減到 0
  uniform float uRippleRadius;
  uniform float uRippleStrength;
  uniform float uRippleSpeed;
  uniform float uRippleFalloff;

  vec2 rippleOffset(vec2 p, float t) {
    vec2 d = p - uMouseN;
    d.x *= uRes.x / max(uRes.y, 1.0);
    float r = length(d);
    float w = sin(r * uRippleRadius - t * uRippleSpeed) * exp(-r * uRippleFalloff) * uRippleStrength * uRippleAmp;
    return normalize(d + vec2(1e-5)) * w;
  }

  const int SMEAR_TAPS = ${Ye.smearTaps};

  // 4x4 ordered dither (Bayer)
  float bayer(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int i = x + y * 4;
    float m[16];
    m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
    m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
    m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
    m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
    float v = 0.0;
    for (int k = 0; k < 16; k++) {
      if (k == i) v = m[k];
    }
    return v / 16.0;
  }

  // 貼圖標成 sRGB，GPU 取樣時會轉成 linear；自訂 ShaderMaterial 不會幫你轉回去，
  // 少了這步中間調會整片被壓暗（白色不受影響，所以只有色塊會看起來黑黑的）。
  vec3 linearToSrgb(vec3 c) {
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  // cover fit：不管圖多長多寬都填滿佔位框、不變形
  vec2 coverUv(vec2 uv) {
    float planeRatio = uPlaneSize.x / max(uPlaneSize.y, 1.0);
    float texRatio = uTexSize.x / max(uTexSize.y, 1.0);
    vec2 scale = vec2(1.0);
    if (planeRatio > texRatio) {
      scale.y = texRatio / planeRatio;
    } else {
      scale.x = planeRatio / texRatio;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    // uVel.y = 垂直切頁速度、uVel.x = 作品橫推速度
    vec2 v2 = uVel * uStrength;
    float amt = clamp(length(v2), 0.0, 1.0);
    vec2 planeSize = max(uPlaneSize, vec2(1.0));

    vec2 uv = coverUv(vUv);

    // 切頁進場：貼圖先略放大，再收回原尺寸
    uv = (uv - 0.5) * mix(uEnterZoom, 1.0, uEnter) + 0.5;

    // hover：游標附近的液態位移
    float d = distance(vUv, uMouse);
    float ripple = smoothstep(uHoverRadius, 0.0, d) * uHover;
    uv += normalize(vUv - uMouse + 0.0001) * ripple * uHoverStrength * (0.7 + 0.3 * sin(uTime * 2.0 + d * 18.0));

    // 拖影：沿著滾動方向多取幾次樣
    vec3 col = vec3(0.0);
    float total = 0.0;
    for (int i = 0; i < SMEAR_TAPS; i++) {
      float t = float(i) / float(SMEAR_TAPS - 1);
      float w = 1.0 - t * 0.72;
      vec2 off = v2 * (uSmearPx / planeSize) * t;
      col += texture2D(uTex, uv + off).rgb * w;
      total += w;
    }
    col /= max(total, 0.0001);

    // 色差：速度越快越明顯
    if (amt > 0.001) {
      vec2 sp = v2 * (uRgbSplitPx / planeSize);
      col.r = texture2D(uTex, uv + sp).r;
      col.b = texture2D(uTex, uv - sp).b;
    }

    col *= mix(uBaseBrightness, uHoverBrightness, uHover);

    // 進場／退場：進畫面時暗，定位後提亮
    col *= mix(uEnterFade, 1.0, uEnter);

    // linear → sRGB，之後的 dither 才是在顯示空間做量化
    col = linearToSrgb(col);

    // 色彩統一（霧面膠片）：壓對比 → 抬黑位 → 收飽和 → 輕微暖偏
    if (uGrade.w >= 0.0) {
      col = (col - 0.5) * uGrade.x + 0.5;
      col = col * (1.0 - uGrade.y) + uGrade.y;
      float g = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(g), col, uGrade.z);
      col.r *= 1.0 + uGrade.w;
      col.b *= 1.0 - uGrade.w * 1.22;
      col = clamp(col, 0.0, 1.0);
    }

    // 點陣 dither：靜止時 256 階（看不出來），滾動時掉到 4 階（明顯點陣）
    float levels = mix(255.0, uDitherMinLevels, clamp(amt * uDitherAmount, 0.0, 1.0));
    float th = bayer(gl_FragCoord.xy) - 0.5;
    col = floor(col * levels + th * clamp(amt * uDitherAmount, 0.0, 1.0) * 1.6 + 0.5) / levels;

    // 灰階（離開第一頁後的掉落物）
    if (uGray > 0.001) {
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, vec3(luma), uGray);
    }

    float alpha = texture2D(uTex, uv).a * uOpacity * uAlphaMul;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`,El=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,xg=`
  precision highp float;
  uniform float uTime;
  uniform float uBlueMix;
  varying vec2 vUv;

  // ---- 滑鼠水波（共用）----
  uniform vec2 uRes;
  uniform vec2 uMouseN; // 0~1 螢幕座標
  uniform float uRippleAmp; // 停手後衰減到 0
  uniform float uRippleRadius;
  uniform float uRippleStrength;
  uniform float uRippleSpeed;
  uniform float uRippleFalloff;

  vec2 rippleOffset(vec2 p, float t) {
    vec2 d = p - uMouseN;
    d.x *= uRes.x / max(uRes.y, 1.0);
    float r = length(d);
    float w = sin(r * uRippleRadius - t * uRippleSpeed) * exp(-r * uRippleFalloff) * uRippleStrength * uRippleAmp;
    return normalize(d + vec2(1e-5)) * w;
  }

  // ---- value noise / fbm：光帶要寬窄不一才像光，正弦波永遠等距 ----
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c) * p;
  }

  void main() {
    vec2 uv = vUv + rippleOffset(vUv, uTime);
    vec2 p = uv * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

    // 取樣自參考站截圖：底 rgb(6,20,74)、最亮處 rgb(7,22,97)
    vec3 deep = vec3(0.024, 0.078, 0.290);
    vec3 lit = vec3(0.035, 0.105, 0.520);

    // 主層光帶：轉 28°、沿光線方向拉長 1:8，極慢平移
    vec2 q1 = rot(p, 0.4887) * vec2(1.0, 8.0);
    float shaft1 = fbm(q1 * 2.4 + vec2(uTime * 0.010, 0.0));

    // 副層：15°、更細，權重較低
    vec2 q2 = rot(p, 0.2618) * vec2(1.0, 5.0);
    float shaft2 = fbm(q2 * 4.6 - vec2(uTime * 0.006, 0.0));

    float shafts = clamp(shaft1 * 0.75 + shaft2 * 0.40, 0.0, 1.0);
    shafts = pow(shafts, 1.6); // 拉開對比，光帶之間要有暗的地方

    vec3 col = mix(deep, lit, shafts * 0.42);

    // 左上較亮，往右下衰減
    float dir = clamp(1.0 - (uv.x * 0.5 + (1.0 - uv.y) * 0.5), 0.0, 1.0);
    col += lit * dir * 0.05;

    // 暗角：四角壓暗約 12%
    float vig = 1.0 - 0.12 * pow(clamp(length((uv - 0.5) * vec2(1.1, 1.0)) * 1.6, 0.0, 1.0), 2.0);
    col *= vig;

    // 細噪點：蓋掉大面積漸層的色帶，順便呼應貼紙的印刷顆粒
    float g = hash21(gl_FragCoord.xy + fract(uTime) * 13.0);
    col += (g - 0.5) * 0.008;

    // 藍→黑直接混色，不用 alpha 淡出。
    // 走 alpha 的話會經過離屏貼圖再合成，0.18 的藍會被吃掉（實測畫面仍是純黑）
    vec3 ink = vec3(0.031, 0.035, 0.035);
    gl_FragColor = vec4(mix(ink, col, uBlueMix), 1.0);
  }
`,_g=Ec.replace("uniform float uEnterZoom;",`uniform float uEnterZoom;
  uniform sampler2D uScene;
  uniform float uGlassBlurPx;
  uniform float uGlassRefract;
  uniform float uGlassMix;
  uniform float uIntroGlass;`).replace("gl_FragColor = vec4(col, alpha);",`
    // 毛玻璃：用自身亮度梯度當法線做折射，再對後方畫面做環形模糊
    vec2 sUv = gl_FragCoord.xy / uRes;
    sUv += rippleOffset(sUv, uTime) * 0.6;

    float stepPx = 2.0 / max(uTexSize.x, 1.0);
    vec4 c0 = texture2D(uTex, uv);
    vec4 cx = texture2D(uTex, uv + vec2(stepPx, 0.0));
    vec4 cy = texture2D(uTex, uv + vec2(0.0, stepPx));
    float l0 = dot(c0.rgb, vec3(0.299, 0.587, 0.114)) * c0.a;
    float lx = dot(cx.rgb, vec3(0.299, 0.587, 0.114)) * cx.a;
    float ly = dot(cy.rgb, vec3(0.299, 0.587, 0.114)) * cy.a;
    vec2 refr = vec2(lx - l0, ly - l0) * uGlassRefract / uRes;

    vec3 back = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float ang = float(i) * 0.7853981634;
      vec2 off = vec2(cos(ang), sin(ang)) * (uGlassBlurPx / uRes);
      back += texture2D(uScene, sUv + refr + off).rgb;
    }
    back /= 8.0;

    // 高光保留不透，其餘讓後面透出來
    float hi = smoothstep(0.52, 0.95, dot(col, vec3(0.299, 0.587, 0.114)));
    float m = mix(uGlassMix, 1.0, hi);
    vec3 outCol = mix(back, col, m);
    float ik = clamp(uIntroGlass, 0.0, 1.0);
    outCol *= mix(0.22, 1.0, ik);
    float ilev = mix(2.0, 255.0, ik * ik);
    float ith = bayer(gl_FragCoord.xy) - 0.5;
    outCol = floor(outCol * ilev + ith * (1.0 - ik) * 1.8 + 0.5) / ilev;
    gl_FragColor = vec4(outCol, alpha * mix(0.35, 1.0, ik));
  `);function Sg(i,e,t){const r=Math.min(window.devicePixelRatio||1,2),s=Math.max(2,Math.round(e)),n=Math.max(2,Math.round(t)),a=document.createElement("canvas");a.width=Math.round(s*r),a.height=Math.round(n*r);const l=a.getContext("2d");l.scale(r,r);const c=i.dataset.glColor||"#16305e",f=i.dataset.glLabel||"IMAGE",h=i.dataset.glRatio||"";l.fillStyle=c,l.fillRect(0,0,s,n),l.save(),l.strokeStyle="rgba(255,255,255,0.05)",l.lineWidth=1;for(let g=-n;g<s;g+=16)l.beginPath(),l.moveTo(g,0),l.lineTo(g+n,n),l.stroke();l.restore(),l.strokeStyle="rgba(255,255,255,0.28)",l.lineWidth=1,l.strokeRect(.5,.5,s-1,n-1);const m=Math.min(22,s*.08);l.strokeStyle="rgba(255,255,255,0.55)",l.lineWidth=1.5,[[0,0,1,1],[s,0,-1,1],[0,n,1,-1],[s,n,-1,-1]].forEach(([g,E,A,M])=>{l.beginPath(),l.moveTo(g+A*2,E+M*2),l.lineTo(g+A*m,E+M*2),l.moveTo(g+A*2,E+M*2),l.lineTo(g+A*2,E+M*m),l.stroke()}),l.strokeStyle="rgba(255,255,255,0.12)",l.lineWidth=1,l.beginPath(),l.moveTo(0,0),l.lineTo(s,n),l.moveTo(s,0),l.lineTo(0,n),l.stroke();const u=Math.max(11,Math.min(26,s*.032));l.textAlign="center",l.textBaseline="middle";const o='"SFMono-Regular", ui-monospace, Consolas, monospace',d=s/2,v=n/2;l.fillStyle="rgba(255,255,255,0.62)",l.font=`${u*.78}px ${o}`,l.fillText(f,d,v-u*1.9),l.fillStyle="#fff",l.font=`700 ${u*1.7}px ${o}`,l.fillText(`${s} × ${n}`,d,v),l.fillStyle="rgba(255,255,255,0.58)",l.font=`${u*.78}px ${o}`,l.fillText(`@2x  ${s*2} × ${n*2}`,d,v+u*1.6),h&&(l.fillStyle="rgba(255,255,255,0.4)",l.font=`${u*.72}px ${o}`,l.fillText(`RATIO ${h.replace("/",":")}`,d,v+u*2.9));const p=new af(a);return p.colorSpace=Dt,p.minFilter=vt,p.magFilter=vt,p.generateMipmaps=!1,p}const Mg=i=>i<0?0:i>1?1:i,yg=i=>i*i*(3-2*i);function Eg(i){let e;try{e=new gg({canvas:i,alpha:!0,antialias:!0,powerPreference:"high-performance"})}catch(ne){return console.warn("[gl] WebGL 建立失敗，退回 DOM 佔位框",ne),document.documentElement.classList.add("gl-fallback"),null}e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.setClearColor(0,0),e.autoClear=!1;const t=new _s,r=new _s,s=new _s,n=new Ja(-1,1,1,-1,-2e3,2e3),a=new xf,l=new Oi(1,1,40,40),c=new Oi(1,1);let f=null;const h=()=>({uRes:{value:new He(1,1)},uMouseN:{value:new He(.5,.5)},uRippleAmp:{value:0},uRippleRadius:{value:Ye.rippleRadius},uRippleStrength:{value:Ye.rippleStrength},uRippleSpeed:{value:Ye.rippleSpeed},uRippleFalloff:{value:Ye.rippleFalloff}}),m=new Bt({vertexShader:El,fragmentShader:xg,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uBlueMix:{value:1},...h()}}),u=new Wt(c,m);u.frustumCulled=!1,u.renderOrder=-1e3,t.add(u);const o=new Bt({transparent:!0,depthTest:!1,depthWrite:!1,blending:zl,blendSrc:Hl,blendDst:kr,uniforms:{uTex:{value:null},uIntro:{value:0}},vertexShader:El,fragmentShader:`
      precision highp float;
      uniform sampler2D uTex;
      uniform float uIntro; // 0 = 全點陣、暗；1 = 正常
      varying vec2 vUv;

      float bayer(vec2 p) {
        int x = int(mod(p.x, 4.0));
        int y = int(mod(p.y, 4.0));
        int i = x + y * 4;
        float m[16];
        m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
        m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
        m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
        m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
        float v = 0.0;
        for (int k = 0; k < 16; k++) { if (k == i) v = m[k]; }
        return v / 16.0;
      }

      void main() {
        vec4 c = texture2D(uTex, vUv);
        // 開場：從粗點陣 + 壓暗，溶解成正常畫面
        float k = clamp(uIntro, 0.0, 1.0);
        c.rgb *= mix(0.22, 1.0, k);
        float levels = mix(2.0, 255.0, k * k);
        float th = bayer(gl_FragCoord.xy) - 0.5;
        c.rgb = floor(c.rgb * levels + th * (1.0 - k) * 1.8 + 0.5) / levels;
        c.a *= mix(0.35, 1.0, k);
        gl_FragColor = c;
      }
    `}),d=new Wt(c,o);d.frustumCulled=!1,s.add(d);const v=[];let p=0,g=0;const E=new He(.5,.5);let A=0,M=1,_=1,S=0;window.addEventListener("pointermove",ne=>{E.set((ne.clientX-x)/Math.max(p,1),1-ne.clientY/Math.max(g,1)),A=1});const T=1920;let x=0;const y={x:0,y:0};function w(){x=Math.max(0,(window.innerWidth-T)/2),p=Math.min(window.innerWidth,T),g=window.innerHeight,e.setSize(p,g,!1);const ne=e.getPixelRatio();f&&f.dispose(),f=new Qt(Math.max(1,Math.round(p*ne)),Math.max(1,Math.round(g*ne)),{minFilter:vt,magFilter:vt,format:kt}),o.uniforms.uTex.value=f.texture,u.scale.set(p,g,1),d.scale.set(p,g,1),m.uniforms.uRes.value.set(p,g);for(const H of v)H.material.uniforms.uRes&&H.material.uniforms.uRes.value.set(p,g);n.left=-p/2,n.right=p/2,n.top=g/2,n.bottom=-g/2,n.updateProjectionMatrix()}function R(ne){const H=ne.dataset.glSrc;if(!H)return;const ee=ne.closest("[data-gl-clip]"),J="glGlass"in ne.dataset,ye=new Bt({vertexShader:vg,fragmentShader:J?_g:Ec,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uTex:{value:null},uTexSize:{value:new He(1,1)},uPlaneSize:{value:new He(1,1)},uVel:{value:new He(0,0)},uStrength:{value:parseFloat(ne.dataset.glStrength||"1")},uOpacity:{value:0},uHover:{value:0},uMouse:{value:new He(.5,.5)},uTime:{value:0},uBendPx:{value:Ye.bendPx},uTurnY:{value:0},uTurnX:{value:0},uStretch:{value:Ye.stretch},uSmearPx:{value:Ye.smearPx},uRgbSplitPx:{value:Ye.rgbSplitPx},uDitherAmount:{value:Ye.ditherAmount},uDitherMinLevels:{value:Ye.ditherMinLevels},uHoverRadius:{value:Ye.hoverRadius},uHoverStrength:{value:Ye.hoverStrength},uBaseBrightness:{value:Ye.baseBrightness},uGrade:{value:new ft(1,0,1,-1)},uHoverBrightness:{value:Ye.hoverBrightness},uEnter:{value:0},uEnterFade:{value:Ye.enterFade},uEnterZoom:{value:Ye.enterZoom},uGray:{value:0},uAlphaMul:{value:1},uScene:{value:null},uGlassBlurPx:{value:Ye.glassBlurPx},uGlassRefract:{value:Ye.glassRefract},uGlassMix:{value:Ye.glassMix},uIntroGlass:{value:0},...h()}}),Ee=new Wt(l,ye);Ee.frustumCulled=!1,Ee.visible=!1,Ee.renderOrder=ne.classList.contains("fall-img")?-500+v.length:parseInt(ne.dataset.glOrder||"0",10)*1e3+v.length,(J?r:t).add(Ee);const xe={el:ne,section:ne.closest(".section"),slide:ne.closest(".life-slide"),clipEl:ee,isFall:ne.classList.contains("fall-img"),isGlass:J,gray:0,mesh:Ee,material:ye,loaded:!1,hover:0,hoverTarget:0,enter:0,enterTarget:0,mouse:new He(.5,.5),placeholder:Ye.placeholderMode&&!("glReal"in ne.dataset),graded:!!ne.closest(".life"),phW:0,phH:0};if(v.push(xe),xe.placeholder){C(ne,xe);return}a.load(H,re=>{re.colorSpace=Dt,re.minFilter=zn,re.magFilter=vt,re.wrapS=Jt,re.wrapT=Jt,re.generateMipmaps=!0,ye.uniforms.uTex.value=re,ye.uniforms.uTexSize.value.set(re.image.width,re.image.height),xe.loaded=!0},void 0,re=>{console.warn("[gl] 圖片載入失敗："+H,re),ne.classList.add("gl-missing")}),C(ne,xe)}function C(ne,H){ne.addEventListener("pointerenter",()=>{H.hoverTarget=1}),ne.addEventListener("pointerleave",()=>{H.hoverTarget=0}),ne.addEventListener("pointermove",ee=>{const J=ne.getBoundingClientRect();H.mouse.set((ee.clientX-J.left)/J.width,1-(ee.clientY-J.top)/J.height)})}function D(){document.querySelectorAll(".gl-image[data-gl-src]").forEach(ne=>{v.some(H=>H.el===ne)||R(ne)})}function N(ne,H,ee=0){const J=re=>{const _e=re*Ye.velocityScale;return Math.max(-Ye.velocityMax,Math.min(Ye.velocityMax,_e))};y.y+=(J(ne)-y.y)*Ye.velocityEase,y.x+=(J(ee)-y.x)*Ye.velocityEase;for(const re of v){const _e=re.el.getBoundingClientRect();let We=_e.bottom>-g*.35&&_e.top<g*1.35&&_e.width>0&&_e.height>0;if(We&&re.clipEl){const Xe=re.clipEl.getBoundingClientRect();(_e.right<=Xe.left+1||_e.left>=Xe.right-1)&&(We=!1)}if(re.placeholder&&We){const Xe=Math.round(re.el.offsetWidth||_e.width),nt=Math.round(re.el.offsetHeight||_e.height);if(Xe!==re.phW||nt!==re.phH){const O=re.material.uniforms.uTex.value;O&&O.dispose();const St=Sg(re.el,Xe,nt);re.material.uniforms.uTex.value=St,re.material.uniforms.uTexSize.value.set(Xe,nt),re.phW=Xe,re.phH=nt,re.loaded=!0}}if(!We||!re.loaded){re.mesh.visible=!1;continue}re.mesh.visible=!0;const Ve=new DOMMatrixReadOnly(getComputedStyle(re.el).transform),Be=Math.hypot(Ve.a,Ve.b)||1,ct=Math.atan2(Ve.b,Ve.a),ut=(re.el.offsetWidth||_e.width)*Be,je=(re.el.offsetHeight||_e.height)*Be;re.mesh.scale.set(ut,je,1),re.mesh.rotation.z=-ct,re.mesh.position.set(_e.left-x+_e.width/2-p/2,-(_e.top+_e.height/2)+g/2,0);const Ze=re.material.uniforms;re.graded&&Ze.uGrade.value.set(Ye.gradeContrast,Ye.gradeLift,Ye.gradeSaturation,Ye.gradeWarm),Ze.uPlaneSize.value.set(_e.width,_e.height),Ze.uVel.value.set(y.x,y.y),Ze.uTime.value=H,Ze.uOpacity.value=Math.min(1,Ze.uOpacity.value+.06),re.enter+=(re.enterTarget-re.enter)*Ye.enterEase,Ze.uEnter.value=yg(Mg(re.enter)),re.isFall&&(re.gray+=(U-re.gray)*.12,Ze.uGray.value=re.gray,Ze.uAlphaMul.value=1-re.gray*(1-Ye.fallGhostFloor)),re.hover+=(re.hoverTarget-re.hover)*.12,Ze.uHover.value=re.hover,Ze.uMouse.value.lerp(re.mouse,.16)}const ye=S?Math.min(.05,H-S):.016;W+=(K-W)*(1-Math.exp(-ye*4.2)),ie+=(se-ie)*(1-Math.exp(-ye*4)),A*=Ye.rippleDecay;const Ee=H;m.uniforms.uTime.value=Ee;const xe=S?Math.min(.05,H-S):.016;S=H,M+=(_-M)*(1-Math.exp(-xe*14)),Math.abs(_-M)<.002&&(M=_),m.uniforms.uBlueMix.value=M,m.uniforms.uMouseN.value.copy(E),m.uniforms.uRippleAmp.value=A,u.visible=!0;for(const re of v){const _e=re.material.uniforms;_e.uMouseN&&(_e.uMouseN.value.copy(E),_e.uRippleAmp.value=re.isGlass?A:0,_e.uRes.value.set(p,g)),re.isGlass&&f&&(_e.uScene.value=f.texture),_e.uTurnY&&re.el.classList.contains("hero-hello")&&(_e.uTurnY.value=W*1.4,_e.uTurnX.value=W*-.04,_e.uAlphaMul.value=ie)}e.setRenderTarget(f),e.clear(!0,!0,!0),e.render(t,n),e.setRenderTarget(null),e.clear(!0,!0,!0),e.render(s,n),e.render(r,n)}w(),D(),window.addEventListener("resize",w);let I=null,z=null,U=0,W=0,K=0,ie=0,se=1;function oe(ne){U=Math.max(0,Math.min(1,typeof ne=="number"?ne:ne?1:0))}function De(ne,H=null){if(!(I===ne&&z===H)){I=ne,z=H;for(const ee of v){const J=ee.isFall||ee.section===ne&&(!ee.slide||ee.slide===H);J&&ee.enterTarget!==1&&(ee.enter=0),ee.enterTarget=J?1:0,J||(ee.enter=0)}}}function qe(ne){const H=v.findIndex(ye=>ye.el===ne);if(H<0)return;const ee=v[H];(ee.isGlass?r:t).remove(ee.mesh);const J=ee.material.uniforms.uTex.value;J&&J.dispose(),ee.material.dispose(),v.splice(H,1)}return{update:N,resize:w,scan:D,removeItem:qe,setActive:De,setFallGhost:oe,setTurn(ne){K=ne},setTurnNow(ne){W=ne,K=ne},setHeroFade(ne){se=ne},setHeroFadeNow(ne){ie=ne,se=ne},setBlueMix(ne){_=ne},get blueMix(){return M},setIntro(ne){o.uniforms.uIntro.value=ne;for(const H of v)H.isGlass&&(H.material.uniforms.uIntroGlass.value=ne)},get velocity(){return y.y},get velocity2(){return y},items:v}}var Tl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Vr={exports:{}};var Tg=Vr.exports,bl;function bg(){return bl||(bl=1,(function(i,e){(function(r,s){i.exports=s()})(Tg,function(){return(function(t){var r={};function s(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,s),a.l=!0,a.exports}return s.m=t,s.c=r,s.d=function(n,a,l){s.o(n,a)||Object.defineProperty(n,a,{enumerable:!0,get:l})},s.r=function(n){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},s.t=function(n,a){if(a&1&&(n=s(n)),a&8||a&4&&typeof n=="object"&&n&&n.__esModule)return n;var l=Object.create(null);if(s.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:n}),a&2&&typeof n!="string")for(var c in n)s.d(l,c,(function(f){return n[f]}).bind(null,c));return l},s.n=function(n){var a=n&&n.__esModule?function(){return n.default}:function(){return n};return s.d(a,"a",a),a},s.o=function(n,a){return Object.prototype.hasOwnProperty.call(n,a)},s.p="",s(s.s=20)})([(function(t,r){var s={};t.exports=s,(function(){s._baseDelta=1e3/60,s._nextId=0,s._seed=0,s._nowStartTime=+new Date,s._warnedOnce={},s._decomp=null,s.extend=function(a,l){var c,f;typeof l=="boolean"?(c=2,f=l):(c=1,f=!0);for(var h=c;h<arguments.length;h++){var m=arguments[h];if(m)for(var u in m)f&&m[u]&&m[u].constructor===Object&&(!a[u]||a[u].constructor===Object)?(a[u]=a[u]||{},s.extend(a[u],f,m[u])):a[u]=m[u]}return a},s.clone=function(a,l){return s.extend({},l,a)},s.keys=function(a){if(Object.keys)return Object.keys(a);var l=[];for(var c in a)l.push(c);return l},s.values=function(a){var l=[];if(Object.keys){for(var c=Object.keys(a),f=0;f<c.length;f++)l.push(a[c[f]]);return l}for(var h in a)l.push(a[h]);return l},s.get=function(a,l,c,f){l=l.split(".").slice(c,f);for(var h=0;h<l.length;h+=1)a=a[l[h]];return a},s.set=function(a,l,c,f,h){var m=l.split(".").slice(f,h);return s.get(a,l,0,-1)[m[m.length-1]]=c,c},s.shuffle=function(a){for(var l=a.length-1;l>0;l--){var c=Math.floor(s.random()*(l+1)),f=a[l];a[l]=a[c],a[c]=f}return a},s.choose=function(a){return a[Math.floor(s.random()*a.length)]},s.isElement=function(a){return typeof HTMLElement<"u"?a instanceof HTMLElement:!!(a&&a.nodeType&&a.nodeName)},s.isArray=function(a){return Object.prototype.toString.call(a)==="[object Array]"},s.isFunction=function(a){return typeof a=="function"},s.isPlainObject=function(a){return typeof a=="object"&&a.constructor===Object},s.isString=function(a){return toString.call(a)==="[object String]"},s.clamp=function(a,l,c){return a<l?l:a>c?c:a},s.sign=function(a){return a<0?-1:1},s.now=function(){if(typeof window<"u"&&window.performance){if(window.performance.now)return window.performance.now();if(window.performance.webkitNow)return window.performance.webkitNow()}return Date.now?Date.now():new Date-s._nowStartTime},s.random=function(a,l){return a=typeof a<"u"?a:0,l=typeof l<"u"?l:1,a+n()*(l-a)};var n=function(){return s._seed=(s._seed*9301+49297)%233280,s._seed/233280};s.colorToNumber=function(a){return a=a.replace("#",""),a.length==3&&(a=a.charAt(0)+a.charAt(0)+a.charAt(1)+a.charAt(1)+a.charAt(2)+a.charAt(2)),parseInt(a,16)},s.logLevel=1,s.log=function(){console&&s.logLevel>0&&s.logLevel<=3&&console.log.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},s.info=function(){console&&s.logLevel>0&&s.logLevel<=2&&console.info.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},s.warn=function(){console&&s.logLevel>0&&s.logLevel<=3&&console.warn.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},s.warnOnce=function(){var a=Array.prototype.slice.call(arguments).join(" ");s._warnedOnce[a]||(s.warn(a),s._warnedOnce[a]=!0)},s.deprecated=function(a,l,c){a[l]=s.chain(function(){s.warnOnce("🔅 deprecated 🔅",c)},a[l])},s.nextId=function(){return s._nextId++},s.indexOf=function(a,l){if(a.indexOf)return a.indexOf(l);for(var c=0;c<a.length;c++)if(a[c]===l)return c;return-1},s.map=function(a,l){if(a.map)return a.map(l);for(var c=[],f=0;f<a.length;f+=1)c.push(l(a[f]));return c},s.topologicalSort=function(a){var l=[],c=[],f=[];for(var h in a)!c[h]&&!f[h]&&s._topologicalSort(h,c,f,a,l);return l},s._topologicalSort=function(a,l,c,f,h){var m=f[a]||[];c[a]=!0;for(var u=0;u<m.length;u+=1){var o=m[u];c[o]||l[o]||s._topologicalSort(o,l,c,f,h)}c[a]=!1,l[a]=!0,h.push(a)},s.chain=function(){for(var a=[],l=0;l<arguments.length;l+=1){var c=arguments[l];c._chained?a.push.apply(a,c._chained):a.push(c)}var f=function(){for(var h,m=new Array(arguments.length),u=0,o=arguments.length;u<o;u++)m[u]=arguments[u];for(u=0;u<a.length;u+=1){var d=a[u].apply(h,m);typeof d<"u"&&(h=d)}return h};return f._chained=a,f},s.chainPathBefore=function(a,l,c){return s.set(a,l,s.chain(c,s.get(a,l)))},s.chainPathAfter=function(a,l,c){return s.set(a,l,s.chain(s.get(a,l),c))},s.setDecomp=function(a){s._decomp=a},s.getDecomp=function(){var a=s._decomp;try{!a&&typeof window<"u"&&(a=window.decomp),!a&&typeof Tl<"u"&&(a=Tl.decomp)}catch{a=null}return a}})()}),(function(t,r){var s={};t.exports=s,(function(){s.create=function(n){var a={min:{x:0,y:0},max:{x:0,y:0}};return n&&s.update(a,n),a},s.update=function(n,a,l){n.min.x=1/0,n.max.x=-1/0,n.min.y=1/0,n.max.y=-1/0;for(var c=0;c<a.length;c++){var f=a[c];f.x>n.max.x&&(n.max.x=f.x),f.x<n.min.x&&(n.min.x=f.x),f.y>n.max.y&&(n.max.y=f.y),f.y<n.min.y&&(n.min.y=f.y)}l&&(l.x>0?n.max.x+=l.x:n.min.x+=l.x,l.y>0?n.max.y+=l.y:n.min.y+=l.y)},s.contains=function(n,a){return a.x>=n.min.x&&a.x<=n.max.x&&a.y>=n.min.y&&a.y<=n.max.y},s.overlaps=function(n,a){return n.min.x<=a.max.x&&n.max.x>=a.min.x&&n.max.y>=a.min.y&&n.min.y<=a.max.y},s.translate=function(n,a){n.min.x+=a.x,n.max.x+=a.x,n.min.y+=a.y,n.max.y+=a.y},s.shift=function(n,a){var l=n.max.x-n.min.x,c=n.max.y-n.min.y;n.min.x=a.x,n.max.x=a.x+l,n.min.y=a.y,n.max.y=a.y+c}})()}),(function(t,r){var s={};t.exports=s,(function(){s.create=function(n,a){return{x:n||0,y:a||0}},s.clone=function(n){return{x:n.x,y:n.y}},s.magnitude=function(n){return Math.sqrt(n.x*n.x+n.y*n.y)},s.magnitudeSquared=function(n){return n.x*n.x+n.y*n.y},s.rotate=function(n,a,l){var c=Math.cos(a),f=Math.sin(a);l||(l={});var h=n.x*c-n.y*f;return l.y=n.x*f+n.y*c,l.x=h,l},s.rotateAbout=function(n,a,l,c){var f=Math.cos(a),h=Math.sin(a);c||(c={});var m=l.x+((n.x-l.x)*f-(n.y-l.y)*h);return c.y=l.y+((n.x-l.x)*h+(n.y-l.y)*f),c.x=m,c},s.normalise=function(n){var a=s.magnitude(n);return a===0?{x:0,y:0}:{x:n.x/a,y:n.y/a}},s.dot=function(n,a){return n.x*a.x+n.y*a.y},s.cross=function(n,a){return n.x*a.y-n.y*a.x},s.cross3=function(n,a,l){return(a.x-n.x)*(l.y-n.y)-(a.y-n.y)*(l.x-n.x)},s.add=function(n,a,l){return l||(l={}),l.x=n.x+a.x,l.y=n.y+a.y,l},s.sub=function(n,a,l){return l||(l={}),l.x=n.x-a.x,l.y=n.y-a.y,l},s.mult=function(n,a){return{x:n.x*a,y:n.y*a}},s.div=function(n,a){return{x:n.x/a,y:n.y/a}},s.perp=function(n,a){return a=a===!0?-1:1,{x:a*-n.y,y:a*n.x}},s.neg=function(n){return{x:-n.x,y:-n.y}},s.angle=function(n,a){return Math.atan2(a.y-n.y,a.x-n.x)},s._temp=[s.create(),s.create(),s.create(),s.create(),s.create(),s.create()]})()}),(function(t,r,s){var n={};t.exports=n;var a=s(2),l=s(0);(function(){n.create=function(c,f){for(var h=[],m=0;m<c.length;m++){var u=c[m],o={x:u.x,y:u.y,index:m,body:f,isInternal:!1};h.push(o)}return h},n.fromPath=function(c,f){var h=/L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig,m=[];return c.replace(h,function(u,o,d){m.push({x:parseFloat(o),y:parseFloat(d)})}),n.create(m,f)},n.centre=function(c){for(var f=n.area(c,!0),h={x:0,y:0},m,u,o,d=0;d<c.length;d++)o=(d+1)%c.length,m=a.cross(c[d],c[o]),u=a.mult(a.add(c[d],c[o]),m),h=a.add(h,u);return a.div(h,6*f)},n.mean=function(c){for(var f={x:0,y:0},h=0;h<c.length;h++)f.x+=c[h].x,f.y+=c[h].y;return a.div(f,c.length)},n.area=function(c,f){for(var h=0,m=c.length-1,u=0;u<c.length;u++)h+=(c[m].x-c[u].x)*(c[m].y+c[u].y),m=u;return f?h/2:Math.abs(h)/2},n.inertia=function(c,f){for(var h=0,m=0,u=c,o,d,v=0;v<u.length;v++)d=(v+1)%u.length,o=Math.abs(a.cross(u[d],u[v])),h+=o*(a.dot(u[d],u[d])+a.dot(u[d],u[v])+a.dot(u[v],u[v])),m+=o;return f/6*(h/m)},n.translate=function(c,f,h){h=typeof h<"u"?h:1;var m=c.length,u=f.x*h,o=f.y*h,d;for(d=0;d<m;d++)c[d].x+=u,c[d].y+=o;return c},n.rotate=function(c,f,h){if(f!==0){var m=Math.cos(f),u=Math.sin(f),o=h.x,d=h.y,v=c.length,p,g,E,A;for(A=0;A<v;A++)p=c[A],g=p.x-o,E=p.y-d,p.x=o+(g*m-E*u),p.y=d+(g*u+E*m);return c}},n.contains=function(c,f){for(var h=f.x,m=f.y,u=c.length,o=c[u-1],d,v=0;v<u;v++){if(d=c[v],(h-o.x)*(d.y-o.y)+(m-o.y)*(o.x-d.x)>0)return!1;o=d}return!0},n.scale=function(c,f,h,m){if(f===1&&h===1)return c;m=m||n.centre(c);for(var u,o,d=0;d<c.length;d++)u=c[d],o=a.sub(u,m),c[d].x=m.x+o.x*f,c[d].y=m.y+o.y*h;return c},n.chamfer=function(c,f,h,m,u){typeof f=="number"?f=[f]:f=f||[8],h=typeof h<"u"?h:-1,m=m||2,u=u||14;for(var o=[],d=0;d<c.length;d++){var v=c[d-1>=0?d-1:c.length-1],p=c[d],g=c[(d+1)%c.length],E=f[d<f.length?d:f.length-1];if(E===0){o.push(p);continue}var A=a.normalise({x:p.y-v.y,y:v.x-p.x}),M=a.normalise({x:g.y-p.y,y:p.x-g.x}),_=Math.sqrt(2*Math.pow(E,2)),S=a.mult(l.clone(A),E),T=a.normalise(a.mult(a.add(A,M),.5)),x=a.sub(p,a.mult(T,_)),y=h;h===-1&&(y=Math.pow(E,.32)*1.75),y=l.clamp(y,m,u),y%2===1&&(y+=1);for(var w=Math.acos(a.dot(A,M)),R=w/y,C=0;C<y;C++)o.push(a.add(a.rotate(S,R*C),x))}return o},n.clockwiseSort=function(c){var f=n.mean(c);return c.sort(function(h,m){return a.angle(f,h)-a.angle(f,m)}),c},n.isConvex=function(c){var f=0,h=c.length,m,u,o,d;if(h<3)return null;for(m=0;m<h;m++)if(u=(m+1)%h,o=(m+2)%h,d=(c[u].x-c[m].x)*(c[o].y-c[u].y),d-=(c[u].y-c[m].y)*(c[o].x-c[u].x),d<0?f|=1:d>0&&(f|=2),f===3)return!1;return f!==0?!0:null},n.hull=function(c){var f=[],h=[],m,u;for(c=c.slice(0),c.sort(function(o,d){var v=o.x-d.x;return v!==0?v:o.y-d.y}),u=0;u<c.length;u+=1){for(m=c[u];h.length>=2&&a.cross3(h[h.length-2],h[h.length-1],m)<=0;)h.pop();h.push(m)}for(u=c.length-1;u>=0;u-=1){for(m=c[u];f.length>=2&&a.cross3(f[f.length-2],f[f.length-1],m)<=0;)f.pop();f.push(m)}return f.pop(),h.pop(),f.concat(h)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(2),c=s(7),f=s(0),h=s(1),m=s(11);(function(){n._timeCorrection=!0,n._inertiaScale=4,n._nextCollidingGroupId=1,n._nextNonCollidingGroupId=-1,n._nextCategory=1,n._baseDelta=1e3/60,n.create=function(o){var d={id:f.nextId(),type:"body",label:"Body",parts:[],plugin:{},angle:0,vertices:a.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,strokeStyle:null,fillStyle:null,lineWidth:null,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0}},events:null,bounds:null,chamfer:null,circleRadius:0,positionPrev:null,anglePrev:0,parent:null,axes:null,area:0,mass:0,inertia:0,deltaTime:16.666666666666668,_original:null},v=f.extend(d,o);return u(v,o),v},n.nextGroup=function(o){return o?n._nextNonCollidingGroupId--:n._nextCollidingGroupId++},n.nextCategory=function(){return n._nextCategory=n._nextCategory<<1,n._nextCategory};var u=function(o,d){d=d||{},n.set(o,{bounds:o.bounds||h.create(o.vertices),positionPrev:o.positionPrev||l.clone(o.position),anglePrev:o.anglePrev||o.angle,vertices:o.vertices,parts:o.parts||[o],isStatic:o.isStatic,isSleeping:o.isSleeping,parent:o.parent||o}),a.rotate(o.vertices,o.angle,o.position),m.rotate(o.axes,o.angle),h.update(o.bounds,o.vertices,o.velocity),n.set(o,{axes:d.axes||o.axes,area:d.area||o.area,mass:d.mass||o.mass,inertia:d.inertia||o.inertia});var v=o.isStatic?"#14151f":f.choose(["#f19648","#f5d259","#f55a3c","#063e7b","#ececd1"]),p=o.isStatic?"#555":"#ccc",g=o.isStatic&&o.render.fillStyle===null?1:0;o.render.fillStyle=o.render.fillStyle||v,o.render.strokeStyle=o.render.strokeStyle||p,o.render.lineWidth=o.render.lineWidth||g,o.render.sprite.xOffset+=-(o.bounds.min.x-o.position.x)/(o.bounds.max.x-o.bounds.min.x),o.render.sprite.yOffset+=-(o.bounds.min.y-o.position.y)/(o.bounds.max.y-o.bounds.min.y)};n.set=function(o,d,v){var p;typeof d=="string"&&(p=d,d={},d[p]=v);for(p in d)if(Object.prototype.hasOwnProperty.call(d,p))switch(v=d[p],p){case"isStatic":n.setStatic(o,v);break;case"isSleeping":c.set(o,v);break;case"mass":n.setMass(o,v);break;case"density":n.setDensity(o,v);break;case"inertia":n.setInertia(o,v);break;case"vertices":n.setVertices(o,v);break;case"position":n.setPosition(o,v);break;case"angle":n.setAngle(o,v);break;case"velocity":n.setVelocity(o,v);break;case"angularVelocity":n.setAngularVelocity(o,v);break;case"speed":n.setSpeed(o,v);break;case"angularSpeed":n.setAngularSpeed(o,v);break;case"parts":n.setParts(o,v);break;case"centre":n.setCentre(o,v);break;default:o[p]=v}},n.setStatic=function(o,d){for(var v=0;v<o.parts.length;v++){var p=o.parts[v];d?(p.isStatic||(p._original={restitution:p.restitution,friction:p.friction,mass:p.mass,inertia:p.inertia,density:p.density,inverseMass:p.inverseMass,inverseInertia:p.inverseInertia}),p.restitution=0,p.friction=1,p.mass=p.inertia=p.density=1/0,p.inverseMass=p.inverseInertia=0,p.positionPrev.x=p.position.x,p.positionPrev.y=p.position.y,p.anglePrev=p.angle,p.angularVelocity=0,p.speed=0,p.angularSpeed=0,p.motion=0):p._original&&(p.restitution=p._original.restitution,p.friction=p._original.friction,p.mass=p._original.mass,p.inertia=p._original.inertia,p.density=p._original.density,p.inverseMass=p._original.inverseMass,p.inverseInertia=p._original.inverseInertia,p._original=null),p.isStatic=d}},n.setMass=function(o,d){var v=o.inertia/(o.mass/6);o.inertia=v*(d/6),o.inverseInertia=1/o.inertia,o.mass=d,o.inverseMass=1/o.mass,o.density=o.mass/o.area},n.setDensity=function(o,d){n.setMass(o,d*o.area),o.density=d},n.setInertia=function(o,d){o.inertia=d,o.inverseInertia=1/o.inertia},n.setVertices=function(o,d){d[0].body===o?o.vertices=d:o.vertices=a.create(d,o),o.axes=m.fromVertices(o.vertices),o.area=a.area(o.vertices),n.setMass(o,o.density*o.area);var v=a.centre(o.vertices);a.translate(o.vertices,v,-1),n.setInertia(o,n._inertiaScale*a.inertia(o.vertices,o.mass)),a.translate(o.vertices,o.position),h.update(o.bounds,o.vertices,o.velocity)},n.setParts=function(o,d,v){var p;for(d=d.slice(0),o.parts.length=0,o.parts.push(o),o.parent=o,p=0;p<d.length;p++){var g=d[p];g!==o&&(g.parent=o,o.parts.push(g))}if(o.parts.length!==1){if(v=typeof v<"u"?v:!0,v){var E=[];for(p=0;p<d.length;p++)E=E.concat(d[p].vertices);a.clockwiseSort(E);var A=a.hull(E),M=a.centre(A);n.setVertices(o,A),a.translate(o.vertices,M)}var _=n._totalProperties(o);o.area=_.area,o.parent=o,o.position.x=_.centre.x,o.position.y=_.centre.y,o.positionPrev.x=_.centre.x,o.positionPrev.y=_.centre.y,n.setMass(o,_.mass),n.setInertia(o,_.inertia),n.setPosition(o,_.centre)}},n.setCentre=function(o,d,v){v?(o.positionPrev.x+=d.x,o.positionPrev.y+=d.y,o.position.x+=d.x,o.position.y+=d.y):(o.positionPrev.x=d.x-(o.position.x-o.positionPrev.x),o.positionPrev.y=d.y-(o.position.y-o.positionPrev.y),o.position.x=d.x,o.position.y=d.y)},n.setPosition=function(o,d,v){var p=l.sub(d,o.position);v?(o.positionPrev.x=o.position.x,o.positionPrev.y=o.position.y,o.velocity.x=p.x,o.velocity.y=p.y,o.speed=l.magnitude(p)):(o.positionPrev.x+=p.x,o.positionPrev.y+=p.y);for(var g=0;g<o.parts.length;g++){var E=o.parts[g];E.position.x+=p.x,E.position.y+=p.y,a.translate(E.vertices,p),h.update(E.bounds,E.vertices,o.velocity)}},n.setAngle=function(o,d,v){var p=d-o.angle;v?(o.anglePrev=o.angle,o.angularVelocity=p,o.angularSpeed=Math.abs(p)):o.anglePrev+=p;for(var g=0;g<o.parts.length;g++){var E=o.parts[g];E.angle+=p,a.rotate(E.vertices,p,o.position),m.rotate(E.axes,p),h.update(E.bounds,E.vertices,o.velocity),g>0&&l.rotateAbout(E.position,p,o.position,E.position)}},n.setVelocity=function(o,d){var v=o.deltaTime/n._baseDelta;o.positionPrev.x=o.position.x-d.x*v,o.positionPrev.y=o.position.y-d.y*v,o.velocity.x=(o.position.x-o.positionPrev.x)/v,o.velocity.y=(o.position.y-o.positionPrev.y)/v,o.speed=l.magnitude(o.velocity)},n.getVelocity=function(o){var d=n._baseDelta/o.deltaTime;return{x:(o.position.x-o.positionPrev.x)*d,y:(o.position.y-o.positionPrev.y)*d}},n.getSpeed=function(o){return l.magnitude(n.getVelocity(o))},n.setSpeed=function(o,d){n.setVelocity(o,l.mult(l.normalise(n.getVelocity(o)),d))},n.setAngularVelocity=function(o,d){var v=o.deltaTime/n._baseDelta;o.anglePrev=o.angle-d*v,o.angularVelocity=(o.angle-o.anglePrev)/v,o.angularSpeed=Math.abs(o.angularVelocity)},n.getAngularVelocity=function(o){return(o.angle-o.anglePrev)*n._baseDelta/o.deltaTime},n.getAngularSpeed=function(o){return Math.abs(n.getAngularVelocity(o))},n.setAngularSpeed=function(o,d){n.setAngularVelocity(o,f.sign(n.getAngularVelocity(o))*d)},n.translate=function(o,d,v){n.setPosition(o,l.add(o.position,d),v)},n.rotate=function(o,d,v,p){if(!v)n.setAngle(o,o.angle+d,p);else{var g=Math.cos(d),E=Math.sin(d),A=o.position.x-v.x,M=o.position.y-v.y;n.setPosition(o,{x:v.x+(A*g-M*E),y:v.y+(A*E+M*g)},p),n.setAngle(o,o.angle+d,p)}},n.scale=function(o,d,v,p){var g=0,E=0;p=p||o.position;for(var A=0;A<o.parts.length;A++){var M=o.parts[A];a.scale(M.vertices,d,v,p),M.axes=m.fromVertices(M.vertices),M.area=a.area(M.vertices),n.setMass(M,o.density*M.area),a.translate(M.vertices,{x:-M.position.x,y:-M.position.y}),n.setInertia(M,n._inertiaScale*a.inertia(M.vertices,M.mass)),a.translate(M.vertices,{x:M.position.x,y:M.position.y}),A>0&&(g+=M.area,E+=M.inertia),M.position.x=p.x+(M.position.x-p.x)*d,M.position.y=p.y+(M.position.y-p.y)*v,h.update(M.bounds,M.vertices,o.velocity)}o.parts.length>1&&(o.area=g,o.isStatic||(n.setMass(o,o.density*g),n.setInertia(o,E))),o.circleRadius&&(d===v?o.circleRadius*=d:o.circleRadius=null)},n.update=function(o,d){d=(typeof d<"u"?d:1e3/60)*o.timeScale;var v=d*d,p=n._timeCorrection?d/(o.deltaTime||d):1,g=1-o.frictionAir*(d/f._baseDelta),E=(o.position.x-o.positionPrev.x)*p,A=(o.position.y-o.positionPrev.y)*p;o.velocity.x=E*g+o.force.x/o.mass*v,o.velocity.y=A*g+o.force.y/o.mass*v,o.positionPrev.x=o.position.x,o.positionPrev.y=o.position.y,o.position.x+=o.velocity.x,o.position.y+=o.velocity.y,o.deltaTime=d,o.angularVelocity=(o.angle-o.anglePrev)*g*p+o.torque/o.inertia*v,o.anglePrev=o.angle,o.angle+=o.angularVelocity;for(var M=0;M<o.parts.length;M++){var _=o.parts[M];a.translate(_.vertices,o.velocity),M>0&&(_.position.x+=o.velocity.x,_.position.y+=o.velocity.y),o.angularVelocity!==0&&(a.rotate(_.vertices,o.angularVelocity,o.position),m.rotate(_.axes,o.angularVelocity),M>0&&l.rotateAbout(_.position,o.angularVelocity,o.position,_.position)),h.update(_.bounds,_.vertices,o.velocity)}},n.updateVelocities=function(o){var d=n._baseDelta/o.deltaTime,v=o.velocity;v.x=(o.position.x-o.positionPrev.x)*d,v.y=(o.position.y-o.positionPrev.y)*d,o.speed=Math.sqrt(v.x*v.x+v.y*v.y),o.angularVelocity=(o.angle-o.anglePrev)*d,o.angularSpeed=Math.abs(o.angularVelocity)},n.applyForce=function(o,d,v){var p={x:d.x-o.position.x,y:d.y-o.position.y};o.force.x+=v.x,o.force.y+=v.y,o.torque+=p.x*v.y-p.y*v.x},n._totalProperties=function(o){for(var d={mass:0,area:0,inertia:0,centre:{x:0,y:0}},v=o.parts.length===1?0:1;v<o.parts.length;v++){var p=o.parts[v],g=p.mass!==1/0?p.mass:1;d.mass+=g,d.area+=p.area,d.inertia+=p.inertia,d.centre=l.add(d.centre,l.mult(p.position,g))}return d.centre=l.div(d.centre,d.mass),d}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(0);(function(){n.on=function(l,c,f){for(var h=c.split(" "),m,u=0;u<h.length;u++)m=h[u],l.events=l.events||{},l.events[m]=l.events[m]||[],l.events[m].push(f);return f},n.off=function(l,c,f){if(!c){l.events={};return}typeof c=="function"&&(f=c,c=a.keys(l.events).join(" "));for(var h=c.split(" "),m=0;m<h.length;m++){var u=l.events[h[m]],o=[];if(f&&u)for(var d=0;d<u.length;d++)u[d]!==f&&o.push(u[d]);l.events[h[m]]=o}},n.trigger=function(l,c,f){var h,m,u,o,d=l.events;if(d&&a.keys(d).length>0){f||(f={}),h=c.split(" ");for(var v=0;v<h.length;v++)if(m=h[v],u=d[m],u){o=a.clone(f,!1),o.name=m,o.source=l;for(var p=0;p<u.length;p++)u[p].apply(l,[o])}}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(5),l=s(0),c=s(1),f=s(4);(function(){n.create=function(h){return l.extend({id:l.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite",plugin:{},cache:{allBodies:null,allConstraints:null,allComposites:null}},h)},n.setModified=function(h,m,u,o){if(h.isModified=m,m&&h.cache&&(h.cache.allBodies=null,h.cache.allConstraints=null,h.cache.allComposites=null),u&&h.parent&&n.setModified(h.parent,m,u,o),o)for(var d=0;d<h.composites.length;d++){var v=h.composites[d];n.setModified(v,m,u,o)}},n.add=function(h,m){var u=[].concat(m);a.trigger(h,"beforeAdd",{object:m});for(var o=0;o<u.length;o++){var d=u[o];switch(d.type){case"body":if(d.parent!==d){l.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");break}n.addBody(h,d);break;case"constraint":n.addConstraint(h,d);break;case"composite":n.addComposite(h,d);break;case"mouseConstraint":n.addConstraint(h,d.constraint);break}}return a.trigger(h,"afterAdd",{object:m}),h},n.remove=function(h,m,u){var o=[].concat(m);a.trigger(h,"beforeRemove",{object:m});for(var d=0;d<o.length;d++){var v=o[d];switch(v.type){case"body":n.removeBody(h,v,u);break;case"constraint":n.removeConstraint(h,v,u);break;case"composite":n.removeComposite(h,v,u);break;case"mouseConstraint":n.removeConstraint(h,v.constraint);break}}return a.trigger(h,"afterRemove",{object:m}),h},n.addComposite=function(h,m){return h.composites.push(m),m.parent=h,n.setModified(h,!0,!0,!1),h},n.removeComposite=function(h,m,u){var o=l.indexOf(h.composites,m);if(o!==-1){var d=n.allBodies(m);n.removeCompositeAt(h,o);for(var v=0;v<d.length;v++)d[v].sleepCounter=0}if(u)for(var v=0;v<h.composites.length;v++)n.removeComposite(h.composites[v],m,!0);return h},n.removeCompositeAt=function(h,m){return h.composites.splice(m,1),n.setModified(h,!0,!0,!1),h},n.addBody=function(h,m){return h.bodies.push(m),n.setModified(h,!0,!0,!1),h},n.removeBody=function(h,m,u){var o=l.indexOf(h.bodies,m);if(o!==-1&&(n.removeBodyAt(h,o),m.sleepCounter=0),u)for(var d=0;d<h.composites.length;d++)n.removeBody(h.composites[d],m,!0);return h},n.removeBodyAt=function(h,m){return h.bodies.splice(m,1),n.setModified(h,!0,!0,!1),h},n.addConstraint=function(h,m){return h.constraints.push(m),n.setModified(h,!0,!0,!1),h},n.removeConstraint=function(h,m,u){var o=l.indexOf(h.constraints,m);if(o!==-1&&n.removeConstraintAt(h,o),u)for(var d=0;d<h.composites.length;d++)n.removeConstraint(h.composites[d],m,!0);return h},n.removeConstraintAt=function(h,m){return h.constraints.splice(m,1),n.setModified(h,!0,!0,!1),h},n.clear=function(h,m,u){if(u)for(var o=0;o<h.composites.length;o++)n.clear(h.composites[o],m,!0);return m?h.bodies=h.bodies.filter(function(d){return d.isStatic}):h.bodies.length=0,h.constraints.length=0,h.composites.length=0,n.setModified(h,!0,!0,!1),h},n.allBodies=function(h){if(h.cache&&h.cache.allBodies)return h.cache.allBodies;for(var m=[].concat(h.bodies),u=0;u<h.composites.length;u++)m=m.concat(n.allBodies(h.composites[u]));return h.cache&&(h.cache.allBodies=m),m},n.allConstraints=function(h){if(h.cache&&h.cache.allConstraints)return h.cache.allConstraints;for(var m=[].concat(h.constraints),u=0;u<h.composites.length;u++)m=m.concat(n.allConstraints(h.composites[u]));return h.cache&&(h.cache.allConstraints=m),m},n.allComposites=function(h){if(h.cache&&h.cache.allComposites)return h.cache.allComposites;for(var m=[].concat(h.composites),u=0;u<h.composites.length;u++)m=m.concat(n.allComposites(h.composites[u]));return h.cache&&(h.cache.allComposites=m),m},n.get=function(h,m,u){var o,d;switch(u){case"body":o=n.allBodies(h);break;case"constraint":o=n.allConstraints(h);break;case"composite":o=n.allComposites(h).concat(h);break}return o?(d=o.filter(function(v){return v.id.toString()===m.toString()}),d.length===0?null:d[0]):null},n.move=function(h,m,u){return n.remove(h,m),n.add(u,m),h},n.rebase=function(h){for(var m=n.allBodies(h).concat(n.allConstraints(h)).concat(n.allComposites(h)),u=0;u<m.length;u++)m[u].id=l.nextId();return h},n.translate=function(h,m,u){for(var o=u?n.allBodies(h):h.bodies,d=0;d<o.length;d++)f.translate(o[d],m);return h},n.rotate=function(h,m,u,o){for(var d=Math.cos(m),v=Math.sin(m),p=o?n.allBodies(h):h.bodies,g=0;g<p.length;g++){var E=p[g],A=E.position.x-u.x,M=E.position.y-u.y;f.setPosition(E,{x:u.x+(A*d-M*v),y:u.y+(A*v+M*d)}),f.rotate(E,m)}return h},n.scale=function(h,m,u,o,d){for(var v=d?n.allBodies(h):h.bodies,p=0;p<v.length;p++){var g=v[p],E=g.position.x-o.x,A=g.position.y-o.y;f.setPosition(g,{x:o.x+E*m,y:o.y+A*u}),f.scale(g,m,u)}return h},n.bounds=function(h){for(var m=n.allBodies(h),u=[],o=0;o<m.length;o+=1){var d=m[o];u.push(d.bounds.min,d.bounds.max)}return c.create(u)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(4),l=s(5),c=s(0);(function(){n._motionWakeThreshold=.18,n._motionSleepThreshold=.08,n._minBias=.9,n.update=function(f,h){for(var m=h/c._baseDelta,u=n._motionSleepThreshold,o=0;o<f.length;o++){var d=f[o],v=a.getSpeed(d),p=a.getAngularSpeed(d),g=v*v+p*p;if(d.force.x!==0||d.force.y!==0){n.set(d,!1);continue}var E=Math.min(d.motion,g),A=Math.max(d.motion,g);d.motion=n._minBias*E+(1-n._minBias)*A,d.sleepThreshold>0&&d.motion<u?(d.sleepCounter+=1,d.sleepCounter>=d.sleepThreshold/m&&n.set(d,!0)):d.sleepCounter>0&&(d.sleepCounter-=1)}},n.afterCollisions=function(f){for(var h=n._motionSleepThreshold,m=0;m<f.length;m++){var u=f[m];if(u.isActive){var o=u.collision,d=o.bodyA.parent,v=o.bodyB.parent;if(!(d.isSleeping&&v.isSleeping||d.isStatic||v.isStatic)&&(d.isSleeping||v.isSleeping)){var p=d.isSleeping&&!d.isStatic?d:v,g=p===d?v:d;!p.isStatic&&g.motion>h&&n.set(p,!1)}}}},n.set=function(f,h){var m=f.isSleeping;h?(f.isSleeping=!0,f.sleepCounter=f.sleepThreshold,f.positionImpulse.x=0,f.positionImpulse.y=0,f.positionPrev.x=f.position.x,f.positionPrev.y=f.position.y,f.anglePrev=f.angle,f.speed=0,f.angularSpeed=0,f.motion=0,m||l.trigger(f,"sleepStart")):(f.isSleeping=!1,f.sleepCounter=0,m&&l.trigger(f,"sleepEnd"))}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(9);(function(){var c=[],f={overlap:0,axis:null},h={overlap:0,axis:null};n.create=function(m,u){return{pair:null,collided:!1,bodyA:m,bodyB:u,parentA:m.parent,parentB:u.parent,depth:0,normal:{x:0,y:0},tangent:{x:0,y:0},penetration:{x:0,y:0},supports:[null,null],supportCount:0}},n.collides=function(m,u,o){if(n._overlapAxes(f,m.vertices,u.vertices,m.axes),f.overlap<=0||(n._overlapAxes(h,u.vertices,m.vertices,u.axes),h.overlap<=0))return null;var d=o&&o.table[l.id(m,u)],v;d?v=d.collision:(v=n.create(m,u),v.collided=!0,v.bodyA=m.id<u.id?m:u,v.bodyB=m.id<u.id?u:m,v.parentA=v.bodyA.parent,v.parentB=v.bodyB.parent),m=v.bodyA,u=v.bodyB;var p;f.overlap<h.overlap?p=f:p=h;var g=v.normal,E=v.tangent,A=v.penetration,M=v.supports,_=p.overlap,S=p.axis,T=S.x,x=S.y,y=u.position.x-m.position.x,w=u.position.y-m.position.y;T*y+x*w>=0&&(T=-T,x=-x),g.x=T,g.y=x,E.x=-x,E.y=T,A.x=T*_,A.y=x*_,v.depth=_;var R=n._findSupports(m,u,g,1),C=0;if(a.contains(m.vertices,R[0])&&(M[C++]=R[0]),a.contains(m.vertices,R[1])&&(M[C++]=R[1]),C<2){var D=n._findSupports(u,m,g,-1);a.contains(u.vertices,D[0])&&(M[C++]=D[0]),C<2&&a.contains(u.vertices,D[1])&&(M[C++]=D[1])}return C===0&&(M[C++]=R[0]),v.supportCount=C,v},n._overlapAxes=function(m,u,o,d){var v=u.length,p=o.length,g=u[0].x,E=u[0].y,A=o[0].x,M=o[0].y,_=d.length,S=Number.MAX_VALUE,T=0,x,y,w,R,C,D;for(C=0;C<_;C++){var N=d[C],I=N.x,z=N.y,U=g*I+E*z,W=A*I+M*z,K=U,ie=W;for(D=1;D<v;D+=1)R=u[D].x*I+u[D].y*z,R>K?K=R:R<U&&(U=R);for(D=1;D<p;D+=1)R=o[D].x*I+o[D].y*z,R>ie?ie=R:R<W&&(W=R);if(y=K-W,w=ie-U,x=y<w?y:w,x<S&&(S=x,T=C,x<=0))break}m.axis=d[T],m.overlap=S},n._findSupports=function(m,u,o,d){var v=u.vertices,p=v.length,g=m.position.x,E=m.position.y,A=o.x*d,M=o.y*d,_=v[0],S=_,T=A*(g-S.x)+M*(E-S.y),x,y,w;for(w=1;w<p;w+=1)S=v[w],y=A*(g-S.x)+M*(E-S.y),y<T&&(T=y,_=S);return x=v[(p+_.index-1)%p],T=A*(g-x.x)+M*(E-x.y),S=v[(_.index+1)%p],A*(g-S.x)+M*(E-S.y)<T?(c[0]=_,c[1]=S,c):(c[0]=_,c[1]=x,c)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(16);(function(){n.create=function(l,c){var f=l.bodyA,h=l.bodyB,m={id:n.id(f,h),bodyA:f,bodyB:h,collision:l,contacts:[a.create(),a.create()],contactCount:0,separation:0,isActive:!0,isSensor:f.isSensor||h.isSensor,timeCreated:c,timeUpdated:c,inverseMass:0,friction:0,frictionStatic:0,restitution:0,slop:0};return n.update(m,l,c),m},n.update=function(l,c,f){var h=c.supports,m=c.supportCount,u=l.contacts,o=c.parentA,d=c.parentB;l.isActive=!0,l.timeUpdated=f,l.collision=c,l.separation=c.depth,l.inverseMass=o.inverseMass+d.inverseMass,l.friction=o.friction<d.friction?o.friction:d.friction,l.frictionStatic=o.frictionStatic>d.frictionStatic?o.frictionStatic:d.frictionStatic,l.restitution=o.restitution>d.restitution?o.restitution:d.restitution,l.slop=o.slop>d.slop?o.slop:d.slop,l.contactCount=m,c.pair=l;var v=h[0],p=u[0],g=h[1],E=u[1];(E.vertex===v||p.vertex===g)&&(u[1]=p,u[0]=p=E,E=u[1]),p.vertex=v,E.vertex=g},n.setActive=function(l,c,f){c?(l.isActive=!0,l.timeUpdated=f):(l.isActive=!1,l.contactCount=0)},n.id=function(l,c){return l.id<c.id?l.id.toString(36)+":"+c.id.toString(36):c.id.toString(36)+":"+l.id.toString(36)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(2),c=s(7),f=s(1),h=s(11),m=s(0);(function(){n._warming=.4,n._torqueDampen=1,n._minLength=1e-6,n.create=function(u){var o=u;o.bodyA&&!o.pointA&&(o.pointA={x:0,y:0}),o.bodyB&&!o.pointB&&(o.pointB={x:0,y:0});var d=o.bodyA?l.add(o.bodyA.position,o.pointA):o.pointA,v=o.bodyB?l.add(o.bodyB.position,o.pointB):o.pointB,p=l.magnitude(l.sub(d,v));o.length=typeof o.length<"u"?o.length:p,o.id=o.id||m.nextId(),o.label=o.label||"Constraint",o.type="constraint",o.stiffness=o.stiffness||(o.length>0?1:.7),o.damping=o.damping||0,o.angularStiffness=o.angularStiffness||0,o.angleA=o.bodyA?o.bodyA.angle:o.angleA,o.angleB=o.bodyB?o.bodyB.angle:o.angleB,o.plugin={};var g={visible:!0,lineWidth:2,strokeStyle:"#ffffff",type:"line",anchors:!0};return o.length===0&&o.stiffness>.1?(g.type="pin",g.anchors=!1):o.stiffness<.9&&(g.type="spring"),o.render=m.extend(g,o.render),o},n.preSolveAll=function(u){for(var o=0;o<u.length;o+=1){var d=u[o],v=d.constraintImpulse;d.isStatic||v.x===0&&v.y===0&&v.angle===0||(d.position.x+=v.x,d.position.y+=v.y,d.angle+=v.angle)}},n.solveAll=function(u,o){for(var d=m.clamp(o/m._baseDelta,0,1),v=0;v<u.length;v+=1){var p=u[v],g=!p.bodyA||p.bodyA&&p.bodyA.isStatic,E=!p.bodyB||p.bodyB&&p.bodyB.isStatic;(g||E)&&n.solve(u[v],d)}for(v=0;v<u.length;v+=1)p=u[v],g=!p.bodyA||p.bodyA&&p.bodyA.isStatic,E=!p.bodyB||p.bodyB&&p.bodyB.isStatic,!g&&!E&&n.solve(u[v],d)},n.solve=function(u,o){var d=u.bodyA,v=u.bodyB,p=u.pointA,g=u.pointB;if(!(!d&&!v)){d&&!d.isStatic&&(l.rotate(p,d.angle-u.angleA,p),u.angleA=d.angle),v&&!v.isStatic&&(l.rotate(g,v.angle-u.angleB,g),u.angleB=v.angle);var E=p,A=g;if(d&&(E=l.add(d.position,p)),v&&(A=l.add(v.position,g)),!(!E||!A)){var M=l.sub(E,A),_=l.magnitude(M);_<n._minLength&&(_=n._minLength);var S=(_-u.length)/_,T=u.stiffness>=1||u.length===0,x=T?u.stiffness*o:u.stiffness*o*o,y=u.damping*o,w=l.mult(M,S*x),R=(d?d.inverseMass:0)+(v?v.inverseMass:0),C=(d?d.inverseInertia:0)+(v?v.inverseInertia:0),D=R+C,N,I,z,U,W;if(y>0){var K=l.create();z=l.div(M,_),W=l.sub(v&&l.sub(v.position,v.positionPrev)||K,d&&l.sub(d.position,d.positionPrev)||K),U=l.dot(z,W)}d&&!d.isStatic&&(I=d.inverseMass/R,d.constraintImpulse.x-=w.x*I,d.constraintImpulse.y-=w.y*I,d.position.x-=w.x*I,d.position.y-=w.y*I,y>0&&(d.positionPrev.x-=y*z.x*U*I,d.positionPrev.y-=y*z.y*U*I),N=l.cross(p,w)/D*n._torqueDampen*d.inverseInertia*(1-u.angularStiffness),d.constraintImpulse.angle-=N,d.angle-=N),v&&!v.isStatic&&(I=v.inverseMass/R,v.constraintImpulse.x+=w.x*I,v.constraintImpulse.y+=w.y*I,v.position.x+=w.x*I,v.position.y+=w.y*I,y>0&&(v.positionPrev.x+=y*z.x*U*I,v.positionPrev.y+=y*z.y*U*I),N=l.cross(g,w)/D*n._torqueDampen*v.inverseInertia*(1-u.angularStiffness),v.constraintImpulse.angle+=N,v.angle+=N)}}},n.postSolveAll=function(u){for(var o=0;o<u.length;o++){var d=u[o],v=d.constraintImpulse;if(!(d.isStatic||v.x===0&&v.y===0&&v.angle===0)){c.set(d,!1);for(var p=0;p<d.parts.length;p++){var g=d.parts[p];a.translate(g.vertices,v),p>0&&(g.position.x+=v.x,g.position.y+=v.y),v.angle!==0&&(a.rotate(g.vertices,v.angle,d.position),h.rotate(g.axes,v.angle),p>0&&l.rotateAbout(g.position,v.angle,d.position,g.position)),f.update(g.bounds,g.vertices,d.velocity)}v.angle*=n._warming,v.x*=n._warming,v.y*=n._warming}}},n.pointAWorld=function(u){return{x:(u.bodyA?u.bodyA.position.x:0)+(u.pointA?u.pointA.x:0),y:(u.bodyA?u.bodyA.position.y:0)+(u.pointA?u.pointA.y:0)}},n.pointBWorld=function(u){return{x:(u.bodyB?u.bodyB.position.x:0)+(u.pointB?u.pointB.x:0),y:(u.bodyB?u.bodyB.position.y:0)+(u.pointB?u.pointB.y:0)}},n.currentLength=function(u){var o=(u.bodyA?u.bodyA.position.x:0)+(u.pointA?u.pointA.x:0),d=(u.bodyA?u.bodyA.position.y:0)+(u.pointA?u.pointA.y:0),v=(u.bodyB?u.bodyB.position.x:0)+(u.pointB?u.pointB.x:0),p=(u.bodyB?u.bodyB.position.y:0)+(u.pointB?u.pointB.y:0),g=o-v,E=d-p;return Math.sqrt(g*g+E*E)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(2),l=s(0);(function(){n.fromVertices=function(c){for(var f={},h=0;h<c.length;h++){var m=(h+1)%c.length,u=a.normalise({x:c[m].y-c[h].y,y:c[h].x-c[m].x}),o=u.y===0?1/0:u.x/u.y;o=o.toFixed(3).toString(),f[o]=u}return l.values(f)},n.rotate=function(c,f){if(f!==0)for(var h=Math.cos(f),m=Math.sin(f),u=0;u<c.length;u++){var o=c[u],d;d=o.x*h-o.y*m,o.y=o.x*m+o.y*h,o.x=d}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(0),c=s(4),f=s(1),h=s(2);(function(){n.rectangle=function(m,u,o,d,v){v=v||{};var p={label:"Rectangle Body",position:{x:m,y:u},vertices:a.fromPath("L 0 0 L "+o+" 0 L "+o+" "+d+" L 0 "+d)};if(v.chamfer){var g=v.chamfer;p.vertices=a.chamfer(p.vertices,g.radius,g.quality,g.qualityMin,g.qualityMax),delete v.chamfer}return c.create(l.extend({},p,v))},n.trapezoid=function(m,u,o,d,v,p){p=p||{},v>=1&&l.warn("Bodies.trapezoid: slope parameter must be < 1."),v*=.5;var g=(1-v*2)*o,E=o*v,A=E+g,M=A+E,_;v<.5?_="L 0 0 L "+E+" "+-d+" L "+A+" "+-d+" L "+M+" 0":_="L 0 0 L "+A+" "+-d+" L "+M+" 0";var S={label:"Trapezoid Body",position:{x:m,y:u},vertices:a.fromPath(_)};if(p.chamfer){var T=p.chamfer;S.vertices=a.chamfer(S.vertices,T.radius,T.quality,T.qualityMin,T.qualityMax),delete p.chamfer}return c.create(l.extend({},S,p))},n.circle=function(m,u,o,d,v){d=d||{};var p={label:"Circle Body",circleRadius:o};v=v||25;var g=Math.ceil(Math.max(10,Math.min(v,o)));return g%2===1&&(g+=1),n.polygon(m,u,g,o,l.extend({},p,d))},n.polygon=function(m,u,o,d,v){if(v=v||{},o<3)return n.circle(m,u,d,v);for(var p=2*Math.PI/o,g="",E=p*.5,A=0;A<o;A+=1){var M=E+A*p,_=Math.cos(M)*d,S=Math.sin(M)*d;g+="L "+_.toFixed(3)+" "+S.toFixed(3)+" "}var T={label:"Polygon Body",position:{x:m,y:u},vertices:a.fromPath(g)};if(v.chamfer){var x=v.chamfer;T.vertices=a.chamfer(T.vertices,x.radius,x.quality,x.qualityMin,x.qualityMax),delete v.chamfer}return c.create(l.extend({},T,v))},n.fromVertices=function(m,u,o,d,v,p,g,E){var A=l.getDecomp(),M,_,S,T,x,y,w,R,C,D,N;for(M=!!(A&&A.quickDecomp),d=d||{},S=[],v=typeof v<"u"?v:!1,p=typeof p<"u"?p:.01,g=typeof g<"u"?g:10,E=typeof E<"u"?E:.01,l.isArray(o[0])||(o=[o]),D=0;D<o.length;D+=1)if(y=o[D],T=a.isConvex(y),x=!T,x&&!M&&l.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."),T||!M)T?y=a.clockwiseSort(y):y=a.hull(y),S.push({position:{x:m,y:u},vertices:y});else{var I=y.map(function(H){return[H.x,H.y]});A.makeCCW(I),p!==!1&&A.removeCollinearPoints(I,p),E!==!1&&A.removeDuplicatePoints&&A.removeDuplicatePoints(I,E);var z=A.quickDecomp(I);for(w=0;w<z.length;w++){var U=z[w],W=U.map(function(H){return{x:H[0],y:H[1]}});g>0&&a.area(W)<g||S.push({position:a.centre(W),vertices:W})}}for(w=0;w<S.length;w++)S[w]=c.create(l.extend(S[w],d));if(v){var K=5;for(w=0;w<S.length;w++){var ie=S[w];for(R=w+1;R<S.length;R++){var se=S[R];if(f.overlaps(ie.bounds,se.bounds)){var oe=ie.vertices,De=se.vertices;for(C=0;C<ie.vertices.length;C++)for(N=0;N<se.vertices.length;N++){var qe=h.magnitudeSquared(h.sub(oe[(C+1)%oe.length],De[N])),ne=h.magnitudeSquared(h.sub(oe[C],De[(N+1)%De.length]));qe<K&&ne<K&&(oe[C].isInternal=!0,De[N].isInternal=!0)}}}}}return S.length>1?(_=c.create(l.extend({parts:S.slice(0)},d)),c.setPosition(_,{x:m,y:u}),_):S[0]}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(0),l=s(8);(function(){n.create=function(c){var f={bodies:[],collisions:[],pairs:null};return a.extend(f,c)},n.setBodies=function(c,f){c.bodies=f.slice(0)},n.clear=function(c){c.bodies=[],c.collisions=[]},n.collisions=function(c){var f=c.pairs,h=c.bodies,m=h.length,u=n.canCollide,o=l.collides,d=c.collisions,v=0,p,g;for(h.sort(n._compareBoundsX),p=0;p<m;p++){var E=h[p],A=E.bounds,M=E.bounds.max.x,_=E.bounds.max.y,S=E.bounds.min.y,T=E.isStatic||E.isSleeping,x=E.parts.length,y=x===1;for(g=p+1;g<m;g++){var w=h[g],R=w.bounds;if(R.min.x>M)break;if(!(_<R.min.y||S>R.max.y)&&!(T&&(w.isStatic||w.isSleeping))&&u(E.collisionFilter,w.collisionFilter)){var C=w.parts.length;if(y&&C===1){var D=o(E,w,f);D&&(d[v++]=D)}else for(var N=x>1?1:0,I=C>1?1:0,z=N;z<x;z++)for(var U=E.parts[z],A=U.bounds,W=I;W<C;W++){var K=w.parts[W],R=K.bounds;if(!(A.min.x>R.max.x||A.max.x<R.min.x||A.max.y<R.min.y||A.min.y>R.max.y)){var D=o(U,K,f);D&&(d[v++]=D)}}}}}return d.length!==v&&(d.length=v),d},n.canCollide=function(c,f){return c.group===f.group&&c.group!==0?c.group>0:(c.mask&f.category)!==0&&(f.mask&c.category)!==0},n._compareBoundsX=function(c,f){return c.bounds.min.x-f.bounds.min.x}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(0);(function(){n.create=function(l){var c={};return l||a.log("Mouse.create: element was undefined, defaulting to document.body","warn"),c.element=l||document.body,c.absolute={x:0,y:0},c.position={x:0,y:0},c.mousedownPosition={x:0,y:0},c.mouseupPosition={x:0,y:0},c.offset={x:0,y:0},c.scale={x:1,y:1},c.wheelDelta=0,c.button=-1,c.pixelRatio=parseInt(c.element.getAttribute("data-pixel-ratio"),10)||1,c.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},c.mousemove=function(f){var h=n._getRelativeMousePosition(f,c.element,c.pixelRatio),m=f.changedTouches;m&&(c.button=0,f.preventDefault()),c.absolute.x=h.x,c.absolute.y=h.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.sourceEvents.mousemove=f},c.mousedown=function(f){var h=n._getRelativeMousePosition(f,c.element,c.pixelRatio),m=f.changedTouches;m?(c.button=0,f.preventDefault()):c.button=f.button,c.absolute.x=h.x,c.absolute.y=h.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mousedownPosition.x=c.position.x,c.mousedownPosition.y=c.position.y,c.sourceEvents.mousedown=f},c.mouseup=function(f){var h=n._getRelativeMousePosition(f,c.element,c.pixelRatio),m=f.changedTouches;m&&f.preventDefault(),c.button=-1,c.absolute.x=h.x,c.absolute.y=h.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mouseupPosition.x=c.position.x,c.mouseupPosition.y=c.position.y,c.sourceEvents.mouseup=f},c.mousewheel=function(f){c.wheelDelta=Math.max(-1,Math.min(1,f.wheelDelta||-f.detail)),f.preventDefault(),c.sourceEvents.mousewheel=f},n.setElement(c,c.element),c},n.setElement=function(l,c){l.element=c,c.addEventListener("mousemove",l.mousemove,{passive:!0}),c.addEventListener("mousedown",l.mousedown,{passive:!0}),c.addEventListener("mouseup",l.mouseup,{passive:!0}),c.addEventListener("wheel",l.mousewheel,{passive:!1}),c.addEventListener("touchmove",l.mousemove,{passive:!1}),c.addEventListener("touchstart",l.mousedown,{passive:!1}),c.addEventListener("touchend",l.mouseup,{passive:!1})},n.clearSourceEvents=function(l){l.sourceEvents.mousemove=null,l.sourceEvents.mousedown=null,l.sourceEvents.mouseup=null,l.sourceEvents.mousewheel=null,l.wheelDelta=0},n.setOffset=function(l,c){l.offset.x=c.x,l.offset.y=c.y,l.position.x=l.absolute.x*l.scale.x+l.offset.x,l.position.y=l.absolute.y*l.scale.y+l.offset.y},n.setScale=function(l,c){l.scale.x=c.x,l.scale.y=c.y,l.position.x=l.absolute.x*l.scale.x+l.offset.x,l.position.y=l.absolute.y*l.scale.y+l.offset.y},n._getRelativeMousePosition=function(l,c,f){var h=c.getBoundingClientRect(),m=document.documentElement||document.body.parentNode||document.body,u=window.pageXOffset!==void 0?window.pageXOffset:m.scrollLeft,o=window.pageYOffset!==void 0?window.pageYOffset:m.scrollTop,d=l.changedTouches,v,p;return d?(v=d[0].pageX-h.left-u,p=d[0].pageY-h.top-o):(v=l.pageX-h.left-u,p=l.pageY-h.top-o),{x:v/(c.clientWidth/(c.width||c.clientWidth)*f),y:p/(c.clientHeight/(c.height||c.clientHeight)*f)}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(0);(function(){n._registry={},n.register=function(l){if(n.isPlugin(l)||a.warn("Plugin.register:",n.toString(l),"does not implement all required fields."),l.name in n._registry){var c=n._registry[l.name],f=n.versionParse(l.version).number,h=n.versionParse(c.version).number;f>h?(a.warn("Plugin.register:",n.toString(c),"was upgraded to",n.toString(l)),n._registry[l.name]=l):f<h?a.warn("Plugin.register:",n.toString(c),"can not be downgraded to",n.toString(l)):l!==c&&a.warn("Plugin.register:",n.toString(l),"is already registered to different plugin object")}else n._registry[l.name]=l;return l},n.resolve=function(l){return n._registry[n.dependencyParse(l).name]},n.toString=function(l){return typeof l=="string"?l:(l.name||"anonymous")+"@"+(l.version||l.range||"0.0.0")},n.isPlugin=function(l){return l&&l.name&&l.version&&l.install},n.isUsed=function(l,c){return l.used.indexOf(c)>-1},n.isFor=function(l,c){var f=l.for&&n.dependencyParse(l.for);return!l.for||c.name===f.name&&n.versionSatisfies(c.version,f.range)},n.use=function(l,c){if(l.uses=(l.uses||[]).concat(c||[]),l.uses.length===0){a.warn("Plugin.use:",n.toString(l),"does not specify any dependencies to install.");return}for(var f=n.dependencies(l),h=a.topologicalSort(f),m=[],u=0;u<h.length;u+=1)if(h[u]!==l.name){var o=n.resolve(h[u]);if(!o){m.push("❌ "+h[u]);continue}n.isUsed(l,o.name)||(n.isFor(o,l)||(a.warn("Plugin.use:",n.toString(o),"is for",o.for,"but installed on",n.toString(l)+"."),o._warned=!0),o.install?o.install(l):(a.warn("Plugin.use:",n.toString(o),"does not specify an install function."),o._warned=!0),o._warned?(m.push("🔶 "+n.toString(o)),delete o._warned):m.push("✅ "+n.toString(o)),l.used.push(o.name))}m.length>0&&a.info(m.join("  "))},n.dependencies=function(l,c){var f=n.dependencyParse(l),h=f.name;if(c=c||{},!(h in c)){l=n.resolve(l)||l,c[h]=a.map(l.uses||[],function(u){n.isPlugin(u)&&n.register(u);var o=n.dependencyParse(u),d=n.resolve(u);return d&&!n.versionSatisfies(d.version,o.range)?(a.warn("Plugin.dependencies:",n.toString(d),"does not satisfy",n.toString(o),"used by",n.toString(f)+"."),d._warned=!0,l._warned=!0):d||(a.warn("Plugin.dependencies:",n.toString(u),"used by",n.toString(f),"could not be resolved."),l._warned=!0),o.name});for(var m=0;m<c[h].length;m+=1)n.dependencies(c[h][m],c);return c}},n.dependencyParse=function(l){if(a.isString(l)){var c=/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;return c.test(l)||a.warn("Plugin.dependencyParse:",l,"is not a valid dependency string."),{name:l.split("@")[0],range:l.split("@")[1]||"*"}}return{name:l.name,range:l.range||l.version}},n.versionParse=function(l){var c=/^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;c.test(l)||a.warn("Plugin.versionParse:",l,"is not a valid version or range.");var f=c.exec(l),h=Number(f[4]),m=Number(f[5]),u=Number(f[6]);return{isRange:!!(f[1]||f[2]),version:f[3],range:l,operator:f[1]||f[2]||"",major:h,minor:m,patch:u,parts:[h,m,u],prerelease:f[7],number:h*1e8+m*1e4+u}},n.versionSatisfies=function(l,c){c=c||"*";var f=n.versionParse(c),h=n.versionParse(l);if(f.isRange){if(f.operator==="*"||l==="*")return!0;if(f.operator===">")return h.number>f.number;if(f.operator===">=")return h.number>=f.number;if(f.operator==="~")return h.major===f.major&&h.minor===f.minor&&h.patch>=f.patch;if(f.operator==="^")return f.major>0?h.major===f.major&&h.number>=f.number:f.minor>0?h.minor===f.minor&&h.patch>=f.patch:h.patch===f.patch}return l===c||l==="*"}})()}),(function(t,r){var s={};t.exports=s,(function(){s.create=function(n){return{vertex:n,normalImpulse:0,tangentImpulse:0}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(7),l=s(18),c=s(13),f=s(19),h=s(5),m=s(6),u=s(10),o=s(0),d=s(4);(function(){n._deltaMax=1e3/60,n.create=function(v){v=v||{};var p={positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],plugin:{},gravity:{x:0,y:1,scale:.001},timing:{timestamp:0,timeScale:1,lastDelta:0,lastElapsed:0,lastUpdatesPerFrame:0}},g=o.extend(p,v);return g.world=v.world||m.create({label:"World"}),g.pairs=v.pairs||f.create(),g.detector=v.detector||c.create(),g.detector.pairs=g.pairs,g.grid={buckets:[]},g.world.gravity=g.gravity,g.broadphase=g.grid,g.metrics={},g},n.update=function(v,p){var g=o.now(),E=v.world,A=v.detector,M=v.pairs,_=v.timing,S=_.timestamp,T;p>n._deltaMax&&o.warnOnce("Matter.Engine.update: delta argument is recommended to be less than or equal to",n._deltaMax.toFixed(3),"ms."),p=typeof p<"u"?p:o._baseDelta,p*=_.timeScale,_.timestamp+=p,_.lastDelta=p;var x={timestamp:_.timestamp,delta:p};h.trigger(v,"beforeUpdate",x);var y=m.allBodies(E),w=m.allConstraints(E);for(E.isModified&&(c.setBodies(A,y),m.setModified(E,!1,!1,!0)),v.enableSleeping&&a.update(y,p),n._bodiesApplyGravity(y,v.gravity),p>0&&n._bodiesUpdate(y,p),h.trigger(v,"beforeSolve",x),u.preSolveAll(y),T=0;T<v.constraintIterations;T++)u.solveAll(w,p);u.postSolveAll(y);var R=c.collisions(A);f.update(M,R,S),v.enableSleeping&&a.afterCollisions(M.list),M.collisionStart.length>0&&h.trigger(v,"collisionStart",{pairs:M.collisionStart,timestamp:_.timestamp,delta:p});var C=o.clamp(20/v.positionIterations,0,1);for(l.preSolvePosition(M.list),T=0;T<v.positionIterations;T++)l.solvePosition(M.list,p,C);for(l.postSolvePosition(y),u.preSolveAll(y),T=0;T<v.constraintIterations;T++)u.solveAll(w,p);for(u.postSolveAll(y),l.preSolveVelocity(M.list),T=0;T<v.velocityIterations;T++)l.solveVelocity(M.list,p);return n._bodiesUpdateVelocities(y),M.collisionActive.length>0&&h.trigger(v,"collisionActive",{pairs:M.collisionActive,timestamp:_.timestamp,delta:p}),M.collisionEnd.length>0&&h.trigger(v,"collisionEnd",{pairs:M.collisionEnd,timestamp:_.timestamp,delta:p}),n._bodiesClearForces(y),h.trigger(v,"afterUpdate",x),v.timing.lastElapsed=o.now()-g,v},n.merge=function(v,p){if(o.extend(v,p),p.world){v.world=p.world,n.clear(v);for(var g=m.allBodies(v.world),E=0;E<g.length;E++){var A=g[E];a.set(A,!1),A.id=o.nextId()}}},n.clear=function(v){f.clear(v.pairs),c.clear(v.detector)},n._bodiesClearForces=function(v){for(var p=v.length,g=0;g<p;g++){var E=v[g];E.force.x=0,E.force.y=0,E.torque=0}},n._bodiesApplyGravity=function(v,p){var g=typeof p.scale<"u"?p.scale:.001,E=v.length;if(!(p.x===0&&p.y===0||g===0))for(var A=0;A<E;A++){var M=v[A];M.isStatic||M.isSleeping||(M.force.y+=M.mass*p.y*g,M.force.x+=M.mass*p.x*g)}},n._bodiesUpdate=function(v,p){for(var g=v.length,E=0;E<g;E++){var A=v[E];A.isStatic||A.isSleeping||d.update(A,p)}},n._bodiesUpdateVelocities=function(v){for(var p=v.length,g=0;g<p;g++)d.updateVelocities(v[g])}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(0),c=s(1);(function(){n._restingThresh=2,n._restingThreshTangent=Math.sqrt(6),n._positionDampen=.9,n._positionWarming=.8,n._frictionNormalMultiplier=5,n._frictionMaxStatic=Number.MAX_VALUE,n.preSolvePosition=function(f){var h,m,u,o=f.length;for(h=0;h<o;h++)m=f[h],m.isActive&&(u=m.contactCount,m.collision.parentA.totalContacts+=u,m.collision.parentB.totalContacts+=u)},n.solvePosition=function(f,h,m){var u,o,d,v,p,g,E,A,M=n._positionDampen*(m||1),_=l.clamp(h/l._baseDelta,0,1),S=f.length;for(u=0;u<S;u++)o=f[u],!(!o.isActive||o.isSensor)&&(d=o.collision,v=d.parentA,p=d.parentB,g=d.normal,o.separation=d.depth+g.x*(p.positionImpulse.x-v.positionImpulse.x)+g.y*(p.positionImpulse.y-v.positionImpulse.y));for(u=0;u<S;u++)o=f[u],!(!o.isActive||o.isSensor)&&(d=o.collision,v=d.parentA,p=d.parentB,g=d.normal,A=o.separation-o.slop*_,(v.isStatic||p.isStatic)&&(A*=2),v.isStatic||v.isSleeping||(E=M/v.totalContacts,v.positionImpulse.x+=g.x*A*E,v.positionImpulse.y+=g.y*A*E),p.isStatic||p.isSleeping||(E=M/p.totalContacts,p.positionImpulse.x-=g.x*A*E,p.positionImpulse.y-=g.y*A*E))},n.postSolvePosition=function(f){for(var h=n._positionWarming,m=f.length,u=a.translate,o=c.update,d=0;d<m;d++){var v=f[d],p=v.positionImpulse,g=p.x,E=p.y,A=v.velocity;if(v.totalContacts=0,g!==0||E!==0){for(var M=0;M<v.parts.length;M++){var _=v.parts[M];u(_.vertices,p),o(_.bounds,_.vertices,A),_.position.x+=g,_.position.y+=E}v.positionPrev.x+=g,v.positionPrev.y+=E,g*A.x+E*A.y<0?(p.x=0,p.y=0):(p.x*=h,p.y*=h)}}},n.preSolveVelocity=function(f){var h=f.length,m,u;for(m=0;m<h;m++){var o=f[m];if(!(!o.isActive||o.isSensor)){var d=o.contacts,v=o.contactCount,p=o.collision,g=p.parentA,E=p.parentB,A=p.normal,M=p.tangent;for(u=0;u<v;u++){var _=d[u],S=_.vertex,T=_.normalImpulse,x=_.tangentImpulse;if(T!==0||x!==0){var y=A.x*T+M.x*x,w=A.y*T+M.y*x;g.isStatic||g.isSleeping||(g.positionPrev.x+=y*g.inverseMass,g.positionPrev.y+=w*g.inverseMass,g.anglePrev+=g.inverseInertia*((S.x-g.position.x)*w-(S.y-g.position.y)*y)),E.isStatic||E.isSleeping||(E.positionPrev.x-=y*E.inverseMass,E.positionPrev.y-=w*E.inverseMass,E.anglePrev-=E.inverseInertia*((S.x-E.position.x)*w-(S.y-E.position.y)*y))}}}}},n.solveVelocity=function(f,h){var m=h/l._baseDelta,u=m*m,o=u*m,d=-n._restingThresh*m,v=n._restingThreshTangent,p=n._frictionNormalMultiplier*m,g=n._frictionMaxStatic,E=f.length,A,M,_,S;for(_=0;_<E;_++){var T=f[_];if(!(!T.isActive||T.isSensor)){var x=T.collision,y=x.parentA,w=x.parentB,R=x.normal.x,C=x.normal.y,D=x.tangent.x,N=x.tangent.y,I=T.inverseMass,z=T.friction*T.frictionStatic*p,U=T.contacts,W=T.contactCount,K=1/W,ie=y.position.x-y.positionPrev.x,se=y.position.y-y.positionPrev.y,oe=y.angle-y.anglePrev,De=w.position.x-w.positionPrev.x,qe=w.position.y-w.positionPrev.y,ne=w.angle-w.anglePrev;for(S=0;S<W;S++){var H=U[S],ee=H.vertex,J=ee.x-y.position.x,ye=ee.y-y.position.y,Ee=ee.x-w.position.x,xe=ee.y-w.position.y,re=ie-ye*oe,_e=se+J*oe,We=De-xe*ne,Ve=qe+Ee*ne,Be=re-We,ct=_e-Ve,ut=R*Be+C*ct,je=D*Be+N*ct,Ze=T.separation+ut,Xe=Math.min(Ze,1);Xe=Ze<0?0:Xe;var nt=Xe*z;je<-nt||je>nt?(M=je>0?je:-je,A=T.friction*(je>0?1:-1)*o,A<-M?A=-M:A>M&&(A=M)):(A=je,M=g);var O=J*C-ye*R,St=Ee*C-xe*R,Je=K/(I+y.inverseInertia*O*O+w.inverseInertia*St*St),L=(1+T.restitution)*ut*Je;if(A*=Je,ut<d)H.normalImpulse=0;else{var b=H.normalImpulse;H.normalImpulse+=L,H.normalImpulse>0&&(H.normalImpulse=0),L=H.normalImpulse-b}if(je<-v||je>v)H.tangentImpulse=0;else{var V=H.tangentImpulse;H.tangentImpulse+=A,H.tangentImpulse<-M&&(H.tangentImpulse=-M),H.tangentImpulse>M&&(H.tangentImpulse=M),A=H.tangentImpulse-V}var G=R*L+D*A,$=C*L+N*A;y.isStatic||y.isSleeping||(y.positionPrev.x+=G*y.inverseMass,y.positionPrev.y+=$*y.inverseMass,y.anglePrev+=(J*$-ye*G)*y.inverseInertia),w.isStatic||w.isSleeping||(w.positionPrev.x-=G*w.inverseMass,w.positionPrev.y-=$*w.inverseMass,w.anglePrev-=(Ee*$-xe*G)*w.inverseInertia)}}}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(9),l=s(0);(function(){n.create=function(c){return l.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},c)},n.update=function(c,f,h){var m=a.update,u=a.create,o=a.setActive,d=c.table,v=c.list,p=v.length,g=p,E=c.collisionStart,A=c.collisionEnd,M=c.collisionActive,_=f.length,S=0,T=0,x=0,y,w,R;for(R=0;R<_;R++)y=f[R],w=y.pair,w?(w.isActive&&(M[x++]=w),m(w,y,h)):(w=u(y,h),d[w.id]=w,E[S++]=w,v[g++]=w);for(g=0,p=v.length,R=0;R<p;R++)w=v[R],w.timeUpdated>=h?v[g++]=w:(o(w,!1,h),w.collision.bodyA.sleepCounter>0&&w.collision.bodyB.sleepCounter>0?v[g++]=w:(A[T++]=w,delete d[w.id]));v.length!==g&&(v.length=g),E.length!==S&&(E.length=S),A.length!==T&&(A.length=T),M.length!==x&&(M.length=x)},n.clear=function(c){return c.table={},c.list.length=0,c.collisionStart.length=0,c.collisionActive.length=0,c.collisionEnd.length=0,c}})()}),(function(t,r,s){var n=t.exports=s(21);n.Axes=s(11),n.Bodies=s(12),n.Body=s(4),n.Bounds=s(1),n.Collision=s(8),n.Common=s(0),n.Composite=s(6),n.Composites=s(22),n.Constraint=s(10),n.Contact=s(16),n.Detector=s(13),n.Engine=s(17),n.Events=s(5),n.Grid=s(23),n.Mouse=s(14),n.MouseConstraint=s(24),n.Pair=s(9),n.Pairs=s(19),n.Plugin=s(15),n.Query=s(25),n.Render=s(26),n.Resolver=s(18),n.Runner=s(27),n.SAT=s(28),n.Sleeping=s(7),n.Svg=s(29),n.Vector=s(2),n.Vertices=s(3),n.World=s(30),n.Engine.run=n.Runner.run,n.Common.deprecated(n.Engine,"run","Engine.run ➤ use Matter.Runner.run(engine) instead")}),(function(t,r,s){var n={};t.exports=n;var a=s(15),l=s(0);(function(){n.name="matter-js",n.version="0.20.0",n.uses=[],n.used=[],n.use=function(){a.use(n,Array.prototype.slice.call(arguments))},n.before=function(c,f){return c=c.replace(/^Matter./,""),l.chainPathBefore(n,c,f)},n.after=function(c,f){return c=c.replace(/^Matter./,""),l.chainPathAfter(n,c,f)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(6),l=s(10),c=s(0),f=s(4),h=s(12),m=c.deprecated;(function(){n.stack=function(u,o,d,v,p,g,E){for(var A=a.create({label:"Stack"}),M=u,_=o,S,T=0,x=0;x<v;x++){for(var y=0,w=0;w<d;w++){var R=E(M,_,w,x,S,T);if(R){var C=R.bounds.max.y-R.bounds.min.y,D=R.bounds.max.x-R.bounds.min.x;C>y&&(y=C),f.translate(R,{x:D*.5,y:C*.5}),M=R.bounds.max.x+p,a.addBody(A,R),S=R,T+=1}else M+=p}_+=y+g,M=u}return A},n.chain=function(u,o,d,v,p,g){for(var E=u.bodies,A=1;A<E.length;A++){var M=E[A-1],_=E[A],S=M.bounds.max.y-M.bounds.min.y,T=M.bounds.max.x-M.bounds.min.x,x=_.bounds.max.y-_.bounds.min.y,y=_.bounds.max.x-_.bounds.min.x,w={bodyA:M,pointA:{x:T*o,y:S*d},bodyB:_,pointB:{x:y*v,y:x*p}},R=c.extend(w,g);a.addConstraint(u,l.create(R))}return u.label+=" Chain",u},n.mesh=function(u,o,d,v,p){var g=u.bodies,E,A,M,_,S;for(E=0;E<d;E++){for(A=1;A<o;A++)M=g[A-1+E*o],_=g[A+E*o],a.addConstraint(u,l.create(c.extend({bodyA:M,bodyB:_},p)));if(E>0)for(A=0;A<o;A++)M=g[A+(E-1)*o],_=g[A+E*o],a.addConstraint(u,l.create(c.extend({bodyA:M,bodyB:_},p))),v&&A>0&&(S=g[A-1+(E-1)*o],a.addConstraint(u,l.create(c.extend({bodyA:S,bodyB:_},p)))),v&&A<o-1&&(S=g[A+1+(E-1)*o],a.addConstraint(u,l.create(c.extend({bodyA:S,bodyB:_},p))))}return u.label+=" Mesh",u},n.pyramid=function(u,o,d,v,p,g,E){return n.stack(u,o,d,v,p,g,function(A,M,_,S,T,x){var y=Math.min(v,Math.ceil(d/2)),w=T?T.bounds.max.x-T.bounds.min.x:0;if(!(S>y)){S=y-S;var R=S,C=d-1-S;if(!(_<R||_>C)){x===1&&f.translate(T,{x:(_+(d%2===1?1:-1))*w,y:0});var D=T?_*w:0;return E(u+D+_*p,M,_,S,T,x)}}})},n.newtonsCradle=function(u,o,d,v,p){for(var g=a.create({label:"Newtons Cradle"}),E=0;E<d;E++){var A=1.9,M=h.circle(u+E*(v*A),o+p,v,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),_=l.create({pointA:{x:u+E*(v*A),y:o},bodyB:M});a.addBody(g,M),a.addConstraint(g,_)}return g},m(n,"newtonsCradle","Composites.newtonsCradle ➤ moved to newtonsCradle example"),n.car=function(u,o,d,v,p){var g=f.nextGroup(!0),E=20,A=-d*.5+E,M=d*.5-E,_=0,S=a.create({label:"Car"}),T=h.rectangle(u,o,d,v,{collisionFilter:{group:g},chamfer:{radius:v*.5},density:2e-4}),x=h.circle(u+A,o+_,p,{collisionFilter:{group:g},friction:.8}),y=h.circle(u+M,o+_,p,{collisionFilter:{group:g},friction:.8}),w=l.create({bodyB:T,pointB:{x:A,y:_},bodyA:x,stiffness:1,length:0}),R=l.create({bodyB:T,pointB:{x:M,y:_},bodyA:y,stiffness:1,length:0});return a.addBody(S,T),a.addBody(S,x),a.addBody(S,y),a.addConstraint(S,w),a.addConstraint(S,R),S},m(n,"car","Composites.car ➤ moved to car example"),n.softBody=function(u,o,d,v,p,g,E,A,M,_){M=c.extend({inertia:1/0},M),_=c.extend({stiffness:.2,render:{type:"line",anchors:!1}},_);var S=n.stack(u,o,d,v,p,g,function(T,x){return h.circle(T,x,A,M)});return n.mesh(S,d,v,E,_),S.label="Soft Body",S},m(n,"softBody","Composites.softBody ➤ moved to softBody and cloth examples")})()}),(function(t,r,s){var n={};t.exports=n;var a=s(9),l=s(0),c=l.deprecated;(function(){n.create=function(f){var h={buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48};return l.extend(h,f)},n.update=function(f,h,m,u){var o,d,v,p=m.world,g=f.buckets,E,A,M=!1;for(o=0;o<h.length;o++){var _=h[o];if(!(_.isSleeping&&!u)&&!(p.bounds&&(_.bounds.max.x<p.bounds.min.x||_.bounds.min.x>p.bounds.max.x||_.bounds.max.y<p.bounds.min.y||_.bounds.min.y>p.bounds.max.y))){var S=n._getRegion(f,_);if(!_.region||S.id!==_.region.id||u){(!_.region||u)&&(_.region=S);var T=n._regionUnion(S,_.region);for(d=T.startCol;d<=T.endCol;d++)for(v=T.startRow;v<=T.endRow;v++){A=n._getBucketId(d,v),E=g[A];var x=d>=S.startCol&&d<=S.endCol&&v>=S.startRow&&v<=S.endRow,y=d>=_.region.startCol&&d<=_.region.endCol&&v>=_.region.startRow&&v<=_.region.endRow;!x&&y&&y&&E&&n._bucketRemoveBody(f,E,_),(_.region===S||x&&!y||u)&&(E||(E=n._createBucket(g,A)),n._bucketAddBody(f,E,_))}_.region=S,M=!0}}}M&&(f.pairsList=n._createActivePairsList(f))},c(n,"update","Grid.update ➤ replaced by Matter.Detector"),n.clear=function(f){f.buckets={},f.pairs={},f.pairsList=[]},c(n,"clear","Grid.clear ➤ replaced by Matter.Detector"),n._regionUnion=function(f,h){var m=Math.min(f.startCol,h.startCol),u=Math.max(f.endCol,h.endCol),o=Math.min(f.startRow,h.startRow),d=Math.max(f.endRow,h.endRow);return n._createRegion(m,u,o,d)},n._getRegion=function(f,h){var m=h.bounds,u=Math.floor(m.min.x/f.bucketWidth),o=Math.floor(m.max.x/f.bucketWidth),d=Math.floor(m.min.y/f.bucketHeight),v=Math.floor(m.max.y/f.bucketHeight);return n._createRegion(u,o,d,v)},n._createRegion=function(f,h,m,u){return{id:f+","+h+","+m+","+u,startCol:f,endCol:h,startRow:m,endRow:u}},n._getBucketId=function(f,h){return"C"+f+"R"+h},n._createBucket=function(f,h){var m=f[h]=[];return m},n._bucketAddBody=function(f,h,m){var u=f.pairs,o=a.id,d=h.length,v;for(v=0;v<d;v++){var p=h[v];if(!(m.id===p.id||m.isStatic&&p.isStatic)){var g=o(m,p),E=u[g];E?E[2]+=1:u[g]=[m,p,1]}}h.push(m)},n._bucketRemoveBody=function(f,h,m){var u=f.pairs,o=a.id,d;h.splice(l.indexOf(h,m),1);var v=h.length;for(d=0;d<v;d++){var p=u[o(m,h[d])];p&&(p[2]-=1)}},n._createActivePairsList=function(f){var h,m=f.pairs,u=l.keys(m),o=u.length,d=[],v;for(v=0;v<o;v++)h=m[u[v]],h[2]>0?d.push(h):delete m[u[v]];return d}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(3),l=s(7),c=s(14),f=s(5),h=s(13),m=s(10),u=s(6),o=s(0),d=s(1);(function(){n.create=function(v,p){var g=(v?v.mouse:null)||(p?p.mouse:null);g||(v&&v.render&&v.render.canvas?g=c.create(v.render.canvas):p&&p.element?g=c.create(p.element):(g=c.create(),o.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));var E=m.create({label:"Mouse Constraint",pointA:g.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),A={type:"mouseConstraint",mouse:g,element:null,body:null,constraint:E,collisionFilter:{category:1,mask:4294967295,group:0}},M=o.extend(A,p);return f.on(v,"beforeUpdate",function(){var _=u.allBodies(v.world);n.update(M,_),n._triggerEvents(M)}),M},n.update=function(v,p){var g=v.mouse,E=v.constraint,A=v.body;if(g.button===0){if(E.bodyB)l.set(E.bodyB,!1),E.pointA=g.position;else for(var M=0;M<p.length;M++)if(A=p[M],d.contains(A.bounds,g.position)&&h.canCollide(A.collisionFilter,v.collisionFilter))for(var _=A.parts.length>1?1:0;_<A.parts.length;_++){var S=A.parts[_];if(a.contains(S.vertices,g.position)){E.pointA=g.position,E.bodyB=v.body=A,E.pointB={x:g.position.x-A.position.x,y:g.position.y-A.position.y},E.angleB=A.angle,l.set(A,!1),f.trigger(v,"startdrag",{mouse:g,body:A});break}}}else E.bodyB=v.body=null,E.pointB=null,A&&f.trigger(v,"enddrag",{mouse:g,body:A})},n._triggerEvents=function(v){var p=v.mouse,g=p.sourceEvents;g.mousemove&&f.trigger(v,"mousemove",{mouse:p}),g.mousedown&&f.trigger(v,"mousedown",{mouse:p}),g.mouseup&&f.trigger(v,"mouseup",{mouse:p}),c.clearSourceEvents(p)}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(2),l=s(8),c=s(1),f=s(12),h=s(3);(function(){n.collides=function(m,u){for(var o=[],d=u.length,v=m.bounds,p=l.collides,g=c.overlaps,E=0;E<d;E++){var A=u[E],M=A.parts.length,_=M===1?0:1;if(g(A.bounds,v))for(var S=_;S<M;S++){var T=A.parts[S];if(g(T.bounds,v)){var x=p(T,m);if(x){o.push(x);break}}}}return o},n.ray=function(m,u,o,d){d=d||1e-100;for(var v=a.angle(u,o),p=a.magnitude(a.sub(u,o)),g=(o.x+u.x)*.5,E=(o.y+u.y)*.5,A=f.rectangle(g,E,p,d,{angle:v}),M=n.collides(A,m),_=0;_<M.length;_+=1){var S=M[_];S.body=S.bodyB=S.bodyA}return M},n.region=function(m,u,o){for(var d=[],v=0;v<m.length;v++){var p=m[v],g=c.overlaps(p.bounds,u);(g&&!o||!g&&o)&&d.push(p)}return d},n.point=function(m,u){for(var o=[],d=0;d<m.length;d++){var v=m[d];if(c.contains(v.bounds,u))for(var p=v.parts.length===1?0:1;p<v.parts.length;p++){var g=v.parts[p];if(c.contains(g.bounds,u)&&h.contains(g.vertices,u)){o.push(v);break}}}return o}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(4),l=s(0),c=s(6),f=s(1),h=s(5),m=s(2),u=s(14);(function(){var o,d;typeof window<"u"&&(o=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(_){window.setTimeout(function(){_(l.now())},1e3/60)},d=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),n._goodFps=30,n._goodDelta=1e3/60,n.create=function(_){var S={engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,timing:{historySize:60,delta:0,deltaHistory:[],lastTime:0,lastTimestamp:0,lastElapsed:0,timestampElapsed:0,timestampElapsedHistory:[],engineDeltaHistory:[],engineElapsedHistory:[],engineUpdatesHistory:[],elapsedHistory:[]},options:{width:800,height:600,pixelRatio:1,background:"#14151f",wireframeBackground:"#14151f",wireframeStrokeStyle:"#bbb",hasBounds:!!_.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showStats:!1,showPerformance:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},T=l.extend(S,_);return T.canvas&&(T.canvas.width=T.options.width||T.canvas.width,T.canvas.height=T.options.height||T.canvas.height),T.mouse=_.mouse,T.engine=_.engine,T.canvas=T.canvas||g(T.options.width,T.options.height),T.context=T.canvas.getContext("2d"),T.textures={},T.bounds=T.bounds||{min:{x:0,y:0},max:{x:T.canvas.width,y:T.canvas.height}},T.controller=n,T.options.showBroadphase=!1,T.options.pixelRatio!==1&&n.setPixelRatio(T,T.options.pixelRatio),l.isElement(T.element)&&T.element.appendChild(T.canvas),T},n.run=function(_){(function S(T){_.frameRequestId=o(S),v(_,T),n.world(_,T),_.context.setTransform(_.options.pixelRatio,0,0,_.options.pixelRatio,0,0),(_.options.showStats||_.options.showDebug)&&n.stats(_,_.context,T),(_.options.showPerformance||_.options.showDebug)&&n.performance(_,_.context,T),_.context.setTransform(1,0,0,1,0,0)})()},n.stop=function(_){d(_.frameRequestId)},n.setPixelRatio=function(_,S){var T=_.options,x=_.canvas;S==="auto"&&(S=E(x)),T.pixelRatio=S,x.setAttribute("data-pixel-ratio",S),x.width=T.width*S,x.height=T.height*S,x.style.width=T.width+"px",x.style.height=T.height+"px"},n.setSize=function(_,S,T){_.options.width=S,_.options.height=T,_.bounds.max.x=_.bounds.min.x+S,_.bounds.max.y=_.bounds.min.y+T,_.options.pixelRatio!==1?n.setPixelRatio(_,_.options.pixelRatio):(_.canvas.width=S,_.canvas.height=T)},n.lookAt=function(_,S,T,x){x=typeof x<"u"?x:!0,S=l.isArray(S)?S:[S],T=T||{x:0,y:0};for(var y={min:{x:1/0,y:1/0},max:{x:-1/0,y:-1/0}},w=0;w<S.length;w+=1){var R=S[w],C=R.bounds?R.bounds.min:R.min||R.position||R,D=R.bounds?R.bounds.max:R.max||R.position||R;C&&D&&(C.x<y.min.x&&(y.min.x=C.x),D.x>y.max.x&&(y.max.x=D.x),C.y<y.min.y&&(y.min.y=C.y),D.y>y.max.y&&(y.max.y=D.y))}var N=y.max.x-y.min.x+2*T.x,I=y.max.y-y.min.y+2*T.y,z=_.canvas.height,U=_.canvas.width,W=U/z,K=N/I,ie=1,se=1;K>W?se=K/W:ie=W/K,_.options.hasBounds=!0,_.bounds.min.x=y.min.x,_.bounds.max.x=y.min.x+N*ie,_.bounds.min.y=y.min.y,_.bounds.max.y=y.min.y+I*se,x&&(_.bounds.min.x+=N*.5-N*ie*.5,_.bounds.max.x+=N*.5-N*ie*.5,_.bounds.min.y+=I*.5-I*se*.5,_.bounds.max.y+=I*.5-I*se*.5),_.bounds.min.x-=T.x,_.bounds.max.x-=T.x,_.bounds.min.y-=T.y,_.bounds.max.y-=T.y,_.mouse&&(u.setScale(_.mouse,{x:(_.bounds.max.x-_.bounds.min.x)/_.canvas.width,y:(_.bounds.max.y-_.bounds.min.y)/_.canvas.height}),u.setOffset(_.mouse,_.bounds.min))},n.startViewTransform=function(_){var S=_.bounds.max.x-_.bounds.min.x,T=_.bounds.max.y-_.bounds.min.y,x=S/_.options.width,y=T/_.options.height;_.context.setTransform(_.options.pixelRatio/x,0,0,_.options.pixelRatio/y,0,0),_.context.translate(-_.bounds.min.x,-_.bounds.min.y)},n.endViewTransform=function(_){_.context.setTransform(_.options.pixelRatio,0,0,_.options.pixelRatio,0,0)},n.world=function(_,S){var T=l.now(),x=_.engine,y=x.world,w=_.canvas,R=_.context,C=_.options,D=_.timing,N=c.allBodies(y),I=c.allConstraints(y),z=C.wireframes?C.wireframeBackground:C.background,U=[],W=[],K,ie={timestamp:x.timing.timestamp};if(h.trigger(_,"beforeRender",ie),_.currentBackground!==z&&M(_,z),R.globalCompositeOperation="source-in",R.fillStyle="transparent",R.fillRect(0,0,w.width,w.height),R.globalCompositeOperation="source-over",C.hasBounds){for(K=0;K<N.length;K++){var se=N[K];f.overlaps(se.bounds,_.bounds)&&U.push(se)}for(K=0;K<I.length;K++){var oe=I[K],De=oe.bodyA,qe=oe.bodyB,ne=oe.pointA,H=oe.pointB;De&&(ne=m.add(De.position,oe.pointA)),qe&&(H=m.add(qe.position,oe.pointB)),!(!ne||!H)&&(f.contains(_.bounds,ne)||f.contains(_.bounds,H))&&W.push(oe)}n.startViewTransform(_),_.mouse&&(u.setScale(_.mouse,{x:(_.bounds.max.x-_.bounds.min.x)/_.options.width,y:(_.bounds.max.y-_.bounds.min.y)/_.options.height}),u.setOffset(_.mouse,_.bounds.min))}else W=I,U=N,_.options.pixelRatio!==1&&_.context.setTransform(_.options.pixelRatio,0,0,_.options.pixelRatio,0,0);!C.wireframes||x.enableSleeping&&C.showSleeping?n.bodies(_,U,R):(C.showConvexHulls&&n.bodyConvexHulls(_,U,R),n.bodyWireframes(_,U,R)),C.showBounds&&n.bodyBounds(_,U,R),(C.showAxes||C.showAngleIndicator)&&n.bodyAxes(_,U,R),C.showPositions&&n.bodyPositions(_,U,R),C.showVelocity&&n.bodyVelocity(_,U,R),C.showIds&&n.bodyIds(_,U,R),C.showSeparations&&n.separations(_,x.pairs.list,R),C.showCollisions&&n.collisions(_,x.pairs.list,R),C.showVertexNumbers&&n.vertexNumbers(_,U,R),C.showMousePosition&&n.mousePosition(_,_.mouse,R),n.constraints(W,R),C.hasBounds&&n.endViewTransform(_),h.trigger(_,"afterRender",ie),D.lastElapsed=l.now()-T},n.stats=function(_,S,T){for(var x=_.engine,y=x.world,w=c.allBodies(y),R=0,C=55,D=44,N=0,I=0,z=0;z<w.length;z+=1)R+=w[z].parts.length;var U={Part:R,Body:w.length,Cons:c.allConstraints(y).length,Comp:c.allComposites(y).length,Pair:x.pairs.list.length};S.fillStyle="#0e0f19",S.fillRect(N,I,C*5.5,D),S.font="12px Arial",S.textBaseline="top",S.textAlign="right";for(var W in U){var K=U[W];S.fillStyle="#aaa",S.fillText(W,N+C,I+8),S.fillStyle="#eee",S.fillText(K,N+C,I+26),N+=C}},n.performance=function(_,S){var T=_.engine,x=_.timing,y=x.deltaHistory,w=x.elapsedHistory,R=x.timestampElapsedHistory,C=x.engineDeltaHistory,D=x.engineUpdatesHistory,N=x.engineElapsedHistory,I=T.timing.lastUpdatesPerFrame,z=T.timing.lastDelta,U=p(y),W=p(w),K=p(C),ie=p(D),se=p(N),oe=p(R),De=oe/U||0,qe=Math.round(U/z),ne=1e3/U||0,H=4,ee=12,J=60,ye=34,Ee=10,xe=69;S.fillStyle="#0e0f19",S.fillRect(0,50,ee*5+J*6+22,ye),n.status(S,Ee,xe,J,H,y.length,Math.round(ne)+" fps",ne/n._goodFps,function(re){return y[re]/U-1}),n.status(S,Ee+ee+J,xe,J,H,C.length,z.toFixed(2)+" dt",n._goodDelta/z,function(re){return C[re]/K-1}),n.status(S,Ee+(ee+J)*2,xe,J,H,D.length,I+" upf",Math.pow(l.clamp(ie/qe||1,0,1),4),function(re){return D[re]/ie-1}),n.status(S,Ee+(ee+J)*3,xe,J,H,N.length,se.toFixed(2)+" ut",1-I*se/n._goodFps,function(re){return N[re]/se-1}),n.status(S,Ee+(ee+J)*4,xe,J,H,w.length,W.toFixed(2)+" rt",1-W/n._goodFps,function(re){return w[re]/W-1}),n.status(S,Ee+(ee+J)*5,xe,J,H,R.length,De.toFixed(2)+" x",De*De*De,function(re){return(R[re]/y[re]/De||0)-1})},n.status=function(_,S,T,x,y,w,R,C,D){_.strokeStyle="#888",_.fillStyle="#444",_.lineWidth=1,_.fillRect(S,T+7,x,1),_.beginPath(),_.moveTo(S,T+7-y*l.clamp(.4*D(0),-2,2));for(var N=0;N<x;N+=1)_.lineTo(S+N,T+7-(N<w?y*l.clamp(.4*D(N),-2,2):0));_.stroke(),_.fillStyle="hsl("+l.clamp(25+95*C,0,120)+",100%,60%)",_.fillRect(S,T-7,4,4),_.font="12px Arial",_.textBaseline="middle",_.textAlign="right",_.fillStyle="#eee",_.fillText(R,S+x,T-5)},n.constraints=function(_,S){for(var T=S,x=0;x<_.length;x++){var y=_[x];if(!(!y.render.visible||!y.pointA||!y.pointB)){var w=y.bodyA,R=y.bodyB,C,D;if(w?C=m.add(w.position,y.pointA):C=y.pointA,y.render.type==="pin")T.beginPath(),T.arc(C.x,C.y,3,0,2*Math.PI),T.closePath();else{if(R?D=m.add(R.position,y.pointB):D=y.pointB,T.beginPath(),T.moveTo(C.x,C.y),y.render.type==="spring")for(var N=m.sub(D,C),I=m.perp(m.normalise(N)),z=Math.ceil(l.clamp(y.length/5,12,20)),U,W=1;W<z;W+=1)U=W%2===0?1:-1,T.lineTo(C.x+N.x*(W/z)+I.x*U*4,C.y+N.y*(W/z)+I.y*U*4);T.lineTo(D.x,D.y)}y.render.lineWidth&&(T.lineWidth=y.render.lineWidth,T.strokeStyle=y.render.strokeStyle,T.stroke()),y.render.anchors&&(T.fillStyle=y.render.strokeStyle,T.beginPath(),T.arc(C.x,C.y,3,0,2*Math.PI),T.arc(D.x,D.y,3,0,2*Math.PI),T.closePath(),T.fill())}}},n.bodies=function(_,S,T){var x=T;_.engine;var y=_.options,w=y.showInternalEdges||!y.wireframes,R,C,D,N;for(D=0;D<S.length;D++)if(R=S[D],!!R.render.visible){for(N=R.parts.length>1?1:0;N<R.parts.length;N++)if(C=R.parts[N],!!C.render.visible){if(y.showSleeping&&R.isSleeping?x.globalAlpha=.5*C.render.opacity:C.render.opacity!==1&&(x.globalAlpha=C.render.opacity),C.render.sprite&&C.render.sprite.texture&&!y.wireframes){var I=C.render.sprite,z=A(_,I.texture);x.translate(C.position.x,C.position.y),x.rotate(C.angle),x.drawImage(z,z.width*-I.xOffset*I.xScale,z.height*-I.yOffset*I.yScale,z.width*I.xScale,z.height*I.yScale),x.rotate(-C.angle),x.translate(-C.position.x,-C.position.y)}else{if(C.circleRadius)x.beginPath(),x.arc(C.position.x,C.position.y,C.circleRadius,0,2*Math.PI);else{x.beginPath(),x.moveTo(C.vertices[0].x,C.vertices[0].y);for(var U=1;U<C.vertices.length;U++)!C.vertices[U-1].isInternal||w?x.lineTo(C.vertices[U].x,C.vertices[U].y):x.moveTo(C.vertices[U].x,C.vertices[U].y),C.vertices[U].isInternal&&!w&&x.moveTo(C.vertices[(U+1)%C.vertices.length].x,C.vertices[(U+1)%C.vertices.length].y);x.lineTo(C.vertices[0].x,C.vertices[0].y),x.closePath()}y.wireframes?(x.lineWidth=1,x.strokeStyle=_.options.wireframeStrokeStyle,x.stroke()):(x.fillStyle=C.render.fillStyle,C.render.lineWidth&&(x.lineWidth=C.render.lineWidth,x.strokeStyle=C.render.strokeStyle,x.stroke()),x.fill())}x.globalAlpha=1}}},n.bodyWireframes=function(_,S,T){var x=T,y=_.options.showInternalEdges,w,R,C,D,N;for(x.beginPath(),C=0;C<S.length;C++)if(w=S[C],!!w.render.visible)for(N=w.parts.length>1?1:0;N<w.parts.length;N++){for(R=w.parts[N],x.moveTo(R.vertices[0].x,R.vertices[0].y),D=1;D<R.vertices.length;D++)!R.vertices[D-1].isInternal||y?x.lineTo(R.vertices[D].x,R.vertices[D].y):x.moveTo(R.vertices[D].x,R.vertices[D].y),R.vertices[D].isInternal&&!y&&x.moveTo(R.vertices[(D+1)%R.vertices.length].x,R.vertices[(D+1)%R.vertices.length].y);x.lineTo(R.vertices[0].x,R.vertices[0].y)}x.lineWidth=1,x.strokeStyle=_.options.wireframeStrokeStyle,x.stroke()},n.bodyConvexHulls=function(_,S,T){var x=T,y,w,R;for(x.beginPath(),w=0;w<S.length;w++)if(y=S[w],!(!y.render.visible||y.parts.length===1)){for(x.moveTo(y.vertices[0].x,y.vertices[0].y),R=1;R<y.vertices.length;R++)x.lineTo(y.vertices[R].x,y.vertices[R].y);x.lineTo(y.vertices[0].x,y.vertices[0].y)}x.lineWidth=1,x.strokeStyle="rgba(255,255,255,0.2)",x.stroke()},n.vertexNumbers=function(_,S,T){var x=T,y,w,R;for(y=0;y<S.length;y++){var C=S[y].parts;for(R=C.length>1?1:0;R<C.length;R++){var D=C[R];for(w=0;w<D.vertices.length;w++)x.fillStyle="rgba(255,255,255,0.2)",x.fillText(y+"_"+w,D.position.x+(D.vertices[w].x-D.position.x)*.8,D.position.y+(D.vertices[w].y-D.position.y)*.8)}}},n.mousePosition=function(_,S,T){var x=T;x.fillStyle="rgba(255,255,255,0.8)",x.fillText(S.position.x+"  "+S.position.y,S.position.x+5,S.position.y-5)},n.bodyBounds=function(_,S,T){var x=T;_.engine;var y=_.options;x.beginPath();for(var w=0;w<S.length;w++){var R=S[w];if(R.render.visible)for(var C=S[w].parts,D=C.length>1?1:0;D<C.length;D++){var N=C[D];x.rect(N.bounds.min.x,N.bounds.min.y,N.bounds.max.x-N.bounds.min.x,N.bounds.max.y-N.bounds.min.y)}}y.wireframes?x.strokeStyle="rgba(255,255,255,0.08)":x.strokeStyle="rgba(0,0,0,0.1)",x.lineWidth=1,x.stroke()},n.bodyAxes=function(_,S,T){var x=T;_.engine;var y=_.options,w,R,C,D;for(x.beginPath(),R=0;R<S.length;R++){var N=S[R],I=N.parts;if(N.render.visible)if(y.showAxes)for(C=I.length>1?1:0;C<I.length;C++)for(w=I[C],D=0;D<w.axes.length;D++){var z=w.axes[D];x.moveTo(w.position.x,w.position.y),x.lineTo(w.position.x+z.x*20,w.position.y+z.y*20)}else for(C=I.length>1?1:0;C<I.length;C++)for(w=I[C],D=0;D<w.axes.length;D++)x.moveTo(w.position.x,w.position.y),x.lineTo((w.vertices[0].x+w.vertices[w.vertices.length-1].x)/2,(w.vertices[0].y+w.vertices[w.vertices.length-1].y)/2)}y.wireframes?(x.strokeStyle="indianred",x.lineWidth=1):(x.strokeStyle="rgba(255, 255, 255, 0.4)",x.globalCompositeOperation="overlay",x.lineWidth=2),x.stroke(),x.globalCompositeOperation="source-over"},n.bodyPositions=function(_,S,T){var x=T;_.engine;var y=_.options,w,R,C,D;for(x.beginPath(),C=0;C<S.length;C++)if(w=S[C],!!w.render.visible)for(D=0;D<w.parts.length;D++)R=w.parts[D],x.arc(R.position.x,R.position.y,3,0,2*Math.PI,!1),x.closePath();for(y.wireframes?x.fillStyle="indianred":x.fillStyle="rgba(0,0,0,0.5)",x.fill(),x.beginPath(),C=0;C<S.length;C++)w=S[C],w.render.visible&&(x.arc(w.positionPrev.x,w.positionPrev.y,2,0,2*Math.PI,!1),x.closePath());x.fillStyle="rgba(255,165,0,0.8)",x.fill()},n.bodyVelocity=function(_,S,T){var x=T;x.beginPath();for(var y=0;y<S.length;y++){var w=S[y];if(w.render.visible){var R=a.getVelocity(w);x.moveTo(w.position.x,w.position.y),x.lineTo(w.position.x+R.x,w.position.y+R.y)}}x.lineWidth=3,x.strokeStyle="cornflowerblue",x.stroke()},n.bodyIds=function(_,S,T){var x=T,y,w;for(y=0;y<S.length;y++)if(S[y].render.visible){var R=S[y].parts;for(w=R.length>1?1:0;w<R.length;w++){var C=R[w];x.font="12px Arial",x.fillStyle="rgba(255,255,255,0.5)",x.fillText(C.id,C.position.x+10,C.position.y-10)}}},n.collisions=function(_,S,T){var x=T,y=_.options,w,R,C,D;for(x.beginPath(),C=0;C<S.length;C++)if(w=S[C],!!w.isActive)for(R=w.collision,D=0;D<w.contactCount;D++){var N=w.contacts[D],I=N.vertex;x.rect(I.x-1.5,I.y-1.5,3.5,3.5)}for(y.wireframes?x.fillStyle="rgba(255,255,255,0.7)":x.fillStyle="orange",x.fill(),x.beginPath(),C=0;C<S.length;C++)if(w=S[C],!!w.isActive&&(R=w.collision,w.contactCount>0)){var z=w.contacts[0].vertex.x,U=w.contacts[0].vertex.y;w.contactCount===2&&(z=(w.contacts[0].vertex.x+w.contacts[1].vertex.x)/2,U=(w.contacts[0].vertex.y+w.contacts[1].vertex.y)/2),R.bodyB===R.supports[0].body||R.bodyA.isStatic===!0?x.moveTo(z-R.normal.x*8,U-R.normal.y*8):x.moveTo(z+R.normal.x*8,U+R.normal.y*8),x.lineTo(z,U)}y.wireframes?x.strokeStyle="rgba(255,165,0,0.7)":x.strokeStyle="orange",x.lineWidth=1,x.stroke()},n.separations=function(_,S,T){var x=T,y=_.options,w,R,C,D,N;for(x.beginPath(),N=0;N<S.length;N++)if(w=S[N],!!w.isActive){R=w.collision,C=R.bodyA,D=R.bodyB;var I=1;!D.isStatic&&!C.isStatic&&(I=.5),D.isStatic&&(I=0),x.moveTo(D.position.x,D.position.y),x.lineTo(D.position.x-R.penetration.x*I,D.position.y-R.penetration.y*I),I=1,!D.isStatic&&!C.isStatic&&(I=.5),C.isStatic&&(I=0),x.moveTo(C.position.x,C.position.y),x.lineTo(C.position.x+R.penetration.x*I,C.position.y+R.penetration.y*I)}y.wireframes?x.strokeStyle="rgba(255,165,0,0.5)":x.strokeStyle="orange",x.stroke()},n.inspector=function(_,S){_.engine;var T=_.selected,x=_.render,y=x.options,w;if(y.hasBounds){var R=x.bounds.max.x-x.bounds.min.x,C=x.bounds.max.y-x.bounds.min.y,D=R/x.options.width,N=C/x.options.height;S.scale(1/D,1/N),S.translate(-x.bounds.min.x,-x.bounds.min.y)}for(var I=0;I<T.length;I++){var z=T[I].data;switch(S.translate(.5,.5),S.lineWidth=1,S.strokeStyle="rgba(255,165,0,0.9)",S.setLineDash([1,2]),z.type){case"body":w=z.bounds,S.beginPath(),S.rect(Math.floor(w.min.x-3),Math.floor(w.min.y-3),Math.floor(w.max.x-w.min.x+6),Math.floor(w.max.y-w.min.y+6)),S.closePath(),S.stroke();break;case"constraint":var U=z.pointA;z.bodyA&&(U=z.pointB),S.beginPath(),S.arc(U.x,U.y,10,0,2*Math.PI),S.closePath(),S.stroke();break}S.setLineDash([]),S.translate(-.5,-.5)}_.selectStart!==null&&(S.translate(.5,.5),S.lineWidth=1,S.strokeStyle="rgba(255,165,0,0.6)",S.fillStyle="rgba(255,165,0,0.1)",w=_.selectBounds,S.beginPath(),S.rect(Math.floor(w.min.x),Math.floor(w.min.y),Math.floor(w.max.x-w.min.x),Math.floor(w.max.y-w.min.y)),S.closePath(),S.stroke(),S.fill(),S.translate(-.5,-.5)),y.hasBounds&&S.setTransform(1,0,0,1,0,0)};var v=function(_,S){var T=_.engine,x=_.timing,y=x.historySize,w=T.timing.timestamp;x.delta=S-x.lastTime||n._goodDelta,x.lastTime=S,x.timestampElapsed=w-x.lastTimestamp||0,x.lastTimestamp=w,x.deltaHistory.unshift(x.delta),x.deltaHistory.length=Math.min(x.deltaHistory.length,y),x.engineDeltaHistory.unshift(T.timing.lastDelta),x.engineDeltaHistory.length=Math.min(x.engineDeltaHistory.length,y),x.timestampElapsedHistory.unshift(x.timestampElapsed),x.timestampElapsedHistory.length=Math.min(x.timestampElapsedHistory.length,y),x.engineUpdatesHistory.unshift(T.timing.lastUpdatesPerFrame),x.engineUpdatesHistory.length=Math.min(x.engineUpdatesHistory.length,y),x.engineElapsedHistory.unshift(T.timing.lastElapsed),x.engineElapsedHistory.length=Math.min(x.engineElapsedHistory.length,y),x.elapsedHistory.unshift(x.lastElapsed),x.elapsedHistory.length=Math.min(x.elapsedHistory.length,y)},p=function(_){for(var S=0,T=0;T<_.length;T+=1)S+=_[T];return S/_.length||0},g=function(_,S){var T=document.createElement("canvas");return T.width=_,T.height=S,T.oncontextmenu=function(){return!1},T.onselectstart=function(){return!1},T},E=function(_){var S=_.getContext("2d"),T=window.devicePixelRatio||1,x=S.webkitBackingStorePixelRatio||S.mozBackingStorePixelRatio||S.msBackingStorePixelRatio||S.oBackingStorePixelRatio||S.backingStorePixelRatio||1;return T/x},A=function(_,S){var T=_.textures[S];return T||(T=_.textures[S]=new Image,T.src=S,T)},M=function(_,S){var T=S;/(jpg|gif|png)$/.test(S)&&(T="url("+S+")"),_.canvas.style.background=T,_.canvas.style.backgroundSize="contain",_.currentBackground=S}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(5),l=s(17),c=s(0);(function(){n._maxFrameDelta=1e3/15,n._frameDeltaFallback=1e3/60,n._timeBufferMargin=1.5,n._elapsedNextEstimate=1,n._smoothingLowerBound=.1,n._smoothingUpperBound=.9,n.create=function(h){var m={delta:16.666666666666668,frameDelta:null,frameDeltaSmoothing:!0,frameDeltaSnapping:!0,frameDeltaHistory:[],frameDeltaHistorySize:100,frameRequestId:null,timeBuffer:0,timeLastTick:null,maxUpdates:null,maxFrameTime:33.333333333333336,lastUpdatesDeferred:0,enabled:!0},u=c.extend(m,h);return u.fps=0,u},n.run=function(h,m){return h.timeBuffer=n._frameDeltaFallback,(function u(o){h.frameRequestId=n._onNextFrame(h,u),o&&h.enabled&&n.tick(h,m,o)})(),h},n.tick=function(h,m,u){var o=c.now(),d=h.delta,v=0,p=u-h.timeLastTick;if((!p||!h.timeLastTick||p>Math.max(n._maxFrameDelta,h.maxFrameTime))&&(p=h.frameDelta||n._frameDeltaFallback),h.frameDeltaSmoothing){h.frameDeltaHistory.push(p),h.frameDeltaHistory=h.frameDeltaHistory.slice(-h.frameDeltaHistorySize);var g=h.frameDeltaHistory.slice(0).sort(),E=h.frameDeltaHistory.slice(g.length*n._smoothingLowerBound,g.length*n._smoothingUpperBound),A=f(E);p=A||p}h.frameDeltaSnapping&&(p=1e3/Math.round(1e3/p)),h.frameDelta=p,h.timeLastTick=u,h.timeBuffer+=h.frameDelta,h.timeBuffer=c.clamp(h.timeBuffer,0,h.frameDelta+d*n._timeBufferMargin),h.lastUpdatesDeferred=0;var M=h.maxUpdates||Math.ceil(h.maxFrameTime/d),_={timestamp:m.timing.timestamp};a.trigger(h,"beforeTick",_),a.trigger(h,"tick",_);for(var S=c.now();d>0&&h.timeBuffer>=d*n._timeBufferMargin;){a.trigger(h,"beforeUpdate",_),l.update(m,d),a.trigger(h,"afterUpdate",_),h.timeBuffer-=d,v+=1;var T=c.now()-o,x=c.now()-S,y=T+n._elapsedNextEstimate*x/v;if(v>=M||y>h.maxFrameTime){h.lastUpdatesDeferred=Math.round(Math.max(0,h.timeBuffer/d-n._timeBufferMargin));break}}m.timing.lastUpdatesPerFrame=v,a.trigger(h,"afterTick",_),h.frameDeltaHistory.length>=100&&(h.lastUpdatesDeferred&&Math.round(h.frameDelta/d)>M?c.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs."):h.lastUpdatesDeferred&&c.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."),typeof h.isFixed<"u"&&c.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."),(h.deltaMin||h.deltaMax)&&c.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."),h.fps!==0&&c.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."))},n.stop=function(h){n._cancelNextFrame(h)},n._onNextFrame=function(h,m){if(typeof window<"u"&&window.requestAnimationFrame)h.frameRequestId=window.requestAnimationFrame(m);else throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");return h.frameRequestId},n._cancelNextFrame=function(h){if(typeof window<"u"&&window.cancelAnimationFrame)window.cancelAnimationFrame(h.frameRequestId);else throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.")};var f=function(h){for(var m=0,u=h.length,o=0;o<u;o+=1)m+=h[o];return m/u||0}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(8),l=s(0),c=l.deprecated;(function(){n.collides=function(f,h){return a.collides(f,h)},c(n,"collides","SAT.collides ➤ replaced by Collision.collides")})()}),(function(t,r,s){var n={};t.exports=n,s(1);var a=s(0);(function(){n.pathToVertices=function(l,c){typeof window<"u"&&!("SVGPathSeg"in window)&&a.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");var f,h,m,u,o,d,v,p,g,E,A=[],M,_,S=0,T=0,x=0;c=c||15;var y=function(R,C,D){var N=D%2===1&&D>1;if(!g||R!=g.x||C!=g.y){g&&N?(M=g.x,_=g.y):(M=0,_=0);var I={x:M+R,y:_+C};(N||!g)&&(g=I),A.push(I),T=M+R,x=_+C}},w=function(R){var C=R.pathSegTypeAsLetter.toUpperCase();if(C!=="Z"){switch(C){case"M":case"L":case"T":case"C":case"S":case"Q":T=R.x,x=R.y;break;case"H":T=R.x;break;case"V":x=R.y;break}y(T,x,R.pathSegType)}};for(n._svgPathToAbsolute(l),m=l.getTotalLength(),d=[],f=0;f<l.pathSegList.numberOfItems;f+=1)d.push(l.pathSegList.getItem(f));for(v=d.concat();S<m;){if(E=l.getPathSegAtLength(S),o=d[E],o!=p){for(;v.length&&v[0]!=o;)w(v.shift());p=o}switch(o.pathSegTypeAsLetter.toUpperCase()){case"C":case"T":case"S":case"Q":case"A":u=l.getPointAtLength(S),y(u.x,u.y,0);break}S+=c}for(f=0,h=v.length;f<h;++f)w(v[f]);return A},n._svgPathToAbsolute=function(l){for(var c,f,h,m,u,o,d=l.pathSegList,v=0,p=0,g=d.numberOfItems,E=0;E<g;++E){var A=d.getItem(E),M=A.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(M))"x"in A&&(v=A.x),"y"in A&&(p=A.y);else switch("x1"in A&&(h=v+A.x1),"x2"in A&&(u=v+A.x2),"y1"in A&&(m=p+A.y1),"y2"in A&&(o=p+A.y2),"x"in A&&(v+=A.x),"y"in A&&(p+=A.y),M){case"m":d.replaceItem(l.createSVGPathSegMovetoAbs(v,p),E);break;case"l":d.replaceItem(l.createSVGPathSegLinetoAbs(v,p),E);break;case"h":d.replaceItem(l.createSVGPathSegLinetoHorizontalAbs(v),E);break;case"v":d.replaceItem(l.createSVGPathSegLinetoVerticalAbs(p),E);break;case"c":d.replaceItem(l.createSVGPathSegCurvetoCubicAbs(v,p,h,m,u,o),E);break;case"s":d.replaceItem(l.createSVGPathSegCurvetoCubicSmoothAbs(v,p,u,o),E);break;case"q":d.replaceItem(l.createSVGPathSegCurvetoQuadraticAbs(v,p,h,m),E);break;case"t":d.replaceItem(l.createSVGPathSegCurvetoQuadraticSmoothAbs(v,p),E);break;case"a":d.replaceItem(l.createSVGPathSegArcAbs(v,p,A.r1,A.r2,A.angle,A.largeArcFlag,A.sweepFlag),E);break;case"z":case"Z":v=c,p=f;break}(M=="M"||M=="m")&&(c=v,f=p)}}})()}),(function(t,r,s){var n={};t.exports=n;var a=s(6);s(0),(function(){n.create=a.create,n.add=a.add,n.remove=a.remove,n.clear=a.clear,n.addComposite=a.addComposite,n.addBody=a.addBody,n.addConstraint=a.addConstraint})()})])})})(Vr)),Vr.exports}var Vt=bg();const Tt={maxAlive:22,sizeMin:130,sizeMax:240,bodyScale:.72,gravity:2.4,frictionAirMin:.004,frictionAirMax:.045,swayForce:18e-6,swaySpeed:.0011,restitution:.22,friction:.45,frictionStatic:.55,spawnEvery:90,spinMin:.012,spinMax:.075,floorInset:6};function Ag(i,e,t,r){if(!i||!e.length)return null;const s=Vt.Engine.create();s.gravity.y=Tt.gravity,s.positionIterations=8,s.velocityIterations=8;const n=[];let a=[],l=0,c=i.clientWidth||window.innerWidth,f=window.innerHeight,h=0;function m(){a.forEach(E=>Vt.Composite.remove(s.world,E));const g=200;a=[Vt.Bodies.rectangle(c/2,f-Tt.floorInset+g/2,c*3,g,{isStatic:!0,friction:.6}),Vt.Bodies.rectangle(-g/2,f/2,g,f*3,{isStatic:!0,friction:.4}),Vt.Bodies.rectangle(c+g/2,f/2,g,f*3,{isStatic:!0,friction:.4})],Vt.Composite.add(s.world,a)}m();const u=(g,E)=>g+Math.random()*(E-g);function o(){const g=Math.round(u(Tt.sizeMin,Tt.sizeMax)),E=document.createElement("span");E.className="fall-img gl-image",E.dataset.glSrc=e[Math.floor(u(0,e.length))],E.dataset.glReal="",E.style.setProperty("--size",`${g}px`),i.appendChild(E);const A=g*Tt.bodyScale/2,M=Vt.Bodies.rectangle(u(g,c-g),-g-u(0,260),A*2,A*2,{chamfer:{radius:A*.42},restitution:Tt.restitution,friction:Tt.friction,frictionStatic:Tt.frictionStatic,frictionAir:u(Tt.frictionAirMin,Tt.frictionAirMax),angle:u(-Math.PI,Math.PI)}),_=Math.random()<.5?0:u(Tt.spinMin,Tt.spinMax)*(Math.random()<.5?-1:1);Vt.Body.setAngularVelocity(M,_),Vt.Composite.add(s.world,M),n.push({el:E,body:M,size:g,seed:l++,born:performance.now(),fadeStart:0}),t&&t()}function d(){c=i.clientWidth||window.innerWidth,f=window.innerHeight,m()}window.addEventListener("resize",d);function v(g,E,A,M=0,_=!0){if(E){_&&n.length<Tt.maxAlive&&A-h>Tt.spawnEvery&&(o(),h=A);for(const S of n)S.body.position.y<f-Tt.floorInset-S.size*.6&&Vt.Body.applyForce(S.body,S.body.position,{x:Math.sin(A*Tt.swaySpeed+S.seed*1.7)*Tt.swayForce*S.body.mass,y:0});Vt.Engine.update(s,Math.min(g,32))}for(let S=n.length-1;S>=0;S--){const T=n[S],{x,y}=T.body.position,w=Math.abs(Math.sin(T.seed*12.9898)*43758.5453)%1,R=M>0?M*f*(w*.04):0,C=M>0?Math.sin(T.seed*5.3)*M*22:0,D=M>0?Math.sin(T.seed*3.1)*M*7:0,N=x-T.size/2+C,I=y-T.size/2-R,z=T.body.angle*180/Math.PI+D;T.el.style.transform=`translate3d(${N.toFixed(1)}px, ${I.toFixed(1)}px, 0) rotate(${z.toFixed(1)}deg)`,T.el.style.opacity=Math.max(0,Math.min(1,(y+T.size)/200)).toFixed(3)}}function p(){for(const g of n)Vt.Composite.remove(s.world,g.body),g.el.remove(),r&&r(g.el);n.length=0,h=0}return{update:v,reset:p,get count(){return n.length},get settled(){return n.filter(g=>Math.abs(g.body.velocity.y)<.12&&g.body.position.y>0).length},items:n}}const is=!1,Gn=new eu({duration:1.15,easing:i=>Math.min(1,1.001-Math.pow(2,-10*i)),smoothWheel:!is,autoRaf:!1});document.body.classList.toggle("mode-flow",!is);const wg=document.getElementById("glCanvas"),Qe=Eg(wg),rt=[...document.querySelectorAll(".section")];document.getElementById("bgLayer");const Qa=document.getElementById("pageRail"),Al=document.getElementById("pageCount"),Ci=document.getElementById("cursorLayer"),Tc=[...document.querySelectorAll("[data-go]")],wl=document.getElementById("clock"),Rg=["star","nib","smiley","rod","shoe","fin","bottle","palm","beer","cat"],Cg=document.getElementById("heroFalling"),tr=Ag(Cg,Rg.map(i=>`images/fall/${i}-cut.png`),()=>Qe&&Qe.scan(),i=>Qe&&Qe.removeItem(i)),bc=null,Ac=[];function ja(){return 0}const rs=rt.indexOf(bc);let Xn=0,wc=[];function or(i,e={}){const t=Math.max(0,Math.min(ja(),i));jt&&!e.force||(Xn=t,e.immediate,wc.forEach((r,s)=>r.classList.toggle("is-active",s===t)),Qe&&Qe.setActive(bc,null),e.immediate||(jt=!0,clearTimeout(Yn),Yn=setTimeout(()=>jt=!1,900)))}const Gs=i=>Math.max(0,Math.min(1,i));let Ir=0,Gr=0;const Kr=.9,Rc=260;let gt=0,jt=!1,Yn=null;Qa.style.setProperty("--section-count",String(rt.length));rt.forEach((i,e)=>{const t=document.createElement("button");t.style.top=`calc(${e} * 100% / ${rt.length})`,t.setAttribute("aria-label",i.id||`page ${e+1}`),t.addEventListener("click",()=>bn(e)),Qa.appendChild(t)});const Pg=[...Qa.children];function Cc(i,e=1){const t=rt.findIndex(s=>s.classList.contains("is-active"));document.body.classList.toggle("nav-up",e<0),document.body.classList.toggle("nav-down",e>=0),rt.forEach((s,n)=>{s.classList.toggle("is-active",n===i),s.classList.toggle("is-leaving",n===t&&t!==i)}),Pg.forEach((s,n)=>s.classList.toggle("is-active",n===i)),Tc.forEach(s=>s.classList.toggle("is-active",parseInt(s.dataset.go,10)===i)),Al&&(Al.textContent=`${String(i+1).padStart(2,"0")} / ${String(rt.length).padStart(2,"0")}`),document.body.classList.toggle("cursor-glow-on",i===0);const r=document.body.classList.contains("hero-active");document.body.classList.toggle("hero-active",i===0&&document.body.classList.contains("intro-done")),Qe&&(Qe.setFallGhost(i===0?0:1-Gr),document.body.classList.contains("intro-done")&&(i===0?(t>0&&Qe.setTurnNow(-1),Qe.setTurn(0),Qe.setHeroFade(1)):(Qe.setTurn(1),Qe.setHeroFade(0)))),i===0&&!r&&tr&&tr.reset(),document.body.classList.contains("intro-done")&&(i===0?Ba():rt[i].id==="ending"&&Ba(rt[i])),Qe&&Qe.setActive(rt[i],i===rs?Ac[Xn]:null),rt[i].id&&history.replaceState(null,"",`#${rt[i].id}`)}function bn(i,e={}){const t=Math.max(0,Math.min(rt.length-1,i));if(jt&&!e.force||t===gt&&!e.force)return;const r=t<gt;gt=t,xn=null,oi=r?eo(t):0,t===rs&&Ac.length&&or(r?ja():0,{force:!0,immediate:!0}),t===to&&no(r?Jr():0,{force:!0,immediate:!0}),Cc(t,r?-1:1),jt=is,clearTimeout(Yn),Gn.scrollTo(rt[t].offsetTop+Pc(t,oi),{force:!0,duration:e.immediate?0:Kr,easing:s=>1-Math.pow(1-s,3)}),Yn=setTimeout(()=>jt=!1,(e.immediate?0:Kr*1e3)+Rc)}let oi=0;const Lg=new Set(["about"]);function Zr(i){return!!rt[i]&&Lg.has(rt[i].id)&&eo(i)>0}let xn=null;const Dg=.8;function Rl(i){const e=rt[gt];if(!e)return;const t=e.offsetTop,r=t+Math.max(0,e.scrollHeight-window.innerHeight),s=typeof Gn.scroll=="number"?Gn.scroll:window.scrollY,a=(xn!==null&&xn>=t-40&&xn<=r+40?xn:s)+i*Dg;if(a<t-6)return xn=null,Ic();if(a>r+6)return xn=null,Dc();xn=Math.min(r,Math.max(t,a)),Gn.scrollTo(xn,{force:!0,duration:.28,easing:l=>1-Math.pow(1-l,3)})}function eo(i){const e=rt[i];return e?Math.max(0,Math.ceil((e.scrollHeight-window.innerHeight)/window.innerHeight)):0}function Pc(i,e){const t=rt[i];if(!t)return 0;const r=Math.max(0,t.scrollHeight-window.innerHeight);return Math.min(e*window.innerHeight,r)}function Lc(i){oi=i,jt=!0,clearTimeout(Yn),Gn.scrollTo(rt[gt].offsetTop+Pc(gt,i),{force:!0,duration:Kr,easing:e=>1-Math.pow(1-e,3)}),Yn=setTimeout(()=>jt=!1,Kr*1e3+Rc)}function Dc(){if(!Zr(gt)&&oi<eo(gt))return Lc(oi+1);if(gt===rs&&Xn<ja())return or(Xn+1);if(gt===to&&kn<Jr())return no(kn+1);bn(gt+1)}function Ic(){if(!Zr(gt)&&oi>0)return Lc(oi-1);if(gt===rs&&Xn>0)return or(Xn-1);if(gt===to&&kn>0)return no(kn-1);bn(gt-1)}const ni=document.getElementById("tlTrack"),Cl=document.getElementById("tlCount"),Ai=ni?[...ni.children]:[],to=rt.findIndex(i=>i.querySelector&&i.querySelector("#tlTrack"));let kn=0,On=0,Fa=0;function Oa(){return Ai.length<2?Ai[0]?Ai[0].offsetHeight:1:Math.abs(Ai[1].offsetTop-Ai[0].offsetTop)||Ai[0].offsetHeight}function Jr(){if(!ni)return 0;const i=ni.scrollHeight-ni.parentElement.clientHeight;return Math.max(0,Math.ceil(i/Oa()))}function no(i,e={}){const t=Math.max(0,Math.min(Jr(),i));jt&&!e.force||(kn=t,e.immediate&&(On=t,Fa=t),Cl&&(Cl.textContent=`${String(t+1).padStart(2,"0")} / ${String(Jr()+1).padStart(2,"0")}`),e.immediate||(jt=!0,clearTimeout(Yn),Yn=setTimeout(()=>jt=!1,800)))}const Pl=document.getElementById("about"),Ig=new IntersectionObserver(i=>{for(const e of i)e.target.classList.toggle("in-view",e.isIntersecting),Pl&&e.target.classList.contains("rs-block--life")&&Pl.classList.toggle("life-open",e.isIntersecting)},{threshold:.12,rootMargin:"-8% 0px -12% 0px"});document.querySelectorAll(".tl-stop, .about .rs-block, .line-art, .section").forEach(i=>Ig.observe(i));const Ug=new IntersectionObserver(i=>{for(const e of i){const t=e.target;t.muted=!0,t.playsInline=!0,t.playbackRate=1/1.3,e.isIntersecting?t.play().catch(()=>{}):t.pause()}},{threshold:.3});document.querySelectorAll(".life-video").forEach(i=>Ug.observe(i));let Ur=-1;function Ng(){const i=window.scrollY+window.innerHeight/2;let e=0;for(let r=0;r<rt.length;r++){const s=rt[r];if(i>=s.offsetTop&&i<s.offsetTop+s.offsetHeight){e=r;break}i>=s.offsetTop&&(e=r)}if(e===Ur)return;const t=Ur===-1||e>Ur?1:-1;Ur=e,gt=e,Cc(e,t)}window.addEventListener("wheel",i=>{},{passive:!1});window.addEventListener("touchstart",i=>i.touches[0].clientY,{passive:!0});window.addEventListener("touchmove",i=>is,{passive:!1});window.addEventListener("touchend",i=>{},{passive:!0});window.addEventListener("keydown",i=>{const e=i.key;if(fn&&!fn.hidden){e==="Escape"?ro():e==="ArrowRight"||e==="ArrowDown"?ir(ii+1):(e==="ArrowLeft"||e==="ArrowUp")&&ir(ii-1),i.preventDefault();return}["ArrowDown","PageDown"," ","ArrowUp","PageUp"].includes(e)||(["ArrowDown","PageDown"," "].includes(e)?(i.preventDefault(),Zr(gt)?Rl(window.innerHeight*.82):Dc()):["ArrowUp","PageUp"].includes(e)?(i.preventDefault(),Zr(gt)?Rl(-window.innerHeight*.82):Ic()):e==="Home"?(i.preventDefault(),bn(0)):e==="End"?(i.preventDefault(),bn(rt.length-1)):(e==="d"||e==="D")&&console.log(Oc(Pi===null?45:null)))});Tc.forEach(i=>{i.addEventListener("click",()=>bn(parseInt(i.dataset.go,10)))});const Ll="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>*#@%&+=-_■□▚▞",nr=[];let ks=0;function io(i){const e=[],t=r=>{[...r.childNodes].forEach(s=>{if(s.nodeType===3){const n=s.textContent.replace(/\s+/g," ");if(!n.trim())return s.remove();const a=document.createDocumentFragment();for(const l of n){const c=document.createElement("span");c.className="type-char",c.dataset.ch=l,c.textContent=l===" "?" ":"",a.appendChild(c),e.push(c)}s.replaceWith(a)}else s.nodeType===1&&s.tagName!=="BR"&&t(s)})};return t(i),e}document.querySelectorAll("[data-scramble]").forEach(i=>{nr.push({el:i,offset:parseInt(i.dataset.scramble,10)||0,chars:io(i)})});const Dl=document.getElementById("heroTitle");Dl&&Dl.querySelectorAll(".type-line").forEach((i,e)=>{nr.push({el:i,offset:380+e*120,chars:io(i)})});const Il=document.getElementById("endingTitle");Il&&Il.querySelectorAll(".type-line").forEach((i,e)=>{nr.push({el:i,offset:260+e*120,chars:io(i)})});function Ba(i=null){const e=i?nr.filter(a=>i.contains(a.el)):nr;if(!e.length)return;cancelAnimationFrame(ks);const t=[],r=[];for(const a of e){a.el&&a.el.classList.remove("is-lit");const l=[];r.push({el:a.el,items:l}),a.chars.forEach((c,f)=>{c.classList.remove("is-in","is-done"),c.dataset.ch!==" "&&(c.textContent="");const h={el:c,ch:c.dataset.ch,start:a.offset+f*26,dur:240+Math.random()*300,last:0,done:!1};t.push(h),l.push(h)})}const s=performance.now(),n=a=>{const l=a-s;let c=0;for(const f of t){if(f.ch===" "){f.done=!0,c++;continue}l<f.start||(l<f.start+f.dur?(f.el.classList.add("is-in"),a-f.last>45&&(f.el.textContent=Ll[Math.floor(Math.random()*Ll.length)],f.last=a)):(f.el.textContent=f.ch,f.el.classList.add("is-in","is-done"),f.done=!0,c++))}for(const f of r)f.el&&!f.el.classList.contains("is-lit")&&f.items.every(h=>h.done)&&f.el.classList.add("is-lit");c<t.length&&(ks=requestAnimationFrame(n))};ks=requestAnimationFrame(n)}const Ji=document.getElementById("cursorTrail"),Zi=Ji?Ji.getContext("2d"):null,Kt=[],Ul=520,Vn=14,Fg="192, 254, 4";function Uc(){return Ci?Ci.clientWidth:window.innerWidth}function Nc(){if(!Ji)return;const i=Math.min(window.devicePixelRatio||1,2);Ji.width=Math.round(Uc()*i),Ji.height=Math.round(window.innerHeight*i),Zi.setTransform(i,0,0,i,0,0)}Nc();window.addEventListener("resize",Nc);window.addEventListener("resize",()=>{wc=[],or(Xn,{force:!0,immediate:!0})});function Og(i){if(Zi){for(Zi.clearRect(0,0,Uc(),window.innerHeight);Kt.length&&i-Kt[0].t>Ul;)Kt.shift();if(Kt.length)for(let e=0;e<Kt.length;e++){const t=Kt[e],r=1-(i-t.t)/Ul;Zi.fillStyle=`rgba(${Fg}, ${(r*.95).toFixed(3)})`,Zi.fillRect(t.x-Vn/2,t.y-Vn/2,Vn,Vn)}}}Ci&&(window.addEventListener("pointermove",i=>{const e=i.clientX-Ci.getBoundingClientRect().left;Ci.style.setProperty("--cursor-x",e),Ci.style.setProperty("--cursor-y",i.clientY);const t=performance.now(),r=Math.round(e/Vn)*Vn,s=Math.round(i.clientY/Vn)*Vn,n=Kt[Kt.length-1];(!n||n.x!==r||n.y!==s)&&(Kt.push({x:r,y:s,t}),Kt.length>160&&Kt.shift())}),document.querySelectorAll(".gl-image, .line-art").forEach(i=>{i.addEventListener("pointerenter",()=>document.body.classList.add("is-hovering-media")),i.addEventListener("pointerleave",()=>document.body.classList.remove("is-hovering-media"))}));const fn=document.getElementById("lightbox"),Ws=document.getElementById("lbImg"),Bg=document.getElementById("lbCount"),wi=[...document.querySelectorAll("[data-full]")];let ii=0;const Ri=document.getElementById("lbVideo");function ir(i){if(!wi.length)return;ii=(i+wi.length)%wi.length;const e=wi[ii],t=e.dataset.kind==="video";Ws.hidden=t,Ri.hidden=!t,t?(Ws.removeAttribute("src"),Ri.src=e.dataset.full,Ri.play().catch(()=>{})):(Ri.pause(),Ri.removeAttribute("src"),Ws.src=e.dataset.full),Bg.textContent=`${String(ii+1).padStart(2,"0")} / ${String(wi.length).padStart(2,"0")}`}function Nl(i){fn&&(ir(i),fn.hidden=!1,requestAnimationFrame(()=>fn.classList.add("is-open")),document.body.classList.add("lb-on"))}function ro(){fn&&(Ri?.pause(),fn.classList.remove("is-open"),document.body.classList.remove("lb-on"),setTimeout(()=>fn.hidden=!0,320))}wi.forEach((i,e)=>{i.addEventListener("click",()=>Nl(e)),i.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),Nl(e))})});document.getElementById("lbClose")?.addEventListener("click",ro);document.getElementById("lbPrev")?.addEventListener("click",()=>ir(ii-1));document.getElementById("lbNext")?.addEventListener("click",()=>ir(ii+1));fn?.addEventListener("click",i=>{i.target===fn&&ro()});function Fc(){if(!wl||!document.body.classList.contains("intro-done"))return;const i=new Date,e=new Date(i.getTime()+(i.getTimezoneOffset()+480)*6e4);wl.textContent=`GMT+8 TPE ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}`}Fc();setInterval(Fc,1e4);const Xs=document.getElementById("figFit");function so(){if(!Xs)return;const i=Xs.firstElementChild;if(!i)return;i.style.transform="none";const e=Xs.clientHeight,t=i.scrollHeight;t>e+4&&console.warn("[about] 內容仍溢出",t,">",e)}window.addEventListener("resize",so);setTimeout(so,300);setTimeout(so,1500);window.addEventListener("resize",()=>bn(gt,{force:!0,immediate:!0}));let Pi=null;function Oc(i){return Pi=i,i===null?"效果跟著切頁走":`效果釘在 velocity=${i}`}let Ys=0;function Bc(i){Gn.raf(i),Ng();const e=Ys?Math.min(32,i-Ys):16;if(Ys=i,tr){const n=document.body.classList.contains("hero-active");tr.update(e,n||Ir>.05,i,Gr,n)}let t=0;Og(i);let r=0;if(ni&&(Fa=On,On+=(kn-On)*.085,Math.abs(kn-On)<5e-4&&(On=kn),ni.style.transform=`translate3d(0, ${(-On*Oa()).toFixed(1)}px, 0)`,r=(On-Fa)*Oa()),Qe){const n=window.innerHeight,a=window.scrollY,l=.6;let c;a<=n?c=1-(1-l)*(a/n):a<=n*2?c=l*(1-(a-n)/n):c=0;const f=rt[rt.length-1].offsetTop;Ir=Gs((a-(f-n))/n),Qe.setBlueMix(Gs(Math.max(c,Ir))),Gr=Gs((Ir-.6)/.4),Qe.setFallGhost(gt===0?0:1-Gr)}const s=Pi!==null?Pi:Gn.velocity||0;Qe&&Qe.update(s+(Pi!==null?0:r),i*.001,Pi!==null?0:t),requestAnimationFrame(Bc)}requestAnimationFrame(Bc);const Fl=document.getElementById("loaderFill"),zg=1200,Hg=900;function Vg(){const i=performance.now();Qe&&(Qe.setIntro(0),Qe.setTurnNow(-1),Qe.setHeroFadeNow(0));const e=()=>{const t=performance.now()-i,r=Qe?Qe.items.filter(c=>c.isGlass):[],s=r.length>0&&r.every(c=>c.loaded),n=Math.min(t/zg,s?1:.92);if(Fl&&(Fl.style.width=`${(Math.min(1,n)*100).toFixed(1)}%`),n<1)return requestAnimationFrame(e);document.body.classList.add("intro-revealing");const a=performance.now(),l=()=>{const c=Math.min(1,(performance.now()-a)/Hg),f=c*c*(3-2*c);if(Qe&&Qe.setIntro(f),c<1)return requestAnimationFrame(l);document.body.classList.add("intro-done","hero-active"),Qe&&(Qe.setTurn(0),Qe.setHeroFade(1)),Ba()};requestAnimationFrame(l)};requestAnimationFrame(e)}const Gg=Math.max(0,rt.findIndex(i=>i.id&&`#${i.id}`===location.hash));bn(Gg,{force:!0,immediate:!0});Vg();window.__hank={lenis:Gn,gl:Qe,glConfig:Ye,fallConfig:Tt,fallPile:tr,sections:rt,goTo:bn,setWork:or,pin:Oc,get index(){return gt},get workIndex(){return Xn}};
