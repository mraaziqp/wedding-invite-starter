// src/PredictionsCard.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

function PredictionsCard() {
  const [prediction, setPrediction] = useState("");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "predictions"), orderBy("likes", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPredictions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handlePrediction = async (e) => {
    e.preventDefault();
    if (!prediction.trim()) return;

    try {
      await addDoc(collection(db, "predictions"), {
        prediction,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setPrediction("");
      toast.success("Prediction added 🔮");
    } catch (error) {
      console.error("Error saving prediction: ", error);
      toast.error("Oops! Could not save prediction 😢");
    }
  };

  const handleLike = async (id) => {
    try {
      const ref = doc(db, "predictions", id);
      await updateDoc(ref, { likes: increment(1) });
    } catch (error) {
      console.error("Error liking prediction: ", error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border-4 border-pink-100"
    >
      <h2 className="text-2xl font-bold text-pink-700 mb-4">Predictions 🔮</h2>
      <form onSubmit={handlePrediction} className="space-y-3">
        <input
          type="text"
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          placeholder="Will the groom make it on time? 👀"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg shadow hover:bg-pink-600"
        >
          Submit Prediction
        </button>
      </form>

      {/* Leaderboard */}
      <div className="mt-4 max-h-56 overflow-y-auto space-y-3">
        {predictions.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center p-3 bg-pink-50 rounded-lg shadow"
          >
            <span className="text-gray-800">{p.prediction}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLike(p.id)}
                className="text-pink-600 hover:text-pink-800 transition"
              >
                ❤️
              </button>
              <span className="text-sm text-gray-700">{p.likes || 0}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PredictionsCard;
