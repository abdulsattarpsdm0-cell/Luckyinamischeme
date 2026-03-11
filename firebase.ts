
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1KKbnGn1EJCDE1SYAj7eYlFzIB7Egh28",
  authDomain: "my-lucky-inami-scheme.firebaseapp.com",
  projectId: "my-lucky-inami-scheme",
  storageBucket: "my-lucky-inami-scheme.firebasestorage.app",
  messagingSenderId: "600990019972",
  appId: "1:600990019972:web:6d9d60a7127eaef0a2edd1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
