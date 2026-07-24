/* ==========================================================
   FIREBASE CONFIG — sudah diisi dari project Firebase kamu
   (undangan-digital-3071e)
   ========================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAZP2zYN-NYMPRjduGtx3KvIh1AY4_26XM",
  authDomain: "undangan-digital-3071e.firebaseapp.com",
  projectId: "undangan-digital-3071e",
  storageBucket: "undangan-digital-3071e.firebasestorage.app",
  messagingSenderId: "459231671365",
  appId: "1:459231671365:web:08e035980bde1bd8badf2c"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();