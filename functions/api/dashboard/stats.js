// GET /api/dashboard/stats
// Get dashboard statistics

export async function onRequestGet(context) {
  try {
    // Get all stats in parallel
    const [
      studentsCount,
      coursesCount,
      monthlyRevenue,
      pendingPayments,
      recentEnrollments,
      todaysLessons
    ] = await Promise.all([
      // Total active students
      context.env.DB.prepare(
        'SELECT COUNT(*) as count FROM students WHERE status = "active"'
      ).first(),
      
      // Active courses
      context.env.DB.prepare(
        'SELECT COUNT(*) as count FROM courses WHERE status = "active"'
      ).first(),
      
      // Monthly revenue
      context.env.DB.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM payments 
        WHERE status = 'completed' 
        AND payment_date >= DATE('now', 'start of month')
      `).first(),
      
      // Pending payments count
      context.env.DB.prepare(`
        SELECT COUNT(*) as count 
        FROM student_balances 
        WHERE balance_due > 0
      `).first(),
      
      // Recent enrollments
      context.env.DB.prepare(`
        SELECT 
          s.first_name || ' ' || s.last_name as student_name,
          c.name as course_name,
          se.enrollment_date,
          se.status
        FROM student_enrollments se
        JOIN students s ON se.student_id = s.student_id
        JOIN courses c ON se.course_id = c.course_id
        ORDER BY se.enrollment_date DESC
        LIMIT 5
      `).all(),
      
      // Today's lessons
      context.env.DB.prepare(`
        SELECT 
          l.scheduled_time,
          l.lesson_type,
          l.status,
          s.first_name || ' ' || s.last_name as student_name,
          i.name as instructor_name,
          v.registration_number as vehicle_reg
        FROM lessons l
        JOIN students s ON l.student_id = s.student_id
        JOIN instructors i ON l.instructor_id = i.instructor_id
        LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
        WHERE l.scheduled_date = DATE('now')
        ORDER BY l.scheduled_time
        LIMIT 10
      `).all()
    ]);

    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalStudents: studentsCount.count || 0,
        activeCourses: coursesCount.count || 0,
        monthlyRevenue: monthlyRevenue.total || 0,
        pendingPayments: pendingPayments.count || 0,
        recentEnrollments: recentEnrollments.results || [],
        todaysLessons: todaysLessons.results || []
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
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