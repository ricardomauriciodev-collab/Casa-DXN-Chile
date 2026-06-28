import { supabase } from '../config/supabaseClient'

const FIXED_USERS = [
  { id: '1', nombre_completo: 'Cliente Test', rut: '11.111.111-1', codigo_distribuidor: 'test', pais: 'Chile', numero_carnet: '11.111.111-1', direccion: 'Santiago, Chile', role: 'client', username: 'test', password: '123456' },
  { id: '2', nombre_completo: 'Admin DXN', rut: '22.222.222-2', codigo_distribuidor: 'admin', pais: 'Chile', numero_carnet: '22.222.222-2', direccion: 'Santiago, Chile', role: 'admin', username: 'admin', password: '123456' },
]

export async function loginMock(codigo, password) {
  const fixedUser = FIXED_USERS.find(u => (u.codigo_distribuidor === codigo || u.username === codigo) && u.password === password)
  if (fixedUser) {
    if (supabase) {
      const { data, error } = await supabase.from('users').select('*').or(`codigo_distribuidor.eq.${codigo},username.eq.${codigo}`).eq('password', password).maybeSingle()
      if (!error && data) {
        const { password: _, ...safeUser } = data
        sessionStorage.setItem('dxn_user', JSON.stringify(safeUser))
        return safeUser
      }
    }
    const { password: _, ...safeUser } = fixedUser
    sessionStorage.setItem('dxn_user', JSON.stringify(safeUser))
    return safeUser
  }

  if (supabase) {
    const { data, error } = await supabase.from('users').select('*').or(`codigo_distribuidor.eq.${codigo},username.eq.${codigo}`).eq('password', password).maybeSingle()
    if (error) throw error
    if (data) {
      const { password: _, ...safeUser } = data
      sessionStorage.setItem('dxn_user', JSON.stringify(safeUser))
      return safeUser
    }
  } else {
    const { getAllMockUsers } = await import('./userService')
    const allUsers = await getAllMockUsers()
    const user = allUsers.find(u => (u.codigo_distribuidor === codigo || u.username === codigo) && u.password === password)
    if (user) {
      const { password: _, ...safeUser } = user
      sessionStorage.setItem('dxn_user', JSON.stringify(safeUser))
      return safeUser
    }
  }

  return null
}

export function autoLoginFromRegister(userData) {
  sessionStorage.setItem('dxn_user', JSON.stringify(userData))
}

export function logoutMock() {
  sessionStorage.removeItem('dxn_user')
}

export function getCurrentUser() {
  const raw = sessionStorage.getItem('dxn_user')
  return raw ? JSON.parse(raw) : null
}
