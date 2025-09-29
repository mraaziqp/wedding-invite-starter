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
