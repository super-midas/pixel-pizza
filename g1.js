'use strict';
const W=320,H=240,PW=256,PH=192,PS=W/PW;
const $=id=>document.getElementById(id);
const cv=$('c'),ctx=cv.getContext('2d');
ctx.imageSmoothingEnabled=false;
let g=ctx;
function R(c,x,y,w,h){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function hsh(a,b,s){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(s|0,2147483647))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function disk(cx,cy,r,c){for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+0.25));R(c,cx-w,cy+dy,2*w+1,1);}}
function ring(cx,cy,r,c,t){t=t||1.2;for(let dy=-r-1;dy<=r+1;dy++)for(let dx=-r-1;dx<=r+1;dx++){const d=Math.hypot(dx,dy);if(d<=r+0.3&&d>r-t)R(c,cx+dx,cy+dy,1,1);}}
function ell(cx,cy,rx,ry,c){for(let dy=-ry;dy<=ry;dy++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(dy*dy)/(ry*ry))));R(c,cx-w,cy+dy,2*w+1,1);}}
function mk(w,h){const o=document.createElement('canvas');o.width=w;o.height=h;o.getContext('2d').imageSmoothingEnabled=false;return o;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const FONT={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001001001001','8':'111101111101111','9':'111101111001111','+':'000010111010000','P':'111101111100100','I':'111010010010111','Z':'111001010100111','A':'010101111101101'};
function txt(s,x,y,c,sc){sc=sc||1;for(let k=0;k<s.length;k++){const gl=FONT[s[k]];if(!gl)continue;for(let i=0;i<15;i++)if(gl[i]==='1')R(c,x+k*4*sc+(i%3)*sc,y+((i/3)|0)*sc,sc,sc);}}
const C={ink:'#2a1c18'};
const DAY_PIZZAS=3,BASE_PRICE=70;
const COST={oven:[120,200,300,420],slots:[200,350],roll:[80,140,220],spoon:[90,150,230],price:[200,300,400,500,600]};
const S={money:0,day:1,dayTime:0,dayEarn:0,dayPizzas:0,decor:{},theme:'default',themes:{},up:{oven:0,slots:0,roll:0,spoon:0,price:0},hand:false,mode:'main',zoomT:0,time:0,paused:false,muted:false,raw:null,ovenSlots:[null,null,null],stT:[],msg:'',msgT:0};
const box={state:'empty',t:0,pz:null};
const deliveries=[],floats=[],flour=[];
const ovenTime=()=>Math.max(1.5,5-0.8*S.up.oven);
const slotsCount=()=>1+S.up.slots;
const rollMult=()=>1+0.6*S.up.roll;
const brushR=()=>5+2*S.up.spoon;
const price=()=>BASE_PRICE+10*S.up.price+2*Object.keys(S.decor).length+(S.theme!=='default'?5:0);
const SAVE='pixelPizzaShop_v2';
function save(){}
let AC=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AC;}
function beep(f,d,type,v,delay){if(S.muted)return;const a=ac();if(!a)return;try{const t=a.currentTime+(delay||0),o=a.createOscillator(),gn=a.createGain();o.type=type||'square';o.frequency.value=f;gn.gain.setValueAtTime(v||0.05,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+(d||0.08));o.connect(gn);gn.connect(a.destination);o.start(t);o.stop(t+(d||0.08)+0.02);}catch(e){}}
function sfxCoin(){beep(988,.07,'square',.05);beep(1319,.16,'square',.05,.07);}
const BGM={on:true,step:0,next:0,timer:null};
const mf=m=>440*Math.pow(2,(m-69)/12);
const MEL=[[69,72,76,76,74,72],[71,74,76,80,76,71],[72,76,81,81,76,72],[71,76,80,76,71,0],[74,77,81,81,77,74],[72,76,81,76,72,69],[71,74,76,80,76,74],[72,69,0,69,0,0]];
const BASS=[[45,[60,64]],[40,[59,64]],[45,[60,64]],[40,[59,64]],[38,[62,65]],[45,[60,64]],[40,[59,64]],[45,[60,64]]];
function tone(f,t,d,type,v){const a=AC;try{const o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(v,t+0.012);gn.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(gn);gn.connect(a.destination);o.start(t);o.stop(t+d+0.02);}catch(e){}}
function playStep(n,t){const pass=Math.floor(n/48),bar=Math.floor((n%48)/6),st=n%6;
const m=MEL[bar][st];if(m)tone(mf(m+(pass?12:0)),t,0.2,pass?'triangle':'square',pass?0.05:0.022);
const b=BASS[bar];
if(st===0)tone(mf(b[0]),t,0.34,'triangle',0.09);
if(st===2)tone(mf(b[1][0]),t,0.1,'square',0.012);
if(st===4)tone(mf(b[1][1]),t,0.1,'square',0.012);
if(st===3&&bar%2===1)tone(mf(b[0]+12),t,0.1,'triangle',0.04);}
function bgmTick(){const a=AC;if(!a)return;if(a.state==='suspended'){try{a.resume();}catch(e){}}
if(BGM.next<a.currentTime-0.5)BGM.next=a.currentTime+0.05;
while(BGM.next<a.currentTime+0.3){if(BGM.on&&!document.hidden)playStep(BGM.step,BGM.next);BGM.step=(BGM.step+1)%96;BGM.next+=0.15;}}
function bgmStart(){if(BGM.timer)return;const a=ac();if(!a)return;BGM.next=a.currentTime+0.1;BGM.timer=setInterval(bgmTick,100);}
window.addEventListener('pointerdown',bgmStart);window.addEventListener('keydown',bgmStart);
const GRID=2,N=40,CX=80,CY=92,RMAX=40,RPAINT=36,GX0=CX-RMAX,GY0=CY-RMAX;
const prep={has:false,p:0,sauce:new Uint8Array(N*N),cheese:new Uint8Array(N*N),sc:0,cc:0,tops:[],sOK:false,cOK:false};
let tot=0;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=GX0+i*GRID+1,y=GY0+j*GRID+1;if((x-CX)*(x-CX)+(y-CY)*(y-CY)<=RPAINT*RPAINT)tot++;}
const pcv=mk(PW,PH),pctx=pcv.getContext('2d');
const layer=mk(PW,PH),lctx=layer.getContext('2d');
function resetPrep(){prep.has=false;prep.p=0;prep.sauce.fill(0);prep.cheese.fill(0);prep.sc=0;prep.cc=0;prep.tops=[];prep.sOK=false;prep.cOK=false;lctx.clearRect(0,0,PW,PH);}
function drawCell(i,j){const o=g;g=lctx;const x=GX0+i*GRID,y=GY0+j*GRID,idx=j*N+i;
if(prep.sauce[idx]){const h=hsh(i,j,5);R(h<.33?'#c43a2b':h<.66?'#b9321f':'#cf4a38',x,y,2,2);}
if(prep.cheese[idx]){const h=hsh(i,j,11),h2=hsh(i,j,12);const hz=h>.5;R(h2<.3?'#ffe27a':'#f4cf4d',x+(h2<.5?0:1),y+(h<.5?0:1),hz?2:1,hz?1:2);}
g=o;}
function paintAt(x,y,type){const r=brushR(),arr=type==='sauce'?prep.sauce:prep.cheese;
const i0=Math.max(0,Math.floor((x-r-GX0)/GRID)),i1=Math.min(N-1,Math.floor((x+r-GX0)/GRID));
const j0=Math.max(0,Math.floor((y-r-GY0)/GRID)),j1=Math.min(N-1,Math.floor((y+r-GY0)/GRID));
for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const cx=GX0+i*GRID+1,cy=GY0+j*GRID+1;
if((cx-x)*(cx-x)+(cy-y)*(cy-y)>r*r)continue;
if((cx-CX)*(cx-CX)+(cy-CY)*(cy-CY)>RPAINT*RPAINT)continue;
const idx=j*N+i;if(arr[idx])continue;
if(type==='cheese'&&Math.random()>0.28)continue;
arr[idx]=1;if(type==='sauce')prep.sc++;else prep.cc++;drawCell(i,j);}
if(!prep.sOK&&prep.sc/tot>=.55){prep.sOK=true;beep(660,.1,'triangle',.06);msg('소스는 충분해요');}
if(!prep.cOK&&prep.cc/tot>=.25){prep.cOK=true;beep(740,.1,'triangle',.06);msg('치즈도 충분해요');}}
function paintLine(x0,y0,x1,y1,type){const d=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.ceil(d/3));for(let k=1;k<=n;k++)paintAt(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,type);}
function dropTopping(type,x,y){for(let k=0;k<1;k++){let px=x,py=y;const dx=px-CX,dy=py-CY,dist=Math.hypot(dx,dy),lim=RPAINT-5;if(dist>lim){px=CX+dx/dist*lim;py=CY+dy/dist*lim;}prep.tops.push({t:type,x:Math.round(px),y:Math.round(py),s:(Math.random()*1000)|0});}
if(prep.tops.length>90)prep.tops.splice(0,prep.tops.length-90);beep(300+Math.random()*60,.05,'square',.04);}
function drawTop(t,x,y,s,big){
if(t==='pep'){const r=big?6:4;disk(x,y,r,'#8c1f1a');disk(x,y,r-1,'#b82d24');R('#d8503f',x-r+2,y-r+2,big?3:2,1);R('#8c1f1a',x+1,y+1,1,1);R('#8c1f1a',x-2,y+1,1,1);if(big){R('#8c1f1a',x+2,y-2,1,1);R('#8c1f1a',x-1,y+3,1,1);}}
else if(t==='olive'){if(big){ring(x,y,4,'#25252b',2);R('#6b6f3a',x-1,y-1,2,2);}else{ring(x,y,3,'#25252b',1.6);R('#6b6f3a',x,y,1,1);}}
else if(t==='onion'){if(big){ring(x,y,6,'#eadcf0',1.4);ring(x,y,3,'#cdb0d8',1.2);}else{ring(x,y,4,'#eadcf0',1.2);ring(x,y,2,'#cdb0d8',1.1);}}
else{const a=big?4:3,b=big?3:2;if(s&1){R('#2f7d2f',x-a-(big?1:0),y-b,2*a+(big?2:0),2*b);R('#6cc151',x-a-(big?1:0),y-b,2*a+(big?2:0),1);R('#6cc151',x-a-(big?1:0),y-b,1,2*b);}else{R('#2f7d2f',x-b,y-a-(big?1:0),2*b,2*a+(big?2:0));R('#6cc151',x-b,y-a-(big?1:0),2*b,1);R('#6cc151',x-b,y-a-(big?1:0),1,2*a+(big?2:0));}}
}
const TOPC={pep:'#a8281f',olive:'#222228',onion:'#e0cfe8',veg:'#3f9a3c'};
function miniPizza(cx,cy,r,pz,baked){
const crust=baked?'#b9772e':'#e6b968',sauceC=baked?'#a8311f':'#c8412d',cheeseC=baked?'#e9b23a':'#f6d45a';
disk(cx,cy,r,crust);disk(cx,cy,r-2,sauceC);
const rr=(r-2)*(r-2);
for(let dy=-r+2;dy<=r-2;dy++)for(let dx=-r+2;dx<=r-2;dx++){if(dx*dx+dy*dy>rr)continue;const h=hsh(dx,dy,pz.seed);
if(h<pz.cheese*0.8)R(cheeseC,cx+dx,cy+dy,1,1);
if(baked&&hsh(dx,dy,pz.seed+9)<0.07)R('#a8671d',cx+dx,cy+dy,1,1);}
const big=r>=9,ps=big?4:3,sz=big?3:2;
for(const t of pz.tops){const px=cx+Math.round((t.x-CX)/RMAX*r),py=cy+Math.round((t.y-CY)/RMAX*r);if(t.t==='pep')R(TOPC.pep,px-1,py-1,ps,ps);else R(TOPC[t.t],px,py,sz,sz);}
}
function drawActor(x,y,dir,walk,shirt,hat,carry){
x=Math.round(x);y=Math.round(y);const f=walk?Math.floor(S.time*8)%2:0;
ell(x,y,5,2,'rgba(0,0,0,.25)');
R('#3b2a24',x-3,y-4+(f?1:0),2,4-(f?1:0));R('#3b2a24',x+1,y-4+(f?0:1),2,4-(f?0:1));
R(shirt,x-4,y-12,8,8);if(dir!=='up')R('#ffffff',x-3,y-10,6,6);
R(shirt,x-5,y-12,1,6);R(shirt,x+4,y-12,1,6);
R('#e8b894',x-3,y-18,6,6);
if(dir==='up')R(hat,x-3,y-18,6,3);
else if(dir==='down'){R(C.ink,x-2,y-16,1,1);R(C.ink,x+1,y-16,1,1);}
else if(dir==='left')R(C.ink,x-3,y-16,1,1);
else R(C.ink,x+2,y-16,1,1);
R(hat,x-4,y-21,8,4);R('rgba(0,0,0,.2)',x-4,y-18,8,1);
if(carry){const cx=x+(dir==='left'?-7:7),cy=y-8;disk(cx,cy,3,'#f1dcab');R('#d9bd84',cx+1,cy+1,2,2);R('#fff6dc',cx-2,cy-2,1,1);}
}
const ST={dough:[8,50,34,30],table:[50,58,52,22],ingr:[108,48,36,30],oven:[154,38,52,42],box:[90,148,52,32],turn:[250,124,70,60]};
const STAND={dough:[26,102],table:[76,102],ingr:[126,102],oven:[180,102],box:[116,192],turn:[236,154]};
const ISL=[92,150,48,28],TUR=[250,126,62,56];
const RAWP=[68,71],PREPP=[89,71],BOXP=[116,164],TC=[281,154];
const slotX=i=>169+11*i,SLOTY=66;
const inRect=(m,r)=>m.x>=r[0]&&m.x<=r[0]+r[2]&&m.y>=r[1]&&m.y<=r[3]+r[1];
function freeSlot(){for(let i=0;i<slotsCount();i++)if(!S.ovenSlots[i])return i;return -1;}
function hitStation(m){for(const k in ST)if(inRect(m,ST[k]))return k;return null;}
const back=mk(W,H),front=mk(W,H),prepBG=mk(PW,PH);
function drawWall(){const T=S.theme;
if(T==='forest'){
R('#3f5a38',0,0,W,80);
for(let x=0;x<W;x+=12){R('#35502f',x,0,1,78);R('#4a6a41',x+1,0,2,78);}
for(let i=0;i<60;i++)R('#34502e',Math.floor(hsh(i,1,21)*W),Math.floor(hsh(i,2,21)*60),4,2);
R('#2c3f28',0,62,W,16);R('#6e4526',0,62,W,2);
for(let x=0;x<W;x+=16){R('#223420',x,66,1,12);R('#4c8a3d',x+3,70,4,3);R('#6cc151',x+4,69,2,2);}
}else if(T==='beach'){
R('#8fcbdc',0,0,W,80);for(let y=4;y<62;y+=12)R('#b9e4ee',0,y,W,2);
for(let i=0;i<24;i++)R('#ffffff',Math.floor(hsh(i,1,71)*W),Math.floor(hsh(i,2,71)*56),7,1);
R('#f2ead4',0,62,W,16);R('#3f9aa8',0,62,W,3);for(let y=68;y<78;y+=5)R('#d8cdb0',0,y,W,1);for(let x=0;x<W;x+=14)R('#d8cdb0',x,65,1,13);
}else if(T==='space'){
R('#1b2240',0,0,W,80);for(let x=0;x<W;x+=32)R('#222c52',x,0,1,62);for(let y=0;y<62;y+=20)R('#222c52',0,y,W,1);
for(let i=0;i<70;i++)R(hsh(i,3,72)<.3?'#9fd3ff':'#ffffff',Math.floor(hsh(i,1,72)*W),Math.floor(hsh(i,2,72)*60),1,1);
R('#2a3566',0,62,W,16);R('#4fd0e0',0,62,W,2);for(let x=4;x<W;x+=16)R('#4fd0e0',x,70,8,2);R('#151a30',0,76,W,2);
}else if(T==='winter'){
R('#cfdcec',0,0,W,80);for(let x=0;x<W;x+=14)R('#b5c6dc',x,0,1,62);
for(let i=0;i<50;i++)R('#ffffff',Math.floor(hsh(i,1,73)*W),Math.floor(hsh(i,2,73)*60),2,2);
R('#6e4526',0,62,W,16);R('#8a5a34',0,62,W,2);for(let x=0;x<W;x+=12)R('#5a381f',x,66,1,12);R('#ffffff',0,60,W,3);for(let x=0;x<W;x+=9)R('#ffffff',x,63,5,2);
}else if(T==='candy'){
R('#f4a6c4',0,0,W,80);for(let x=0;x<W;x+=12)R('#fde6ef',x,0,6,62);
R('#8fdcc0',0,62,W,16);R('#ffffff',0,62,W,2);for(let x=3;x<W;x+=10){R('#f4a6c4',x,68,3,3);R('#fde6ef',x+5,73,3,3);}
}else{
R('#c9a487',0,0,W,80);
for(let y=0;y<78;y+=6){const off=((y/6)%2)*8;for(let x=-8;x<W;x+=16){const bx=x+off,h=hsh(bx,y,3);R(h<.33?'#a4472f':h<.66?'#b0533a':'#9a4130',bx,y,15,5);}}
R('#4a2a20',0,62,W,16);R('#6a3d2e',0,62,W,2);for(let x=0;x<W;x+=16)R('#3b2018',x,66,1,12);
}
}
