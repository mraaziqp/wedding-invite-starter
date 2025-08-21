import { useState } from "react";
import guestList from "./data/guests";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Flower2 } from "lucide-react";
import "@fontsource/playfair-display";
import "@fontsource/dancing-script";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

export default function WeddingInvite() {
  const [code, setCode] = useState("");
  const [guestName, setGuestName] = useState(null);
  const [error, setError] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [rsvpData, setRsvpData] = useState([]);

  const handleCheckCode = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "ADMIN") {
      setAdminMode(true);
      fetchRsvpData();
      return;
    }
    if (guestList[trimmed]) {
      setGuestName(guestList[trimmed]);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleRsvpSubmit = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_RSVP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guestName,
          rsvpStatus,
          guestCount
        })
      });
      if (response.ok) {
        setRsvpSubmitted(true);
      } else {
        console.error("RSVP submission failed: Non-OK response");
      }
    } catch (error) {
      console.error("RSVP submission failed:", error);
    }
  };

  const fetchRsvpData = async () => {
    try {
      const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4sfaFZJhKUzW9M-SHEET-ID/pub?output=csv";
      const res = await fetch(sheetUrl);
      const text = await res.text();
      const lines = text.trim().split("\n").slice(1);
      const parsed = lines.map((line) => {
        const [timestamp, guestName, rsvpStatus, guestCount] = line.split(",");
        return { timestamp, guestName, rsvpStatus, guestCount };
      });
      setRsvpData(parsed);
    } catch (error) {
      console.error("Error loading RSVP data:", error);
    }
  };

  if (adminMode) {
    return (
      <div className="min-h-screen bg-rose-100 p-10 font-[Playfair Display]">
        <h1 className="text-3xl font-bold mb-6">Admin RSVP View</h1>
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-pink-200 text-left">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Guest Name</th>
              <th className="p-3">RSVP</th>
              <th className="p-3">Guests</th>
            </tr>
          </thead>
          <tbody>
            {rsvpData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-3 text-sm">{row.timestamp}</td>
                <td className="p-3 text-sm">{row.guestName}</td>
                <td className="p-3 text-sm">{row.rsvpStatus}</td>
                <td className="p-3 text-sm">{row.guestCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 flex items-center justify-center p-6 relative overflow-hidden font-[Playfair Display]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/elegant-floral-dark.png" alt="floral background" className="w-full h-full object-cover opacity-40 animate-fadeIn" />
      </div>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 1 } } }} className="z-10 max-w-2xl w-full">
        <motion.div className="shadow-2xl rounded-3xl border-0 bg-white/90 backdrop-blur-xl relative overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
          <CardContent className="p-10 md:p-14">
            {guestName ? (
              <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }} className="text-center space-y-6 text-gray-700">
                <motion.div className="text-rose-600" variants={fadeInUp}>
                  <Flower2 className="mx-auto h-12 w-12 animate-bounce" />
                </motion.div>
                <motion.h2 className="text-3xl font-bold tracking-wide text-gray-800" variants={fadeInUp}>Bismillāhir Raḥmānir Raḥīm</motion.h2>
                <motion.p className="text-lg" variants={fadeInUp}>It is with much love & gratitude that we invite you,</motion.p>
                <motion.p className="text-3xl text-rose-700 font-[Dancing Script]" variants={fadeInUp}>{guestName}</motion.p>
                <motion.p className="text-lg" variants={fadeInUp}>to the Nikkah & Wedding Reception of</motion.p>
                <motion.p className="text-4xl font-bold text-gray-900 tracking-tight font-[Dancing Script]" variants={fadeInUp}>Abduraziq Parker & Razia Shade</motion.p>
                <motion.div className="pt-6 border-t border-rose-200 space-y-1" variants={fadeInUp}>
                  <p><strong>Date:</strong> 20 September 2025 (27-Rabi Al-Awwal-1447)</p>
                  <p><strong>Nikkah:</strong> 11am – Husami Masjid Cravenby Estate</p>
                  <p><strong>Reception:</strong> 12pm – Husami Masjid Hall</p>
                </motion.div>
                {!rsvpSubmitted ? (
                  <motion.div className="mt-6 space-y-4" variants={fadeInUp}>
                    <p className="font-semibold">Kindly RSVP below:</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1">Will you attend?</label>
                        <select className="w-full border rounded-md p-2" value={rsvpStatus} onChange={(e) => setRsvpStatus(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">Number of guests (including you)</label>
                        <Input type="number" min="1" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
                      </div>
                      <Button className="w-full bg-rose-600 text-white hover:bg-rose-700" onClick={handleRsvpSubmit}>
                        Submit RSVP
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div className="mt-6 text-green-600 text-lg font-semibold" variants={fadeInUp}>
                    Thank you for your RSVP!
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }} className="text-center space-y-6">
                <motion.div variants={fadeInUp} className="text-rose-500">
                  <Sparkles className="mx-auto h-10 w-10 animate-bounce" />
                </motion.div>
                <motion.h2 className="text-4xl font-bold font-serif text-gray-800" variants={fadeInUp}>You're Invited!</motion.h2>
                <motion.p className="text-gray-600 text-lg" variants={fadeInUp}>Please enter your invitation code to view your personalized invite.</motion.p>
                <motion.div className="max-w-sm mx-auto space-y-3" variants={fadeInUp}>
                  <Input placeholder="Enter your code" value={code} onChange={(e) => setCode(e.target.value)} className="text-center text-lg border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
                  {error && <p className="text-red-500 text-sm">Invalid code. Please try again.</p>}
                  <Button onClick={handleCheckCode} className="w-full bg-pink-600 text-white hover:bg-pink-700 transition-all shadow-md">View Invitation</Button>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
