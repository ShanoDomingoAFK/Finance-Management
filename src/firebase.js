import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5ZL09LZsbBSOdoudWwZ-i8Cd-yiQAGAk",
  authDomain: "pesotrack-161c0.firebaseapp.com",
  projectId: "pesotrack-161c0",
  storageBucket: "pesotrack-161c0.firebasestorage.app",
  messagingSenderId: "1076043265210",
  appId: "1:1076043265210:web:364b7d5caee35724a53e83",
};

export const HOUSEHOLD_ID = "change-me-to-something-unique";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
