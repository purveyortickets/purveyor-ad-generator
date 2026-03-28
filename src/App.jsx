import { useState, useRef, useCallback, useEffect } from 'react'
import WebhookEditor from './WebhookEditor'

const C = {
  bg:'#0a0014', card:'#140025', accent:'#270052', purple:'#6b21a8',
  lilac:'#c084fc', glow:'#a855f7', text:'#f3e8ff',
  muted:'#a78bfa', border:'#2e1065', input:'#1e0538',
}
const LOGO_URL = 'https://i.imgur.com/xBPYOvX.jpeg'

const SOCIALS = [
  {label:'Website',url:'https://purveyortickets.vercel.app/',icon:'🌐'},
  {label:'Twitter',url:'https://x.com/purveyor_ph',icon:'𝕏'},
  {label:'Proofs',url:'https://x.com/purveyorproof',icon:'𝕏'},
  {label:'Facebook',url:'https://www.facebook.com/Purveyor.PH',icon:'📘'},
  {label:'Instagram',url:'https://www.instagram.com/purveyor_ph',icon:'📸'},
  {label:'TikTok',url:'https://www.tiktok.com/@purveyor_ph',icon:'🎵'},
]

// ==========================================
// FLOATING PARTICLES
// ==========================================
function Particles({speed=1}){
  const ref=useRef(null)
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');let id,ps=[]
    const resize=()=>{
      const dpr=window.devicePixelRatio||1
      c.width=window.innerWidth*dpr;c.height=window.innerHeight*dpr
      c.style.width=window.innerWidth+'px';c.style.height=window.innerHeight+'px'
      ctx.scale(dpr,dpr)
    }
    resize();window.addEventListener('resize',resize)
    const w=()=>window.innerWidth, h=()=>window.innerHeight
    for(let i=0;i<90;i++)ps.push({x:Math.random()*w(),y:Math.random()*h(),r:Math.random()*2.5+0.5,dx:(Math.random()-0.5)*0.35*speed,dy:-(Math.random()*0.5+0.1)*speed,o:Math.random()*0.5+0.1})
    const draw=()=>{
      ctx.clearRect(0,0,w(),h())
      ps.forEach(p=>{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(192,132,252,${p.o})`;ctx.fill()
        p.x+=p.dx;p.y+=p.dy
        if(p.y<-10){p.y=h()+10;p.x=Math.random()*w()}
        if(p.x<-10)p.x=w()+10;if(p.x>w()+10)p.x=-10
      })
      id=requestAnimationFrame(draw)
    }
    draw();return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',resize)}
  },[speed])
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,pointerEvents:'none',zIndex:1}}/>
}

// ==========================================
// PASSWORD GATE
// ==========================================
function PasswordGate({onUnlock}){
  const [pw,setPw]=useState('');const [err,setErr]=useState(false);const [loading,setLoading]=useState(false)
  const go=async e=>{e.preventDefault();setLoading(true);setErr(false);try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});if(r.ok){const d=await r.json();if(d.success){sessionStorage.setItem('pt_auth','1');onUnlock();setLoading(false);return}}setErr(true)}catch{setErr(true)}setLoading(false)}
  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Outfit',sans-serif",position:'relative',zIndex:2}}>
      <div style={{background:'rgba(20,0,37,0.85)',border:`1px solid ${C.border}`,borderRadius:20,padding:'48px 40px',width:400,textAlign:'center',boxShadow:`0 0 80px ${C.accent}44`,backdropFilter:'blur(16px)'}}>
        <img src={LOGO_URL} alt="" style={{width:80,height:80,borderRadius:16,marginBottom:20,objectFit:'cover',border:'3px solid rgba(255,255,255,0.3)'}} onError={e=>{e.target.style.display='none'}}/>
        <h1 style={{color:C.text,fontSize:22,fontWeight:700,margin:'0 0 6px'}}>Purveyor Tickets</h1>
        <p style={{color:C.muted,fontSize:13,margin:'0 0 28px'}}>Ad Generator — Enter password</p>
        <form onSubmit={go}>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} placeholder="Master password" autoFocus style={{width:'100%',padding:'14px 16px',borderRadius:12,border:`1px solid ${err?'#ef4444':C.border}`,background:C.input,color:C.text,fontSize:15,outline:'none',boxSizing:'border-box',fontFamily:"'Outfit',sans-serif"}}/>
          {err&&<p style={{color:'#ef4444',fontSize:13,margin:'10px 0 0'}}>Incorrect password</p>}
          <button type="submit" disabled={loading} style={{marginTop:20,width:'100%',padding:'14px 0',borderRadius:12,border:'none',background:`linear-gradient(135deg,${C.purple},${C.glow})`,color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',opacity:loading?0.6:1,fontFamily:"'Outfit',sans-serif"}}>{loading?'Verifying...':'Unlock'}</button>
        </form>
      </div>
    </div>
  )
}

// ==========================================
// CANVAS HELPERS
// ==========================================
const AD_W=1080, AD_H=1350

function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()}
function loadImg(s,timeout=5000){
  return new Promise((r,j)=>{
    const i=new Image();i.crossOrigin='anonymous'
    const t=setTimeout(()=>j(new Error('timeout')),timeout)
    i.onload=()=>{clearTimeout(t);r(i)}
    i.onerror=()=>{clearTimeout(t);j(new Error('failed'))}
    i.src=s
  })
}
function wrap(ctx,t,mw){const w=t.split(' ');let l='';const ls=[];for(const x of w){const test=l?l+' '+x:x;if(ctx.measureText(test).width>mw&&l){ls.push(l);l=x}else l=test};if(l)ls.push(l);return ls}

function drawIcon(ctx,type,cx,cy,sz,col){
  ctx.save();ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';const s=sz/24
  if(type==='x'){
    // X logo — bold stylized
    ctx.fillStyle=col;ctx.font=`bold ${sz*1.0}px Arial,sans-serif`
    ctx.textAlign='center';ctx.textBaseline='middle'
    ctx.fillText('𝕏',cx,cy+1*s)
  }
  else if(type==='fb'){ctx.font=`bold ${sz*1.3}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('f',cx+s,cy+2*s)}
  else if(type==='ig'){ctx.lineWidth=2.4*s;rr(ctx,cx-9*s,cy-9*s,18*s,18*s,5*s);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,5*s,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx+6*s,cy-6*s,1.6*s,0,Math.PI*2);ctx.fill()}
  else if(type==='tt'){ctx.font=`bold ${sz*1.2}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('♪',cx,cy+s)}
  else if(type==='web'){ctx.lineWidth=2.2*s;ctx.beginPath();ctx.arc(cx,cy,9*s,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-9*s,cy);ctx.lineTo(cx+9*s,cy);ctx.stroke();ctx.beginPath();ctx.ellipse(cx,cy,4.5*s,9*s,0,0,Math.PI*2);ctx.stroke()}
  ctx.restore()
}

// Draw logo with rounded corners and white border on canvas
function drawLogo(ctx, img, x, y, size, borderW) {
  const r = size * 0.2 // corner radius
  ctx.save()
  // White border
  rr(ctx, x - borderW, y - borderW, size + borderW*2, size + borderW*2, r + borderW)
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fill()
  // Clip rounded rect and draw
  rr(ctx, x, y, size, size, r)
  ctx.clip()
  ctx.drawImage(img, x, y, size, size)
  ctx.restore()
}

// ==========================================
// GENERATE AD
// ==========================================
async function generateAd(canvas,{eventImage,eventName,subtitle,variant='fb',logoImg=null}){
  const ctx=canvas.getContext('2d');canvas.width=AD_W;canvas.height=AD_H

  // ═══ CONCERT STAGE BACKGROUND ═══

  // Dark base
  ctx.fillStyle='#08000f';ctx.fillRect(0,0,AD_W,AD_H)

  // Stage spotlight gradient from top center
  const stageGlow=ctx.createRadialGradient(AD_W/2,0,0,AD_W/2,AD_H*0.3,AD_W*0.8)
  stageGlow.addColorStop(0,'#3d0082');stageGlow.addColorStop(0.3,'#1f0042');stageGlow.addColorStop(0.7,'#0e001c');stageGlow.addColorStop(1,'#08000f')
  ctx.fillStyle=stageGlow;ctx.fillRect(0,0,AD_W,AD_H)

  // Colored stage lights from top
  const lights=[
    {x:AD_W*0.2,c:'rgba(168,85,247,',w:100},
    {x:AD_W*0.5,c:'rgba(192,132,252,',w:120},
    {x:AD_W*0.8,c:'rgba(139,92,246,',w:100},
  ]
  lights.forEach(l=>{
    const lg=ctx.createLinearGradient(l.x,0,l.x,AD_H*0.5)
    lg.addColorStop(0,l.c+'0.25)');lg.addColorStop(0.5,l.c+'0.08)');lg.addColorStop(1,l.c+'0)')
    ctx.fillStyle=lg
    ctx.beginPath();ctx.moveTo(l.x-15,0);ctx.lineTo(l.x-l.w,AD_H*0.5);ctx.lineTo(l.x+l.w,AD_H*0.5);ctx.lineTo(l.x+15,0);ctx.closePath();ctx.fill()
  })

  // Side color washes
  const wash1=ctx.createRadialGradient(0,AD_H*0.3,0,0,AD_H*0.3,500)
  wash1.addColorStop(0,'rgba(124,58,237,0.12)');wash1.addColorStop(1,'rgba(124,58,237,0)')
  ctx.fillStyle=wash1;ctx.fillRect(0,0,AD_W,AD_H)
  const wash2=ctx.createRadialGradient(AD_W,AD_H*0.4,0,AD_W,AD_H*0.4,500)
  wash2.addColorStop(0,'rgba(168,85,247,0.10)');wash2.addColorStop(1,'rgba(168,85,247,0)')
  ctx.fillStyle=wash2;ctx.fillRect(0,0,AD_W,AD_H)

  // Bottom glow (stage floor reflection)
  const floorGlow=ctx.createRadialGradient(AD_W/2,AD_H,0,AD_W/2,AD_H,AD_H*0.4)
  floorGlow.addColorStop(0,'rgba(39,0,82,0.35)');floorGlow.addColorStop(1,'rgba(39,0,82,0)')
  ctx.fillStyle=floorGlow;ctx.fillRect(0,0,AD_W,AD_H)

  // ── CROWD SILHOUETTE at the very bottom ──
  ctx.save()
  const crowdY=AD_H-40
  ctx.fillStyle='rgba(0,0,0,0.5)'

  // Draw crowd as a bumpy silhouette line
  ctx.beginPath()
  ctx.moveTo(0,AD_H)

  // Generate crowd heads as bumps
  for(let x=0;x<=AD_W;x+=15){
    const headH=Math.random()*25+10
    const isTall=Math.random()>0.7
    const h=isTall?headH+15:headH
    ctx.lineTo(x,crowdY-h)
    ctx.lineTo(x+7,crowdY-h-5)
    ctx.lineTo(x+14,crowdY-h)
  }
  ctx.lineTo(AD_W,AD_H);ctx.closePath();ctx.fill()

  // Raised hands in crowd
  ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=3
  const hands=[60,150,280,400,520,650,780,900,1020]
  hands.forEach(hx=>{
    const hy=crowdY-30-Math.random()*20
    const angle=(Math.random()-0.5)*0.4
    ctx.save();ctx.translate(hx,hy);ctx.rotate(angle)
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-35-Math.random()*20);ctx.stroke()
    ctx.restore()
  })

  // Phone screens in crowd (glowing rectangles)
  ctx.fillStyle='rgba(180,200,255,0.3)'
  const phones=[120,310,490,700,860]
  phones.forEach(px=>{
    const py=crowdY-15-Math.random()*15
    ctx.fillRect(px-4,py-8,8,12)
  })
  ctx.restore()

  // ── Floating light particles (like concert haze) ──
  for(let i=0;i<80;i++){
    const px=Math.random()*AD_W,py=Math.random()*AD_H*0.7
    const pr=Math.random()*2+0.5
    const pa=Math.random()*0.3+0.05
    ctx.fillStyle=`rgba(192,132,252,${pa})`
    ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill()
  }

  // ── Scattered logo watermarks across background ──
  if(logoImg){
    const logoPositions=[
      {x:60,y:320,s:65,r:-0.15,a:0.04},
      {x:960,y:250,s:55,r:0.2,a:0.035},
      {x:80,y:750,s:50,r:0.1,a:0.03},
      {x:980,y:680,s:60,r:-0.25,a:0.035},
      {x:160,y:1100,s:45,r:0.3,a:0.03},
      {x:920,y:1050,s:50,r:-0.1,a:0.03},
      {x:500,y:180,s:40,r:0.15,a:0.025},
      {x:540,y:1250,s:55,r:-0.2,a:0.03},
      {x:200,y:500,s:35,r:0.25,a:0.02},
      {x:850,y:450,s:40,r:-0.3,a:0.025},
      {x:350,y:900,s:45,r:0.1,a:0.025},
      {x:750,y:850,s:38,r:-0.15,a:0.02},
    ]
    logoPositions.forEach(p=>{
      ctx.save()
      ctx.translate(p.x,p.y)
      ctx.rotate(p.r)
      ctx.globalAlpha=p.a
      ctx.drawImage(logoImg,-p.s/2,-p.s/2,p.s,p.s)
      ctx.restore()
    })
  }

  // ── Extra sparkle/particle dots scattered everywhere ──
  for(let i=0;i<120;i++){
    const sx=Math.random()*AD_W,sy=Math.random()*AD_H
    const sr=Math.random()*1.8+0.3
    const sa=Math.random()*0.15+0.03
    const color=Math.random()>0.5?'192,132,252':'168,85,247'
    ctx.fillStyle=`rgba(${color},${sa})`
    ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill()
  }

  // Film grain
  ctx.fillStyle='rgba(255,255,255,0.004)';for(let i=0;i<3000;i++)ctx.fillRect(Math.random()*AD_W,Math.random()*AD_H,1,1)

  // ═══ LOGO + PURVEYOR TICKETS ═══
  // logoImg is passed in from params (cached)
  const topY=18
  if(logoImg){
    const ls=48
    const bt='PURVEYOR TICKETS'
    ctx.font="700 28px 'Outfit',Arial,sans-serif";ctx.textBaseline='middle'
    const bw=ctx.measureText(bt).width,tw=ls+12+bw,sx=(AD_W-tw)/2
    drawLogo(ctx,logoImg,sx,topY,ls,2.5)
    ctx.fillStyle='rgba(243,232,255,0.95)';ctx.font="700 28px 'Outfit',Arial,sans-serif"
    ctx.textAlign='start';ctx.textBaseline='middle'
    ctx.fillText(bt,sx+ls+12,topY+ls/2)
  }else{
    ctx.fillStyle='rgba(243,232,255,0.95)';ctx.font="700 28px Arial,sans-serif"
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('PURVEYOR TICKETS',AD_W/2,topY+24)
  }

  // ═══ TICKET ASSISTANCE — Playfair Display italic (fancy serif) ═══
  ctx.textAlign='center';ctx.textBaseline='alphabetic'
  ctx.save();ctx.shadowColor='rgba(168,85,247,0.5)';ctx.shadowBlur=40
  ctx.fillStyle='#ffffff';ctx.font="italic 900 86px 'Playfair Display',Georgia,serif"
  ctx.fillText('TICKET ASSISTANCE',AD_W/2,155);ctx.restore()
  ctx.fillStyle='#ffffff';ctx.font="italic 900 86px 'Playfair Display',Georgia,serif"
  ctx.fillText('TICKET ASSISTANCE',AD_W/2,155)
  ctx.fillStyle='#c084fc';ctx.font="700 34px 'Outfit',Arial,sans-serif"
  ctx.fillText('HELP TO BUY  ·  DIRECT LINKS',AD_W/2,194)
  const hl=ctx.createLinearGradient(AD_W/2-240,0,AD_W/2+240,0)
  hl.addColorStop(0,'transparent');hl.addColorStop(0.2,'rgba(192,132,252,0.4)');hl.addColorStop(0.8,'rgba(192,132,252,0.4)');hl.addColorStop(1,'transparent')
  ctx.strokeStyle=hl;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(AD_W/2-240,204);ctx.lineTo(AD_W/2+240,204);ctx.stroke()

  // ═══ FACEBOOK POST MOCKUP (taller) ═══
  const postM=190, postX=postM, postY=224, postW=AD_W-postM*2, postR=14
  const headerH=60, engageH=42

  let imgAreaH=600
  if(eventImage){
    const fitH=Math.round(postW/(eventImage.width/eventImage.height))
    imgAreaH=Math.max(420,Math.min(fitH,720))
  }
  const postH=headerH+imgAreaH+engageH

  // Card shadow
  ctx.save();ctx.shadowColor='rgba(0,0,0,0.4)';ctx.shadowBlur=30;ctx.shadowOffsetY=8
  rr(ctx,postX,postY,postW,postH,postR);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore()

  // Profile header (bigger for readability)
  const phX=postX+14,phY=postY+10
  if(logoImg){
    ctx.save();ctx.beginPath();ctx.arc(phX+17,phY+17,17,0,Math.PI*2);ctx.clip()
    ctx.drawImage(logoImg,phX,phY,34,34);ctx.restore()
    ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1.5
    ctx.beginPath();ctx.arc(phX+17,phY+17,18,0,Math.PI*2);ctx.stroke()
  }
  ctx.fillStyle='#1a1a1a';ctx.font="bold 16px 'Outfit',Arial,sans-serif"
  ctx.textAlign='start';ctx.textBaseline='middle';ctx.fillText('Purveyor Tickets',phX+42,phY+11)
  ctx.fillStyle='#888';ctx.font="400 11px 'Outfit',Arial,sans-serif"
  ctx.fillText('Sponsored · 🌐',phX+42,phY+28)
  ctx.fillStyle='#888';ctx.font="bold 18px Arial";ctx.textAlign='end';ctx.fillText('···',postX+postW-14,phY+17)

  // Image area — FIT
  const iaX=postX,iaY=postY+headerH,iaW=postW,iaH=imgAreaH
  if(eventImage){
    ctx.save();ctx.beginPath();ctx.rect(iaX,iaY,iaW,iaH);ctx.clip()
    ctx.fillStyle='#f5f5f5';ctx.fillRect(iaX,iaY,iaW,iaH)
    const imgR=eventImage.width/eventImage.height,areaR=iaW/iaH
    let dw,dh,dx,dy
    if(imgR>areaR){dw=iaW;dh=iaW/imgR;dx=iaX;dy=iaY+(iaH-dh)/2}
    else{dh=iaH;dw=iaH*imgR;dx=iaX+(iaW-dw)/2;dy=iaY}
    ctx.drawImage(eventImage,dx,dy,dw,dh);ctx.restore()
  }else{
    ctx.fillStyle='#f0f0f0';ctx.fillRect(iaX,iaY,iaW,iaH)
    ctx.fillStyle='#ccc';ctx.font="bold 22px 'Outfit',Arial,sans-serif"
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('📷  Event Image',AD_W/2,iaY+iaH/2)
  }

  // Engagement bar
  const ebY=iaY+iaH
  ctx.save();ctx.beginPath();ctx.moveTo(postX,ebY);ctx.lineTo(postX+postW,ebY)
  ctx.lineTo(postX+postW,ebY+engageH-postR);ctx.quadraticCurveTo(postX+postW,ebY+engageH,postX+postW-postR,ebY+engageH)
  ctx.lineTo(postX+postR,ebY+engageH);ctx.quadraticCurveTo(postX,ebY+engageH,postX,ebY+engageH-postR)
  ctx.closePath();ctx.fillStyle='#ffffff';ctx.fill();ctx.restore()
  ctx.strokeStyle='#e0e0e0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(postX+10,ebY+1);ctx.lineTo(postX+postW-10,ebY+1);ctx.stroke()
  const btnY=ebY+engageH/2+2,bw3=postW/3
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#666';ctx.font="600 12px 'Outfit',Arial,sans-serif"
  ctx.fillText('👍 Like',postX+bw3*0.5,btnY);ctx.fillText('💬 Comment',postX+bw3*1.5,btnY);ctx.fillText('↗ Share',postX+bw3*2.5,btnY)

  // ═══ EVENT NAME ═══
  const nameY=postY+postH+22
  ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle='#ffffff'
  ctx.font="800 44px 'Outfit',Arial,sans-serif"
  const nl=wrap(ctx,eventName||'EVENT NAME',AD_W-60)
  nl.forEach((l,i)=>ctx.fillText(l,AD_W/2,nameY+i*52))

  // ═══ SUBTITLE (bigger) ═══
  if(subtitle){
    const sy=nameY+nl.length*52+2;ctx.fillStyle='#c084fc';ctx.font="600 26px 'Outfit',Arial,sans-serif"
    wrap(ctx,subtitle,AD_W-60).forEach((l,i)=>ctx.fillText(l,AD_W/2,sy+i*32))
  }

  // ═══ BOTTOM — socials + discord ═══
  const socPillY = AD_H - 170
  rr(ctx,15,socPillY,AD_W-30,48,24)
  ctx.fillStyle='rgba(107,33,168,0.12)';ctx.fill()
  ctx.strokeStyle='rgba(168,85,247,0.10)';ctx.lineWidth=1;ctx.stroke()

  const socRow=[{icon:'x',label:'@purveyor_ph'},{icon:'x',label:'@purveyorproof'},{icon:'fb',label:'Purveyor.PH'},{icon:'ig',label:'purveyor_ph'},{icon:'tt',label:'@purveyor_ph'}]
  const socRowY=socPillY+24

  ctx.font="600 20px 'Outfit',Arial,sans-serif"
  const is=32,gp=20
  const ws=socRow.map(it=>is+ctx.measureText(it.label).width)
  const tot=ws.reduce((a,b)=>a+b,0)+gp*(socRow.length-1)
  let cx2=(AD_W-tot)/2
  socRow.forEach((it,i)=>{drawIcon(ctx,it.icon,cx2+13,socRowY,25,'#c084fc');ctx.fillStyle='#b09cff';ctx.font="600 20px 'Outfit',Arial,sans-serif";ctx.textAlign='start';ctx.textBaseline='middle';ctx.fillText(it.label,cx2+is,socRowY);cx2+=ws[i]+gp})

  // Join + Discord (only for FB/IG variant)
  if(variant !== 'x') {
    // Discord box with soft border
    const boxW=620, boxH=80, boxR=16
    const boxX=(AD_W-boxW)/2, boxY=AD_H-108

    // Box background
    ctx.save()
    ctx.shadowColor='rgba(88,101,242,0.2)';ctx.shadowBlur=20
    rr(ctx,boxX,boxY,boxW,boxH,boxR)
    ctx.fillStyle='rgba(20,0,40,0.5)';ctx.fill()
    // Soft purple border
    rr(ctx,boxX,boxY,boxW,boxH,boxR)
    ctx.strokeStyle='rgba(168,85,247,0.35)';ctx.lineWidth=1.5;ctx.stroke()
    ctx.restore()

    // "Join Our Growing Community" inside box
    ctx.textAlign='center';ctx.textBaseline='middle'
    ctx.fillStyle='rgba(243,232,255,0.8)';ctx.font="600 18px 'Outfit',Arial,sans-serif"
    ctx.fillText('Join Our Growing Community',AD_W/2,boxY+24)

    // Discord link inside box
    ctx.save();ctx.shadowColor='rgba(168,85,247,0.4)';ctx.shadowBlur=20
    ctx.fillStyle='#ffffff';ctx.font="bold 34px 'Outfit',Arial,sans-serif"
    ctx.fillText('discord.gg/747CdAeYwm',AD_W/2,boxY+56);ctx.restore()
    ctx.fillStyle='#ffffff';ctx.font="bold 34px 'Outfit',Arial,sans-serif"
    ctx.fillText('discord.gg/747CdAeYwm',AD_W/2,boxY+56)
  }

  // Bottom line
  const btm=ctx.createLinearGradient(80,0,AD_W-80,0)
  btm.addColorStop(0,'transparent');btm.addColorStop(0.12,'rgba(147,51,234,0.6)');btm.addColorStop(0.5,'rgba(192,132,252,0.9)');btm.addColorStop(0.88,'rgba(147,51,234,0.6)');btm.addColorStop(1,'transparent')
  ctx.strokeStyle=btm;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(80,AD_H-18);ctx.lineTo(AD_W-80,AD_H-18);ctx.stroke()
  ctx.textAlign='start';ctx.textBaseline='alphabetic'
}

// ==========================================
// AD GENERATOR UI
// ==========================================
function AdGeneratorBody(){
  const canvasRef=useRef(null),fileRef=useRef(null)
  const [eventName,setEventName]=useState('')
  const [subtitle,setSubtitle]=useState('')
  const [imgUrl,setImgUrl]=useState(null)
  const [imgObj,setImgObj]=useState(null)
  const [preview,setPreview]=useState(null)
  const [previewX,setPreviewX]=useState(null)
  const [busy,setBusy]=useState(false)

  const onFile=e=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f);setImgUrl(u);const img=new Image();img.onload=()=>setImgObj(img);img.src=u}

  const loadFont=async()=>{
    try{const font=new FontFace('Summer Concert',`url(/Summer_Concert.otf)`);await font.load();document.fonts.add(font)}catch{}
    await new Promise(r=>setTimeout(r,300))
  }

  const logoCache=useRef(null)
  const gen=useCallback(async()=>{
    if(!canvasRef.current)return;setBusy(true)
    try{
      await loadFont()
      // Load logo once, cache it
      if(!logoCache.current){try{logoCache.current=await loadImg(LOGO_URL)}catch{logoCache.current=null}}
      await generateAd(canvasRef.current,{eventImage:imgObj,eventName,subtitle,variant:'fb',logoImg:logoCache.current})
      setPreview(canvasRef.current.toDataURL('image/png'))
      await generateAd(canvasRef.current,{eventImage:imgObj,eventName,subtitle,variant:'x',logoImg:logoCache.current})
      setPreviewX(canvasRef.current.toDataURL('image/png'))
    }catch(e){console.error('Generate error:',e)}
    setBusy(false)
  },[imgObj,eventName,subtitle])

  const dl=()=>{if(!preview)return;const a=document.createElement('a');a.href=preview;a.download=`purveyor-${eventName.replace(/\s+/g,'-').toLowerCase()||'ad'}-fb-${Date.now()}.png`;a.click()}
  const dlX=()=>{if(!previewX)return;const a=document.createElement('a');a.href=previewX;a.download=`purveyor-${eventName.replace(/\s+/g,'-').toLowerCase()||'ad'}-x-${Date.now()}.png`;a.click()}

  const inp={width:'100%',padding:'13px 14px',borderRadius:10,border:`1px solid ${C.border}`,background:C.input,color:C.text,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:"'Outfit',sans-serif"}
  const lbl={color:C.muted,fontSize:11,fontWeight:700,marginBottom:5,display:'block',textTransform:'uppercase',letterSpacing:1}

  return(
    <div style={{fontFamily:"'Outfit',sans-serif",color:C.text,position:'relative',zIndex:2}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'20px 20px',gap:20}}>
        <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center',width:'100%',maxWidth:1600}}>
          <div style={{background:'rgba(20,0,37,0.75)',border:`1px solid ${C.border}`,borderRadius:16,padding:24,width:320,flexShrink:0,backdropFilter:'blur(10px)'}}>
            <h2 style={{margin:'0 0 20px',fontSize:17,fontWeight:700}}>Create Ad</h2>
            <div style={{marginBottom:16}}><label style={lbl}>Event Name *</label><input value={eventName} onChange={e=>setEventName(e.target.value)} placeholder="e.g. soft by LANY — The World Tour" style={inp}/></div>
            <div style={{marginBottom:16}}><label style={lbl}>Subtitle / Details</label><input value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="e.g. Nov 6-14, 2026 • Philippines" style={inp}/></div>
            <div style={{marginBottom:20}}>
              <label style={lbl}>Event Image *</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}}/>
              <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${imgUrl?C.glow:C.border}`,borderRadius:12,padding:imgUrl?0:'28px 16px',textAlign:'center',cursor:'pointer',background:imgUrl?'transparent':C.input,overflow:'hidden'}}>
                {imgUrl?<img src={imgUrl} alt="" style={{width:'100%',maxHeight:200,objectFit:'cover',display:'block',borderRadius:10}}/>
                :<><div style={{fontSize:32,marginBottom:6}}>📷</div><p style={{color:C.muted,fontSize:13,margin:0}}>Click to upload event poster</p></>}
              </div>
              {imgUrl&&<button onClick={()=>{setImgUrl(null);setImgObj(null);if(fileRef.current)fileRef.current.value=''}} style={{marginTop:6,background:'none',border:'none',color:'#ef4444',fontSize:12,cursor:'pointer'}}>Remove</button>}
            </div>
            <button onClick={gen} disabled={busy} style={{width:'100%',padding:'14px 0',borderRadius:12,border:'none',background:`linear-gradient(135deg,${C.purple},${C.glow})`,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:busy?0.6:1,marginBottom:8,boxShadow:`0 4px 20px ${C.glow}33`,fontFamily:"'Outfit',sans-serif"}}>{busy?'Generating...':'✨ Generate Ad Image'}</button>
            {preview&&<button onClick={dl} style={{width:'100%',padding:'12px 0',borderRadius:12,border:`1px solid ${C.glow}`,background:'transparent',color:C.lilac,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",marginBottom:6}}>⬇ Download FB & IG (1080×1350)</button>}
            {previewX&&<button onClick={dlX} style={{width:'100%',padding:'12px 0',borderRadius:12,border:`1px solid ${C.muted}`,background:'transparent',color:C.muted,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>𝕏 Download for X / Twitter</button>}
          </div>
          <div style={{flex:1,minWidth:400,display:'flex',gap:16,flexWrap:'nowrap'}}>
            {/* FB/IG Preview */}
            <div style={{flex:1}}>
              <div style={{background:'rgba(20,0,37,0.75)',border:`1px solid ${C.border}`,borderRadius:16,padding:16,backdropFilter:'blur(10px)',height:'100%'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:14,fontWeight:600}}>FB & IG Preview</span><span style={{fontSize:10,color:C.muted}}>1080×1350</span></div>
                <div style={{borderRadius:10,overflow:'hidden',background:'#050009',aspectRatio:'4/5',display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.border}`}}>
                  {preview?<img src={preview} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                  :<div style={{textAlign:'center',padding:24}}><div style={{fontSize:36,opacity:0.3,marginBottom:6}}>🖼️</div><p style={{color:C.muted,fontSize:13}}>Generate to preview</p></div>}
                </div>
              </div>
            </div>
            {/* X/Twitter Preview */}
            <div style={{flex:1}}>
              <div style={{background:'rgba(20,0,37,0.75)',border:`1px solid ${C.border}`,borderRadius:16,padding:16,backdropFilter:'blur(10px)',height:'100%'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:14,fontWeight:600}}>𝕏 Preview</span><span style={{fontSize:10,color:C.muted}}>No Discord</span></div>
                <div style={{borderRadius:10,overflow:'hidden',background:'#050009',aspectRatio:'4/5',display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.border}`}}>
                  {previewX?<img src={previewX} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                  :<div style={{textAlign:'center',padding:24}}><div style={{fontSize:36,opacity:0.3,marginBottom:6}}>𝕏</div><p style={{color:C.muted,fontSize:13}}>Generate to preview</p></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{display:'none'}}/>
    </div>
  )
}

// ==========================================
// SHARED HEADER WITH TABS
// ==========================================
function AppHeader({page,setPage}){
  const tabStyle=(p)=>({
    padding:'8px 20px',borderRadius:10,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,
    fontFamily:"'Outfit',sans-serif",transition:'all .2s',
    background:page===p?`linear-gradient(135deg,${C.purple},${C.glow})`:'transparent',
    color:page===p?'#fff':C.muted,
    border:page===p?'none':`1px solid ${C.border}`,
  })
  return(
    <div style={{padding:'14px 24px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,background:'rgba(10,0,20,0.7)',backdropFilter:'blur(10px)',position:'relative',zIndex:2}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src={LOGO_URL} alt="" style={{width:40,height:40,borderRadius:10,objectFit:'cover',border:'2px solid rgba(255,255,255,0.25)'}} onError={e=>{e.target.style.display='none'}}/>
          <div><div style={{fontSize:17,fontWeight:700,color:C.text}}>Purveyor Tickets</div><div style={{fontSize:11,color:C.muted}}>Tools</div></div>
        </div>
        <div style={{display:'flex',gap:6,marginLeft:12}}>
          <button onClick={()=>setPage('ad')} style={tabStyle('ad')}>🖼️ Ad Generator</button>
          <button onClick={()=>setPage('webhook')} style={tabStyle('webhook')}>💬 Webhook Editor</button>
        </div>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {SOCIALS.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{color:C.muted,fontSize:11,textDecoration:'none',padding:'5px 8px',borderRadius:7,border:`1px solid ${C.border}`,background:'rgba(30,5,56,0.5)',whiteSpace:'nowrap'}}>{s.icon} {s.label}</a>)}
      </div>
    </div>
  )
}

// ==========================================
// ROOT
// ==========================================
export default function App(){
  const [ok,setOk]=useState(false)
  const [page,setPage]=useState('ad')
  const [fade,setFade]=useState(false)
  const [activePage,setActivePage]=useState('ad')
  useEffect(()=>{if(sessionStorage.getItem('pt_auth')==='1')setOk(true)},[])

  const switchPage=(p)=>{
    if(p===activePage)return
    setFade(true)
    setTimeout(()=>{
      setActivePage(p);setPage(p)
      setTimeout(()=>setFade(false),50)
    },250)
  }

  return(
    <div style={{minHeight:'100vh',background:`radial-gradient(ellipse at 30% 15%, ${C.accent} 0%, ${C.bg} 55%)`,position:'relative',overflow:'hidden'}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800;900&family=Passion+One:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
      <Particles speed={2.5}/>
      {!ok?<PasswordGate onUnlock={()=>setOk(true)}/>:(
        <>
          <AppHeader page={page} setPage={switchPage}/>
          <div style={{opacity:fade?0:1,transform:fade?'translateY(8px)':'translateY(0)',transition:'opacity 0.3s ease, transform 0.3s ease'}}>
            {activePage==='ad'?<AdGeneratorBody/>:<WebhookEditor/>}
          </div>
        </>
      )}
    </div>
  )
}