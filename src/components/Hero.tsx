"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function buildStarField(el: HTMLElement, count: number, color: string, size: number) {
  const S = Math.max(window.innerWidth, window.innerHeight) * 2.2;
  const shadows = Array.from({ length: count }, () => {
    const x = (Math.random() * S).toFixed(1);
    const y = (Math.random() * S).toFixed(1);
    const a = (Math.random() * 0.6 + 0.35).toFixed(2);
    return `${x}px ${y}px 0 rgba(${color},${a})`;
  }).join(",");
  el.style.cssText = `position:absolute;inset:0;width:${size}px;height:${size}px;box-shadow:${shadows};background:transparent;border-radius:50%;`;
}

const CHARS = ["E","F","F","O","R","T","L","E","S","S"];

export default function Hero({ onEnterOrbit }: { onEnterOrbit?: () => void }) {
  const starsSmall = useRef<HTMLDivElement>(null);
  const starsMid   = useRef<HTMLDivElement>(null);
  const starsLarge = useRef<HTMLDivElement>(null);
  const globeRef   = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (starsSmall.current) buildStarField(starsSmall.current, 900, "255,230,200", 1);
    if (starsMid.current)   buildStarField(starsMid.current,   280, "255,240,210", 1.5);
    if (starsLarge.current) buildStarField(starsLarge.current, 100, "255,248,230", 2);

    [starsSmall, starsMid, starsLarge].forEach(r => {
      if (!r.current) return;
      gsap.to(r.current, { filter: "brightness(0.55)", duration: 2.5 + Math.random()*2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random()*2 });
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // planet rises
    tl.from(horizonRef.current, { y: "-60vh", duration: 1.5 }, 0);
    tl.from(globeRef.current,   { opacity: 0, scale: 0.9, duration: 1.2 }, 0.2);
    tl.from([starsSmall.current, starsMid.current, starsLarge.current], { opacity: 0, duration: 1, stagger: 0.1 }, 0.2);

    // eyebrow
    tl.from(".logo-eyebrow", { opacity: 0, y: 10, duration: 0.6 }, 0.9);

    // EFFORTLESS char by char
    tl.from(".ec-char", { opacity: 0, duration: 0.3, stagger: 0.055 }, 1.1);

    // CREW — appears all at once with bright flash glow
    tl.set("#txt-crew", { opacity: 1 }, 1.75);
    tl.fromTo("#txt-crew",
      { filter: "brightness(5) drop-shadow(0 0 50px rgba(255,200,80,1)) drop-shadow(0 0 100px rgba(255,140,0,1))" },
      { filter: "brightness(1) drop-shadow(0 0 14px rgba(255,140,0,0.5))", duration: 0.7, ease: "power2.out" },
      1.75
    );

    // tagline + button
    tl.from(".game-tagline", { opacity: 0, y: 8, duration: 0.5 }, 2.1);
    tl.from("#enter-orbit-btn", { opacity: 0, y: 8, duration: 0.5 }, 2.3);

    // scroll down triggers orbit
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) onEnterOrbit?.(); };
    window.addEventListener("wheel", onWheel, { once: true });

    return () => {
      tl.kill();
      window.removeEventListener("wheel", onWheel);
    };
  }, [onEnterOrbit]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@300;600;700&display=swap');

        #hero { position:relative;width:100%;height:100vh;overflow:hidden;background:#000;isolation:isolate; }

        #layer-stars {
          position:absolute;top:50%;left:50%;
          width:220vmax;height:220vmax;
          margin-left:-110vmax;margin-top:-110vmax;
          z-index:1;transform-origin:center;
          animation:starRotate 120s linear infinite;
          clip-path:ellipse(50% 38% at 50% 30%);
        }
        @keyframes starRotate { to { transform:rotate(-360deg); } }
        #stars-small,#stars-mid,#stars-large { position:absolute;inset:0; }

        #globe {
          position:absolute;z-index:2;left:50%;top:50%;
          transform:translate(-50%,-52%);
          width:clamp(340px,60vmin,680px);height:clamp(340px,60vmin,680px);
          border-radius:50%;
          background:radial-gradient(circle at 38% 35%,#08080f 0%,#04040c 40%,#000 100%);
          box-shadow:0 0 60px 10px rgba(255,140,0,.10),0 0 120px 30px rgba(255,100,0,.07),0 0 200px 60px rgba(200,80,0,.04);
          outline:1px solid rgba(255,160,0,.06);
        }

        #hero-text {
          position:absolute;top:50%;left:0;right:0;
          transform:translateY(-50%);
          z-index:6;text-align:center;padding:0 20px;
        }

        .logo-eyebrow {
          display:block;
          font-family:'Rajdhani',sans-serif;
          font-size:11px;font-weight:600;
          letter-spacing:7px;text-transform:uppercase;
          color:rgba(255,210,140,.65);margin-bottom:18px;
        }

        /* one-line logo */
        .game-logo {
          font-family:'Orbitron',monospace;font-weight:900;
          font-size:clamp(34px,6.2vw,92px);
          letter-spacing:-2px;line-height:1;
          display:block;
        }
        #txt-effortless {
          background:linear-gradient(180deg,#fff 0%,#ffe4a0 40%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          display:inline;
        }
        .ec-char { display:inline; }
        #txt-crew {
          background:linear-gradient(180deg,#fff 0%,#ffe4a0 40%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          display:inline;opacity:0;
          filter:drop-shadow(0 0 14px rgba(255,140,0,0.5));
        }

        .game-tagline {
          display:block;margin-top:14px;
          font-family:'Rajdhani',sans-serif;
          font-size:clamp(15.5px,2.1vw,23.3px);font-weight:300;
          letter-spacing:5px;text-transform:uppercase;
          color:rgba(255,200,130,.65);
          text-shadow:0 0 30px rgba(255,160,50,.4);
        }

        #enter-orbit-btn {
          display:inline-flex;align-items:center;gap:.7rem;
          margin-top:2.6rem;
          background:transparent;border:1px solid rgba(255,140,0,.45);
          color:#ffb347;
          font-family:'Rajdhani',sans-serif;font-size:.78rem;font-weight:700;
          letter-spacing:.3em;text-transform:uppercase;
          padding:.9rem 2.4rem;cursor:pointer;
          position:relative;overflow:hidden;pointer-events:all;
          transition:color .3s,border-color .3s;
        }
        #enter-orbit-btn .fill {
          position:absolute;inset:0;
          background:linear-gradient(90deg,#ff8c00,#ffb347);
          transform:translateX(-100%);transition:transform .35s ease;z-index:0;
        }
        #enter-orbit-btn span { position:relative;z-index:1; }
        #enter-orbit-btn:hover { color:#000;border-color:transparent; }
        #enter-orbit-btn:hover .fill { transform:translateX(0); }

        #layer-horizon {
          position:absolute;bottom:-16vh;left:0;
          width:100%;height:60vh;z-index:4;
          backface-visibility:hidden;
        }
        @media (min-aspect-ratio:16/9){ #layer-horizon { bottom:-36vh; } }
        #horizon-svg { position:absolute;inset:0;width:100%;height:100%;overflow:visible; }

        #nav {
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:24px 48px;
          background:linear-gradient(to bottom,rgba(0,0,0,.8),transparent);
        }
        .nav-logo { font-family:'Orbitron',monospace;font-size:20px;font-weight:700;color:#fff;letter-spacing:2px;text-shadow:0 0 20px rgba(255,160,50,.5); }
        .nav-links { display:flex;gap:36px;list-style:none; }
        .nav-links a { font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,210,150,.6);text-decoration:none;transition:color .3s; }
        .nav-links a:hover { color:#fff; }
        .nav-cta { font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#000;background:linear-gradient(135deg,#ffb347,#ff8c00);border:none;padding:10px 26px;cursor:pointer;transition:opacity .3s; }
        .nav-cta:hover { opacity:.85; }
      `}</style>

      <nav id="nav">
        <div className="nav-logo">EC</div>
        <ul className="nav-links">
          <li><a href="#">Work</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button type="button" className="nav-cta">Get Started</button>
      </nav>

      <section id="hero">
        <div id="layer-stars">
          <div id="stars-small" ref={starsSmall} />
          <div id="stars-mid"   ref={starsMid} />
          <div id="stars-large" ref={starsLarge} />
        </div>

        <div id="globe" ref={globeRef} />

        <div id="hero-text">
          <span className="logo-eyebrow">ONE STOP AGENCY</span>
          <div className="game-logo">
            <span id="txt-effortless">
              {CHARS.map((c, i) => <span key={i} className="ec-char">{c}</span>)}
            </span>
            <span id="txt-crew">&nbsp;CREW</span>
          </div>
          <span className="game-tagline">Branding &nbsp;·&nbsp; Web Design &nbsp;·&nbsp; Video &nbsp;·&nbsp; Automation</span>
          <br />
          <button type="button" id="enter-orbit-btn" onClick={onEnterOrbit}>
            <span className="fill" /><span>Discover Our Services</span>
          </button>
        </div>

        <div id="layer-horizon" ref={horizonRef}>
          <svg id="horizon-svg" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="planetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#8b2500" stopOpacity="1"/>
                <stop offset="18%"  stopColor="#3d1000" stopOpacity="1"/>
                <stop offset="55%"  stopColor="#0d0500" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="atmoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#ff8c00" stopOpacity="0"/>
                <stop offset="50%"  stopColor="#ff8c00" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
              </linearGradient>
              <filter id="glow" x="-20%" y="-200%" width="140%" height="500%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="atmosGlow" x="-5%" y="-300%" width="110%" height="700%">
                <feGaussianBlur stdDeviation="10"/>
              </filter>
            </defs>
            <path d="M-100,120 Q720,-60 1540,120 L1540,500 L-100,500 Z" fill="url(#planetGrad)"/>
            <path d="M-100,120 Q720,-60 1540,120 L1540,80 Q720,-100 -100,80 Z" fill="url(#atmoGrad)" filter="url(#atmosGlow)" opacity="0.9"/>
            <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,140,0,0.9)" strokeWidth="2.5" filter="url(#glow)"/>
            <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,120,0,0.25)" strokeWidth="18" filter="url(#atmosGlow)"/>
          </svg>
        </div>
      </section>
    </>
  );
}
