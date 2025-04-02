import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQH-8Ts1XI5P1_5sT9udsXKPXR7gUjF68",
    authDomain: "libros-biblioteca-de552.firebaseapp.com",
    projectId: "libros-biblioteca-de552",
    storageBucket: "libros-biblioteca-de552.firebasestorage.app",
    messagingSenderId: "875299457513",
    appId: "1:875299457513:web:abaaac58d5f236473ea378",
    measurementId: "G-9E0C8VH5C5"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);

export default app;