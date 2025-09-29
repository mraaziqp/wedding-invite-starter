// src/GuestbookCard.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

function GuestbookCard() {
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, []);

  const handleGuestbook = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "guestbook"), {
        message,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error signing guestbook: ", error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-bold text-pink-700 mb-4">Guestbook 💌</h2>
      <form onSubmit={handleGuestbook} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
          rows="2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg shadow hover:bg-pink-600"
        >
          {loading ? "Submitting..." : "Sign Guestbook"}
        </button>
      </form>

      {/* Live feed */}
      <div className="mt-4 max-h-48 overflow-y-auto space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="p-2 bg-pink-50 rounded shadow-sm text-gray-700 italic">
            "{entry.message}"
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default GuestbookCard;
