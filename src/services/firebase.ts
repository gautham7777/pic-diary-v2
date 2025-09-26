import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVT2YuAJQoHE2m5nznwhhK0_jgMBQJzk0",
  authDomain: "math-fest-display.firebaseapp.com",
  databaseURL: "https://math-fest-display-default-rtdb.firebaseio.com",
  projectId: "math-fest-display",
  storageBucket: "math-fest-display.firebasestorage.app",
  messagingSenderId: "252365377355",
  appId: "1:252365377355:web:83772c179137b3de94e2ce"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence. This allows the app to work even in environments
// with limited network access, like the preview session you're using.
// Changes will be saved locally and synced to the server once a connection is available.
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    console.warn('Firestore persistence failed: Multiple tabs open.');
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    console.warn('Firestore persistence is not available in this browser.');
  }
});