// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================

// IMPORTANT: Replace with your Firebase config from Firebase Console
// Get this from: https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, db, auth, storage;

function initializeFirebase() {
  try {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.warn('⚠ Firebase not configured. Using demo mode.');
      console.log('Please update jsfirebase.js with your Firebase credentials.');
      return false;
    }

    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();

    console.log('✓ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

// Authentication Functions

// Sign up function
async function signUp(email, password) {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    console.log('✓ User registered:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Login function
async function loginUser(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    console.log('✓ User logged in:', result.user.uid);
    localStorage.setItem('adminToken', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout function
async function logoutUser() {
  try {
    await auth.signOut();
    localStorage.removeItem('adminToken');
    console.log('✓ User logged out');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Firestore Functions

// Save contact message
async function saveContactMessage(name, email, message) {
  try {
    const docRef = await db.collection('contact_messages').add({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'unread'
    });
    console.log('✓ Message saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Save message error:', error);
    throw error;
  }
}

// Get all contact messages (admin only)
async function getContactMessages() {
  try {
    const snapshot = await db.collection('contact_messages')
      .orderBy('timestamp', 'desc')
      .get();
    
    const messages = [];
    snapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return messages;
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
}

// Save project
async function saveProject(projectData) {
  try {
    const docRef = await db.collection('projects').add({
      ...projectData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✓ Project saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Save project error:', error);
    throw error;
  }
}

// Get all projects
async function getProjects() {
  try {
    const snapshot = await db.collection('projects')
      .orderBy('createdAt', 'desc')
      .get();
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return projects;
  } catch (error) {
    console.error('Get projects error:', error);
    return [];
  }
}

// Delete project
async function deleteProject(projectId) {
  try {
    await db.collection('projects').doc(projectId).delete();
    console.log('✓ Project deleted');
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
}

// Save certificate
async function saveCertificate(certData) {
  try {
    const docRef = await db.collection('certificates').add({
      ...certData,
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✓ Certificate saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Save certificate error:', error);
    throw error;
  }
}

// Get all certificates
async function getCertificates() {
  try {
    const snapshot = await db.collection('certificates')
      .orderBy('uploadedAt', 'desc')
      .get();
    
    const certs = [];
    snapshot.forEach(doc => {
      certs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return certs;
  } catch (error) {
    console.error('Get certificates error:', error);
    return [];
  }
}

// Storage Functions

// Upload file to Firebase Storage
async function uploadFile(file, folder = 'documents') {
  try {
    const storageRef = storage.ref(`${folder}/${Date.now()}_${file.name}`);
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log('✓ File uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Delete file from Firebase Storage
async function deleteFile(fileUrl) {
  try {
    const fileRef = storage.refFromURL(fileUrl);
    await fileRef.delete();
    console.log('✓ File deleted');
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}

// Initialize Firebase when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}