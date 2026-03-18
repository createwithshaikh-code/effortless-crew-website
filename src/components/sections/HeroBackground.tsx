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
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(30px,-30px) scale(1.15); }
}
@keyframes orb-float-2 {
  0%, 100% { transform: translate(0,0) scale(1.1); }
  50% { transform: translate(-20px,20px) scale(1); }
}
@keyframes orb-float-3 {
  0%, 100% { transform: translate(-50%,-50%) scale(1); }
  50% { transform: translate(-50%,-50%) scale(1.35); }
}
@keyframes aurora-drift-1 {
  0%, 100% { transform: translateX(0) scaleY(1); opacity: 0.5; }
  50% { transform: translateX(12%) scaleY(1.4); opacity: 0.85; }
}
@keyframes aurora-drift-2 {
  0%, 100% { transform: translateX(8%) scaleY(1.2); opacity: 0.4; }
  50% { transform: translateX(-12%) scaleY(0.7); opacity: 0.75; }
}
@keyframes aurora-drift-3 {
  0%, 100% { transform: translateX(-6%) scaleY(1); opacity: 0.3; }
  50% { transform: translateX(9%) scaleY(1.2); opacity: 0.55; }
}
@keyframes star-twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.8); }
}
@keyframes matrix-fall {
  0% { transform: translateY(-110%); opacity: 1; }
  80% { opacity: 0.6; }
  100% { transform: translateY(110vh); opacity: 0; }
}
@keyframes wave-expand {
  0% { transform: scale(0.4); opacity: 0.7; }
  100% { transform: scale(5.5); opacity: 0; }
}
@keyframes nebula-breathe {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.25); opacity: 0.55; }
}
@keyframes mesh-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes bokeh-rise {
  0% { transform: translateY(120vh) scale(0.4); opacity: 0; }
  10% { opacity: 0.8; }
  85% { opacity: 0.25; }
  100% { transform: translateY(-15vh) scale(1.1); opacity: 0; }
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

// Deterministic positions (no Math.random — stable across SSR/client)
const STARS = Array.from({ length: 55 }, (_, i) => ({
  left: (i * 73 + 17) % 100,
  top: (i * 47 + 31) % 100,
  delay: ((i * 0.37) % 3).toFixed(2),
  size: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  duration: 2 + (i % 3),
}));

const BOKEH = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 67 + 11) % 92) + 4,
  size: 24 + (i * 29 % 55),
  delay: ((i * 0.9) % 7).toFixed(2),
  duration: 7 + (i % 5),
  color: i % 3 === 0
    ? "rgba(192,38,211,0.18)"
    : i % 3 === 1
    ? "rgba(37,99,235,0.14)"
    : "rgba(124,58,237,0.16)",
}));

const MATRIX_CHARS = "01アイウエオ10ABCDEF01";

// ─── Sub-backgrounds ────────────────────────────────────────────────

function OrbsBg() {
  return (
    <>
      <div className="absolute top-[-15%] right-[-8%] w-[650px] h-[650px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.55) 0%, transparent 68%)", animation: "orb-float-1 12s ease-in-out infinite", opacity: 0.45 }} />
      <div className="absolute bottom-[-15%] left-[-8%] w-[580px] h-[580px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.55) 0%, transparent 68%)", animation: "orb-float-2 15s ease-in-out infinite", opacity: 0.38 }} />
      <div className="absolute top-1/2 left-1/2 w-[460px] h-[460px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.7) 0%, transparent 68%)", animation: "orb-float-3 9s ease-in-out infinite", opacity: 0.22, marginLeft: -230, marginTop: -230 }} />
    </>
  );
}

function AuroraBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #06040f 0%, #160830 55%, #060c20 100%)" }} />
      <div className="absolute w-[220%] h-[280px] top-[18%] -left-[10%]"
        style={{ background: "linear-gradient(to right, transparent 0%, rgba(192,38,211,0.45) 20%, rgba(124,58,237,0.55) 42%, rgba(37,99,235,0.45) 62%, rgba(16,185,129,0.3) 82%, transparent 100%)", filter: "blur(45px)", animation: "aurora-drift-1 9s ease-in-out infinite" }} />
      <div className="absolute w-[220%] h-[220px] top-[32%] -left-[10%]"
        style={{ background: "linear-gradient(to right, transparent 0%, rgba(37,99,235,0.5) 28%, rgba(192,38,211,0.4) 55%, rgba(124,58,237,0.35) 76%, transparent 100%)", filter: "blur(55px)", animation: "aurora-drift-2 11s ease-in-out infinite" }} />
      <div className="absolute w-[220%] h-[180px] top-[48%] -left-[10%]"
        style={{ background: "linear-gradient(to right, transparent 0%, rgba(16,185,129,0.3) 22%, rgba(37,99,235,0.4) 50%, rgba(192,38,211,0.3) 72%, transparent 100%)", filter: "blur(65px)", animation: "aurora-drift-3 13s ease-in-out infinite" }} />
    </>
  );
}

function StarsBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#030310" }} />
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animation: `star-twinkle ${s.duration}s ease-in-out infinite ${s.delay}s` }} />
      ))}
      {/* Milky way soft glow */}
      <div className="absolute top-[30%] left-[10%] w-[80%] h-[40%] opacity-10 rounded-full"
        style={{ background: "linear-gradient(45deg, rgba(192,38,211,0.3), rgba(37,99,235,0.3), rgba(124,58,237,0.3))", filter: "blur(60px)", transform: "rotate(-20deg)" }} />
    </>
  );
}

function MatrixBg() {
  const columns = Array.from({ length: 18 }, (_, i) => i);
  const chars = MATRIX_CHARS.split("");
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#020210" }} />
      {columns.map((col) => {
        const hue = col % 3;
        const color = hue === 0 ? "rgba(192,38,211,0.85)" : hue === 1 ? "rgba(37,99,235,0.85)" : "rgba(124,58,237,0.75)";
        return (
          <div key={col} className="absolute top-0 bottom-0 overflow-hidden"
            style={{ left: `${(col + 0.5) * (100 / 18)}%`, width: 22, transform: "translateX(-50%)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color, lineHeight: 1.5, animation: `matrix-fall ${3.5 + (col % 5) * 0.7}s linear infinite`, animationDelay: `${(col * 0.35) % 2.8}s` }}>
              {chars.map((c, j) => (
                <span key={j} style={{ display: "block", textAlign: "center", opacity: Math.max(0.05, 1 - j * 0.045) }}>{c}</span>
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
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, #1c0538 0%, #050510 65%)" }} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ top: "50%", left: "50%", width: 180, height: 180, marginLeft: -90, marginTop: -90, border: `1px solid ${i % 2 === 0 ? "rgba(192,38,211,0.7)" : "rgba(37,99,235,0.65)"}`, animation: "wave-expand 5s ease-out infinite", animationDelay: `${i * 0.83}s` }} />
      ))}
      <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.9) 0%, transparent 70%)", boxShadow: "0 0 30px rgba(192,38,211,0.6)" }} />
    </>
  );
}

function NebulaBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#040415" }} />
      <div className="absolute w-[500px] h-[450px] rounded-full top-[-8%] left-[-6%]"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.6) 0%, rgba(192,38,211,0.15) 50%, transparent 70%)", filter: "blur(65px)", animation: "nebula-breathe 7s ease-in-out infinite" }} />
      <div className="absolute w-[580px] h-[380px] rounded-full top-[25%] right-[-10%]"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.65) 0%, rgba(37,99,235,0.15) 50%, transparent 70%)", filter: "blur(75px)", animation: "nebula-breathe 9s ease-in-out infinite 2s" }} />
      <div className="absolute w-[420px] h-[420px] rounded-full bottom-[-12%] left-[28%]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.7) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)", filter: "blur(80px)", animation: "nebula-breathe 11s ease-in-out infinite 4s" }} />
      <div className="absolute w-[280px] h-[260px] rounded-full top-[18%] left-[38%]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)", filter: "blur(55px)", animation: "nebula-breathe 6s ease-in-out infinite 1s" }} />
    </>
  );
}

function MeshBg() {
  return (
    <div className="absolute inset-0"
      style={{ background: "linear-gradient(45deg, #1a0535, #04082e, #0e0430, #200a42, #040c25, #1a0535)", backgroundSize: "500% 500%", animation: "mesh-flow 9s ease-in-out infinite" }} />
  );
}

function BokehBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#020312" }} />
      {BOKEH.map((b, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ left: `${b.left}%`, bottom: 0, width: b.size, height: b.size, background: b.color, filter: `blur(${Math.round(b.size * 0.35)}px)`, animation: `bokeh-rise ${b.duration}s ease-in-out infinite ${b.delay}s` }} />
      ))}
    </>
  );
}

function GeometricBg() {
  const shapes = [
    { size: 300, border: "rgba(192,38,211,0.30)", radius: "30%", dur: 18, rev: false },
    { size: 460, border: "rgba(37,99,235,0.22)", radius: "0%", dur: 28, rev: true },
    { size: 620, border: "rgba(124,58,237,0.16)", radius: "30%", dur: 40, rev: false },
  ];
  return (
    <>
      <div className="absolute inset-0" style={{ background: "#040420" }} />
      <div className="absolute top-1/2 left-1/2">
        {shapes.map((s, i) => (
          <div key={i} className="absolute"
            style={{ width: s.size, height: s.size, marginLeft: -s.size / 2, marginTop: -s.size / 2, border: `1px solid ${s.border}`, borderRadius: s.radius, animation: `geo-spin ${s.dur}s linear infinite${s.rev ? " reverse" : ""}` }} />
        ))}
      </div>
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "rgba(192,38,211,0.9)", boxShadow: "0 0 20px 6px rgba(192,38,211,0.4)" }} />
    </>
  );
}

function SynthwaveBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #040015 0%, #180028 45%, #040015 100%)" }} />
      {/* Sun */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
        style={{ background: "linear-gradient(to bottom, rgba(255,100,0,0.5) 0%, rgba(192,38,211,0.6) 60%, transparent 100%)", filter: "blur(6px)", boxShadow: "0 0 60px rgba(192,38,211,0.4)" }} />
      {/* Horizon glow */}
      <div className="absolute w-full h-[3px] opacity-80"
        style={{ bottom: "38%", background: "linear-gradient(to right, transparent, rgba(192,38,211,0.9), rgba(37,99,235,0.9), transparent)" }} />
      {/* Scrolling grid */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden opacity-45"
        style={{ height: "40%", backgroundImage: "linear-gradient(rgba(192,38,211,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(192,38,211,0.3) 1px, transparent 1px)", backgroundSize: "100% 80px, 80px 100%", animation: "synth-grid-scroll 1.5s linear infinite", transform: "perspective(250px) rotateX(38deg)", transformOrigin: "bottom center" }} />
    </>
  );
}

// ─── Main export ────────────────────────────────────────────────────

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
