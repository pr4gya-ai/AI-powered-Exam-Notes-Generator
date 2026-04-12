import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authnotes-3dd52.firebaseapp.com",
  projectId: "authnotes-3dd52",
  storageBucket: "authnotes-3dd52.firebasestorage.app",
  messagingSenderId: "486236305788",
  appId: "1:486236305788:web:83beccd6fd98bdeda44cf9"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };