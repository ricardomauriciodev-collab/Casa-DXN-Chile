import { createContext, useContext, useState, useEffect } from 'react'
import { loginMock, logoutMock, getCurrentUser } from '../services/authService'
import { getUserById } from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = getCurrentUser()
    if (stored) setUser(stored)
  }, [])

  async function login(username, password) {
    const u = await loginMock(username, password)
    if (u) setUser(u)
    return !!u
  }

  function logout() {
    logoutMock()
    setUser(null)
  }

  async function refreshUser() {
    const current = getCurrentUser()
    if (!current) return
    try {
      const fresh = await getUserById(current.id)
      if (!fresh) return
      const { password: _, ...safeUser } = fresh
      sessionStorage.setItem('dxn_user', JSON.stringify(safeUser))
      setUser(safeUser)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
