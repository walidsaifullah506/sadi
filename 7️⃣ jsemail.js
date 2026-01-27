// ============================================
// EMAILJS INTEGRATION
// ============================================

// IMPORTANT: Replace these with your actual EmailJS credentials from emailjs.com
const EMAILJS_SERVICE_ID = 'service_xyz'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Replace with your public key

// Initialize EmailJS
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✓ EmailJS initialized');
  } else {
    console.warn('⚠ EmailJS not loaded');
  }
}

// Send email function
async function sendEmail() {
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  const submitBtn = document.getElementById('submit-btn');
  const responseDiv = document.getElementById('response-message');

  // Validation
  if (!name || !email || !message) {
    showMessage('❌ All fields are required!', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('❌ Please enter a valid email address!', 'error');
    return;
  }

  if (message.length < 10) {
    showMessage('❌ Message must be at least 10 characters long!', 'error');
    return;
  }

  // Disable button during sending
  submitBtn.disabled = true;
  submitBtn.textContent = 'sending...';

  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_PUBLIC_KEY === 'your_public_key') {
      // Demo mode - just show success message
      console.warn('⚠ Using demo mode - configure EmailJS credentials');
      await simulateEmailSend(name, email, message);
      showMessage('✓ Message received! (Demo mode) Admin will contact you soon.', 'success');
    } else {
      // Real EmailJS send
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message: message,
          to_email: 'your_email@gmail.com' // Replace with your admin email
        }
      );

      if (response.status === 200) {
        showMessage('✓ Message sent successfully! Admin will contact you soon.', 'success');
        // Clear form
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-message').value = '';
      }
    }
  } catch (error) {
    console.error('Email send error:', error);
    showMessage('❌ Failed to send message. Please try again later.', 'error');
  } finally {
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'submit --secure';
  }
}

// Simulate email send for demo (Firebase backup)
async function simulateEmailSend(name, email, message) {
  try {
    if (typeof db !== 'undefined') {
      // Save to Firebase if available
      await db.collection('contact_messages').add({
        name: name,
        email: email,
        message: message,
        timestamp: new Date(),
        ip_region: 'stored'
      });
      console.log('✓ Message saved to Firebase');
    }
  } catch (error) {
    console.log('Local storage of message');
    // Save to local storage as backup
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    messages.push({
      name: name,
      email: email,
      message: message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('contact_messages', JSON.stringify(messages));
  }
}

// Show message helper
function showMessage(message, type = 'success') {
  const responseDiv = document.getElementById('response-message');
  if (responseDiv) {
    responseDiv.textContent = message;
    responseDiv.className = `response-message show ${type}`;
    setTimeout(() => {
      responseDiv.classList.remove('show');
    }, 4000);
  }
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
  initEmailJS();
}
