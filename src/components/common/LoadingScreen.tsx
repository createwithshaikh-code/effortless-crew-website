"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem("ec-loading-shown");
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem("ec-loading-shown", "1");
      const timer = setTimeout(() => setVisible(false), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.1 } }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        >
          {/* Clapboard animation */}
          <div className="text-center">
            {/* Top clapboard part */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              transition={{ delay: 0.8, duration: 0.3, ease: "easeIn" }}
              style={{ transformOrigin: "bottom center", perspective: 400 }}
              className="w-48 h-16 bg-white/10 border border-white/20 rounded-t-lg mb-0.5 flex items-center justify-center gap-2 overflow-hidden"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full w-8 ${i % 2 === 0 ? "bg-white/80" : "bg-black/80"}`}
                  style={{ transform: `skewX(-20deg)` }}
                />
              ))}
            </motion.div>

            {/* Bottom clapboard */}
            <div className="w-48 h-24 bg-card border border-white/20 rounded-b-lg flex flex-col items-start justify-center px-4">
              <div className="text-white/30 text-xs font-mono mb-1">SCENE 01</div>
              <div className="text-white font-bold text-lg">Effortless Crew</div>
              <div className="text-xs font-mono" style={{ background: "linear-gradient(90deg, #C026D3, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LOADING...</div>
            </div>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-1.5 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #C026D3, #2563EB)" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
