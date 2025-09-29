// src/PhotoUploadCard.jsx
import React, { useState, useEffect } from "react";
import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

function PhotoUploadCard() {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Upload photo
  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file 📸");
      return;
    }

    const fileRef = ref(storage, `photos/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        toast.error("Upload failed 😢");
      },
      async () => {
        const url = await getDownloadURL(fileRef);
        setPhotos((prev) => [url, ...prev]);
        toast.success("Photo uploaded 🎉");
        setFile(null);
      }
    );
  };

  // Load existing photos
  useEffect(() => {
    const listRef = ref(storage, "photos/");
    listAll(listRef)
      .then(async (res) => {
        const urls = await Promise.all(
          res.items.map((item) => getDownloadURL(item))
        );
        setPhotos(urls.reverse()); // latest first
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <motion.div
      className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg backdrop-blur-md"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-2xl font-semibold text-pink-700 mb-4">
        Share Your Photos 📸
      </h2>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleUpload}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
        >
          Upload
        </button>
      </div>

      {/* Gallery */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
        {photos.map((url, i) => (
          <motion.img
            key={i}
            src={url}
            alt="Guest upload"
            className="rounded-lg shadow-md cursor-pointer hover:scale-105 transition object-cover"
            onClick={() => setSelectedPhoto(url)}
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img
              src={selectedPhoto}
              alt="Enlarged"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PhotoUploadCard;
