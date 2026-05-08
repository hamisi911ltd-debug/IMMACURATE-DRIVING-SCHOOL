import { useEffect, useState } from 'react'
import { Users, DollarSign, Calendar, BookOpen, TrendingUp, AlertCircle } from 'lucide-react'
import { dashboardAPI } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.stats()
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Active Students',
      value: stats?.activeStudents || 0,
      icon: TrendingUp,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: DollarSign,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingPayments || 0,
      icon: AlertCircle,
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      icon: BookOpen,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    {
      title: "Today's Lessons",
      value: stats?.todayLessons || 0,
      icon: Calendar,
      color: '#06b6d4',
      bgColor: '#cffafe'
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Welcome back! Here's what's happening with your driving school today.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {statCards.map((stat, index) => (
          <div key={index} className="card" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: stat.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <stat.icon size={28} style={{ color: stat.color }} />
            </div>
            <div>
              <p style={{ 
                fontSize: '13px', 
                color: 'var(--text-secondary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                {stat.title}
              </p>
              <h3 style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Users size={18} />
              Register New Student
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Calendar size={18} />
              Schedule Lesson
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <DollarSign size={18} />
              Record Payment
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Recent Activity
          </h3>
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 20px' }}>
            <Calendar size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
