if(!self.define){let i,l={};const n=(n,e)=>(n=new URL(n+".js",e).href,l[n]||new Promise((l=>{if("document"in self){const i=document.createElement("script");i.src=n,i.onload=l,document.head.appendChild(i)}else i=n,importScripts(n),l()})).then((()=>{let i=l[n];if(!i)throw new Error(`Module ${n} didn’t register its module`);return i})));self.define=(e,u)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(l[r])return;let s={};const o=i=>n(i,r),a={module:{uri:r},exports:s,require:o};l[r]=Promise.all(e.map((i=>a[i]||o(i)))).then((i=>(u(...i),s)))}}define(["./workbox-5b385ed2"],(function(i){"use strict";i.setCacheNameDetails({prefix:"paviliun900"}),self.addEventListener("message",(i=>{i.data&&"SKIP_WAITING"===i.data.type&&self.skipWaiting()})),i.precacheAndRoute([{url:"/paviliun900/css/app.04aa5091.css",revision:null},{url:"/paviliun900/css/chunk-vendors.47abb67a.css",revision:null},{url:"/paviliun900/fonts/materialdesignicons-webfont.21f691f0.ttf",revision:null},{url:"/paviliun900/fonts/materialdesignicons-webfont.54b0f60d.woff2",revision:null},{url:"/paviliun900/fonts/materialdesignicons-webfont.5d875350.eot",revision:null},{url:"/paviliun900/fonts/materialdesignicons-webfont.d671cbf6.woff",revision:null},{url:"/paviliun900/img/airbnbTengah.8b96ddb0.jpg",revision:null},{url:"/paviliun900/img/b21-KMM.2a59725c.jpg",revision:null},{url:"/paviliun900/img/b21-Koridor.c656ed37.jpg",revision:null},{url:"/paviliun900/img/b21-LivingRoom.156e612a.jpg",revision:null},{url:"/paviliun900/img/b21-dapur.b5c25405.jpg",revision:null},{url:"/paviliun900/img/b21-masterBed.7e156b73.jpg",revision:null},{url:"/paviliun900/img/cover.17edb9e4.jpg",revision:null},{url:"/paviliun900/img/dapur.49b148d7.jpg",revision:null},{url:"/paviliun900/img/dapur1.f0099d06.jpg",revision:null},{url:"/paviliun900/img/hall.1f7051ac.jpg",revision:null},{url:"/paviliun900/img/kamar2.a1f86d51.jpg",revision:null},{url:"/paviliun900/img/kamar3.dc5e90bb.jpg",revision:null},{url:"/paviliun900/img/kamar4.0e9779e1.jpg",revision:null},{url:"/paviliun900/img/km1.a6d77c70.jpg",revision:null},{url:"/paviliun900/img/master.786acdd8.jpg",revision:null},{url:"/paviliun900/img/master2.479de777.jpg",revision:null},{url:"/paviliun900/img/tengah.e017b606.jpg",revision:null},{url:"/paviliun900/index.html",revision:"244753d973a19dc0cfc96b153759102e"},{url:"/paviliun900/js/about.69720021.js",revision:null},{url:"/paviliun900/js/app.4cf98e31.js",revision:null},{url:"/paviliun900/js/chunk-vendors.733be5d6.js",revision:null},{url:"/paviliun900/js/webfontloader.00d30315.js",revision:null},{url:"/paviliun900/logo.ico",revision:"04711dc6ff406e34c9300ec7613c4999"},{url:"/paviliun900/manifest.json",revision:"6a2c9dfa6c31db46b1c189ef3316b8e0"},{url:"/paviliun900/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
