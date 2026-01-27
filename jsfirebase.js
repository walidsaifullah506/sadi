// jsfirebase.js
// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// IMPORTANT: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Demo mode flag
export let DEMO_MODE = false;

export let app, auth, db, storage;

export function initializeFirebase() {
  try {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      DEMO_MODE = true;
      console.warn('⚠️ DEMO MODE: Firebase not configured - running offline.');
      console.log('%c📝 DEMO MODE ENABLED', 'color: #ffa500; font-weight: bold;');
      console.log('File uploads and Firestore will NOT work.');
      return false;
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    DEMO_MODE = false;

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (err) {
    DEMO_MODE = true;
    console.error('Firebase initialization failed:', err);
    return false;
  }
}

// -------------------------
// Firestore Helpers
// -------------------------
export async function saveDoc(collectionName, data) {
  if (DEMO_MODE) {
    console.warn('Demo mode: Cannot save data to Firestore');
    return null;
  }
  const colRef = db.collection ? db.collection(collectionName) : null;
  if (!colRef) throw new Error('Firestore not initialized');
  const docRef = await db.collection(collectionName).add({ ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

// -------------------------
// Storage Helpers
// -------------------------
export async function uploadFile(file, folder = 'uploads') {
  if (DEMO_MODE) {
    alert('⚠️ Demo mode: File uploads disabled');
    throw new Error('Demo mode active');
  }
  if (!storage) throw new Error('Firebase Storage not initialized');

  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}

export async function deleteFile(fileUrl) {
  if (!storage) throw new Error('Firebase Storage not initialized');
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
}
