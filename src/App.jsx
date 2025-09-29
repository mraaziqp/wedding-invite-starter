// src/App.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// Sounds
import clickSoundFile from "./assets/sounds/click.mp3";
import backgroundMusicFile from "./assets/sounds/music.mp3";

// Background
import ringsVideo from "./assets/rings-video.mp4";
import sparklesVideo from "./assets/sparkles-video.mp4";

// Cards
import PhotoUploadCard from "./PhotoUploadCard";
import PredictionsCard from "./PredictionsCard";

const App = () => {
  const [musicOn, setMusicOn] = useState(false);

  // RSVP state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpNote, setRsvpNote] = useState("");

  // Guestbook state
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [guestbookEntries, setGuestbookEntries] = useState([]);

  // Audio
  const clickSound = new Audio(clickSoundFile);
  const backgroundMusic = new Audio(backgroundMusicFile);
  backgroundMusic.loop = true;

  const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  const toggleMusic = () => {
    playClick();
    if (musicOn) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }
    setMusicOn(!musicOn);
  };

  // RSVP submit
  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!rsvpName || !rsvpEmail) {
      toast.error("Please fill in your name and email ✨");
      return;
    }

    try {
      await addDoc(collection(db, "rsvps"), {
        name: rsvpName,
        email: rsvpEmail,
        note: rsvpNote,
        createdAt: serverTimestamp(),
      });
      toast.success("Thank you for your RSVP 💖");
      setRsvpName("");
      setRsvpEmail("");
      setRsvpNote("");
    } catch (error) {
      console.error("RSVP error:", error);
      toast.error("Oops! Something went wrong 😢");
    }
  };

  // Guestbook submit
  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!guestbookMessage) {
      toast.error("Please write a message 💌");
      return;
    }

    try {
      await addDoc(collection(db, "guestbook"), {
        message: guestbookMessage,
        createdAt: serverTimestamp(),
      });
      toast.success("Your message was added 💖");
      setGuestbookMessage("");
    } catch (error) {
      console.error("Guestbook error:", error);
      toast.error("Oops! Could not save your message 😢");
    }
  };

  // Live Guestbook listener
  useEffect(() => {
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGuestbookEntries(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100">
      <Toaster position="top-center" />

      {/* Background videos */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <source src={sparklesVideo} type="video/mp4" />
      </motion.video>

      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute bottom-0 right-0 w-1/3 rounded-2xl opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <source src={ringsVideo} type="video/mp4" />
      </motion.video>

      {/* Header */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-pink-700 drop-shadow-lg flex items-center gap-2"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        💍 Our Engagement Celebration
      </motion.h1>
      <motion.p
        className="text-lg text-pink-600 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Join us for a day of love, laughter, and unforgettable memories ✨
      </motion.p>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 z-10 w-full max-w-6xl px-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {/* RSVP */}
        <motion.div
          className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">RSVP 📅</h2>
          <form onSubmit={handleRSVPSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Full Name"
              value={rsvpName}
              onChange={(e) => setRsvpName(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={rsvpEmail}
              onChange={(e) => setRsvpEmail(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <textarea
              placeholder="Leave a note for us ✨"
              value={rsvpNote}
              onChange={(e) => setRsvpNote(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Submit RSVP
            </button>
          </form>
        </motion.div>

        {/* Guestbook */}
        <motion.div
          className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">
            Guestbook 💌
          </h2>
          <form onSubmit={handleGuestbookSubmit} className="flex flex-col gap-3">
            <textarea
              placeholder="Write your message..."
              value={guestbookMessage}
              onChange={(e) => setGuestbookMessage(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Sign Guestbook
            </button>
          </form>
          <div className="mt-4 text-left max-h-40 overflow-y-auto">
            <AnimatePresence>
              {guestbookEntries.length > 0 ? (
                guestbookEntries.map((entry, i) => (
                  <motion.p
                    key={i}
                    className="text-sm text-pink-700 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {entry.message}
                  </motion.p>
                ))
              ) : (
                <p className="text-sm text-gray-500">No messages yet ✨</p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Photo Upload */}
        <PhotoUploadCard />

        {/* Predictions */}
        <PredictionsCard />
      </motion.div>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg transition"
      >
        {musicOn ? "🔊" : "🔈"}
      </button>
    </div>
  );
};

export default App;
