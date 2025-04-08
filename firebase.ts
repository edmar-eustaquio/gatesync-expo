import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD2G6_RpTzIs6KyE7HBP0rbLCYNxcj0yUw",
    authDomain: "gatesync-bf2cc.firebaseapp.com",
    projectId: "gatesync-bf2cc",
    storageBucket: "gatesync-bf2cc.firebasestorage.app",
    messagingSenderId: "331184912363",
    appId: "1:331184912363:web:2ff4bf1642073e9c5d0bae"
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const auth = getAuth(app);

const db = getFirestore(app);

export { db, auth };