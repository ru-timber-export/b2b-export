import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn5wNF1jfsNxaNH7jqqXkUZ6n-7uPzZAo",
  authDomain: "rutimber-erp.firebaseapp.com",
  projectId: "rutimber-erp",
  storageBucket: "rutimber-erp.firebasestorage.app",
  messagingSenderId: "372668063945",
  appId: "1:372668063945:web:7f2a3cec469391b4b1ad18"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);