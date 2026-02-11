// ==========================================
// FIREBASE BACKEND INTEGRATION (FIXED)
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDNH7R9EGtakXTT-4nwZY6n2CMtFrPabdw",
    authDomain: "love-jay.firebaseapp.com",
    projectId: "love-jay",
    storageBucket: "love-jay.firebasestorage.app",
    messagingSenderId: "196528529527",
    appId: "1:196528529527:web:bad0a70d5d0b9b36b02672"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ⭐ Log site visit
async function logVisit() {
    try {
        await addDoc(collection(db, "visits"), {
            time: serverTimestamp(),
            device: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
        console.log("Visit logged");
    } catch (e) {
        console.error("Visit error:", e);
    }
}

// ⭐ YES button
window.logYesClick = async function () {
    try {
        await addDoc(collection(db, "responses"), {
            answer: "YES",
            time: serverTimestamp(),
            device: navigator.userAgent
        });
        console.log("YES saved");
    } catch (e) {
        console.error("YES error:", e);
    }
};

// ⭐ NO button
window.logNoClick = async function () {
    try {
        await addDoc(collection(db, "responses"), {
            answer: "NO",
            time: serverTimestamp(),
            device: navigator.userAgent
        });
        console.log("NO saved");
    } catch (e) {
        console.error("NO error:", e);
    }
};

// Log visit automatically
logVisit();
