// src/RevealOverlay.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RevealOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000); // reveal after 2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-gradient-to-b from-rose-200 via-pink-300 to-rose-200 flex items-center justify-center z-50"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            💍 Welcome
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RevealOverlay;
