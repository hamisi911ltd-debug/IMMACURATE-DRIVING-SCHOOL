import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import './Topbar.css'

const Topbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h2 className="page-title">Welcome back, {user?.name || 'User'}!</h2>
        </div>
        
        <div className="topbar-right">
          <button className="icon-btn">
            <Bell size={20} />
            <span className="badge-dot"></span>
          </button>
          
          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-role">{user?.role || 'Admin'}</span>
              </div>
              <ChevronDown size={16} />
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/settings')
                    setShowDropdown(false)
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
