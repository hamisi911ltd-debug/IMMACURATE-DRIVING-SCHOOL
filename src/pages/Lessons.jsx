import { useEffect, useState } from 'react'
import { Calendar, Plus, Filter } from 'lucide-react'
import { lessonsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Lessons = () => {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await lessonsAPI.list()
      if (response.data.success) {
        setLessons(response.data.lessons)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
      toast.error('Failed to load lessons')
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
            Lessons
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Schedule and manage driving lessons
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Schedule Lesson
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={20} style={{ color: 'var(--text-secondary)' }} />
          <select className="form-control" style={{ maxWidth: '200px' }}>
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input 
            type="date" 
            className="form-control" 
            style={{ maxWidth: '200px' }}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Student</th>
              <th>Instructor</th>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  <Calendar size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No lessons scheduled</p>
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.lesson_id}>
                  <td>{lesson.lesson_date}</td>
                  <td>{lesson.start_time}</td>
                  <td style={{ fontWeight: '500' }}>{lesson.student_name}</td>
                  <td>{lesson.instructor_name}</td>
                  <td>{lesson.vehicle_registration}</td>
                  <td>
                    <span className="badge badge-info">
                      {lesson.lesson_type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${
                      lesson.status === 'completed' ? 'success' :
                      lesson.status === 'cancelled' ? 'danger' : 'warning'
                    }`}>
                      {lesson.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Lessons
