import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Calendar, DollarSign } from 'lucide-react'
import { studentsAPI } from '../services/api'
import toast from 'react-hot-toast'

const StudentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [payments, setPayments] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentDetails()
  }, [id])

  const fetchStudentDetails = async () => {
    try {
      const response = await studentsAPI.get(id)
      if (response.data.success) {
        setStudent(response.data.student)
        setPayments(response.data.payments || [])
        setLessons(response.data.lessons || [])
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      toast.error('Failed to load student details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  if (!student) {
    return (
      <div className="empty-state">
        <User size={80} />
        <h3>Student not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/students')}>
          Back to Students
        </button>
      </div>
    )
  }

  return (
    <div>
      <button 
        className="btn btn-outline btn-sm"
        onClick={() => navigate('/students')}
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={18} />
        Back to Students
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px',
            fontWeight: '700'
          }}>
            {student.first_name[0]}{student.last_name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
              {student.first_name} {student.last_name}
            </h1>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                <span>{student.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span>{student.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                <span>Enrolled: {student.enrollment_date}</span>
              </div>
            </div>
          </div>
          <span className={`badge badge-${student.status === 'active' ? 'success' : 'secondary'}`}>
            {student.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Course Progress</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {student.course_name || 'No course enrolled'}
          </p>
          {student.progress_percentage !== null && (
            <>
              <div style={{
                height: '12px',
                background: '#e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${student.progress_percentage}%`,
                  height: '100%',
                  background: '#10b981',
                  borderRadius: '6px'
                }}></div>
              </div>
              <p style={{ fontSize: '24px', fontWeight: '700' }}>
                {student.progress_percentage}% Complete
              </p>
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Payment Status</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Fees:</span>
            <span style={{ fontWeight: '600' }}>${student.total_fees || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Paid:</span>
            <span style={{ fontWeight: '600', color: '#10b981' }}>${student.total_paid || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: '600' }}>Balance Due:</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
              ${student.balance_due || 0}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Payments</h3>
          {payments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              No payments recorded
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {payments.map((payment) => (
                <div key={payment.payment_id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--light-bg)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ fontWeight: '500' }}>${payment.amount}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {payment.payment_date}
                    </p>
                  </div>
                  <span className="badge badge-success">{payment.payment_method}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Lessons</h3>
          {lessons.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              No lessons scheduled
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lessons.map((lesson) => (
                <div key={lesson.lesson_id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--light-bg)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ fontWeight: '500' }}>{lesson.instructor_name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {lesson.lesson_date} at {lesson.start_time}
                    </p>
                  </div>
                  <span className={`badge badge-${lesson.status === 'completed' ? 'success' : 'info'}`}>
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDetails
