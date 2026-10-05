'use strict';
function shopItems(){return[
{id:'oven',name:'화로 화력',desc:'굽는 시간 '+ovenTime().toFixed(1)+'초',lv:S.up.oven,max:4,cost:COST.oven[S.up.oven]},
{id:'slots',name:'화로 칸 늘리기',desc:'한 번에 '+slotsCount()+'판 구울 수 있어요',lv:S.up.slots,max:2,cost:COST.slots[S.up.slots]},
{id:'roll',name:'밀대',desc:'반죽 펴는 속도 x'+rollMult().toFixed(1),lv:S.up.roll,max:3,cost:COST.roll[S.up.roll]},
{id:'spoon',name:'큰 국자',desc:'소스와 치즈를 바르는 범위 '+brushR()+'칸',lv:S.up.spoon,max:3,cost:COST.spoon[S.up.spoon]},
{id:'price',name:'맛집 소문',desc:'피자 한 판 가격 '+price()+'원 (상점 소품 1개당 +2원 포함)',lv:S.up.price,max:5,cost:COST.price[S.up.price]}];}
function openShop(){let h='<h2>가게 관리</h2>';for(const it of shopItems()){const maxed=it.lv>=it.max;h+='<div class="row"><b>'+it.name+' (Lv '+it.lv+'/'+it.max+')</b><button data-act="buy" data-id="'+it.id+'"'+(maxed||S.money<it.cost?' disabled':'')+'>'+(maxed?'최대':it.cost+'원')+'</button><small>'+it.desc+'</small></div>';}
h+='<div class="actions"><button data-act="reset" class="alt">'+(resetArm?'정말 처음부터 시작':'처음부터 시작')+'</button><button data-act="decor" class="alt">상점</button><button data-act="close" class="go">닫기</button></div>';openModal(h);}
const THEMES=[
{id:'default',name:'붉은 벽돌 피자집',desc:'기본 테마. 붉은 벽돌 벽과 초록 타일 바닥',cost:0},
{id:'forest',name:'숲속 통나무집',desc:'초록 통나무 벽과 이끼 낀 나무 바닥',cost:400},
{id:'beach',name:'바닷가 오두막',desc:'하늘색 벽과 모래 바닥, 조개껍데기',cost:400},
{id:'winter',name:'눈 내리는 산장',desc:'눈 덮인 벽과 짙은 나무 바닥',cost:450},
{id:'candy',name:'캔디 하우스',desc:'분홍 줄무늬 벽과 사탕 타일 바닥',cost:450},
{id:'space',name:'우주 정거장',desc:'별이 보이는 금속 벽과 빛나는 바닥',cost:500}];
const DECOR=[
{id:'tree',name:'큰 나무 화분',desc:'가게 왼쪽에 커다란 나무가 자라요',cost:150},
{id:'vines',name:'덩굴 장식',desc:'벽에 초록 덩굴이 늘어져요',cost:80},
{id:'fireflies',name:'반딧불 조명',desc:'깜빡이는 반딧불이 가게를 날아다녀요',cost:120},
{id:'moss',name:'이끼 카펫',desc:'바닥 가운데에 폭신한 이끼 카펫을 깔아요',cost:100},
{id:'mush',name:'버섯 의자',desc:'손님 자리에 빨간 버섯 의자를 놓아요',cost:90},
{id:'plants',name:'화분 세트',desc:'카운터 위에 작은 화분을 올려요',cost:60},
{id:'flowers',name:'창가 화단',desc:'창문 아래에 꽃이 피어요',cost:60},
{id:'birdhouse',name:'새집',desc:'벽에 작은 새집을 걸어요',cost:70}];
function openDecor(){let h='<h2>상점</h2><p style="margin:0 0 6px;color:#d8c9a0;font-size:13px;">소품 1개당 피자 가격 +2원, 테마를 쓰면 +5원</p><h3 style="margin:8px 0 0;font-size:15px;color:#e9b84a;">테마</h3>';
for(const t of THEMES){const owned=t.id==='default'||!!S.themes[t.id],on=S.theme===t.id;
let btn;if(on)btn='<button disabled>사용 중</button>';else if(owned)btn='<button data-act="equipt" data-id="'+t.id+'">적용</button>';else btn='<button data-act="buyt" data-id="'+t.id+'"'+(S.money<t.cost?' disabled':'')+'>'+t.cost+'원</button>';
h+='<div class="row"><b>'+t.name+'</b>'+btn+'<small>'+t.desc+'</small></div>';}
h+='<h3 style="margin:14px 0 0;font-size:15px;color:#e9b84a;">소품</h3>';
for(const it of DECOR){const own=!!S.decor[it.id];h+='<div class="row"><b>'+it.name+'</b><button data-act="buyd" data-id="'+it.id+'"'+(own||S.money<it.cost?' disabled':'')+'>'+(own?'보유 중':it.cost+'원')+'</button><small>'+it.desc+'</small></div>';}
h+='<div class="actions"><button data-act="shop" class="alt">가게 관리</button><button data-act="close" class="go">닫기</button></div>';openModal(h);}
function applyTheme(id){S.theme=id;buildBack();buildFront();g=ctx;}
function buyTheme(id){const t=THEMES.find(x=>x.id===id);if(!t||S.themes[id]||S.money<t.cost)return;S.money-=t.cost;S.themes[id]=true;sfxCoin();applyTheme(id);openDecor();}
function equipTheme(id){if(id!=='default'&&!S.themes[id])return;applyTheme(id);beep(520,.06,'square',.05);openDecor();}
function buyDecor(id){const it=DECOR.find(x=>x.id===id);if(!it||S.decor[id]||S.money<it.cost)return;S.money-=it.cost;S.decor[id]=true;sfxCoin();save();buildBack();buildFront();g=ctx;openDecor();}
function buy(id){const it=shopItems().find(x=>x.id===id);if(!it||it.lv>=it.max||S.money<it.cost)return;S.money-=it.cost;S.up[id]++;sfxCoin();save();openShop();}
modal.addEventListener('click',e=>{if(e.target===modal){if(sumInfo)showSummary();else closeModal();}});
panel.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;e.preventDefault();const a=b.dataset.act;
if(a==='delsave'){saves=saves.filter(x=>x.id!==b.dataset.id);persistSaves();openSaves('삭제했어요');return;}
if(a==='buy')buy(b.dataset.id);
else if(a==='close'){if(sumInfo){showSummary();}else closeModal();}
else if(a==='shop'){openShop();}
else if(a==='decor'){openDecor();}
else if(a==='saves'){openSaves();}
else if(a==='savenow'){const t=new Date();saves.unshift({id:String(Date.now()),time:t.toLocaleString('ko-KR'),money:S.money,day:S.day,decor:Object.assign({},S.decor),themes:Object.assign({},S.themes),theme:S.theme,up:Object.assign({},S.up)});if(saves.length>10)saves.length=10;openSaves(persistSaves()?'저장했어요':'이 환경에서는 브라우저에 저장할 수 없어요. 이번 접속 동안만 목록에 남아요');}
else if(a==='loadsave'){const it=saves.find(x=>x.id===b.dataset.id);if(it){applySave(it);closeModal();msg('저장된 게임을 불러왔어요');}}
else if(a==='buyd')buyDecor(b.dataset.id);
else if(a==='buyt')buyTheme(b.dataset.id);
else if(a==='equipt')equipTheme(b.dataset.id);
else if(a==='next')startNextDay();
else if(a==='reset'){if(!resetArm){resetArm=true;openShop();}else{try{localStorage.removeItem(SAVE);localStorage.removeItem('pixelPizzaShop_v1');}catch(x){}location.reload();}}});
const P={x:0,y:0,sx:0,sy:0,lx:0,ly:0,down:false};
let drag=null,station=null;
function ptr(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
const pp=m=>({x:m.x/PS,y:m.y/PS});
cv.addEventListener('pointerdown',e=>{ac();if(S.paused)return;const m=ptr(e);P.x=m.x;P.y=m.y;P.sx=m.x;P.sy=m.y;P.down=true;
try{cv.setPointerCapture(e.pointerId);}catch(x){}
if(S.mode==='main'){
drag=null;station=null;
if(S.raw&&Math.hypot(m.x-RAWP[0],m.y-RAWP[1])<=11)drag={k:'raw'};
else{for(let i=0;i<slotsCount();i++){const s=S.ovenSlots[i];if(s&&s.done&&Math.hypot(m.x-slotX(i),m.y-SLOTY)<=7){drag={k:'oven',slot:i};break;}}
if(!drag&&box.state==='closed'&&Math.abs(m.x-BOXP[0])<=12&&Math.abs(m.y-BOXP[1])<=12)drag={k:'box'};}
if(!drag)station=hitStation(m)||'floor';
}else if(S.mode==='prep'){
const q=pp(m);P.lx=q.x;P.ly=q.y;tool=null;roll=false;const b=hitBowl(q);
if(b){if(prep.p>=1){tool=b.k;beep(440,.04,'square',.04);}else msg('먼저 반죽을 동그랗게 펴세요');}
else if(q.x<156&&prep.p<1)roll=true;
}
});
cv.addEventListener('pointermove',e=>{const m=ptr(e);P.x=m.x;P.y=m.y;
if(!P.down){if(S.mode==='main'){cv.style.cursor=hitStation(m)?'pointer':'default';}return;}
if(S.paused)return;
if(S.mode==='prep'){const q=pp(m);
if(roll&&prep.p<1){const dy=Math.abs(q.y-P.ly);prep.p=Math.min(1,prep.p+dy*0.0045*rollMult());if(dy>0&&Math.random()<.5)flour.push({x:CX-30+Math.random()*60,y:CY-30+Math.random()*60,t:0});if(prep.p>=1){roll=false;beep(784,.12,'triangle',.06);msg('반죽이 다 펴졌어요. 이제 재료를 올리세요');}}
else if(tool==='sauce'||tool==='cheese'){paintLine(P.lx,P.ly,q.x,q.y,tool);}
P.lx=q.x;P.ly=q.y;
}
});
function endPointer(e,cancel){if(!P.down)return;P.down=false;const m=ptr(e);P.x=m.x;P.y=m.y;
if(S.paused){drag=null;tool=null;roll=false;return;}
if(S.mode==='main'){
if(drag&&!cancel){
if(drag.k==='raw'&&inRect(m,ST.oven)){walkTo(STAND.oven[0],STAND.oven[1],()=>{const i=freeSlot();if(!S.raw)return;if(i>=0){S.ovenSlots[i]={pz:S.raw,t:0,done:false};S.raw=null;beep(330,.08,'square',.05);}else msg('화로가 가득 찼어요');});}
else if(drag.k==='oven'&&inRect(m,ST.box)){const sl=drag.slot;walkTo(STAND.box[0],STAND.box[1],()=>{const s=S.ovenSlots[sl];if(!s||!s.done)return;if(box.state==='empty'){box.pz=s.pz;box.state='closing';box.t=0;S.ovenSlots[sl]=null;beep(520,.06,'square',.05);}else msg('상자에 이미 피자가 있어요. 먼저 배달하세요');});}
else if(drag.k==='box'&&inRect(m,ST.turn)){walkTo(STAND.turn[0],STAND.turn[1],()=>{if(box.state!=='closed')return;deliveries.push({t:0,pz:box.pz});box.state='empty';box.pz=null;beep(440,.08,'square',.05);});}
}else if(!cancel&&station&&Math.hypot(m.x-P.sx,m.y-P.sy)<6){
if(station==='floor'){if(m.y>=94&&m.y<=198){const tx=clamp(m.x,12,308),ty=clamp(m.y,96,196);if(!blocked(tx,ty))walkTo(tx,ty,null);}}
else if(hitStation(m)===station)clickStation(station);
}
drag=null;station=null;
}else if(S.mode==='prep'){
const q=pp(m);
if(tool&&!cancel&&tool!=='sauce'&&tool!=='cheese'&&Math.hypot(q.x-CX,q.y-CY)<=RPAINT)dropTopping(tool,q.x,q.y);
tool=null;roll=false;
}
}
cv.addEventListener('pointerup',e=>endPointer(e,false));
cv.addEventListener('pointercancel',e=>endPointer(e,true));
cv.addEventListener('wheel',e=>{if(S.mode!=='prep'||S.paused)return;e.preventDefault();if(prep.p<1){const d=Math.abs(e.deltaY)*(e.deltaMode===1?33:1);prep.p=Math.min(1,prep.p+d*0.0012*rollMult());flour.push({x:CX-30+Math.random()*60,y:CY-30+Math.random()*60,t:0});if(prep.p>=1){beep(784,.12,'triangle',.06);msg('반죽이 다 펴졌어요. 이제 재료를 올리세요');}}},{passive:false});
function clickStation(k){
if(k==='dough')walkTo(STAND.dough[0],STAND.dough[1],()=>{if(S.hand)msg('이미 반죽을 들고 있어요. 반죽대로 가져가세요');else{S.hand=true;beep(260,.06,'square',.05);}});
else if(k==='table')walkTo(STAND.table[0],STAND.table[1],enterPrep);
else if(k==='ingr')walkTo(STAND.ingr[0],STAND.ingr[1],enterPrep);
else if(k==='oven')walkTo(STAND.oven[0],STAND.oven[1],()=>msg('만든 피자를 화로로 끌어다 놓으세요'));
else if(k==='box')walkTo(STAND.box[0],STAND.box[1],null);
else if(k==='turn')walkTo(STAND.turn[0],STAND.turn[1],null);
}
function enterPrep(){if(S.mode!=='main')return;player.dir='up';
if(!prep.has){if(!S.hand){msg('손에 든 반죽이 없어요. 도우를 눌러 반죽을 하나 집어 오세요');return;}S.hand=false;prep.has=true;prep.p=0;}
S.mode='zoomIn';S.zoomT=0;$('labels').className='';$('btnShop').hidden=true;$('btnDecor').hidden=true;$('btnSave').hidden=true;beep(200,.08,'square',.04);}
function leavePrep(){S.mode='zoomOut';S.zoomT=1;$('labels').className='';$('btnBack').hidden=true;$('btnDone').hidden=true;tool=null;roll=false;}
$('btnBack').addEventListener('click',()=>{if(S.mode==='prep')leavePrep();});
$('btnDone').addEventListener('click',()=>{if(S.mode!=='prep'||S.paused)return;
if(S.raw){msg('반죽대 위의 피자를 먼저 화로에 넣으세요');return;}
if(prep.p<1){msg('먼저 반죽을 동그랗게 펴세요');return;}
if(!prep.sOK){msg('소스를 더 발라주세요');return;}
if(!prep.cOK){msg('치즈를 더 뿌려주세요');return;}
S.raw={cheese:Math.min(1,prep.cc/tot*1.5),tops:prep.tops.slice(),seed:(Math.random()*1000)|0};resetPrep();beep(660,.1,'triangle',.06);beep(880,.14,'triangle',.06,.1);
leavePrep();});
$('btnShop').addEventListener('click',()=>{if(S.mode==='main')openShop();});
$('btnDecor').addEventListener('click',()=>{if(S.mode==='main')openDecor();});
$('btnSave').addEventListener('click',()=>{if(S.mode==='main')openSaves();});
$('btnBgm').addEventListener('click',()=>{BGM.on=!BGM.on;$('btnBgm').textContent=BGM.on?'배경음 끄기':'배경음 켜기';bgmStart();});
$('btnSnd').addEventListener('click',()=>{S.muted=!S.muted;$('btnSnd').textContent=S.muted?'효과음 켜기':'효과음 끄기';});
function update(dt){
S.time+=dt;if(S.msgT>0)S.msgT-=dt;
for(let i=floats.length-1;i>=0;i--){const f=floats[i];f.t+=dt;f.y-=14*dt;if(f.t>1.2)floats.splice(i,1);}
for(let i=flour.length-1;i>=0;i--){flour[i].t+=dt;if(flour[i].t>.5)flour.splice(i,1);}
if(S.mode==='zoomIn'){S.zoomT+=dt/0.3;if(S.zoomT>=1){S.zoomT=1;setMode('prep');}}
else if(S.mode==='zoomOut'){S.zoomT-=dt/0.3;if(S.zoomT<=0){S.zoomT=0;setMode('main');}}
if(S.paused)return;
if(S.mode==='main')updatePlayer(dt);
for(let i=0;i<3;i++){const s=S.ovenSlots[i];if(s&&!s.done){s.t+=dt;if(s.t>=ovenTime()){s.done=true;beep(1568,.12,'triangle',.06);beep(2093,.2,'triangle',.05,.1);}}}
if(box.state==='closing'){box.t+=dt;if(box.t>=0.4){box.state='closed';}}
for(let i=deliveries.length-1;i>=0;i--){const d=deliveries[i];d.t+=dt;if(d.t>=1.3){deliveries.splice(i,1);earn(price(),TC[0]-8,TC[1]-26);}}
}
function render(){g=ctx;ctx.clearRect(0,0,W,H);
if(S.mode==='prep'){drawPrep();ctx.drawImage(pcv,0,0,W,H);}
else if(S.mode==='main')drawMain();
else{const t=S.zoomT,e=t*t*(3-2*t),s=1+3*e;ctx.save();ctx.translate(W/2,H/2);ctx.scale(s,s);ctx.translate(-76,-71);drawMain();ctx.restore();
ctx.globalAlpha=Math.max(0,Math.min(1,(e-0.55)/0.45));R('#a06a38',0,0,W,H);ctx.globalAlpha=1;}
}
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;update(dt);render();updateUI();requestAnimationFrame(frame);}
buildBack();buildFront();buildPrep();g=ctx;setMode('main');
requestAnimationFrame(frame);
