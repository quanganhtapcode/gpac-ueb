import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCVtcOyMP_92SWXxNVIvfHOh_lhrCZjgS8",
  authDomain: "gpac-ueb.firebaseapp.com",
  projectId: "gpac-ueb",
  storageBucket: "gpac-ueb.firebasestorage.app",
  messagingSenderId: "1083813326126",
  appId: "1:1083813326126:web:c6ebb843e09413e8375ebf",
  measurementId: "G-P6BESX7NQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
