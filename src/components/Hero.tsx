"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── star field builder ─────────────────────────────────────── */
function buildStarField(
  el: HTMLElement,
  count: number,
  color: string,
  size: number
) {
  const S = Math.max(window.innerWidth, window.innerHeight) * 2.2;
  const shadows = Array.from({ length: count }, () => {
    const x = (Math.random() * S).toFixed(1);
    const y = (Math.random() * S).toFixed(1);
    const a = (Math.random() * 0.6 + 0.35).toFixed(2);
    return `${x}px ${y}px 0 rgba(${color},${a})`;
  }).join(",");
  el.style.cssText = `position:absolute;inset:0;width:${size}px;height:${size}px;box-shadow:${shadows};background:transparent;border-radius:50%;`;
}

export default function Hero({ onEnterOrbit }: { onEnterOrbit?: () => void }) {
  const heroRef      = useRef<HTMLDivElement>(null);
  const starsSmall   = useRef<HTMLDivElement>(null);
  const starsMid     = useRef<HTMLDivElement>(null);
  const starsLarge   = useRef<HTMLDivElement>(null);
  const globeRef     = useRef<HTMLDivElement>(null);
  const heroTextRef  = useRef<HTMLDivElement>(null);
  const horizonRef   = useRef<HTMLDivElement>(null);
  const scrollHint   = useRef<HTMLDivElement>(null);
  const ch1Nebula    = useRef<HTMLDivElement>(null);
  const ch1Line1     = useRef<HTMLDivElement>(null);
  const ch1Line2     = useRef<HTMLDivElement>(null);
  const ch1Divider   = useRef<HTMLDivElement>(null);
  const ch1Sub       = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLElement>(null);

  useEffect(() => {
    /* stars */
    if (starsSmall.current) buildStarField(starsSmall.current, 900, "255,230,200", 1);
    if (starsMid.current)   buildStarField(starsMid.current,   280, "255,240,210", 1.5);
    if (starsLarge.current) buildStarField(starsLarge.current, 100, "255,248,230", 2);

    /* twinkle */
    [starsSmall, starsMid, starsLarge].forEach((r) => {
      if (!r.current) return;
      gsap.to(r.current, {
        filter: "brightness(0.55)",
        duration: 2.5 + Math.random() * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      });
    });

    /* scroll timeline */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=200%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
      },
    });

    tl.to(starsSmall.current,  { y: "-18vh", ease: "none", duration: 1, force3D: true }, 0);
    tl.to(starsMid.current,    { y: "-18vh", ease: "none", duration: 1, force3D: true }, 0);
    tl.to(starsLarge.current,  { y: "-18vh", ease: "none", duration: 1, force3D: true }, 0);
    tl.to(globeRef.current,    { y: "-22vh", ease: "none", duration: 1, force3D: true }, 0);
    tl.to(heroTextRef.current, { opacity: 0, y: "-28vh", ease: "none", duration: 0.55, force3D: true }, 0);
    tl.to(horizonRef.current,  { y: "-72vh", ease: "none", duration: 1, force3D: true }, 0);
    tl.to(scrollHint.current,  { opacity: 0, ease: "none", duration: 0.1 }, 0);

    /* chapter 1 */
    tl.fromTo(ch1Line1.current,  { x: "-15vw", opacity: 0 }, { x: "0vw", opacity: 1, ease: "none", duration: 0.2 }, 0.4);
    tl.fromTo(ch1Line2.current,  { x: "15vw",  opacity: 0 }, { x: "0vw", opacity: 1, ease: "none", duration: 0.2 }, 0.48);
    tl.fromTo(ch1Divider.current,{ opacity: 0 }, { opacity: 1, ease: "none", duration: 0.12 }, 0.58);
    tl.fromTo(ch1Sub.current,    { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.1 }, 0.62);
    tl.fromTo(ch1Nebula.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.2 }, 0.4);

    tl.to("#ch1-block",
      { y: "-30vh", opacity: 0, ease: "power2.in", duration: 0.15 }, 0.65);
    tl.to(globeRef.current,{ scale: 12, ease: "power1.in", duration: 0.2, force3D: true }, 0.78);
    tl.to(horizonRef.current, { opacity: 0, ease: "none", duration: 0.2 }, 0.80);
    tl.to([starsSmall.current, starsMid.current, starsLarge.current],
      { opacity: 0, ease: "none", duration: 0.2 }, 0.80);
    tl.to(globeRef.current,{ opacity: 0, ease: "none", duration: 0.15, force3D: true }, 0.93);

    /* nav bg */
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: (s) => {
        if (!navRef.current) return;
        navRef.current.style.background =
          `linear-gradient(to bottom,rgba(0,0,0,${0.8 + s.progress * 0.2}),rgba(0,0,0,${s.progress * 0.9}))`;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

        #hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
          isolation: isolate;
          contain: layout style;
        }

        /* ── STARS ── */
        #layer-stars {
          position: absolute;
          top: 50%; left: 50%;
          width: 220vmax; height: 220vmax;
          margin-left: -110vmax; margin-top: -110vmax;
          z-index: 1;
          transform-origin: center center;
          animation: starRotate 120s linear infinite;
          clip-path: ellipse(50% 38% at 50% 30%);
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        @keyframes starRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        #stars-small, #stars-mid, #stars-large {
          position: absolute; inset: 0;
        }

        /* ── GLOBE ── deep indigo with warm amber glow */
        #globe {
          position: absolute;
          z-index: 2;
          left: 50%; top: 50%;
          transform: translate(-50%, -52%);
          width: clamp(340px, 60vmin, 680px);
          height: clamp(340px, 60vmin, 680px);
          border-radius: 50%;
          background: radial-gradient(circle at 38% 35%,
            #08080f 0%,
            #04040c 40%,
            #000 100%
          );
          box-shadow:
            0 0 60px 10px rgba(255, 140, 0, 0.10),
            0 0 120px 30px rgba(255, 100, 0, 0.07),
            0 0 200px 60px rgba(200, 80, 0, 0.04);
          outline: 1px solid rgba(255, 160, 0, 0.06);
          will-change: transform, opacity;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* ── HERO TEXT ── */
        #hero-text {
          position: absolute;
          top: 50%; left: 0; right: 0;
          transform: translateY(-50%);
          z-index: 3;
          text-align: center;
          width: 100%;
          padding: 0 20px;
          will-change: opacity, transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        #enter-orbit-btn {
          display: inline-flex;
          align-items: center;
          gap: .7rem;
          margin-top: 2.8rem;
          background: transparent;
          border: 1px solid rgba(255,140,0,.45);
          color: #ffb347;
          font-family: 'Rajdhani', sans-serif;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .3em;
          text-transform: uppercase;
          padding: .9rem 2.4rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          pointer-events: all;
          transition: color .3s, border-color .3s;
        }
        #enter-orbit-btn .fill {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #ff8c00, #ffb347);
          transform: translateX(-100%);
          transition: transform .35s ease;
          z-index: 0;
        }
        #enter-orbit-btn span { position: relative; z-index: 1; }
        #enter-orbit-btn:hover { color: #000; border-color: transparent; }
        #enter-orbit-btn:hover .fill { transform: translateX(0); }
        .game-logo {
          font-family: 'Orbitron', monospace;
          font-size: clamp(36px, 6.5vw, 96px);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 0.9;
          color: #fff;
          text-shadow:
            0 0 40px rgba(255,200,100,0.4),
            0 0 80px rgba(255,150,50,0.3),
            0 0 140px rgba(200,100,0,0.2);
          background: linear-gradient(180deg, #ffffff 0%, #ffe4a0 40%, #ffb347 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
        }
        .game-logo::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          font-family: 'Orbitron', monospace;
          font-size: inherit; font-weight: 900;
          background: none;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 60px rgba(255,160,50,0.5);
          filter: blur(12px);
        }
        .logo-eyebrow {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(255,210,140,0.7);
          margin-bottom: 18px;
          display: block;
        }
        .game-tagline {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(16px, 2.2vw, 24px);
          font-weight: 300;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(255,200,130,0.65);
          margin-top: 22px;
          display: block;
          text-shadow: 0 0 30px rgba(255,160,50,0.4);
        }

        /* ── HORIZON ── deep amber planet surface */
        #layer-horizon {
          position: absolute;
          bottom: -16vh; left: 0;
          width: 100%; height: 60vh;
          z-index: 4;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        @media (min-aspect-ratio: 16/9) {
          #layer-horizon { bottom: -36vh; }
        }
        #horizon-svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          overflow: visible;
        }

        /* ── SCROLL HINT ── */
        #scroll-hint {
          position: absolute;
          bottom: 32px; left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          opacity: 0;
          animation: fadeIn 1s ease 2s forwards;
        }
        #scroll-hint span {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,200,120,0.5);
        }
        .scroll-arrow {
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, rgba(255,190,100,0.5), transparent);
          position: relative;
          animation: scrollBounce 1.8s ease-in-out infinite;
        }
        .scroll-arrow::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 7px; height: 7px;
          border-right: 1px solid rgba(255,190,100,0.5);
          border-bottom: 1px solid rgba(255,190,100,0.5);
          transform: translateX(-50%) rotate(45deg);
        }
        @keyframes scrollBounce {
          0%,100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(6px); }
        }
        @keyframes fadeIn { to { opacity: 1; } }

        /* ── NAV ── */
        #nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
        }
        .nav-logo {
          font-family: 'Orbitron', monospace;
          font-size: 20px; font-weight: 700;
          color: #fff; letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(255,160,50,0.5);
        }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,210,150,0.6);
          text-decoration: none;
          transition: color .3s;
        }
        .nav-links a:hover { color: #fff; }
        .nav-cta {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #000;
          background: linear-gradient(135deg, #ffb347, #ff8c00);
          border: none;
          padding: 10px 26px;
          cursor: pointer;
          transition: opacity .3s;
        }
        .nav-cta:hover { opacity: 0.85; }

        /* ── CHAPTER 1 ── */
        #ch1-nebula {
          position: absolute;
          top: 40%; right: -15%;
          width: 70vw; height: 70vw;
          border-radius: 50%;
          background: radial-gradient(ellipse at center,
            rgba(160, 60, 10, 0.18) 0%,
            rgba(80, 30, 5, 0.08) 40%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
          z-index: 5;
          will-change: transform, opacity;
          opacity: 0;
        }
        /* single centered block — no overlap at any aspect ratio */
        #ch1-block {
          position: absolute;
          top: 50%; left: 0; right: 0;
          transform: translateY(-50%);
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 2vh, 28px);
          padding: 0 5%;
          will-change: transform, opacity;
        }
        .ch1-headline {
          font-family: 'Orbitron', monospace;
          font-size: clamp(28px, 5.5vw, 100px);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1;
          will-change: transform, opacity;
          opacity: 0;
          background: linear-gradient(180deg, #ffffff 0%, #ffe4b0 60%, #ffb347 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        #ch1-line1 { text-align: left; }
        .ch1-line2  { text-align: right; }
        #ch1-divider {
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,160,50,0.5) 30%,
            rgba(255,160,50,0.5) 70%,
            transparent 100%
          );
          opacity: 0;
          will-change: transform, opacity;
        }
        #ch1-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(11px, 1.2vw, 17px);
          font-weight: 400;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(255,200,130,0.55);
          text-align: center;
          opacity: 0;
          will-change: opacity, transform;
        }
      `}</style>

      <nav id="nav" ref={navRef}>
        <div className="nav-logo">EC</div>
        <ul className="nav-links">
          <li><a href="#">Work</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button className="nav-cta">Get Started</button>
      </nav>

      <section id="hero" ref={heroRef}>
        {/* Stars */}
        <div id="layer-stars">
          <div id="stars-small" ref={starsSmall}></div>
          <div id="stars-mid"   ref={starsMid}></div>
          <div id="stars-large" ref={starsLarge}></div>
        </div>

        {/* Globe */}
        <div id="globe" ref={globeRef}></div>

        {/* Hero text */}
        <div id="hero-text" ref={heroTextRef}>
          <span className="logo-eyebrow">· Online Creative Force ·</span>
          <div className="game-logo" data-text="EFFORTLESS CREW">EFFORTLESS CREW</div>
          <span className="game-tagline">Branding &nbsp;·&nbsp; Web Design &nbsp;·&nbsp; Video &nbsp;·&nbsp; Automation</span>
          <button id="enter-orbit-btn" onClick={onEnterOrbit}>
            <span className="fill" />
            <span>Discover Our Services</span>
          </button>
        </div>

        {/* Horizon */}
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
            <path d="M-100,120 Q720,-60 1540,120 L1540,80 Q720,-100 -100,80 Z"
                  fill="url(#atmoGrad)" filter="url(#atmosGlow)" opacity="0.9"/>
            <path d="M-100,120 Q720,-60 1540,120"
                  fill="none" stroke="rgba(255,140,0,0.9)" strokeWidth="2.5" filter="url(#glow)"/>
            <path d="M-100,120 Q720,-60 1540,120"
                  fill="none" stroke="rgba(255,120,0,0.25)" strokeWidth="18" filter="url(#atmosGlow)"/>
          </svg>
        </div>

        {/* Scroll hint */}
        <div id="scroll-hint" ref={scrollHint}>
          <span>Scroll</span>
          <div className="scroll-arrow"></div>
        </div>

        {/* Chapter 1 */}
        <div id="ch1-nebula" ref={ch1Nebula}></div>
        <div id="ch1-block">
          <div id="ch1-line1"   ref={ch1Line1} className="ch1-headline">ONE CREW.</div>
          <div id="ch1-divider" ref={ch1Divider}></div>
          <div id="ch1-line2"   ref={ch1Line2} className="ch1-headline ch1-line2">EVERY DIRECTION.</div>
          <div id="ch1-sub"     ref={ch1Sub}>The Universe&apos;s True Creative Team</div>
        </div>
      </section>
    </>
  );
}
