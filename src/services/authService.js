import { getAllMockUsers } from './userService'

const FIXED_USERS = [
  { id: '1', nombre_completo: 'Cliente Test', rut: '11.111.111-1', codigo_distribuidor: 'CLI-001', direccion: 'Santiago, Chile', role: 'client', username: 'test', password: '123456' },
  { id: '2', nombre_completo: 'Admin DXN', rut: '22.222.222-2', codigo_distribuidor: 'ADM-001', direccion: 'Santiago, Chile', role: 'admin', username: 'admin', password: '123456' },
]

export function loginMock(username, password) {
  const allUsers = [...FIXED_USERS, ...getAllMockUsers()]
  const user = allUsers.find(u => u.username === username && u.password === password)
  if (!user) return null
  const { password: _, ...safeUser } = user
  localStorage.setItem('dxn_user', JSON.stringify(safeUser))
  return safeUser
}

export function autoLoginFromRegister(userData) {
  localStorage.setItem('dxn_user', JSON.stringify(userData))
}

export function logoutMock() {
  localStorage.removeItem('dxn_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('dxn_user')
  return raw ? JSON.parse(raw) : null
}
