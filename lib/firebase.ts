// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7ML6s3mnxBBsQDFkm_f08ITeUj9AFvDg",
  authDomain: "aurum-gold.firebaseapp.com",
  projectId: "aurum-gold",
  storageBucket: "aurum-gold.firebasestorage.app",
  messagingSenderId: "89608383997",
  appId: "1:89608383997:web:d120d93cae6664f45bfd94",
  measurementId: "G-SM2YGWBQNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;