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

// Demo mode flag
let DEMO_MODE = false;

function initializeFirebase() {
  try {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      // Enable demo/offline mode
      DEMO_MODE = true;
      console.warn('⚠️assallamullaikum');
      console.log('%c📝 DEMO MODE ENABLED:', 'color: #ffa500; font-weight: bold; font-size: 14px;');
      console.log('Running locally without Firebase.');
      console.log('File uploads will NOT work.');
      console.log('To enable uploads, add Firebase credentials to jsfirebase.js');
      console.log('See: FIREBASE_SETUP_GUIDE.md for instructions.');
      
      // Show info banner (not blocking)
      if (document.body) {
        const demoBanner = document.createElement('div');
        demoBanner.id = 'demo-mode-banner';
        demoBanner.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; background: #1a1a1a; border-bottom: 2px solid #ffa500; padding: 12px 20px; z-index: 9999; font-family: monospace; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #ffa500; font-size: 13px;">⚡ DEMO MODE (Local - No Firebase)</span>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="background: transparent; border: 1px solid #ffa500; color: #ffa500; padding: 4px 12px; cursor: pointer; border-radius: 3px; font-size: 12px;">Hide</button>
          </div>
        `;
        document.body.insertBefore(demoBanner, document.body.firstChild);
      }
      
      return false;
    }

    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    DEMO_MODE = false;

    console.log('✓ Firebase initialized successfully');
    console.log('✓ Storage:', storage ? 'Ready' : 'Not available');
    console.log('✓ Firestore:', db ? 'Ready' : 'Not available');
    console.log('✓ Auth:', auth ? 'Ready' : 'Not available');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    DEMO_MODE = true;
    console.log('Falling back to demo mode...');
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
    // Demo mode - save to localStorage
    if (DEMO_MODE) {
      const messages = JSON.parse(localStorage.getItem('demo_messages') || '[]');
      messages.push({
        id: Date.now().toString(),
        name, email, message,
        timestamp: new Date().toISOString(),
        status: 'unread'
      });
      localStorage.setItem('demo_messages', JSON.stringify(messages));
      console.log('✓ Message saved to demo storage:', messages.length, 'total');
      return Date.now().toString();
    }

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
    // Demo mode - get from localStorage
    if (DEMO_MODE) {
      const messages = JSON.parse(localStorage.getItem('demo_messages') || '[]');
      console.log('✓ Loaded', messages.length, 'messages from demo storage');
      return messages;
    }

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
    // Demo mode - show friendly message
    if (DEMO_MODE) {
      alert('⚠️ Demo Mode: File uploads disabled\n\nTo enable uploads:\n1. Get Firebase credentials\n2. Update jsfirebase.js\n3. See: FIREBASE_SETUP_GUIDE.md');
      throw new Error('Demo mode - Firebase not configured');
    }

    // Check if storage is initialized
    if (!storage) {
      throw new Error('❌ Firebase Storage not initialized. Please configure Firebase credentials in jsfirebase.js');
    }

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
