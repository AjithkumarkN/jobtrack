import { useState, useEffect } from 'react'
import api from '../api/axios'
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [imgError, setImgError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/')
      setProfile(response.data)
      const isEmpty = !response.data.phone && !response.data.location && !response.data.professional_title
      setIsEditing(isEmpty)
    } catch (err) {
      console.error('Failed to fetch profile', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!profile.phone?.trim()) errors.phone = 'Phone number is required.'
    else if (!/^\+?\d{10,15}$/.test(profile.phone.trim())) errors.phone = 'Enter a valid phone number (10-15 digits).'
    if (!profile.location?.trim()) errors.location = 'Location is required.'
    if (!profile.professional_title?.trim()) errors.professional_title = 'Professional title is required.'
    if (!profile.experience?.trim()) errors.experience = 'Experience is required.'
    if (!profile.education?.trim()) errors.education = 'Education is required.'
    if (!profile.resume && !resumeFile) errors.resume = 'Resume is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!validateForm()) {
      setMessage('Please fix the errors below.')
      return
    }

    setSaving(true)
    const data = new FormData()
    data.append('phone', profile.phone || '')
    data.append('location', profile.location || '')
    data.append('professional_title', profile.professional_title || '')
    data.append('skills', profile.skills || '')
    data.append('experience', profile.experience || '')
    data.append('education', profile.education || '')
    data.append('linkedin_url', profile.linkedin_url || '')
    data.append('github_url', profile.github_url || '')
    data.append('portfolio_url', profile.portfolio_url || '')
    if (photoFile) data.append('profile_photo', photoFile)
    if (resumeFile) data.append('resume', resumeFile)

    try {
      await api.patch('/auth/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Profile saved successfully!')
      setPhotoFile(null)
      setPhotoPreview(null)
      setResumeFile(null)
      setFieldErrors({})
      await fetchProfile()
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile', err)
      const errorData = err.response?.data
      if (errorData) {
        const firstError = Object.values(errorData)[0]
        setMessage(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        setMessage('Failed to update profile.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('This will remove all your profile details (photo, resume, skills, etc). Continue?')) return
    try {
      await api.delete('/auth/profile/clear/')
      await fetchProfile()
      setMessage('Profile data cleared.')
    } catch (err) {
      console.error('Failed to clear profile', err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!profile) return <p>Could not load profile.</p>

  const currentPhotoUrl = photoPreview || profile.profile_photo || null
  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <p className="profile-subtext">UserName : {profile.username}<br/>Email-ID : {profile.email}</p>

      {!isEditing ? (
        <div className="profile-view-card">
          <div className="profile-view-header">
            {profile.profile_photo && !imgError ? (
              <img
                src={profile.profile_photo}
                alt=""
                className="profile-photo-preview"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="profile-photo-placeholder">{profile.username.charAt(0).toUpperCase()}</div>
            )}
            <div>
                <h3>{profile.professional_title}</h3>
                <p>{profile.location}</p>
                <p>Mobile No: {profile.phone}</p>
            </div>
          </div>

          <div className="profile-view-section">
            <h4>Skills</h4>
            <p>{profile.skills || '—'}</p>
          </div>
          <div className="profile-view-section">
            <h4>Experience</h4>
            <p>{profile.experience}</p>
          </div>
          <div className="profile-view-section">
            <h4>Education</h4>
            <p>{profile.education}</p>
          </div>
          <div className="profile-view-section">
            <h4>Links</h4>
            <div className="profile-links">
              {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
              {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>}
              {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>}
              {!profile.linkedin_url && !profile.github_url && !profile.portfolio_url && '—'}
            </div>
          </div>
          <div className="profile-view-section">
            <h4>Resume</h4>
            {profile.resume ? (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="resume-link">
                View resume
              </a>
            ) : '—'}
          </div>

          <div className="profile-view-actions">
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-photo-section">
            {currentPhotoUrl && !imgError ? (
              <img src={currentPhotoUrl} alt="" className="profile-photo-preview" onError={() => setImgError(true)} />
            ) : (
              <div className="profile-photo-placeholder">{profile.username.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <label>Profile Photo</label>
              <input type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} />
              <p className="file-hint">JPG or PNG, max 2MB. You can change this anytime.</p>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Phone Number <span className="required">*</span></label>
              <input name="phone" value={profile.phone || ''} onChange={handleChange} />
              {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label>Location <span className="required">*</span></label>
              <input name="location" value={profile.location || ''} onChange={handleChange} />
              {fieldErrors.location && <p className="field-error">{fieldErrors.location}</p>}
            </div>
            <div>
              <label>Professional Title <span className="required">*</span></label>
              <input name="professional_title" value={profile.professional_title || ''} onChange={handleChange} placeholder="e.g. Python Full Stack Developer" />
              {fieldErrors.professional_title && <p className="field-error">{fieldErrors.professional_title}</p>}
            </div>
            <div>
              <label>LinkedIn URL</label>
              <input name="linkedin_url" value={profile.linkedin_url || ''} onChange={handleChange} />
            </div>
            <div>
              <label>GitHub URL</label>
              <input name="github_url" value={profile.github_url || ''} onChange={handleChange} />
            </div>
            <div>
              <label>Portfolio URL</label>
              <input name="portfolio_url" value={profile.portfolio_url || ''} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label>Skills (comma-separated)</label>
            <textarea name="skills" value={profile.skills || ''} onChange={handleChange} placeholder="Python, Django, React, MySQL" />
          </div>

          <div>
            <label>Experience <span className="required">*</span></label>
            <textarea name="experience" value={profile.experience || ''} onChange={handleChange} />
            {fieldErrors.experience && <p className="field-error">{fieldErrors.experience}</p>}
          </div>

          <div>
            <label>Education <span className="required">*</span></label>
            <textarea name="education" value={profile.education || ''} onChange={handleChange} />
            {fieldErrors.education && <p className="field-error">{fieldErrors.education}</p>}
          </div>

          <div>
            <label>Resume <span className="required">*</span></label>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="resume-link">
                View current resume
              </a>
            )}
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
            <p className="file-hint">PDF, DOC, or DOCX, max 5MB</p>
            {fieldErrors.resume && <p className="field-error">{fieldErrors.resume}</p>}
          </div>

          {message && <p className="profile-message">{message}</p>}

          <div className="profile-form-actions">
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
            {profile.phone && (
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile