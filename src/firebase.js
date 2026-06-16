import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────
// 👉 STEP 1: Paste your Firebase config here.
// Get this from: Firebase Console → Project Settings → General →
// "Your apps" → Web app (</> icon) → SDK setup and configuration
// ─────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

// ─────────────────────────────────────────────────────────────────────────
// 👉 STEP 2: Change this to a unique, private string only you/your partner
// know. Think of it like a "household ID" — anyone with this exact string
// and your Firebase project could read/write your data, so keep it private
// and don't share your live URL publicly.
// Example: "delacruz-household-2025-xyz"
// ─────────────────────────────────────────────────────────────────────────
export const HOUSEHOLD_ID = "change-me-to-something-unique";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
