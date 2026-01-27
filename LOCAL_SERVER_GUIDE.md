# 🚀 Local Development Server Guide

## Quick Start

Your portfolio is ready to run locally! Follow these steps:

### Option 1: Using Windows Command Prompt (Easiest)

1. **Open Command Prompt:**
   - Press `Win + R`
   - Type: `cmd`
   - Press Enter

2. **Navigate to your project:**
   ```bash
   cd e:\protfolio me
   ```

3. **Start the server:**
   ```bash
   start-server.bat
   ```

4. **Open in browser:**
   - Desktop version: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html

---

### Option 2: Using PowerShell

1. **Open PowerShell as Administrator:**
   - Press `Win + X` → Select "Windows PowerShell (Admin)"

2. **Navigate to your project:**
   ```powershell
   cd "e:\protfolio me"
   ```

3. **Allow script execution (first time only):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Start the server:**
   ```powershell
   .\start-server.ps1
   ```

5. **Open in browser:**
   - http://localhost:3000
   - Admin: http://localhost:3000/admin.html

---

### Option 3: Manual Node.js Command

1. **Open Command Prompt in your project folder**

2. **Run directly:**
   ```bash
   node server.js
   ```

3. **Output will show:**
   ```
   📍 Server URL: http://localhost:3000
   🌐 Open in browser: http://localhost:3000
   ```

---

## What You Get

✅ **Local Server Features:**
- Static file serving (HTML, CSS, JS, images, PDFs)
- MIME type detection for all file types
- 404 error pages
- Security: prevents directory traversal attacks
- Clean console output with server info

---

## Admin Panel Access

Once server is running:

1. Go to: **http://localhost:3000/admin.html**
2. Login credentials:
   - **Email:** `walidsaifullah506@gmail.com`
   - **Password:** `walid@123456`

---

## ⚠️ Important: Firebase Configuration

**For file uploads to work, you MUST:**

1. Configure Firebase credentials in `jsfirebase.js`
2. Follow instructions in `FIREBASE_SETUP_GUIDE.md`
3. Enable: Authentication, Firestore, Storage
4. Update security rules

**Without Firebase setup, uploads will NOT work locally!**

---

## Troubleshooting

### ❌ "Node.js is not installed"

**Solution:** Download and install Node.js from https://nodejs.org/

1. Download the LTS (Long Term Support) version
2. Run installer with default settings
3. Restart Command Prompt
4. Try again: `node -v` (should show version)

---

### ❌ "Port 3000 is already in use"

**Solution 1:** Close other applications using port 3000

**Solution 2:** Change the port in `server.js`:
```javascript
const PORT = 3001;  // Change 3000 to 3001 (or any free port)
```

**Solution 3:** Kill the process using the port:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### ❌ "Access Denied" when running PowerShell script

**Solution:** Run PowerShell as Administrator:
1. Press `Win + X`
2. Select "Windows PowerShell (Admin)"
3. Type: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
4. Type: `Y` and press Enter
5. Try again

---

## File Structure

Your server serves files from the project root:

```
http://localhost:3000/
├── index.html              (Main portfolio)
├── admin.html              (Admin panel)
├── jsfirebase.js           (Firebase config)
├── assets/                 (Images, files)
│   ├── logo.png
│   ├── profile.jpg
│   └── cv.pdf
├── css*.css                (Stylesheets)
├── js*.js                  (Scripts)
└── ...other files
```

---

## Server Features

### ✓ Supported File Types

- **Web:** `.html`, `.css`, `.js`, `.json`
- **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`
- **Documents:** `.pdf`, `.md`, `.txt`
- **Other:** Any file with proper MIME type

### ✓ Error Handling

- 404 errors show friendly error page
- 500 errors display server error messages
- Directory traversal attacks blocked

### ✓ Auto Routing

- `/` → `index.html`
- `/admin.html` → `admin.html`
- `/assets/logo.png` → `assets/logo.png`

---

## Test Checklist

After starting the server:

- [ ] Homepage loads: http://localhost:3000
- [ ] Admin page loads: http://localhost:3000/admin.html
- [ ] Images display correctly
- [ ] CSS styling works
- [ ] JavaScript functionality works
- [ ] Links navigate properly
- [ ] Console shows no errors (Press F12 → Console tab)

---

## Stop the Server

- Press **Ctrl + C** in the command prompt/PowerShell
- Server will shut down gracefully

---

## Next Steps

1. ✅ Run local server (this guide)
2. 📋 Configure Firebase (see `FIREBASE_SETUP_GUIDE.md`)
3. 🧪 Test admin uploads locally
4. 🚀 Deploy to GitHub Pages when ready

---

## Network Access

By default, server runs on:
- **Local only:** http://localhost:3000
- **Not accessible from other computers**

To make it accessible on your network, edit `server.js`:
```javascript
const HOST = '0.0.0.0';  // Instead of 'localhost'
```

Then access from other devices using your computer IP (e.g., http://192.168.1.100:3000)

---

## Pro Tips

💡 **Keyboard Shortcuts:**
- `Ctrl + C` - Stop server
- `F12` - Open DevTools in browser
- `F5` - Reload page
- `Ctrl + Shift + Delete` - Clear cache

💡 **Keep console open** to see server logs and debug issues

💡 **Test on multiple browsers** (Chrome, Firefox, Edge) for compatibility

---

## Questions?

Check these files for more help:
- `FIREBASE_SETUP_GUIDE.md` - Firebase configuration
- `DOCUMENTATION_INDEX.md` - Full documentation
- `README.md` - Project overview

Enjoy your local development! 🎉
