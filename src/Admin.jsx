// src/Admin.jsx
import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, storage } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rsvps, setRsvps] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [photos, setPhotos] = useState([]);

  const auth = getAuth();

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      fetchData();
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const fetchData = async () => {
    const rsvpSnap = await getDocs(collection(db, "rsvps"));
    setRsvps(rsvpSnap.docs.map((doc) => doc.data()));

    const guestbookSnap = await getDocs(collection(db, "guestbook"));
    setGuestbook(guestbookSnap.docs.map((doc) => doc.data()));

    const predictionSnap = await getDocs(collection(db, "predictions"));
    setPredictions(predictionSnap.docs.map((doc) => doc.data()));

    const photoList = await listAll(ref(storage, "uploads/"));
    const urls = await Promise.all(photoList.items.map((item) => getDownloadURL(item)));
    setPhotos(urls);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-rose-100">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-pink-100 max-w-md w-full text-center"
        >
          <h2 className="text-3xl font-bold text-pink-700 mb-6">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mb-3 border rounded-lg w-full focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mb-4 border rounded-lg w-full focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={login}
            className="bg-pink-600 text-white w-full py-3 rounded-lg shadow hover:bg-pink-700 transition"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-pink-700">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RSVP Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-pink-100"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">RSVPs 📩</h2>
          <ul className="space-y-2">
            {rsvps.map((r, i) => (
              <li key={i} className="border-b pb-2 text-gray-700">
                <strong>{r.name}</strong> – {r.email}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Guestbook Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-pink-100"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Guestbook 💌</h2>
          <ul className="space-y-2">
            {guestbook.map((g, i) => (
              <li key={i} className="italic text-gray-700">
                "{g.message}"
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-pink-100"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Predictions 🔮</h2>
          <ul className="space-y-2">
            {predictions.map((p, i) => (
              <li key={i} className="text-gray-700">👉 {p.prediction}</li>
            ))}
          </ul>
        </motion.div>

        {/* Photos Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-pink-100"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Uploaded Photos 📸</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Guest Upload"
                className="rounded-lg shadow-md hover:scale-105 transition"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
