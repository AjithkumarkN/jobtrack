import { useState, useEffect } from 'react'
import api from '../api/axios'
import './Interviews.css'

function Interviews() {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    application: '',
    interview_date: '',
    interview_type: 'Phone',
    interviewer_name: '',
    notes: '',
    status: 'Scheduled',
  })

  const fetchData = async () => {
    try {
      const [interviewRes, applicationRes] = await Promise.all([
        api.get('/interviews/'),
        api.get('/applications/'),
      ])
      setInterviews(interviewRes.data)
      setApplications(applicationRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/interviews/', formData)
      setFormData({ application: '', interview_date: '', interview_type: 'Phone', interviewer_name: '', notes: '', status: 'Scheduled' })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error('Failed to create interview', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return
    try {
      await api.delete(`/interviews/${id}/`)
      fetchData()
    } catch (err) {
      console.error('Failed to delete interview', err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="interviews-container">
      <div className="interviews-header">
        <h2>Interviews</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Schedule Interview'}
        </button>
      </div>

      {showForm && (
        <form className="interview-form" onSubmit={handleSubmit}>
          <select name="application" value={formData.application} onChange={handleChange} required>
            <option value="">Select application</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.job_title} at {app.company_name}
              </option>
            ))}
          </select>
          <input type="datetime-local" name="interview_date" value={formData.interview_date} onChange={handleChange} required />
          <select name="interview_type" value={formData.interview_type} onChange={handleChange}>
            <option value="Phone">Phone</option>
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Final">Final</option>
            <option value="Other">Other</option>
          </select>
          <input name="interviewer_name" placeholder="Interviewer name" value={formData.interviewer_name} onChange={handleChange} />
          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
          <button type="submit">Save Interview</button>
        </form>
      )}

      {interviews.length > 0 ? (
        <table className="interviews-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((iv) => (
              <tr key={iv.id}>
                <td>{applications.find((a) => a.id === iv.application)?.job_title || iv.application}</td>
                <td>{new Date(iv.interview_date).toLocaleString()}</td>
                <td><span className="type-badge">{iv.interview_type}</span></td>
                <td>{iv.status}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(iv.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">No interviews scheduled yet.</div>
      )}
    </div>
  )
}

export default Interviews