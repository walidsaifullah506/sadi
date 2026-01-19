// ============================================
// ADMIN LOGIN & MANAGEMENT LOGIC
// ============================================

let currentAdmin = null;

// Admin Credentials (Local Authentication)
const ADMIN_CREDENTIALS = {
  email: 'walidsaifullah506@gmail.com',
  password: 'walid@123456'
};

// Admin Login
async function adminLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    alert('⚠ Please enter email and password');
    return;
  }

  // Local credential validation
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    currentAdmin = { email: email, uid: 'admin-' + Date.now() };
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminToken', 'admin-logged-in');
    
    // Show admin panel
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'block';

    // Load data
    loadMessages();
    loadProjects();
    loadCertificates();
    loadCV();

    console.log('✓ Admin logged in successfully');
    return;
  }

  // If local credentials don't match, try Firebase
  try {
    const result = await loginUser(email, password);
    currentAdmin = result;
    localStorage.setItem('adminEmail', email);
    
    // Show admin panel
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'block';

    // Load data
    loadMessages();
    loadProjects();
    loadCertificates();
    loadCV();

    console.log('✓ Admin logged in via Firebase');
  } catch (error) {
    alert('❌ Invalid email or password');
    console.error(error);
  }
}

// Admin Logout
async function adminLogout() {
  await logoutUser();
  currentAdmin = null;
  
  // Reset form
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  
  // Show login section
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
  
  console.log('✓ Admin logged out');
}

// Switch tabs
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Deactivate all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  
  // Activate button
  event.target.classList.add('active');
}

// ============================================
// MESSAGES TAB FUNCTIONS
// ============================================

async function loadMessages() {
  try {
    const messages = await getContactMessages();
    const container = document.getElementById('messages-list');
    
    if (messages.length === 0) {
      container.innerHTML = '<div class="empty-state">No messages yet</div>';
      return;
    }

    container.innerHTML = messages.map(msg => `
      <div class="message-item">
        <h4>${msg.name} <span class="status-badge ${msg.status === 'unread' ? 'status-unread' : 'status-read'}">${msg.status}</span></h4>
        <p><strong>Email:</strong> ${msg.email}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
        <p style="font-size: 12px; color: #00ff88;">📅 ${new Date(msg.timestamp?.toDate?.() || msg.timestamp).toLocaleDateString()}</p>
        <div style="margin-top: 10px; display: flex; gap: 10px;">
          <button class="btn-small" onclick="replyToMessage('${msg.email}')">Reply</button>
          <button class="btn-small btn-danger" onclick="deleteMessage('${msg.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Load messages error:', error);
  }
}

async function deleteMessage(messageId) {
  if (confirm('Delete this message?')) {
    try {
      await db.collection('contact_messages').doc(messageId).delete();
      loadMessages();
      alert('✓ Message deleted');
    } catch (error) {
      alert('❌ Delete failed: ' + error.message);
    }
  }
}

function replyToMessage(email) {
  alert('Reply functionality: Send email to ' + email);
  // In production, implement email reply functionality
}

// ============================================
// PROJECTS TAB FUNCTIONS
// ============================================

async function saveProject() {
  const title = document.getElementById('project-title').value.trim();
  const desc = document.getElementById('project-desc').value.trim();
  const tags = document.getElementById('project-tags').value.trim().split(',').map(t => t.trim());

  if (!title || !desc) {
    alert('⚠ Please fill all fields');
    return;
  }

  try {
    await saveProject({
      title: title,
      description: desc,
      tags: tags,
      status: 'Completed'
    });

    document.getElementById('project-title').value = '';
    document.getElementById('project-desc').value = '';
    document.getElementById('project-tags').value = '';

    loadProjects();
    alert('✓ Project added successfully');
  } catch (error) {
    alert('❌ Save failed: ' + error.message);
  }
}

async function loadProjects() {
  try {
    const projects = await getProjects();
    const container = document.getElementById('projects-list');
    
    if (projects.length === 0) {
      container.innerHTML = '<div class="empty-state">No projects yet</div>';
      return;
    }

    container.innerHTML = projects.map(proj => `
      <div class="project-card">
        <h4>${proj.title}</h4>
        <p>${proj.description}</p>
        <p style="font-size: 12px;">
          ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </p>
        <button class="btn-small btn-danger" onclick="adminDeleteProject('${proj.id}')">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Load projects error:', error);
  }
}

async function adminDeleteProject(projectId) {
  if (confirm('Delete this project?')) {
    try {
      await deleteProject(projectId);
      loadProjects();
      alert('✓ Project deleted');
    } catch (error) {
      alert('❌ Delete failed: ' + error.message);
    }
  }
}

// ============================================
// CERTIFICATES TAB FUNCTIONS
// ============================================

async function uploadCertificate() {
  const name = document.getElementById('cert-name').value.trim();
  const file = document.getElementById('cert-file').files[0];

  if (!name || !file) {
    alert('⚠ Please enter name and select file');
    return;
  }

  try {
    const fileUrl = await uploadFile(file, 'certificates');
    
    await saveCertificate({
      name: name,
      fileUrl: fileUrl,
      fileName: file.name
    });

    document.getElementById('cert-name').value = '';
    document.getElementById('cert-file').value = '';

    loadCertificates();
    alert('✓ Certificate uploaded successfully');
  } catch (error) {
    alert('❌ Upload failed: ' + error.message);
  }
}

async function loadCertificates() {
  try {
    const certs = await getCertificates();
    const container = document.getElementById('certificates-list');
    
    if (certs.length === 0) {
      container.innerHTML = '<div class="empty-state">No certificates uploaded</div>';
      return;
    }

    container.innerHTML = certs.map(cert => `
      <div class="cert-card">
        <h4>${cert.name}</h4>
        <p style="font-size: 12px; color: #00ff88;">File: ${cert.fileName}</p>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <a href="${cert.fileUrl}" target="_blank" class="btn-small">View</a>
          <a href="${cert.fileUrl}" download class="btn-small">Download</a>
          <button class="btn-small btn-danger" onclick="adminDeleteCert('${cert.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Load certificates error:', error);
  }
}

async function adminDeleteCert(certId) {
  if (confirm('Delete this certificate?')) {
    try {
      const cert = (await getCertificates()).find(c => c.id === certId);
      if (cert) {
        await deleteFile(cert.fileUrl);
      }
      await db.collection('certificates').doc(certId).delete();
      loadCertificates();
      alert('✓ Certificate deleted');
    } catch (error) {
      alert('❌ Delete failed: ' + error.message);
    }
  }
}

// ============================================
// CV TAB FUNCTIONS
// ============================================

async function uploadCV() {
  const file = document.getElementById('cv-file').files[0];

  if (!file) {
    alert('⚠ Please select a CV file');
    return;
  }

  if (!file.name.endsWith('.pdf')) {
    alert('⚠ Please upload a PDF file');
    return;
  }

  try {
    const fileUrl = await uploadFile(file, 'cv');

    // Save or update CV reference
    await db.collection('settings').doc('cv').set({
      fileUrl: fileUrl,
      fileName: file.name,
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    document.getElementById('cv-file').value = '';
    loadCV();
    alert('✓ CV uploaded successfully');
  } catch (error) {
    alert('❌ Upload failed: ' + error.message);
  }
}

async function loadCV() {
  try {
    const cvDoc = await db.collection('settings').doc('cv').get();
    const container = document.getElementById('cv-display');

    if (!cvDoc.exists) {
      container.innerHTML = '<div class="empty-state">No CV uploaded yet</div>';
      return;
    }

    const cv = cvDoc.data();
    container.innerHTML = `
      <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid #00ff88; padding: 20px; border-radius: 4px;">
        <p style="color: #00ff88; margin-bottom: 15px;"><strong>File:</strong> ${cv.fileName}</p>
        <div style="display: flex; gap: 10px;">
          <a href="${cv.fileUrl}" target="_blank" class="btn-primary">View CV</a>
          <a href="${cv.fileUrl}" download class="btn-primary">Download CV</a>
          <button class="btn-danger" onclick="adminDeleteCV()">Replace CV</button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Load CV error:', error);
  }
}

async function adminDeleteCV() {
  if (confirm('Replace current CV?')) {
    try {
      const cvDoc = await db.collection('settings').doc('cv').get();
      if (cvDoc.exists) {
        const cv = cvDoc.data();
        if (cv.fileUrl) {
          await deleteFile(cv.fileUrl);
        }
        await db.collection('settings').doc('cv').delete();
      }
      document.getElementById('cv-file').value = '';
      loadCV();
      alert('✓ CV removed. Upload a new one.');
    } catch (error) {
      alert('❌ Delete failed: ' + error.message);
    }
  }
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const adminEmail = localStorage.getItem('adminEmail');
  const adminToken = localStorage.getItem('adminToken');
  
  if (adminToken) {
    // Auto-show admin panel if token exists
    // Note: In production, verify token with Firebase
  }
});
