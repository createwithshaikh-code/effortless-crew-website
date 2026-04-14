"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ── colour theme ── amber / orange / gold ── */
const RING_COLORS = { inner: "#ff8c00", middle: "#e65c00", outer: "#ffcc44" };
const RING_HEX    = { inner: 0xff8c00,  middle: 0xe65c00,  outer: 0xffcc44  };

const SERVICES = {
  inner: [
    { name: "Video Editing",   desc: "Post-Production Excellence" },
    { name: "Short Form",      desc: "Viral Content Production"   },
    { name: "Motion Graphics", desc: "Animated Brand Assets"      },
  ],
  middle: [
    { name: "YouTube Growth", desc: "Automation & Systems"      },
    { name: "Social Media",   desc: "Platform Domination"       },
    { name: "Web Design",     desc: "Digital Experiences"       },
    { name: "Logo & Identity",desc: "Visual Identity Systems"   },
  ],
  outer: [
    { name: "Brand Strategy",   desc: "Positioning & Narrative"   },
    { name: "Content Strategy", desc: "Growth Frameworks"         },
    { name: "Copywriting",      desc: "Words That Convert"        },
    { name: "SEO & Growth",     desc: "Organic Discovery"         },
    { name: "Analytics",        desc: "Data-Driven Decisions"     },
  ],
};

const RING_ORDER = ["inner", "middle", "outer"] as const;
type RingName = typeof RING_ORDER[number];

const SYS_X = 250;
const RADII  = { inner: 330, middle: 600, outer: 870 };
const SPEEDS = { inner: 22,  middle: 15,  outer: 9   };

/* camera keyframes – cinematic side view, no top-down */
const CAM_KF = {
  inner:    { x: SYS_X + 465,  y: 12, z: 0, yaw: 90, pitch: -4,  roll: -12 },
  middle:   { x: SYS_X + 735,  y: 14, z: 0, yaw: 90, pitch: -5,  roll: -14 },
  outer:    { x: SYS_X + 990,  y: 16, z: 0, yaw: 90, pitch: -6,  roll: -16 },
  pushback: { x: SYS_X + 1060, y: 16, z: 0, yaw: 90, pitch: -6,  roll: -18 },
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function shortLerp(a: number, b: number, t: number) {
  let d = ((b - a) % 360 + 360) % 360;
  if (d > 180) d -= 360;
  return a + d * t;
}
function mkTex(w: number, h: number, fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  fn(c.getContext("2d")!, w, h);
  return new THREE.CanvasTexture(c);
}
function snapDeg(ring: RingName, idx: number) {
  return -((360 / SERVICES[ring].length) * idx);
}

export default function Orbit({ onExit }: { onExit?: () => void }) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLDivElement>(null);
  const ringLblRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x030310, 1);
    container.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030310, 0.00025);

    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.5, 9000);
    camera.rotation.order = "YXZ";

    /* lights */
    scene.add(new THREE.AmbientLight(0x0a0805, 3));
    const pL = new THREE.PointLight(0xff8c00, 5, 1600); pL.position.set(SYS_X - 180,  280, 180); scene.add(pL);
    const cL = new THREE.PointLight(0xffcc44, 4, 1600); cL.position.set(SYS_X + 220, -80,  160); scene.add(cL);
    const wL = new THREE.PointLight(0xff6600, 3,  900); wL.position.set(SYS_X, 0, 0);             scene.add(wL);

    /* system group */
    const sysGrp = new THREE.Group();
    sysGrp.position.set(SYS_X, 0, 0);
    scene.add(sysGrp);

    /* central glow */
    const glowTex = mkTex(256, 256, (ctx, W, H) => {
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/2);
      g.addColorStop(0,   "rgba(255,140,0,.40)");
      g.addColorStop(.3,  "rgba(200,80,0,.18)");
      g.addColorStop(.65, "rgba(140,50,0,.07)");
      g.addColorStop(1,   "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glowSprite.scale.set(330, 330, 1);
    sysGrp.add(glowSprite);

    /* core sphere */
    const atmTex = mkTex(512, 256, (ctx, W, H) => {
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.6);
      bg.addColorStop(0, "#1a0800"); bg.addColorStop(1, "#030310");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      [
        { cx:.1, cy:.3, rx:.12, ry:.14, c:"rgba(255,140,0,.28)" },
        { cx:.3, cy:.2, rx:.14, ry:.08, c:"rgba(255,200,50,.22)" },
        { cx:.5, cy:.6, rx:.1,  ry:.12, c:"rgba(200,80,0,.20)"  },
        { cx:.7, cy:.3, rx:.12, ry:.08, c:"rgba(255,180,0,.24)" },
        { cx:.85,cy:.7, rx:.1,  ry:.12, c:"rgba(255,100,0,.18)" },
      ].forEach(b => {
        ctx.save(); ctx.translate(b.cx*W, b.cy*H); ctx.scale(b.rx*W, b.ry*H);
        const g = ctx.createRadialGradient(0,0,0,0,0,1);
        g.addColorStop(0, b.c); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0,0,1,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
    });
    const atmMesh = new THREE.Mesh(
      new THREE.SphereGeometry(55, 36, 36),
      new THREE.MeshPhongMaterial({ map: atmTex, transparent: true, opacity: .4, shininess: 8, emissive: 0x200800, emissiveIntensity: .9, depthWrite: false })
    );
    sysGrp.add(atmMesh);

    sysGrp.add(new THREE.Mesh(
      new THREE.SphereGeometry(66, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: .04, side: THREE.BackSide })
    ));

    /* equatorial ring */
    const eqRing = new THREE.Mesh(
      new THREE.TorusGeometry(62, 2.5, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xff8c00, transparent: true, opacity: .65 })
    );
    eqRing.rotation.x = Math.PI / 2;
    sysGrp.add(eqRing);

    /* EC label sprite */
    const ecTex = mkTex(256, 256, (ctx, W) => {
      const r = W/2;
      ctx.fillStyle = "#0d0500";
      ctx.beginPath(); ctx.arc(r, r, r-2, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#ff8c00"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(r, r, r-4, 0, Math.PI*2); ctx.stroke();
      ctx.font = "bold 96px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "#ff8c00"; ctx.shadowBlur = 24;
      ctx.fillStyle = "#fff"; ctx.fillText("EC", r, r+4);
    });
    const ecSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ecTex, transparent: true, depthWrite: false }));
    ecSprite.scale.set(108, 108, 1);
    sysGrp.add(ecSprite);

    /* orbit tracks + orbs */
    const orbitGrps: Record<string, THREE.Group> = {};
    const orbList:   Record<string, THREE.Mesh[]> = {};

    RING_ORDER.forEach(ringName => {
      const col  = new THREE.Color(RING_HEX[ringName]);
      const r    = RADII[ringName];

      /* tracks */
      const wMesh = new THREE.Mesh(new THREE.TorusGeometry(r, 1, 8, 150), new THREE.MeshBasicMaterial({ color: RING_HEX[ringName], transparent: true, opacity: .12 }));
      const tMesh = new THREE.Mesh(new THREE.TorusGeometry(r, .25, 8, 150), new THREE.MeshBasicMaterial({ color: RING_HEX[ringName], transparent: true, opacity: .45 }));
      wMesh.rotation.x = tMesh.rotation.x = Math.PI / 2;
      sysGrp.add(wMesh); sysGrp.add(tMesh);

      /* orb group */
      const grp = new THREE.Group();
      sysGrp.add(grp);
      orbitGrps[ringName] = grp;
      orbList[ringName] = [];

      SERVICES[ringName].forEach((svc, i) => {
        const N   = SERVICES[ringName].length;
        const ang = THREE.MathUtils.degToRad((360 / N) * i);
        const px  = r * Math.cos(ang);
        const pz  = r * Math.sin(ang);

        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(22, 22, 22),
          new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(0.18) })
        );
        orb.position.set(px, 0, pz);

        [[26,.55],[42,.16],[65,.055]].forEach(([rad, op]) => {
          orb.add(new THREE.Mesh(
            new THREE.SphereGeometry(rad, 14, 14),
            new THREE.MeshBasicMaterial({ color: col.clone(), transparent: true, opacity: op, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
          ));
        });

        const lTex = mkTex(320, 72, (ctx, W, H) => {
          ctx.font = "bold 22px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.shadowColor = RING_COLORS[ringName]; ctx.shadowBlur = 16;
          ctx.fillStyle = "rgba(255,255,255,.95)";
          ctx.fillText(svc.name, W/2, H/2);
        });
        const lbl = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTex, transparent: true, opacity: 1, depthWrite: false }));
        lbl.scale.set(120, 28, 1);
        lbl.position.y = 34;
        lbl.name = "label";
        orb.add(lbl);

        grp.add(orb);
        orbList[ringName].push(orb);
      });
    });

    /* stars */
    {
      const N = 2400, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        pos[i*3]   = (Math.random()-.5)*9000;
        pos[i*3+1] = (Math.random()-.5)*9000;
        pos[i*3+2] = (Math.random()-.5)*9000;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe8c0, size: 1.2, transparent: true, opacity: .35 })));
    }

    /* dust */
    {
      const N = 350, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const rad = 100 + Math.random() * 520;
        const th  = Math.random() * Math.PI * 2;
        const ph  = (Math.random()-.5)*.6;
        pos[i*3]   = rad * Math.cos(th) * Math.cos(ph);
        pos[i*3+1] = rad * Math.sin(ph) * 75;
        pos[i*3+2] = rad * Math.sin(th) * Math.cos(ph);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      sysGrp.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xff8c00, size: .8, transparent: true, opacity: .22 })));
    }

    /* ── state ── */
    const ringRot    = { inner: 0, middle: 0, outer: 0 };
    const ringPaused = { inner: false, middle: false, outer: false };
    const snapTarget: Record<string, number | null> = { inner: null, middle: null, outer: null };

    const CAM_L  = 0.022;
    const SNAP_L = 0.07;
    const CUR = { ...CAM_KF.inner };
    const TGT = { ...CAM_KF.inner };

    let curRing: RingName = "inner";
    let curIdx = 0;
    let transTimer: ReturnType<typeof setTimeout> | null = null;

    function applyCam(name: keyof typeof CAM_KF) {
      const k = CAM_KF[name];
      Object.assign(TGT, k);
    }

    function updateUI() {
      const svc = SERVICES[curRing][curIdx];
      const c   = RING_COLORS[curRing];
      const lab = curRing.charAt(0).toUpperCase() + curRing.slice(1);
      if (nameRef.current)    { nameRef.current.textContent = svc.name; nameRef.current.style.color = c; nameRef.current.style.textShadow = `0 0 30px ${c},0 0 60px ${c}44`; }
      if (descRef.current)    descRef.current.textContent = svc.desc;
      if (ringLblRef.current) ringLblRef.current.textContent = `${lab} Ring · ${curIdx + 1} / ${SERVICES[curRing].length}`;
      if (panelRef.current)   { panelRef.current.style.borderColor = c + "44"; panelRef.current.style.boxShadow = `0 0 50px ${c}14,0 8px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.04)`; }
    }

    function goTo(ring: RingName, idx: number) {
      curRing = ring; curIdx = idx;
      RING_ORDER.forEach(r => {
        ringPaused[r] = (r === ring);
        if (r !== ring) snapTarget[r] = null;
      });
      snapTarget[ring] = snapDeg(ring, idx);
      applyCam(ring);
      updateUI();
    }

    function applyRingTransition(ringName: RingName) {
      if (transTimer) clearTimeout(transTimer);
      const k = CAM_KF[ringName];
      TGT.x = k.x + 10; TGT.y = k.y + 55; TGT.z = k.z;
      TGT.yaw = k.yaw; TGT.pitch = k.pitch - 8; TGT.roll = k.roll * 2;
      transTimer = setTimeout(() => applyCam(ringName), 680);
    }

    function nextService() {
      const N = SERVICES[curRing].length;
      if (curIdx + 1 < N) {
        goTo(curRing, curIdx + 1);
      } else {
        const ri = RING_ORDER.indexOf(curRing);
        if (ri < RING_ORDER.length - 1) {
          ringPaused[curRing] = false; snapTarget[curRing] = null;
          const nr = RING_ORDER[ri + 1];
          applyRingTransition(nr);
          setTimeout(() => goTo(nr, 0), 320);
        } else {
          applyCam("pushback");
          setTimeout(() => applyCam("outer"), 720);
        }
      }
    }

    function prevService() {
      if (curIdx > 0) {
        goTo(curRing, curIdx - 1);
      } else {
        const ri = RING_ORDER.indexOf(curRing);
        if (ri > 0) {
          ringPaused[curRing] = false; snapTarget[curRing] = null;
          const pr = RING_ORDER[ri - 1];
          applyRingTransition(pr);
          setTimeout(() => goTo(pr, SERVICES[pr].length - 1), 320);
        }
      }
    }

    /* keyboard */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextService();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prevService();
    };
    window.addEventListener("keydown", onKey);

    /* button wiring */
    const nextBtn = document.getElementById("orbit-next");
    const prevBtn = document.getElementById("orbit-prev");
    nextBtn?.addEventListener("click", nextService);
    prevBtn?.addEventListener("click", prevService);

    /* ── animation loop ── */
    let rafId = 0;
    const clock = new THREE.Clock();

    function tick() {
      rafId = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      const t  = clock.getElapsedTime();

      RING_ORDER.forEach(name => {
        if (!ringPaused[name]) {
          ringRot[name] += SPEEDS[name] * dt;
        } else if (snapTarget[name] !== null) {
          ringRot[name] = shortLerp(ringRot[name], snapTarget[name]!, SNAP_L);
        }
        orbitGrps[name].rotation.y = THREE.MathUtils.degToRad(ringRot[name]);
      });

      CUR.x     = lerp(CUR.x,     TGT.x,     CAM_L);
      CUR.y     = lerp(CUR.y,     TGT.y,     CAM_L);
      CUR.z     = lerp(CUR.z,     TGT.z,     CAM_L);
      CUR.yaw   = shortLerp(CUR.yaw,   TGT.yaw,   CAM_L);
      CUR.pitch = shortLerp(CUR.pitch, TGT.pitch, CAM_L);
      CUR.roll  = shortLerp(CUR.roll,  TGT.roll,  CAM_L);
      camera.position.set(CUR.x, CUR.y, CUR.z);
      camera.rotation.y = THREE.MathUtils.degToRad(CUR.yaw);
      camera.rotation.x = THREE.MathUtils.degToRad(CUR.pitch);
      camera.rotation.z = THREE.MathUtils.degToRad(CUR.roll);

      RING_ORDER.forEach((rn, ri) => {
        orbList[rn].forEach((orb, i) => {
          orb.scale.setScalar(1 + .04 * Math.sin(t * 1.7 + i * 1.4 + ri * .9));
          const selected = rn === curRing && i === curIdx;
          orb.children.forEach(ch => {
            const sprite = ch as THREE.Sprite;
            if (ch.name === "label" && sprite.material) {
              sprite.material.opacity = lerp(sprite.material.opacity, selected ? 0 : 1, 0.09);
            }
          });
        });
      });

      atmMesh.rotation.y   = t * .15;
      eqRing.rotation.z    = t * .46;
      glowSprite.material.opacity = .65 + .18 * Math.sin(t * .75);
      pL.intensity = 4.5 + 2.8 * Math.sin(t * .52);
      cL.intensity = 4.0 + 2.2 * Math.sin(t * .78 + 1.1);
      wL.intensity = 2.2 + 1.5 * Math.sin(t * 1.0 + .5);

      renderer.render(scene, camera);
    }

    /* resize */
    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* start */
    goTo("inner", 0);
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      nextBtn?.removeEventListener("click", nextService);
      prevBtn?.removeEventListener("click", prevService);
      if (transTimer) clearTimeout(transTimer);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#030310", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Rajdhani:wght@400;600;700&display=swap');

        #orbit-panel {
          position: absolute;
          bottom: 6rem; left: 50%;
          transform: translateX(-50%);
          text-align: center;
          background: linear-gradient(145deg, rgba(8,4,0,.96), rgba(18,8,0,.92));
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,140,0,.25);
          border-radius: 10px;
          padding: 1.3rem 3.5rem 1.6rem;
          min-width: 340px;
          z-index: 15;
          transition: border-color .3s, box-shadow .3s;
        }
        .op-ring {
          font-family: 'Rajdhani', sans-serif;
          font-size: .62rem; letter-spacing: .42em;
          color: rgba(255,200,120,.4);
          text-transform: uppercase;
          margin-bottom: .6rem;
        }
        .op-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -.02em; line-height: 1;
          color: #ff8c00;
          margin-bottom: .3rem;
          transition: color .3s, text-shadow .3s;
        }
        .op-desc {
          font-family: 'Rajdhani', sans-serif;
          font-size: .82rem; color: rgba(255,200,120,.4);
          letter-spacing: .14em; margin-bottom: 1.1rem;
        }

        #orbit-controls {
          position: absolute;
          bottom: 2rem; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: .65rem;
          z-index: 20;
        }
        .orbit-btn {
          background: rgba(8,4,0,.92);
          border: 1px solid rgba(255,140,0,.2);
          color: rgba(255,200,120,.7);
          font-family: 'Rajdhani', sans-serif;
          font-size: .75rem; font-weight: 700;
          letter-spacing: .22em; text-transform: uppercase;
          padding: .55rem 1.6rem;
          cursor: pointer;
          backdrop-filter: blur(16px);
          transition: border-color .2s, color .2s;
        }
        .orbit-btn:hover { border-color: #ff8c00; color: #ff8c00; }
        #orbit-exit {
          border-color: rgba(255,80,0,.2);
          color: rgba(255,120,60,.5);
        }
        #orbit-exit:hover { border-color: #e65c00; color: #e65c00; }
      `}</style>

      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* Service panel */}
      <div id="orbit-panel" ref={panelRef}>
        <div className="op-ring" ref={ringLblRef}>Inner Ring · 1 / 3</div>
        <div className="op-name" ref={nameRef}>Video Editing</div>
        <div className="op-desc" ref={descRef}>Post-Production Excellence</div>
      </div>

      {/* Controls */}
      <div id="orbit-controls">
        <button type="button" id="orbit-prev" className="orbit-btn">← Prev</button>
        <button type="button" id="orbit-next" className="orbit-btn">Next →</button>
        <button type="button" id="orbit-exit" className="orbit-btn" onClick={onExit}>✕ Exit</button>
      </div>
    </div>
  );
}
