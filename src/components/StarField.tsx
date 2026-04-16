"use client";
import { useEffect, useRef } from "react";

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

export default function StarField() {
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const s3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (s1.current) buildStarField(s1.current, 700, "255,230,200", 1);
    if (s2.current) buildStarField(s2.current, 200, "255,240,210", 1.5);
    if (s3.current) buildStarField(s3.current, 80, "255,248,230", 2);
  }, []);

  return (
    <>
      <style>{`
        .sf-wrap {
          position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;
        }
        .sf-inner {
          position:absolute;top:50%;left:50%;
          width:220vmax;height:220vmax;
          margin-left:-110vmax;margin-top:-110vmax;
          clip-path:ellipse(50% 45% at 50% 30%);
        }
        .sf-layer { position:absolute;inset:0;animation:sfTwinkle 4s ease-in-out infinite alternate; }
        .sf-layer:nth-child(2) { animation-duration:5.5s;animation-direction:alternate-reverse; }
        .sf-layer:nth-child(3) { animation-duration:3.5s; }
        @keyframes sfTwinkle { from{opacity:1;} to{opacity:0.5;} }
      `}</style>
      <div className="sf-wrap">
        <div className="sf-inner">
          <div className="sf-layer" ref={s1} />
          <div className="sf-layer" ref={s2} />
          <div className="sf-layer" ref={s3} />
        </div>
      </div>
    </>
  );
}
