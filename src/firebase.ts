import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpNC4rP_tE4tyUSi6ffj9l3T7rFFDlcHk",
  authDomain: "cafeteria-143ec.firebaseapp.com",
  projectId: "cafeteria-143ec",
  storageBucket: "cafeteria-143ec.firebasestorage.app",
  messagingSenderId: "199972662445",
  appId: "1:199972662445:web:d15d886798436fc08a6a24",
  measurementId: "G-19KDRC1HMS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);