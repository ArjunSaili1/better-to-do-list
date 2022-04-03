import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGAt1LX_0ujKSxY0H8alH3x_VDz7YG2Xo",
  authDomain: "to-do-list-b4206.firebaseapp.com",
  projectId: "to-do-list-b4206",
  storageBucket: "to-do-list-b4206.appspot.com",
  messagingSenderId: "559736845573",
  appId: "1:559736845573:web:4ab2d4034244dbd0fff36c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
