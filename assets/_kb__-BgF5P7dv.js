import{u as I,p as E,d as F,g as R,z as T,E as j,c as s,I as M,b as Q,f as z,ap as O,L as G,h as H,bt as U,bu as J,j as W,l as X,n as Y,av as Z,$ as ee,a1 as ae,x as te,aq as ne,a2 as se,bv as oe,bw as le,a3 as re,w as ie,D as w,ab as ce,bj as de,B as S,bk as A,bi as d,bl as D,bn as r,bq as g,bx as ue,bm as me,bo as p,bp as t,V as q,ba as o,bh as k,S as be,by as fe}from"./index-Cs9tRzVv.js";import{A as ke,c as ve,V as he,a as _e,u as ye}from"./VContainer-Dps1EWGp.js";const ge=async e=>I(`${ke}/keyboards/${e}/info.json`,{afterFetch(n){return n.data=n.data.keyboards[e],n}}).get().json(),pe=E({color:String,density:String,...F()},"VBannerActions"),Be=R()({name:"VBannerActions",props:pe(),setup(e,n){let{slots:a}=n;return T({VBtn:{color:e.color,density:e.density,slim:!0,variant:"text"}}),j(()=>{var i;return s("div",{class:["v-banner-actions",e.class],style:e.style},[(i=a.default)==null?void 0:i.call(a)])}),{}}}),K=ve("v-banner-text"),Ve=E({avatar:String,bgColor:String,color:String,icon:M,lines:String,stacked:Boolean,sticky:Boolean,text:String,...Q(),...F(),...z(),...O(),...G({mobile:null}),...H(),...U(),...J(),...W(),...X(),...Y()},"VBanner"),Ce=R()({name:"VBanner",props:Ve(),setup(e,n){let{slots:a}=n;const{backgroundColorClasses:i,backgroundColorStyles:v}=Z(e,"bgColor"),{borderClasses:l}=ee(e),{densityClasses:u}=ae(e),{displayClasses:m,mobile:c}=te(e),{dimensionStyles:h}=ne(e),{elevationClasses:B}=se(e),{locationStyles:V}=oe(e),{positionClasses:b}=le(e),{roundedClasses:f}=re(e),{themeClasses:L}=ie(e),_=w(e,"color"),y=w(e,"density");T({VBannerActions:{color:_,density:y}}),j(()=>{const N=!!(e.text||a.text),C=!!(e.avatar||e.icon),$=!!(C||a.prepend);return s(e.tag,{class:["v-banner",{"v-banner--stacked":e.stacked||c.value,"v-banner--sticky":e.sticky,[`v-banner--${e.lines}-line`]:!!e.lines},L.value,i.value,l.value,u.value,m.value,B.value,b.value,f.value,e.class],style:[v.value,h.value,V.value,e.style],role:"banner"},{default:()=>{var x;return[$&&s("div",{key:"prepend",class:"v-banner__prepend"},[a.prepend?s(ce,{key:"prepend-defaults",disabled:!C,defaults:{VAvatar:{color:_.value,density:y.value,icon:e.icon,image:e.avatar}}},a.prepend):s(he,{key:"prepend-avatar",color:_.value,density:y.value,icon:e.icon,image:e.avatar},null)]),s("div",{class:"v-banner__content"},[N&&s(K,{key:"text"},{default:()=>{var P;return[((P=a.text)==null?void 0:P.call(a))??e.text]}}),(x=a.default)==null?void 0:x.call(a)]),a.actions&&s(Be,{key:"actions"},a.actions)]}})})}}),xe={class:"hidden-sm-and-down"},Pe={class:"text-center"},we=t("h2",null,"Make example for this keyboard (after setting up your build environment):",-1),Se=t("h2",null,"Flashing example for this keyboard:",-1),Ae=t("p",{class:"my-2"},[o(" See the "),t("a",{href:"https://docs.qmk.fm/getting_started_build_tools"},"build environment"),o(" and the "),t("a",{href:"https://docs.qmk.fm/getting_started_make_guide"},"make instructions"),o(" for more information. Brand new to QMK? Start with our "),t("a",{href:"https://docs.qmk.fm/newbs"},"Complete Newbs Guide"),o(". ")],-1),De=t("h2",null,"Bootloader",-1),qe=t("p",null,"Enter the bootloader using one of the following methods:",-1),Ee={class:"mx-10 my-4"},Fe={key:0},Re=t("li",null,[o(" Keycode in layout: Press the key mapped to "),t("code",{class:"v-code"},"QK_BOOT"),o(" if it is available ")],-1),Ke=de({__name:"[kb]+",async setup(e){let n,a;const i=me(),v=ue(),l=S(()=>i.params.kb.join("/")),u=S(()=>l.value.replaceAll("/","_")),{data:m}=([n,a]=A(()=>ye()),n=await n,a(),n),{data:c,error:h}=([n,a]=A(()=>ge(l.value)),n=await n,a(),n);return h.value&&v.push("/404"),(B,V)=>d(c)?(p(),D(_e,{key:0},{default:r(()=>{var b;return[s(Ce,{lines:"one","bg-color":"transparent"},{actions:r(()=>{var f;return[t("div",xe,[s(q,{class:"ma-2 align-self-end",color:"primary",variant:"elevated","prepend-icon":"fa-brands fa-github",href:`https://github.com/qmk/qmk_firmware/tree/master/keyboards/${l.value}`},{default:r(()=>[o("QMK")]),_:1},8,["href"]),(f=d(m)[u.value])!=null&&f.url?(p(),D(q,{key:0,class:"ma-2 align-self-end",color:"orange",variant:"elevated","prepend-icon":"fa-solid fa-download",href:d(m)[u.value].url},{default:r(()=>[o("Firmware")]),_:1},8,["href"])):g("",!0)])]}),default:r(()=>[s(K,null,{default:r(()=>[t("h1",null,k(d(c).keyboard_name),1)]),_:1})]),_:1}),t("div",Pe,[s(be,{size:"300"},{default:r(()=>[o("fa-regular fa-keyboard")]),_:1})]),we,t("pre",null,[t("code",null,"qmk compile -kb "+k(l.value)+" -km default",1)]),Se,t("pre",null,[t("code",null,"qmk flash -kb "+k(l.value)+" -km default",1)]),Ae,De,qe,t("ul",Ee,[d(c).features.bootmagic?(p(),fe("li",Fe," Bootmagic reset: Hold down the key at "+k(((b=d(c).bootmagic)==null?void 0:b.matrix)??[0,0])+" in the matrix (usually the top left key or Escape) and plug in the keyboard ",1)):g("",!0),Re])]}),_:1})):g("",!0)}});export{Ke as default};
