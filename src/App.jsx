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

// Admin code
const ADMIN_CODE = "ENG-ADMIN-2025";

// Event date
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

  // Firebase listeners
  useEffect(() => {
    onValue(ref(db, "predictions"), (snapshot) => {
      const data = snapshot.val();
      if (data) setPredictions(Object.entries(data));
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

  // Prediction vote
  const handleVote = (id, choice) => {
    set(ref(db, `predictions/${id}/votes/${guestCode}`), {
      name,
      choice,
    });
  };

  // Add prediction
  const addPrediction = (question) => {
    push(ref(db, "predictions"), { question, votes: {}, correct: null });
  };

  // Mark correct answer (admin)
  const markCorrect = (id, answer) => {
    update(ref(db, `predictions/${id}`), { correct: answer });

    const prediction = predictions.find(([key]) => key === id)[1];
    if (prediction && prediction.votes) {
      Object.entries(prediction.votes).forEach(([code, vote]) => {
        if (vote.choice === answer) {
          update(ref(db, `leaderboard/${code}`), {
            name: vote.name,
            points: (leaderboard[code]?.points || 0) + 1,
          });
        }
      });
    }
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

  // Delete photo (admin)
  const deletePhoto = (id, url) => {
    const photoRef = storageRef(storage, url);
    deleteObject(photoRef).catch(() => {});
    remove(ref(db, `photos/${id}`));
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

  const deleteGuestbook = (id) => {
    remove(ref(db, `guestbook/${id}`));
  };

  // Export data
  const exportData = () => {
    const data = {
      rsvps,
      predictions,
      leaderboard,
      guestbook: guestbookEntries,
      photos: photoUploads,
    };
    const csvRows = [];
    for (const [key, value] of Object.entries(data)) {
      csvRows.push(`\n=== ${key.toUpperCase()} ===`);
      if (Array.isArray(value)) {
        value.forEach(([id, v]) =>
          csvRows.push([id, ...Object.values(v)].join(","))
        );
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) =>
          csvRows.push(`${k}, ${JSON.stringify(v)}`)
        );
      }
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      <div className="flex flex-col items-center p-6">
        {/* Landing */}
        {step === "landing" && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-serif text-gray-800 mb-4">You’re Invited ✨</h1>
            <p className="text-lg text-gray-600 mb-4">Join us in celebrating our engagement.</p>
            <div className="text-2xl font-mono text-amber-700 mb-8">
              {timeLeft.total > 0 ? (
                <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
              ) : (
                <span>🎉 It’s time to celebrate!</span>
              )}
            </div>
            <Button onClick={() => setStep("code")} className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-3 rounded-2xl shadow-md">Enter Invite Code</Button>
          </motion.div>
        )}

        {/* Code entry */}
        {step === "code" && (
          <Card className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">Enter Your Code</h2>
              <Input type="text" value={guestCode} onChange={(e) => setGuestCode(e.target.value)} placeholder="Invitation Code" />
              <Button onClick={() => {
                if (guestCode === ADMIN_CODE) { setIsAdmin(true); setStep("dashboard"); }
                else if (guestList[guestCode]) { setName(guestList[guestCode]); setStep("rsvp"); }
                else alert("Invalid code.");
              }} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2">Continue</Button>
            </CardContent>
          </Card>
        )}

        {/* RSVP */}
        {step === "rsvp" && (
          <Card className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">RSVP for {name}</h2>
              <div className="flex gap-4">
                <Button onClick={() => handleRsvp(true)} className="bg-emerald-600 text-white rounded-xl px-4 py-2">Accept</Button>
                <Button onClick={() => handleRsvp(false)} className="bg-rose-600 text-white rounded-xl px-4 py-2">Decline</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard */}
        {step === "dashboard" && (
          <div className="w-full max-w-4xl space-y-10">
            <h2 className="text-3xl font-serif text-gray-800 text-center">Welcome, {name || "Admin"}</h2>

            {/* Predictions */}
            <div>
              <img src="/assets/floral-divider.png" alt="divider" className="mx-auto my-4 h-12" />
              <h3 className="text-2xl font-serif text-center text-gray-700 mb-4">🔮 Predictions</h3>
              {isAdmin && (
                <div className="flex gap-2 mb-4">
                  <Input id="predictionQ" placeholder="Add a prediction" />
                  <Button onClick={() => {
                    const q = document.getElementById("predictionQ").value;
                    if (q.trim()) addPrediction(q.trim());
                    document.getElementById("predictionQ").value = "";
                  }}>Add</Button>
                </div>
              )}
              {predictions.map(([id, pred]) => (
                <Card key={id} className="p-4 mb-2">
                  <p className="font-medium">{pred.question}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleVote(id, "yes")}>Yes</Button>
                    <Button onClick={() => handleVote(id, "no")}>No</Button>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => markCorrect(id, "yes")}>Mark Yes</Button>
                      <Button onClick={() => markCorrect(id, "no")}>Mark No</Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Leaderboard */}
            <div>
              <img src="/assets/floral-divider.png" alt="divider" className="mx-auto my-4 h-12" />
              <h3 className="text-2xl font-serif text-center text-gray-700 mb-4">🏆 Leaderboard</h3>
              <ul className="bg-white shadow-md rounded-2xl p-4">
                {Object.entries(leaderboard).map(([id, entry]) => (
                  <li key={id}>{entry.name}: {entry.points} pts</li>
                ))}
              </ul>
            </div>

            {/* Photo Gallery */}
            <div>
              <img src="/assets/floral-divider.png" alt="divider" className="mx-auto my-4 h-12" />
              <h3 className="text-2xl font-serif text-center text-gray-700 mb-4">📸 Photo Gallery</h3>
              <div className="flex gap-2 mb-4">
                <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                <Button onClick={handlePhotoUpload}>Upload</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photoUploads.map(([id, p]) => (
                  <div key={id} className="relative">
                    <img src={p.url} alt={p.name} className="rounded-xl border-4 border-amber-200" />
                    <p className="text-center text-sm">{p.name}</p>
                    {isAdmin && <Button size="sm" onClick={() => deletePhoto(id, p.url)}>Delete</Button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Guestbook */}
            <div style={{ backgroundImage: "url(/assets/guestbook-floral.png)" }} className="bg-contain bg-no-repeat bg-center p-8">
              <h3 className="text-2xl font-serif text-center text-gray-700 mb-4">💌 Guestbook</h3>
              <Textarea value={guestbookMessage} onChange={(e) => setGuestbookMessage(e.target.value)} placeholder="Write a message..." />
              <Button onClick={handleGuestbookSubmit} className="mt-2">Submit</Button>
              <div className="mt-4 space-y-2">
                {guestbookEntries.map(([id, entry]) => (
                  <Card key={id} className="p-3">
                    <p className="font-medium">{entry.name}</p>
                    <p>{entry.message}</p>
                    {isAdmin && <Button size="sm" onClick={() => deleteGuestbook(id)}>Delete</Button>}
                  </Card>
                ))}
              </div>
            </div>

            {/* Admin Export */}
            {isAdmin && (
              <div className="text-center">
                <Button onClick={exportData} className="bg-amber-700 text-white">Export Data CSV</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
