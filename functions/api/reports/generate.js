// POST /api/reports/generate
// Generate various reports

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const reportType = data.type;

    let reportData = {};

    switch (reportType) {
      case 'students':
        const { results: students } = await context.env.DB.prepare(`
          SELECT 
            s.student_id,
            s.first_name,
            s.last_name,
            s.email,
            s.phone,
            s.enrollment_date,
            s.status,
            c.name as course_name,
            se.progress_percentage,
            sb.balance_due
          FROM students s
          LEFT JOIN student_enrollments se ON s.student_id = se.student_id
          LEFT JOIN courses c ON se.course_id = c.course_id
          LEFT JOIN student_balances sb ON s.student_id = sb.student_id
          ORDER BY s.enrollment_date DESC
        `).all();
        reportData = { students, total: students.length };
        break;

      case 'revenue':
        const { results: payments } = await context.env.DB.prepare(`
          SELECT 
            DATE(payment_date) as date,
            SUM(amount) as total,
            COUNT(*) as count,
            payment_method
          FROM payments
          WHERE payment_date >= date('now', '-30 days')
          GROUP BY DATE(payment_date), payment_method
          ORDER BY date DESC
        `).all();
        
        const totalRevenue = await context.env.DB.prepare(`
          SELECT SUM(amount) as total FROM payments
          WHERE payment_date >= date('now', '-30 days')
        `).first();
        
        reportData = { payments, totalRevenue: totalRevenue.total || 0 };
        break;

      case 'attendance':
        const { results: lessons } = await context.env.DB.prepare(`
          SELECT 
            l.lesson_date,
            l.status,
            COUNT(*) as count,
            s.first_name || ' ' || s.last_name as student_name,
            i.first_name || ' ' || i.last_name as instructor_name
          FROM lessons l
          LEFT JOIN students s ON l.student_id = s.student_id
          LEFT JOIN instructors i ON l.instructor_id = i.instructor_id
          WHERE l.lesson_date >= date('now', '-30 days')
          GROUP BY l.lesson_date, l.status
          ORDER BY l.lesson_date DESC
        `).all();
        reportData = { lessons };
        break;

      case 'performance':
        const { results: performance } = await context.env.DB.prepare(`
          SELECT 
            s.student_id,
            s.first_name || ' ' || s.last_name as student_name,
            c.name as course_name,
            se.progress_percentage,
            se.lessons_completed,
            c.total_lessons,
            ROUND((se.lessons_completed * 100.0 / c.total_lessons), 2) as completion_rate
          FROM students s
          JOIN student_enrollments se ON s.student_id = se.student_id
          JOIN courses c ON se.course_id = c.course_id
          WHERE s.status = 'active'
          ORDER BY se.progress_percentage DESC
        `).all();
        reportData = { performance };
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid report type'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      reportType: reportType,
      data: reportData,
      generatedAt: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
