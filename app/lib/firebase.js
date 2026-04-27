import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ8PbwGi22SuJAir8FyDEAKaPgEXoDIss",
  authDomain: "ecommerce-store-f32d2.firebaseapp.com",
  projectId: "ecommerce-store-f32d2",
  storageBucket: "ecommerce-store-f32d2.firebasestorage.app",
  messagingSenderId: "674446584010",
  appId: "1:674446584010:web:31372c4a6dede073dd6c33",
  measurementId: "G-ZYHKP426B5"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (Only in Browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
