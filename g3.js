'use strict';
function msg(s){S.msg=s;S.msgT=3;}
function floatAt(x,y,s){floats.push({x,y,s,t:0});}
function nextTarget(){
if(drag)return null;
if(box.state==='closed')return{x:BOXP[0],y:144,t:'포장된 피자를 회전판으로 끌어다 놓으세요'};
for(let i=0;i<slotsCount();i++){const s=S.ovenSlots[i];if(s&&s.done&&box.state==='empty')return{x:slotX(i),y:49,t:'구워진 피자를 포장 상자로 끌어다 놓으세요'};}
if(S.raw&&freeSlot()>=0)return{x:RAWP[0],y:57,t:'반죽대 위의 피자를 화로로 끌어다 놓으세요'};
if(prep.has)return{x:PREPP[0],y:57,t:'반죽대를 눌러 이어서 만드세요'};
if(S.hand)return{x:76,y:54,t:'반죽대를 눌러 반죽을 올리세요'};
if(!S.raw&&!S.ovenSlots.some(Boolean)&&box.state==='empty'&&!deliveries.length)return{x:26,y:42,t:'도우를 눌러 반죽을 하나 집으세요'};
return null;
}
function hintText(){
if(S.msgT>0&&S.msg)return S.msg;
if(S.mode==='prep'){
if(prep.p<1)return'마우스 휠이나 위아래 드래그로 반죽을 펴세요 ('+Math.floor(prep.p*100)+'%)';
const s=Math.floor(Math.min(1,prep.sc/tot/.55)*100),c=Math.floor(Math.min(1,prep.cc/tot/.25)*100);
if(!prep.sOK||!prep.cOK)return'소스와 치즈를 동글동글 드래그해 바르세요 (소스 '+s+'%, 치즈 '+c+'%). 토핑은 끌어다 놓은 자리에 1개씩 올라가요';
return'토핑을 더 올리거나 피자 완성을 누르세요';
}
if(S.mode!=='main')return'';
const t=nextTarget();if(t)return t.t;
if(S.raw)return'화로가 가득 찼어요. 구워질 때까지 기다리세요';
return'피자 '+DAY_PIZZAS+'개를 배달하면 하루가 끝나요. 바닥을 누르거나 방향키로 움직여요';
}
function drawClock(){const a=S.dayPizzas/DAY_PIZZAS*Math.PI*2-Math.PI/2;for(let k=0;k<7;k++)R('#a02a1d',24+Math.round(Math.cos(a)*k*0.9),20+Math.round(Math.sin(a)*k*0.9),1,1);for(let k=0;k<5;k++)R('#2a1c18',24,20-k,1,1);R('#2a1c18',24,20,1,1);}
function drawOvenDyn(){const f=Math.floor(S.time*8);
R('rgba(243,140,40,.22)',162,54,36,20);
for(let k=0;k<6;k++){const x=163+k*6,h=2+((f+k*3)%3)*2;R('#e04a1f',x,74-h,4,h);R('#f39c2e',x+1,74-h+1,2,h-1);R('#f6e05a',x+1,72,2,2);}
for(let i=0;i<slotsCount();i++){const cx=slotX(i),s=S.ovenSlots[i];
if(!s||(drag&&drag.k==='oven'&&drag.slot===i)){ring(cx,SLOTY,5,'rgba(255,220,160,.35)',1);continue;}
miniPizza(cx,SLOTY,5,s.pz,s.done);
R(C.ink,cx-5,56,10,3);
if(s.done){R('#6cc151',cx-4,57,8,1);if(Math.floor(S.time*4)%2)R('#fff7c0',cx+3,SLOTY-5,1,1);}else R('#f39c2e',cx-4,57,Math.floor(8*Math.min(1,s.t/ovenTime())),1);}
}
function drawTableItems(){
if(prep.has){const r=Math.round(2+4*prep.p);drawDough(PREPP[0],PREPP[1],r,prep.p,true);}
if(S.raw&&!(drag&&drag.k==='raw'))miniPizza(RAWP[0],RAWP[1],6,S.raw,false);
}
function drawBoxDyn(){const bx=BOXP[0],by=BOXP[1];
if(drag&&drag.k==='box')return;
R('#6e4526',bx-10,by-9,20,20);R('#c8935a',bx-10,by-10,20,20);
if(box.state==='empty'){R('#e0b27a',bx-8,by-8,16,16);R('#b27d48',bx-10,by-14,20,4);R('#8c5f33',bx-10,by-11,20,1);}
else if(box.state==='closing'){R('#e0b27a',bx-8,by-8,16,16);miniPizza(bx,by,5,box.pz,true);const lh=Math.round(20*box.t/0.4);R('#efe3c8',bx-10,by-10,20,lh);}
else{R('#efe3c8',bx-10,by-10,20,20);R('#c8412d',bx-1,by-10,3,20);disk(bx,by,4,'#e6b968');disk(bx,by,2,'#c8412d');if(Math.floor(S.time*3)%2)R('#fff',bx-9,by-9,2,2);}
}
function drawTurn(){const cx=TC[0],cy=TC[1],busy=deliveries.length>0;
ell(cx,cy+3,24,10,'rgba(0,0,0,.25)');ell(cx,cy,23,9,'#5b676f');ell(cx,cy,21,8,'#c3ccd1');
const a=S.time*(busy?4:0.8);for(let k=0;k<6;k++){const x=cx+Math.cos(a+k*Math.PI/3)*17,y=cy+Math.sin(a+k*Math.PI/3)*6;R('#8a969e',x-1,y,3,1);}
ell(cx,cy,4,2,'#8a969e');
for(const d of deliveries){const u=d.t/1.3;let x,y,sc=1;if(u<0.8){const an=Math.PI+(u/0.8)*Math.PI;x=cx+Math.cos(an)*17;y=cy+Math.sin(an)*6-3;}else{const q=(u-0.8)/0.2;x=cx+17+(317-(cx+17))*q;y=cy-3+(155-(cy-3))*q;sc=1-q*0.4;}
const s=Math.max(2,Math.round(10*sc));R('#8c5f33',x-s/2,y-s/2+1,s,s);R('#efe3c8',x-s/2,y-s/2,s,s);R('#c8412d',x-1,y-s/2,2,s);}
}
function arrow(x,y){const b=(Math.floor(S.time*3)%2)*2;for(let k=0;k<4;k++){R(C.ink,x-4+k,y+b+k-1,9-2*k,3);}R(C.ink,x-2,y+b-5,5,5);for(let k=0;k<4;k++)R('#f6d45a',x-3+k,y+b+k,7-2*k,1);R('#f6d45a',x-1,y+b-4,3,4);}
function drawMain(){g=ctx;
ctx.drawImage(back,0,0);drawClock();ctx.drawImage(front,0,0);
drawOvenDyn();drawTableItems();drawBoxDyn();drawTurn();
const acts=[{y:player.y,f:()=>drawActor(player.x,player.y,player.dir,player.moving,'#3f6fb0','#c8412d',S.hand)}];
acts.sort((a,b)=>a.y-b.y);for(const a of acts)a.f();
if(S.decor.fireflies)drawFlies();
const tg=nextTarget();if(tg&&S.mode==='main')arrow(tg.x,tg.y);
for(const f of floats){const a=Math.min(1,(1.2-f.t)*2);txt(f.s,f.x,f.y,'#2a1c18',2);txt(f.s,f.x-1,f.y-1,a>.4?'#f6d45a':'#c9a43a',2);}
if(drag){if(drag.k==='raw')miniPizza(P.x,P.y,8,S.raw,false);else if(drag.k==='oven'){const s=S.ovenSlots[drag.slot];if(s)miniPizza(P.x,P.y,8,s.pz,true);}else{R('#8c5f33',P.x-10,P.y-9,20,20);R('#efe3c8',P.x-10,P.y-10,20,20);R('#c8412d',P.x-1,P.y-10,3,20);}}
}
function drawDough(cx,cy,r,p,small){
disk(cx+2,cy+3,r,'rgba(60,40,20,.25)');disk(cx,cy,r,'#f1dcab');
const th=0.5+0.45*p;
for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+0.25));const s=Math.max(-w,Math.ceil(th*r-dy));if(s<=w)R('#d9bd84',cx+s,cy+dy,w-s+1,1);}
if(p>0.45){const ri=r-(small?1:4);for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+0.25));if(Math.abs(dy)<=ri){const wi=Math.floor(Math.sqrt(ri*ri-dy*dy+0.25));R('#e6b968',cx-w,cy+dy,w-wi,1);R('#e6b968',cx+wi+1,cy+dy,w-wi,1);}else R('#e6b968',cx-w,cy+dy,2*w+1,1);}}
else if(!small)R('#fff6dc',cx-Math.round(r/2),cy-Math.round(r/2),3,2);
}
let tool=null,roll=false;
function drawPrep(){g=pctx;pctx.clearRect(0,0,PW,PH);
pctx.drawImage(prepBG,0,0);
const p=prep.p,r=Math.round(10+(RMAX-10)*p);
drawDough(CX,CY,r,p,false);
pctx.drawImage(layer,0,0);
for(const t of prep.tops)drawTop(t.t,t.x,t.y,t.s,true);
for(const f of flour){R('rgba(255,255,255,'+Math.max(0,.9-f.t*1.8)+')',f.x,f.y,2,2);}
const bars=[[150,p,'#f0b848','#e9b84a'],[158,prep.sc/tot/0.55,'#c43a2b','#c43a2b'],[166,prep.cc/tot/0.25,'#f4cf4d','#f4cf4d']];
for(const [y,v,c,ic] of bars){const val=Math.max(0,Math.min(1,v));R(ic,13,y+1,4,4);R(C.ink,19,y,122,6);R('#5c4a3d',20,y+1,120,4);R(val>=1?'#6cc151':c,20,y+1,Math.floor(120*val),4);}
for(const b of BOWLS){drawBowl(b);if(p<1)R('rgba(20,10,5,.5)',b.x,b.y,40,30);}
if(tool){const m={x:P.x/PS,y:P.y/PS};if(tool==='sauce'){disk(m.x,m.y,4,'#8c1f1a');disk(m.x,m.y,3,'#c43a2b');R('#8c1f1a',m.x+3,m.y+3,6,2);}else if(tool==='cheese'){for(let k=0;k<6;k++)R('#f4cf4d',m.x-5+Math.floor(hsh(k,S.time*20|0,3)*10),m.y-4+Math.floor(hsh(k,S.time*20|0,4)*8),2,1);}else drawTop(tool,Math.round(m.x),Math.round(m.y),1,true);}
g=ctx;
}
const LAB={main:[[25,95,'도우'],[76,95,'반죽대'],[126,95,'재료'],[180,95,'화로'],[116,181,'포장 상자'],[281,185,'회전판']],prep:BOWLS.map(b=>[(b.x+20)*PS,(b.y+31)*PS,b.l])};
(function(){const bx=$('labels');for(const set of ['main','prep'])LAB[set].forEach(a=>{const d=document.createElement('div');d.className='lab '+set;d.textContent=a[2];d.style.left=(a[0]/W*100)+'%';d.style.top=(a[1]/H*100)+'%';bx.appendChild(d);});})();
function setMode(m){S.mode=m;$('labels').className=m==='main'?'show-main':m==='prep'?'show-prep':'';$('btnBack').hidden=m!=='prep';$('btnDone').hidden=m!=='prep';$('btnShop').hidden=m!=='main';$('btnDecor').hidden=m!=='main';$('btnSave').hidden=m!=='main';}
let lastUI={};
function setText(id,v){if(lastUI[id]!==v){lastUI[id]=v;$(id).textContent=v;}}
function updateUI(){setText('money',String(S.money));setText('dayLabel',S.day+'일차 '+Math.min(S.dayPizzas,DAY_PIZZAS)+'/'+DAY_PIZZAS);setText('stat','손: '+(S.hand?'반죽':'빈손'));setText('hint',hintText());const w=Math.min(100,S.dayPizzas/DAY_PIZZAS*100).toFixed(1)+'%';if(lastUI.tf!==w){lastUI.tf=w;$('timefill').style.width=w;}}
function earn(v,x,y){S.money+=v;S.dayEarn+=v;S.dayPizzas++;sfxCoin();floatAt(x,y,'+'+v);if(S.dayPizzas>=DAY_PIZZAS){tool=null;roll=false;endDay();}}
let sumInfo=null;
function endDay(){S.paused=true;sumInfo={};save();showSummary();}
function showSummary(){
const h='<h2>'+S.day+'일차 마감</h2><div class="sum"><span>판매한 피자</span><span>'+S.dayPizzas+'판</span><span>오늘 매출</span><span>'+S.dayEarn+'원</span><span>잔액</span><span>'+S.money+'원</span></div><div class="actions"><button data-act="shop" class="alt">가게 관리</button><button data-act="decor" class="alt">상점</button><button data-act="saves" class="alt">저장 목록</button><button data-act="next" class="go">다음 날 시작</button></div>';
openModal(h,true);}
function startNextDay(){sumInfo=null;S.day++;S.dayTime=0;S.dayEarn=0;S.dayPizzas=0;closeModal();save();}
const SAVES_KEY='pixelPizzaSaveList';
let saves=[];
try{saves=JSON.parse(localStorage.getItem(SAVES_KEY)||'[]')||[];if(!Array.isArray(saves))saves=[];}catch(e){saves=[];}
function persistSaves(){try{localStorage.setItem(SAVES_KEY,JSON.stringify(saves));return true;}catch(e){return false;}}
function openSaves(note){
let h='<h2>저장 목록</h2><p style="margin:0 0 6px;color:#d8c9a0;font-size:13px;">자동으로 저장되지 않아요. 저장 버튼을 눌러야 목록에 남아요 (최대 10개)</p>';
if(note)h+='<p class="note">'+note+'</p>';
h+='<div class="actions" style="justify-content:flex-start;margin:0 0 6px;"><button data-act="savenow" class="go">현재 상태 저장</button></div>';
if(!saves.length)h+='<p style="color:#d8c9a0;">저장된 게임이 없어요.</p>';
for(const it of saves){h+='<div class="row"><b>'+it.day+'일차, '+it.money+'원</b><button data-act="loadsave" data-id="'+it.id+'">불러오기</button><small>소품 '+Object.keys(it.decor||{}).length+'개, '+it.time+' <a href="#" data-act="delsave" data-id="'+it.id+'" style="color:#ffb4a4;margin-left:8px;">삭제</a></small></div>';}
h+='<div class="actions"><button data-act="close" class="go">닫기</button></div>';
openModal(h,!!sumInfo&&false);}
function applySave(d){S.money=d.money|0;S.day=(d.day|0)||1;S.decor=Object.assign({},d.decor||{});S.themes=Object.assign({},d.themes||{});S.theme=d.theme||'default';if(S.decor.forest){delete S.decor.forest;S.themes.forest=true;if(!d.theme)S.theme='forest';}for(const k in S.up)S.up[k]=(d.up&&d.up[k])|0;
S.dayTime=0;S.dayEarn=0;S.dayPizzas=0;S.hand=false;S.raw=null;S.ovenSlots=[null,null,null];box.state='empty';box.pz=null;box.t=0;deliveries.length=0;resetPrep();sumInfo=null;buildBack();buildFront();g=ctx;}
const modal=$('modal'),panel=$('panel');
let resetArm=false;
function openModal(h,noX){panel.innerHTML=(noX?'':'<button class="xbtn" data-act="close" aria-label="닫기">X</button>')+h;modal.hidden=false;S.paused=true;for(const k in keys)keys[k]=false;}
function closeModal(){modal.hidden=true;S.paused=false;resetArm=false;}
