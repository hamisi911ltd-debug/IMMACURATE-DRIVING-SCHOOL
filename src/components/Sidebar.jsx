import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  FileText,
  Settings,
  Car
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/lessons', icon: Calendar, label: 'Lessons' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Car className="logo-icon" size={32} />
        <h1 className="logo-text">Immacurate DSMS</h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <p className="version">Version 1.0.0</p>
      </div>
    </aside>
  )
}

export default Sidebar
