import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Navbar.css'

function Navbar() {
  const { user, logout, deleteAccount } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [imgError, setImgError] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile/')
        setProfile(response.data)
      } catch (err) {
        console.error('Failed to fetch profile for navbar', err)
      }
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all your data.')) return
    try {
      await deleteAccount()
      navigate('/login')
    } catch (err) {
      console.error('Failed to delete account', err)
    }
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/applications">Applications</Link>
      <Link to="/interviews">Interviews</Link>
      <Link to="/tasks">Tasks</Link>

      <div className="profile-container" ref={dropdownRef}>
        <button className="profile-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {profile?.profile_photo && !imgError ? (
            <img
              src={profile.profile_photo}
              alt=""
              className="avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            user.charAt(0).toUpperCase()
          )}
        </button>

        {dropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              {profile?.profile_photo && !imgError && (
                <img
                  src={profile.profile_photo}
                  alt=""
                  className="dropdown-avatar-img"
                  onError={() => setImgError(true)}
                />
              )}
              <p>{user}</p>
              <span>{profile?.professional_title || 'No title set'}</span>
              <span className="dropdown-email">{profile?.email}</span>
            </div>
            <Link to="/profile" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
              My Profile
            </Link>
            <button className="profile-dropdown-item" onClick={logout}>
              Logout
            </button>
            <button className="profile-dropdown-item danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar