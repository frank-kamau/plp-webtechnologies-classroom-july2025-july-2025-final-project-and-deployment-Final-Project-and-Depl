/* main.js
   - All interactive logic lives here
   - Comments show which assignment requirement each function satisfies
*/

/* ----------------------------
   Utility helpers
   ---------------------------- */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => Array.from((ctx || document).querySelectorAll(selector));

/* ----------------------------
   Header menu toggle (Part 3)
   - Demonstrates DOM manipulation, and toggling CSS classes to trigger display changes.
*/
function toggleMenu(btnId, navId) {
  const btn = document.getElementById(btnId);
  const nav = document.getElementById(navId);
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });
}

/* Activate menu toggles for each page's button (IDs are present on pages) */
document.addEventListener('DOMContentLoaded', () => {
  // Setup menu toggles (different IDs per page to keep pages independent)
  toggleMenu('menuToggle', 'primaryNav');
  toggleMenu('menuToggleAbout', 'primaryNavAbout');
  toggleMenu('menuToggleServices', 'primaryNavServices');
  toggleMenu('menuToggleContact', 'primaryNavContact');

  // Set current year in footer spans
  const year = new Date().getFullYear();
  ['year','yearAbout','yearServices','yearContact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  // Demo animation toggle: toggles CSS class that triggers transition/transform
  const demoToggle = $('#demoToggle');
  if (demoToggle) {
    demoToggle.addEventListener('click', () => {
      const box = $('#demoBox');
      if (!box) return;
      box.classList.toggle('animate');
    });
  }

  // Mini demo (example of a JS function with params and return):
  // calculateArea(width, height) demonstrates parameters and return values
  const calcBtn = $('#calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const w = $('#w').value;
      const h = $('#h').value;
      const area = calculateArea(w, h); // function defined below
      $('#areaResult').textContent = (area === null) ? 'Invalid input' : area;
    });
  }

  // Scope demo (increment global)
  const incGlobal = $('#incGlobal');
  if (incGlobal) incGlobal.addEventListener('click', () => {
    const val = incrementGlobal(1);
    const el = $('#globalCount');
    if (el) el.textContent = val;
  });
  const localDemoBtn = $('#localDemo');
  if (localDemoBtn) localDemoBtn.addEventListener('click', () => {
    const msg = localScopeDemo();
    $('#scopeMessage').textContent = msg;
  });

  /* Accordion (Services page) - toggles class to open panel (Part 3) */
  $$('.acc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      if (!item) return;
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  /* Contact form validation (Part 2 & Part 3)
     - validateForm returns true/false
     - uses DOM APIs to show feedback
  */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const ok = validateForm(contactForm);
      const feedback = $('#formFeedback');
      if (ok) {
        feedback.textContent = 'Thanks — your message was sent (demo).';
        feedback.style.color = 'green';
        contactForm.reset();
      } else {
        feedback.textContent = 'Please fix the highlighted errors and resubmit.';
        feedback.style.color = 'crimson';
      }
    });
  }

  // Small interactive demo button: toggles pulse on pulse-box if exists
  const pulseBtn = $('#pulseBtn');
  if (pulseBtn) pulseBtn.addEventListener('click', () => {
    const pulseBox = $('#pulseBox');
    if (!pulseBox) return;
    const active = pulseBox.classList.toggle('pulse-on');
    pulseBtn.textContent = active ? 'Stop Pulse' : 'Toggle Pulse';
  });

  // Open modal demo (example of JS creating DOM & returning element)
  const openModalBtn = $('#openModal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      const modal = createModal('<h3>Contact Modal</h3><p>This modal was created with createModal()</p>');
      document.body.appendChild(modal);
    });
  }

});

/* ----------------------------
   Part 2 JS functions: demonstrating scope, parameters, return values
   - calculateArea(width, height) -> returns numeric area or null
   - incrementGlobal(by) -> modifies and returns a global variable
   - localScopeDemo() -> returns a string demonstrating local scope
*/

/* Global variable for demo (shows global scope) */
let GLOBAL_COUNTER = 0;

/* calculateArea: parameters & return */
function calculateArea(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
  return w * h;
}

/* incrementGlobal: modifies global and returns new value */
function incrementGlobal(by = 1) {
  const n = Number(by) || 1;
  GLOBAL_COUNTER += n;
  return GLOBAL_COUNTER;
}

/* localScopeDemo: demonstrates a local-only value */
function localScopeDemo() {
  const message = 'This is a local variable returned by localScopeDemo()';
  return message;
}

/* ----------------------------
   validateForm(formElement)
   - Demonstrates validation logic (no HTML5-only reliance)
   - Returns true if valid; false otherwise
   - Highlights invalid fields by applying a style (simple approach)
*/
function validateForm(form) {
  // Get fields
  const name = form.querySelector('#fullname');
  const email = form.querySelector('#email');
  const subject = form.querySelector('#subject');
  const message = form.querySelector('#message');

  // Simple validators
  let ok = true;

  // reset previous styles
  [name, email, subject, message].forEach(f => { if (f) f.style.outline = 'none'; });

  // Name: at least 2 characters
  if (!name || name.value.trim().length < 2) {
    if (name) name.style.outline = '2px solid rgba(220,50,50,0.3)';
    ok = false;
  }

  // Email: simple regex
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!email || !emailRegex.test(email.value.trim())) {
    if (email) email.style.outline = '2px solid rgba(220,50,50,0.3)';
    ok = false;
  }

  // Subject: required
  if (!subject || subject.value.trim().length < 3) {
    if (subject) subject.style.outline = '2px solid rgba(220,50,50,0.3)';
    ok = false;
  }

  // Message: at least 10 chars
  if (!message || message.value.trim().length < 10) {
    if (message) message.style.outline = '2px solid rgba(220,50,50,0.3)';
    ok = false;
  }

  return ok;
}

/* ----------------------------
   Modal creation helper (Part 3)
   - createModal(htmlString) -> returns the backdrop element (not appended)
*/
function createModal(htmlString) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = htmlString;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
  });

  modal.appendChild(closeBtn);
  backdrop.appendChild(modal);
  return backdrop;
}
