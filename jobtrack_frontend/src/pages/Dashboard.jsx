import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user,deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats/')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to fetch stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

const handleDeleteAccount = async () => {
  if (!window.confirm('Are you sure? This will permanently delete your account and all your data.')) return
  try {
    await deleteAccount()
    navigate('/login')
  } catch (err) {
    console.error('Failed to delete account', err)
  }
}

  if (loading) return <p>Loading...</p>

  return (
    <div className="dashboard-container">
      <h2>Welcome back, {user}</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total_applications}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.upcoming_interviews}</h3>
          <p>Upcoming Interviews</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending_tasks}</h3>
          <p>Pending Tasks</p>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>Applications by Status</h3>
        {Object.entries(stats.by_status).map(([status, count]) => (
          <div className="status-row" key={status}>
            <span className={`status-badge status-${status}`}>{status}</span>
            <span>{count}</span>
          </div>
        ))}
        {Object.keys(stats.by_status).length === 0 && <p>No applications yet.</p>}
      </div>
    </div>
  )
}

export default Dashboard