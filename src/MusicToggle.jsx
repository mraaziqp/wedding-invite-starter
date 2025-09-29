// src/MusicToggle.jsx
import React, { useRef, useState } from "react";

function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop>
        <source src="/romantic-bg.mp3" type="audio/mp3" />
      </audio>
      <button
        onClick={toggleMusic}
        className="bg-white/70 backdrop-blur-lg rounded-full p-3 shadow hover:scale-110 transition"
      >
        {playing ? "⏸️" : "🎶"}
      </button>
    </div>
  );
}

export default MusicToggle;
