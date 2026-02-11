// ==========================================
// FIREBASE BACKEND INTEGRATION
// ==========================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNH7R9EGtakXTT-4nwZY6n2CMtFrPabdw",
    authDomain: "love-jay.firebaseapp.com",
    projectId: "love-jay",
    storageBucket: "love-jay.firebasestorage.app",
    messagingSenderId: "196528529527",
    appId: "1:196528529527:web:bad0a70d5d0b9b36b02672"
};

// Initialize Firebase
let app;
let analytics;
let db;

try {
    app = initializeApp(firebaseConfig);
    // analytics is optional if measurementId is missing, but initializeApp shouldn't fail without it.
    // However, getAnalytics requires measurementId or config support. 
    // Since measurementId is missing from user provided config, we'll try/catch analytics specifically.
    try {
        if (firebaseConfig.measurementId) {
            analytics = getAnalytics(app);
        }
    } catch (e) {
        console.warn("Analytics initialization skipped or failed (might be missing measurementId).");
    }

    db = getFirestore(app);
    console.log("Firebase initialized successfully for love-jay");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

// Function to log visits
async function logVisit() {
    if (!db) return;
    try {
        await addDoc(collection(db, "visits"), {
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
        console.log("Visit logged");
    } catch (e) {
        console.error("Error logging visit: ", e);
    }
}

// Function to log responses (Yes clicks)
// Function to save YES/NO click (matches user guide)
window.saveAnswer = async function (answer) {
    if (!db) return;
    try {
        await addDoc(collection(db, "responses"), {
            answer: answer,
            time: serverTimestamp(),
            device: navigator.userAgent
        });
        console.log("Saved:", answer);
    } catch (error) {
        console.error("Error saving:", error);
    }
}

// Function to log visits (optional extra from before)
async function logVisit() {
    if (!db) return;
    try {
        await addDoc(collection(db, "visits"), {
            time: serverTimestamp(),
            device: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
    } catch (e) {
        console.error("Error logging visit: ", e);
    }
}

// Expose functions to global window object so script.js can use them
window.firebaseLogger = {
    logVisit,
    logVisit,
    saveAnswer: window.saveAnswer
};

// Log visit on load
logVisit();
