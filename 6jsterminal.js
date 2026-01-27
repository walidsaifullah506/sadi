// ============================================
// TERMINAL TYPING ANIMATION
// ============================================

class TypingAnimation {
  constructor() {
    this.textElement = document.getElementById('typing-text');
    this.text = 'Hi, I am Walid Saifullah';
    this.index = 0;
    this.speed = 50; // milliseconds per character
    this.init();
  }

  init() {
    if (this.textElement) {
      this.type();
    }
  }

  type() {
    if (this.index < this.text.length) {
      this.textElement.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    }
  }

  reset() {
    this.index = 0;
    this.textElement.textContent = '';
    this.type();
  }
}

// Initialize typing animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TypingAnimation();
  });
} else {
  new TypingAnimation();
}
