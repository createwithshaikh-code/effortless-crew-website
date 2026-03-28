import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Effortless Crew — AI-Powered Creative Super-Team";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#04041A",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,38,211,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.20) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 999,
            border: "1px solid rgba(192,38,211,0.4)",
            background: "rgba(192,38,211,0.10)",
            marginBottom: 32,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C026D3" }} />
          <span style={{ color: "#e879f9", fontSize: 18, fontWeight: 600 }}>
            AI-Powered Creative Super-Team
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginBottom: 24,
          }}
        >
          <span style={{ color: "white", fontSize: 80, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px" }}>
            WORK LESS.
          </span>
          <span
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              background: "linear-gradient(90deg, #C026D3, #2563EB)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            GROW FASTER.
          </span>
          <span style={{ color: "white", fontSize: 80, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px" }}>
            DOMINATE.
          </span>
        </div>

        {/* Sub */}
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, textAlign: "center", maxWidth: 600, margin: 0 }}>
          Premium video editing, YouTube automation &amp; motion graphics for creators who mean business.
        </p>

        {/* Brand name bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 24 }}>|</span>
          <span
            style={{
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 800,
              textShadow: "0 0 20px rgba(192,38,211,0.8)",
            }}
          >
            Effortless Crew
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
