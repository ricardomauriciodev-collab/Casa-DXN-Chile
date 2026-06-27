import { createContext, useContext, useState, useEffect } from 'react'
import { loginMock, logoutMock, getCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = getCurrentUser()
    if (stored) setUser(stored)
  }, [])

  function login(username, password) {
    const u = loginMock(username, password)
    if (u) setUser(u)
    return !!u
  }

  function logout() {
    logoutMock()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
