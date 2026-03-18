"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface PlayReelButtonProps {
  reelUrl?: string;
}

export default function PlayReelButton({ reelUrl }: PlayReelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reelUrl) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group cursor-pointer"
        aria-label="Play showreel"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: "linear-gradient(135deg, #C026D3, #2563EB)" }} />

        <div className="relative w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ background: "linear-gradient(135deg, #C026D3, #2563EB)", boxShadow: "0 0 25px rgba(192,38,211,0.5)" }}>
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>

        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Watch Reel
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={reelUrl}
                autoPlay
                controls
                className="w-full h-full"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
