// ============================================
// COMPREHENSIVE API INTEGRATION
// All navigation sections fully functional
// ============================================

// ============================================
// STUDENTS API
// ============================================

async function loadStudentsList() {
  try {
    const response = await fetch('/api/students/list');
    const result = await response.json();
    
    if (result.success) {
      const tableBody = document.getElementById('studentsTable');
      if (!tableBody) return;
      
      if (result.students.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted);">
              <div style="font-size:40px;margin-bottom:12px;">📚</div>
              <div style="font-size:16px;font-weight:600;margin-bottom:6px;">No students registered yet</div>
              <div style="font-size:13px;">Click "Add Student" to register your first student</div>
            </td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = result.students.map(student => `
          <tr>
            <td data-label="Student">
              <div class="avatar-group">
                <div class="avatar">${student.first_name.charAt(0)}${student.last_name.charAt(0)}</div>
                <div>
                  <div style="font-weight:600;">${student.first_name} ${student.last_name}</div>
                  <div style="font-size:12px;color:var(--text-muted);">${student.email}</div>
                </div>
              </div>
            </td>
            <td data-label="Course">${student.course_name || 'Not enrolled'}</td>
            <td data-label="Progress">
              <div style="font-size:12px;font-weight:600;margin-bottom:4px;">${student.progress_percentage || 0}%</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${student.progress_percentage || 0}%"></div>
              </div>
            </td>
            <td data-label="Balance">KES ${(student.balance_due || 0).toLocaleString()}</td>
            <td data-label="Status">
              <span class="badge ${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                ${student.status || 'active'}
              </span>
            </td>
            <td data-label="Actions">
              <button class="btn btn-sm btn-outline" onclick="viewStudent('${student.student_id}')">View</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

async function viewStudent(studentId) {
  try {
    const response = await fetch(`/api/students/${studentId}`);
    const result = await response.json();
    
    if (result.success) {
      const student = result.student;
      
      // Create a modal to show student details
      const modal = document.createElement('div');
      modal.className = 'modal-overlay open';
      modal.innerHTML = `
        <div class="modal" style="max-width:700px;">
          <div class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</div>
          <div class="modal-title">Student Details</div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Name</div>
              <div style="font-weight:600;">${student.first_name} ${student.last_name}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Student ID</div>
              <div style="font-weight:600;font-size:12px;">${student.student_id}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Email</div>
              <div style="font-weight:600;">${student.email}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Phone</div>
              <div style="font-weight:600;">${student.phone}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Course</div>
              <div style="font-weight:600;">${student.course_name || 'Not enrolled'}</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Status</div>
              <div><span class="badge ${student.status === 'active' ? 'success' : 'warning'}">${student.status}</span></div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Progress</div>
              <div style="font-weight:600;">${student.progress_percentage || 0}%</div>
            </div>
            <div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Balance</div>
              <div style="font-weight:600;color:${(student.balance_due || 0) > 0 ? 'var(--danger)' : 'var(--success)'};">
                KES ${(student.balance_due || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          ${result.payments && result.payments.length > 0 ? `
            <div style="margin-top:20px;">
              <div style="font-weight:600;margin-bottom:12px;">Recent Payments</div>
              <div style="max-height:200px;overflow-y:auto;">
                ${result.payments.map(payment => `
                  <div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid var(--border);">
                    <div>
                      <div style="font-size:13px;font-weight:600;">KES ${payment.amount.toLocaleString()}</div>
                      <div style="font-size:11px;color:var(--text-muted);">${payment.payment_method} • ${payment.payment_date}</div>
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);">${payment.receipt_number || ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${result.lessons && result.lessons.length > 0 ? `
            <div style="margin-top:20px;">
              <div style="font-weight:600;margin-bottom:12px;">Recent Lessons</div>
              <div style="max-height:200px;overflow-y:auto;">
                ${result.lessons.map(lesson => `
                  <div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid var(--border);">
                    <div>
                      <div style="font-size:13px;font-weight:600;">${lesson.lesson_type}</div>
                      <div style="font-size:11px;color:var(--text-muted);">${lesson.instructor_name || 'N/A'} • ${lesson.registration_number || 'N/A'}</div>
                    </div>
                    <div>
                      <div style="font-size:11px;font-weight:600;">${lesson.lesson_date}</div>
                      <div style="font-size:11px;color:var(--text-muted);">${lesson.start_time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <div style="display:flex;gap:12px;margin-top:24px;">
            <button class="btn btn-accent" onclick="this.closest('.modal-overlay').remove()">Close</button>
            <button class="btn btn-outline" onclick="editStudent('${student.student_id}')">Edit Student</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    } else {
      alert('Error: ' + (result.error || 'Student not found'));
    }
  } catch (error) {
    console.error('Error viewing student:', error);
    alert('Error loading student details. Please try again.');
  }
}

// Edit student function (placeholder - can be enhanced)
function editStudent(studentId) {
  alert('Edit student functionality coming soon! Student ID: ' + studentId);
  // Close the view modal
  document.querySelector('.modal-overlay')?.remove();
}

// ============================================
// MESSAGES API
// ============================================

async function loadMessagesList() {
  try {
    const response = await fetch('/api/messages/list');
    const result = await response.json();
    
    if (result.success) {
      const chatList = document.querySelector('.chat-list');
      if (!chatList) return;
      
      if (result.messages.length === 0) {
        chatList.innerHTML = `
          <div style="text-align:center;padding:40px;color:var(--text-muted);">
            <div style="font-size:40px;margin-bottom:12px;">💬</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:6px;">No messages yet</div>
            <div style="font-size:13px;">Start a conversation with your students</div>
          </div>
        `;
      } else {
        chatList.innerHTML = result.messages.map((msg, index) => `
          <div class="chat-item ${index === 0 ? 'active' : ''}" onclick="selectMessage('${msg.message_id}')">
            ${msg.status === 'unread' ? '<div class="chat-unread"></div>' : ''}
            <div class="avatar">${msg.first_name ? msg.first_name.charAt(0) + msg.last_name.charAt(0) : 'ST'}</div>
            <div class="chat-meta">
              <div class="chat-name">${msg.first_name} ${msg.last_name}</div>
              <div class="chat-preview">${msg.message_text.substring(0, 50)}...</div>
            </div>
            <div class="chat-time">${formatMessageTime(msg.sent_at)}</div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

async function sendNewMessage(studentId, message, subject) {
  try {
    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: studentId,
        message: message,
        subject: subject
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification('Message sent successfully!', 'success');
      loadMessagesList();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Error sending message');
  }
}

async function sendBroadcastMessage(recipients, message, subject) {
  try {
    const response = await fetch('/api/messages/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipients: recipients,
        message: message,
        subject: subject
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Broadcast sent to ${result.count} students!`, 'success');
      closeModal('broadcastModal');
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error sending broadcast:', error);
    alert('Error sending broadcast');
  }
}

function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return date.toLocaleDateString();
}

// ============================================
// DASHBOARD API
// ============================================

async function loadDashboardStats() {
  try {
    const response = await fetch('/api/dashboard/stats');
    const result = await response.json();
    
    if (result.success) {
      const stats = result.stats;
      
      // Update stat cards
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards[0]) {
        const totalStudentsValue = statCards[0].querySelector('.stat-value');
        const totalStudentsTrend = statCards[0].querySelector('.stat-trend');
        if (totalStudentsValue) totalStudentsValue.textContent = stats.totalStudents || 0;
        if (totalStudentsTrend) {
          totalStudentsTrend.textContent = stats.totalStudents > 0 ? `${stats.activeStudents} active students` : 'Ready for new students';
        }
      }
      
      if (statCards[1]) {
        const activeCoursesValue = statCards[1].querySelector('.stat-value');
        if (activeCoursesValue) activeCoursesValue.textContent = stats.activeCourses || 6;
      }
      
      if (statCards[2]) {
        const revenueValue = statCards[2].querySelector('.stat-value');
        const revenueTrend = statCards[2].querySelector('.stat-trend');
        if (revenueValue) revenueValue.textContent = `KES ${(stats.monthlyRevenue || 0).toLocaleString()}`;
        if (revenueTrend) {
          revenueTrend.textContent = stats.monthlyRevenue > 0 ? `+${stats.revenueGrowth || 0}% from last month` : 'Ready to start';
        }
      }
      
      if (statCards[3]) {
        const pendingValue = statCards[3].querySelector('.stat-value');
        if (pendingValue) pendingValue.textContent = stats.pendingPayments || 0;
      }
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// ============================================
// COURSES API
// ============================================

async function loadCoursesList() {
  try {
    const response = await fetch('/api/courses/list');
    const result = await response.json();
    
    if (result.success) {
      // Update course dropdowns in forms
      const courseSelects = document.querySelectorAll('select[name="course"]');
      courseSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Course</option>' + 
          result.courses.map(course => 
            `<option value="${course.course_id}">${course.name} - KES ${course.total_fee.toLocaleString()}</option>`
          ).join('');
      });
      
      // Update courses grid if exists
      const coursesGrid = document.querySelector('.courses-grid');
      if (coursesGrid) {
        coursesGrid.innerHTML = result.courses.map(course => `
          <div class="course-card">
            <div class="course-banner" style="background:linear-gradient(135deg, var(--navy), var(--navy-mid));">
              🚗
            </div>
            <div class="course-body">
              <div class="course-title">${course.name}</div>
              <div class="course-desc">${course.description}</div>
              <div class="course-meta">
                <span>📚 ${course.total_lessons} lessons</span>
                <span>⏱️ ${course.duration_weeks} weeks</span>
              </div>
            </div>
            <div class="course-footer">
              <div class="course-price">KES ${course.total_fee.toLocaleString()}</div>
              <button class="btn btn-sm btn-accent">Enroll Student</button>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// ============================================
// LESSONS/SCHEDULE API
// ============================================

async function loadLessonsList() {
  try {
    const response = await fetch('/api/lessons/list');
    const result = await response.json();
    
    if (result.success) {
      const scheduleContainer = document.querySelector('.schedule-list');
      if (!scheduleContainer) return;
      
      if (result.lessons.length === 0) {
        scheduleContainer.innerHTML = `
          <div style="text-align:center;padding:40px;color:var(--text-muted);">
            <div style="font-size:40px;margin-bottom:12px;">📅</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:6px;">No lessons scheduled</div>
            <div style="font-size:13px;">Click "Schedule Lesson" to add a new lesson</div>
          </div>
        `;
      } else {
        scheduleContainer.innerHTML = result.lessons.map(lesson => `
          <div class="schedule-item">
            <div class="schedule-time">${lesson.start_time}</div>
            <div class="schedule-dot ${lesson.status === 'completed' ? 'green' : lesson.status === 'cancelled' ? 'red' : 'blue'}"></div>
            <div class="schedule-info">
              <div class="schedule-name">${lesson.student_name}</div>
              <div class="schedule-detail">
                ${lesson.lesson_type} • ${lesson.instructor_name} • ${lesson.vehicle_registration}
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading lessons:', error);
  }
}

// ============================================
// INSTRUCTORS & VEHICLES API
// ============================================

async function loadInstructorsList() {
  try {
    const response = await fetch('/api/instructors/list');
    const result = await response.json();
    
    if (result.success) {
      const instructorSelects = document.querySelectorAll('select[name="instructor"]');
      instructorSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Instructor</option>' + 
          result.instructors.map(instructor => 
            `<option value="${instructor.instructor_id}">${instructor.first_name} ${instructor.last_name}</option>`
          ).join('');
      });
    }
  } catch (error) {
    console.error('Error loading instructors:', error);
  }
}

async function loadVehiclesList() {
  try {
    const response = await fetch('/api/vehicles/list');
    const result = await response.json();
    
    if (result.success) {
      const vehicleSelects = document.querySelectorAll('select[name="vehicle"]');
      vehicleSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Vehicle</option>' + 
          result.vehicles.map(vehicle => 
            `<option value="${vehicle.vehicle_id}">${vehicle.registration_number} - ${vehicle.make} ${vehicle.model}</option>`
          ).join('');
      });
    }
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
}

// ============================================
// REPORTS API
// ============================================

async function generateReport(reportType) {
  try {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: reportType })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Report generated:', result.data);
      showNotification(`${reportType} report generated successfully!`, 'success');
      
      // Download as JSON for now (can be enhanced to PDF/Excel)
      const dataStr = JSON.stringify(result.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Error generating report');
  }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Load dashboard stats
  loadDashboardStats();
  
  // Load courses for dropdowns
  loadCoursesList();
  
  // Load instructors and vehicles for dropdowns
  loadInstructorsList();
  loadVehiclesList();
  
  // Load data based on current page
  const currentSection = document.querySelector('.section.active');
  if (currentSection) {
    const sectionId = currentSection.id;
    
    switch(sectionId) {
      case 'students':
        loadStudentsList();
        break;
      case 'communication':
        loadMessagesList();
        break;
      case 'schedule':
        loadLessonsList();
        break;
    }
  }
});

// ============================================
// NAVIGATION HANDLER
// ============================================

// Override navigate function to load data when switching sections
const originalNavigate = window.navigate;
window.navigate = function(sectionId, navItem) {
  if (typeof originalNavigate === 'function') {
    originalNavigate(sectionId, navItem);
  }
  
  // Load data based on section
  setTimeout(() => {
    switch(sectionId) {
      case 'dashboard':
        loadDashboardStats();
        break;
      case 'students':
        loadStudentsList();
        break;
      case 'communication':
        loadMessagesList();
        break;
      case 'schedule':
        loadLessonsList();
        break;
      case 'courses':
        loadCoursesList();
        break;
    }
  }, 100);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
