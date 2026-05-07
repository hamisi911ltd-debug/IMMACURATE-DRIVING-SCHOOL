// Navigation - Static sidebar/topbar with section switching
function navigate(sectionId, navItem) {
  // Special handling for user management - check permissions
  if (sectionId === 'user-management') {
    const userType = localStorage.getItem('userType');
    if (userType !== 'system-admin') {
      alert('Access denied. Only system administrators can access user management.');
      return;
    }
  }
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (navItem) {
    navItem.classList.add('active');
  }
  
  // Update topbar title
  const titles = {
    'dashboard': 'Dashboard',
    'user-management': 'User Management',
    'students': 'Students',
    'courses': 'Courses', 
    'schedule': 'Schedule',
    'payments': 'Payments',
    'communication': 'Messages',
    'reports': 'Reports'
  };
  const titleElement = document.getElementById('topbarTitle');
  if (titleElement) {
    titleElement.textContent = titles[sectionId] || 'Dashboard';
  }
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Initialize page-specific functionality
  initializePageFunctionality(sectionId);
  
  // Close mobile sidebar
  closeSidebar();
}

// Initialize page-specific functionality
function initializePageFunctionality(sectionId) {
  switch(sectionId) {
    case 'user-management':
      if (typeof loadSystemUsers === 'function') {
        setTimeout(() => {
          loadSystemUsers();
        }, 100);
      }
      break;
    case 'students':
      if (typeof initializeStudentsPage === 'function') {
        initializeStudentsPage();
      }
      break;
    case 'payments':
      if (typeof initializePaymentsPage === 'function') {
        initializePaymentsPage();
      }
      break;
  }
}

// Mobile sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    
    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Enhanced mobile functionality
document.addEventListener('DOMContentLoaded', function() {
  // Close sidebar when clicking outside on mobile
  const overlay = document.getElementById('mobileOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar on window resize if screen becomes large
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
  
  // Handle swipe gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const sidebar = document.getElementById('sidebar');
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - close sidebar
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    }
    
    if (touchEndX > touchStartX + swipeThreshold && touchStartX < 50) {
      // Swipe right from left edge - open sidebar
      if (sidebar && !sidebar.classList.contains('open') && window.innerWidth <= 768) {
        toggleSidebar();
      }
    }
  }
  
  // Make tables more touch-friendly on mobile
  const tables = document.querySelectorAll('.data-table');
  tables.forEach(table => {
    if (window.innerWidth <= 768) {
      table.style.fontSize = '14px';
    }
  });
  
  // Auto-close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    const userDropdown = document.getElementById('topbarUserDropdown');
    const userCard = document.getElementById('topbarUserCard');
    
    if (userDropdown && userCard && !userCard.contains(e.target)) {
      userDropdown.classList.remove('open');
    }
  });
});

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Students filtering
function filterStudents(filter, btn) {
  // Update button states
  document.querySelectorAll('.students-filters .btn').forEach(b => {
    b.style.background = 'transparent';
    b.style.color = 'var(--text)';
    b.style.borderColor = 'var(--border)';
  });
  btn.style.background = 'var(--navy)';
  btn.style.color = 'var(--white)';
  btn.style.borderColor = 'var(--navy)';
  
  // Filter logic would go here
  console.log('Filtering students by:', filter);
}

// Chat functions
function selectChat(name, initials) {
  // Update active chat
  document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  // Update chat header
  document.getElementById('chatName').textContent = name;
  document.getElementById('chatAvatar').textContent = initials;
  
  // Load messages for this chat (mock data)
  const messages = {
    'Amina Kamau': [
      {type: 'recv', text: 'Hi! I wanted to confirm my practical lesson tomorrow at 8am.', time: '10:30'},
      {type: 'sent', text: 'Yes Amina, your lesson is confirmed! Instructor Peter Otieno will be with you at 8am. Vehicle KBZ 123A.', time: '10:35 ✓✓'},
      {type: 'recv', text: 'Thank you for the schedule!', time: '10:42'}
    ],
    'Brian Njoroge': [
      {type: 'recv', text: 'When is my next lesson?', time: '09:15'},
      {type: 'sent', text: 'Hi Brian! Your next lesson is scheduled for Friday at 10am with instructor Peter.', time: '09:20 ✓✓'}
    ],
    'Cynthia Muthoni': [
      {type: 'recv', text: 'I passed my mock test!', time: 'Yesterday'},
      {type: 'sent', text: 'Congratulations Cynthia! That\'s excellent news. Your official test is next week.', time: 'Yesterday ✓✓'}
    ],
    'Dennis Waweru': [
      {type: 'recv', text: 'About the payment...', time: 'Yesterday'},
      {type: 'sent', text: 'Hi Dennis, please let me know when you can make the payment. We can discuss a payment plan if needed.', time: 'Yesterday ✓✓'}
    ]
  };
  
  const messagesArea = document.getElementById('messagesArea');
  messagesArea.innerHTML = '';
  
  if (messages[name]) {
    messages[name].forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `msg ${msg.type}`;
      msgDiv.innerHTML = `
        <div class="msg-bubble">${msg.text}</div>
        <div class="msg-time">${msg.time}</div>
      `;
      messagesArea.appendChild(msgDiv);
    });
  }
  
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

function sendMsg() {
  const input = document.getElementById('msgInput');
  const message = input.value.trim();
  if (!message) return;
  
  const messagesArea = document.getElementById('messagesArea');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg sent';
  msgDiv.innerHTML = `
    <div class="msg-bubble">${message}</div>
    <div class="msg-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})} ✓✓</div>
  `;
  messagesArea.appendChild(msgDiv);
  messagesArea.scrollTop = messagesArea.scrollHeight;
  
  input.value = '';
}

function useTemplate(templateType) {
  const templates = {
    'lesson-reminder': 'Hi [Name], your lesson is scheduled for [Date] at [Time] with instructor [Instructor]. Please be on time!',
    'payment-due': 'Dear [Name], your payment of KES [Amount] is now due. Please make payment to continue your lessons.',
    'congratulations': 'Congratulations [Name] on passing your test! We\'re proud of your achievement.'
  };
  
  document.getElementById('msgInput').value = templates[templateType] || '';
}

// Form submissions
function addStudent(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const student = Object.fromEntries(formData);
  
  console.log('Adding student:', student);
  alert('Student added successfully!');
  closeModal('addStudentModal');
  event.target.reset();
}

function addCourse(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const course = Object.fromEntries(formData);
  
  console.log('Adding course:', course);
  alert('Course created successfully!');
  closeModal('addCourseModal');
  event.target.reset();
}

function scheduleLesson(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const lesson = Object.fromEntries(formData);
  
  console.log('Scheduling lesson:', lesson);
  alert('Lesson scheduled successfully!');
  closeModal('addLessonModal');
  event.target.reset();
}

function recordPayment(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payment = Object.fromEntries(formData);
  
  console.log('Recording payment:', payment);
  alert('Payment recorded successfully!');
  closeModal('recordPaymentModal');
  event.target.reset();
}

function sendBroadcast(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const broadcast = Object.fromEntries(formData);
  
  console.log('Sending broadcast:', broadcast);
  alert('Broadcast message sent successfully!');
  closeModal('broadcastModal');
  event.target.reset();
}

function sendNewMessage(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const message = Object.fromEntries(formData);
  
  console.log('Sending message:', message);
  alert('Message sent successfully!');
  closeModal('newMessageModal');
  event.target.reset();
}

function viewStudent(studentName) {
  alert(`Viewing details for ${studentName}`);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('open');
  }
});

// Initialize default date for lesson scheduling
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) input.value = today;
  });
});