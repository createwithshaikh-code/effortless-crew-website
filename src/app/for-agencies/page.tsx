import type { Metadata } from "next";
import Link from "next/link";
import StarField from "@/components/StarField";
import PageNav from "@/components/PageNav";

export const metadata: Metadata = {
  title: "Supercharge Your Agency with Effortless Crew",
  description: "Worried about delayed client submissions? Effortless Crew delivers fast — web design, branding, video editing, and more — on time, every time.",
};

const PAIN_POINTS = [
  { q: "Drowning in client work?", a: "We become your silent production team — delivering exactly what you need, when you need it." },
  { q: "Missing deadlines?", a: "Speed is our standard. We turn around professional work faster than any in-house hire could." },
  { q: "Can't scale without hiring?", a: "Use us as your on-demand team. Scale up or down with zero overhead, zero risk." },
];

const SERVICES = [
  { n: "01", name: "White-Label Web Design", desc: "Client-ready websites delivered under your brand name" },
  { n: "02", name: "Branding & Identity", desc: "Full brand systems your clients will actually be proud of" },
  { n: "03", name: "Video Production", desc: "Edited, polished video content for any client niche" },
  { n: "04", name: "YouTube Automation", desc: "Full faceless channel builds and ongoing management" },
  { n: "05", name: "Motion Graphics", desc: "Animated assets, intros, and brand motion pieces" },
  { n: "06", name: "Growth & Traffic", desc: "SEO and traffic strategies delivered white-label ready" },
];

const REASONS = [
  { label: "Fast Turnaround", desc: "We move at agency speed — no waiting, no chasing." },
  { label: "Professional Quality", desc: "Work that makes your clients come back for more." },
  { label: "White-Label Ready", desc: "Everything delivered under your brand, not ours." },
  { label: "Scalable Output", desc: "More clients? We handle the volume without dropping quality." },
];

export default function ForAgenciesPage() {
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

        /* WHY US */
        .wy {
          position:relative;z-index:1;padding:80px 8% 64px;
          border-top:1px solid rgba(255,140,0,.07);
        }
        .wy-grid {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;
          border:1px solid rgba(255,140,0,.06);
        }
        .wy-card {
          padding:40px 32px;background:rgba(255,80,0,.015);transition:background .3s;
        }
        .wy-card:hover { background:rgba(255,80,0,.04); }
        .wy-label {
          font-family:'Orbitron',monospace;font-size:clamp(11px,1vw,14px);font-weight:900;
          color:#ffb347;margin-bottom:12px;
        }
        .wy-desc {
          font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:400;
          color:rgba(255,200,130,.45);line-height:1.6;
        }

        /* PAIN POINTS */
        .pp { position:relative;z-index:1;padding:60px 8% 64px; }
        .pp-grid {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;
          border:1px solid rgba(255,140,0,.06);
        }
        .pp-card {
          padding:44px 36px;background:rgba(255,80,0,.015);transition:background .3s;
        }
        .pp-card:hover { background:rgba(255,80,0,.04); }
        .pp-q {
          font-family:'Orbitron',monospace;font-size:clamp(13px,1.3vw,17px);font-weight:900;
          color:#fff;margin-bottom:14px;line-height:1.3;
        }
        .pp-a {
          font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:400;
          color:rgba(255,200,130,.45);line-height:1.6;
        }

        /* SERVICES */
        .sv { position:relative;z-index:1;padding:60px 8% 80px; }
        .sv-grid {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:1px;border:1px solid rgba(255,140,0,.07);
        }
        .sv-card {
          padding:36px 30px;background:rgba(0,0,0,.5);transition:background .3s;
        }
        .sv-card:hover { background:rgba(255,80,0,.04); }
        .sv-num {
          font-family:'Orbitron',monospace;font-size:10px;font-weight:700;
          color:rgba(255,140,0,.3);letter-spacing:.35em;margin-bottom:18px;
        }
        .sv-name {
          font-family:'Orbitron',monospace;font-size:clamp(12px,1vw,14px);font-weight:900;
          color:#fff;margin-bottom:10px;line-height:1.3;
        }
        .sv-desc {
          font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:400;
          color:rgba(255,200,130,.38);line-height:1.5;
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
            <span className="ph-eyebrow">For Agencies</span>
            <h1 className="ph-headline">Supercharge<br />Your Agency</h1>
            <p className="ph-sub">Your clients expect the best. So do we.</p>
            <Link href="mailto:createwithshaikh@gmail.com" className="pg-cta">
              <span className="fill" /><span>Partner With Us →</span>
            </Link>
          </div>
          <div className="ph-horizon">
            <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" style={{width:"100%",height:"100%",overflow:"visible"}} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="agPG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b2500" stopOpacity="1"/>
                  <stop offset="18%" stopColor="#3d1000" stopOpacity="1"/>
                  <stop offset="55%" stopColor="#0d0500" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#000" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="agAG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c00" stopOpacity="0"/>
                  <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="0"/>
                </linearGradient>
                <filter id="agGlow" x="-20%" y="-200%" width="140%" height="500%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="agAGlow" x="-5%" y="-300%" width="110%" height="700%">
                  <feGaussianBlur stdDeviation="10"/>
                </filter>
              </defs>
              <path d="M-100,120 Q720,-60 1540,120 L1540,500 L-100,500 Z" fill="url(#agPG)"/>
              <path d="M-100,120 Q720,-60 1540,120 L1540,80 Q720,-100 -100,80 Z" fill="url(#agAG)" filter="url(#agAGlow)" opacity="0.9"/>
              <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,140,0,0.9)" strokeWidth="2.5" filter="url(#agGlow)"/>
              <path d="M-100,120 Q720,-60 1540,120" fill="none" stroke="rgba(255,120,0,0.25)" strokeWidth="18" filter="url(#agAGlow)"/>
            </svg>
          </div>
        </section>

        <section className="wy">
          <p className="sec-label">Why Agencies Choose Us</p>
          <div className="wy-grid">
            {REASONS.map((r, i) => (
              <div key={i} className="wy-card">
                <div className="wy-label">{r.label}</div>
                <div className="wy-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pp">
          <p className="sec-label">We Solve This</p>
          <div className="pp-grid">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="pp-card">
                <div className="pp-q">{p.q}</div>
                <div className="pp-a">{p.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="sv">
          <p className="sec-label">What We Deliver</p>
          <div className="sv-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="sv-card">
                <div className="sv-num">{s.n}</div>
                <div className="sv-name">{s.name}</div>
                <div className="sv-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bc">
          <h2 className="bc-headline">Let&apos;s Build<br />Together</h2>
          <p className="bc-sub">Worried about delayed submissions? That stops here.</p>
          <Link href="mailto:createwithshaikh@gmail.com" className="pg-cta">
            <span className="fill" /><span>Start the Conversation →</span>
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
