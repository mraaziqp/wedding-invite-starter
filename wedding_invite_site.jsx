// NOTE: This file now contains both the invite view and a basic admin view
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Flower2 } from "lucide-react";
import "@fontsource/playfair-display";
import "@fontsource/dancing-script";

const guestList = {
  ABC123: "Ayesha Khan",
  XYZ789: "Mohamed Patel",
  WED001: "Fatima Ismail",
  WED002: "Yusuf Rahman"
};

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
      const response = await fetch("https://script.google.com/macros/s/AKfycbzpqlQud7ngqiDYIIzxXDvIP8Sfom_PEo2Xa8-xkw2I18TeoFF4lz0hrnHxJkiPm312/exec", {
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

  // ... Invite view continues unchanged ...

  return (
    // Original invitation UI remains here
    // Already present in canvas, not repeated here for brevity
    <></>
  );
}
