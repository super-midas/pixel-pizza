'use strict';
function drawFloor(){const T=S.theme;
const planks=(c1,c2,seam)=>{for(let y=72;y<H;y+=8){const off=((y/8)%2)*20;for(let x=-20;x<W;x+=40){const bx=x+off;R(hsh(bx,y,5)<.5?c1:c2,bx,y,40,7);R(seam,bx,y+7,40,1);R(seam,bx+39,y,1,8);}}};
const checker=(c1,c2)=>{for(let y=72;y<H;y+=8)for(let x=0;x<W;x+=8)R(((x/8+y/8)&1)?c1:c2,x,y,8,8);};
if(T==='forest'){planks('#9b6a3c','#8f5f35','#6e4526');for(let i=0;i<46;i++)R(hsh(i,2,9)<.5?'#4c8a3d':'#6cc151',Math.floor(hsh(i,3,9)*W),100+Math.floor(hsh(i,4,9)*100),3,1);}
else if(T==='beach'){checker('#ecd9a6','#e4cf96');for(let i=0;i<50;i++)R(hsh(i,1,74)<.5?'#ffffff':'#f0a8a0',Math.floor(hsh(i,2,74)*W),100+Math.floor(hsh(i,3,74)*130),2,1);}
else if(T==='space'){checker('#3a4258','#323a4e');for(let x=32;x<W;x+=64)R('rgba(79,208,224,.5)',x,72,1,H-72);for(let y=96;y<H;y+=48)R('rgba(79,208,224,.5)',0,y,W,1);}
else if(T==='winter'){planks('#6a4a30','#5e4029','#3b2414');for(let i=0;i<40;i++)R('#ffffff',Math.floor(hsh(i,1,75)*W),100+Math.floor(hsh(i,2,75)*130),3,1);}
else if(T==='candy'){checker('#fde6ef','#f4a6c4');}
else checker('#e4d8b6','#6f9a58');
}
function drawPropsBack(){const D=S.decor;
if(D.moss){ell(190,134,34,9,'#3f7a3a');ell(190,133,31,7,'#5fa04a');for(let i=0;i<30;i++)R('#7bc45a',160+Math.floor(hsh(i,1,31)*60),128+Math.floor(hsh(i,2,31)*10),2,1);}
if(D.tree){R('#8a4a2a',12,160,20,10);R('#6a3a20',12,160,20,2);R('#6e4526',20,134,4,26);disk(22,122,14,'#2f6b3a');disk(13,130,9,'#3f8a43');disk(32,129,9,'#3f8a43');disk(22,114,8,'#4c9a4a');for(let i=0;i<14;i++)R('#6cc151',10+Math.floor(hsh(i,1,41)*26),108+Math.floor(hsh(i,2,41)*30),2,2);}
if(D.mush){for(const x of [90,110,210,230]){R('#efe3c8',x-2,224,4,7);ell(x,222,7,4,'#c8412d');R('#ffffff',x-4,221,2,2);R('#ffffff',x+1,220,2,2);R('#ffffff',x+3,223,1,1);}}
if(D.flowers){R('#6e4526',212,50,48,6);R('#4c8a3d',212,48,48,3);for(let x=214;x<258;x+=4){R(['#e25c48','#f6d45a','#f3a6c8','#ffffff'][Math.floor(hsh(x,1,51)*4)],x,45+Math.floor(hsh(x,2,51)*3),3,3);}}
if(D.birdhouse){R(C.ink,90,6,1,10);R('#8a5a34',84,16,13,12);R('#6e4526',84,16,13,1);for(let k=0;k<6;k++)R('#a02a1d',83+k,16-k,15-2*k,1);disk(90,22,2,C.ink);R('#6e4526',88,29,5,1);}
if(D.vines){for(const x of [4,10,34,80,100,164,198,264,300,316]){const len=14+Math.floor(hsh(x,1,61)*30);for(let y=0;y<len;y++){const wx=x+Math.round(Math.sin(y*.5+x)*1.5);R('#2f6b3a',wx,y,1,1);if(y%5===2){R('#4c8a3d',wx+1,y,3,2);R('#6cc151',wx-3,y+1,3,2);}}}}
}
function drawPropsFront(){const D=S.decor;
if(D.plants){for(const x of [148,216,238,300]){R('#8a4a2a',x-3,71,6,7);R('#6a3a20',x-3,71,6,1);R('#4c8a3d',x-4,65,8,6);R('#6cc151',x-2,62,4,4);R('#e25c48',x+1,64,2,2);}}
}
function drawFlies(){for(let i=0;i<12;i++){const x=16+i*25+Math.sin(S.time*.7+i*1.3)*10,y=26+(i%5)*24+Math.cos(S.time*.9+i*2.1)*8;if(Math.sin(S.time*2.2+i*1.7)>-.2){R('rgba(246,224,90,.28)',x-2,y-2,5,5);R('#f6e05a',x,y,2,2);}}}
function buildBack(){g=back.getContext('2d');
drawWall();
R('#7d4a38',168,0,24,42);for(let y=0;y<42;y+=6)R('#5a3326',168,y,24,1);for(let y=0;y<42;y+=12)R('#5a3326',180,y,1,6);R('#3b1f17',166,0,2,42);R('#3b1f17',192,0,2,42);
R(C.ink,98,5,62,24);R('#2f6b3a',100,7,58,20);R('#4c8a3d',100,7,58,2);txt('PIZZA',102,13,'#a02a1d',3);txt('PIZZA',101,12,'#f3e6c4',3);
disk(24,20,11,C.ink);disk(24,20,9,'#f3e6c4');for(let k=0;k<12;k++){const a=k*Math.PI/6;R('#2a1c18',24+Math.round(Math.cos(a)*7),20+Math.round(Math.sin(a)*7),1,1);}
R(C.ink,50,8,24,30);R('#e9dcb8',52,10,20,26);disk(62,22,7,'#e6b968');disk(62,22,5,'#c8412d');R('#a8281f',60,20,2,2);R('#a8281f',64,24,2,2);R('#a8281f',61,25,2,2);R('#2f6b3a',54,31,16,2);
R(C.ink,212,6,48,40);R('#9cc5d8',214,8,44,36);R(C.ink,235,8,2,36);R(C.ink,214,26,44,2);R('#d6ebf3',217,11,6,2);R('#d6ebf3',240,11,6,2);R('#e9dcb8',210,46,52,3);
R('#5a381f',268,8,38,34);R('#26402e',270,10,34,30);disk(287,24,8,'#e9e2c8');disk(287,24,6,'#26402e');R('#e9e2c8',283,22,2,2);R('#e9e2c8',289,26,2,2);R('#e9e2c8',288,20,2,2);
drawFloor();
R('rgba(0,0,0,.2)',0,92,W,5);
// dining area
R('#6a3d2e',0,200,W,4);for(let x=6;x<W;x+=24)R('#8a5a34',x,196,3,10);R('#8a5a34',0,198,W,2);
for(const x of [48,160,272]){R('#6a3d2e',x-1,222,3,10);ell(x,222,15,6,'#8a5a34');ell(x,221,14,5,'#e4d8b6');for(let k=0;k<5;k++)R('#c8412d',x-12+k*5,219+(k%2)*2,3,3);R('#8a5a34',x-24,218,6,10);R('#8a5a34',x+18,218,6,10);R('#6a3d2e',x-24,218,6,2);R('#6a3d2e',x+18,218,6,2);}
for(const x of [12,306]){R('#8a4a2a',x-5,226,10,10);R('#4c8a3d',x-7,214,14,12);R('#6cc151',x-4,212,8,6);}
R('#4a2a20',312,76,8,126);R('#2a1c18',311,134,9,42);R('#f0b85a',313,136,7,38);R('#c98a2e',313,136,7,3);
drawPropsBack();
}
function buildFront(){g=front.getContext('2d');g.clearRect(0,0,W,H);
R('#c28a52',0,72,W,6);R('#e0b27a',0,72,W,1);
R('#7a4b2a',0,78,W,14);for(let x=0;x<W;x+=32){R('#6a3f22',x+2,81,28,9);R('#8a5a34',x+3,82,26,1);}
// dough crate
for(const [bx,by] of [[19,53],[26,51],[33,53]]){disk(bx,by,4,'#f1dcab');R('#d9bd84',bx+1,by+1,3,2);R('#fff6dc',bx-2,by-2,1,1);}
R('#5a381f',8,56,34,4);R('#6e4526',10,60,30,18);R('#9b6a3c',12,62,26,4);R('#9b6a3c',12,70,26,4);R('#3b2414',10,60,2,18);R('#3b2414',38,60,2,18);R('#c9a06a',10,59,30,1);
// prep table
R('#bfb8aa',50,64,52,14);R('#ece6da',52,66,48,10);for(let i=0;i<30;i++)R('#d3ccbf',52+Math.floor(hsh(i,1,2)*46),66+Math.floor(hsh(i,2,2)*9),2,1);R('#9c9486',52,75,48,1);
// ingredient rack
R('#5c3a22',108,50,34,28);R('#8a5a34',110,52,30,24);R('#5c3a22',110,63,30,2);
const cols=['#c43a2b','#f0cf55','#b82d24','#25252b','#e3d2ec','#4a9a3a'];
for(let k=0;k<6;k++){const bx=112+(k%3)*9,by=(k<3?55:67);R('#d8d1c4',bx,by+3,8,5);R(cols[k],bx+1,by,6,4);R('#fff',bx+1,by,2,1);}
// oven
R('#3b1f17',154,40,52,38);R('#8a4e3a',158,43,44,3);R('#8a4e3a',162,40,36,3);R('#8a4e3a',156,46,48,32);
for(let y=46;y<78;y+=5){R('#5a3326',156,y,48,1);for(let x=156+((y/5)%2)*5;x<204;x+=10)R('#5a3326',x,y,1,5);}
R('#c9b79a',160,51,40,3);R('#e4d4b8',160,51,40,1);R('#1c0f0b',162,54,36,20);R('#2e1812',162,54,36,2);R('#5a3326',160,74,40,3);
// packing island
R('rgba(0,0,0,.18)',90,178,52,4);R('#2a1c18',90,148,52,32);R('#8d9aa2',92,150,48,28);R('#aab6bd',92,150,48,2);R('#6f7c84',92,176,48,2);
// turntable counter
R('rgba(0,0,0,.18)',248,180,64,4);R('#2a1c18',248,124,66,58);R('#8d9aa2',250,126,62,54);R('#aab6bd',250,126,62,2);R('#6f7c84',250,178,62,2);
drawPropsFront();
}
function buildPrep(){g=prepBG.getContext('2d');
R('#a06a38',0,0,PW,PH);for(let y=0;y<PH;y+=24){R('#8a5a2e',0,y,PW,2);}
for(let i=0;i<120;i++){R('#8a5a2e',Math.floor(hsh(i,3,4)*PW),Math.floor(hsh(i,4,4)*PH),6,1);}
R('#8f8678',8,14,146,164);R('#ece6da',10,16,142,160);
for(let i=0;i<160;i++){R('#d3ccbf',12+Math.floor(hsh(i,5,6)*138),18+Math.floor(hsh(i,6,6)*156),2,1);}
R('#3b2a24',156,16,96,160);R('#6b4428',158,18,92,156);R('#4a3326',160,20,88,152);
for(let k=0;k<3;k++)R('#5a3e2b',160,66+k*44,88,2);
}
const BOWLS=[{k:'sauce',x:164,y:26,l:'토마토소스'},{k:'cheese',x:208,y:26,l:'치즈가루'},{k:'pep',x:164,y:70,l:'페퍼로니'},{k:'olive',x:208,y:70,l:'올리브'},{k:'onion',x:164,y:114,l:'양파'},{k:'veg',x:208,y:114,l:'채소'}];
const PILE=[[9,9],[19,8],[29,10],[12,18],[23,18],[31,19]];
function drawBowl(b){const x=b.x,y=b.y;R('#3b2a24',x,y,40,30);R('#d8d1c4',x+1,y+1,38,28);R('#b9b1a2',x+1,y+24,38,5);
if(b.k==='sauce'){R('#c43a2b',x+3,y+3,34,21);for(let i=0;i<14;i++)R('#e25c48',x+4+Math.floor(hsh(i,1,7)*30),y+4+Math.floor(hsh(i,2,7)*18),3,1);}
else if(b.k==='cheese'){R('#e9c552',x+3,y+3,34,21);for(let i=0;i<30;i++){R(hsh(i,3,7)<.4?'#fff0a0':'#f6d86a',x+4+Math.floor(hsh(i,1,8)*31),y+4+Math.floor(hsh(i,2,8)*19),2,1);}}
else{R('#4b3b33',x+3,y+3,34,21);for(let k=0;k<6;k++)drawTop(b.k,x+PILE[k][0]+1,y+PILE[k][1]-1,k);}
}
function hitBowl(m){for(const b of BOWLS)if(m.x>=b.x&&m.x<=b.x+40&&m.y>=b.y&&m.y<=b.y+30)return b;return null;}
const player={x:150,y:118,dir:'down',moving:false,path:[],cb:null};
const SPD=78,keys={};
const expand=(r,m)=>[r[0]-m,r[1]-m,r[2]+2*m,r[3]+2*m];
const OBS=[ISL,TUR];
function blocked(x,y){if(x<12||x>308||y<96||y>196)return true;if(S.decor.tree&&x<32&&y>=108)return true;for(const r of OBS){const e=expand(r,5);if(x>=e[0]&&x<=e[0]+e[2]&&y>=e[1]&&y<=e[1]+e[3])return true;}return false;}
function segHits(a,b,r){let t0=0,t1=1;const dx=b.x-a.x,dy=b.y-a.y,p=[-dx,dx,-dy,dy],q=[a.x-r[0],r[0]+r[2]-a.x,a.y-r[1],r[1]+r[3]-a.y];
for(let i=0;i<4;i++){if(p[i]===0){if(q[i]<0)return false;}else{const t=q[i]/p[i];if(p[i]<0){if(t>t1)return false;if(t>t0)t0=t;}else{if(t<t0)return false;if(t<t1)t1=t;}}}return true;}
function route(a,b){const ex=OBS.map(r=>expand(r,6));const clear=(p,q)=>!ex.some(r=>segHits(p,q,r));
if(clear(a,b))return[b];
const nodes=[a];for(const r of OBS){const e=expand(r,10);for(const pt of [[e[0],e[1]],[e[0]+e[2],e[1]],[e[0],e[1]+e[3]],[e[0]+e[2],e[1]+e[3]]])nodes.push({x:clamp(pt[0],12,308),y:clamp(pt[1],96,196)});}
nodes.push(b);const n=nodes.length,dist=new Array(n).fill(1e9),prev=new Array(n).fill(-1),done=new Array(n).fill(false);dist[0]=0;
for(let it=0;it<n;it++){let u=-1;for(let i=0;i<n;i++)if(!done[i]&&(u<0||dist[i]<dist[u]))u=i;if(u<0||dist[u]>=1e9)break;done[u]=true;
for(let v=0;v<n;v++){if(done[v])continue;if(!clear(nodes[u],nodes[v]))continue;const d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u;}}}
if(prev[n-1]<0)return[b];const path=[];for(let v=n-1;v>0;v=prev[v])path.unshift(nodes[v]);return path;}
function walkTo(tx,ty,cb){player.path=route({x:player.x,y:player.y},{x:tx,y:ty});player.cb=cb||null;}
function faceTo(dx,dy){if(Math.abs(dx)>Math.abs(dy))player.dir=dx>0?'right':'left';else player.dir=dy>0?'down':'up';}
function updatePlayer(dt){
const mx=(keys.right?1:0)-(keys.left?1:0),my=(keys.down?1:0)-(keys.up?1:0);
if(mx||my){player.path=[];player.cb=null;const l=Math.hypot(mx,my),dx=mx/l*SPD*dt,dy=my/l*SPD*dt;if(!blocked(player.x+dx,player.y))player.x+=dx;if(!blocked(player.x,player.y+dy))player.y+=dy;faceTo(mx,my);player.moving=true;return;}
if(player.path.length){const t=player.path[0],d=Math.hypot(t.x-player.x,t.y-player.y),st=SPD*dt;faceTo(t.x-player.x,t.y-player.y);if(d<=st){player.x=t.x;player.y=t.y;player.path.shift();}else{player.x+=(t.x-player.x)/d*st;player.y+=(t.y-player.y)/d*st;}player.moving=true;return;}
player.moving=false;
if(player.cb){const f=player.cb;player.cb=null;f();}
}
window.addEventListener('keydown',e=>{const k=e.key;const m={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down'}[k];
if(m&&modal.hidden&&S.mode==='main'){keys[m]=true;e.preventDefault();}
if(k==='Escape'&&!modal.hidden&&!sumInfo)closeModal();});
window.addEventListener('keyup',e=>{const m={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down'}[e.key];if(m)keys[m]=false;});
