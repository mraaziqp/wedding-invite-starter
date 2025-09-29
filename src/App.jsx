// src/App.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Import assets
import ringsVideo from "./assets/rings-video.mp4";
import sparklesVideo from "./assets/sparkles-video.mp4";
import musicFile from "./assets/music.mp3";
import clickSound from "./assets/button-click.mp3";

// Components
import RSVPCard from "./RSVPCard";
import GuestbookCard from "./GuestbookCard";
import PhotoUploadCard from "./PhotoUploadCard";
import PredictionsCard from "./PredictionsCard";

const App = () => {
  const [started, setStarted] = useState(false);

  const musicRef = useRef(null);
  const clickRef = useRef(null);

  // Start experience
  const handleStart = () => {
    setStarted(true);
    if (musicRef.current) {
      musicRef.current.play().catch(() => {
        toast.error("Click again to enable sound 🎶");
      });
    }
  };

  // Play button click sound
  const playClick = () => {
    if (clickRef.current) {
      clickRef.current.currentTime = 0;
      clickRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-rose-100">
      <Toaster position="top-center" />

      {/* Hidden Audio */}
      <audio ref={musicRef} loop src={musicFile} preload="auto" />
      <audio ref={clickRef} src={clickSound} preload="auto" />

      {/* Background Videos */}
      {started && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src={ringsVideo} type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
          >
            <source src={sparklesVideo} type="video/mp4" />
          </video>
        </>
      )}

      {/* Floating Petals & Sparkles */}
      {started && (
        <div className="pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                opacity: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                opacity: [0, 1, 0],
                x: `+=${Math.random() * 100 - 50}`,
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
              }}
            >
              {Math.random() > 0.5 ? "🌸" : "✨"}
            </motion.div>
          ))}
        </div>
      )}

      {/* Entry Overlay */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-200 to-rose-100 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.button
              onClick={() => {
                playClick();
                handleStart();
              }}
              className="px-8 py-4 bg-pink-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-pink-700 transition-all"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ Click to Enter ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {started && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-pink-800 mb-4 drop-shadow-lg flex items-center gap-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            💍 Our Engagement Celebration
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Join us for a day of love, laughter, and unforgettable memories ✨
          </motion.p>

          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div onClick={playClick}>
              <RSVPCard />
            </div>
            <div onClick={playClick}>
              <GuestbookCard />
            </div>
            <div onClick={playClick}>
              <PhotoUploadCard />
            </div>
            <div onClick={playClick}>
              <PredictionsCard />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-10 text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Made with ❤️ for our special day
          </motion.footer>
        </div>
      )}
    </div>
  );
};

export default App;
