import React from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { motion } from "framer-motion";

// Import videos
import ringVideo from "./assets/ring-animation.mp4";
import flowersVideo from "./assets/flowers.mp4";

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col items-center py-12 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Background Videos */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
      >
        <source src={flowersVideo} type="video/mp4" />
      </video>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-10 right-10 w-1/3 lg:w-1/4 opacity-30 z-0 rounded-xl shadow-lg"
      >
        <source src={ringVideo} type="video/mp4" />
      </video>

      {/* Floating Sparkles */}
      <motion.div
        className="absolute top-20 left-10 text-2xl z-10"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-40 right-12 text-3xl z-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        💍
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-1/3 text-2xl z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        🌸
      </motion.div>

      {/* Header */}
      <header className="mb-10 text-center relative z-10">
        <h1 className="text-4xl font-extrabold text-pink-700 drop-shadow-lg">
          💍 Our Engagement Celebration
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Join us for a day of love, laughter, and memories ✨
        </p>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl w-full px-6 relative z-10">
        {/* RSVP Section */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">RSVP</h2>
            <form className="flex flex-col gap-3">
              <Input placeholder="Your Full Name" />
              <Input placeholder="Your Email" type="email" />
              <Textarea placeholder="Leave a note for us ✨" />
              <Button type="submit" className="mt-3">
                Submit RSVP
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Guestbook */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Guestbook</h2>
            <p className="text-gray-500 mb-4">
              Share your wishes, blessings, or funny memories 💌
            </p>
            <Textarea placeholder="Write your message here..." />
            <Button className="mt-3">Sign Guestbook</Button>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Photo Upload</h2>
            <p className="text-gray-500 mb-4">
              Upload your favorite moments 📸
            </p>
            <Input type="file" accept="image/*" />
            <Button className="mt-3">Upload</Button>
          </CardContent>
        </Card>

        {/* Predictions / Fun Game */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Predictions</h2>
            <p className="text-gray-500 mb-4">
              Guess fun things about the day 💫
            </p>
            <Input placeholder="Your Prediction" />
            <Button className="mt-3">Submit Prediction</Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400 relative z-10">
        Made with ❤️ for our special day
      </footer>
    </div>
  );
}
