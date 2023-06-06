// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoqaTfAPXTyB9okrKNN8opZNLOlshC7ac",
  authDomain: "mydemoapp-c9a6a.firebaseapp.com",
  projectId: "mydemoapp-c9a6a",
  storageBucket: "mydemoapp-c9a6a.appspot.com",
  messagingSenderId: "708439279811",
  appId: "1:708439279811:web:d1298c8a144e8d2f43fa76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { auth, db };
