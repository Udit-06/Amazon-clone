// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBE6f1JFsuUBiyNCR9f7vnXYXUlkWki4DE",
  authDomain: "clone-3dc15.firebaseapp.com",
  projectId: "clone-3dc15",
  storageBucket: "clone-3dc15.firebasestorage.app",
  messagingSenderId: "556633145497",
  appId: "1:556633145497:web:ac44c9db76c1132ca07808",
  measurementId: "G-6QCMJ0VC8X"
};

const app = initializeApp(firebaseConfig);

// 🔥 New modular usage
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };