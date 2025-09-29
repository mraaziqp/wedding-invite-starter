import React, { useState } from "react";
import { motion } from "framer-motion";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function RSVPCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRSVP = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "rsvps"), {
        name,
        email,
        note,
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving RSVP:", error);
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-pink-100 hover:scale-105 hover:shadow-2xl transition-all"
    >
      <h2 className="text-2xl font-bold text-pink-600 mb-4">RSVP 📩</h2>
      {submitted ? (
        <p className="text-green-600 font-medium">
          Thank you! Your RSVP has been recorded 🎉
        </p>
      ) : (
        <form onSubmit={handleRSVP} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Full Name"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Leave a note for us ✨"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg shadow transition-all"
          >
            Submit RSVP
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default RSVPCard;
