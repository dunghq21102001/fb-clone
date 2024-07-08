import { initializeApp } from "firebase/app";

import {
  doc,
  onSnapshot,
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANbSutzA8iKGr-OEy6Ko0p99XdOnYsBuU",
  authDomain: "community-application-v1.firebaseapp.com",
  projectId: "community-application-v1",
  storageBucket: "community-application-v1.appspot.com",
  messagingSenderId: "460081353476",
  appId: "1:460081353476:web:56416fcdcee4114957b651"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);

export { doc, onSnapshot, addDoc, collection, query, updateDoc, deleteDoc };