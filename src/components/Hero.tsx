"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export interface HeroHandle {
  exitDown: () => void;
  prepareEntrance: () => void;
  replayEntrance: () => void;
}

const Hero = forwardRef<HeroHandle, { onEnterOrbit?: () => void }>(
  function Hero({ onEnterOrbit }, ref) {

  const s2Ref       = useRef<HTMLDivElement>(null);
  const s3Ref       = useRef<HTMLDivElement>(null);
  const globeRef    = useRef<HTMLDivElement>(null);
  const horizonRef  = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const ch1Line1    = useRef<HTMLDivElement>(null);
  const ch1Line2    = useRef<HTMLDivElement>(null);
  const ch1Divider  = useRef<HTMLDivElement>(null);
  const ch1Sub      = useRef<HTMLDivElement>(null);
  const enterTlRef  = useRef<gsap.core.Timeline | null>(null);

  function playEntrance(delay = 0.3) {
    enterTlRef.current?.kill();

    gsap.set([
      horizonRef.current, globeRef.current, heroTextRef.current,
      ch1Line1.current, ch1Line2.current, ch1Divider.current, ch1Sub.current,
    ], { clearProps: "all" });

    gsap.set(heroTextRef.current, { yPercent: -50 });
    gsap.set(horizonRef.current,  { y: "60vh" });
    gsap.set(globeRef.current,    { opacity: 0, scale: 0.9 });
    gsap.set(".logo-eyebrow",     { opacity: 0, y: 10 });
    gsap.set(".ec-char",          { opacity: 0 });
    gsap.set("#txt-crew",         { opacity: 0 });
    gsap.set(".game-tagline",     { opacity: 0, y: 8 });
    gsap.set("#enter-orbit-btn",  { opacity: 0, y: 8 });
    gsap.set([ch1Line1.current, ch1Line2.current, ch1Divider.current, ch1Sub.current], { opacity: 0 });
    gsap.set("#ch1-final",        { opacity: 0 });

    const enter = gsap.timeline({ defaults: { ease: "power3.out" }, delay });
    enterTlRef.current = enter;

    enter.to(horizonRef.current,  { y: "0vh", duration: 1.4, ease: "power2.out", onComplete: () => gsap.set(horizonRef.current, { clearProps: "transform" }) }, 0);
    enter.to(globeRef.current,    { opacity: 1, scale: 1, duration: 1.2 }, 0.2);
    enter.to(".logo-eyebrow",     { opacity: 1, y: 0, duration: 0.6 }, 0.9);
    enter.to(".ec-char",          { opacity: 1, duration: 0.3, stagger: 0.055 }, 1.2);
    enter.set("#txt-crew",        { opacity: 1 }, 2.0);
    enter.fromTo("#txt-crew",
      { filter: "brightness(6) drop-shadow(0 0 60px rgba(255,210,80,1)) drop-shadow(0 0 120px rgba(255,140,0,1))" },
      { filter: "brightness(1) drop-shadow(0 0 14px rgba(255,140,0,0.5))", duration: 0.75, ease: "power2.out" },
      2.0
    );
    enter.to(".game-tagline",     { opacity: 1, y: 0, duration: 0.5 }, 2.75);
    enter.to("#enter-orbit-btn",  { opacity: 1, y: 0, duration: 0.5 }, 2.95);
  }

  useImperativeHandle(ref, () => ({
    exitDown() {
      enterTlRef.current?.kill();
      gsap.to(horizonRef.current, { y: "60vh", duration: 0.7, ease: "power2.in" });
      gsap.to(globeRef.current,   { y: "20vh", opacity: 0, duration: 0.5, ease: "power2.in", delay: 0.05 });
      gsap.to(".logo-eyebrow, .ec-char, #txt-crew, .game-tagline, #enter-orbit-btn",
        { opacity: 0, y: 20, duration: 0.35, stagger: 0.04, ease: "power2.in" });
    },
    prepareEntrance() {
      enterTlRef.current?.kill();
      gsap.set(horizonRef.current,  { y: "60vh" });
      gsap.set(globeRef.current,    { opacity: 0, scale: 0.9, y: 0 });
      gsap.set(heroTextRef.current, { yPercent: -50 });
      gsap.set(".logo-eyebrow, .ec-char, #txt-crew, .game-tagline, #enter-orbit-btn", { opacity: 0 });
    },
    replayEntrance() {
      playEntrance(0);
    },
  }));

  useEffect(() => {
    if (s2Ref.current) buildStarField(s2Ref.current, 280, "255,240,210", 1.5);
    if (s3Ref.current) buildStarField(s3Ref.current, 100, "255,248,230", 2);

    playEntrance(0.25);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=400%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
      }
    });

    // PARALLAX — horizon catches up to text, feels like ground rising
    tl.fromTo(heroTextRef.current, { yPercent: -50, y: "0", opacity: 1 }, { yPercent: -50, y: "-22vh", opacity: 0, ease: "none", duration: 0.4, force3D: true }, 0);
    tl.fromTo(horizonRef.current, { y: "0" }, { y: "-85vh", ease: "power2.in", duration: 0.4, force3D: true }, 0);
    tl.to("#hero-stars-wrap",  { y: "-10vh", ease: "none", duration: 0.55, force3D: true }, 0);

    // CHAPTER 1 — ONE CREW. slides from left, DOES EVERYTHING IMAGINABLE from right
    tl.fromTo(ch1Line1.current,   { x: "-15vw", opacity: 0 }, { x: "0vw", opacity: 1, ease: "none", duration: 0.12 }, 0.38);
    tl.fromTo(ch1Line2.current,   { x: "15vw",  opacity: 0 }, { x: "0vw", opacity: 1, ease: "none", duration: 0.12 }, 0.45);
    tl.fromTo(ch1Divider.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.08 }, 0.52);
    tl.fromTo(ch1Sub.current,     { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.08 }, 0.56);

    // CHAPTER 1 EXIT — float up and fade
    tl.to([ch1Line1.current, ch1Line2.current, ch1Divider.current, ch1Sub.current],
      { y: "-20vh", opacity: 0, ease: "none", duration: 0.12 }, 0.62);

    // GLOBE EXPANDS (slow start, accelerates)
    tl.fromTo(globeRef.current, { scale: 1 }, { scale: 14, ease: "power2.in", duration: 0.5, force3D: true }, 0.5);

    // FINAL TEXT appears
    tl.fromTo("#ch1-final", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.1 }, 0.65);

    // FADE EVERYTHING OUT
    tl.to(horizonRef.current,  { opacity: 0, ease: "none", duration: 0.1 }, 0.78);
    tl.to("#hero-stars-wrap",  { opacity: 0, ease: "none", duration: 0.1 }, 0.78);
    tl.fromTo(globeRef.current, { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.1, force3D: true }, 0.88);

    return () => {
      enterTlRef.current?.kill();
      tl.scrollTrigger?.kill(false);
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@300;400;600;700&display=swap');

        #hero {
          position:relative;width:100%;height:100vh;
          overflow:hidden;background:transparent;isolation:isolate;
        }

        #hero-stars-wrap {
          position:absolute;top:0;left:0;width:100%;height:100%;
          z-index:1;pointer-events:none;
        }
        #hero-stars {
          position:absolute;top:50%;left:50%;
          width:220vmax;height:220vmax;
          margin-left:-110vmax;margin-top:-110vmax;
          transform-origin:center;
          animation:heroStarRotate 120s linear infinite;
          clip-path:ellipse(50% 38% at 50% 30%);
          pointer-events:none;
        }
        @keyframes heroStarRotate { to { transform:rotate(360deg); } }
        .hs { position:absolute;inset:0; }
        .hs:nth-child(1) { animation:hsTwinkle 3.5s ease-in-out infinite alternate; }
        .hs:nth-child(2) { animation:hsTwinkle 4.8s ease-in-out infinite alternate-reverse; }
        .hs:nth-child(3) { animation:hsTwinkle 2.9s ease-in-out infinite alternate; }
        @keyframes hsTwinkle { from{filter:brightness(1);} to{filter:brightness(0.5);} }

        #globe {
          position:absolute;z-index:3;left:50%;top:50%;
          transform:translate(-50%,-52%);
          width:clamp(340px,60vmin,680px);height:clamp(340px,60vmin,680px);
          border-radius:50%;
          background:radial-gradient(circle at 38% 35%,#08080f 0%,#04040c 40%,#000 100%);
          box-shadow:0 0 60px 10px rgba(255,140,0,.10),0 0 120px 30px rgba(255,100,0,.07),0 0 200px 60px rgba(200,80,0,.04);
          outline:1px solid rgba(255,160,0,.06);
          transform-origin:center center;
        }

        #hero-text {
          position:absolute;top:50%;left:0;right:0;
          z-index:6;text-align:center;padding:0 20px;
        }
        .logo-eyebrow {
          display:block;font-family:'Rajdhani',sans-serif;
          font-size:11px;font-weight:600;letter-spacing:7px;text-transform:uppercase;
          color:rgba(255,210,140,.65);margin-bottom:18px;
        }
        .game-logo {
          font-family:'Orbitron',monospace;font-weight:900;
          font-size:clamp(26px,4.8vw,68px);letter-spacing:-2px;line-height:1;display:block;
        }
        #txt-effortless {
          background:linear-gradient(180deg,#fff 0%,#ffe4a0 40%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline;
        }
        .ec-char { display:inline; }
        #txt-crew {
          background:linear-gradient(180deg,#fff 0%,#ffe4a0 40%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          display:inline;opacity:0;filter:drop-shadow(0 0 14px rgba(255,140,0,0.5));
        }
        .game-tagline {
          display:block;margin-top:14px;font-family:'Rajdhani',sans-serif;
          font-size:clamp(15.5px,2.1vw,23.3px);font-weight:300;letter-spacing:5px;text-transform:uppercase;
          color:rgba(255,200,130,.65);text-shadow:0 0 30px rgba(255,160,50,.4);
        }
        #enter-orbit-btn {
          display:inline-flex;align-items:center;gap:.7rem;margin-top:2.6rem;
          background:transparent;border:1px solid rgba(255,140,0,.45);
          color:#ffb347;font-family:'Rajdhani',sans-serif;font-size:.78rem;font-weight:700;
          letter-spacing:.3em;text-transform:uppercase;padding:.65rem 1.8rem;
          cursor:pointer;position:relative;overflow:hidden;pointer-events:all;
          transition:color .3s,border-color .3s;
        }
        #enter-orbit-btn .fill {
          position:absolute;inset:0;background:linear-gradient(90deg,#ff8c00,#ffb347);
          transform:translateX(-100%);transition:transform .35s ease;z-index:0;
        }
        #enter-orbit-btn span { position:relative;z-index:1; }
        #enter-orbit-btn:hover { color:#000;border-color:transparent; }
        #enter-orbit-btn:hover .fill { transform:translateX(0); }

        /* Chapter 1 block */
        #ch1-block {
          position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);
          z-index:9;display:flex;flex-direction:column;align-items:center;
          gap:clamp(8px,1.8vh,24px);padding:0 6%;pointer-events:none;
        }
        .ch1-headline {
          font-family:'Orbitron',monospace;font-size:clamp(26px,5vw,88px);font-weight:900;
          letter-spacing:-1px;line-height:1;opacity:0;width:100%;
          background:linear-gradient(180deg,#fff 0%,#ffe4b0 60%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        #ch1-line1 { text-align:left; }
        #ch1-line2 { text-align:right; }
        #ch1-divider {
          width:100%;height:1px;opacity:0;
          background:linear-gradient(90deg,transparent 0%,rgba(255,200,80,1) 50%,transparent 100%);
          box-shadow:0 0 8px 2px rgba(255,160,50,0.6);
        }
        #ch1-sub {
          font-family:'Rajdhani',sans-serif;font-size:clamp(10px,1.1vw,15px);
          font-weight:300;letter-spacing:8px;text-transform:uppercase;
          color:rgba(255,200,130,.5);text-align:center;opacity:0;
        }

        /* Final text */
        #ch1-final {
          position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);
          z-index:8;text-align:center;padding:0 10%;
          font-family:'Rajdhani',sans-serif;font-size:clamp(13px,1.4vw,20px);
          font-weight:300;letter-spacing:7px;text-transform:uppercase;
          color:rgba(255,200,130,.7);opacity:0;pointer-events:none;
          text-shadow:0 0 40px rgba(255,160,50,.4);
        }

        #layer-horizon {
          position:absolute;bottom:-24vh;left:0;width:100%;height:60vh;z-index:7;
          backface-visibility:hidden;
        }
        @media (min-aspect-ratio:16/9){ #layer-horizon { bottom:-44vh; } }
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
        .nav-cta { font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#000;background:linear-gradient(135deg,#ffb347,#ff8c00);border:none;padding:10px 26px;cursor:pointer;transition:opacity .3s;text-decoration:none; }
        .nav-cta:hover { opacity:.85; }
      `}</style>

      <nav id="nav">
        <div className="nav-logo">EC</div>
        <ul className="nav-links">
          <li><a href="/for-creators">Creators</a></li>
          <li><a href="/for-businesses">Businesses</a></li>
          <li><a href="/for-agencies">Agencies</a></li>
          <li><a href="/careers">Careers</a></li>
        </ul>
        <a href="mailto:createwithshaikh@gmail.com" className="nav-cta">Get Started</a>
      </nav>

      <section id="hero" ref={heroRef}>
        <div id="hero-stars-wrap">
          <div id="hero-stars">
            <div className="hs" ref={s2Ref} />
            <div className="hs" ref={s3Ref} />
          </div>
        </div>

        <div id="globe" ref={globeRef} />

        <div id="hero-text" ref={heroTextRef}>
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

        <div id="ch1-block">
          <div id="ch1-line1" ref={ch1Line1} className="ch1-headline">ONE CREW.</div>
          <div id="ch1-divider" ref={ch1Divider} />
          <div id="ch1-line2" ref={ch1Line2} className="ch1-headline">DOES EVERYTHING IMAGINABLE.</div>
          <div id="ch1-sub" ref={ch1Sub}>we are the most creative team in the universe</div>
        </div>

        <div id="ch1-final">we are the most creative team in the universe</div>
      </section>
    </>
  );
});

export default Hero;
