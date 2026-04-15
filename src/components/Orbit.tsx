"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const RING_COLORS = { inner: "#ff8c00", middle: "#e05000", outer: "#ffcc44" };
const RING_HEX    = { inner: 0xff8c00,  middle: 0xe05000,  outer: 0xffcc44  };

const SERVICES = {
  inner: [
    { name: "Video Editing",   desc: "Post-Production Excellence" },
    { name: "Short Form",      desc: "Viral Content Production"   },
    { name: "Motion Graphics", desc: "Animated Brand Assets"      },
  ],
  middle: [
    { name: "YouTube Growth", desc: "Automation & Systems"    },
    { name: "Social Media",   desc: "Platform Domination"     },
    { name: "Web Design",     desc: "Digital Experiences"     },
    { name: "Logo & Identity",desc: "Visual Identity Systems" },
  ],
  outer: [
    { name: "Brand Strategy",   desc: "Positioning & Narrative" },
    { name: "Content Strategy", desc: "Growth Frameworks"       },
    { name: "Copywriting",      desc: "Words That Convert"      },
    { name: "SEO & Growth",     desc: "Organic Discovery"       },
    { name: "Analytics",        desc: "Data-Driven Decisions"   },
  ],
};

const RING_ORDER = ["inner", "middle", "outer"] as const;
type RingName = typeof RING_ORDER[number];

const SYS_X  = 250;
const RADII  = { inner: 330, middle: 600, outer: 870 };
const SPEEDS = { inner: 22,  middle: 15,  outer: 9   };

const CAM_KF = {
  inner:    { x: SYS_X+465,  y:12, z:0, yaw:90, pitch:-4,  roll:-14 }, // banking left
  middle:   { x: SYS_X+735,  y:14, z:0, yaw:90, pitch:-6,  roll:+16 }, // banking RIGHT
  outer:    { x: SYS_X+990,  y:16, z:0, yaw:90, pitch:-2,  roll:-3  }, // near-level, cinematic
  pushback: { x: SYS_X+1060, y:16, z:0, yaw:90, pitch:-3,  roll:+4  },
};

const lerp = (a:number,b:number,t:number) => a+(b-a)*t;
function shortLerp(a:number,b:number,t:number){ let d=((b-a)%360+360)%360; if(d>180)d-=360; return a+d*t; }
function mkTex(w:number,h:number,fn:(ctx:CanvasRenderingContext2D,w:number,h:number)=>void){ const c=document.createElement("canvas"); c.width=w;c.height=h; fn(c.getContext("2d")!,w,h); return new THREE.CanvasTexture(c); }
function snapDeg(ring:RingName,idx:number){ return -((360/SERVICES[ring].length)*idx); }

/* ── planet texture with atmosphere ── */
function makePlanetTex(col: number) {
  const hex = "#"+col.toString(16).padStart(6,"0");
  return mkTex(256,256,(ctx,W,H)=>{
    // base black
    ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
    // surface radial gradient — off-center highlight for 3D feel
    const g = ctx.createRadialGradient(W*0.36,H*0.32,W*0.01, W*0.5,H*0.5, W*0.52);
    g.addColorStop(0,   hex+"ff");
    g.addColorStop(0.18, hex+"ee");
    g.addColorStop(0.42, hex+"66");
    g.addColorStop(0.70, "#1a0600");
    g.addColorStop(0.90, "#050200");
    g.addColorStop(1,   "#000000");
    ctx.beginPath(); ctx.arc(W/2,H/2,W/2,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
    // subtle surface texture bands
    ctx.globalAlpha=0.08;
    for(let i=0;i<5;i++){
      const y=H*(0.2+i*0.14);
      const bg=ctx.createLinearGradient(0,y-6,0,y+6);
      bg.addColorStop(0,"transparent");bg.addColorStop(0.5,hex);bg.addColorStop(1,"transparent");
      ctx.fillStyle=bg;ctx.fillRect(W*0.1,y-6,W*0.8,12);
    }
    ctx.globalAlpha=1;
  });
}

/* ── glow sprite texture ── */
function makeGlowTex(col:number){
  const hex="#"+col.toString(16).padStart(6,"0");
  return mkTex(256,256,(ctx,W,H)=>{
    const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W/2);
    g.addColorStop(0,  hex+"ff");
    g.addColorStop(0.2,hex+"cc");
    g.addColorStop(0.5,hex+"66");
    g.addColorStop(0.8,hex+"22");
    g.addColorStop(1,  "transparent");
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  });
}

function buildStarField(el:HTMLElement,count:number,color:string,size:number){
  const S=Math.max(window.innerWidth,window.innerHeight)*2.2;
  const shadows=Array.from({length:count},()=>{
    const x=(Math.random()*S).toFixed(1);
    const y=(Math.random()*S).toFixed(1);
    const a=(Math.random()*0.6+0.35).toFixed(2);
    return `${x}px ${y}px 0 rgba(${color},${a})`;
  }).join(",");
  el.style.cssText=`position:absolute;inset:0;width:${size}px;height:${size}px;box-shadow:${shadows};background:transparent;border-radius:50%;`;
}

export default function Orbit({ onExit }: { onExit?: () => void }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLDivElement>(null);
  const descRef    = useRef<HTMLDivElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(s1.current) buildStarField(s1.current, 900,"255,230,200",1);
    if(s2.current) buildStarField(s2.current, 280,"255,240,210",1.5);
    if(s3.current) buildStarField(s3.current, 100,"255,248,230",2);

    const container = mountRef.current!;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.setClearColor(0x000000,0); // transparent so stars show through
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style,{position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"1"});

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65,container.clientWidth/container.clientHeight,0.5,9000);
    camera.rotation.order="YXZ";

    /* lights */
    scene.add(new THREE.AmbientLight(0x0a0805,3));
    const pL=new THREE.PointLight(0xff8c00,6,1800); pL.position.set(SYS_X-180,280,180); scene.add(pL);
    const cL=new THREE.PointLight(0xffcc44,4,1800); cL.position.set(SYS_X+220,-80,160); scene.add(cL);
    const wL=new THREE.PointLight(0xff6600,3,1000); wL.position.set(SYS_X,0,0);         scene.add(wL);

    const sysGrp=new THREE.Group(); sysGrp.position.set(SYS_X,0,0); scene.add(sysGrp);

    /* central glow */
    const glowTex=makeGlowTex(0xff8c00);
    const glowSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    glowSpr.scale.set(300,300,1); sysGrp.add(glowSpr);

    /* core planet — central body */
    const coreTex=makePlanetTex(0xff6600);
    const coreMesh=new THREE.Mesh(
      new THREE.SphereGeometry(55,40,40),
      new THREE.MeshPhongMaterial({map:coreTex,shininess:12,emissive:0x200800,emissiveIntensity:.6})
    );
    sysGrp.add(coreMesh);

    /* core atmosphere */
    sysGrp.add(new THREE.Mesh(
      new THREE.SphereGeometry(68,24,24),
      new THREE.MeshBasicMaterial({color:0xff8c00,transparent:true,opacity:.06,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})
    ));

    /* equatorial ring */
    const eqRing=new THREE.Mesh(
      new THREE.TorusGeometry(62,1.8,8,80),
      new THREE.MeshBasicMaterial({color:0xff8c00,transparent:true,opacity:.7})
    );
    eqRing.rotation.x=Math.PI/2; sysGrp.add(eqRing);

    /* ── orbit tracks — thin + layered glow ── */
    RING_ORDER.forEach(name=>{
      const r=RADII[name]; const col=RING_HEX[name];
      // outer soft glow
      const glow1=new THREE.Mesh(new THREE.TorusGeometry(r,5,8,150),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.04,blending:THREE.AdditiveBlending,depthWrite:false}));
      glow1.rotation.x=Math.PI/2; sysGrp.add(glow1);
      // mid glow
      const glow2=new THREE.Mesh(new THREE.TorusGeometry(r,1.8,8,150),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false}));
      glow2.rotation.x=Math.PI/2; sysGrp.add(glow2);
      // sharp thin line
      const line=new THREE.Mesh(new THREE.TorusGeometry(r,.28,8,150),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85}));
      line.rotation.x=Math.PI/2; sysGrp.add(line);
    });

    /* ── service orbs — planet style ── */
    const orbitGrps: Record<string,THREE.Group>={};
    const orbList:   Record<string,THREE.Mesh[]>={};

    RING_ORDER.forEach(ringName=>{
      const col=RING_HEX[ringName];
      const grp=new THREE.Group(); sysGrp.add(grp); orbitGrps[ringName]=grp; orbList[ringName]=[];

      const ptex=makePlanetTex(col);
      const gtex=makeGlowTex(col);

      SERVICES[ringName].forEach((_svc,i)=>{
        const N=SERVICES[ringName].length;
        const ang=THREE.MathUtils.degToRad((360/N)*i);
        const r=RADII[ringName];

        // planet sphere
        const orb=new THREE.Mesh(
          new THREE.SphereGeometry(18,32,32),
          new THREE.MeshPhongMaterial({map:ptex,shininess:20,emissive:new THREE.Color(col).multiplyScalar(0.3),emissiveIntensity:1.2})
        );
        orb.position.set(r*Math.cos(ang),0,r*Math.sin(ang));

        // tight atmosphere shell
        orb.add(new THREE.Mesh(
          new THREE.SphereGeometry(21,16,16),
          new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})
        ));
        // wide atmosphere haze
        orb.add(new THREE.Mesh(
          new THREE.SphereGeometry(28,16,16),
          new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.06,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})
        ));
        // inner glow sprite
        const gs1=new THREE.Sprite(new THREE.SpriteMaterial({map:gtex,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));
        gs1.scale.set(70,70,1); orb.add(gs1);
        // outer wide glow
        const gs2=new THREE.Sprite(new THREE.SpriteMaterial({map:gtex,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));
        gs2.scale.set(130,130,1); orb.add(gs2);

        // no 3D labels — service names shown in HUD only (avoids mismatch confusion)
        grp.add(orb); orbList[ringName].push(orb);
      });
    });

    /* stars (Three.js for depth) */
    {const N=2000,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*9000;pos[i*3+1]=(Math.random()-.5)*9000;pos[i*3+2]=(Math.random()-.5)*9000;}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffe8c0,size:1.2,transparent:true,opacity:.3})));}

    /* dust */
    {const N=300,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const rad=100+Math.random()*520,th=Math.random()*Math.PI*2,ph=(Math.random()-.5)*.6;pos[i*3]=rad*Math.cos(th)*Math.cos(ph);pos[i*3+1]=rad*Math.sin(ph)*75;pos[i*3+2]=rad*Math.sin(th)*Math.cos(ph);}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));sysGrp.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xff8c00,size:.7,transparent:true,opacity:.18})));}

    /* state */
    const ringRot:Record<string,number>={inner:0,middle:0,outer:0};
    const ringPaused:Record<string,boolean>={inner:false,middle:false,outer:false};
    const snapTarget:Record<string,number|null>={inner:null,middle:null,outer:null};
    const CUR={...CAM_KF.inner}; const TGT={...CAM_KF.inner};
    // spring velocities for cinematic camera
    const VEL={x:0,y:0,z:0,yaw:0,pitch:0,roll:0};
    const SPRING=0.010, DAMP=0.86;
    let curRing:RingName="inner"; let curIdx=0;
    let transTimer:ReturnType<typeof setTimeout>|null=null;

    function updateUI(){
      const svc=SERVICES[curRing][curIdx];
      const c=RING_COLORS[curRing];
      const lab=curRing.charAt(0).toUpperCase()+curRing.slice(1);
      if(nameRef.current){nameRef.current.textContent=svc.name;nameRef.current.style.color=c;}
      if(descRef.current) descRef.current.textContent=svc.desc;
      if(ringRef.current){ringRef.current.textContent=lab+" Ring";ringRef.current.style.color=c+"bb";}
      if(counterRef.current) counterRef.current.textContent=`${(curIdx+1).toString().padStart(2,"0")} / ${SERVICES[curRing].length.toString().padStart(2,"0")}`;
      if(panelRef.current) panelRef.current.style.setProperty("--ac",c);
    }

    const starRotOffset = { inner: 0, middle: 15, outer: 30 };
    function goTo(ring:RingName,idx:number){
      curRing=ring;curIdx=idx;
      RING_ORDER.forEach(r=>{ringPaused[r]=(r===ring);if(r!==ring)snapTarget[r]=null;});
      snapTarget[ring]=snapDeg(ring,idx);
      Object.assign(TGT,CAM_KF[ring]);
      updateUI();
      // nudge orbit stars rotation when moving between rings
      const el = document.getElementById("orbit-stars");
      if(el) gsap.to(el, { rotation: starRotOffset[ring], duration: 2.5, ease: "power2.out" });
    }

    function applyBridge(ringName:RingName){
      if(transTimer)clearTimeout(transTimer);
      const k=CAM_KF[ringName];
      // cinematic arc: fly high, look down, level roll — feels like a drone swoop
      TGT.x=k.x-120; TGT.y=220; TGT.z=0;
      TGT.yaw=k.yaw; TGT.pitch=-22; TGT.roll=0;
      transTimer=setTimeout(()=>Object.assign(TGT,k),900);
    }

    function next(){
      const N=SERVICES[curRing].length;
      if(curIdx+1<N){goTo(curRing,curIdx+1);}
      else{
        const ri=RING_ORDER.indexOf(curRing);
        if(ri<RING_ORDER.length-1){ringPaused[curRing]=false;snapTarget[curRing]=null;const nr=RING_ORDER[ri+1];applyBridge(nr);setTimeout(()=>goTo(nr,0),320);}
        else{Object.assign(TGT,CAM_KF.pushback);setTimeout(()=>Object.assign(TGT,CAM_KF.outer),720);}
      }
    }
    function prev(){
      if(curIdx>0){goTo(curRing,curIdx-1);}
      else{
        const ri=RING_ORDER.indexOf(curRing);
        if(ri>0){ringPaused[curRing]=false;snapTarget[curRing]=null;const pr=RING_ORDER[ri-1];applyBridge(pr);setTimeout(()=>goTo(pr,SERVICES[pr].length-1),320);}
      }
    }

    const onKey=(e:KeyboardEvent)=>{if(e.key==="ArrowRight"||e.key==="ArrowDown")next();if(e.key==="ArrowLeft"||e.key==="ArrowUp")prev();};
    window.addEventListener("keydown",onKey);
    const nb=document.getElementById("o-next"); const pb=document.getElementById("o-prev");
    nb?.addEventListener("click",next); pb?.addEventListener("click",prev);

    /* loop */
    let rafId=0; const clock=new THREE.Clock();
    function tick(){
      rafId=requestAnimationFrame(tick);
      const dt=clock.getDelta(),t=clock.getElapsedTime();

      RING_ORDER.forEach(name=>{
        if(!ringPaused[name])ringRot[name]+=SPEEDS[name]*dt;
        else if(snapTarget[name]!==null)ringRot[name]=shortLerp(ringRot[name],snapTarget[name]!,0.07);
        orbitGrps[name].rotation.y=THREE.MathUtils.degToRad(ringRot[name]);
      });

      // spring physics — cinematic ease-in/out with slight overshoot
      VEL.x+=(TGT.x-CUR.x)*SPRING; VEL.x*=DAMP; CUR.x+=VEL.x;
      VEL.y+=(TGT.y-CUR.y)*SPRING; VEL.y*=DAMP; CUR.y+=VEL.y;
      VEL.z+=(TGT.z-CUR.z)*SPRING; VEL.z*=DAMP; CUR.z+=VEL.z;
      let dy=((TGT.yaw-CUR.yaw)%360+360)%360; if(dy>180)dy-=360;
      VEL.yaw+=dy*SPRING; VEL.yaw*=DAMP; CUR.yaw+=VEL.yaw;
      VEL.pitch+=(TGT.pitch-CUR.pitch)*SPRING; VEL.pitch*=DAMP; CUR.pitch+=VEL.pitch;
      VEL.roll+=(TGT.roll-CUR.roll)*SPRING;  VEL.roll*=DAMP;  CUR.roll+=VEL.roll;
      // idle drift — handheld feel, makes it feel alive
      const drift=0.28;
      camera.position.set(CUR.x+Math.sin(t*0.28)*drift, CUR.y+Math.sin(t*0.41)*drift*0.6, CUR.z+Math.cos(t*0.19)*drift*0.4);
      camera.rotation.y=THREE.MathUtils.degToRad(CUR.yaw+Math.sin(t*0.22)*0.08);
      camera.rotation.x=THREE.MathUtils.degToRad(CUR.pitch+Math.sin(t*0.37)*0.06);
      camera.rotation.z=THREE.MathUtils.degToRad(CUR.roll+Math.sin(t*0.31)*0.05);

      RING_ORDER.forEach((rn,ri)=>{
        orbList[rn].forEach((orb,i)=>{
          const sel=rn===curRing&&i===curIdx;
          // selected orb pulses brighter, others subtle breathe
          const pulse=sel
            ? 1+.08*Math.sin(t*2.2+i*1.4)
            : 1+.03*Math.sin(t*1.4+i*1.4+ri*.9);
          orb.scale.setScalar(pulse);
        });
      });

      coreMesh.rotation.y=t*.12;
      eqRing.rotation.z=t*.4;
      glowSpr.material.opacity=.6+.2*Math.sin(t*.75);
      pL.intensity=5+3*Math.sin(t*.52); cL.intensity=3.5+2*Math.sin(t*.78+1.1); wL.intensity=2+1.5*Math.sin(t*1+.5);

      renderer.render(scene,camera);
    }

    const onResize=()=>{renderer.setSize(container.clientWidth,container.clientHeight);camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();};
    window.addEventListener("resize",onResize);

    goTo("inner",0); tick();

    return ()=>{
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown",onKey);
      window.removeEventListener("resize",onResize);
      nb?.removeEventListener("click",next); pb?.removeEventListener("click",prev);
      if(transTimer)clearTimeout(transTimer);
      renderer.dispose();
      if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{position:"relative",width:"100vw",height:"100vh",background:"transparent",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600;700&display=swap');

        /* GSAP nudges the wrapper — CSS spin lives on inner */
        #orbit-stars-wrap {
          position:absolute;inset:0;z-index:0;pointer-events:none;
          transform-origin:center center;
        }
        #orbit-stars {
          position:absolute;top:50%;left:50%;
          width:220vmax;height:220vmax;
          margin-left:-110vmax;margin-top:-110vmax;
          transform-origin:center;
          animation:oStarRotate 120s linear infinite;
          pointer-events:none;
        }
        @keyframes oStarRotate { to { transform:rotate(-360deg); } }
        .os { position:absolute;inset:0; }
        .os:nth-child(1) { animation:osTwinkle 3.5s ease-in-out infinite alternate; }
        .os:nth-child(2) { animation:osTwinkle 4.8s ease-in-out infinite alternate-reverse; }
        .os:nth-child(3) { animation:osTwinkle 2.9s ease-in-out infinite alternate; }
        @keyframes osTwinkle { from{filter:brightness(1);} to{filter:brightness(0.5);} }

        /* ── HUD panel ── */
        #orbit-hud {
          --ac: #ff8c00;
          position:absolute;
          bottom:0;left:0;right:0;
          z-index:20;
          padding:0 5vw 2rem;
          background:linear-gradient(to top, rgba(2,1,8,.96) 0%, rgba(2,1,8,.85) 60%, transparent 100%);
        }
        .hud-divider {
          width:100%;height:1px;
          background:linear-gradient(90deg,transparent,var(--ac,#ff8c00) 30%,var(--ac,#ff8c00) 70%,transparent);
          margin-bottom:1.2rem;opacity:.55;
        }
        .hud-meta {
          display:flex;justify-content:space-between;align-items:baseline;
          margin-bottom:.4rem;
        }
        .hud-ring {
          font-family:'Rajdhani',sans-serif;font-size:.68rem;font-weight:700;
          letter-spacing:.5em;text-transform:uppercase;
          color:#ff8c00;transition:color .3s;
        }
        .hud-counter {
          font-family:'Orbitron',monospace;font-size:.72rem;font-weight:700;
          color:rgba(255,200,120,.35);letter-spacing:.2em;
        }
        .hud-name {
          font-family:'Orbitron',monospace;
          font-size:clamp(2rem,5vw,4.5rem);font-weight:900;
          letter-spacing:-.02em;line-height:.95;
          color:#ff8c00;
          transition:color .3s;
          margin-bottom:.5rem;
        }
        .hud-desc {
          font-family:'Rajdhani',sans-serif;
          font-size:.88rem;font-weight:400;letter-spacing:.18em;
          color:rgba(255,200,120,.35);text-transform:uppercase;
          margin-bottom:1.4rem;
        }
        .hud-controls {
          display:flex;align-items:center;gap:.75rem;
        }
        .hbtn {
          background:transparent;
          border:1px solid rgba(255,140,0,.2);
          color:rgba(255,180,80,.6);
          font-family:'Rajdhani',sans-serif;font-size:.75rem;font-weight:700;
          letter-spacing:.22em;text-transform:uppercase;
          padding:.5rem 1.6rem;cursor:pointer;
          transition:border-color .2s,color .2s;
        }
        .hbtn:hover { border-color:#ff8c00;color:#ff8c00; }
        #o-exit {
          margin-left:auto;
          border-color:rgba(200,60,0,.2);
          color:rgba(220,80,0,.5);
        }
        #o-exit:hover { border-color:#e05000;color:#e05000; }
      `}</style>

      {/* Star field — matches hero stars exactly */}
      <div id="orbit-stars">
        <div className="os" ref={s1} />
        <div className="os" ref={s2} />
        <div className="os" ref={s3} />
      </div>

      {/* Three.js mount */}
      <div ref={mountRef} style={{position:"absolute",inset:0,zIndex:1}} />

      {/* HUD */}
      <div id="orbit-hud" ref={panelRef}>
        <div className="hud-divider" />
        <div className="hud-meta">
          <span className="hud-ring"  ref={ringRef}>Inner Ring</span>
          <span className="hud-counter" ref={counterRef}>01 / 03</span>
        </div>
        <div className="hud-name" ref={nameRef}>Video Editing</div>
        <div className="hud-desc" ref={descRef}>Post-Production Excellence</div>
        <div className="hud-controls">
          <button type="button" id="o-prev" className="hbtn">← Prev</button>
          <button type="button" id="o-next" className="hbtn">Next →</button>
          <button type="button" id="o-exit" className="hbtn" onClick={onExit}>✕ Exit</button>
        </div>
      </div>
    </div>
  );
}
