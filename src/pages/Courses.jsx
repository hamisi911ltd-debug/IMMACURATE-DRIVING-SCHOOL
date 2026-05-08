import { useEffect, useState } from 'react'
import { BookOpen, Plus, Clock, DollarSign } from 'lucide-react'
import { coursesAPI } from '../services/api'
import toast from 'react-hot-toast'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.list()
      if (response.data.success) {
        setCourses(response.data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Courses
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your driving courses
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Course
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {courses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={80} />
            <h3>No courses available</h3>
            <p>Start by adding your first course</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.course_id} className="card">
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  {course.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {course.description}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Duration
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} />
                    {course.duration_weeks} weeks
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Total Fee
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={16} />
                    ${course.total_fee}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Theory Hours
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>
                    {course.theory_hours}h
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Practical Hours
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>
                    {course.practical_hours}h
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                  View Details
                </button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Enroll Student
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Courses
