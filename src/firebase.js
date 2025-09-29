// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyAJSiCvixp6qb1M6wA7OmAd1N-ggs7MoF8",
  authDomain: "my-engagement-app-d5c34.firebaseapp.com",
  projectId: "my-engagement-app-d5c34",
  storageBucket: "my-engagement-app-d5c34.appspot.com",
  messagingSenderId: "841646689739",
  appId: "1:841646689739:web:32cd28474cbe9951bdfa4e",
  measurementId: "G-RGZKM2J0P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(app);

// Storage bucket
const storage = getStorage(app);

export { db, storage };
