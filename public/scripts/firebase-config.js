import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAC4yXheBObiMOwnHj1LRKxLamX8T_NLHI",
    authDomain: "cooknconnect-1e9e1.firebaseapp.com",
    projectId: "cooknconnect-1e9e1",
    storageBucket: "cooknconnect-1e9e1.firebasestorage.app",
    messagingSenderId: "52928041165",
    appId: "1:52928041165:web:2cae89b27e38e96f761984",
    measurementId: "G-P5FKZS0GTN"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth, app};