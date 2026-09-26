import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('username') || null)

  const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)
    localStorage.setItem('username', username)
    setUser(username)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    setUser(null)
  }
  const deleteAccount = async () => {
  await api.delete('/auth/delete-account/')
  logout()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}