import type { Metadata } from "next";
import Link from "next/link";
import StarField from "@/components/StarField";
import PageNav from "@/components/PageNav";

export const metadata: Metadata = {
  title: "Work With Effortless Crew | Join the Team",
  description: "We're always looking for talented editors, designers, researchers, writers and developers. Work with one of the fastest growing digital agencies.",
};

const ROLES = [
  { n: "01", name: "Video Editors", desc: "Adobe Premiere, After Effects, or DaVinci Resolve pros who can cut with purpose and pace." },
  { n: "02", name: "Web Designers", desc: "Figma-first designers who understand conversion, aesthetics, and modern web standards." },
  { n: "03", name: "Brand Designers", desc: "Identity creators with a sharp eye for logos, typography, and visual systems." },
  { n: "04", name: "Writers & Researchers", desc: "Scriptwriters, copywriters, and researchers who can tell a story and back it with data." },
  { n: "05", name: "Developers", desc: "Frontend-focused devs who can build fast, clean, and pixel-perfect from a design." },
  { n: "06", name: "SEO & Growth", desc: "Traffic strategists who understand content, rankings, and the algorithm." },
];

const STEPS = [
  { num: "01", label: "Apply", desc: "Send us your portfolio and a short intro. Tell us what you do and what you're best at." },
  { num: "02", label: "Portfolio Review", desc: "We go through your work carefully. If it stands out, you hear back fast." },
  { num: "03", label: "Trial Project", desc: "A small paid project to see how we work together. No long commitments." },
  { num: "04", label: "Welcome to the Crew", desc: "You're in. Start taking on real work with a team that's serious about quality." },
];

export default function CareersPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@300;400;600;700&display=swap');

        .pg { position:relative;background:#000;color:#fff;min-height:100vh; }

        .ph {
          position:relative;width:100%;height:100vh;
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;z-index:1;
          background:radial-gradient(ellipse 70% 50% at 50% 110%,rgba(180,50,0,.09) 0%,transparent 70%);
        }
        .ph-inner {
          position:relative;z-index:5;text-align:center;padding:0 24px;
          animation:pgFadeUp .9s cubic-bezier(.16,1,.3,1) both;animation-delay:.15s;
        }
        @keyframes pgFadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        .ph-eyebrow {
          display:block;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:600;
          letter-spacing:8px;text-transform:uppercase;color:rgba(255,210,140,.55);margin-bottom:22px;
        }
        .ph-headline {
          font-family:'Orbitron',monospace;font-weight:900;
          font-size:clamp(32px,5.5vw,82px);letter-spacing:-2px;line-height:1;
          background:linear-gradient(180deg,#fff 0%,#ffe4a0 40%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          margin-bottom:22px;
        }
        .ph-sub {
          font-family:'Rajdhani',sans-serif;font-size:clamp(13px,1.5vw,19px);
          font-weight:300;letter-spacing:4px;text-transform:uppercase;
          color:rgba(255,200,130,.5);margin-bottom:44px;
        }
        .pg-cta {
          display:inline-flex;align-items:center;gap:.7rem;
          background:transparent;border:1px solid rgba(255,140,0,.45);
          color:#ffb347;font-family:'Rajdhani',sans-serif;font-size:.78rem;font-weight:700;
          letter-spacing:.3em;text-transform:uppercase;padding:.75rem 2.2rem;
          cursor:pointer;position:relative;overflow:hidden;text-decoration:none;
          transition:color .3s,border-color .3s;
        }
        .pg-cta .fill {
          position:absolute;inset:0;background:linear-gradient(90deg,#ff8c00,#ffb347);
          transform:translateX(-100%);transition:transform .35s ease;z-index:0;
        }
        .pg-cta span { position:relative;z-index:1; }
        .pg-cta:hover { color:#000;border-color:transparent; }
        .pg-cta:hover .fill { transform:translateX(0); }

        .ph-horizon {
          position:absolute;bottom:-18vh;left:0;width:100%;height:55vh;z-index:3;pointer-events:none;
        }
        @media(min-aspect-ratio:16/9){ .ph-horizon { bottom:-34vh; } }

        .sec-label {
          font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:600;
          letter-spacing:9px;text-transform:uppercase;
          color:rgba(255,200,100,.35);margin-bottom:52px;text-align:center;
        }

        /* ROLES */
        .rl { position:relative;z-index:1;padding:80px 8% 64px;border-top:1px solid rgba(255,140,0,.07); }
        .rl-grid {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:1px;border:1px solid rgba(255,140,0,.07);
        }
        .rl-card {
          padding:36px 30px;background:rgba(0,0,0,.5);transition:background .3s;
        }
        .rl-card:hover { background:rgba(255,80,0,.04); }
        .rl-num {
          font-family:'Orbitron',monospace;font-size:10px;font-weight:700;
          color:rgba(255,140,0,.3);letter-spacing:.35em;margin-bottom:18px;
        }
        .rl-name {
          font-family:'Orbitron',monospace;font-size:clamp(12px,1vw,15px);font-weight:900;
          color:#fff;margin-bottom:10px;line-height:1.3;
        }
        .rl-desc {
          font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:400;
          color:rgba(255,200,130,.38);line-height:1.6;
        }

        /* HOW IT WORKS */
        .hw { position:relative;z-index:1;padding:60px 8% 80px; }
        .hw-steps {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0;
          border:1px solid rgba(255,140,0,.07);
        }
        .hw-step {
          padding:48px 32px;border-right:1px solid rgba(255,140,0,.07);
          position:relative;
        }
        .hw-step:last-child { border-right:none; }
        .hw-num {
          font-family:'Orbitron',monospace;font-size:clamp(32px,4vw,56px);font-weight:900;
          color:rgba(255,140,0,.1);line-height:1;margin-bottom:16px;
        }
        .hw-label {
          font-family:'Orbitron',monospace;font-size:clamp(12px,1vw,14px);font-weight:900;
          color:#ffb347;margin-bottom:12px;
        }
        .hw-desc {
          font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:400;
          color:rgba(255,200,130,.4);line-height:1.6;
        }

        /* BOTTOM CTA */
        .bc {
          position:relative;z-index:1;padding:88px 8%;text-align:center;
          border-top:1px solid rgba(255,140,0,.07);
          background:radial-gradient(ellipse 70% 120% at 50% 100%,rgba(160,40,0,.07) 0%,transparent 70%);
        }
        .bc-headline {
          font-family:'Orbitron',monospace;font-size:clamp(24px,3.8vw,54px);font-weight:900;
          background:linear-gradient(180deg,#fff 0%,#ffb347 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          margin-bottom:18px;line-height:1.1;
        }
        .bc-sub {
          font-family:'Rajdhani',sans-serif;font-size:clamp(13px,1.3vw,17px);
          font-weight:300;letter-spacing:4px;text-transform:uppercase;
          color:rgba(255,200,130,.4);margin-bottom:44px;
        }

        .pg-footer {
          position:relative;z-index:1;padding:28px 8%;
          border-top:1px solid rgba(255,140,0,.05);
          display:flex;align-items:center;justify-content:space-between;
        }
        .pg-footer-logo {
          font-family:'Orbitron',monospace;font-size:16px;font-weight:700;
          color:rgba(255,200,100,.25);letter-spacing:2px;text-decoration:none;
        }
        .pg-footer-back {
          font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:600;
          letter-spacing:3px;text-transform:uppercase;
          color:rgba(255,200,100,.25);text-decoration:none;transition:color .3s;
        }
        .pg-footer-back:hover { color:rgba(255,200,100,.65); }
      `}</style>

      <StarField />
      <PageNav />

      <div className="pg">
        <section className="ph">
          <div className="ph-inner">
            <span className="ph-eyebrow">Careers</span>
            <h1 className="ph-headline">Join<br />The Crew</h1>
            <p className="ph-sub">Think you&apos;ve got what it takes?</p>
            <Link href="mailto:createwithshaikh@gmail.com" className="pg-cta">
              <span className="fill" /><span>Apply Now →</span>
            </Link>
          </div>
          <div className="ph-horizon">
            <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" style={{width:"100%",height:"100%",overflow:"visible"}} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="carPG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b2500" stopOpacity="1"/>
                  <stop offset="18%" stopColor="#3d1000" stopOpacity="1"/>
                  <stop offset="55%" stopColor="#0d0500" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#000" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="carAG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c00" stopOpacity="0"/>
                  <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
                </linearGradient>
                <filter id="carGlow" x="-20%" y="-200%" width="140%" height="500%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="carAGlow" x="-5%" y="-300%" width="110%" height="700%">
                  <feGaussianBlur stdDeviation="10"/>
                </filter>
              </defs>
              <path d="M-100,120 Q720,-60 1540,120 L1540,500 L-100,500 Z" fill="url(#carPG)"/>
              <path d="M-100,120 Q720,-60 1540,120 L1540,80 Q720,-100 -100,80 Z" fill="url(#carAG)" filter="url(#carAGlow)" opacity="0.9"/>
              <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,140,0,0.9)" strokeWidth="2.5" filter="url(#carGlow)"/>
              <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,120,0,0.25)" strokeWidth="18" filter="url(#carAGlow)"/>
            </svg>
          </div>
        </section>

        <section className="rl">
          <p className="sec-label">Who We&apos;re Looking For</p>
          <div className="rl-grid">
            {ROLES.map((r, i) => (
              <div key={i} className="rl-card">
                <div className="rl-num">{r.n}</div>
                <div className="rl-name">{r.name}</div>
                <div className="rl-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hw">
          <p className="sec-label">How It Works</p>
          <div className="hw-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="hw-step">
                <div className="hw-num">{s.num}</div>
                <div className="hw-label">{s.label}</div>
                <div className="hw-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bc">
          <h2 className="bc-headline">Ready to<br />Make Your Mark?</h2>
          <p className="bc-sub">Send your portfolio and let your work speak first.</p>
          <Link href="mailto:createwithshaikh@gmail.com" className="pg-cta">
            <span className="fill" /><span>Apply Now →</span>
          </Link>
        </section>

        <footer className="pg-footer">
          <Link href="/" className="pg-footer-logo">EC</Link>
          <Link href="/" className="pg-footer-back">← Back to Home</Link>
        </footer>
      </div>
    </>
  );
}
