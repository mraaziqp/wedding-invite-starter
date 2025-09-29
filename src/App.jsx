// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

import ringVideo from "./assets/rings-video.mp4";
import sparklesVideo from "./assets/sparkles-video.mp4";
import bgMusic from "./assets/music.mp3";

function App() {
  const [started, setStarted] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);

  const [rsvp, setRsvp] = useState({ name: "", email: "", note: "" });
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [photos, setPhotos] = useState([]);

  const audioRef = useRef(null);
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  useEffect(() => {
    const unsubGuestbook = onSnapshot(
      query(collection(db, "guestbook"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setGuestbookEntries(snapshot.docs.map((doc) => doc.data()));
      }
    );

    const unsubPredictions = onSnapshot(
      query(collection(db, "predictions"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPredictions(snapshot.docs.map((doc) => doc.data()));
      }
    );

    const listRef = ref(storage, "photos/");
    listAll(listRef).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) =>
          setPhotos((prev) => [...prev, url])
        );
      });
    });

    return () => {
      unsubGuestbook();
      unsubPredictions();
    };
  }, []);

  const handleStart = () => {
    setCurtainOpen(true);
    clickSound.current.play();
    setTimeout(() => {
      setStarted(true);
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked until user interacts.");
      });
    }, 2000);
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!rsvp.name || !rsvp.email) {
      toast.error("Please enter your name and email.");
      return;
    }
    try {
      await addDoc(collection(db, "rsvp"), {
        ...rsvp,
        timestamp: serverTimestamp(),
      });
      toast.success("RSVP submitted 🎉");
      setRsvp({ name: "", email: "", note: "" });
    } catch {
      toast.error("Failed to submit RSVP.");
    }
  };

  const handleGuestbook = async (e) => {
    e.preventDefault();
    if (!guestbookMessage) return;
    try {
      await addDoc(collection(db, "guestbook"), {
        message: guestbookMessage,
        timestamp: serverTimestamp(),
      });
      toast.success("Message added 💌");
      setGuestbookMessage("");
    } catch {
      toast.error("Failed to sign guestbook.");
    }
  };

  const handlePrediction = async (e) => {
    e.preventDefault();
    if (!prediction) return;
    try {
      await addDoc(collection(db, "predictions"), {
        prediction,
        timestamp: serverTimestamp(),
      });
      toast.success("Prediction added 🔮");
      setPrediction("");
    } catch {
      toast.error("Failed to add prediction.");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, "photos/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setPhotos((prev) => [...prev, url]);
          toast.success("Photo uploaded 📸");
        });
      }
    );
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Background videos */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60 -z-20"
        src={sparklesVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-40 -z-10"
        src={ringVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Music */}
      <audio ref={audioRef} src={bgMusic} loop />

      {/* Floating Petals */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300 text-4xl select-none pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, 200],
            x: [0, Math.random() * 50 - 25],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          🌸
        </motion.div>
      ))}

      {/* Floating Golden Sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-yellow-300 text-sm select-none pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -200],
            x: [0, Math.random() * 40 - 20],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Curtain Reveal */}
      <AnimatePresence>
        {!started && (
          <>
            {!curtainOpen && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-rose-100 via-pink-200 to-rose-100"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.button
                  onClick={handleStart}
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

            {curtainOpen && (
              <>
                {/* Left Curtain */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full z-50 overflow-hidden"
                  initial={{ x: 0 }}
                  animate={{ x: "-100%" }}
                  transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-rose-200 via-pink-100 to-rose-200 relative" />
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full z-50 overflow-hidden"
                  initial={{ x: 0 }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-rose-200 via-pink-100 to-rose-200 relative" />
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {started && (
        <div className="relative z-10 flex flex-col items-center text-center text-gray-800 px-4 py-10">
          <h1 className="text-5xl font-extrabold text-pink-700 mb-4 drop-shadow-lg">
            💍 Our Engagement Celebration
          </h1>
          <p className="mb-10 text-lg text-gray-700">
            Join us for a day of love, laughter, and unforgettable memories ✨
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
            {/* RSVP */}
            <motion.div className="bg-white/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-pink-700">RSVP 📅</h2>
              <form onSubmit={handleRSVP} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full p-3 border rounded-xl"
                  value={rsvp.name}
                  onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-xl"
                  value={rsvp.email}
                  onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                />
                <textarea
                  placeholder="Leave a note for us ✨"
                  className="w-full p-3 border rounded-xl"
                  value={rsvp.note}
                  onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
                />
                <button className="w-full py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700">
                  Submit RSVP
                </button>
              </form>
            </motion.div>

            {/* Guestbook */}
            <motion.div className="bg-white/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Guestbook 💌</h2>
              <form onSubmit={handleGuestbook} className="space-y-3">
                <textarea
                  placeholder="Write your message..."
                  className="w-full p-3 border rounded-xl"
                  value={guestbookMessage}
                  onChange={(e) => setGuestbookMessage(e.target.value)}
                />
                <button className="w-full py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700">
                  Sign Guestbook
                </button>
              </form>
              <ul className="mt-4 text-left max-h-32 overflow-y-auto">
                {guestbookEntries.length === 0 && <li>No messages yet ✨</li>}
                {guestbookEntries.map((entry, i) => (
                  <li key={i} className="border-b py-1">{entry.message}</li>
                ))}
              </ul>
            </motion.div>

            {/* Photo Upload */}
            <motion.div className="bg-white/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Share Your Photos 📸</h2>
              <input type="file" onChange={handlePhotoUpload} />
              <div className="grid grid-cols-3 gap-2 mt-3 max-h-32 overflow-y-auto">
                {photos.map((url, i) => (
                  <img key={i} src={url} alt="guest upload" className="rounded-lg" />
                ))}
              </div>
            </motion.div>

            {/* Predictions */}
            <motion.div className="bg-white/70 p-6 rounded-2xl shadow-lg backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Predictions 🔮</h2>
              <form onSubmit={handlePrediction} className="space-y-3">
                <input
                  type="text"
                  placeholder="Will the groom make it on time? 👀"
                  className="w-full p-3 border rounded-xl"
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                />
                <button className="w-full py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700">
                  Submit Prediction
                </button>
              </form>
              <ul className="mt-4 text-left max-h-32 overflow-y-auto">
                {predictions.length === 0 && <li>No predictions yet ✨</li>}
                {predictions.map((p, i) => (
                  <li key={i} className="border-b py-1">{p.prediction}</li>
                ))}
              </ul>
            </motion.div>
          </div>

          <p className="mt-10 text-sm text-gray-600">
            Made with ❤️ for our special day
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
