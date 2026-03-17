import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiek6AoFRr7nC497zaN_262JiI45UBcBM",
  authDomain: "login-1a7fe.firebaseapp.com",
  databaseURL: "https://login-1a7fe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "login-1a7fe",
  storageBucket: "login-1a7fe.firebasestorage.app",
  messagingSenderId: "429964842954",
  appId: "1:429964842954:web:d7c475efd137b9efd8e133",
  measurementId: "G-JQ5CS5HRGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, storage, analytics };
export default app;
