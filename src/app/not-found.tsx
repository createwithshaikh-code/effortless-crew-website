import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-300">
      {/* Base bg */}
      <div className="absolute inset-0 section-bg-1" />

      {/* Glow blobs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        {/* 404 number */}
        <p className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter select-none"
          style={{
            background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: 0.18,
          }}
        >
          404
        </p>

        <div className="-mt-8 sm:-mt-12 mb-6">
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-white/45 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Looks like this page drifted out of orbit.{" "}
            Let&apos;s get you back to the crew.
          </p>
        </div>

        <div className="flex flex-row items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #C026D3 0%, #2563EB 100%)",
              boxShadow: "0 0 24px rgba(192,38,211,0.3)",
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
