import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtQigrKU7hzWFjcbi_E37j6b8jybzTLN8",
    authDomain: "todo-app-firebase-c8cbb.firebaseapp.com",
    projectId: "todo-app-firebase-c8cbb",
    storageBucket: "todo-app-firebase-c8cbb.appspot.com",
    messagingSenderId: "182416221574",
    appId: "1:182416221574:web:b7ba9e91d45b3845553807"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);