import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Mail, Lock, AlertCircle } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      
      if (response.data.success) {
        login(response.data.user, response.data.token)
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        setError(response.data.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'Invalid credentials')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <Car size={48} className="logo-icon" />
          </div>
          <h1>Immacurate DSMS</h1>
          <p>Driving School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={18} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="admin@immacurate.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2024 Immacurate Driving School. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
