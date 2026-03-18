"use client";

export type HeroBgType =
  | "orbs" | "aurora" | "stars" | "matrix" | "waves"
  | "nebula" | "mesh" | "bokeh" | "geometric" | "synthwave" | "custom";

interface Props {
  type: HeroBgType;
  customHtml?: string;
  blur?: boolean;
}

const KEYFRAMES = `
@keyframes orb-float-1 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(25px, -20px) scale(1.1); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}
@keyframes orb-float-2 {
  0%, 100% { transform: translate(0px, 0px) scale(1.05); }
  33% { transform: translate(-20px, 18px) scale(0.9); }
  66% { transform: translate(20px, -10px) scale(1.15); }
}
@keyframes orb-float-3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.4); }
}
@keyframes aurora-drift-1 {
  0%, 100% { transform: translateX(0%) scaleY(1); opacity: 0.6; }
  50% { transform: translateX(12%) scaleY(1.5); opacity: 0.9; }
}
@keyframes aurora-drift-2 {
  0%, 100% { transform: translateX(8%) scaleY(1.2); opacity: 0.5; }
  50% { transform: translateX(-12%) scaleY(0.7); opacity: 0.85; }
}
@keyframes aurora-drift-3 {
  0%, 100% { transform: translateX(-6%); opacity: 0.4; }
  50% { transform: translateX(10%); opacity: 0.65; }
}
@keyframes star-twinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 1; transform: scale(2); }
}
@keyframes matrix-fall {
  0% { transform: translateY(-110%); opacity: 1; }
  80% { opacity: 0.7; }
  100% { transform: translateY(110vh); opacity: 0; }
}
@keyframes wave-expand {
  0% { transform: scale(0.3); opacity: 0.8; }
  100% { transform: scale(6); opacity: 0; }
}
@keyframes nebula-breathe {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 0.7; }
}
@keyframes mesh-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes bokeh-rise {
  0% { transform: translateY(110vh) scale(0.4); opacity: 0; }
  10% { opacity: 0.9; }
  85% { opacity: 0.3; }
  100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
}
@keyframes geo-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes synth-grid-scroll {
  0%   { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 0 0, 0 -80px, 0 0; }
}
`;

// Deterministic positions — stable on SSR and client
const STARS = Array.from({ length: 60 }, (_, i) => ({
  left: (i * 73 + 17) % 100,
  top: (i * 47 + 31) % 100,
  delay: ((i * 0.37) % 3).toFixed(2),
  size: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  duration: 2 + (i % 3),
}));

const BOKEH = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 67 + 11) % 88) + 6,
  size: 30 + (i * 29 % 60),
  delay: ((i * 0.9) % 7).toFixed(2),
  duration: 8 + (i % 5),
  color: i % 3 === 0 ? "rgba(192,38,211,0.25)" : i % 3 === 1 ? "rgba(37,99,235,0.2)" : "rgba(124,58,237,0.22)",
}));

const MATRIX_CHARS = "01アイウエオ10ABCDEF01".split("");

// ─── Sub-backgrounds ──────────────────────────────────────────────

function OrbsBg() {
  return (
    <>
      {/* Dark base */}
      <div className="absolute inset-0" style={{ background: "#04031a" }} />
      {/* Magenta orb — top right */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ top: "-15%", right: "-8%", width: 700, height: 700, background: "radial-gradient(circle at 40% 40%, rgba(192,38,211,0.85) 0%, rgba(192,38,211,0.4) 35%, transparent 65%)", filter: "blur(70px)", animation: "orb-float-1 12s ease-in-out infinite", opacity: 0.75 }} />
      {/* Blue orb — bottom left */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ bottom: "-15%", left: "-8%", width: 620, height: 620, background: "radial-gradient(circle at 60% 60%, rgba(37,99,235,0.85) 0%, rgba(37,99,235,0.4) 35%, transparent 65%)", filter: "blur(70px)", animation: "orb-float-2 15s ease-in-out infinite", opacity: 0.65 }} />
      {/* Purple orb — center */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ top: "50%", left: "50%", width: 480, height: 480, marginLeft: -240, marginTop: -240, background: "radial-gradient(circle, rgba(124,58,237,0.9) 0%, rgba(124,58,237,0.4) 40%, transparent 65%)", filter: "blur(80px)", animation: "orb-float-3 9s ease-in-out infinite", opacity: 0.45 }} />
    </>
  );
}

function AuroraBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #05030f 0%, #130828 55%, #050c1e 100%)" }} />
      <div className="absolute pointer-events-none" style={{ width: "220%", height: 300, top: "18%", left: "-10%", background: "linear-gradient(to right, transparent 0%, rgba(192,38,211,0.6) 18%, rgba(124,58,237,0.7) 40%, rgba(37,99,235,0.6) 62%, rgba(16,185,129,0.4) 82%, transparent 100%)", filter: "blur(50px)", animation: "aurora-drift-1 9s ease-in-out infinite" }} />
      <div className="absolute pointer-events-none" style={{ width: "220%", height: 240, top: "32%", left: "-10%", background: "linear-gradient(to right, transparent 0%, rgba(37,99,235,0.65) 28%, rgba(192,38,211,0.55) 55%, rgba(124,58,237,0.45) 76%, transparent 100%)", filter: "blur(60px)", animation: "aurora-drift-2 11s ease-in-out infinite" }} />
      <div className="absolute pointer-events-none" style={{ width: "220%", height: 200, top: "47%", left: "-10%", background: "linear-gradient(to right, transparent 0%, rgba(16,185,129,0.4) 22%, rgba(37,99,235,0.55) 50%, rgba(192,38,211,0.4) 72%, transparent 100%)", filter: "blur(70px)", animation: "aurora-drift-3 13s ease-in-out infinite" }} />
    </>
  );
}

function StarsBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#020210" }} />
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animation: `star-twinkle ${s.duration}s ease-in-out infinite ${s.delay}s` }} />
      ))}
      {/* Nebula glow */}
      <div className="absolute pointer-events-none" style={{ top: "25%", left: "10%", width: "80%", height: "45%", background: "linear-gradient(45deg, rgba(192,38,211,0.15), rgba(37,99,235,0.12), rgba(124,58,237,0.15))", filter: "blur(80px)", borderRadius: "50%", transform: "rotate(-15deg)" }} />
    </>
  );
}

function MatrixBg() {
  const columns = Array.from({ length: 20 }, (_, i) => i);
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#010210" }} />
      {columns.map((col) => {
        const hue = col % 3;
        const color = hue === 0 ? "rgba(192,38,211,0.9)" : hue === 1 ? "rgba(37,99,235,0.9)" : "rgba(124,58,237,0.8)";
        return (
          <div key={col} className="absolute top-0 bottom-0 overflow-hidden pointer-events-none"
            style={{ left: `${(col + 0.5) * (100 / 20)}%`, width: 20, transform: "translateX(-50%)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, color, lineHeight: 1.6, animation: `matrix-fall ${3 + (col % 5) * 0.7}s linear infinite`, animationDelay: `${(col * 0.38) % 3}s` }}>
              {MATRIX_CHARS.map((c, j) => (
                <span key={j} style={{ display: "block", textAlign: "center", opacity: Math.max(0.04, 1 - j * 0.04) }}>{c}</span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function WavesBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, #1c0538 0%, #040510 65%)" }} />
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", width: 160, height: 160, marginLeft: -80, marginTop: -80, border: `1.5px solid ${i % 2 === 0 ? "rgba(192,38,211,0.75)" : "rgba(37,99,235,0.7)"}`, animation: "wave-expand 5.5s ease-out infinite", animationDelay: `${i * 0.78}s` }} />
      ))}
      <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", width: 20, height: 20, marginLeft: -10, marginTop: -10, borderRadius: "50%", background: "rgba(192,38,211,1)", boxShadow: "0 0 40px 12px rgba(192,38,211,0.6)" }} />
    </>
  );
}

function NebulaBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#030415" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ top: "-10%", left: "-6%", width: 560, height: 500, background: "radial-gradient(circle, rgba(192,38,211,0.8) 0%, rgba(192,38,211,0.25) 45%, transparent 70%)", filter: "blur(70px)", animation: "nebula-breathe 7s ease-in-out infinite" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ top: "22%", right: "-10%", width: 620, height: 420, background: "radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(37,99,235,0.25) 45%, transparent 70%)", filter: "blur(80px)", animation: "nebula-breathe 9s ease-in-out infinite 2s" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ bottom: "-12%", left: "26%", width: 460, height: 460, background: "radial-gradient(circle, rgba(124,58,237,0.85) 0%, rgba(124,58,237,0.25) 45%, transparent 70%)", filter: "blur(85px)", animation: "nebula-breathe 11s ease-in-out infinite 4s" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ top: "20%", left: "38%", width: 300, height: 280, background: "radial-gradient(circle, rgba(6,182,212,0.55) 0%, transparent 70%)", filter: "blur(60px)", animation: "nebula-breathe 6s ease-in-out infinite 1s" }} />
    </>
  );
}

function MeshBg() {
  return (
    <div className="absolute inset-0"
      style={{ background: "linear-gradient(45deg, #1e0645, #050c38, #120540, #260c50, #060d2a, #1e0645)", backgroundSize: "500% 500%", animation: "mesh-flow 8s ease-in-out infinite" }} />
  );
}

function BokehBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#020312" }} />
      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${b.left}%`, bottom: 0, width: b.size, height: b.size, background: b.color, filter: `blur(${Math.round(b.size * 0.3)}px)`, animation: `bokeh-rise ${b.duration}s ease-in-out infinite ${b.delay}s` }} />
      ))}
    </>
  );
}

function GeometricBg() {
  const shapes = [
    { size: 280, borderColor: "rgba(192,38,211,0.45)", radius: "28%", dur: 18, rev: false },
    { size: 450, borderColor: "rgba(37,99,235,0.32)", radius: "0%",  dur: 28, rev: true  },
    { size: 620, borderColor: "rgba(124,58,237,0.22)", radius: "28%", dur: 42, rev: false },
    { size: 800, borderColor: "rgba(192,38,211,0.12)", radius: "0%",  dur: 60, rev: true  },
  ];
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#030420" }} />
      <div className="absolute" style={{ top: "50%", left: "50%" }}>
        {shapes.map((s, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ width: s.size, height: s.size, marginLeft: -s.size / 2, marginTop: -s.size / 2, border: `1.5px solid ${s.borderColor}`, borderRadius: s.radius, animation: `geo-spin ${s.dur}s linear infinite${s.rev ? " reverse" : ""}` }} />
        ))}
      </div>
      {/* Center glow */}
      <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: "50%", background: "rgba(192,38,211,1)", boxShadow: "0 0 30px 10px rgba(192,38,211,0.5), 0 0 80px 20px rgba(124,58,237,0.3)" }} />
    </>
  );
}

function SynthwaveBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #030015 0%, #1a0030 45%, #030015 100%)" }} />
      {/* Sun */}
      <div className="absolute pointer-events-none" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: 180, height: 180, borderRadius: "50%", background: "linear-gradient(to bottom, rgba(255,120,0,0.6) 0%, rgba(192,38,211,0.7) 55%, transparent 100%)", filter: "blur(8px)", boxShadow: "0 0 80px rgba(192,38,211,0.5)" }} />
      {/* Horizontal glow line */}
      <div className="absolute pointer-events-none" style={{ bottom: "38%", left: 0, right: 0, height: 3, background: "linear-gradient(to right, transparent, rgba(192,38,211,1), rgba(37,99,235,1), transparent)", boxShadow: "0 0 20px rgba(192,38,211,0.8)" }} />
      {/* Scrolling perspective grid */}
      <div className="absolute pointer-events-none overflow-hidden" style={{ bottom: 0, left: 0, right: 0, height: "40%", backgroundImage: "linear-gradient(rgba(192,38,211,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(192,38,211,0.35) 1px, transparent 1px)", backgroundSize: "100% 80px, 80px 100%", animation: "synth-grid-scroll 1.5s linear infinite", transform: "perspective(280px) rotateX(40deg)", transformOrigin: "bottom center", opacity: 0.7 }} />
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────

export default function HeroBackground({ type, customHtml, blur }: Props) {
  if (type === "custom" && customHtml) {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={blur ? { filter: "blur(8px)" } : undefined}
        dangerouslySetInnerHTML={{ __html: customHtml }}
      />
    );
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="absolute inset-0 overflow-hidden" style={blur ? { filter: "blur(8px)" } : undefined}>
        {type === "orbs"      && <OrbsBg />}
        {type === "aurora"    && <AuroraBg />}
        {type === "stars"     && <StarsBg />}
        {type === "matrix"    && <MatrixBg />}
        {type === "waves"     && <WavesBg />}
        {type === "nebula"    && <NebulaBg />}
        {type === "mesh"      && <MeshBg />}
        {type === "bokeh"     && <BokehBg />}
        {type === "geometric" && <GeometricBg />}
        {type === "synthwave" && <SynthwaveBg />}
      </div>
    </>
  );
}
