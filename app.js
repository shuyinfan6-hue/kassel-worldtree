(() => {
  const canvas = document.querySelector('#emblem');
  const ctx = canvas.getContext('2d', { alpha: true });
  const toggle = document.querySelector('#toggle');
  let w=0,h=0,dpr=1,angle=-.25,tilt=.02,zoom=1,auto=true,drag=false,lastX=0,lastY=0,vx=0;
  const branches=[]; const leaves=[]; const roots=[]; const stars=[];
  const rand=(a,b)=>a+Math.random()*(b-a);
  function branch(x,y,z,len,a,depth,alive){
    if(depth<=0)return;
    const sway=(alive?-.06:.08), x2=x+Math.cos(a)*len, y2=y-Math.sin(a)*len, z2=z+sway*len+rand(-.05,.05)*len;
    branches.push({x,y,z,x2,y2,z2,depth,alive});
    if(alive&&depth<4) for(let i=0;i<5;i++) leaves.push({x:x2+rand(-.12,.12),y:y2+rand(-.08,.1),z:z2+rand(-.1,.1),s:rand(.018,.038)});
    const count=depth>4?2:depth>2?(Math.random()>.35?2:1):1;
    for(let i=0;i<count;i++) branch(x2,y2,z2,len*rand(.66,.78),a+rand(-.48,.48)+(i?-.28:.18),depth-1,alive);
  }
  for(let i=0;i<7;i++){const live=i<4;branch(live?-.035:.035,.17,0,.23,Math.PI/2+rand(live?.06:-.45,live?.5:-.06),6,live)}
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2+rand(-.08,.08);roots.push({a,len:rand(.55,.94),bend:rand(-.22,.22)})}
  for(let i=0;i<90;i++)stars.push({x:Math.random(),y:Math.random(),s:rand(.2,1.3),p:rand(0,6.28)});
  function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function rot(p){const c=Math.cos(angle),s=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);let x=p.x*c-p.z*s,z=p.x*s+p.z*c,y=p.y;return{x,y:y*ct-z*st,z:y*st+z*ct}}
  function proj(p,R,cx,cy){const q=rot(p),k=1/(1+q.z*.32);return{x:cx+q.x*R*k,y:cy-q.y*R*k,z:q.z,k}}
  function line3(a,b,R,cx,cy,width,color){const p=proj(a,R,cx,cy),q=proj(b,R,cx,cy);ctx.strokeStyle=color;ctx.lineWidth=Math.max(.55,width*p.k);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
  function draw(t){ctx.clearRect(0,0,w,h);const cx=w/2,cy=h*.46,R=Math.min(w,h)*.34*zoom;
    for(const s of stars){const a=.13+.16*Math.sin(t*.0007+s.p);ctx.fillStyle=`rgba(210,188,115,${a})`;ctx.fillRect(s.x*w,s.y*h,s.s,s.s)}
    const glow=ctx.createRadialGradient(cx-R*.25,cy-R*.35,R*.06,cx,cy,R*1.25);glow.addColorStop(0,'rgba(90,118,70,.18)');glow.addColorStop(.55,'rgba(17,24,20,.2)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,R*1.4,0,7);ctx.fill();
    const sphere=ctx.createRadialGradient(cx-R*.32,cy-R*.38,R*.08,cx,cy,R);sphere.addColorStop(0,'#36423a');sphere.addColorStop(.28,'#17201b');sphere.addColorStop(.72,'#090d0c');sphere.addColorStop(1,'#010202');ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,R*.975,0,7);ctx.clip();
    for(const r of roots){let prev={x:0,y:-.22,z:0};for(let j=1;j<=8;j++){const k=j/8,rr=r.len*k*.78,a=r.a+r.bend*k;const cur={x:Math.cos(a)*rr,y:-.22-Math.sin(k*Math.PI)*.14-k*.42,z:Math.sin(a)*rr};line3(prev,cur,R,cx,cy,4*(1-k)+.5,`rgba(${Math.cos(a)<0?'112,126,67':'91,77,63'},${.66-k*.22})`);prev=cur}}
    line3({x:-.035,y:-.42,z:0},{x:-.025,y:.22,z:0},R,cx,cy,25,'rgba(108,85,49,.95)');line3({x:.03,y:-.41,z:.01},{x:.02,y:.23,z:0},R,cx,cy,17,'rgba(67,57,48,.96)');
    const sorted=[...branches].sort((a,b)=>a.z-b.z);for(const b of sorted)line3({x:b.x,y:b.y,z:b.z},{x:b.x2,y:b.y2,z:b.z2},R,cx,cy,b.depth*1.25,b.alive?`rgba(113,105,58,${.55+b.depth*.05})`:`rgba(80,70,62,${.52+b.depth*.055})`);
    for(const l of leaves){const p=proj(l,R,cx,cy);if(p.z<1.2){ctx.fillStyle=p.z<0?'rgba(49,83,43,.72)':'rgba(91,126,54,.88)';ctx.beginPath();ctx.ellipse(p.x,p.y,l.s*R*p.k,l.s*R*.6*p.k,angle*.25,0,7);ctx.fill()}}
    ctx.restore();
    ctx.strokeStyle='rgba(193,158,76,.34)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();ctx.strokeStyle='rgba(235,205,124,.12)';ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx-R*.02,cy-R*.01,R*.985,3.3,5.15);ctx.stroke();
    if(auto&&!drag)angle+=.0023;if(!drag){angle+=vx;vx*=.94}requestAnimationFrame(draw)}
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;angle+=dx*.007;tilt=Math.max(-.55,Math.min(.55,tilt+dy*.004));vx=dx*.0007;lastX=e.clientX;lastY=e.clientY});
  canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.7,Math.min(1.28,zoom-e.deltaY*.0007))},{passive:false});
  canvas.addEventListener('dblclick',()=>{angle=-.25;tilt=.02;zoom=1});
  toggle.addEventListener('click',()=>{auto=!auto;toggle.textContent=auto?'暂停':'继续';toggle.setAttribute('aria-label',auto?'暂停自动旋转':'继续自动旋转')});
  addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();
