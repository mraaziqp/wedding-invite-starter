import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db, storage } from "./firebase";
import {
  ref,
  set,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Example guest list
const guestList = {
  ENG001: "Ayesha Khan",
  ENG002: "Mohamed Patel",
  ENG003: "Fatima Ismail",
  ENG004: "Yusuf Rahman",
};

// Admin access
const ADMIN_CODE = "ENG-ADMIN-2025";

// Engagement date
const EVENT_DATE = new Date("2025-11-30T18:00:00");

export default function App() {
  const [step, setStep] = useState("landing");
  const [guestCode, setGuestCode] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvp, setRsvp] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoUploads, setPhotoUploads] = useState([]);
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    onValue(ref(db, "predictions"), (snapshot) => {
      const data = snapshot.val();
      if (data) setPredictions(Object.values(data));
    });
    onValue(ref(db, "photos"), (snapshot) => {
      const data = snapshot.val();
      if (data) setPhotoUploads(Object.entries(data));
    });
    onValue(ref(db, "leaderboard"), (snapshot) => {
      const data = snapshot.val();
      if (data) setLeaderboard(data);
    });
    onValue(ref(db, "guestbook"), (snapshot) => {
      const data = snapshot.val();
      if (data) setGuestbookEntries(Object.entries(data));
    });
    onValue(ref(db, "rsvps"), (snapshot) => {
      const data = snapshot.val();
      if (data) setRsvps(Object.entries(data));
    });

    const timer = setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  function getTimeRemaining() {
    const now = new Date();
    const total = EVENT_DATE - now;
    return {
      total,
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  }

  // RSVP
  const handleRsvp = (status) => {
    setRsvp(status);
    set(ref(db, `rsvps/${guestCode}`), { name, status });
    setStep("dashboard");
  };

  // Photo upload
  const handlePhotoUpload = async () => {
    if (!photo) return;
    const fileRef = storageRef(storage, `photos/${Date.now()}_${photo.name}`);
    await uploadBytes(fileRef, photo);
    const photoUrl = await getDownloadURL(fileRef);
    push(ref(db, "photos"), { name, url: photoUrl });
    setPhoto(null);
  };

  // Guestbook
  const handleGuestbookSubmit = () => {
    if (!guestbookMessage.trim()) return;
    push(ref(db, "guestbook"), {
      name,
      message: guestbookMessage.trim(),
      timestamp: Date.now(),
    });
    setGuestbookMessage("");
  };

  // Export
  const exportData = () => {
    const data = {
      rsvps: rsvps.map(([id, entry]) => ({ id, ...entry })),
      predictions,
      leaderboard,
      guestbook: guestbookEntries.map(([id, entry]) => ({ id, ...entry })),
      photos: photoUploads.map(([id, p]) => ({ id, ...p })),
    };

    const csvRows = [];
    for (const [key, value] of Object.entries(data)) {
      csvRows.push(`\\n=== ${key.toUpperCase()} ===`);
      if (Array.isArray(value)) {
        value.forEach((item) => csvRows.push(Object.values(item).join(",")));
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => csvRows.push(`${k}, ${v}`));
      }
    }

    const blob = new Blob([csvRows.join("\\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      {/* Elegant looping background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/assets/background-sparkles.mp4" type="video/mp4" />
      </video>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center p-6">
        {step === "landing" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-32 h-32 mx-auto mb-4"
            >
              <source src="/assets/rings-animation.mp4" type="video/mp4" />
            </video>
            <h1 className="text-4xl font-serif text-gray-800 mb-4">
              You’re Invited ✨
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Join us in celebrating our engagement.
            </p>
            <div className="text-2xl font-mono text-amber-700 mb-8">
              {timeLeft.total > 0 ? (
                <span>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                  {timeLeft.seconds}s
                </span>
              ) : (
                <span>🎉 It’s time to celebrate!</span>
              )}
            </div>
            <Button
              onClick={() => setStep("code")}
              className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-3 rounded-2xl shadow-md"
            >
              Enter Invite Code
            </Button>
          </motion.div>
        )}

        {step === "code" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardContent className="space-y-4">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">
                  Enter Your Code
                </h2>
                <Input
                  type="text"
                  placeholder="Invitation Code"
                  value={guestCode}
                  onChange={(e) => setGuestCode(e.target.value)}
                  className="border-gray-300"
                />
                <Button
                  onClick={() => {
                    if (guestCode === ADMIN_CODE) {
                      setIsAdmin(true);
                      setStep("dashboard");
                    } else if (guestList[guestCode]) {
                      setName(guestList[guestCode]);
                      setStep("rsvp");
                    } else alert("Invalid code. Please try again.");
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "rsvp" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white shadow-xl rounded-2xl p-6">
              <CardContent className="space-y-4">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">
                  RSVP for {name}
                </h2>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleRsvp(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRsvp(false)}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2"
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Admin dashboard & features would continue here (Predictions, Guestbook, Gallery) */}
      </div>
    </div>
  );
}
