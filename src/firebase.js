import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1xKZRjoAMgSIzUhCWvPbu5b8wG6WqflM",
  authDomain: "careersync-363f0.firebaseapp.com",
  projectId: "careersync-363f0",
  storageBucket: "careersync-363f0.firebasestorage.app",
  messagingSenderId: "616969203926",
  appId: "1:616969203926:web:70d8a99116c411d6de5977",
  measurementId: "G-87XTS7B40M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);
export { app, analytics };