// jsadmin.js (Firebase v10 compatible)

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// 🔐 LOGIN
window.adminLogin = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Email & Password required");
    return;
  }

  try {
    await signInWithEmailAndPassword(window.auth, email, password);
    alert("✅ Login successful");
  } catch (err) {
    alert("❌ Login failed: " + err.message);
  }
};

// 🔓 LOGOUT
window.adminLogout = async function () {
  await signOut(window.auth);
  alert("Logged out");
};

// 👁️ AUTH STATE CHECK
onAuthStateChanged(window.auth, user => {
  if (user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("admin-panel").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

// 💼 SAVE PROJECT
window.saveProject = async function () {
  const title = document.getElementById("project-title").value;
  const desc = document.getElementById("project-desc").value;

  if (!title || !desc) {
    alert("Project title & description required");
    return;
  }

  try {
    await addDoc(collection(window.db, "projects"), {
      title,
      desc,
      created: new Date()
    });
    alert("✅ Project saved");
  } catch (e) {
    alert("❌ Error saving project");
  }
};

// 📄 UPLOAD CV
window.uploadCV = async function () {
  const file = document.getElementById("cv-file").files[0];
  if (!file) {
    alert("Select a file first");
    return;
  }

  try {
    const fileRef = ref(window.storage, "cv/" + file.name);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    alert("✅ CV uploaded\n" + url);
  } catch (e) {
    alert("❌ Upload failed");
  }
};
