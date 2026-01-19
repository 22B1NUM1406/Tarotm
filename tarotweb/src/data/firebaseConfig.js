import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDW-dNxxhMIBphKPX2xIKE0qsO1puyxwN0",
  authDomain: "tarot-mongolia.firebaseapp.com",
  projectId: "tarot-mongolia",
  storageBucket: "tarot-mongolia.firebasestorage.app",
  messagingSenderId: "84218992471",
  appId: "1:84218992471:web:c5e3464fa8262d39a4d012",
  measurementId: "G-FVX95LELB3"
};

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();