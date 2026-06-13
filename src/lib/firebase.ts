import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initializing on hot reload
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;

// ─── Firestore Collection Names ──────────────────────────
// All prefixed with "amara-beauty-parlour" to separate from other projects
export const COLLECTIONS = {
  bookings:      "amara-beauty-parlour/data/bookings",
  testimonials:  "amara-beauty-parlour/data/testimonials",
  gallery:       "amara-beauty-parlour/data/gallery",
  beforeAfter:   "amara-beauty-parlour/data/before-after",
  customers:     "amara-beauty-parlour/data/customers",
};

// ─── Firebase Storage Paths ───────────────────────────────
// All prefixed with "amara-beauty-parlour/" folder in Storage
export const STORAGE_PATHS = {
  gallery:       "amara-beauty-parlour/gallery",
  beforeImages:  "amara-beauty-parlour/before-after/before",
  afterImages:   "amara-beauty-parlour/before-after/after",
};