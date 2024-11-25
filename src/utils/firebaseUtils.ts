import { collection, addDoc, getDocs, query, orderBy, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ChecklistItem } from '../types';

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
const db = getFirestore(app);

export async function saveChecklistToFirebase(checklist: ChecklistItem) {
  try {
    const checklistData = {
      ...checklist,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'checklists'), checklistData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving checklist:', error);
    throw new Error('Fehler beim Speichern der Checkliste. Bitte versuchen Sie es später erneut.');
  }
}

export async function getChecklists() {
  try {
    const q = query(collection(db, 'checklists'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChecklistItem[];
  } catch (error) {
    console.error('Error getting checklists:', error);
    throw new Error('Fehler beim Abrufen der Checklisten. Bitte versuchen Sie es später erneut.');
  }
}