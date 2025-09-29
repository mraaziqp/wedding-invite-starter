// src/App.jsx
import React from "react";
import { motion } from "framer-motion";
import RSVPCard from "./RSVPCard";
import GuestbookCard from "./GuestbookCard";
import PhotoUploadCard from "./PhotoUploadCard";
import PredictionsCard from "./PredictionsCard";
import RevealOverlay from "./RevealOverlay";
import MusicToggle from "./MusicToggle";
import ringVideo from "./assets/ring-animation.mp4";
import flowersVideo from "./assets/flowers.mp4";

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 flex flex-col items-center justify-center overflow-hidden">
      {/* 🎭 Curtain Reveal */}
      <RevealOverlay />

      {/* 🎥 Background videos */}
      <div className="absolute inset-0 z-0 opacity-25">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover scale-105 blur-sm"
        >
          <source src={flowersVideo} type="video/mp4" />
        </video>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover mix-blend-overlay"
        >
          <source src={ringVideo} type="video/mp4" />
        </video>
      </div>

      {/* 🌸 Floating petals + sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 text-2xl"
            style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%` }}
            animate={{ y: ["0%", "120vh"], rotate: [0, 360] }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {Math.random() > 0.5 ? "🌸" : "✨"}
          </motion.div>
        ))}
      </div>

      {/* 💍 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-pink-700 drop-shadow-lg text-center mt-12 z-10"
      >
        💍 Our Engagement Celebration
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl text-gray-700 mt-4 mb-12 z-10 text-center max-w-2xl"
      >
        Join us for a day of love, laughter, and unforgettable memories ✨
      </motion.p>

      {/* ✨ Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(255, 182, 193, 0.5)" }}
        >
          <RSVPCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(255, 182, 193, 0.5)" }}
        >
          <GuestbookCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(255, 182, 193, 0.5)" }}
        >
          <PhotoUploadCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(255, 182, 193, 0.5)" }}
        >
          <PredictionsCard />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-14 text-sm text-gray-600 z-10"
      >
        Made with ❤️ for our special day
      </motion.footer>

      {/* 🎶 Music Toggle */}
      <MusicToggle />
    </div>
  );
}

export default App;
