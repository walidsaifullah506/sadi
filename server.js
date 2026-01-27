// ============================================
// LOCAL DEVELOPMENT SERVER
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
  '.txt': 'text/plain'
};

// Create server
const server = http.createServer((req, res) => {
  // Get file path
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('❌ Access Denied');
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Try to read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found - serve 404.html if exists, otherwise return 404 message
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>404 - Page Not Found</title>
            <style>
              body { font-family: monospace; background: #1a1a1a; color: #00ff88; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .container { text-align: center; }
              h1 { font-size: 48px; margin: 0; }
              p { font-size: 16px; margin: 10px 0; }
              a { color: #00ff88; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ 404</h1>
              <p>Page not found: ${req.url}</p>
              <p><a href="/">← Go to Home</a></p>
            </div>
          </body>
          </html>
        `);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('❌ Server Error: ' + err.message);
      }
    } else {
      // File found - serve it
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🚀 LOCAL SERVER STARTED                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`  📍 Server URL: http://${HOST}:${PORT}`);
  console.log(`  🌐 Open in browser: http://localhost:${PORT}`);
  console.log(`  🔗 Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`  ⏹️  Press Ctrl+C to stop server\n`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  ⚠️  IMPORTANT: Firebase Configuration                     ║');
  console.log('║  - Update jsfirebase.js with your Firebase credentials    ║');
  console.log('║  - Read FIREBASE_SETUP_GUIDE.md for instructions          ║');
  console.log('║  - Without Firebase, file uploads won\'t work             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.log(`\nSolutions:`);
    console.log(`  1. Close other applications using port ${PORT}`);
    console.log(`  2. Use a different port: Edit server.js and change PORT = 3000 to another number`);
    console.log(`  3. Kill the process using the port:\n`);
    console.log(`     For Windows: netstat -ano | findstr :${PORT}`);
    console.log(`     Then: taskkill /PID <PID> /F\n`);
  } else {
    console.error(`\n❌ Server Error:`, err);
  }
  process.exit(1);
});
