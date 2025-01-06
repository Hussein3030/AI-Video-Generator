import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "journey-planner-775a6.firebaseapp.com",
  projectId: "journey-planner-775a6",
  storageBucket: "journey-planner-775a6.firebasestorage.app",
  messagingSenderId: "488205787418",
  appId: "1:488205787418:web:802ceb9babaedde78dcca3",
  measurementId: "G-4N5KD7NJWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);