import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA0GVCuUiLcE38SJCOb3bxOGGrpAV_ctPA",
    authDomain: "event-management-dashboa-c14d1.firebaseapp.com",
    projectId: "event-management-dashboa-c14d1",
    storageBucket: "event-management-dashboa-c14d1.firebasestorage.app",
    messagingSenderId: "745860613893",
    appId: "1:745860613893:web:b5449e833505222e33996c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);