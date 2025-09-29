// src/PhotoUploadCard.jsx
import React, { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

function PhotoUploadCard() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const listRef = ref(storage, "uploads/");
      const result = await listAll(listRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      setPhotos(urls.reverse()); // newest first
    };
    fetchPhotos();
  }, []);

  const handleUpload = () => {
    if (!file) return alert("⚠️ Please select a file first!");

    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => console.error(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setPhotos((prev) => [url, ...prev]); // prepend new photo
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border-4 border-pink-100"
    >
      {/* 🌸 Decorative icons */}
      <div className="absolute -top-4 -left-4 text-3xl text-pink-300">📸</div>
      <div className="absolute -top-4 -right-4 text-3xl text-pink-300">✨</div>

      <h2 className="text-2xl font-bold text-pink-700 mb-4">Photo Upload 📷</h2>

      <div className="flex gap-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleUpload}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
        >
          Upload
        </button>
      </div>
      {progress > 0 && (
        <p className="mt-2 text-gray-600 text-sm">Uploading: {Math.round(progress)}%</p>
      )}

      {/* 🖼️ Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-3 mt-4 space-y-3 max-h-56 overflow-y-auto">
        {photos.map((url, i) => (
          <motion.img
            key={i}
            src={url}
            alt="Guest Upload"
            onClick={() => setLightbox(url)}
            className="w-full rounded-lg shadow cursor-pointer hover:scale-105 transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          />
        ))}
      </div>

      {/* 🔍 Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={lightbox}
              alt="Enlarged"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PhotoUploadCard;
