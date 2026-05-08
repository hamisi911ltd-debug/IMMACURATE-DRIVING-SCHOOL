import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Search } from 'lucide-react'
import { studentsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Students = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.list()
      if (response.data.success) {
        setStudents(response.data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name} ${student.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Students
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your driving school students
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Student
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No students found</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td style={{ fontWeight: '500' }}>
                    {student.first_name} {student.last_name}
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course_name || 'N/A'}</td>
                  <td>
                    {student.progress_percentage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          background: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${student.progress_percentage}%`,
                            height: '100%',
                            background: '#10b981',
                            borderRadius: '4px'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {student.progress_percentage}%
                        </span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <span className={`badge badge-${student.status === 'active' ? 'success' : 'secondary'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => navigate(`/students/${student.student_id}`)}
                    >
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

export default Students
