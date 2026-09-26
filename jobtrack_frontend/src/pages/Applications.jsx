import { useState, useEffect } from 'react'
import api from '../api/axios'
import './Applications.css'

function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    status: 'Wishlist',
    location: '',
    job_link: '',
    notes: '',
  })

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/')
      setApplications(response.data)
    } catch (err) {
      console.error('Failed to fetch applications', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ company_name: '', job_title: '', status: 'Wishlist', location: '', job_link: '', notes: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.patch(`/applications/${editingId}/`, formData)
      } else {
        await api.post('/applications/', formData)
      }
      resetForm()
      fetchApplications()
    } catch (err) {
      console.error('Failed to save application', err)
    }
  }

  const handleEdit = (app) => {
    setFormData({
      company_name: app.company_name,
      job_title: app.job_title,
      status: app.status,
      location: app.location || '',
      job_link: app.job_link || '',
      notes: app.notes || '',
    })
    setEditingId(app.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await api.delete(`/applications/${id}/`)
      fetchApplications()
    } catch (err) {
      console.error('Failed to delete application', err)
    }
  }

  const handleResumeUpload = async (id, file) => {
    if (!file) return
    const formDataFile = new FormData()
    formDataFile.append('resume_file', file)
    try {
      await api.post(`/applications/${id}/upload_resume/`, formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      fetchApplications()
    } catch (err) {
      console.error('Failed to upload resume', err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2>My Applications</h2>
        <button className="btn-primary" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {showForm && (
        <form className="app-form" onSubmit={handleSubmit}>
          <input name="company_name" placeholder="Company name" value={formData.company_name} onChange={handleChange} required />
          <input name="job_title" placeholder="Job title" value={formData.job_title} onChange={handleChange} required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
          <input name="job_link" placeholder="Job link" value={formData.job_link} onChange={handleChange} />
          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update Application' : 'Save Application'}</button>
        </form>
      )}

      {applications.length > 0 ? (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Location</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company_name}</td>
                <td>{app.job_title}</td>
                <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                <td>{app.location || '—'}</td>
                <td>
                  {app.resume_file ? (
                    <a href={app.resume_file} target="_blank" rel="noreferrer">View</a>
                  ) : (
                    <input type="file" onChange={(e) => handleResumeUpload(app.id, e.target.files[0])} />
                  )}
                </td>
                <td>
                  <button className="btn-primary" onClick={() => handleEdit(app)}>Edit</button>{' '}
                  <button className="btn-delete" onClick={() => handleDelete(app.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">No applications yet. Add your first one above.</div>
      )}
    </div>
  )
}

export default Applications